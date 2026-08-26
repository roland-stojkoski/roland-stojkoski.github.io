# Development guide

Everything you need to clone, run, test and ship this site from a dev
machine.

## Prerequisites

- **[mise](https://mise.jdx.dev)** — the supported way to get the pinned
  toolchain (see [Toolchain](#toolchain-mise) below)
- **Node.js 22.23.1** — the exact version CI runs; other version managers
  work too, with the caveats in [Toolchain](#toolchain-mise) (`node --version`
  to check)
- **npm 10+** (ships with Node 22)
- A browser for Playwright (downloaded automatically on first run)

## Toolchain (mise)

`mise.toml` is the source of truth for tool versions. `.node-version` mirrors
its node entry so editors and other version managers keep working, and CI
fails a PR whenever the two files disagree — bump them together.

Install mise once, then let it manage versions per repository:

```bash
curl https://mise.run | sh                        # or: brew install mise
echo 'eval "$(mise activate bash)"' >> ~/.bashrc  # zsh/fish print their own line
exec $SHELL                                       # reload so activation takes effect
mise trust                                        # approve this repo's mise.toml
mise install                                      # install the pinned tools
```

With mise activated, `cd`-ing into the repo switches node to the pinned
version automatically; `mise current` shows what is active.

**Not using mise?** Nothing breaks, but check what your manager actually
reads. `.node-version` is picked up automatically by **fnm** and **nodenv**,
and by CI's `actions/setup-node` (via `node-version-file`) — any of those
gets you the identical version with no extra step. Two popular managers do
**not** read it:

- **nvm** only looks for `.nvmrc`, so name the version explicitly:
  `nvm install "$(cat .node-version)"`.
- **Volta** pins exclusively through the `volta` field in `package.json`,
  which this repo deliberately does not set (`mise.toml` is the pin), so run
  `volta run --node "$(cat .node-version)" npm ci` — or make that exact
  version your Volta default.

Installing node by hand works as long as `node --version` matches the pin
before you run `npm ci`; `package.json`'s `engines` field only enforces the
22.x floor, not the exact patch.

Extra tooling (a linter binary, a Python for a script) belongs in `mise.toml`
under `[tools]`. Nothing beyond node is pinned today because nothing else
needs it — npm ships with node, and every npm dependency is already locked by
`package-lock.json`.

## Getting started

```bash
git clone https://github.com/roland-stojkoski/roland-stojkoski.github.io.git
cd roland-stojkoski.github.io
mise install         # pinned node (skip if you manage node another way)
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

### Visual check (screenshots)

```bash
node scripts/capture-screenshots.mjs
```

Captures a hardcoded list of six routes — `/`, `/about`, `/articles`,
`/contact`, `/attributions` and the `modernize-2026` article — full-page in
both themes into `screenshots/latte/` and `screenshots/espresso/`. The list
lives in `scripts/capture-screenshots.mjs` and does **not** follow the
articles on disk, so any other article (today `/articles/this-blog`) is
missed until you add it there by hand.

That directory is generated output and is gitignored — regenerate it whenever
you need a before/after comparison, and never commit it. The before/after
slider in the modernization article does _not_ read from it; those are
committed assets under `static/modernize-2026/`.

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
Actions"). There is no manual deploy step. Both workflows install node from
`.node-version`, so the deploy runs the same patch release you develop on.

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
- **`mise` installed but node doesn't switch** — activation is missing from
  your shell rc, or the config isn't trusted; run `mise doctor`, then
  `mise trust` inside the repo.
- **CI fails on "verify node pins agree"** — `mise.toml` and `.node-version`
  drifted apart; set both to the same version.
