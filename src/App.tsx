import { Component } from "react";
import Header from "./components/Header";
import Search from "./components/Search";
import CardList from "./components/CardList";
import ErrorBoundary from "./components/ErrorBoundary";
import { fetchPokemonByTerm, fetchPokemonPage } from "./api/fetch-data-api";
import type { AppState, AppViewProps } from "./types/interfaces";

class AppView extends Component<AppViewProps> {
  render() {
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
    } = this.props;

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
}

class App extends Component<Record<string, never>, AppState> {
  declare setState: Component<Record<string, never>, AppState>["setState"];

  state: AppState = {
    results: [],
    loading: false,
    error: null,
    searchTerm: localStorage.getItem("searchTerm") ?? "",
    throwError: false,
    page: 0,
    pageSize: 20,
    hasNext: false,
  };

  triggerError = () => {
    this.setState({ throwError: true });
  };

  handleBoundaryReset = () => {
    this.setState({ throwError: false });
  };

  componentDidMount() {
    this.fetchData(this.state.searchTerm, 0);
  }

  fetchData = async (term: string, page = 0) => {
    const trimmed = term.trim();

    this.setState({ loading: true, error: null });

    try {
      if (trimmed) {
        const results = await fetchPokemonByTerm(trimmed);

        this.setState({
          results,
          loading: false,
          page: 0,
          hasNext: false,
          searchTerm: trimmed,
        });

        return;
      }

      const { results, hasNext } = await fetchPokemonPage(
        page,
        this.state.pageSize,
      );

      this.setState({
        results,
        loading: false,
        page,
        hasNext,
        searchTerm: "",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.setState({
        error: message,
        loading: false,
        results: [],
        hasNext: false,
      });
    }
  };

  nextPage = () => {
    if (this.state.hasNext) {
      this.fetchData("", this.state.page + 1);
    }
  };

  prevPage = () => {
    if (this.state.page > 0) {
      this.fetchData("", this.state.page - 1);
    }
  };

  handleSearch = (term: string) => {
    this.setState({ searchTerm: term });
    this.fetchData(term, 0);
  };

  render() {
    const { results, loading, error, page, hasNext } = this.state;

    return (
      <ErrorBoundary onReset={this.handleBoundaryReset}>
        <AppView
          results={results}
          loading={loading}
          error={error}
          throwError={this.state.throwError}
          page={page}
          hasPrevious={page > 0}
          hasNext={hasNext}
          onSearch={this.handleSearch}
          onTriggerError={this.triggerError}
          onNext={this.nextPage}
          onPrev={this.prevPage}
        />
      </ErrorBoundary>
    );
  }
}

export default App;
