import { useEffect, useState } from "react";

type SizeMap = Record<string, number | null>;

const cache: SizeMap = {};

/**
 * Measure the byte-size of an image by GET-ing it as a blob and reading
 * `blob.size`. We tried HEAD + Content-Length first, but the Pexels CDN
 * doesn't include Content-Length in `Access-Control-Expose-Headers`, so
 * the browser refused to surface it cross-origin. Falling back to a full
 * GET is wasteful in principle but cheap in practice because the same
 * URL is already loaded by the <img> tag, so the second request is
 * served from the browser's HTTP cache.
 */
async function measureSize(url: string, signal: AbortSignal): Promise<number | null> {
  if (cache[url] !== undefined) return cache[url];
  try {
    const res = await fetch(url, { signal, mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const size = blob.size > 0 ? blob.size : null;
    cache[url] = size;
    return size;
  } catch (err) {
    // Don't poison the cache on abort. The request was cancelled because
    // the URL list changed (e.g. user scrolled); the next effect run should
    // retry, not inherit a null result from an aborted attempt.
    if (err instanceof DOMException && err.name === "AbortError") {
      return null;
    }
    cache[url] = null;
    return null;
  }
}

export function useImageSizes(urls: string[]): SizeMap {
  const [sizes, setSizes] = useState<SizeMap>(() => {
    const initial: SizeMap = {};
    for (const url of urls) {
      if (cache[url] !== undefined) initial[url] = cache[url];
    }
    return initial;
  });

  useEffect(() => {
    const controller = new AbortController();
    const missing = urls.filter((u) => cache[u] === undefined);
    if (missing.length === 0) {
      // Even when nothing is missing, sync local state to the cache in case
      // background fetches resolved while this consumer was mounted.
      setSizes(() => {
        const next: SizeMap = {};
        for (const u of urls) next[u] = cache[u] ?? null;
        return next;
      });
      return;
    }

    let cancelled = false;
    // Resolve each request individually so partial results update the UI
    // as they arrive rather than waiting on the slowest fetch.
    missing.forEach((url) => {
      void measureSize(url, controller.signal).then((value) => {
        if (cancelled) return;
        setSizes((prev) => {
          if (prev[url] === value) return prev;
          return { ...prev, [url]: value };
        });
      });
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [urls]);

  return sizes;
}
