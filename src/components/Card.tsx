import { Component } from 'react'

interface CardProps {
  name: string
  url: string
}

class Card extends Component<CardProps> {
  render() {
    const { name, url } = this.props
    const id = url.split('/').filter(Boolean).pop()
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

    return (
      <div className="card">
        <img src={image} alt={name} />
        <div className="card__info">
          <h3 className="card__name">{name}</h3>
          <p className="card__description">#{id}</p>
        </div>
      </div>
    )
  }
}

export default Card