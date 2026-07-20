# Commit steering

- Semantic commit prefixes: `feat` / `fix` / `docs` / `test` / `chore` /
  `refactor` / `style` / `ci` / `perf`. Optional scope: `feat(timeline): ...`
- Entire message lowercase (proper nouns like GitHub URLs may keep casing
  inside the body).
- Imperative mood: "add", "fix", "remove" — never "added" or "adds".
- Subject ≤ 72 chars, no trailing period.
- Body only when the why is not obvious from the diff; wrap at 72.
- One logical change per commit; do not mix refactors with features.
