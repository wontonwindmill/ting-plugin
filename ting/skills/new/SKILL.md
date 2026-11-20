---
description: Start a new Ting world of your own (a story from scratch over one of Ting's settings) on the Ting pack service, in this folder, with the setting's kit. Use when someone wants to make a new Ting world or story and has no code yet.
argument-hint: [what it's about]
---

# Start a Ting world

A world of your own is your own story from Day 0, over one of Ting's settings (the mountain town or the city, in
Chinese, or the rural village, in Japanese): the setting's map, rooms and props and how it plays, with your own
town name, people, words and story. Ting's own towns' stories are Ting's: a world never goes inside one of them.
Starting one makes a starter on the service (playable and passing its checks from the start) and gives it its code.

1. **The setting.** Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" worlds`. Choose by the language
   they're teaching and the place: `chinese` is the mountain town, `chinese` with `--map city` the city,
   `japanese2` the rural village. If it isn't clear from what they've said, ask.

2. **Its id and title.** The id is short, lower-case letters and digits, from the idea (`nightmarket`, `catdesk`):
   every one of its quest ids will start with it. The title is what players see.

3. **Start it.** Starting a world needs the invite code Ting gave them (`INV-XXXX-XXXX`): ask for it if they
   haven't given it.

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" new <id> --world <setting> [--map city] --title "<its title>" --by "<their name, as credited>" --invite <their invite code> .
   ```

   The `.` starts it in this folder, with the setting's kit beside it (`kit/`: start with `kit/README.md`).

   Ask how they'd like to be credited if they haven't said. If the id is taken, suggest another. If the invite is
   refused, say so plainly: they'll need to ask Ting for one.

4. Tell them the world is started, and give them its code once, saying it opens the world anywhere (in the Studio,
   and with `/ting:open`) and that anyone with it can change it, so they should keep it somewhere safe. Then offer
   `/ting:plan`: a plan first is quicker to change than written scenes.
