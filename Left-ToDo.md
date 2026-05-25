# Left ToDo — App State Management

This file consolidates the remaining work required by `state-management.md` and maps it to actionable tasks.

## Features to implement

- Feature 1 — State management solution (choose Redux Toolkit or Zustand)
  - Integrate Redux Toolkit or Zustand into the app.
  - Create store/slices for selected items and other shared state.
  - Provide selectors/actions or hooks for components to read/update state.
  - Ensure all source files use `.ts`/`.tsx` and avoid `any`/`@ts-ignore`.

- Feature 2 — Selected items management
  - Add a checkbox to each card list item (checkbox only toggles selection).
  - Clicking outside the checkbox opens the details panel (no selection side-effects).
  - Persist selected items in the chosen store so selections survive page navigation.
  - Ensure unselect removes items from state.

- Feature 3 — Flyout for selected items
  - Implement a sticky bottom flyout that appears when >=1 item selected.
  - Flyout shows the count of selected items and provides `Unselect all` and `Download` buttons.
  - Flyout must be sticky (does not scroll out of view) and responsive.

- Feature 4 — CSV download (native APIs only)
  - Implement CSV generation of selected items (name, description, details URL, etc.).
  - Use `Blob`, `URL.createObjectURL`, and an `a` element with `download` (no external libs).
  - Filename should include the item count (e.g., `3_items.csv`).

- Feature 5 — Theme via Context API
  - Implement a ThemeContext for light/dark switching.
  - Provide UI control at the top of the app to change theme.
  - Apply theme across the app (toggle class/attribute on `document.documentElement` inside `useEffect`).

## Technical tasks / Implementation checklist

- Branch: create branch `app-state-management` (from current working branch).
- Store setup:
  - If Redux Toolkit: add slices, configure store, provide `Provider` in `main.tsx`.
  - If Zustand: create store file, export hooks for components.
- Components:
  - Update `Card`/`CardList` to include a checkbox and not change layout on selection.
  - Ensure clicking on card body (not checkbox) opens `PokemonDetailsPage`.
- Flyout:
  - New `Flyout` component mounted in app shell so it stays visible across routes.
  - Style with `position: sticky` / `position: fixed` to be always visible at bottom.
- CSV download:
  - Create utility `exportSelectedToCsv(selectedItems)` to build CSV string and trigger download.
- Theme:
  - Implement `ThemeContext` and a `ThemeProvider` wrapping the app.
  - Persist theme to `localStorage` optionally (recommended) and read on init.
- Tests:
  - Update unit tests to account for store & context changes.
  - Add tests for selection persistence, flyout visibility, CSV generation, and theme switching.
- Lint/TS:
  - Ensure no `.js/.jsx` source files remain.
  - Remove `any` and `@ts-ignore` usage.

## Acceptance criteria (quick checklist)

- [ ] Redux Toolkit or Zustand integrated and used for selected items.
- [ ] Each item has a working checkbox; clicking checkbox only toggles selection.
- [ ] Clicking card body opens details panel without changing selection.
- [ ] Selected items persist across route navigation.
- [ ] Flyout appears when at least one item selected and is sticky.
- [ ] Flyout shows correct count; `Unselect all` clears selections.
- [ ] `Download` creates a CSV file using native APIs; filename includes item count.
- [ ] Theme switching works via Context API and affects the whole app.
- [ ] Unit tests updated and coverage >=80% for modified parts.

## Notes & penalties to avoid

- Do not use external UI libraries for the feature implementations.
- Avoid direct DOM manipulations except toggling theme-related attributes on `document.documentElement` inside `useEffect`.
- Keep TypeScript strictness; avoid `any` and `@ts-ignore`.

## Suggested file additions/locations

- `src/store/` or `src/state/` — store configuration (Redux slice files or Zustand store)
- `src/components/Flyout.tsx` — flyout UI
- `src/utils/csv.ts` — CSV generation and download helper
- `src/context/ThemeContext.tsx` — theme provider and hook

---

Created from `state-management.md` acceptance criteria and the project `ToDo.md`.
