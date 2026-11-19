---
description: Play a Ting pack's latest saved version in a web browser, in a phone beside its quests. Use when someone wants to see or try their scenes as a player will, on their computer.
argument-hint: [folder]
---

# Play a Ting pack in your browser

1. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" status $ARGUMENTS`. If there are changes here that aren't
   saved, say so and offer to save them first (`/ting:save`): the browser plays the latest saved version.
2. Then:

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" play $ARGUMENTS
   ```

3. Give the person the link it prints, and tell them:
   - It opens the game in a phone, with the pack's quests beside it: each one plays from its start, with the story
     before it already played.
   - Lines nobody has recorded yet are said by the browser's own voice: flatter than the town's voices, and now and
     then wrong on a tone. Once the pack's published, its lines are recorded in the town's voices.
   - After saving again, **Play the latest again** picks up the new version.
   - It needs a browser with WebGPU: Chrome or Edge, or Safari 26. On a phone, `/ting:link` plays it in the Ting app.
