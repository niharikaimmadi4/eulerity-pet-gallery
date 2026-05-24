import styled from "styled-components";

const Wrap = styled.div`
  text-align: center;
  padding: 64px 16px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

export function EmptyState({
  title = "No pets to show",
  message = "Try adjusting your search or filters.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <Wrap>
      <Title>{title}</Title>
      <p>{message}</p>
    </Wrap>
  );
}
