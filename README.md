# Pet Gallery  Eulerity Hackathon

A small, polished pet gallery built for the [Eulerity front-end hackathon](https://eulerity-hackathon.appspot.com/web.html). It loads pets from the `/pets` endpoint, lets you search, sort, multi-select, and download images, and keeps your selection alive as you navigate around.

## Stack

- **React 19** + **TypeScript** scaffolded with **Vite**
- **styled-components** for theming and component styling
- **react-router-dom v7** for routing
- Native `fetch` and `IntersectionObserver`, no extra data libraries

## What's built

Every requirement from the spec, plus a few extras:

| Requirement | Implementation |
|---|---|
| Fetch pets via GET `/pets` | `src/api/pets.ts` |
| Custom hook with loading / error / empty | `src/hooks/usePets.ts` |
| Multi-image selection with count | `src/context/SelectionContext.tsx` + `src/components/SelectionToolbar.tsx` |
| Estimated total file size | `src/hooks/useImageSizes.ts` (HEAD requests, cached) |
| Select all / Clear selection | Bar at top of gallery + sticky bottom toolbar |
| Sort A–Z / Z–A / newest / oldest | `src/components/Controls.tsx` |
| Search by title or description | Debounced input in `Controls.tsx` |
| Selection persists across routes | React context above the router |
| Pagination / infinite scroll | `src/hooks/useInfiniteScroll.ts` (IntersectionObserver) |
| Detail route `/pets/:id` | `src/pages/PetDetailPage.tsx` |
| About page + extra route | `/about` and a `/selected` view |
| Responsive 1 / 2 / 4 columns | CSS grid breakpoints in `GalleryPage.tsx` |
| Download | Single + batch, with new-tab fallback when CORS blocks blob fetch |

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
- **Download fallback.** Some Pexels responses don't send permissive CORS headers, which blocks the blob fetch. When that happens, the utility opens the image in a new tab so the user can still save it via the browser.
- **Stable IDs.** The `/pets` payload has no IDs, so we derive `slug(title)-index`. This is stable for the lifetime of one response and is enough to support detail routing and selection.

## Deliverables

- `PROMPTS.md`  log of the AI prompts used during development.
- Loom walkthrough  see submission form.
