import styled from "styled-components";

const Wrap = styled.article`
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 18px;

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
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 22px 24px;
`;

export function AboutPage() {
  return (
    <Wrap>
      <h1>About this submission</h1>
      <Lede>
        Built for the Eulerity hackathon as a small, deliberate demo of the patterns I'd
        bring to a marketing-ops dashboard: managing a library of creative assets at
        scale, with the kind of selection, filtering, and bulk-export flows a
        multi-location operator actually uses.
      </Lede>

      <Card>
        <h2>Why these features, for Eulerity specifically</h2>
        <ul>
          <li>
            <strong>Asset library + bulk operations.</strong> Multi-location brands sit on
            hundreds of creative assets. The selection model, ZIP export, and live size
            estimate map directly to "pull these 40 banners for the Q3 franchise rollout."
          </li>
          <li>
            <strong>URL-as-state.</strong> Every dashboard surface eventually needs
            shareable filtered views. Search, sort, and pagination all live in the URL so a
            campaign manager can paste a filtered view into Slack.
          </li>
          <li>
            <strong>Keyboard-first.</strong> Power users running ops across thousands of
            locations live on the keyboard. <code>/</code>, <code>j/k</code>,
            <code>a</code>, <code>x</code>, <code>Esc</code>, <code>?</code>  the same
            muscle memory as GitHub, Linear, and Gmail.
          </li>
          <li>
            <strong>Accessibility as table stakes.</strong> Enterprise procurement asks
            about WCAG before signing. Skip link, focus-visible rings, semantic landmarks,
            aria-live counters, and <code>prefers-reduced-motion</code> are wired in, not
            bolted on.
          </li>
          <li>
            <strong>Operational telemetry surface.</strong> The dashboard strip at the top
            of the gallery is the same pattern as a campaign overview: total / visible /
            selected / size, updated live as filters change.
          </li>
        </ul>
      </Card>

      <Card>
        <h2>Stack and why</h2>
        <ul>
          <li>
            <strong>React 19 + TypeScript</strong>  strict types end-to-end. No
            <code>any</code>.
          </li>
          <li>
            <strong>Vite</strong>  fast dev loop matters when you iterate on dashboard
            UI all day.
          </li>
          <li>
            <strong>styled-components</strong> with a typed <code>DefaultTheme</code>
            theming centralized in <code>src/styles/theme.ts</code>.
          </li>
          <li>
            <strong>react-router-dom v7</strong>  routing + URL-state via
            <code>useSearchParams</code>.
          </li>
          <li>
            <strong>jszip</strong> for client-side bundle export. No server round-trip.
          </li>
          <li>
            <strong>Native fetch + IntersectionObserver</strong>  no data-fetching
            library. The project is small enough that React Query would be overkill.
          </li>
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
            every route. Bottom toolbar follows you everywhere.
          </li>
          <li>
            <strong>Size estimation without downloading.</strong> HEAD requests with a
            module-level cache. Scrolling never re-asks for a size we've already seen.
          </li>
          <li>
            <strong>Graceful CORS fallback.</strong> When Pexels refuses the blob fetch,
            individual downloads open in a new tab and the ZIP path skips the asset and
            reports it in the progress counter.
          </li>
        </ul>
      </Card>

      <Card>
        <h2>About me</h2>
        <p>
          Niharika Immadi  MS Computer Science (AI/ML), Cal State East Bay. I enjoy
          building product surfaces that feel obvious to use, then quietly defending them
          with strong types, accessibility defaults, and observability.
        </p>
      </Card>
    </Wrap>
  );
}
