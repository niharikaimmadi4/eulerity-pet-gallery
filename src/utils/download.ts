import JSZip from "jszip";
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

export interface ZipProgress {
  completed: number;
  total: number;
  failed: number;
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

/**
 * Bundle all selected pets into a single ZIP and trigger one download.
 * Images that fail to fetch (e.g. CORS-blocked) are skipped; the rest still
 * arrive in the archive. Progress callback fires after each image attempt.
 */
export async function downloadAsZip(
  pets: Pet[],
  onProgress?: (p: ZipProgress) => void,
): Promise<ZipProgress> {
  const zip = new JSZip();
  const progress: ZipProgress = { completed: 0, total: pets.length, failed: 0 };

  await Promise.all(
    pets.map(async (pet) => {
      try {
        const res = await fetch(pet.url, { mode: "cors" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        zip.file(filenameFor(pet), blob);
        progress.completed += 1;
      } catch {
        progress.failed += 1;
      } finally {
        onProgress?.({ ...progress });
      }
    }),
  );

  const archive = await zip.generateAsync({ type: "blob" });
  const today = new Date().toISOString().slice(0, 10);
  triggerBlobDownload(archive, `pet-gallery-${today}.zip`);
  return progress;
}
