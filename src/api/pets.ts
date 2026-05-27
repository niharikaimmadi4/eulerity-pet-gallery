import type { Pet, PetApiResponse } from "../types/pet";
import { slugify } from "../utils/format";

const ENDPOINT = "https://eulerity-hackathon.appspot.com/pets";

export async function fetchPets(signal?: AbortSignal): Promise<Pet[]> {
  const res = await fetch(ENDPOINT, { signal });
  if (!res.ok) {
    throw new Error(`Failed to load pets (${res.status})`);
  }
  const data: PetApiResponse[] = await res.json();

  // The hackathon API returns an identical `created` timestamp for every pet,
  // which makes Newest/Oldest sorting indistinguishable. When we detect that
  // every timestamp matches, synthesize spread-out (but deterministic) dates
  // from each pet's position so date sorting is demonstrable: index 0 is the
  // newest, each subsequent pet 36h older. Real, varied API dates are kept.
  const SPREAD_MS = 36 * 60 * 60 * 1000; // 1.5 days between pets
  const allSameDate =
    data.length > 1 && data.every((p) => p.created === data[0].created);
  const base = data.length > 0 ? new Date(data[0].created).getTime() : Date.now();

  return data.map((p, index) => ({
    ...p,
    id: `${slugify(p.title) || "pet"}-${index}`,
    createdAt: allSameDate
      ? new Date(base - index * SPREAD_MS)
      : new Date(p.created),
    order: index,
  }));
}
