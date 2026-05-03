import { Component } from "react";
import Header from "./components/Header";
import Search from "./components/Search";
import CardList from "./components/CardList";
import ErrorBoundary from "./components/ErrorBoundary";
import type Pokemon from "./interfaces/Pokemon";

interface AppState {
  results: Pokemon[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  throwError: boolean;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

interface AppViewProps {
  results: Pokemon[];
  loading: boolean;
  error: string | null;
  throwError: boolean;
  page: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onSearch: (term: string) => void;
  onTriggerError: () => void;
  onNext: () => void;
  onPrev: () => void;
}

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  results: PokemonListItem[];
  next: string | null;
}

interface PokemonDetailsResponse {
  id: number;
  name: string;
}

interface PokemonSpeciesResponse {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
}

const normalizeText = (value: string) =>
  value
    .replace(/[\n\f\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getSpeciesDescription = (species: PokemonSpeciesResponse) => {
  const englishEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === "en",
  );

  return englishEntry
    ? normalizeText(englishEntry.flavor_text)
    : "No description available.";
};

const fetchPokemonDetails = async (url: string): Promise<Pokemon> => {
  const pokemonResponse = await fetch(url);

  if (!pokemonResponse.ok) {
    throw new Error(`Server error: ${pokemonResponse.status}`);
  }

  const pokemon = (await pokemonResponse.json()) as PokemonDetailsResponse;
  const speciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`,
  );

  if (!speciesResponse.ok) {
    throw new Error(`Server error: ${speciesResponse.status}`);
  }

  const species = (await speciesResponse.json()) as PokemonSpeciesResponse;

  return {
    name: pokemon.name,
    url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
    description: getSpeciesDescription(species),
  };
};

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
    const pageSize = this.state.pageSize;

    this.setState({ loading: true, error: null });

    try {
      if (trimmed) {
        const pokemon = await fetchPokemonDetails(
          `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(trimmed.toLowerCase())}`,
        );

        this.setState({
          results: [pokemon],
          loading: false,
          page: 0,
          hasNext: false,
          searchTerm: trimmed,
        });
        return;
      }

      const offset = page * pageSize;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`,
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = (await response.json()) as PokemonListResponse;
      const results = await Promise.all(
        data.results.map((item) => fetchPokemonDetails(item.url)),
      );

      this.setState({
        results,
        loading: false,
        page,
        hasNext: Boolean(data.next),
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
