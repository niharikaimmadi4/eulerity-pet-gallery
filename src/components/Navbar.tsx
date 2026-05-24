import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useSelection } from "../context/SelectionContext";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: rgba(15, 17, 21, 0.78);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Brand = styled(NavLink)`
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`;

const Links = styled.nav`
  display: flex;
  gap: 18px;
  margin-left: auto;
`;

const Link = styled(NavLink)`
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
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
  return (
    <Bar>
      <Inner>
        <Brand to="/" aria-label="Pet Gallery home">
          🐾 Pet Gallery
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
          <Link to="/about">About</Link>
        </Links>
      </Inner>
    </Bar>
  );
}
