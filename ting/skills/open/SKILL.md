---
description: Open a Ting pack by its code (ting-XXXX-XXXX-XXXX-XXXX) into this folder, with its world's kit, ready to work on. Use when someone gives a Ting code, or asks to open or carry on with their Ting pack.
argument-hint: <code> [folder]
---

# Open a Ting pack

A Ting pack is someone's story scenes for one of Ting's towns, where players learn a language by living there.
It lives on the Ting pack service; its code opens it anywhere. There's no git: the folder is kept in step with
the service by the pack client.

1. Run:

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" open $ARGUMENTS
   ```

   With no folder named, it opens here if this folder is empty, or else into a folder named for the pack. If
   there's no code in the arguments, ask for it. If the folder already holds this pack, it's brought up to date
   (and refused if there are changes here that aren't saved: then run `status` and say what to do).

2. Then run `status` in the pack's folder (same script, `status <folder>`), and read the pack's `pack.json`
   and `kit/README.md`.

3. Tell the person, briefly: the pack's title and world, what it's about, its version and whether it's
   sent for review or published, whether its latest version passes its checks (and the problems, in plain words,
   if not), and what they can do next:
   - `/ting:plan` to plan it (or more of it) before writing,
   - `/ting:write` to write its scenes,
   - `/ting:check` to check what's here without saving,
   - `/ting:save` to save a version,
   - `/ting:link` to play it on their phone, in the Ting app,
   - `/ting:publish` to send it for review, so it can be published for players.

The code is the pack's only key: anyone with it can change the pack. Never write it into any file but
`.ting/sync.json` (where the client keeps it), and don't repeat it unless the person asks for it.
