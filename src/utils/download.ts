import type { Pet } from "../types/pet";
import { slugify } from "./format";

function extensionFromUrl(url: string): string {
  const match = url.split("?")[0].match(/\.([a-z0-9]{3,4})$/i);
  return match ? match[1].toLowerCase() : "jpg";
}

function filenameFor(pet: Pet): string {
  const base = slugify(pet.title) || pet.id;
  return `${base}.${extensionFromUrl(pet.url)}`;
}

/**
 * Download a single image by fetching it as a blob then triggering an anchor click.
 * Falls back to opening the URL in a new tab when CORS blocks the blob fetch.
 */
export async function downloadPet(pet: Pet): Promise<void> {
  try {
    const res = await fetch(pet.url, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    triggerBlobDownload(blob, filenameFor(pet));
  } catch {
    window.open(pet.url, "_blank", "noopener");
  }
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/**
 * Download many pets sequentially. Most browsers throttle simultaneous downloads,
 * so we stagger calls slightly to give each anchor click time to register.
 */
export async function downloadMany(pets: Pet[]): Promise<void> {
  for (const pet of pets) {
    await downloadPet(pet);
    await new Promise((r) => setTimeout(r, 250));
  }
}
