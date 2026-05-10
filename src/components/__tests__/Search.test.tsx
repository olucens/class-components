import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '../../test-utils'
import Search from '../Search'

describe('Search', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders input and button', () => {
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)

    expect(screen.getByPlaceholderText(/Search Pokémon/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('reads saved term from localStorage', () => {
    window.localStorage.setItem('searchTerm', 'Charmander')
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)

    expect(screen.getByDisplayValue('Charmander')).toBeInTheDocument()
  })

  it('types and triggers search saving to localStorage and calls callback', async () => {
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)

    const input = screen.getByPlaceholderText(/Search Pokémon/i)
    await userEvent.type(input, '  Pikachu  ')
    await userEvent.click(screen.getByRole('button', { name: /search/i }))

    expect(onSearch).toHaveBeenCalledWith('Pikachu')
    expect(window.localStorage.getItem('searchTerm')).toBe('Pikachu')
  })
})
