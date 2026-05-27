import { Link, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { ErrorState } from "../components/ErrorState";
import { Spinner } from "../components/Spinner";
import { useFavorites } from "../context/FavoritesContext";
import { usePetsContext } from "../context/PetsContext";
import { useSelection } from "../context/SelectionContext";
import { useImageSizes } from "../hooks/useImageSizes";
import type { Pet } from "../types/pet";
import { downloadPet } from "../utils/download";
import { formatBytes, formatDate } from "../utils/format";

const Wrap = styled.article`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  }
`;

const Photo = styled.div`
  border-radius: ${({ theme }) => theme.radius};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  img { width: 100%; height: auto; display: block; }
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Back = styled(Link)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 8px;
  display: inline-block;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
  text-wrap: balance;
`;

const Description = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  margin: 0;
  text-wrap: pretty;
`;

const MetaList = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 6px 16px;
  margin: 0;
  font-size: 14px;
  dt { color: ${({ theme }) => theme.colors.textMuted}; }
  dd { margin: 0; color: ${({ theme }) => theme.colors.text}; }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

const Btn = styled.button<{ $variant?: "primary" | "ghost" }>`
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "primary" ? theme.colors.accent : theme.colors.border};
  background: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.colors.accent : "transparent"};
  color: ${({ theme, $variant }) =>
    $variant === "primary" ? "#0b0e14" : theme.colors.text};
  &:hover { filter: brightness(1.08); }
`;

export function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { pets, status, error, refetch } = usePetsContext();
  const { isSelected, toggle } = useSelection();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();

  const passedPet = (location.state as { pet?: Pet } | null)?.pet;
  const pet = passedPet ?? pets.find((p) => p.id === id);

  const sizes = useImageSizes(pet ? [pet.url] : []);

  if (status === "loading" && !pet) return <Spinner label="Loading pet…" />;
  if (status === "error" && !pet) return <ErrorState message={error ?? "Unknown"} onRetry={refetch} />;
  if (!pet) {
    return (
      <ErrorState
        message={`No pet found for id "${id}".`}
        onRetry={() => undefined}
      />
    );
  }

  const checked = isSelected(pet.id);
  const size = sizes[pet.url];

  return (
    <>
      <Back to="/">← Back to gallery</Back>
      <Wrap>
        <Photo>
          <img src={pet.url} alt={pet.title} />
        </Photo>
        <Side>
          <Title>{pet.title}</Title>
          <Description>{pet.description}</Description>
          <MetaList>
            <dt>Added</dt>
            <dd>{formatDate(pet.createdAt)}</dd>
            <dt>File size</dt>
            <dd
              title={
                typeof size === "number"
                  ? undefined
                  : "The image host's CORS policy doesn't expose Content-Length, so the size can't be read from the browser."
              }
            >
              {formatBytes(size ?? null)}
            </dd>
            <dt>Source</dt>
            <dd>
              <a href={pet.url} target="_blank" rel="noreferrer">
                Open original
              </a>
            </dd>
          </MetaList>
          <Actions>
            <Btn
              $variant={checked ? "ghost" : "primary"}
              onClick={() => toggle(pet.id)}
            >
              {checked ? "Remove from selection" : "Add to selection"}
            </Btn>
            <Btn
              onClick={() => toggleFavorite(pet.id)}
              aria-pressed={isFavorite(pet.id)}
            >
              {isFavorite(pet.id) ? "♥ Favorited" : "♡ Favorite"}
            </Btn>
            <Btn onClick={() => downloadPet(pet)}>Download</Btn>
          </Actions>
        </Side>
      </Wrap>
    </>
  );
}
