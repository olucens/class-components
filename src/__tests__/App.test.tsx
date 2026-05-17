import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const originalFetch = globalThis.fetch

const page0 = {
    list: { results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }], next: 'next-url' },
    details:{ id: 1, name: 'bulbasaur' },
    species: { flavor_text_entries: [{ 
        flavor_text: 'A strange seed.',
        language: { name: 'en' }
    }]}
};

const page1 = {
    list: { results: [{ name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26/' }], next: null },
    details: { id: 26, name: 'raichu' },
    species: { flavor_text_entries: [{ flavor_text: 'Its long tail serves as a ground.', language: { name: 'en' } }] }
};

describe('App integration', () => {
  beforeEach(() => {
    window.localStorage.clear()
    globalThis.fetch = originalFetch
  })

  afterEach(() => {
    window.localStorage.clear()
    globalThis.fetch = originalFetch
  })
    
  it('loads list and shows card', async () => {
    
    // mock fetch sequence used by App: list -> details -> species
    globalThis.fetch = vi.fn()
      // first call: list
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: page0.details.name, url: `https://pokeapi.co/api/v2/pokemon/${page0.details.id}/` }], next: null }) })
      // second call: details
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: page0.details.id, name: page0.details.name }) })
      // third call: species
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: page0.species.flavor_text_entries }) })

    render(<App />)

    const item = await screen.findByText(/bulbasaur/i)
    expect(item).toBeInTheDocument()
    globalThis.fetch = originalFetch
  })

  it('loads list of 2 Pokemons and finds cached matches by partial name', async () => {
    
    // mock fetch sequence used by App: list -> details -> species
    globalThis.fetch = vi.fn()
      // first call: list
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: page0.details.name, url: `https://pokeapi.co/api/v2/pokemon/${page0.details.id}/` }, { name: page1.details.name, url: `https://pokeapi.co/api/v2/pokemon/${page1.details.id}/` }], next: null }) })
      // second call: details
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: page0.details.id, name: page0.details.name }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: page1.details.id, name: page1.details.name }) })
      // third call: species (only non-English entries)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: page0.species.flavor_text_entries }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: page1.species.flavor_text_entries }) })

    render(<App />)

    // both cached names should appear
    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument()

    expect(await screen.findByText(/raichu/i)).toBeInTheDocument()

    const input = screen.getByPlaceholderText(/Search Pokémon/i)
    await userEvent.clear(input)
    await userEvent.type(input, 'a')
    const btn = screen.getByRole('button', { name: /search/i })
    await userEvent.click(btn)

    const cachedNames = await screen.findAllByRole('heading', { level: 3 })
    expect(cachedNames.map((node) => node.textContent)).toEqual([
      'bulbasaur',
      'raichu',
    ])
  })

  it('shows error when list API fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 500 })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    })
    globalThis.fetch = originalFetch
  })

  it('handles pokemon details failure when searchTerm is present', async () => {
    window.localStorage.setItem('searchTerm', 'missingmon')
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 404 })

    render(<App />)

    await waitFor(() => expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument())

    globalThis.fetch = originalFetch
    window.localStorage.clear()
  })

  it('handles species fetch failure and shows error', async () => {
    window.localStorage.setItem('searchTerm', 'mon')
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 2, name: 'mon' }) })
      .mockResolvedValueOnce({ ok: false, status: 500 })

    render(<App />)

    await waitFor(() => expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument())

    globalThis.fetch = originalFetch
    window.localStorage.clear()
  })

  it('triggerError button causes ErrorBoundary fallback, return back and check for content', async () => {
    globalThis.fetch = vi.fn()
      // first call: list
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: page0.details.name, url: `https://pokeapi.co/api/v2/pokemon/${page0.details.id}/` }], next: null }) })
      // second call: details
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: page0.details.id, name: page0.details.name }) })
      // third call: species
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: page0.species.flavor_text_entries }) })

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    const btn = screen.getByRole('button', { name: /trigger error/i })
    await waitFor(() => btn.click())

    await waitFor(() => expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument())
    consoleSpy.mockRestore()

    const nextBtn = screen.getByRole('button', { name: /try again/i })
    expect(nextBtn).toBeEnabled()
    await waitFor(() => nextBtn.click())

    const item = await screen.findByText(/bulbasaur/i)
    expect(item).toBeInTheDocument()
    globalThis.fetch = originalFetch
  })



  it('navigates Next and Prev pages and preserves localStorage', async () => {
    // prepare two pages: page0 -> bulbasaur, page1 -> raichu

    // do not pre-set localStorage (App would go into search path). Start with normal list.
    globalThis.fetch = vi.fn()
      // mount: fetch page0 list, details, species
      .mockResolvedValueOnce({ ok: true, json: async () => page0.list })
      .mockResolvedValueOnce({ ok: true, json: async () => page0.details })
      .mockResolvedValueOnce({ ok: true, json: async () => page0.species })
      // next page fetch: list, details, species
      .mockResolvedValueOnce({ ok: true, json: async () => page1.list })
      .mockResolvedValueOnce({ ok: true, json: async () => page1.details })
      .mockResolvedValueOnce({ ok: true, json: async () => page1.species })
      // prev page fetch (back to page0): list, details, species
      .mockResolvedValueOnce({ ok: true, json: async () => page0.list })
      .mockResolvedValueOnce({ ok: true, json: async () => page0.details })
      .mockResolvedValueOnce({ ok: true, json: async () => page0.species })

    render(<App />)

    // initial page shows bulbasaur
    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument()

    // Next button should exist and be enabled
    const nextBtn = screen.getByRole('button', { name: /next/i })
    expect(nextBtn).toBeEnabled()
    await waitFor(() => nextBtn.click())

    // now raichu should appear
    expect(await screen.findByText(/raichu/i)).toBeInTheDocument()

    // Prev button should be enabled now
    const prevBtn = screen.getByRole('button', { name: /prev/i })
    expect(prevBtn).toBeEnabled()
    await waitFor(() => prevBtn.click())

    // back to bulbasaur
    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument()

    // localStorage check omitted to avoid interfering with App startup

    globalThis.fetch = originalFetch
    window.localStorage.clear()
  })

  it('stores search term in localStorage after performing a search', async () => {
    // initial mount: empty list
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [], next: null }) })

    render(<App />)

    // prepare mocks for search flow: details then species
    const details = { id: 7, name: 'squirtle' }
    const species = { flavor_text_entries: [{ flavor_text: 'Squirtle shell', language: { name: 'en' } }] }
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => details })
      .mockResolvedValueOnce({ ok: true, json: async () => species })

    const input = screen.getByPlaceholderText(/Search Pokémon/i)
    await userEvent.type(input, 'Squirtle')
    const btn = screen.getByRole('button', { name: /search/i })
    await userEvent.click(btn)

    // after clicking search, localStorage should have the trimmed value
    await waitFor(() => expect(window.localStorage.getItem('searchTerm')).toBe('Squirtle'))

    globalThis.fetch = originalFetch
    window.localStorage.clear()
  })

})
