import styled, { css, keyframes } from "styled-components";

const drift1 = keyframes`
  0%, 100% { transform: translate3d(0%, 0%, 0) scale(1); }
  33%      { transform: translate3d(8%, 6%, 0) scale(1.08); }
  66%      { transform: translate3d(-6%, 10%, 0) scale(0.96); }
`;

const drift2 = keyframes`
  0%, 100% { transform: translate3d(0%, 0%, 0) scale(1); }
  33%      { transform: translate3d(-10%, 4%, 0) scale(0.94); }
  66%      { transform: translate3d(6%, -8%, 0) scale(1.1); }
`;

const drift3 = keyframes`
  0%, 100% { transform: translate3d(0%, 0%, 0) scale(1.05); }
  50%      { transform: translate3d(4%, -10%, 0) scale(0.92); }
`;

const Stage = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background: ${({ theme }) => theme.colors.bg};
`;

// Per-variant CSS chunks built with the styled-components `css` helper so
// keyframes objects interpolate to their generated animation names instead
// of stringifying to "[object Object]".
const variantOneCss = css`
  top: -20%;
  left: -10%;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.55), transparent 60%);
  animation: ${drift1} 22s ease-in-out infinite;
`;

const variantTwoCss = css`
  top: 10%;
  right: -20%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.42), transparent 60%);
  animation: ${drift2} 28s ease-in-out infinite;
`;

const variantThreeCss = css`
  bottom: -30%;
  left: 20%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.42), transparent 60%);
  animation: ${drift3} 30s ease-in-out infinite;
`;

const Blob = styled.div<{ $variant: 1 | 2 | 3 }>`
  position: absolute;
  width: 60vmax;
  height: 60vmax;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  mix-blend-mode: screen;
  will-change: transform;

  ${({ $variant }) =>
    $variant === 1 ? variantOneCss : $variant === 2 ? variantTwoCss : variantThreeCss}
`;

const Grain = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/></svg>");
  opacity: 0.06;
  mix-blend-mode: overlay;
`;

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(7, 8, 12, 0.5) 90%);
`;

/**
 * Aurora — three slowly drifting gradient blobs blurred together over the page
 * background, finished with a subtle film-grain overlay and corner vignette.
 * Sits behind all content via z-index: -1.
 */
export function Aurora() {
  return (
    <Stage aria-hidden="true">
      <Blob $variant={1} />
      <Blob $variant={2} />
      <Blob $variant={3} />
      <Grain />
      <Vignette />
    </Stage>
  );
}
