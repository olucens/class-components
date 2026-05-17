import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cachePokemon,
  getSpeciesDescription,
  fetchPokemonByTerm,
  fetchPokemonPage,
  getCachedPokemonMatches,
} from '../fetch-data-api'
import type Pokemon from '../../interfaces/Pokemon'
import type { PokemonSpeciesResponse } from '../../types/interfaces'

const page0 = {
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
  ],
  next: null,
}

const makePokemonResponse = (id: number, name: string) => ({
  id,
  name,
})

const makeSpeciesResponse = (text: string) => ({
  flavor_text_entries: [
    {
      flavor_text: text,
      language: { name: 'en' },
    },
  ],
})

describe('fetch-data-api', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    window.localStorage.clear()
  })

  it('caches a page and reuses exact and partial search terms from localStorage', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.includes('/pokemon?limit=')) {
        return { ok: true, json: async () => page0 }
      }

      if (url.includes('/pokemon-species/1/')) {
        return { ok: true, json: async () => makeSpeciesResponse('A strange seed.') }
      }

      if (url.includes('/pokemon-species/26/')) {
        return { ok: true, json: async () => makeSpeciesResponse('Its tail is lightning.') }
      }

      if (url.includes('/pokemon-species/4/')) {
        return { ok: true, json: async () => makeSpeciesResponse('Obviously prefers hot places.') }
      }

      if (url.includes('/pokemon-species/6/')) {
        return { ok: true, json: async () => makeSpeciesResponse('Spits fire that is hot enough to melt boulders.') }
      }

      if (url.includes('/pokemon/1/')) {
        return { ok: true, json: async () => makePokemonResponse(1, 'bulbasaur') }
      }

      if (url.includes('/pokemon/26/')) {
        return { ok: true, json: async () => makePokemonResponse(26, 'raichu') }
      }

      if (url.includes('/pokemon/4/')) {
        return { ok: true, json: async () => makePokemonResponse(4, 'charmander') }
      }

      if (url.includes('/pokemon/6/')) {
        return { ok: true, json: async () => makePokemonResponse(6, 'charizard') }
      }

      return { ok: false, status: 404 }
    }))

    const { results, hasNext } = await fetchPokemonPage(0, 20)

    expect(hasNext).toBe(false)
    expect(results.map((pokemon) => pokemon.name)).toEqual([
      'bulbasaur',
      'raichu',
      'charmander',
      'charizard',
    ])

    const stored = JSON.parse(window.localStorage.getItem('searchHistory') ?? '{}')
    expect(stored.bulbasaur.name).toBe('bulbasaur')
    expect(stored.raichu.name).toBe('raichu')

    const exactMatch = await fetchPokemonByTerm('Bulbasaur')
    expect(exactMatch).toHaveLength(1)
    expect(exactMatch[0].name).toBe('bulbasaur')

    const partialMatch = await fetchPokemonByTerm('char')
    expect(partialMatch.map((pokemon) => pokemon.name)).toEqual([
      'charizard',
      'charmander',
    ])

    expect(fetch).toHaveBeenCalledTimes(9)
  })


  it('falls back to the live API when the cache has no match', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => makePokemonResponse(7, 'squirtle') })
      .mockResolvedValueOnce({ ok: true, json: async () => makeSpeciesResponse('Shoots water at prey while in the water.') })
    )

    const result = await fetchPokemonByTerm('Squirtle')

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      name: 'squirtle',
      url: 'https://pokeapi.co/api/v2/pokemon/7/',
      description: 'Shoots water at prey while in the water.',
    })
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(window.localStorage.getItem('searchHistory')).toContain('squirtle')
  })

  it('supports old array cache format and object cache format', () => {
    // for example old array format
    const oldFormat = [
      { key: 'Pikachu', value: { name: 'pikachu', url: 'u', description: 'd' } },
    ]
    window.localStorage.setItem('searchHistory', JSON.stringify(oldFormat))

    const matchesOld = getCachedPokemonMatches('pik')
    expect(matchesOld).toHaveLength(1)
    expect(matchesOld[0].name).toBe('pikachu')

    // object format
    const objFormat: Record<string, Pokemon> = { mew: { name: 'mew', url: 'u', description: 'd' } }
    window.localStorage.setItem('searchHistory', JSON.stringify(objFormat))
    const matchesObj = getCachedPokemonMatches('mew')
    expect(matchesObj).toHaveLength(1)
    expect(matchesObj[0].name).toBe('mew')
  })

  it('returns empty on invalid JSON in cache', () => {
    window.localStorage.setItem('searchHistory', '{ not valid json')
    const matches = getCachedPokemonMatches('anything')
    expect(matches).toEqual([])
  })

  it('returns empty on invalid search term', () => {
    window.localStorage.setItem('searchHistory', '')
    const matches = getCachedPokemonMatches('')
    expect(matches).toEqual([])
  })

  it('attempt to cache a Pokémon with invalid pokemon Object', () => {
    window.localStorage.setItem('searchHistory', '')
    cachePokemon({id: 25, name: '', url: 'u', description: 'd'} as Pokemon)
    const matches = getCachedPokemonMatches('')
    expect(matches).toEqual([])
  })

  it('getSpeciesDescription tests in case of different flavor text conditions', () => {
    const descriptionEn = getSpeciesDescription({
      flavor_text_entries: [
        { flavor_text: 'Text 1', language: { name: 'en' } },
        { flavor_text: 'Text 2', language: { name: 'en' } },
      ],
    } as PokemonSpeciesResponse)
    expect(descriptionEn).toBe('Text 1')

    const descriptionEs = getSpeciesDescription({
      flavor_text_entries: [
        { flavor_text: 'Text 1', language: { name: 'it' } },
        { flavor_text: 'Text 2', language: { name: 'jp' } },
        { flavor_text: 'Texto 3', language: { name: 'es' } },
      ],
    } as PokemonSpeciesResponse)
    expect(descriptionEs).toBe('No description available.')
  })
})