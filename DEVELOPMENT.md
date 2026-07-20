# Development guide

Everything you need to clone, run, test and ship this site from a dev
machine.

## Prerequisites

- **Node.js 22+** (matches CI; `node --version` to check)
- **npm 10+** (ships with Node 22)
- A browser for Playwright (downloaded automatically on first run)

## Getting started

```bash
git clone https://github.com/roland-stojkoski/roland-stojkoski.github.io.git
cd roland-stojkoski.github.io
npm install          # also installs the pre-commit hook via `prepare`
npm run dev          # dev server on http://localhost:5173
```

To check out this PR's branch instead of main:

```bash
git fetch origin claude/modernize-portfolio-website-2uqvy8
git checkout claude/modernize-portfolio-website-2uqvy8
npm install
```

## Everyday commands

| Command                   | What                                                           |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev`             | dev server with hot reload                                     |
| `npm run build`           | production build into `build/` (also regenerates `PLANNED.md`) |
| `npm run preview`         | serve the production build on :4173                            |
| `npm run lint` / `format` | prettier + eslint check / write                                |
| `npm run check`           | svelte-check (typescript)                                      |
| `npm run planned`         | regenerate the codetag section of `PLANNED.md`                 |
| `npm run storybook`       | component workbench on :6006                                   |

## Testing

### Unit tests (Vitest + Testing Library)

```bash
npm run test:unit            # watch mode
npm run test:unit -- --run   # single pass (what CI runs)
```

Unit tests live next to their subject (`*.test.ts` in `src/` and
`scripts/`). jsdom is the environment; jest-dom matchers are preloaded via
`vitest-setup.ts`.

### End-to-end tests (Playwright) — desktop **and** mobile

```bash
npx playwright install chromium   # first time only
npm run test:e2e                  # runs BOTH projects
```

The Playwright config defines two projects that both run the full
`e2e/site.spec.ts` suite:

- `desktop` — Desktop Chrome viewport
- `mobile` — Pixel 7 emulation (touch, mobile viewport)

Mobile-only specs (hamburger navigation, horizontal-overflow guard) are
skipped on desktop and vice versa. Useful variations:

```bash
npx playwright test --project=mobile        # just mobile
npx playwright test --ui                    # interactive runner
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e   # system browser (sandboxes/CI images)
```

`npm run test:e2e` builds and previews the site automatically — no need to
start a server first.

### Everything at once

```bash
npm run lint && npm run check && npm run test:unit -- --run && npm run build && npm run test:e2e
```

This mirrors what CI runs on every PR.

## PLANNED.md — planned work & tracked compromises

`PLANNED.md` has two parts:

1. a hand-written **Backlog** section — edit it like any doc
2. an auto-generated **codetag** section between the
   `<!-- codetag-scan:start -->` / `<!-- codetag-scan:end -->` markers, built
   by `scripts/generate-planned.mjs` from `TODO:` / `FIXME:` / `HACK:` /
   `XXX:` / `NOTE:` comments across all tracked files

It regenerates automatically:

- on every `npm run build` (via the `prebuild` hook)
- on every commit (a `pre-commit` git hook installed by `npm install`
  re-scans and stages `PLANNED.md`)
- CI fails a PR if the committed file is stale (`npm run planned:check`)

Keep the first line of any codetag comment self-contained — the scanner is
line-based and only captures that line.

## Deploying

Merging to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes to GitHub Pages (repo Settings → Pages → Source must be "GitHub
Actions"). There is no manual deploy step.

## Troubleshooting

- **`sh: playwright: command not found`** (or any missing binary from an npm
  script) — dependencies aren't installed in this checkout; run `npm install`
  first. Binaries live in `node_modules/.bin`, which only exists after an
  install.
- **`npm error Missing script: "vite"`** — the dev server script is
  `npm run dev`, not `npm run vite`.
- **Playwright: "Looks like Playwright was just installed"** — run
  `npx playwright install chromium`, or set `CHROMIUM_EXECUTABLE_PATH` to an
  existing Chromium binary.
- **Stale preview server** — `npm run preview` on :4173 keeps running in the
  background; kill it (`pkill -f "vite preview"`) if assets look outdated.
- **`npm install` fails on `prepare`** outside a git checkout (e.g. tarball
  installs) — safe to ignore; the hook only matters in the repo.
