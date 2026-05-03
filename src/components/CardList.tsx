import { Component } from "react";
import Card from "./Card";
import Spinner from "./Spinner";
import type Pokemon from "../interfaces/Pokemon";

interface CardListProps {
  results: Pokemon[];
  loading: boolean;
  error: string | null;
}

class CardList extends Component<CardListProps> {
  render() {
    const { results, loading, error } = this.props;

    if (loading) return <Spinner />;

    if (error) {
      return (
        <div className="error">
          <p>😕 Something went wrong:</p>
          <p className="error__message">{error}</p>
        </div>
      );
    }

    if (results.length === 0) {
      return <p className="no-results">No pokémon found</p>;
    }

    return (
      <div className="card-list">
        {results.map((pokemon) => (
          <Card
            key={pokemon.name}
            name={pokemon.name}
            url={pokemon.url}
            description={pokemon.description}
          />
        ))}
      </div>
    );
  }
}

export default CardList;
