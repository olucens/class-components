import { Component } from "react";
import type Pokemon from "../interfaces/Pokemon";

class Card extends Component<Pokemon> {
  render() {
    const { name, url, description } = this.props;
    const id = url.split("/").filter(Boolean).pop();
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return (
      <div className="card">
        <img src={image} alt={name} />
        <div className="card__info">
          <h3 className="card__name">{name}</h3>
          <p className="card__description">#{id}</p>
          <p className="card__desc-text">{description}</p>
        </div>
      </div>
    );
  }
}

export default Card;
