import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Controls } from "../components/Controls";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { Lightbox } from "../components/Lightbox";
import { PetCard } from "../components/PetCard";
import { Spinner } from "../components/Spinner";
import { useSelection } from "../context/SelectionContext";
import { usePetsContext } from "../context/PetsContext";
import { useDebounce } from "../hooks/useDebounce";
import { useImageSizes } from "../hooks/useImageSizes";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import type { Pet, SortKey } from "../types/pet";

// Responsive grid: 1 column on mobile, 2 on tablet, 4 on desktop.
const Grid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

// Continuously slides the gradient across the letters, an aurora that keeps
// drifting through the title.
const flow = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// One-shot entrance: rise up and fade in on load.
const rise = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Hero = styled.header`
  margin-bottom: 28px;
  text-align: center;

  h1 {
    margin: 0 0 10px;
    font-size: clamp(36px, 6vw, 58px);
    line-height: 1.03;
    letter-spacing: -0.035em;
    font-weight: 800;
    text-wrap: balance;
    background: linear-gradient(
      110deg,
      #ff7a6b 0%,
      #ff8d80 22%,
      #8a8cf0 50%,
      #ff8d80 78%,
      #ff7a6b 100%
    );
    background-size: 220% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    /* Entrance (runs once, holds final state) + endless gradient drift. */
    animation: ${rise} 620ms cubic-bezier(0.2, 0.8, 0.2, 1) both,
      ${flow} 7s ease-in-out infinite;
  }
  p {
    margin: 0 auto;
    max-width: 480px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 17px;
    line-height: 1.55;
    letter-spacing: -0.01em;
    text-wrap: balance;
    animation: ${rise} 620ms cubic-bezier(0.2, 0.8, 0.2, 1) 130ms both;
  }
`;

const Sentinel = styled.div`
  height: 1px;
`;

const FooterNote = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  margin-top: 24px;
`;

const PAGE_SIZE = 8;
const VALID_SORTS: readonly SortKey[] = ["newest", "oldest", "az", "za"];

function readSort(value: string | null): SortKey {
  return (VALID_SORTS as readonly string[]).includes(value ?? "")
    ? (value as SortKey)
    : "newest";
}

function applyFilters(pets: Pet[], query: string, sort: SortKey): Pet[] {
  const q = query.trim().toLowerCase();
  // Filter by title or description (per the brief).
  const filtered = q
    ? pets.filter(
        (p) =>
          p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      )
    : pets;

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      case "newest": {
        // The API returns an identical `created` timestamp for every pet, so
        // date diff is effectively always 0. Fall back to the original API
        // order (newest = order the API returned them in) so the mode is
        // deterministic and visibly differs from the alphabetical sorts.
        const diff = b.createdAt.getTime() - a.createdAt.getTime();
        return diff !== 0 ? diff : a.order - b.order;
      }
      case "oldest": {
        const diff = a.createdAt.getTime() - b.createdAt.getTime();
        return diff !== 0 ? diff : b.order - a.order;
      }
    }
  });
  return sorted;
}

export function GalleryPage() {
  const { pets, status, error, isEmpty, refetch } = usePetsContext();
  const { selectMany, clear, toggle } = useSelection();

  // URL is the source of truth for query / sort / page so the view is
  // bookmarkable and shareable. Local typing state keeps the input snappy.
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlSort = readSort(searchParams.get("sort"));
  const urlPage = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const [query, setQuery] = useState(urlQuery);
  const debouncedQuery = useDebounce(query, 180);

  // Push debounced query back into the URL.
  const syncParam = useCallback(
    (key: string, value: string, fallback: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!value || value === fallback) next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    syncParam("q", debouncedQuery, "");
  }, [debouncedQuery, syncParam]);

  const filtered = useMemo(
    () => applyFilters(pets, debouncedQuery, urlSort),
    [pets, debouncedQuery, urlSort],
  );

  const visible = useMemo(
    () => filtered.slice(0, urlPage * PAGE_SIZE),
    [filtered, urlPage],
  );
  const hasMore = visible.length < filtered.length;

  const bumpPage = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const current = Math.max(
          1,
          Number.parseInt(next.get("page") ?? "1", 10) || 1,
        );
        next.set("page", String(current + 1));
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const sentinelRef = useInfiniteScroll(bumpPage, hasMore && status === "success");

  const visibleUrls = useMemo(() => visible.map((p) => p.url), [visible]);
  const sizes = useImageSizes(visibleUrls);

  const [focusIndex, setFocusIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleSort = (s: SortKey) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (s === "newest") next.delete("sort");
        else next.set("sort", s);
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  };

  const handleQueryChange = (v: string) => {
    setQuery(v);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("page");
        return next;
      },
      { replace: true },
    );
  };

  useKeyboardShortcuts({
    enabled: status === "success",
    onFocusSearch: () =>
      (document.getElementById("gallery-search") as HTMLInputElement | null)?.focus(),
    onClearAll: () => {
      if (query) handleQueryChange("");
      else clear();
    },
    onSelectAllVisible: () => selectMany(filtered.map((p) => p.id)),
    onMoveFocus: (delta) => {
      setFocusIndex((i) => Math.max(0, Math.min(visible.length - 1, i + delta)));
    },
    onToggleFocused: () => {
      const pet = visible[focusIndex];
      if (pet) toggle(pet.id);
    },
    columnCount: () => {
      if (typeof window === "undefined") return 1;
      if (window.matchMedia("(min-width: 1024px)").matches) return 4;
      if (window.matchMedia("(min-width: 640px)").matches) return 2;
      return 1;
    },
  });

  if (status === "loading") return <Spinner label="Fetching pets" />;
  if (status === "error") return <ErrorState message={error ?? "Unknown"} onRetry={refetch} />;
  if (isEmpty) return <EmptyState title="No pets returned" message="The API came back empty." />;

  return (
    <>
      <Hero>
        <h1>Pet Folio</h1>
        <p>Find your favorites. Take them home.</p>
      </Hero>
      <Controls
        query={query}
        onQueryChange={handleQueryChange}
        sort={urlSort}
        onSortChange={handleSort}
        onSelectAll={() => selectMany(filtered.map((p) => p.id))}
        onClear={clear}
        totalShown={filtered.length}
        searchInputId="gallery-search"
      />

      {visible.length === 0 ? (
        <EmptyState title="No matches" message={`Nothing matches "${debouncedQuery}".`} />
      ) : (
        <Grid role="list">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((pet, index) => {
              // Stagger only within each PAGE_SIZE batch so paginated-in
              // cards still cascade, but the cascade resets per batch
              // instead of growing unbounded.
              const staggerDelay = (index % PAGE_SIZE) * 0.025;
              return (
                <motion.div
                  key={pet.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.22, delay: staggerDelay },
                    y: { type: "spring", stiffness: 320, damping: 26, delay: staggerDelay },
                  }}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <PetCard
                    pet={pet}
                    sizeBytes={sizes[pet.url]}
                    focused={index === focusIndex}
                    onFocus={() => setFocusIndex(index)}
                    onOpenLightbox={() => setLightboxIndex(index)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Grid>
      )}

      <Sentinel ref={sentinelRef} aria-hidden="true" />
      {!hasMore && visible.length > 0 && (
        <FooterNote>That's all {filtered.length} pets.</FooterNote>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          // Full filtered set (not just the loaded `visible` slice) so the
          // counter reads "of 21" and arrows cycle through every match.
          // `visible` is a prefix of `filtered`, so the clicked index aligns.
          pets={filtered}
          index={lightboxIndex}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
