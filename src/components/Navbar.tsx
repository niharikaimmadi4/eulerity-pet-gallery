import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useFavorites } from "../context/FavoritesContext";
import { useSelection } from "../context/SelectionContext";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: rgba(10, 13, 20, 0.78);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  /* Subtle gradient bleed for visual depth without a hard band. */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.gradients.surface};
    pointer-events: none;
  }
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px 16px;
    gap: 10px;
  }
`;

const Brand = styled(NavLink)`
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.01em;
  white-space: nowrap;
  flex-shrink: 0;

  .mark {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: ${({ theme }) => theme.gradients.brand};
    display: grid;
    place-items: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`;

const Links = styled.nav`
  display: flex;
  gap: 18px;
  margin-left: auto;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    margin-left: 0;
    justify-content: space-between;
    gap: 6px;
    font-size: 14px;
  }
`;

const Link = styled(NavLink)`
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  &.active { color: ${({ theme }) => theme.colors.accent}; }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  color: #0b0e14;
  font-size: 12px;
  font-weight: 700;
`;

export function Navbar() {
  const { count } = useSelection();
  const { count: favCount } = useFavorites();
  return (
    <Bar>
      <Inner>
        <Brand to="/" aria-label="Pet Gallery home">
          <span className="mark" aria-hidden="true">🐾</span>
          Pet Gallery
        </Brand>
        <Links aria-label="Primary">
          <Link to="/" end>
            Gallery
          </Link>
          <Link to="/selected">
            Selected{" "}
            {count > 0 && (
              <Badge aria-label={`${count} pets selected`}>{count}</Badge>
            )}
          </Link>
          <Link to="/favorites">
            Favorites{" "}
            {favCount > 0 && (
              <Badge aria-label={`${favCount} favorites`}>{favCount}</Badge>
            )}
          </Link>
          <Link to="/about">About</Link>
        </Links>
      </Inner>
    </Bar>
  );
}
