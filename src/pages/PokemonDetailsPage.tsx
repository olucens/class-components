import { useEffect, useState } from "react";
import type Pokemon from "../interfaces/Pokemon";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { useParams } from "react-router-dom";

interface PokemonDetailsPageProps {
  pokemonId: string;
}

export default function PokemonDetailsPage() {
  const { pokemonId } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemonId) {
      setError("No Pokemon selected");
      return;
    }

    const fetchPokemonDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemonId)}/`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch Pokemon: ${response.status}`);
        }

        const data = await response.json();
        const speciesResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`
        );

        if (!speciesResponse.ok) {
          throw new Error(`Failed to fetch species: ${speciesResponse.status}`);
        }

        const speciesData = await speciesResponse.json();
        const englishEntry = speciesData.flavor_text_entries.find(
          (entry: { language: { name: string } }) =>
            entry.language.name === "en"
        );

        const description = englishEntry
          ? englishEntry.flavor_text.replace(/[\n\f\r]+/g, " ").trim()
          : "No description available.";

        setPokemon({
          name: data.name,
          url: `https://pokeapi.co/api/v2/pokemon/${data.id}/`,
          description,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemonId]);

  const id = pokemon?.url?.split("/").filter(Boolean).pop();
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!pokemon) {
    return null;
  }

  return (
    <div className="pokemon-details">
      <div className="pokemon-details__content">
        <img src={image} alt={pokemon.name} className="pokemon-details__image" />
        <div className="pokemon-details__info">
          <h2 className="pokemon-details__name">{pokemon.name}</h2>
          <p className="pokemon-details__id">#{id}</p>
          <p className="pokemon-details__description">{pokemon.description}</p>
        </div>
      </div>
    </div>
  );
}