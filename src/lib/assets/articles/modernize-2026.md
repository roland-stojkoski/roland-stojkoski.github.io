---
title: 'Same site, three years later: a full modernization (with an AI pair programmer)'
date: '7/20/2026'
tldr: 'Svelte 5, Tailwind 4, markdown macros, tests, Storybook, CI — and how an AI agent helped rebuild it all in one session.'
githubLink: 'https://github.com/roland-stojkoski/roland-stojkoski.github.io'
---

## Why touch a working website?

The [original version of this site](/articles/this-blog) served me well since
early 2023. But three years is a geological era in frontend land: Svelte
gained runes, Tailwind moved its config into CSS, daisyUI grew a proper
timeline component, and my dependency tree had started to fossilize.

So I did what any reasonable engineer does in 2026: I described what I wanted
to an AI coding agent, reviewed everything it produced, and shipped the whole
modernization in a day. This article is both the changelog and a live demo of
the new toys.

Drag the slider — same homepage, three years apart:

<Compare
	before="/modernize-2026/compare-before.png"
	after="/modernize-2026/compare-after.png"
	beforeAlt="2023"
	afterAlt="2026"
	caption="2023 (flowbite + daisyUI 2) vs 2026 (daisyUI 5, custom espresso theme)"
/>

## What changed under the hood

| Before (2023)              | After (2026)                               |
| -------------------------- | ------------------------------------------ |
| Svelte 3 + SvelteKit 1     | Svelte 5 (runes) + SvelteKit 2             |
| Tailwind 3 + daisyUI 2     | Tailwind 4 (CSS-first) + daisyUI 5         |
| flowbite-svelte components | a handful of small custom components       |
| Font Awesome CDN kit       | inline SVG icons, zero requests            |
| Google-hosted fonts        | self-hosted variable fonts                 |
| manual `gh-pages` deploys  | GitHub Actions build + deploy              |
| no tests 😬                | 65 unit tests + Playwright e2e + Storybook |

The markdown-first philosophy stayed. Articles are still just `.md` files
with a bit of frontmatter — the timeline, article pages and the new RSS feed
are all derived from them at build time.

## Dark mode that actually sticks

The old theme toggle was flaky: the choice lived only in a checkbox and the
page could flash the wrong theme on load. The new setup resolves the theme
before first paint (stored preference, falling back to
`prefers-color-scheme`), persists it in `localStorage`, and broadcasts
changes so embedded widgets can follow along. There is a Playwright test that
toggles, reloads and checks it stuck — flakiness is now a regression, not a
mood.

## Markdown macros

The best part of the rebuild: articles now have superpowers without any
imports. mdsvex injects a set of components into every markdown file, so
embedding things is a one-liner.

A YouTube embed that only loads the player (cookie-free) when you click it:

<YouTube id="dQw4w9WgXcQ" title="An important message about commitment (and embed demos)" />

An in-browser 3D viewer for STL files — three.js, lazy-loaded on the client,
running fine within GitHub Pages' static confines. No server, no WebAssembly
needed, just WebGL:

<StlViewer src="/modernize-2026/torus-knot.stl" caption="A torus knot, because every 3D demo is legally required to have one" />

Plus `<Figure>` for captioned images and the `<Compare>` slider you already
used above.

## Tests, stories, robots

- **Unit tests** (Vitest + Testing Library) cover the article parsing, theme
  logic, timeline merging and every component — including one that would have
  caught the classic "icon name doesn't exist" bug I hit while building it.
- **Playwright** smoke-tests the built site: navigation, both themes, RSS.
- **Storybook** hosts every component with a theme switcher in the toolbar,
  so design work doesn't require clicking through the whole site.
- **GitHub Actions** runs all of it on every PR and deploys `main` straight
  to Pages.

And because the site is now maintained _with_ AI agents rather than just _by_
me: the repo carries an `AGENTS.md` (tool-agnostic instructions), a
`CLAUDE.md` pointing at it, and `.claude/` skills that teach an agent how to
write articles like this one — down to the commit style (semantic, lowercase,
imperative) and a strict "comment only what the code can't say" policy.

## Comments (soon)

Article pages are wired for [giscus](https://giscus.app) — comments backed by
GitHub Discussions, sign-in with GitHub, no tracking, free. It lights up the
moment Discussions are enabled on the repo. Until then: the
[contact page](/contact) works, and so does the shiny new
[RSS feed](/rss.xml).

Happy coding, see you in another three years 😀
