import styled from "styled-components";

const Wrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.danger};
  background: rgba(255, 107, 107, 0.08);
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;

const Retry = styled.button`
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  &:hover { filter: brightness(1.1); }
`;

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Wrap role="alert">
      <strong>Could not load pets</strong>
      <span>{message}</span>
      {onRetry && <Retry onClick={onRetry}>Try again</Retry>}
    </Wrap>
  );
}
