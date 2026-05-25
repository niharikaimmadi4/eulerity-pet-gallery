import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  html {
    background: ${({ theme }) => theme.colors.bg};
    font-feature-settings: "cv11", "ss01", "ss03";
  }
  body {
    margin: 0;
    font-family: ${({ theme }) => theme.font.body};
    /* Transparent body so the fixed Aurora layer behind #root is visible. */
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: -0.005em;
    overflow-x: hidden;
  }
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; }
  a:hover { color: ${({ theme }) => theme.colors.accentHover}; }
  button { font-family: inherit; }
  img { display: block; max-width: 100%; }

  /* Accessibility: visible focus ring for keyboard users only. */
  :focus { outline: none; }
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
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

  /* Selection color. */
  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: #0a0b10;
  }

  /* Scrollbar polish. */
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.08);
    border-radius: 6px;
  }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }
`;
