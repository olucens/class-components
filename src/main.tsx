import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import MainPage from "./pages/MainPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import PokemonDetailsPage from "./pages/PokemonDetailsPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<MainPage />}> 
          <Route path="details/:pokemonId" element={<PokemonDetailsPage />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
