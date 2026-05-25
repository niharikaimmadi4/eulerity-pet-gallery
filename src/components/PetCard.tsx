import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import type { Pet } from "../types/pet";
import { useFavorites } from "../context/FavoritesContext";
import { useSelection } from "../context/SelectionContext";
import { formatBytes, formatDate } from "../utils/format";

const Card = styled.article<{ $selected: boolean; $focused: boolean }>`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 220ms ease, box-shadow 280ms ease;
  box-shadow: ${({ $selected, $focused, theme }) =>
    $focused
      ? `0 0 0 2px ${theme.colors.accent}, ${theme.shadow}`
      : $selected
      ? `0 0 0 2px ${theme.colors.accent}55, ${theme.shadowSoft}`
      : `inset 0 1px 0 rgba(255, 255, 255, 0.05), ${theme.shadowSoft}`};

  /* Soft inner glow on hover, matching the ambient feel of the reference. */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: radial-gradient(circle at 50% 0%, rgba(96, 165, 250, 0.15), transparent 60%);
    opacity: 0;
    transition: opacity 280ms ease;
  }

  &:hover {
    transform: translateY(-3px);
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: ${({ theme }) => theme.shadow};
  }
  &:hover::after { opacity: 1; }
`;

const Media = styled.button`
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  overflow: hidden;
  border: 0;
  padding: 0;
  cursor: zoom-in;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  &:hover img { transform: scale(1.04); }
`;

const TitleLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`;

const CheckLabel = styled.label`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  background: rgba(7, 11, 26, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 5px 12px 5px 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);

  input {
    accent-color: ${({ theme }) => theme.colors.accent};
    margin: 0;
  }
`;

const heartBurst = keyframes`
  0%   { transform: scale(1); }
  35%  { transform: scale(1.45) rotate(-8deg); }
  70%  { transform: scale(0.92) rotate(4deg); }
  100% { transform: scale(1) rotate(0); }
`;

const ringPulse = keyframes`
  0%   { transform: scale(0.6); opacity: 0.6; }
  100% { transform: scale(2.4); opacity: 0; }
`;

const HeartButton = styled.button<{ $active: boolean; $burst: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(7, 11, 26, 0.65);
  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 16px;
  line-height: 1;
  color: ${({ $active }) => ($active ? "#ff7c98" : "rgba(255,255,255,0.7)")};
  transition: color 160ms ease;

  & > .glyph {
    display: inline-block;
    transform-origin: center;
    will-change: transform;
    animation: ${({ $burst }) => ($burst ? heartBurst : "none")} 380ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid #ff7c98;
    pointer-events: none;
    opacity: 0;
    animation: ${({ $burst }) => ($burst ? ringPulse : "none")} 500ms ease-out;
  }

  &:hover {
    color: #ff7c98;
  }
  &:hover > .glyph {
    transform: scale(1.1);
    transition: transform 160ms ease;
  }
`;

const Body = styled.div`
  position: relative;
  z-index: 1;
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  line-height: 1.3;
  /* Always exactly one line  ellipsis on overflow so the title row
     never pushes the description down inconsistently. */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Desc = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textMuted};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  /* Reserve exactly two lines of vertical space whether the description
     is one line or two. Without this, shorter descriptions create
     visible whitespace imbalance between cards. */
  min-height: calc(13px * 1.45 * 2);
`;

const Meta = styled.div`
  margin-top: auto;
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface Props {
  pet: Pet;
  sizeBytes: number | null | undefined;
  focused?: boolean;
  onFocus?: () => void;
  onOpenLightbox?: () => void;
}

export function PetCard({ pet, sizeBytes, focused = false, onFocus, onOpenLightbox }: Props) {
  const { isSelected, toggle } = useSelection();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const checked = isSelected(pet.id);
  const favorited = isFavorite(pet.id);

  // Burst flag fires for ~400ms each time the heart is clicked, regardless
  // of direction. Resets via timer so back-to-back clicks re-trigger.
  const [burst, setBurst] = useState(false);
  const burstTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
    };
  }, []);

  const onHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pet.id);
    setBurst(false);
    // Force a microtask gap so the animation re-triggers on consecutive clicks.
    requestAnimationFrame(() => {
      setBurst(true);
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
      burstTimer.current = window.setTimeout(() => setBurst(false), 500);
    });
  };

  return (
    <Card
      $selected={checked}
      $focused={focused}
      role="listitem"
      aria-label={`${pet.title}${checked ? ", selected" : ""}${favorited ? ", favorited" : ""}`}
    >
      <Media
        type="button"
        onClick={onOpenLightbox}
        onFocus={onFocus}
        aria-label={`Open larger preview of ${pet.title}`}
      >
        <img src={pet.url} alt={pet.title} loading="lazy" />
        <CheckLabel
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(pet.id);
          }}
          aria-label={checked ? `Remove ${pet.title} from selection` : `Add ${pet.title} to selection`}
        >
          <input
            type="checkbox"
            checked={checked}
            readOnly
            tabIndex={-1}
            aria-hidden="true"
          />
          {checked ? "Selected" : "Select"}
        </CheckLabel>
        <HeartButton
          type="button"
          $active={favorited}
          $burst={burst}
          onClick={onHeartClick}
          aria-label={favorited ? `Unfavorite ${pet.title}` : `Favorite ${pet.title}`}
          aria-pressed={favorited}
          title={favorited ? "Unfavorite" : "Favorite"}
        >
          <span className="glyph">{favorited ? "♥" : "♡"}</span>
        </HeartButton>
      </Media>
      <Body>
        <Title>
          <TitleLink to={`/pets/${pet.id}`} state={{ pet }}>
            {pet.title}
          </TitleLink>
        </Title>
        <Desc>{pet.description}</Desc>
        <Meta>
          <span>{formatDate(pet.createdAt)}</span>
          {typeof sizeBytes === "number" && <span>{formatBytes(sizeBytes)}</span>}
        </Meta>
      </Body>
    </Card>
  );
}
