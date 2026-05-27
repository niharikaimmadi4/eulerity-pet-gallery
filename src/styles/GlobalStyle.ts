import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body { height: 100%; }
  html {
    background: ${({ theme }) => theme.colors.bg};
  }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${({ theme }) => theme.colors.bg};
  }

  /* The aurora wash lives on #root and spans its FULL height (= the whole
     document, not just the viewport). Because it scrolls with the page,
     scrolling down is one continuous coral -> violet -> sky transition with
     no fixed band and no possible seam. min-height keeps it covering short
     pages too. background-size 100% 100% stretches the single gradient over
     the entire scroll length. */
  #root {
    min-height: 100%;
    background: ${({ theme }) => theme.gradients.mesh}, ${({ theme }) => theme.colors.bg};
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-attachment: scroll;
  }
  a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; }
  a:hover { color: ${({ theme }) => theme.colors.accentHover}; }
  button { font-family: inherit; }
  img { display: block; max-width: 100%; }

  /* Accessibility: visible focus ring for keyboard users only. */
  :focus { outline: none; }
  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
    border-radius: 6px;
  }

  /* Selection color: warm coral. */
  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: white;
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
