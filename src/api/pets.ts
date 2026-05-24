import type { Pet, PetApiResponse } from "../types/pet";
import { slugify } from "../utils/format";

const ENDPOINT = "https://eulerity-hackathon.appspot.com/pets";

export async function fetchPets(signal?: AbortSignal): Promise<Pet[]> {
  const res = await fetch(ENDPOINT, { signal });
  if (!res.ok) {
    throw new Error(`Failed to load pets (${res.status})`);
  }
  const data: PetApiResponse[] = await res.json();
  return data.map((p, index) => ({
    ...p,
    id: `${slugify(p.title) || "pet"}-${index}`,
    createdAt: new Date(p.created),
  }));
}
