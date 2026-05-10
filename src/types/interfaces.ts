import type Pokemon from "../interfaces/Pokemon";

export interface AppState {
  results: Pokemon[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  throwError: boolean;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

export interface AppViewProps {
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

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: PokemonListItem[];
  next: string | null;
}

export interface PokemonDetailsResponse {
  id: number;
  name: string;
}

export interface PokemonSpeciesResponse {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
}