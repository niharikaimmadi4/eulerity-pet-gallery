import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useFavorites } from "../context/FavoritesContext";
import { useSelection } from "../context/SelectionContext";

const Bar = styled.header<{ $scrolled: boolean }>`
  position: sticky;
  top: 0;
  z-index: 20;
  isolation: isolate;

  /* The frosted background lives on a pseudo-element so its bottom edge can be
     faded out with a mask: the frost dissolves into the page instead of ending
     on a hard line, while the logo and links (in .nav-inner above it) stay
     fully crisp. It also fades in smoothly on scroll. At the very top it's
     fully transparent, so the bar blends into the gradient with no seam. */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    background: ${({ theme }) => theme.glass.bgStrong};
    backdrop-filter: blur(22px) saturate(160%);
    -webkit-backdrop-filter: blur(22px) saturate(160%);
    -webkit-mask-image: linear-gradient(to bottom, #000 62%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 62%, transparent 100%);
    opacity: ${({ $scrolled }) => ($scrolled ? 1 : 0)};
    transition: opacity 300ms ease;
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
  z-index: 1;

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
  gap: 12px;
  letter-spacing: -0.01em;
  white-space: nowrap;
  flex-shrink: 0;

  .mark {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: ${({ theme }) => theme.glass.bgStrong};
    border: 1px solid ${({ theme }) => theme.glass.border};
    box-shadow: ${({ theme }) => theme.glass.sheen}, 0 6px 16px rgba(255, 122, 107, 0.18);
    display: grid;
    place-items: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .mark svg {
    width: 22px;
    height: 22px;
    color: ${({ theme }) => theme.colors.accent};
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
  color: white;
  font-size: 12px;
  font-weight: 700;
`;

export function Navbar() {
  const { count } = useSelection();
  const { count: favCount } = useFavorites();

  // Frost the bar once the page has scrolled past the hero so the links stay
  // legible over photos; stay transparent at the very top to avoid a seam.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Bar $scrolled={scrolled}>
      <Inner>
        <Brand to="/" aria-label="Pet Folio home">
          <span className="mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <ellipse cx="5.5" cy="11" rx="2" ry="2.6" />
              <ellipse cx="10" cy="7.3" rx="2" ry="2.8" />
              <ellipse cx="14" cy="7.3" rx="2" ry="2.8" />
              <ellipse cx="18.5" cy="11" rx="2" ry="2.6" />
              <path d="M12 12c-2.6 0-4.8 1.8-5.6 3.9-.5 1.3.5 2.6 1.9 2.6.9 0 1.7-.4 2.5-.7.8-.3 1.6-.3 2.4 0 .8.3 1.6.7 2.5.7 1.4 0 2.4-1.3 1.9-2.6C16.8 13.8 14.6 12 12 12z" />
            </svg>
          </span>
          Pet Folio
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
