---
name: verify-site
description: Verify the site end-to-end before pushing - lint, typecheck, unit tests, e2e, build and visual check in both themes. Use before any push or PR, or when asked to check that everything still works.
---

# Verifying the site

Run in this order (fail fast on the cheap ones):

```bash
npm run planned:check   # PLANNED.md codetag section must be current
npm run lint
npm run check
npm run test:unit -- --run
npm run build
npm run test:e2e        # builds + previews automatically; runs desktop AND mobile projects
```

If `planned:check` fails, run `npm run planned` and commit the result (the
pre-commit hook normally does this automatically).

If Playwright cannot download browsers (sandboxed environments), point it at
a system chromium: `CHROMIUM_EXECUTABLE_PATH=/path/to/chromium npm run test:e2e`.
Run a single viewport with `npx playwright test --project=mobile` (or
`--project=desktop`).

## Visual check

Serve the build and screenshot both themes — dark mode regressions do not
show up in unit tests:

```bash
npm run preview &
# screenshot / (latte + espresso via localStorage 'theme'), an article page,
# and /contact; compare against expectations before pushing
```

Storybook must still build when components changed:

```bash
npm run build-storybook
```

## Interpreting failures

- Prerender errors name the offending page; bad article frontmatter (usually
  the date) is the most common cause.
- `svelte/no-dom-manipulating` lint errors: only third-party embeds
  (giscus, three.js) may disable it, with a trailing justification.
