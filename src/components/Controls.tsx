import styled from "styled-components";
import type { SortKey } from "../types/pet";

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr auto auto;
    align-items: center;
  }
`;

const Search = styled.input`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 0;
  border-radius: ${({ theme }) => theme.radiusPill};
  padding: 14px 22px;
  font-size: 14px;
  outline: none;
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.pressed};
  transition: box-shadow 200ms ease;

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus {
    box-shadow:
      ${({ theme }) => theme.shadows.pressed},
      0 0 0 3px ${({ theme }) => theme.colors.accentMuted};
  }
`;

const Select = styled.select`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 0;
  border-radius: ${({ theme }) => theme.radiusPill};
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.raisedSmall};
  transition: box-shadow 200ms ease;

  &:hover { box-shadow: ${({ theme }) => theme.shadows.raised}; }
`;

const Btn = styled.button<{ $variant?: "ghost" | "primary" }>`
  background: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.accent : theme.colors.surface};
  color: ${({ theme, $variant }) =>
    $variant === "primary" ? "white" : theme.colors.text};
  border: 0;
  border-radius: ${({ theme }) => theme.radiusPill};
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ theme, $variant }) =>
    $variant === "primary"
      ? "0 6px 16px rgba(255, 122, 107, 0.35)"
      : theme.shadows.raisedSmall};
  transition: box-shadow 200ms ease, transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme, $variant }) =>
      $variant === "primary"
        ? "0 10px 20px rgba(255, 122, 107, 0.4)"
        : theme.shadows.raised};
  }
`;

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  onSelectAll: () => void;
  onClear: () => void;
  totalShown: number;
  searchInputId?: string;
}

export function Controls({
  query,
  onQueryChange,
  sort,
  onSortChange,
  onSelectAll,
  onClear,
  totalShown,
  searchInputId,
}: Props) {
  return (
    <Row role="search">
      <Search
        id={searchInputId}
        type="search"
        placeholder={`Search ${totalShown} pets by name or description…`}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Search pets by name or description"
      />
      <Select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortKey)}
        aria-label="Sort pets"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="az">Name A–Z</option>
        <option value="za">Name Z–A</option>
      </Select>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn onClick={onSelectAll} $variant="primary">
          Select all visible
        </Btn>
        <Btn onClick={onClear}>Clear</Btn>
      </div>
    </Row>
  );
}
