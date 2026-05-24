import styled from "styled-components";
import { EmptyState } from "../components/EmptyState";
import { PetCard } from "../components/PetCard";
import { Spinner } from "../components/Spinner";
import { usePetsContext } from "../context/PetsContext";
import { useSelection } from "../context/SelectionContext";
import { useImageSizes } from "../hooks/useImageSizes";

const Header = styled.header`
  margin-bottom: 18px;
  h1 { margin: 0 0 6px; font-size: 28px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.textMuted}; }
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

export function SelectedPage() {
  const { pets, status } = usePetsContext();
  const { selected } = useSelection();

  const chosen = pets.filter((p) => selected.has(p.id));
  const sizes = useImageSizes(chosen.map((p) => p.url));

  if (status === "loading") return <Spinner label="Loading…" />;

  return (
    <>
      <Header>
        <h1>Your selection</h1>
        <p>Selection persists as you navigate around the app.</p>
      </Header>
      {chosen.length === 0 ? (
        <EmptyState
          title="Nothing selected yet"
          message="Head back to the gallery and tap Select on the pets you like."
        />
      ) : (
        <Grid>
          {chosen.map((pet) => (
            <PetCard key={pet.id} pet={pet} sizeBytes={sizes[pet.url]} />
          ))}
        </Grid>
      )}
    </>
  );
}
