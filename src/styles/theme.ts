export const theme = {
  colors: {
    // Deep midnight-navy at the top of the page, fading to a warmer dusty
    // navy at the bottom via the pageBg gradient. Inspired by ambient
    // smart-home control center designs.
    bg: "#070b1a",
    surface: "rgba(20, 27, 56, 0.55)",
    surfaceSolid: "#0f1530",
    surfaceAlt: "#161e3d",
    border: "rgba(255, 255, 255, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.14)",
    text: "#eaf0ff",
    textMuted: "#8b97b8",
    accent: "#60a5fa",
    accentHover: "#93c5fd",
    accentMuted: "#1e3a6e",
    danger: "#f87171",
    success: "#4ade80",
    warning: "#fbbf24",
  },
  gradients: {
    brand: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
    surface: "linear-gradient(180deg, rgba(96,165,250,0.10) 0%, rgba(96,165,250,0) 100%)",
    halo: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(96,165,250,0.22), transparent 70%)",
    pageBg:
      "linear-gradient(180deg, #050818 0%, #0a1024 35%, #14203f 75%, #1f2a55 100%)",
  },
  breakpoints: {
    tablet: "640px",
    desktop: "1024px",
  },
  radius: "16px",
  radiusSmall: "10px",
  shadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
  shadowSoft: "0 4px 20px rgba(0, 0, 0, 0.3)",
} as const;

export type Theme = typeof theme;

declare module "styled-components" {

  export interface DefaultTheme extends Theme {}
}
