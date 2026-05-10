import { render, screen } from '../../test-utils'
import Card from '../Card'

describe('Card', () => {
  it('renders name, id and image alt', () => {
    render(<Card name="Bulbasaur" url="https://pokeapi.co/api/v2/pokemon/1/" description="Seed Pokémon" />)

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByAltText('Bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('Seed Pokémon')).toBeInTheDocument()
  })
})
