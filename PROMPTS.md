# AI Prompts Log

This file logs the meaningful prompts sent to AI tools (Claude Code) while building this project. Trivial corrections, formatting fixes, and follow-up tool calls are summarized rather than transcribed verbatim.

---

## 1. Kickoff  the assignment itself

> Please review the requirements and complete this project using React and TypeScript. Feel free to add onto the project in any way you feel best demonstrates your abilities.
>
> When you are ready to submit, please provide the following in the submission form here:
> 1. A link to your GitHub repository with the completed project.
> 2. A Loom recording link (up to 5 minutes) walking us through your code and explaining the key decisions you made.
> 3. A PROMPTS.md file in the root of your repository containing a log of the messages you sent to any AI tools during development.

Used Claude Code (Opus 4.7) as a pair-programmer. The first move was to fetch and read the hackathon spec at `https://eulerity-hackathon.appspot.com/web.html` and the `/pets` payload to understand the shape of the data.

---

## 2. Clarification round

Before writing any code I confirmed three choices:

- **Scaffolder:** Vite (over the deprecated CRA).
- **Push flow:** create the GitHub repo + push via `gh` CLI rather than build locally only.
- **Repo name:** `eulerity-pet-gallery`.

---

## 3. Architecture decisions made in conversation

These were decided in-context, not via a separate prompt, but worth recording:

- **Lift selection above the router** so `SelectionProvider` survives navigation between `/`, `/pets/:id`, `/selected`, and `/about`. This is how the "selection persists across routes" requirement is satisfied.
- **Add a `PetsProvider`** around `usePets()` so the gallery, detail, selected, and toolbar views share one fetch instead of each component refetching.
- **Estimate file size via HEAD requests** with a module-level cache, instead of downloading the images upfront. This keeps the gallery fast and matches the "estimated" wording in the spec.
- **Derive stable IDs from `slug(title)-index`** because the API payload has no IDs. Good enough for routing and selection within one session.
- **Infinite scroll** instead of paginated buttons. An `IntersectionObserver` sentinel at the bottom of the grid bumps the page count.
- **Graceful download fallback.** Pexels images sometimes refuse the CORS blob fetch; in that case the utility falls back to opening the image in a new tab so the user can still save it.

---

## 4. Specific prompts (paraphrased)

The conversation was mostly one big task, but the meaningful sub-prompts to Claude were:

1. *"Fetch the hackathon spec and pets endpoint and summarize the requirements."*  used to make sure nothing in the spec got missed (search, sort modes, responsive breakpoints, etc.).
2. *"Scaffold a Vite React-TS project named eulerity-pet-gallery, install styled-components and react-router-dom, remove the conflicting @types/styled-components v5 package since v6 ships its own types."*
3. *"Write the custom usePets hook with explicit loading / error / empty states and an AbortController for unmounting."*
4. *"Wire the selection context above the router, expose toggle / selectMany / clear / count."*
5. *"Build the gallery page with a debounced search, four sort modes, responsive 1/2/4 column grid, and an IntersectionObserver-based infinite scroll."*
6. *"Build a sticky bottom toolbar that shows selection count + estimated total file size and triggers batch download."*
7. *"Add a detail route at `/pets/:id` that uses `location.state` for instant render and falls back to looking up by id in the shared context."*
8. *"Add an About page summarizing the stack and design decisions."*
9. *"Type-check + production build to confirm everything compiles."*
10. *"Initialize a git repo, write README and PROMPTS.md, create a GitHub repo via `gh`, and push."*

---

## 5. What was *not* asked of AI

- The list of design tradeoffs in the README and in this file is mine, written from the build experience.
- The styling choices (dark theme, sticky bottom action bar pattern, card hover lift, blurred backdrop nav) were chosen, not generated.

---

## 6. Tools used

- **Claude Code** (Opus 4.7, 1M context)  pair-programming, scaffolding, file writes, running build / git / gh.

---

## 7. Round two  the "get creative" pass

After the first submission was working, I went back and asked Claude to help answer the part of the brief that says "feel free to get creative." Picked the highest-signal additions per amount of code:

1. *"Make search, sort, and pagination URL-synced via `useSearchParams` so the view is bookmarkable. Keep the input snappy by holding local state, then push the debounced value into the URL with `{ replace: true }`."*
2. *"Add a global keyboard-shortcuts layer: `/` focuses search, `j k h l` and arrow keys move card focus across the grid (row stride is the column count), `x`/Space toggle the focused card, `a` selects all visible, `Esc` clears search then clears selection, `?` toggles an in-app help dialog. Skip handling when the user is typing in an input."*
3. *"Add a bulk ZIP download using `jszip`. Run downloads in parallel, accumulate progress via a callback, name the archive `pet-gallery-YYYY-MM-DD.zip`, and skip CORS-blocked images while reporting the count in the toolbar."*
4. *"Do an accessibility pass: skip-to-content link, `:focus-visible` rings (no outline suppression), semantic landmarks, `aria-live` selection counter, descriptive ARIA labels on every icon-only control, `prefers-reduced-motion` honored globally. Document the audit in the README."*

Decisions that were mine, not the model's:
- The keybinding set itself (vim-style `j k h l` alongside arrows; `?` for help; `x`/Space for toggle). Picked for muscle memory consistency with GitHub, Gmail, and Vim.
- The toolbar layout choice  keeping "Download individually" and "Download as ZIP" as two adjacent buttons rather than a dropdown, so the ZIP option is discoverable at a glance.
- The skip link styling  visible only on focus, off-screen otherwise, accent-color background.
- Refusing to drop a heavyweight a11y library  the audit is hand-rolled, no `react-aria` or `radix-ui`.

---

## 8. Round three  tailoring to Eulerity specifically

A reviewer pointed out that I hadn't actually researched the company. Fixed that:

1. *"Fetch eulerity.com and summarize: what they do, who their customers are, brand voice, target industries."*  learned Eulerity sells an agentic marketing-ops platform to multi-location franchises and enterprise brands (Uber, Mastercard, Xponential Fitness). Brand voice is confident and forward-looking; visual identity uses gradient overlays and modern sans-serif.
2. *"Add a dashboard stats strip to the top of the gallery showing total / visible / selected / size. The 'selected' number uses a brand-gradient text fill. This is the same pattern as a campaign overview surface."*
3. *"Refresh the theme: tighter neutrals, a brand gradient token, gradient bleed on the navbar, gradient-text hero on the About page."*
4. *"Rewrite the About page in Eulerity vocabulary  asset libraries, bulk operations, URL-shareable filtered views, keyboard-first ops, WCAG for enterprise procurement. Reframe each feature in terms of *why this matters at multi-location scale*."*
5. *"Update the README intro with a 'why these features for Eulerity specifically' paragraph and rewrite the feature table column from 'why it matters' to 'why it matters at Eulerity's scale.'"*

Why this round mattered: the previous rounds answered "is it built well?" This round answers "do you understand who you'd be building for?"
