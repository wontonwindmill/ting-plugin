---
description: Send a Ting pack for review, so it can be published to Ting's catalogue for players (and its lines recorded in the world's voices). Ting reviews every pack before it's published.
argument-hint: [folder]
disable-model-invocation: true
---

# Send a Ting pack for review

Packs are published by Ting after a review: you send a version, and once it's approved it's in the catalogue
and its lines are recorded. Confirm before sending.

1. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" status $ARGUMENTS`. If there are changes here that
   aren't saved, say so and offer to save them first (`/ting:save`): it's the saved version that's sent. If the
   latest version doesn't pass its checks, it can't be sent: say what's wrong.
2. Tell the person what will be sent (the title, the version, how many scenes and new words) and ask them to
   confirm.
3. Once they say yes:

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" submit $ARGUMENTS
   ```

4. Tell them it's sent, and that they can keep writing meanwhile: what's sent stays as it is, and a later
   version can be sent again. `status` shows when it's published, and when its lines are recorded.
