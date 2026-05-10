import { expect, it, vi } from 'vitest'
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

    // should call once with trimmed value and save trimmed value
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith('Pikachu')
    expect(window.localStorage.getItem('searchTerm')).toBe('Pikachu')

    // clear input and type the same term with leading spaces; since trimmed value
    // equals saved value, handler should not call onSearch again
    await userEvent.clear(input)
    await userEvent.type(input, 'Pikachu  ')
    await userEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem('searchTerm')).toBe('Pikachu')
  })

  it('triggers search by pressing Enter and triggers search saving to localStorage and calls callback', async () => {
    const onSearch = vi.fn()
    render(<Search onSearch={onSearch} />)

    const input = screen.getByPlaceholderText(/Search Pokémon/i)
    await userEvent.type(input, '  Pikachu  ')
    await userEvent.type(input, '{enter}')

    // Enter should trigger search with trimmed value
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith('Pikachu')
    expect(window.localStorage.getItem('searchTerm')).toBe('Pikachu')

    // clear and re-enter with leading spaces; pressing Enter should not call again
    await userEvent.clear(input)
    await userEvent.type(input, 'Pikachu  ')
    await userEvent.type(input, '{enter}')
    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem('searchTerm')).toBe('Pikachu')
  })
})
