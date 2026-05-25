export const theme = {
  colors: {
    bg: "#07080c",
    bgRaised: "#0c0e14",
    surface: "rgba(20, 23, 36, 0.6)",
    surfaceSolid: "#11141f",
    surfaceAlt: "#171b2a",
    surfaceHover: "rgba(28, 32, 50, 0.65)",
    border: "rgba(255, 255, 255, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.14)",
    text: "#f3f5fb",
    textMuted: "#8993ad",
    textSubtle: "#5a6378",
    accent: "#a78bfa",
    accentHover: "#c4b1ff",
    accentMuted: "rgba(167, 139, 250, 0.18)",
    danger: "#ff6b6b",
    success: "#4ade80",
    warning: "#fbbf24",
  },
  gradients: {
    brand: "linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #fb923c 100%)",
    surface: "linear-gradient(180deg, rgba(167,139,250,0.05) 0%, rgba(167,139,250,0) 100%)",
    spotlight:
      "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(167,139,250,0.18), transparent 60%)",
    aurora1: "radial-gradient(ellipse 600px 400px at 20% 0%, rgba(167, 139, 250, 0.22), transparent 60%)",
    aurora2: "radial-gradient(ellipse 700px 500px at 80% 30%, rgba(236, 72, 153, 0.18), transparent 60%)",
    aurora3: "radial-gradient(ellipse 500px 400px at 50% 100%, rgba(96, 165, 250, 0.16), transparent 60%)",
  },
  font: {
    display: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  breakpoints: {
    tablet: "640px",
    desktop: "1024px",
  },
  radius: "16px",
  radiusSmall: "10px",
  shadow: "0 10px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
  shadowSoft: "0 4px 24px rgba(0,0,0,0.35)",
} as const;

export type Theme = typeof theme;

declare module "styled-components" {

  export interface DefaultTheme extends Theme {}
}
