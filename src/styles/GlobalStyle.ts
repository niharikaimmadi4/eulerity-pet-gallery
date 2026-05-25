import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  html {
    /* Solid fallback so the bg color shows during page paint before
       the gradient image lays down on the body. */
    background: ${({ theme }) => theme.colors.bg};
  }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    /* Vertical atmosphere: deep navy at the top, warmer dusty navy at the
       bottom. Layered with a soft sky-blue halo at the very top edge. */
    background-color: ${({ theme }) => theme.colors.bg};
    background-image:
      ${({ theme }) => theme.gradients.halo},
      ${({ theme }) => theme.gradients.pageBg};
    background-repeat: no-repeat, no-repeat;
    background-size: 100% 600px, 100% 100%;
    background-attachment: fixed, fixed;
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
`;
