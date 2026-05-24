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

const inputStyles = `
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease;
`;

const Search = styled.input`
  ${inputStyles}
  --surface: ${({ theme }) => theme.colors.surface};
  --border: ${({ theme }) => theme.colors.border};
  --text: ${({ theme }) => theme.colors.text};
  width: 100%;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(110, 168, 255, 0.18);
  }
`;

const Select = styled.select`
  ${inputStyles}
  --surface: ${({ theme }) => theme.colors.surface};
  --border: ${({ theme }) => theme.colors.border};
  --text: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const Btn = styled.button<{ $variant?: "ghost" | "primary" }>`
  ${inputStyles}
  --surface: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.accent : theme.colors.surface};
  --border: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.accent : theme.colors.border};
  --text: ${({ theme, $variant }) =>
    $variant === "primary" ? "#0b0e14" : theme.colors.text};
  cursor: pointer;
  font-weight: 600;
  &:hover { filter: brightness(1.08); }
`;

interface Props {
  query: string;
  onQueryChange: (v: string) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  onSelectAll: () => void;
  onClear: () => void;
  totalShown: number;
}

export function Controls({
  query,
  onQueryChange,
  sort,
  onSortChange,
  onSelectAll,
  onClear,
  totalShown,
}: Props) {
  return (
    <Row>
      <Search
        placeholder={`Search ${totalShown} pets by name or description…`}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Search pets"
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
