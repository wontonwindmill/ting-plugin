---
description: Save the Ting pack in this folder as a new version on the Ting pack service, checked as it's saved; or bring the folder up to date with a version saved elsewhere. Use when asked to save, sync, pull or push a Ting pack.
argument-hint: [folder]
---

# Save a Ting pack

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" push $ARGUMENTS
```

Every save is kept as a version (nothing is ever written over), and checked as it's saved. Tell the person
the version number and whether it passes; a version that doesn't pass is still saved, but can't be published.

**If it's refused because there's a newer version** (saved from another computer, or by someone else with the
code): don't throw either away.
1. `pull --force` takes the newer version into `pack.json` and keeps the changes made here in `pack.mine.json`.
2. Merge: bring the changes from `pack.mine.json` into `pack.json` (compare them quest by quest, step by
   step). Where both changed the same thing, ask which to keep.
3. Delete `pack.mine.json`, check, and save again.

To see where things stand without changing anything: `status`. To take the latest version when nothing has
changed here: `pull`.
