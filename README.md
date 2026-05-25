# Pet Gallery  Eulerity Hackathon

A small, polished front-end project built for the [Eulerity hackathon](https://eulerity-hackathon.appspot.com/web.html). It loads pets from the `/pets` endpoint and lets you search, sort, multi-select, and download them — with selection that survives navigation, URL-shareable filtered views, keyboard-first navigation, and accessibility built in.

## Stack

- **React 19** + **TypeScript** scaffolded with **Vite**
- **styled-components** for theming and component styling
- **react-router-dom v7** for routing
- Native `fetch` and `IntersectionObserver`, no extra data libraries

## What's built

Every requirement from the spec, plus deliberate additions to answer the "get creative" portion of the brief.

### Required by the spec

| Requirement | Implementation |
|---|---|
| Fetch pets via GET `/pets` | `src/api/pets.ts` |
| Custom hook with loading / error / empty | `src/hooks/usePets.ts` |
| Multi-image selection with count | `src/context/SelectionContext.tsx` + `src/components/SelectionToolbar.tsx` |
| Estimated total file size | `src/hooks/useImageSizes.ts` (HEAD requests, cached) |
| Select all / Clear selection | Top of gallery + sticky bottom toolbar |
| Sort A–Z / Z–A / newest / oldest | `src/components/Controls.tsx` |
| Search by title or description | Debounced input in `Controls.tsx` |
| Selection persists across routes | React context above the router |
| Pagination / infinite scroll | `src/hooks/useInfiniteScroll.ts` (IntersectionObserver) |
| Detail route `/pets/:id` | `src/pages/PetDetailPage.tsx` |
| About page + extra route | `/about` and a `/selected` view |
| Responsive 1 / 2 / 4 columns | CSS grid breakpoints in `GalleryPage.tsx` |
| Download | Single + batch + ZIP, with new-tab fallback when CORS blocks blob fetch |

### Going beyond the spec

| Feature | What it does |
|---|---|
| **Dashboard summary strip** | Total / visible / selected / estimated size at the top of the gallery, updated live as filters change. |
| **Lightbox with prev/next nav** | Click any image to open a full-screen preview; arrow keys cycle through the filtered set; Esc closes; body scroll locked while open. |
| **Favorites with localStorage** | A second tier above selection. Hearts persist across page reloads and browser restarts, sync across open tabs via the `storage` event, and have their own `/favorites` route. |
| **URL-synced state** (`?q=…&sort=…&page=…`) | Search, sort, and pagination all live in the URL. Filtered views are bookmarkable and shareable; refresh keeps your spot. |
| **Keyboard shortcuts** | `/` focus search · `j k h l` / arrow keys move card focus · `x`/`Space` toggle select · `a` select all · `Esc` clear · `?` opens an in-app cheat sheet. |
| **Bulk ZIP download** | One archive instead of N separate save prompts. Uses `jszip` client-side with a live `Zipping 12/40` progress counter and skip-on-failure. |
| **Accessibility pass** | Skip-to-content link, semantic landmarks, `aria-live` selection counter, `:focus-visible` rings, descriptive ARIA labels on every control, `prefers-reduced-motion` honored globally. Hand-rolled, no a11y library. |
| **Single shared fetch** | `PetsProvider` wraps `usePets` once at the root so the gallery, detail, selected, and toolbar views share one network request. |
| **HEAD-based size estimation with cache** | Total file size computed without downloading the images. Results cached in a module-level map so scrolling never re-asks. |
| **Graceful CORS fallback** | If the image host refuses the blob fetch, individual downloads open in a new tab; the ZIP path skips the asset and reports it. No silent failures. |

## Run it

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # type-check + production bundle
npm run preview # serve the production build
```

## Project layout

```
src/
  api/pets.ts                # fetch + normalize (stable id, Date)
  components/                # UI building blocks
  context/                   # PetsProvider, SelectionProvider
  hooks/
    usePets.ts               # the required custom hook
    useDebounce.ts           # snappier search
    useInfiniteScroll.ts     # IntersectionObserver wrapper
    useImageSizes.ts         # HEAD-request size estimator w/ cache
  pages/                     # GalleryPage, PetDetailPage, SelectedPage, AboutPage, NotFoundPage
  styles/                    # theme + GlobalStyle
  types/pet.ts
  utils/                     # format helpers + download utilities
  App.tsx                    # ThemeProvider > providers > router
  main.tsx                   # entry
```

## Design notes

- **State persistence across routes** is handled by lifting `SelectionProvider` above the router, so the selection survives navigation to `/pets/:id`, `/selected`, `/about`, and back.
- **Single fetch.** `PetsProvider` wraps `usePets()` once at the root so the gallery, detail, selected, and toolbar views share one network request.
- **Estimating size without downloading** is done with a HEAD request per image. Results are cached in a module-level map so they're not refetched as you scroll or paginate.
- **URL is the source of truth** for search, sort, and pagination. The component holds local input state for snappy typing, then syncs the debounced value back into `useSearchParams` so URLs stay shareable.
- **Download fallback.** Some Pexels responses don't send permissive CORS headers, which blocks the blob fetch. When that happens, individual downloads fall back to opening the image in a new tab; the ZIP path skips the image and reports it in the progress counter.
- **Stable IDs.** The `/pets` payload has no IDs, so we derive `slug(title)-index`. This is stable for the lifetime of one response and is enough to support detail routing and selection.

## Accessibility audit notes

What was checked and how it was addressed:

- **Skip link** at the top of every page jumps focus straight to `<main>`.
- **Keyboard navigation** for the entire gallery (`/`, `j/k`, arrows, `x`, `a`, `Esc`, `?`) with an in-app cheat sheet behind the `?` button.
- **Focus management:** custom `:focus-visible` rings on every actionable element. No outline-suppression. The focused card gets a 3px accent ring so keyboard navigation is visible at a glance.
- **Semantic structure:** `<header>` / `<nav>` / `<main>`, a `role="region"` selection bar with an `aria-live` counter, `role="list"` on the gallery grid, `role="dialog"` + `aria-modal` on the help overlay.
- **Descriptive labels** on every icon-only or ambiguous control (select buttons name the pet they target, the help button announces "Show keyboard shortcuts," the navigation badge announces "N pets selected").
- **`prefers-reduced-motion`** disables transitions and animations site-wide for users who request it.

## Deliverables

- `PROMPTS.md`  log of the AI prompts used during development.
- Loom walkthrough  see submission form.
