import styled from "styled-components";
import { useCountUp } from "../hooks/useCountUp";
import { formatBytes } from "../utils/format";

const Wrap = styled.section`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadows.raised};
  padding: 24px 26px;
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
`;

const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
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
  // Smoothly animate each number to its new value when filters or selection change.
  const animatedTotal = useCountUp(totalCount);
  const animatedVisible = useCountUp(visibleCount);
  const animatedSelected = useCountUp(selectedCount);
  const animatedBytes = useCountUp(totalBytes);

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
          <Value>{animatedTotal.toLocaleString()}</Value>
        </Stat>
        <Stat>
          <Label>Visible</Label>
          <Value>{animatedVisible.toLocaleString()}</Value>
        </Stat>
        <Stat>
          <Label>Selected</Label>
          <Accent>{animatedSelected.toLocaleString()}</Accent>
        </Stat>
        <Stat>
          <Label>Est. size</Label>
          <Value>{formatBytes(animatedBytes)}</Value>
        </Stat>
      </Stats>
    </Wrap>
  );
}
