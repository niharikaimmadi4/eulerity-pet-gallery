import { useState } from "react";
import styled from "styled-components";
import { EmptyState } from "../components/EmptyState";
import { Lightbox } from "../components/Lightbox";
import { PetCard } from "../components/PetCard";
import { Spinner } from "../components/Spinner";
import { useFavorites } from "../context/FavoritesContext";
import { usePetsContext } from "../context/PetsContext";
import { useImageSizes } from "../hooks/useImageSizes";

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  flex-wrap: wrap;

  h1 { margin: 0 0 6px; font-size: 28px; letter-spacing: -0.015em; }
  p { margin: 0; color: ${({ theme }) => theme.colors.textMuted}; }
`;

const ClearBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: 600;
  &:hover { filter: brightness(1.1); }
`;

const Grid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export function FavoritesPage() {
  const { pets, status } = usePetsContext();
  const { favorites, clear, count } = useFavorites();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const chosen = pets.filter((p) => favorites.has(p.id));
  const sizes = useImageSizes(chosen.map((p) => p.url));

  if (status === "loading") return <Spinner label="Loading" />;

  return (
    <>
      <Header>
        <div>
          <h1>♥ Favorites</h1>
          <p>Saved in this browser. Favorites persist across page reloads and restarts.</p>
        </div>
        {count > 0 && <ClearBtn onClick={clear}>Clear all favorites</ClearBtn>}
      </Header>

      {chosen.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          message="Tap the heart on any pet card to save it here. They'll still be here next time you open the app."
        />
      ) : (
        <Grid role="list">
          {chosen.map((pet, index) => (
            <PetCard
              key={pet.id}
              pet={pet}
              sizeBytes={sizes[pet.url]}
              onOpenLightbox={() => setLightboxIndex(index)}
            />
          ))}
        </Grid>
      )}
      {lightboxIndex !== null && (
        <Lightbox
          pets={chosen}
          index={lightboxIndex}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
