---
description: Link a Ting pack to the Ting app on the person's phone, so every version they save shows there to play before they publish. Use when someone wants to try their pack on their phone, or see their drafts in the app.
argument-hint: [folder]
---

# Play a Ting pack on your phone

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" link $ARGUMENTS
```

It prints a six-letter code that lasts fifteen minutes. Tell the person:

1. Open Ting on your phone, signed in, and go to the world the pack is for.
2. Quests, then **Stories by others**, then **Link a pack**, and type the code.
3. The pack shows under **Your drafts**. Tap **Play** to put its latest saved version into your story.

Linking is once per pack: after that, each version they save (`/ting:save`) is there the next time they open
the world, or straight away with **Play** again. Until the pack is published (which records its lines in the
town's voices), a draft's lines are said by the phone's own voice, in an app from the Ting beta or later.
