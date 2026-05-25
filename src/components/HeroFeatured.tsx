import { Link } from "react-router-dom";
import styled from "styled-components";
import { useFavorites } from "../context/FavoritesContext";
import { useSelection } from "../context/SelectionContext";
import type { Pet } from "../types/pet";
import { downloadPet } from "../utils/download";
import { formatBytes, formatDate } from "../utils/format";

const Wrap = styled.section`
  position: relative;
  margin: 0 0 24px;
  border-radius: 24px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.raisedLarge};
  display: grid;
  grid-template-columns: 1fr;
  min-height: 360px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  }
`;

const Media = styled(Link)`
  position: relative;
  z-index: 1;
  display: block;
  min-height: 280px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  &:hover img { transform: scale(1.04); }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 360px;
  }
`;

const Pedestal = styled.div`
  /* Soft floor shadow under the image, mimicking the "pedestal" feel
     under the isometric hero models in the reference. */
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: -20px;
  height: 24px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.45), transparent 70%);
  filter: blur(8px);
  pointer-events: none;
  z-index: 0;
`;

const Body = styled.div`
  position: relative;
  z-index: 1;
  padding: 28px 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 12px ${({ theme }) => theme.colors.accent};
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.text};
`;

const Desc = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetaRow = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};

  span { display: inline-flex; align-items: center; gap: 6px; }
  strong { color: ${({ theme }) => theme.colors.text}; font-weight: 600; }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
`;

const Btn = styled.button<{ $variant?: "primary" | "ghost" | "fav" }>`
  border-radius: ${({ theme }) => theme.radiusPill};
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: filter 160ms ease, transform 160ms ease, box-shadow 200ms ease;
  border: 0;

  background: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.accent : theme.colors.surface};
  color: ${({ theme, $variant }) =>
    $variant === "primary" ? "white" : theme.colors.text};
  box-shadow: ${({ theme, $variant }) =>
    $variant === "primary"
      ? "0 6px 16px rgba(255, 122, 107, 0.35)"
      : theme.shadows.raisedSmall};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme, $variant }) =>
      $variant === "primary"
        ? "0 10px 20px rgba(255, 122, 107, 0.4)"
        : theme.shadows.raised};
  }
`;

interface Props {
  pet: Pet;
  sizeBytes: number | null | undefined;
  onOpenLightbox: () => void;
}

/**
 * Large "hero" card for the first pet on the gallery. Two-column layout on
 * tablet+ with the image left, content right. Has a soft glow and a faint
 * pedestal shadow underneath to evoke the floating-platform look of the
 * smart-home reference.
 */
export function HeroFeatured({ pet, sizeBytes, onOpenLightbox }: Props) {
  const { isSelected, toggle } = useSelection();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const checked = isSelected(pet.id);
  const favorited = isFavorite(pet.id);

  return (
    <Wrap aria-label="Featured pet">
      <Media to={`/pets/${pet.id}`} state={{ pet }} aria-label={`Open ${pet.title}`}>
        <img src={pet.url} alt={pet.title} />
        <Pedestal />
      </Media>
      <Body>
        <Eyebrow>Featured</Eyebrow>
        <Title>{pet.title}</Title>
        <Desc>{pet.description}</Desc>
        <MetaRow>
          <span>
            <strong>Added</strong> {formatDate(pet.createdAt)}
          </span>
          {typeof sizeBytes === "number" && (
            <span>
              <strong>Size</strong> {formatBytes(sizeBytes)}
            </span>
          )}
        </MetaRow>
        <Actions>
          <Btn
            type="button"
            $variant="primary"
            onClick={onOpenLightbox}
            aria-label="Open larger preview"
          >
            View larger
          </Btn>
          <Btn
            type="button"
            onClick={() => toggle(pet.id)}
            aria-pressed={checked}
          >
            {checked ? "Selected" : "Select"}
          </Btn>
          <Btn
            type="button"
            onClick={() => toggleFavorite(pet.id)}
            aria-pressed={favorited}
            aria-label={favorited ? `Unfavorite ${pet.title}` : `Favorite ${pet.title}`}
          >
            <span style={{ color: favorited ? "#ff7c98" : undefined }}>
              {favorited ? "♥" : "♡"}
            </span>
            {favorited ? "Favorited" : "Favorite"}
          </Btn>
          <Btn type="button" onClick={() => downloadPet(pet)}>
            Download
          </Btn>
        </Actions>
      </Body>
    </Wrap>
  );
}
