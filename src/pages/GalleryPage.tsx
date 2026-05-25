import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { Controls } from "../components/Controls";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { HeroFeatured } from "../components/HeroFeatured";
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
        // Tiebreaker: when timestamps tie (the API gives every pet the same
        // created date), fall back to A-Z so the ordering is deterministic
        // and visibly differs from "oldest first".
        const diff = b.createdAt.getTime() - a.createdAt.getTime();
        return diff !== 0 ? diff : a.title.localeCompare(b.title);
      }
      case "oldest": {
        const diff = a.createdAt.getTime() - b.createdAt.getTime();
        return diff !== 0 ? diff : b.title.localeCompare(a.title);
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

  const visible = filtered.slice(0, urlPage * PAGE_SIZE);
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
    onSelectAllVisible: () => selectMany(visible.map((p) => p.id)),
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
      <Controls
        query={query}
        onQueryChange={handleQueryChange}
        sort={urlSort}
        onSortChange={handleSort}
        onSelectAll={() => selectMany(visible.map((p) => p.id))}
        onClear={clear}
        totalShown={filtered.length}
        searchInputId="gallery-search"
      />

      {visible.length === 0 ? (
        <EmptyState title="No matches" message={`Nothing matches "${debouncedQuery}".`} />
      ) : (
        <>
          {/* Hero shows the first visible pet; rest flow into the uniform
              grid below so card sizing stays consistent. */}
          {visible[0] && (
            <HeroFeatured
              pet={visible[0]}
              sizeBytes={sizes[visible[0].url]}
              onOpenLightbox={() => setLightboxIndex(0)}
            />
          )}
          <Grid role="list">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.slice(1).map((pet, sliceIndex) => {
                const index = sliceIndex + 1;
                // Stagger only within each PAGE_SIZE batch so paginated-in
                // cards still cascade, but the cascade resets per batch
                // instead of growing unbounded.
                const staggerDelay = (sliceIndex % PAGE_SIZE) * 0.025;
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
        </>
      )}

      <Sentinel ref={sentinelRef} aria-hidden="true" />
      {!hasMore && visible.length > 0 && (
        <FooterNote>That's all {filtered.length} pets.</FooterNote>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          pets={visible}
          index={lightboxIndex}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
