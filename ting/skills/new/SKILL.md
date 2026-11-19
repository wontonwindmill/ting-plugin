---
description: Start a new Ting pack - story scenes for one of Ting's language-learning towns - on the Ting pack service, in this folder, with the world's kit. Use when someone wants to make a new Ting pack or story and has no code yet.
argument-hint: [what it's about]
---

# Start a Ting pack

A pack is laid over one of Ting's worlds, after one of its quests, and adds to the world without changing
anything there. Starting one makes a single starter scene on the service (playable and passing its checks
from the start) and gives the pack its code.

1. **The world.** Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" worlds`. If there's more than one and
   the person hasn't said, ask which (by the language they're teaching).

2. **Where it goes.** Fetch the world's kit here, to choose from:

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" kit <world> .
   ```

   Read `kit/world/quests.md` (the quests in order) and skim the scripts of the days around where the
   person's idea fits (`kit/world/script/day-NN.md`). Suggest the quest it goes after, saying why in a
   sentence (what the player knows by then, who's in town), and let them choose. `kit/README.md` ("Where a
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
