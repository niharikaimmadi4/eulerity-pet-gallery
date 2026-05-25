import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: ${({ theme }) => theme.colors.bg};
    background-image: ${({ theme }) => theme.gradients.halo};
    background-repeat: no-repeat;
    background-size: 100% 600px;
    background-attachment: fixed;
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
  }
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; }
  a:hover { color: ${({ theme }) => theme.colors.accentHover}; }
  button { font-family: inherit; }
  img { display: block; max-width: 100%; }

  /* Accessibility: visible focus ring for keyboard users only. */
  :focus { outline: none; }
  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Respect users who ask for less motion. */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
