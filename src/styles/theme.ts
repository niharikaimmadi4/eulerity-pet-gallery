export const theme = {
  colors: {
    // Deep midnight-navy base with cool blue undertones, inspired by
    // contemporary mobile dark themes (Apple Sky, Linear, etc.).
    bg: "#070b1a",
    surface: "#0f1530",
    surfaceAlt: "#161e3d",
    border: "#1f2851",
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
    // Soft sky-blue halo at the top of the page; pure blue, no purple.
    brand: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
    surface: "linear-gradient(180deg, rgba(96,165,250,0.10) 0%, rgba(96,165,250,0) 100%)",
    halo: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(96,165,250,0.22), transparent 70%)",
  },
  breakpoints: {
    tablet: "640px",
    desktop: "1024px",
  },
  radius: "12px",
  shadow: "0 6px 24px rgba(0,0,0,0.45)",
} as const;

export type Theme = typeof theme;

declare module "styled-components" {

  export interface DefaultTheme extends Theme {}
}
