export const theme = {
  colors: {
    bg: "#0a0d14",
    surface: "#141826",
    surfaceAlt: "#1c2236",
    border: "#2a3147",
    text: "#eef1f8",
    textMuted: "#8993a8",
    accent: "#7c9eff",
    accentHover: "#a4bcff",
    accentMuted: "#3a4a7a",
    danger: "#ff6b6b",
    success: "#4ade80",
    warning: "#fbbf24",
  },
  gradients: {
    brand: "linear-gradient(135deg, #7c9eff 0%, #b07cff 50%, #ff7cb0 100%)",
    surface: "linear-gradient(180deg, rgba(124,158,255,0.08) 0%, rgba(124,158,255,0) 100%)",
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
