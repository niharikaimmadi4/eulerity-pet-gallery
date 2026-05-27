import styled from "styled-components";

const Wrap = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  /* Inherited by all prose below: avoids lone-word last lines (widows). */
  text-wrap: pretty;

  h1 {
    margin: 0;
    font-size: 36px;
    letter-spacing: -0.02em;
    background: ${({ theme }) => theme.gradients.brand};
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  h2 { margin: 14px 0 4px; font-size: 18px; letter-spacing: -0.01em; }
  p { margin: 0; color: ${({ theme }) => theme.colors.text}; line-height: 1.65; }
  ul { margin: 0; padding-left: 18px; color: ${({ theme }) => theme.colors.text}; line-height: 1.75; }
  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.9em;
    background: ${({ theme }) => theme.colors.surfaceAlt};
    padding: 1px 6px;
    border-radius: 5px;
  }
`;

const Lede = styled.p`
  font-size: 17px !important;
  color: ${({ theme }) => theme.colors.text} !important;
`;

const Card = styled.section`
  background: ${({ theme }) => theme.glass.bg};
  backdrop-filter: ${({ theme }) => theme.glass.blur};
  -webkit-backdrop-filter: ${({ theme }) => theme.glass.blur};
  border: 1px solid ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.glass.shadow}, ${({ theme }) => theme.glass.sheen};
  padding: 22px 24px;
`;

const Prose = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  strong { color: ${({ theme }) => theme.colors.accent}; font-weight: 600; }
`;

export function AboutPage() {
  return (
    <Wrap>
      <h1>About this project</h1>
      <Lede>
        A small, deliberate front-end build  the kind of polished surface you'd want
        on any product where users browse, filter, and act on a large library of items.
        Selection that survives navigation, URL-shareable filtered views, keyboard-first
        navigation, accessible by default, and bulk export in one click.
      </Lede>

      <Card>
        <h2>Stack</h2>
        <ul>
          <li><strong>React 19 + TypeScript</strong>  strict types end-to-end, no <code>any</code>.</li>
          <li><strong>Vite</strong> for the dev loop and bundle.</li>
          <li><strong>styled-components</strong> with a typed <code>DefaultTheme</code>, theming centralized in <code>src/styles/theme.ts</code>.</li>
          <li><strong>react-router-dom v7</strong>  routing plus <code>useSearchParams</code> for URL state.</li>
          <li><strong>jszip</strong> for client-side bundle export. No server round-trip.</li>
          <li><strong>Native <code>fetch</code> + <code>IntersectionObserver</code></strong>  no data-fetching library; the project is small enough that React Query would be overkill.</li>
        </ul>
      </Card>

      <Card>
        <h2>Features</h2>
        <ul>
          <li><strong>Live counts</strong>  the result count updates as you search, and the selection bar shows a running count plus estimated total download size.</li>
          <li><strong>Search</strong> across title and description, debounced for snappy typing.</li>
          <li><strong>Four sort modes</strong>  A–Z, Z–A, newest, oldest.</li>
          <li><strong>Multi-select</strong> with selection that persists across every route.</li>
          <li><strong>Favorites</strong>  hearted pets persist across page reloads via <code>localStorage</code>, synced across tabs.</li>
          <li><strong>Lightbox</strong>  click any image for a full-screen preview; arrow keys cycle through the filtered set.</li>
          <li><strong>URL-as-state</strong>  search, sort, and pagination all live in the URL, so filtered views are bookmarkable and shareable.</li>
          <li><strong>Infinite scroll</strong> via <code>IntersectionObserver</code>, page size 8.</li>
          <li><strong>Keyboard-first ops</strong>  <code>/</code>, <code>j k h l</code>/arrows, <code>x</code>/Space, <code>a</code>, <code>Esc</code>, <code>?</code>, with an in-app cheat sheet.</li>
          <li><strong>Bulk download</strong>  per-image or as a ZIP with live progress.</li>
          <li><strong>Responsive grid</strong>  1 / 2 / 4 columns at the standard breakpoints.</li>
        </ul>
      </Card>

      <Card>
        <h2>Engineering choices worth flagging</h2>
        <ul>
          <li>
            <strong>One fetch, shared everywhere.</strong> <code>PetsProvider</code> wraps
            the <code>usePets</code> hook once at the root so the gallery, detail view,
            selected view, and toolbar all share a single request.
          </li>
          <li>
            <strong>Selection lifted above the router.</strong> Survives navigation across
            every route. The bottom toolbar follows you everywhere.
          </li>
          <li>
            <strong>Size estimation without downloading.</strong> HEAD requests with a
            module-level cache. Scrolling never re-asks for a size we've already seen.
          </li>
          <li>
            <strong>Graceful CORS fallback.</strong> When the image host refuses the blob
            fetch, individual downloads open in a new tab and the ZIP path skips the
            asset and reports it in the progress counter. No silent failures.
          </li>
          <li>
            <strong>Stable IDs.</strong> The API returns no IDs, so we derive
            <code>slug(title)-index</code>. Stable for the lifetime of a response, which
            is enough for routing and selection.
          </li>
        </ul>
      </Card>

      <Card>
        <h2>Accessibility</h2>
        <p>
          Built in, not bolted on: skip-to-content link, semantic landmarks,
          <code>aria-live</code> selection counter, <code>:focus-visible</code> rings for
          keyboard users only, descriptive ARIA labels on every interactive element, and
          <code>prefers-reduced-motion</code> honored globally. No <code>react-aria</code>
          or other heavyweight a11y library  the audit is hand-rolled.
        </p>
      </Card>

      <Card>
        <h2>About me</h2>
        <Prose>
          <p>
            <strong>Niharika Immadi</strong>, an AI-first web development engineer with
            4+ years shipping production React and TypeScript frontends, paired with
            custom LLM automation and agentic tooling wired straight into forms and
            internal APIs.
          </p>
          <p>
            I work hands-on with the Claude and OpenAI APIs, build autonomous agents,
            and treat AI as a collaborator rather than a crutch: drafting fast, then
            reviewing every line of its output rigorously before it ships. Comfortable
            across the whole stack, HTML, CSS, JavaScript, REST and GraphQL, plus Java
            backend and SDK work, and I own the full PR lifecycle while keeping shared
            architecture consistent across teams.
          </p>
          <p>
            The cool part: this gallery is a working sample of how I build. Strict types
            end to end, keyboard-first navigation, accessible by default, URL-shareable
            state, and a neumorphic surface that stays calm under load. Obvious to use on
            the outside, quietly over-engineered where it counts.
          </p>
        </Prose>
      </Card>
    </Wrap>
  );
}
