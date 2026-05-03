# PokéSearch

Class-components React app built with Vite and TypeScript.

## What it does

- Uses class components only
- Loads Pokémon from the public PokeAPI
- Supports initial load, server-side search, and pagination
- Saves the last search term in `localStorage`
- Shows loading, error, and error-boundary states

## Requirements

- Node.js 18+ recommended
- npm

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Then open the URL shown by Vite, usually:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Format

```bash
npm run format:fix
```

## Submission notes

- Create and submit your work from a branch named `class-components`.
- The app fetches item data from PokeAPI using search by name and offset/limit pagination.
- The error test button is available in the UI to demonstrate the error boundary.
