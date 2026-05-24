import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Ring = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.accent};
  animation: ${spin} 0.9s linear infinite;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <Wrap role="status" aria-live="polite">
      <Ring />
      <span>{label}</span>
    </Wrap>
  );
}
