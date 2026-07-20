---
name: sync-agents
description: Keeps agent rules and skills in sync between Claude (.claude/) and Gemini/Antigravity (.agents/) configurations. Use whenever you modify, add, or delete any files in .claude/rules/, .claude/skills/, .agents/rules/, or .agents/skills/.
---

# Syncing Agent Rules and Skills

This repository supports both Claude (using `.claude/` for rules/skills) and Gemini/Antigravity (using `.agents/` for rules/skills).

To ensure that both agents share the identical rules and skills:

1. **Synchronize Configurations**:
   Whenever you add, modify, or delete a rule (in `.claude/rules/` or `.agents/rules/`) or a skill (in `.claude/skills/` or `.agents/skills/`), you **MUST** run the synchronization script:

   ```bash
   node scripts/sync-agents.mjs
   ```

2. **Hook Execution**:
   To guarantee both directories are in sync, run `node scripts/sync-agents.mjs` after making edits and before committing your changes.

3. **Verify Mirroring**:
   Ensure that any new rule or skill folder created under `.claude/` is mirrored in `.agents/` (and vice-versa).
