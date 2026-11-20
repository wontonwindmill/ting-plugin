---
description: Start a new Ting world of your own (a story from scratch over one of Ting's settings) or a pack (scenes in one of Ting's towns) on the Ting pack service, in this folder, with its kit. Use when someone wants to make a new Ting world, pack or story and has no code yet.
argument-hint: [what it's about]
---

# Start a Ting world or pack

Two ways to write for Ting:
- **A world of your own** (usually what people want): your own story from Day 0, over one of Ting's settings
  (the mountain town or the city, in Chinese, or the rural village, in Japanese): its map and how it plays, with your own
  town name, people, words and story.
- **A pack**: scenes laid into one of Ting's own towns, after one of its quests, adding without changing
  anything there.

Ask which if it isn't clear (say a world is the usual choice). Starting either makes a starter on the service
(playable and passing its checks from the start) and gives it its code.

**For a world:** choose the setting by the language and the place (`worlds` lists them; `chinese` is the mountain
town, `chinese` with `--map city` the city, `japanese2` the rural village), its id (as in step 3), and start it,
with the invite code (step 4):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" new <id> --world <setting> [--map city] --own --title "<its title>" --by "<their name, as credited>" --invite <their invite code> .
```

Then step 5 (its code), and `/ting:plan`. The steps below are for a pack.

1. **The world.** Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" worlds`. If there's more than one and
   the person hasn't said, ask which (by the language they're teaching).

2. **Where it goes.** Fetch the world's kit here, to choose from:

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" kit <world> .
   ```

   Read `kit/world/quests.md` (the quests in order, each with its goal and what it says of tomorrow) around
   where the person's idea fits. Suggest the quest it goes after, saying why in a sentence (what the player
   knows by then, who they've met), and let them choose. Not one that runs straight on into the next: nothing
   can go between those. `kit/README.md` ("Where a
   pack goes") says how a pack sits in the world's day: read it, and the `tomorrow` line of the quest before.

3. **Its id.** Short, lower-case letters and digits, from the idea (`nightmarket`, `tearoad`). Every one of
   its quest ids will start with it.

4. **Start it.** Starting a pack needs the invite code Ting gave them (`INV-XXXX-XXXX`): ask for it if they
   haven't given it.

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" new <id> --world <world> --after <quest id> --by "<their name, as credited>" --invite <their invite code> .
   ```

   The `.` starts it in this folder, beside the kit.

   Ask how they'd like to be credited if they haven't said. If the id is taken, suggest another. If the invite is
   refused, say so plainly: they'll need to ask Ting for one.

5. Tell them the pack is started, and give them its code once, saying it opens the pack anywhere and that
   anyone with it can change it, so they should keep it somewhere safe. Then offer `/ting:plan`: a plan
   first is quicker to change than written scenes.
