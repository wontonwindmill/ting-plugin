---
description: Open a Ting world into this folder, with its kit, ready to work on - by its id (with Claude Code connected to the person's Ting account) or by its key (ting-XXXX-XXXX-XXXX-XXXX). Use when someone names one of their Ting worlds, gives a Ting key, or asks to open or carry on with their Ting world.
argument-hint: <world id, or key> [folder]
---

# Open a Ting pack

A Ting pack is someone's story scenes for one of Ting's towns, where players learn a language by living there.
It lives on the Ting pack service; its code opens it anywhere. There's no git: the folder is kept in step with
the service by the pack client.

1. Run:

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" open $ARGUMENTS
   ```

   By its id (`schooltrip`), it needs Claude Code connected to the person's Ting account: if it says it isn't,
   run `login` (same script), tell them the link and code it gives, then `login --wait`, and open it again. By its
   key, it opens here if this folder is empty, or else into a folder named for it. If there's neither in the
   arguments, ask which world (their worlds are listed on the Studio's home). If the folder already holds this pack, it's brought up to date
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

A key opens the world for anyone who has it, so treat it like a password. Never write it into any file but
`.ting/sync.json` (where the client keeps it), and don't repeat it unless the person asks for it.
