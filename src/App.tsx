import { useEffect, useState } from "react";
import Header from "./components/Header";
import Search from "./components/Search";
import CardList from "./components/CardList";
import ErrorBoundary from "./components/ErrorBoundary";
import { fetchPokemonByTerm, fetchPokemonPage } from "./api/fetch-data-api";
import type { AppViewProps } from "./types/interfaces";
import type Pokemon from "./interfaces/Pokemon";

function AppView(props: AppViewProps) {
  const {
    results,
    loading,
    error,
    throwError,
    page,
    hasPrevious,
    hasNext,
    onSearch,
    onTriggerError,
    onNext,
    onPrev,
  } = props;

  if (throwError) {
    throw new Error("Test error triggered!");
  }

  return (
    <>
      <Header />
      <main>
        <section className="search-panel">
          <Search onSearch={onSearch} />
        </section>

        <section className="results-panel">
          <CardList results={results} loading={loading} error={error} />

          {!loading && !error && results.length > 0 && (
            <div className="pagination">
              <button onClick={onPrev} disabled={!hasPrevious}>
                Prev
              </button>
              <span>Page {page + 1}</span>
              <button onClick={onNext} disabled={!hasNext}>
                Next
              </button>
            </div>
          )}
        </section>
      </main>
      <button className="error-trigger" onClick={onTriggerError}>
        Trigger Error
      </button>
    </>
  );
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("searchTerm") ?? "",
  );
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [throwError, setThrowError] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const PAGE_SIZE = 20;

  const fetchData = async (term: string, pageNum = 0) => {
    const trimmed = term.trim();

    setLoading(true);
    setError(null);

    try {
      if (trimmed) {
        const searchResults = await fetchPokemonByTerm(trimmed);
        setResults(searchResults);
        setPage(0);
        setHasNext(false);
        setSearchTerm(trimmed);
      } else {
        const { results: pageResults, hasNext: hasMorePages } =
          await fetchPokemonPage(pageNum, PAGE_SIZE);
        setResults(pageResults);
        setPage(pageNum);
        setHasNext(hasMorePages);
        setSearchTerm("");
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
    fetchData(searchTerm, 0);
  }, []);

  // Обработчик поиска
  const handleSearch = (term: string) => {
    fetchData(term, 0);
  };

  // Навигация по страницам
  const nextPage = () => {
    if (hasNext) {
      fetchData("", page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      fetchData("", page - 1);
    }
  };

  const triggerError = () => {
    setThrowError(true);
  };

  const handleBoundaryReset = () => {
    setThrowError(false);
  };

  return (
    <ErrorBoundary onReset={handleBoundaryReset}>
      <AppView
        results={results}
        loading={loading}
        error={error}
        throwError={throwError}
        page={page}
        hasPrevious={page > 0}
        hasNext={hasNext}
        onSearch={handleSearch}
        onTriggerError={triggerError}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </ErrorBoundary>
  );
}
