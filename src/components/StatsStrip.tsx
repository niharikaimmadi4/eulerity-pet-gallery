import styled from "styled-components";
import { formatBytes } from "../utils/format";

const Wrap = styled.section`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 20px 22px;
  margin-bottom: 22px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  /* Soft brand gradient bleed to echo Eulerity's visual identity. */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.gradients.surface};
    pointer-events: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
`;

const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 22px;
  letter-spacing: -0.015em;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  line-height: 1.5;
`;

const Stats = styled.dl`
  position: relative;
  z-index: 1;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Label = styled.dt`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Value = styled.dd`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Accent = styled(Value)`
  background: ${({ theme }) => theme.gradients.brand};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

interface Props {
  totalCount: number;
  visibleCount: number;
  selectedCount: number;
  totalBytes: number;
  hasFilter: boolean;
}

export function StatsStrip({
  totalCount,
  visibleCount,
  selectedCount,
  totalBytes,
  hasFilter,
}: Props) {
  return (
    <Wrap aria-label="Gallery summary">
      <div>
        <Title>Pet asset library</Title>
        <Subtitle>
          {hasFilter
            ? `Showing ${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()} assets after filters.`
            : `${totalCount.toLocaleString()} assets ready to browse, select, and export.`}
        </Subtitle>
      </div>
      <Stats>
        <Stat>
          <Label>Total</Label>
          <Value>{totalCount.toLocaleString()}</Value>
        </Stat>
        <Stat>
          <Label>Visible</Label>
          <Value>{visibleCount.toLocaleString()}</Value>
        </Stat>
        <Stat>
          <Label>Selected</Label>
          <Accent>{selectedCount.toLocaleString()}</Accent>
        </Stat>
        <Stat>
          <Label>Est. size</Label>
          <Value>{formatBytes(totalBytes)}</Value>
        </Stat>
      </Stats>
    </Wrap>
  );
}
