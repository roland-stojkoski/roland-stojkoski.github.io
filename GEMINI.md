# GEMINI.md

@AGENTS.md
@.agents/rules/commits.md
@.agents/rules/comments.md

All project instructions live in `AGENTS.md` (kept tool-agnostic so any coding
agent can use them), with detailed commit and commenting steering under
`.agents/rules/`.

Gemini-specific extras:

- Skills live in `.agents/skills/` — `write-article` (new article),
  `add-macro` (new article macro), `add-timeline-event` (life event),
  `validate-styles` (style, theme or layout changes), `verify-site` (before
  pushing) and `sync-agents` (after editing anything in `.agents/` or
  `.claude/`). Paths and one-line descriptions for every skill, rule and doc
  live in the "Skills, rules and docs" section of `AGENTS.md`.
- When asked to change the design, screenshot before/after with Playwright and
  compare — don't guess from code alone.
