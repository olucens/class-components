import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import MainPage from "./pages/MainPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import PokemonDetailsPage from "./pages/PokemonDetailsPage";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppProvider } from "./context/AppContext";
import { useAppContext } from "./context/useAppContext";

function AppRoutes() {
  const { resetError } = useAppContext();

  return (
    <ErrorBoundary onReset={resetError}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />}> 
            <Route path="details/:pokemonName" element={<PokemonDetailsPage />} />
          </Route>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={ <Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
