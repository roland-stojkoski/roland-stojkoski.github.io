# Agent guide

Canonical instructions for AI coding agents working on this repository.
(`CLAUDE.md` points here; keep this file tool-agnostic.)

## What this is

Roland Stojkoski's portfolio website — a fully static SvelteKit site deployed
to GitHub Pages. Markdown is the source of truth: articles live in
`src/lib/assets/articles/*.md` and everything else (timeline, RSS, article
pages) is derived from them at build time.

## Stack

- SvelteKit 2 + Svelte 5 (runes) + TypeScript, static adapter (prerendered)
- Tailwind CSS 4 + daisyUI 5 (CSS-first config in `src/app.css`; custom themes
  `latte`/`espresso`)
- mdsvex for markdown -> Svelte, wrapped by
  `src/lib/markdown/ArticleLayout.svelte`; article macros are auto-imported
  into every `.md` file by the `injectArticleMacros` preprocessor in
  `svelte.config.js` (exports live in `src/lib/markdown/macros.ts`)
- Vitest (+ Testing Library) for unit tests, Playwright for e2e (desktop AND
  mobile projects — both run on every `test:e2e`), Storybook for component
  work

Developer setup and troubleshooting live in `DEVELOPMENT.md`.

## Commands

| Command             | What                                         |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | dev server                                   |
| `npm run build`     | production build (prerenders everything)     |
| `npm run check`     | svelte-check / typecheck                     |
| `npm run test:unit` | vitest (watch; add `-- --run` for one-shot)  |
| `npm run test:e2e`  | playwright (builds + previews automatically) |
| `npm run lint`      | prettier check + eslint                      |
| `npm run format`    | prettier write                               |
| `npm run storybook` | storybook dev server                         |
| `npm run planned`   | regenerate the codetag section of PLANNED.md |

Before pushing, make sure `npm run lint && npm run check && npm run test:unit -- --run && npm run build` all pass.

## PLANNED.md (planned work & tracked compromises)

`PLANNED.md` tracks work in two sections:

- **Backlog** — manually curated list; edit it when scope is agreed with the
  owner (add items for deferred work, remove items you complete).
- **Codetags** — auto-generated between the `codetag-scan` markers from
  `TODO`/`FIXME`/`HACK`/`XXX`/`NOTE` comments across all tracked files
  (`scripts/generate-planned.mjs`). Never hand-edit this section.

Regeneration is automatic: `prebuild` hook on every build, a `pre-commit`
git hook (installed by `npm install`) that re-stages the file, and a CI
check (`npm run planned:check`) that fails stale PRs. So: accept a
compromise → leave a CODETAG comment; resolve one → delete the comment; the
file follows along.

## Architecture map

- `src/lib/config.ts` — site metadata, social links, giscus config
- `src/lib/data/timeline.ts` — non-article life events shown on the timeline
- `src/lib/utils/` — pure logic (article parsing, theme handling); keep logic
  here so it stays unit-testable
- `src/lib/components/` — UI components; icons are inline SVGs in `icons.ts`
- `src/lib/markdown/` — article layout + macros (`YouTube`, `StlViewer`,
  `Figure`, `Compare`) and the giscus comments embed
- `src/routes/` — pages; articles are served by `articles/[slug]`
- `static/` — served as-is; per-article assets go in `static/<slug>/`

## Writing conventions

### Commits

Semantic commits, all lowercase, imperative mood:

```
feat: add stl viewer macro
fix: keep theme across reloads
docs: explain article frontmatter
test: cover timeline merging
chore: bump dependencies
refactor: extract theme helpers
```

Scope is optional (`feat(timeline): ...`). Subject line ≤ 72 chars, body
explains why (not what) when the diff alone isn't obvious.

### Code comments

Comment only what the code cannot say:

- non-obvious constraints, invariants or complexity that is there by design
- known-but-accepted compromises — tag these with CODETAGS: `TODO`, `HACK`,
  `FIXME`, `XXX`, `NOTE`
- never narrate what a line does, why a change is correct, or where code came
  from; if a comment restates the code, delete it

### Style

- Prettier + ESLint are authoritative; run `npm run format` rather than
  hand-formatting
- Svelte 5 runes (`$props()`, `$state`, `$derived`) — no legacy `export let`
- Keep display components thin; put branching logic in `src/lib/utils/` with
  tests

## Adding an article

See `.claude/skills/write-article/SKILL.md` for the full walkthrough
(frontmatter shape, macros, screenshots, checklist). Short version: drop a
`.md` file with `title`/`date`/`tldr` frontmatter into
`src/lib/assets/articles/` and the timeline, article page and RSS feed pick it
up automatically.
