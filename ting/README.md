# Ting for Claude Code

Make worlds for Ting, where players learn a language by living in a town: your own story from Day 0, with your
own town, people and words, over one of Ting's settings (a mountain town or a city in China, a village in Japan).
Claude plans and writes it with you; Ting's service checks every version, keeps them all, and records the lines in
the town's voices when you publish.

You need Claude Code and Node 18 or later. There's no git and nothing else to install: your pack lives on the
Ting service, and its code opens it in any folder.

## Start

In an empty folder, in Claude Code:

- `/ting:new` starts a world: Claude asks which setting and what it's about, and gives you its code. Keep the
  code: it opens the world anywhere, and anyone with it can change it. For now, starting one needs an invite code
  from Ting.
- `/ting:open <code>` opens a world you (or someone working with you) started.

## Write

- `/ting:plan` plans it first: the words day by day, the story, each day's problem worth solving. Quicker to
  change than written scenes.
- `/ting:write` writes the scenes from the plan, checks them, has them read for lines and for structure, and
  loops until they're clean.
- `/ting:check` checks what's in the folder without saving.
- `/ting:save` saves a version (every one is kept and checked). If someone saved from elsewhere, it merges.
- `/ting:studio` works for Ting Studio: lay your world out there as a storyboard, press "Send to Claude Code", and
  Claude builds it here, on your own Claude, while the Studio shows it as it happens. It waits for the next ask.
- `/ting:play` opens your latest saved version in Ting Studio, in a browser, with the game playing it beside.
- `/ting:link` gives a code for the Ting app, so you can play your drafts on your phone.
- `/ting:publish` sends it for review. Ting publishes it to the catalogue once it's approved, and its lines are
  recorded then.

## The folder

- `pack.json`: your world. Yours to change.
- `plan.md`: the plan, once there is one.
- `kit/`: the setting, to read: its map, buildings, rooms and props, the example worlds, and how Ting's scenes are
  written (`kit/README.md`). Refreshed when you open the world.
- `.ting/`: where the client keeps the code, the version you're on, and the last check and script.

The service is `https://studio.tinglanguage.com`; set `TING_SERVER` to use another (Ting's own development runs one at
`http://localhost:8090`).
