# AI Prompts Log

## How I worked with AI on this project

I used Claude Code as a pair-programmer for implementation: scaffolding files, wiring up boilerplate, suggesting hook structures, and generating styled-components blocks. I drove product direction, architecture, and scope, and reviewed every change before it landed. The AI saved me typing; I picked the features, the stack, the tone, and the trade-offs. Below is the log of the meaningful prompts and decisions, paraphrased for brevity.

---

## Phase 1: Setup

- Read the hackathon spec and the `/pets` endpoint myself, then asked the assistant to confirm the required features were captured (search, sort modes, responsive breakpoints, multi-select, file-size estimate, infinite scroll).
- Chose **Vite** over Create React App (CRA is deprecated; Vite is the modern default).
- Chose **`gh repo create` + push** rather than building locally only, so the submission link existed immediately.
- Picked the repo name **`eulerity-pet-gallery`**.
- Asked the assistant to scaffold a Vite React-TS project with `styled-components` and `react-router-dom`, and to remove the conflicting `@types/styled-components` v5 package (v6 ships its own types).

## Phase 2: Architecture decisions

These are the calls that shaped the project. Each is mine; the assistant suggested code to implement them.

- **Lift selection state above the router** so it persists across `/`, `/pets/:id`, `/selected`, and `/about`. This is what makes the "selection persists across routes" requirement actually work.
- **Wrap `usePets` in a `PetsProvider`** so the gallery, detail, selected, and toolbar views share one fetch, avoiding the N+1 trap if each view fetched independently.
- **Estimate file size via HEAD requests with a module-level cache**, instead of downloading the images. Matches the "estimated" wording in the spec without wasting bandwidth.
- **Derive stable IDs as `slug(title)-index`** because the API has no IDs. Good enough for routing and selection within one session.
- **Infinite scroll over paginated buttons.** An `IntersectionObserver` sentinel bumps the page count when it enters view.
- **Graceful CORS fallback for downloads.** When the image host refuses the blob fetch, fall back to opening in a new tab.

## Phase 3: Build prompts

The implementation prompts I gave, paraphrased:

- Build the `usePets` hook with explicit loading / error / empty states and `AbortController` cleanup.
- Build the selection context (toggle / selectMany / clear / count).
- Build the gallery page with debounced search, four sort modes, a responsive 1/2/4 column grid, and IntersectionObserver-based infinite scroll.
- Build a sticky bottom toolbar showing selection count, estimated total file size, and a download action.
- Build the detail route at `/pets/:id` using `location.state` for an instant render with a context-lookup fallback.
- Build a typed theme + `GlobalStyle`, an About page, a Selected page, and a 404.

## Phase 4: The "get creative" pass

I asked: "What additions would actually demonstrate front-end strength beyond the minimum spec?" After weighing the options I picked four:

1. **URL-synced state** so search / sort / page are bookmarkable via `useSearchParams`.
2. **Keyboard shortcuts** (`/`, `j k h l` / arrows, `x`/Space, `a`, `Esc`, `?`) with an in-app cheat sheet behind the `?` button.
3. **Bulk ZIP download** via `jszip` with a live progress counter and skip-on-failure for CORS-blocked images.
4. **Accessibility pass**: skip-to-content link, `:focus-visible` rings, semantic landmarks, `aria-live` selection counter, descriptive ARIA labels, `prefers-reduced-motion` honored.

Decisions inside this round:

- The keybinding set (vim-style `j k h l` alongside arrows; `?` for help; `x`/Space for toggle), chosen for consistency with GitHub, Gmail, and Vim muscle memory.
- Two adjacent download buttons rather than a dropdown, so the ZIP option is discoverable at a glance.
- Skip link off-screen until focused, accent-color background once visible.
- Hand-rolled the a11y rather than pulling in `react-aria` or `radix-ui`, because I wanted to show I understood the primitives, not just the wrapper.

## Phase 5: Visual polish

- Added a dashboard summary strip at the top of the gallery (Total / Visible / Selected / Est. size), with the Selected count using a brand-gradient text fill.
- Refreshed the theme tokens (tighter neutrals, brand gradient).
- Added a subtle gradient bleed to the navbar and a gradient-text hero on the About page.

## Phase 6: Self-correction

After looking at the host company's product, I asked the assistant to reframe the About page and README around enterprise-asset-management vocabulary. On review I stripped it back, because it read as a try-hard cover letter and weakened the submission. The work should be the pitch; explaining the pitch out loud undermines it. This was the call I went back and forth on the most, and cutting it was the right one.

---

## Tools used

- **Claude Code** (Opus 4.7) for implementation, scaffolding, and running build / git / gh commands.

I'll be walking through every file in the Loom; the understanding behind the code is mine.
