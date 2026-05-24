import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Layout } from "./components/Layout";
import { PetsProvider } from "./context/PetsContext";
import { SelectionProvider } from "./context/SelectionContext";
import { AboutPage } from "./pages/AboutPage";
import { GalleryPage } from "./pages/GalleryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PetDetailPage } from "./pages/PetDetailPage";
import { SelectedPage } from "./pages/SelectedPage";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PetsProvider>
        <SelectionProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<GalleryPage />} />
                <Route path="pets/:id" element={<PetDetailPage />} />
                <Route path="selected" element={<SelectedPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SelectionProvider>
      </PetsProvider>
    </ThemeProvider>
  );
}
