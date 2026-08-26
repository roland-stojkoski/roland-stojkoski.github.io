# Gemini entry point (inert pass-through)

An `@` line in an agent instruction file inlines the file it names, so that
file's text becomes part of the instructions the agent loads. The import
below is `@/GEMINI.md` — a leading-slash **absolute** path. There is no
`/GEMINI.md` on disk (the repository's copy is `GEMINI.md`, relative to the
repo root), so the import resolves to nothing and this file contributes
nothing to any agent's context today. Observed directly in a Claude session:
the relative imports in `CLAUDE.md` (`@AGENTS.md`,
`@.claude/rules/commits.md`, `@.claude/rules/comments.md`) were each expanded
inline, while the line below arrived verbatim and unexpanded.

Making the path resolve is not the repair. `CLAUDE.md` and `GEMINI.md` each
already import `AGENTS.md` and the rules sitting next to them, so a working
import would re-inject that guidance a second time _and_ pull the other
tool's tool-specific entry point into this one's context. Deleting both
copies of this file is the clean fix; it is on the `PLANNED.md` backlog and
is the repo owner's call.

`.claude/rules/` and `.agents/rules/` are byte-identical mirrors kept in sync
by `scripts/sync-agents.mjs`, so this text is the same in both.

@/GEMINI.md
