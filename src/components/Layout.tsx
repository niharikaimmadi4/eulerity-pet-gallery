import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Navbar } from "./Navbar";
import { SelectionToolbar } from "./SelectionToolbar";

const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 20px 120px;
`;

export function Layout() {
  return (
    <>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
      <SelectionToolbar />
    </>
  );
}
