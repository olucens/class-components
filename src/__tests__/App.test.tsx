import { render, screen, waitFor } from '../test-utils'
import App from '../App'
import { vi } from 'vitest'

const originalFetch = globalThis.fetch

describe('App integration', () => {
  it('loads list and shows card', async () => {
    // mock fetch sequence used by App: list -> details -> species
    globalThis.fetch = vi.fn()
      // first call: list
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }], next: null }) })
      // second call: details
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, name: 'bulbasaur' }) })
      // third call: species
      .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: [{ flavor_text: 'A strange seed.', language: { name: 'en' } }] }) })

    render(<App />)

    const item = await screen.findByText(/bulbasaur/i)
    expect(item).toBeInTheDocument()
    globalThis.fetch = originalFetch
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

  it('triggerError button causes ErrorBoundary fallback', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    const btn = screen.getByRole('button', { name: /trigger error/i })
    await waitFor(() => btn.click())

    await waitFor(() => expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument())
    consoleSpy.mockRestore()
  })
})
