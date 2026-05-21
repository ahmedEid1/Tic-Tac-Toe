# Contributing

Thank you for considering contributing to **Pharaoh's Gambit**! Small fixes, big ideas, and everything in between are welcome.

## Quick start

```bash
git clone https://github.com/ahmedEid1/Tic-Tac-Toe.git
cd Tic-Tac-Toe
npm install
npm run dev    # http://localhost:3000
npm test       # unit tests for the game logic + minimax
npm run lint   # ESLint
```

## What's a good contribution?

- **Bug fixes** — anything that doesn't behave as documented. Open an issue first if it's not obvious, otherwise just PR.
- **New translations** — add a locale to `src/lib/i18n.ts` (model on `EN` / `AR`) and a toggle entry. The whole UI uses string keys so this is largely mechanical.
- **AI tier ideas** — new difficulty levels (e.g. a "Scribe Apprentice" with depth-1, or an "Oracle" that uses opening-book tables). Add them in `src/lib/minimax.ts` next to the existing tiers.
- **Theming** — palette variants, animated backgrounds that don't add noise, alternative typography. Tokens live in `src/app/globals.css`.
- **Accessibility / mobile polish** — keyboard navigation, reduced-motion handling, smaller-viewport layout tweaks.
- **Better visualizations** — animated tree views, branching diagrams, anything that makes the algorithm more intuitive.
- **Tests** — anything you'd like covered that isn't.

## What's out of scope (for now)

- Bigger board sizes (4×4, 5×5). These break the assumption that minimax is feasible to the leaves — they need a heuristic eval function and a transposition table. Happy to discuss in an issue first.
- Multiplayer over the network. Stays a static export for the time being.
- Renaming the Egyptian theme. The visuals, language, and naming are central to the project.

## Code style

- TypeScript everywhere; no `any` without a `// eslint-disable-next-line` and a justification.
- Components are server components by default; mark `"use client"` only when needed (state, effects, browser APIs, R3F).
- Prefer Tailwind utility classes; use the `@theme` tokens in `globals.css` rather than raw hex when introducing new colors.
- Tests live alongside the file they cover (e.g. `minimax.ts` + `minimax.test.ts`).
- Lint must pass: `npm run lint`.
- Tests must pass: `npm test`.

## Commit messages

The git log uses conventional-ish prefixes:

- `feat:` — a new user-visible feature
- `fix:` — a bug fix
- `refactor:` — internal rework, no user-visible change
- `chore:` — tooling, config, deps
- `docs:` — README, CONTRIBUTING, comments
- `test:` — test-only changes

Keep the subject under ~70 characters; describe the *why* in the body if it isn't obvious.

## Pull requests

- One topic per PR. Smaller is easier to review.
- Mention the issue you're resolving (`Closes #123`).
- Add or update tests when you touch `lib/`.
- Update the README screenshots (`node scripts/screenshots.mjs`) if the UI shifted noticeably.

## Reporting bugs / asking questions

Open a [GitHub issue](https://github.com/ahmedEid1/Tic-Tac-Toe/issues/new/choose) — there are templates for both. Please include the browser, OS, and the steps to reproduce.

Thanks for being here. 🜸
