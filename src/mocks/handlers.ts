import * as msw from 'msw'

// Generic handlers for tests: list, details and species endpoints used by App
export const handlers = [
  // list endpoint (pagination)
  msw.rest.get('https://pokeapi.co/api/v2/pokemon', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }], next: null }),
    )
  }),

  // pokemon details by id (example)
  msw.rest.get('https://pokeapi.co/api/v2/pokemon/:id/', (req, res, ctx) => {
    const { id } = req.params
    return res(ctx.status(200), ctx.json({ id: Number(id), name: 'bulbasaur' }))
  }),

  // species endpoint with flavor text
  msw.rest.get('https://pokeapi.co/api/v2/pokemon-species/:id/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        flavor_text_entries: [
          { flavor_text: 'A strange seed was planted on its back.', language: { name: 'en' } },
        ],
      }),
    )
  }),

  // keep an example local path for convenience (not used by App but preserved)
  msw.rest.get('/api/pokemons', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ results: [{ id: 1, name: 'Pikachu' }] }))
  }),
]