import { Link } from "react-router-dom";
import styled from "styled-components";
import type { Pet } from "../types/pet";
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

const Media = styled(Link)`
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 240ms ease;
  }
  &:hover img { transform: scale(1.04); }
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
}

export function PetCard({ pet, sizeBytes, focused = false, onFocus }: Props) {
  const { isSelected, toggle } = useSelection();
  const checked = isSelected(pet.id);

  return (
    <Card
      $selected={checked}
      $focused={focused}
      role="listitem"
      aria-label={`${pet.title}${checked ? ", selected" : ""}`}
    >
      <Media
        to={`/pets/${pet.id}`}
        state={{ pet }}
        onFocus={onFocus}
        aria-label={`Open details for ${pet.title}`}
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
      </Media>
      <Body>
        <Title>{pet.title}</Title>
        <Desc>{pet.description}</Desc>
        <Meta>
          <span>{formatDate(pet.createdAt)}</span>
          <span>{formatBytes(sizeBytes ?? null)}</span>
        </Meta>
      </Body>
    </Card>
  );
}
