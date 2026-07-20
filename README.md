# Roland Stojkoski's portfolio website

Markdown-first portfolio and blog, statically generated and hosted on GitHub
Pages. Powered by SvelteKit 2 + Svelte 5, Tailwind CSS 4, daisyUI 5 and
mdsvex.

Features:

- **Markdown as the source of truth** — drop an `.md` file into
  `src/lib/assets/articles/` and the timeline entry, article page and RSS
  feed appear automatically
- **Article macros** — `<YouTube/>` lite embeds, `<StlViewer/>` in-browser 3D
  models (three.js), `<Figure/>` and `<Compare/>` before/after sliders, all
  usable in markdown without imports
- **Dark mode done right** — `latte`/`espresso` themes, resolved before first
  paint, persisted, synced to embeds
- **Comments** — [giscus](https://giscus.app) (GitHub Discussions), enabled
  once `repoId`/`categoryId` are filled in `src/lib/config.ts`
- **Tests** — Vitest unit suite, Playwright e2e, Storybook for components
- **CI/CD** — GitHub Actions checks every PR and deploys `main` to Pages
- **Agent-ready** — see [`AGENTS.md`](AGENTS.md) and `.claude/skills/`

## Adding an article

Create `src/lib/assets/articles/<slug>.md`:

```markdown
---
title: 'My article'
date: 'M/D/YYYY'
tldr: 'One-line summary for the timeline and RSS.'
githubLink: 'https://github.com/...' # optional
---

## Content starts here

<YouTube id="dQw4w9WgXcQ" title="Demo" />
```

Assets go in `static/<slug>/`. Full guide:
[`.claude/skills/write-article/SKILL.md`](.claude/skills/write-article/SKILL.md).

## Development

```bash
npm install
npm run dev          # dev server
npm run build        # production build (prerendered to build/)
npm run preview      # serve the production build
```

## Quality checks

```bash
npm run lint             # prettier + eslint
npm run check            # svelte-check
npm run test:unit        # vitest (add -- --run for one-shot)
npm run test:e2e         # playwright (builds + previews automatically)
npm run storybook        # component workbench on :6006
```

## Deploying

Pushes to `main` deploy automatically via `.github/workflows/deploy.yml`
(repo Settings → Pages → Source must be set to "GitHub Actions"). No manual
steps.
