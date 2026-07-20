# Code comment steering

Default to no comment. Write one only when it states something the code
cannot:

1. Complexity that is there by design (algorithms, ordering constraints,
   browser quirks, third-party API contracts).
2. Known and accepted compromises — always tagged with a CODETAG so they are
   greppable:
   - `TODO:` planned improvement, not blocking
   - `FIXME:` known defect or fragile behavior being tolerated
   - `HACK:` deliberate ugliness that works around something external
   - `XXX:` danger zone — do not touch without understanding
   - `NOTE:` non-obvious fact the next reader needs
3. Public-facing helper contracts (short doc comment on exported utils).

Never write comments that narrate the next line, restate a name, or explain
why a change is correct (that belongs in the PR/commit, not the code). When
editing code with such comments, delete them.

CODETAG comments are harvested into `PLANNED.md` by
`scripts/generate-planned.mjs` (runs on every build and commit; CI fails if
the file is stale). Because the scanner is line-based, make the tag's first
line a self-contained summary. Resolving a codetag = delete the comment; the
next regeneration drops it from `PLANNED.md` automatically.
