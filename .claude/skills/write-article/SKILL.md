---
name: write-article
description: Write and publish a new article on the portfolio timeline. Use when asked to add an article, blog post, or timeline write-up. Covers frontmatter metadata, markdown macros (YouTube, STL viewer, figures, before/after compare), assets and the pre-publish checklist.
---

# Writing an article

Articles are markdown files in `src/lib/assets/articles/`. The filename
becomes the slug: `my-article.md` → `/articles/my-article`. The timeline,
article page, `<title>`, meta description and RSS feed all derive from the
file — no other registration needed.

## 1. Frontmatter (required)

```markdown
---
title: 'Human-readable title'
date: 'M/D/YYYY'
tldr: 'One-sentence summary shown on the timeline card and in RSS.'
githubLink: 'https://github.com/...' # optional - adds a GitHub button
---
```

- `date` drives timeline ordering (newest first) — use the publish date.
- `tldr` should be a single sentence; it doubles as the meta description.

## 2. Body

Standard markdown (GFM) rendered through mdsvex. The article layout already
renders `title`, `tldr` and the date — do NOT repeat them as a heading.
Start content with `##` sections, not an `# h1`.

### Macros (no imports needed)

These components are auto-injected into every article (via the
`injectArticleMacros` preprocessor in `svelte.config.js`; the export list
lives in `src/lib/markdown/macros.ts`):

```markdown
<YouTube id="dQw4w9WgXcQ" title="What the video is" />

<StlViewer src="/my-article/part.stl" caption="Interactive 3D model" />

<Figure src="/my-article/screenshot.png" alt="What it shows" caption="Optional caption" />

<Compare
  before="/my-article/before.png"
  after="/my-article/after.png"
  beforeAlt="2023"
  afterAlt="2026"
  caption="Drag the slider"
/>
```

- `YouTube` — lite embed: renders the thumbnail, loads the player
  (youtube-nocookie.com) only when clicked. `id` is the `v=` parameter.
- `StlViewer` — in-browser 3D viewer (three.js, lazy-loaded on the client).
  Accepts binary or ASCII STL. Optional `height` (px) and `color` (hex).
- `Figure` — image with border, shadow and optional caption.
- `Compare` — before/after image slider; both images should have identical
  dimensions.

Need a macro that does not exist yet? `.claude/skills/add-macro/SKILL.md`
(mirrored at `.agents/skills/add-macro/SKILL.md`) walks through building one.

## 3. Assets

Put article assets in `static/<slug>/` (e.g. `static/my-article/photo.png`)
and reference them absolutely: `/my-article/photo.png`.

## 4. Checklist before pushing

1. `npm run build` — prerender must succeed (bad frontmatter dates throw)
2. `npm run test:unit -- --run` and `npm run lint`
3. Preview (`npm run preview`) and check the article page AND its timeline
   card in both themes (toggle in the nav)
4. Commit as `feat: add <slug> article` (lowercase, imperative)
