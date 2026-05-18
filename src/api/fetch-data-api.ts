import type Pokemon from "../interfaces/Pokemon";
import type {
    PokemonDetailsResponse,
    PokemonListResponse,
    PokemonSpeciesResponse,
} from "../types/interfaces";

const SEARCH_HISTORY_KEY = "searchHistory";

type CachedPokemonMap = Record<string, Pokemon>;

const normalizeTerm = (term: string) => term.trim().toLowerCase();

const normalizeText = (value: string) =>
    value.replace(/[\n\f\r]+/g, " ").replace(/\s+/g, " ").trim();

export const getSpeciesDescription = (species: PokemonSpeciesResponse) => {
    const englishEntry = species.flavor_text_entries.find(
        (entry) => entry.language.name === "en",
    );

    return englishEntry
        ? normalizeText(englishEntry.flavor_text)
        : "No description available.";
};

const readSearchCache = (): CachedPokemonMap => {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);

    if (!raw) {
        return {};
    }

    try {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
            return parsed.reduce<CachedPokemonMap>((accumulator, item) => {
                if (
                    item &&
                    typeof item === "object" &&
                    "key" in item &&
                    "value" in item
                ) {
                    const entry = item as { key: string; value: Pokemon };
                    accumulator[normalizeTerm(entry.key)] = entry.value;
                }
                return accumulator;
            }, {});
        }

        return parsed as CachedPokemonMap;
    } catch {
        return {};
    }
};

const writeSearchCache = (entries: CachedPokemonMap) => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(entries));
};

export const cachePokemon = (pokemon: Pokemon) => {
    const key = normalizeTerm(pokemon.name);

    if (!key) {
        return;
    }

    const cache = readSearchCache();
    cache[key] = pokemon;

    writeSearchCache(cache);
};

export const getCachedPokemonMatches = (term: string): Pokemon[] => {
    const key = normalizeTerm(term);

    if (!key) {
        return [];
    }

    const cache = readSearchCache();
    return Object.entries(cache)
        .filter(([pokemonName]) => pokemonName.includes(key) || key.includes(pokemonName))
        .map(([, pokemon]) => pokemon)
        .sort((left, right) => left.name.localeCompare(right.name));
};

export const fetchPokemonDetails = async (url: string): Promise<Pokemon> => {
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

export const fetchPokemonPage = async (
    page: number,
    pageSize: number,
): Promise<{ results: Pokemon[]; hasNext: boolean }> => {
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

    results.forEach(cachePokemon);

    return {
        results,
        hasNext: Boolean(data.next),
    };
};

export const fetchPokemonByTerm = async (term: string): Promise<Pokemon[]> => {
    const cachedPokemon = getCachedPokemonMatches(term);

    if (cachedPokemon.length > 0) {
        return cachedPokemon;
    }

    const normalizedTerm = normalizeTerm(term);
    const pokemon = await fetchPokemonDetails(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(normalizedTerm)}`,
    );

    cachePokemon(pokemon);

    return [pokemon];
};
