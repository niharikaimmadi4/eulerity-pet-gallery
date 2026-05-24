import { useMemo, useState } from "react";
import styled from "styled-components";
import { Controls } from "../components/Controls";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { PetCard } from "../components/PetCard";
import { Spinner } from "../components/Spinner";
import { useSelection } from "../context/SelectionContext";
import { usePetsContext } from "../context/PetsContext";
import { useDebounce } from "../hooks/useDebounce";
import { useImageSizes } from "../hooks/useImageSizes";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
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
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "oldest":
        return a.createdAt.getTime() - b.createdAt.getTime();
    }
  });
  return sorted;
}

export function GalleryPage() {
  const { pets, status, error, isEmpty, refetch } = usePetsContext();
  const { selectMany, clear } = useSelection();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [pageCount, setPageCount] = useState(1);

  const debouncedQuery = useDebounce(query, 180);

  const filtered = useMemo(
    () => applyFilters(pets, debouncedQuery, sort),
    [pets, debouncedQuery, sort],
  );

  const visible = filtered.slice(0, pageCount * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const sentinelRef = useInfiniteScroll(
    () => setPageCount((p) => p + 1),
    hasMore && status === "success",
  );

  const visibleUrls = useMemo(() => visible.map((p) => p.url), [visible]);
  const sizes = useImageSizes(visibleUrls);

  if (status === "loading") return <Spinner label="Fetching pets…" />;
  if (status === "error") return <ErrorState message={error ?? "Unknown"} onRetry={refetch} />;
  if (isEmpty) return <EmptyState title="No pets returned" message="The API came back empty." />;

  return (
    <>
      <Controls
        query={query}
        onQueryChange={(v) => {
          setQuery(v);
          setPageCount(1);
        }}
        sort={sort}
        onSortChange={(s) => {
          setSort(s);
          setPageCount(1);
        }}
        onSelectAll={() => selectMany(visible.map((p) => p.id))}
        onClear={clear}
        totalShown={filtered.length}
      />

      {visible.length === 0 ? (
        <EmptyState title="No matches" message={`Nothing matches "${debouncedQuery}".`} />
      ) : (
        <Grid>
          {visible.map((pet) => (
            <PetCard key={pet.id} pet={pet} sizeBytes={sizes[pet.url]} />
          ))}
        </Grid>
      )}

      <Sentinel ref={sentinelRef} />
      {!hasMore && visible.length > 0 && (
        <FooterNote>That's all {filtered.length} pets.</FooterNote>
      )}
    </>
  );
}
