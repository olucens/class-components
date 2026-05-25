import type Pokemon from "../interfaces/Pokemon";

interface CardProps extends Pokemon {
  onClick?: (name: string) => void;
}

export default function Card(props: CardProps) {
  const { name, url, description, onClick } = props;
  const id = url.split("/").filter(Boolean).pop();
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  const handleClick = () => {
    onClick?.(name);
  };

  return (
    <div
      className="card"
      onClick={handleClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <img src={image} alt={name} />
      <div className="card__info">
        <h3 className="card__name">{name}</h3>
        <p className="card__description">#{id}</p>
        <p className="card__desc-text">{description}</p>
      </div>
    </div>
  );
}
