import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { KeyboardHelp } from "./KeyboardHelp";
import { Navbar } from "./Navbar";
import { SelectionToolbar } from "./SelectionToolbar";

const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 20px 120px;
`;

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: 0;
  background: ${({ theme }) => theme.colors.accent};
  color: #0b0e14;
  padding: 8px 14px;
  border-radius: 0 0 8px 0;
  font-weight: 600;
  z-index: 100;

  &:focus {
    left: 0;
    outline: 3px solid ${({ theme }) => theme.colors.text};
  }
`;

export function Layout() {
  return (
    <>
      <SkipLink href="#main-content">Skip to content</SkipLink>
      <Navbar />
      <Main id="main-content" tabIndex={-1}>
        <Outlet />
      </Main>
      <SelectionToolbar />
      <KeyboardHelp />
    </>
  );
}
