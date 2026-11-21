---
description: Work for Ting Studio - wait for what the person asks of their world in the Studio's storyboard (build it, propose one, do a panel again, or a few words), do it here, saving versions and saying how it's going so the Studio shows it as it happens, then wait for the next. Use for "/ting:studio", "connect to the Studio", "build my storyboard", "do what I ask in the Studio".
argument-hint: [world's key, if it isn't open here yet]
---

# Work for Ting Studio

The person lays their world out in Ting Studio, as a storyboard (a comic of the game's moments, with notes), and
presses "Send to Claude Code". You do the work here, on their own Claude, and the Studio shows it as it happens:
your progress lines under a bar, and each version you save filling in the board. The client is
`node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs"`.

## 0. Be in the world's folder

It has `pack.json` and `.ting/sync.json`. If it isn't here, open it with its key (Studio › Settings › Its key):
`open <key>`, which writes the folder and its kit. Then work in that folder.

## 1. Wait for a request

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" studio
```

It waits up to 9 minutes. If nothing's asked, run it again (tell the person once that you're waiting for the
Studio, and that they can stop you any time). When something's asked, it takes the world's latest version into
`pack.json` and says what to do.

## 2. Do it

Keep the person in the loop the Studio's way: `progress <0-100> <what you're doing>` at each step (a short line, in
plain words: "Writing Day 1: the rival cart"), and `push` after each day or so, so the board fills in as you go.

**What the board says** (`storyboard` in `pack.json`, described in `kit/writing-worlds.md`): `brief`, what the
world is about; `words`, the words wanted; `days`, each with what it's `about` and its `panels` in order, each a
moment (`mechanic`: a step kind, or `blank` for you to choose) with a `note` on what happens. A blank day or panel
follows the one above it, and the brief rules them all. Panels marked `mine` are the person's: keep them where
they are, and their notes as they are. Leave anything `locked` (and the scene it became) exactly as it is.

- **build:** write the scenes the board describes, as `/ting:write` does (read its skill for the rules and the
  readers), one day at a time in the board's order. Each panel becomes a scene, or part of one: set its `scene` to
  the quest id it became, so the Studio can open it. A blank panel is yours to choose, and may become several
  scenes (add panels for them, after it, and say so in their notes). Words: the board's `words`, or choose them
  from the brief and the world's `level`. Check, then push, after each day, with a progress line.
- **propose:** fill the board in, and write no scenes. Every day gets what it's about (`about`, with
  `aiAbout: true` where you wrote it), and panels in order (a `mechanic` and a `note` each), around the person's
  own. No words given: choose them (10 to 20 for a first world, at its level) into `storyboard.words`. Follow the
  length rule in `kit/writing-packs.md` (a day that brings the words back after every two that teach them). Push.
- **panel:** do that one panel's scene again, as the note asks. Change nothing else. Check, push.
- **ask:** do what the note says, as the person would in a conversation with you. Check, push.

Then say it's done, in a line the Studio shows:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" done "Wrote the three days: 9 scenes, all passing"
```

If you can't do it (it asks for something Ting can't do yet, or the checks won't pass), say so with
`done "<why>" --failed`, after saving what you have.

## 3. Wait again

Run `studio` again for the next request, until the person stops you.
