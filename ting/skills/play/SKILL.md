---
description: Open a Ting pack's latest saved version in Ting Studio, in a web browser, with the game playing it beside. Use when someone wants to see or try their scenes as a player will, on their computer.
argument-hint: [folder]
---

# See and play a Ting pack in Ting Studio

1. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" status $ARGUMENTS`. If there are changes here that aren't
   saved, say so and offer to save them first (`/ting:save`): the Studio shows the latest saved version.
2. Then:

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" play $ARGUMENTS
   ```

3. Give the person the link it prints, and tell them:
   - It opens Ting Studio: the town's whole story, day by day, with the pack's quests laid in where they go (marked
     with the pack's name), each one's steps, words and checks. The game plays in a phone beside it: pick a step and
     the game goes there, with the story before it already played.
   - Lines nobody has recorded yet are said by the browser's own voice: flatter than the town's voices, and now and
     then wrong on a tone. Once the pack's published, its lines are recorded in the town's voices.
   - After saving again, reload the page for the new version.
   - It needs a browser with WebGPU: Chrome or Edge, or Safari 26. On a phone, `/ting:link` plays it in the Ting app
     (or the bare game, without the Studio, is the `game` link in `--json`).
