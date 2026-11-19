# Ting for Claude Code

Write story packs for Ting, where players learn a language by living in a town: scenes, guests and errands
laid over one of Ting's worlds, in its language. Claude plans and writes them with you; Ting's pack service
checks every version, keeps them all, and records the lines in the world's voices when you publish.

You need Claude Code and Node 18 or later. There's no git and nothing else to install: your pack lives on the
Ting pack service, and its code opens it in any folder.

## Start

In an empty folder, in Claude Code:

- `/ting:new` starts a pack: Claude asks which world and what it's about, suggests where it goes in the
  story, and gives you its code. Keep the code: it opens the pack anywhere, and anyone with it can change it.
  For now, starting a pack needs an invite code from Ting.
- `/ting:open <code>` opens a pack you (or someone working with you) started.

## Write

- `/ting:plan` plans it first: the words day by day, the story, each day's problem worth solving. Quicker to
  change than written scenes.
- `/ting:write` writes the scenes from the plan, checks them, has them read for lines and for structure, and
  loops until they're clean.
- `/ting:check` checks what's in the folder without saving.
- `/ting:save` saves a version (every one is kept and checked). If someone saved from elsewhere, it merges.
- `/ting:play` gives a link to play your latest saved version in a browser, in a phone beside its quests.
- `/ting:link` gives a code for the Ting app, so you can play your drafts on your phone.
- `/ting:publish` sends it for review. Ting publishes it to the catalogue once it's approved, and its lines are
  recorded then.

## The folder

- `pack.json`: the pack. Yours to change.
- `plan.md`: the plan, once there is one.
- `kit/`: the world, to read: its words, people, places, every day as it plays, and how Ting's scenes are
  written (`kit/README.md`). Refreshed when you open the pack.
- `.ting/`: where the pack client keeps the code, the version you're on, and the last check and script.

The pack service is `https://ting-packs-wh.azurewebsites.net`; set `TING_SERVER` to use another (Ting's own development runs one at
`http://localhost:8090`).
