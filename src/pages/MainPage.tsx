import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import CardList from "../components/CardList";
import ErrorBoundary from "../components/ErrorBoundary";
import PokemonDetailsPage from "./PokemonDetailsPage";
import { fetchPokemonByTerm, fetchPokemonPage } from "../api/fetch-data-api";
import type Pokemon from "../interfaces/Pokemon";

const PAGE_SIZE = 20;

export default function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [throwError, setThrowError] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "0", 10);
  const detailsId = searchParams.get("details");
  const searchTerm = localStorage.getItem("searchTerm") ?? "";

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
        const { results: pageResults, hasNext: hasMorePages } =
          await fetchPokemonPage(pageNum, PAGE_SIZE);
        setResults(pageResults);
        setSearchParams({ page: pageNum.toString() });
        setHasNext(hasMorePages);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setResults([]);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchData(searchTerm, currentPage);
    // Note: Intentionally excluding searchTerm and currentPage from deps
    // because they come from localStorage/URL, not props.
    // This effect should only run once on component mount.
  }, []);

  const handleSearch = (term: string) => {
    fetchData(term, 0);
  };

  const handleCardClick = (pokemonName: string) => {
    setSearchParams({ page: currentPage.toString(), details: pokemonName });
  };

  const handleCloseDetails = () => {
    setSearchParams({ page: currentPage.toString() });
  };

  const nextPage = () => {
    if (hasNext) {
      fetchData("", currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      fetchData("", currentPage - 1);
    }
  };

  const triggerError = () => {
    setThrowError(true);
  };

  const handleBoundaryReset = () => {
    setThrowError(false);
  };

  if (throwError) {
    throw new Error("Test error triggered!");
  }

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

          {detailsId && (
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
                <PokemonDetailsPage pokemonId={detailsId} />
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}