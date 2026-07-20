# CLAUDE.md

@AGENTS.md
@.claude/rules/commits.md
@.claude/rules/comments.md

All project instructions live in `AGENTS.md` (kept tool-agnostic so any coding
agent can use them), with detailed commit and commenting steering under
`.claude/rules/`.

Claude-specific extras:

- Skills live in `.claude/skills/` — use `write-article` when adding articles,
  `add-timeline-event` for life events, and `verify-site` before pushing.
- When asked to change the design, screenshot before/after with Playwright and
  compare — don't guess from code alone.
