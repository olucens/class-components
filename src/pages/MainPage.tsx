import { useLocation, useNavigate, useSearchParams, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import CardList from "../components/CardList";
import ErrorBoundary from "../components/ErrorBoundary";
import { fetchPokemonByTerm, fetchPokemonPage } from "../api/fetch-data-api";
import type Pokemon from "../interfaces/Pokemon";
import useLocalStorage from "../hooks/useLocalStorage";

const PAGE_SIZE = 20;

export default function MainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const isDetailsOpen = location.pathname.includes('/details/');
  const currentPage = parseInt(searchParams.get("page") || "0", 10);
  
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [throwError, setThrowError] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [searchTerm, setSearchTerm] = useLocalStorage("searchTerm", "");

  const fetchData = async (term: string, pageNum = 0) => {
    const trimmed = term.trim();
    setLoading(true);
    setError(null);

    try {
      if (trimmed) {
        const searchResults = await fetchPokemonByTerm(trimmed);
        setResults(searchResults);
        setSearchParams({ page: "0" });
        setHasNext(false);
      } else {
        const { results: pageResults, hasNext: hasMorePages } = await fetchPokemonPage(pageNum, PAGE_SIZE);
        setResults(pageResults);
        setSearchParams({ page: pageNum.toString() });
        setHasNext(hasMorePages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResults([]);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(searchTerm, currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchData(term, 0);
  };

  const handleCardClick = (pokemonName: string) => {
    navigate(`/details/${pokemonName}?page=${currentPage}`);
  };

  const handleCloseDetails = () => {
    navigate(`/?page=${currentPage}`);
  };

  const nextPage = () => {
    if (hasNext) fetchData("", currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) fetchData("", currentPage - 1);
  };

  const triggerError = () => setThrowError(true);
  const handleBoundaryReset = () => setThrowError(false);

  if (throwError) throw new Error("Test error triggered!");

  return (
    <ErrorBoundary onReset={handleBoundaryReset}>
      <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
        <Header />
        <div style={{ display: "flex", flex: 1 }}>
          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <section className="search-panel">
              <Search onSearch={handleSearch} />
            </section>

            <section className="results-panel" style={{ flex: 1, overflowY: "auto" }}>
              <CardList
                results={results}
                loading={loading}
                error={error}
                onCardClick={handleCardClick}
              />

              {!loading && !error && results.length > 0 && (
                <div className="pagination">
                  <button onClick={prevPage} disabled={currentPage === 0}>
                    Prev
                  </button>
                  <span>Page {currentPage + 1}</span>
                  <button onClick={nextPage} disabled={!hasNext}>
                    Next
                  </button>
                </div>
              )}
            </section>

            <button className="error-trigger" onClick={triggerError}>
              Trigger Error
            </button>
          </main>

          {isDetailsOpen && (
            <div className="details-wrapper">
              <button
                className="details-wrapper__close-btn"
                onClick={handleCloseDetails}
                title="Close details panel"
                aria-label="Close details"
              >
                ×
              </button>
              <div className="details-wrapper__content">
                <Outlet />
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}