export const theme = {
  colors: {
    bg: "#0f1115",
    surface: "#161922",
    surfaceAlt: "#1d2230",
    border: "#2a3040",
    text: "#e8ecf3",
    textMuted: "#9aa3b2",
    accent: "#6ea8ff",
    accentHover: "#8cbcff",
    danger: "#ff6b6b",
    success: "#4ade80",
  },
  breakpoints: {
    tablet: "640px",
    desktop: "1024px",
  },
  radius: "12px",
  shadow: "0 6px 24px rgba(0,0,0,0.35)",
} as const;

export type Theme = typeof theme;

declare module "styled-components" {

  export interface DefaultTheme extends Theme {}
}
