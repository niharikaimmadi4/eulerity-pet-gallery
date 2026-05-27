export const theme = {
  colors: {
    // Soft cream base, slightly cool. Surfaces share the same color so the
    // neumorphic shadows do the visual lifting.
    bg: "#e8ecf3",
    surface: "#e8ecf3",
    surfaceAlt: "#dde2eb",
    surfaceSolid: "#e8ecf3",
    border: "rgba(174, 174, 192, 0.18)",
    borderStrong: "rgba(174, 174, 192, 0.32)",
    text: "#2a2d3a",
    textMuted: "#6b7080",
    textSubtle: "#9aa0b0",
    accent: "#ff7a6b",
    accentHover: "#ff8d80",
    accentMuted: "rgba(255, 122, 107, 0.18)",
    secondary: "#8a8cf0",
    secondaryMuted: "rgba(138, 140, 240, 0.18)",
    danger: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
    // Neumorphic shadow channel colors. Light from top-left, dark from
    // bottom-right; tuned soft to keep the design dreamy and not harsh.
    nmLight: "rgba(255, 255, 255, 0.95)",
    nmDark: "rgba(174, 174, 192, 0.45)",
  },
  // Frosted-glass surfaces. Translucent white + backdrop blur over the
  // gradient-mesh background give the premium "light glass" look. The mesh
  // showing through is what separates this from flat cards.
  glass: {
    bg: "rgba(255, 255, 255, 0.55)",
    bgStrong: "rgba(255, 255, 255, 0.72)",
    bgSubtle: "rgba(255, 255, 255, 0.38)",
    border: "rgba(255, 255, 255, 0.7)",
    blur: "blur(22px) saturate(165%)",
    blurStrong: "blur(30px) saturate(180%)",
    // A faint top highlight (inset) sells the glass edge catching light.
    sheen: "inset 0 1px 0 rgba(255, 255, 255, 0.85)",
    shadow:
      "0 10px 36px rgba(86, 88, 150, 0.14), 0 2px 8px rgba(86, 88, 150, 0.06)",
    shadowHover:
      "0 22px 64px rgba(86, 88, 150, 0.22), 0 6px 16px rgba(86, 88, 150, 0.10)",
  },
  gradients: {
    brand: "linear-gradient(135deg, #ff8d80 0%, #ff7a6b 60%, #ff6859 100%)",
    secondary: "linear-gradient(135deg, #a4a6f5 0%, #8a8cf0 100%)",
    surface: "linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)",
    // Aurora wash as a single smooth VERTICAL gradient. Stretched over the
    // full document height on #root, so scrolling down moves continuously
    // through coral -> lilac -> violet -> sky. A linear gradient cannot band
    // or seam. A faint diagonal coral glow on top adds organic warmth without
    // introducing any hard edge (it fades to its own zero-alpha hue).
    mesh:
      "radial-gradient(120% 80% at 85% 0%, rgba(255, 138, 128, 0.16) 0%, rgba(255, 138, 128, 0) 55%)," +
      "linear-gradient(180deg," +
        "rgba(255, 138, 128, 0.14) 0%," +
        "rgba(214, 158, 198, 0.11) 30%," +
        "rgba(150, 150, 235, 0.11) 60%," +
        "rgba(120, 190, 240, 0.13) 100%)",
  },
  shadows: {
    // Raised: standard neumorphic extrusion.
    raised:
      "-8px -8px 18px rgba(255, 255, 255, 0.95), 8px 8px 18px rgba(174, 174, 192, 0.45)",
    raisedSmall:
      "-4px -4px 10px rgba(255, 255, 255, 0.9), 4px 4px 10px rgba(174, 174, 192, 0.4)",
    raisedLarge:
      "-12px -12px 28px rgba(255, 255, 255, 1), 12px 12px 28px rgba(174, 174, 192, 0.5)",
    // Pressed: inset shadows for active/selected toggle states.
    pressed:
      "inset -3px -3px 8px rgba(255, 255, 255, 0.85), inset 3px 3px 8px rgba(174, 174, 192, 0.4)",
    pressedSmall:
      "inset -2px -2px 5px rgba(255, 255, 255, 0.85), inset 2px 2px 5px rgba(174, 174, 192, 0.4)",
  },
  breakpoints: {
    tablet: "640px",
    desktop: "1024px",
  },
  radius: "20px",
  radiusSmall: "14px",
  radiusPill: "999px",
  shadow: "0 10px 30px rgba(174, 174, 192, 0.25)",
  shadowSoft: "0 4px 16px rgba(174, 174, 192, 0.18)",
} as const;

export type Theme = typeof theme;

declare module "styled-components" {
  // Empty body is required: this merely binds styled-components' DefaultTheme
  // to our Theme type via module augmentation.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
