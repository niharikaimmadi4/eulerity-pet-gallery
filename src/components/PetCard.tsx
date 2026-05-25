import { Link } from "react-router-dom";
import styled from "styled-components";
import type { Pet } from "../types/pet";
import { useFavorites } from "../context/FavoritesContext";
import { useSelection } from "../context/SelectionContext";
import { formatBytes, formatDate } from "../utils/format";

const Card = styled.article<{ $selected: boolean; $focused: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
  box-shadow: ${({ $selected, $focused, theme }) =>
    $focused
      ? `0 0 0 3px ${theme.colors.accent}, ${theme.shadow}`
      : $selected
      ? `0 0 0 2px ${theme.colors.accent}55, ${theme.shadow}`
      : "none"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow};
  }
`;

const Media = styled.button`
  position: relative;
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
    transition: transform 240ms ease;
  }
  &:hover img { transform: scale(1.04); }
`;

const TitleLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`;

const CheckLabel = styled.label`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(15, 17, 21, 0.7);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  backdrop-filter: blur(6px);

  input { accent-color: ${({ theme }) => theme.colors.accent}; }
`;

const HeartButton = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(15, 17, 21, 0.7);
  backdrop-filter: blur(6px);
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 16px;
  line-height: 1;
  color: ${({ $active, theme }) => ($active ? "#ff7c98" : theme.colors.textMuted)};
  transition: transform 120ms ease, color 120ms ease;

  &:hover {
    transform: scale(1.08);
    color: #ff7c98;
  }
`;

const Body = styled.div`
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
`;

const Desc = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  margin-top: 8px;
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(pet.id);
          }}
          aria-label={favorited ? `Unfavorite ${pet.title}` : `Favorite ${pet.title}`}
          aria-pressed={favorited}
          title={favorited ? "Unfavorite" : "Favorite"}
        >
          {favorited ? "♥" : "♡"}
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
