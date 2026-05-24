import styled from "styled-components";

const Wrap = styled.article`
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h1 { margin: 0; font-size: 32px; }
  h2 { margin: 16px 0 4px; font-size: 18px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.text}; line-height: 1.6; }
  ul { margin: 0; padding-left: 18px; color: ${({ theme }) => theme.colors.text}; line-height: 1.7; }
`;

const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 22px;
`;

export function AboutPage() {
  return (
    <Wrap>
      <h1>About this project</h1>
      <p>
        Built as a submission for the Eulerity front-end hackathon. The goal was a small,
        polished pet gallery with selection, search, sort, and download flows  the kinds of
        interactions a content-heavy product is built from.
      </p>

      <Card>
        <h2>Stack</h2>
        <ul>
          <li>React 19 + TypeScript, scaffolded with Vite</li>
          <li>styled-components for theming and component styling</li>
          <li>react-router-dom v7 for routing</li>
          <li>Native fetch + IntersectionObserver  no extra data libraries</li>
        </ul>
      </Card>

      <Card>
        <h2>What's wired up</h2>
        <ul>
          <li>Custom <code>usePets</code> hook with explicit loading, error, and empty states</li>
          <li>Search filter on title and description, debounced for snappier typing</li>
          <li>Four sort modes (A–Z, Z–A, newest, oldest)</li>
          <li>Multi-select that persists across routes via React context</li>
          <li>Live total file size estimated from <code>Content-Length</code> HEAD requests</li>
          <li>Infinite scroll (IntersectionObserver, page size 8)</li>
          <li>Responsive grid: 1 / 2 / 4 columns</li>
          <li>Detail route at <code>/pets/:id</code> with single-image download</li>
          <li>Batch download with graceful fallback when CORS blocks the blob fetch</li>
        </ul>
      </Card>

      <Card>
        <h2>About me</h2>
        <p>
          Niharika Immadi  MS Computer Science (AI/ML), Cal State East Bay. I enjoy
          building product surfaces that feel obvious to use, then quietly defending them
          with strong types, accessibility defaults, and instrumentation.
        </p>
      </Card>
    </Wrap>
  );
}
