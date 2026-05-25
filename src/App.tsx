import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Layout } from "./components/Layout";
import { FavoritesProvider } from "./context/FavoritesContext";
import { PetsProvider } from "./context/PetsContext";
import { SelectionProvider } from "./context/SelectionContext";
import { AboutPage } from "./pages/AboutPage";
import { FavoritesPage } from "./pages/FavoritesPage";
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
          <FavoritesProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<GalleryPage />} />
                  <Route path="pets/:id" element={<PetDetailPage />} />
                  <Route path="selected" element={<SelectedPage />} />
                  <Route path="favorites" element={<FavoritesPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </FavoritesProvider>
        </SelectionProvider>
      </PetsProvider>
    </ThemeProvider>
  );
}
