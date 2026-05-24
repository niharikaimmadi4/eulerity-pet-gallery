# Pet Gallery  Eulerity Hackathon

A small, deliberate front-end demo built for the [Eulerity hackathon](https://eulerity-hackathon.appspot.com/web.html). The pet API is the canvas, but the patterns underneath  bulk asset selection, URL-shareable filtered views, keyboard-driven ops, and a dashboard-style summary strip  are the same ones a marketing-ops surface at Eulerity's scale needs every day.

> **Why these specific features for Eulerity?** Eulerity sells an agentic marketing platform to multi-location franchises and enterprise brands (Uber, Mastercard, Xponential Fitness). That means: power users managing large libraries of creative assets, dashboards that need to feel fast at scale, and procurement teams who ask about accessibility before signing. Every "creative" addition in this submission was chosen with that in mind.

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

### Going beyond the spec (mapped to what Eulerity actually does)

| Feature | Why it matters at Eulerity's scale |
|---|---|
| **Dashboard stats strip** | Total / visible / selected / size, live as filters change. Same pattern as a campaign overview surface, so the gallery feels like an operational dashboard, not just an image grid. |
| **URL-synced state** (`?q=…&sort=…&page=…`) | Every dashboard eventually needs shareable filtered views. Search, sort, and pagination all live in the URL. A campaign manager can paste a filtered view into Slack and the recipient lands on the exact same screen. |
| **Keyboard shortcuts** | Power users running ops across hundreds of franchise locations live on the keyboard. `/` focus search · `j k h l` / arrow keys navigate · `x`/`Space` toggle select · `a` select all · `Esc` clear · `?` opens the cheat sheet. |
| **Bulk ZIP download** | "Pull these 40 banners for the Q3 rollout" is one click, one archive, with a live `Zipping 12/40` progress counter. Uses `jszip` client-side  no server round-trip. |
| **Accessibility pass** | Enterprise procurement asks about WCAG before signing. Skip-to-content link, semantic landmarks, `aria-live` selection counter, `:focus-visible` rings, descriptive ARIA labels on every control, `prefers-reduced-motion` honored globally. |
| **Single shared fetch** | `PetsProvider` wraps `usePets` once at the root so gallery, detail, selected, and toolbar share one network request. The discipline that keeps a real dashboard from N+1-ing itself to death. |
| **HEAD-based size estimation with cache** | Total file size is computed without downloading the assets. Results cached in a module-level map so scrolling never re-asks. |
| **Graceful CORS fallback** | If a CDN refuses the blob fetch, individual downloads open in a new tab; the ZIP path skips the asset and reports it in the progress counter. No silent failures. |

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
