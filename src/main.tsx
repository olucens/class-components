import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import "./index.css";
import MainPage from "./pages/MainPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import PokemonDetailsPage from "./pages/PokemonDetailsPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}> 
          <Route path="details/:pokemonId" element={<PokemonDetailsPage />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
	<Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={ <Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
