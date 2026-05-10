import { render, screen } from '../../test-utils'
import CardList from '../CardList'

const sample = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/', description: 'desc' }]

describe('CardList', () => {
  it('shows spinner when loading', () => {
    const { container } = render(<CardList results={[]} loading={true} error={null} />)
    expect(container.querySelector('.spinner__circle')).toBeInTheDocument()
  })

  it('shows error when error present', () => {
    render(<CardList results={[]} loading={false} error={'Server failed'} />)
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText('Server failed')).toBeInTheDocument()
  })

  it('shows no-results when empty', () => {
    render(<CardList results={[]} loading={false} error={null} />)
    expect(screen.getByText(/No pokémon found/i)).toBeInTheDocument()
  })

  it('renders cards for results', () => {
    render(<CardList results={sample as any} loading={false} error={null} />)
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument()
  })
})
