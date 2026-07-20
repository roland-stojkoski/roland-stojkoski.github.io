# GEMINI.md

@AGENTS.md
@.agents/rules/commits.md
@.agents/rules/comments.md

All project instructions live in `AGENTS.md` (kept tool-agnostic so any coding
agent can use them), with detailed commit and commenting steering under
`.agents/rules/`.

Gemini-specific extras:

- Skills live in `.agents/skills/` — use `write-article` when adding articles,
  `add-timeline-event` for life events, and `verify-site` before pushing.
- When asked to change the design, screenshot before/after with Playwright and
  compare — don't guess from code alone.
