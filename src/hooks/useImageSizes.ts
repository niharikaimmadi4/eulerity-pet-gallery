import { useEffect, useState } from "react";

type SizeMap = Record<string, number | null>;

const cache: SizeMap = {};

async function headSize(url: string, signal: AbortSignal): Promise<number | null> {
  if (cache[url] !== undefined) return cache[url];
  try {
    const res = await fetch(url, { method: "HEAD", signal });
    const len = res.headers.get("content-length");
    const parsed = len ? Number.parseInt(len, 10) : NaN;
    const value = Number.isFinite(parsed) ? parsed : null;
    cache[url] = value;
    return value;
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
    if (missing.length === 0) return;

    let cancelled = false;
    Promise.all(missing.map((url) => headSize(url, controller.signal))).then(() => {
      if (cancelled) return;
      setSizes(() => {
        const next: SizeMap = {};
        for (const u of urls) next[u] = cache[u] ?? null;
        return next;
      });
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [urls]);

  return sizes;
}
