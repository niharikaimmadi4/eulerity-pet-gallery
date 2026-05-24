import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrap = styled.div`
  text-align: center;
  padding: 64px 16px;
  h1 { margin: 0 0 8px; }
  p { color: ${({ theme }) => theme.colors.textMuted}; }
`;

export function NotFoundPage() {
  return (
    <Wrap>
      <h1>404</h1>
      <p>Couldn't find that page. <Link to="/">Back to the gallery</Link>.</p>
    </Wrap>
  );
}
