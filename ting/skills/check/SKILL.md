---
description: Check a Ting pack as it stands in this folder against its world - the format, every content rule, word budgets and how guessing does - and write out how it plays as a script, without saving a version. Use when asked to check a Ting pack, or before saving one.
argument-hint: [folder]
---

# Check a Ting pack

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" check $ARGUMENTS
```

The service checks the pack here (nothing is saved) and writes the pack as it plays to `.ting/script.md`:
every line in order, with its id and who says it.

- **✗ problems** must be fixed before the pack can be published. For each, find the line or field it names in
  `pack.json` and say what's wrong in plain words, with the fix. Rules are explained in
  `kit/writing-packs.md` and `kit/taste.md`.
- **· notes** are to read over: word budgets (how many new words a day), claims ("our first guest") that may
  no longer be true. Say which matter.
- **Guessing:** for each conversation with a bar, how often a player picking at random does well. It must be
  under 20%; if not, the right answers are too easy to spot (see `/ting:write`, "Make it play").

If asked to fix them, fix them in `pack.json` and check again until it passes. Don't save unless asked.
