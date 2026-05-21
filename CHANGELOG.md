# Changelog

All notable changes to this project will be documented here. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- React Testing Library + 9 component smoke tests for Board2D,
  Scoreboard, and ModeSelector (suite is now 34 tests).
- Mobile-first reorder of the page: header → board → thinking panel →
  sanctum → algorithm explainer, so the AI's response is visible
  immediately after a move on phones.
- Reduced-motion respect, themed focus rings, skip-to-game link.
- Lighthouse perf pass: trimmed Google Font weights, lazy-loaded
  the algorithm explainer, added `display: swap`.
- SEO/PWA infra: `manifest.webmanifest` (installable PWA),
  `theme-color`, canonical URL, schema.org `VideoGame` JSON-LD.

### Fixed
- `og:image` / `twitter:image` URLs were doubled
  (`/Tic-Tac-Toe/Tic-Tac-Toe/og.png`) — every social share preview
  was broken. Now resolves correctly via `metadataBase`.
- Mobile horizontal overflow caused by the pseudocode line being
  wider than the viewport, pushing the entire layout sideways.
  Fixed with `html { overflow-x: clip }` + `w-full min-w-0` on the
  explainer section.
- Algorithm explainer cards now mount immediately instead of waiting
  for `whileInView` (which never triggered in some captures and
  some mobile browsers).
- Full Eye-of-Horus name used consistently (was "Eye AI" in spots).

### Removed
- Five unused create-next-app demo SVGs from `public/`.
- Unused `three` / `@react-three/*` dependencies after the move to a
  flat 2D board.

## [1.0.0] — 2026-05-21

The first complete release. Live at
<https://ahmedeid1.github.io/Tic-Tac-Toe/>.

### Added

- **Game** — Tic-Tac-Toe with three modes: Mortal vs Mortal, Mortal vs
  Pharaoh, Trial of the Gods (AI v AI).
- **AI** — full Minimax search with α-β pruning and a faster-wins /
  slower-loses tiebreak. Three selectable tiers: Apprentice (random),
  Scribe (depth-2), Pharaoh (full search).
- **Algorithm visualization** — every candidate move shown as a mini-board
  card with its rated outcome (`win in 2`, `draw`, `lose in 4`). Live
  per-cell score overlays during the AI's turn.
- **Bilingual UI** — English / العربية with `dir="rtl"` flip and the
  Amiri serif for Arabic. All strings centralized in `src/lib/i18n.ts`.
- **Authentic glyphs** — Wikimedia public-domain Ankh and Wedjat-eye
  SVGs rendered inline.
- **Synthesized Web Audio SFX** — place, win, draw, click, thinking
  sounds — no audio assets.
- **AI vs AI controls** — play / pause / step / variable-speed slider.
- **Session scoreboard** ("Scribe's Ledger") with per-mode rematch + reset.
- **Algorithm explainer** — Minimax, α-β, depth-penalty scoring, the
  three tiers, and pseudocode.
- **Mobile responsive** layout — board stacks above sanctum above
  thinking panel on narrow viewports.
- **25 unit tests** (Vitest) — game logic and Minimax correctness
  (immediate wins, blocks, faster-win tiebreak, never-loses-to-random
  in 30 sample games, alpha-beta pruning, candidate-score recording,
  depth-limited Scribe, perf budget).
- **CI** — lint + tests + build on every PR.
- **CD** — auto-deploy a static export to GitHub Pages on every push
  to `main`.
- **Repo health** — MIT licence, CONTRIBUTING, Code of Conduct, security
  policy, issue and PR templates, Sponsor link, Discussions enabled.

[Unreleased]: https://github.com/ahmedEid1/Tic-Tac-Toe/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ahmedEid1/Tic-Tac-Toe/releases/tag/v1.0.0
