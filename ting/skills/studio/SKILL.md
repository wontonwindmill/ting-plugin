---
description: Work for Ting Studio - wait for what the person asks of their world in the Studio's storyboard (build it, propose one, do a panel again, or a few words), do it here, saving versions and saying how it's going so the Studio shows it as it happens, then wait for the next. Use for "/ting:studio", "connect to the Studio", "build my storyboard", "do what I ask in the Studio".
argument-hint: (none)
---

# Work for Ting Studio

The person lays their world out in Ting Studio, as a storyboard (a comic of the game's moments, with notes), and
presses "Send to Claude Code". You do the work here, on their own Claude, and the Studio shows it as it happens:
your progress lines under a bar, and each version you save filling in the board. The client is
`node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs"`.

## 0. Connect, once

Claude Code works for the Studio as the person's Ting account. If it isn't connected yet (`studio` says so):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" login
```

Tell the person the link and the code it gives: they open it, signed in to the Studio, and allow it. Then run
`login --wait`, which waits for them (and says when it's connected). It's kept on this computer: next time
there's nothing to do. (Without connecting, a world opened by its key works too: run `studio` in its folder.)

## 1. Wait for a request

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" studio
```

Run it here (not inside a world's folder): it waits for what's asked of any of their worlds, up to 9 minutes. If
nothing's asked, run it again (tell the person once that you're waiting for the Studio, and that they can stop you
any time). When something's asked, it opens that world into a folder of its own here (`./<world id>`, with its
kit, at its latest version) and says what to do. Work in that folder: `push <folder>` to save; `progress` and
`done` work from here.

## 2. Do it

Keep the person in the loop the Studio's way: they're watching the board while you work.
- **A progress line at every step, at least every couple of minutes:** `progress <0-100> <what you're doing>`, short
  and in plain words ("Writing Day 1: the rival cart", "Checking Day 1", "The readers are reading Day 2"). The bar
  only moves when you say so.
- **One day at a time, saved as it's done:** write a day, check it, `push` it, and say so; then the next. Never
  write every day before saving: the board fills in as each day lands, and that's what they're watching for.
- **Nothing that stops to ask:** run the client on its own, with the world's folder as its argument
  (`push ./<world id>`, `check ./<world id>`), never chained with `cd`, `ls` or `cat`; read and search files with
  Read, Glob and Grep, and change `pack.json` with Edit and Write (never a script of your own). The person may not be
  at the keyboard to allow a command.

**What the board says** (`storyboard` in `pack.json`, described in `kit/writing-worlds.md`): `brief`, what the
world is about; `words`, the words wanted; `days`, each with what it's `about` and its `panels` in order, each a
moment (`mechanic`: a step kind, or `blank` for you to choose) with a `note` on what happens. A blank day or panel
follows the one above it, and the brief rules them all. Panels marked `mine` are the person's: keep them where
they are, and their notes as they are. Leave anything `locked` (and the scene it became) exactly as it is, and
every line in a panel's `lockedLines` (`<step id>/<field>/…` in its scene). A push that changes something locked is
refused: put it back as it was (never unlock it yourself), and push again.

**What's built stays built.** A panel with a `scene` is done: leave it, and its scene, as they are, unless the
request is about it (a `panel` request for it, or a `revise` of its day). A request with a `day` is about that day
alone: nothing on any other day changes.

- **build:** write the scenes for the panels with no `scene` yet (with a `day`: only that day's), as `/ting:write`
  does (read its skill for the rules and the readers; wait for each reader, never leave one running), one day at a
  time in the board's order. Each panel becomes a scene, or part of one: set its `scene` to the quest id it became,
  so the Studio can open it. A blank panel is yours to choose, and may become several scenes (add panels for them,
  after it, and say so in their notes). Words: the board's `words`, or choose them from the brief and the world's
  `level`; a new day carries on from the words the days before it taught (bring them back, then teach new ones).
  Check, then push, after each day, with a progress line. Then the readers go over the day: fold in what's
  clearly right (a wrong word, a clumsy line), and send each thing that's the person's call with `note`.
- **Ting's own story** (`"original": true` in `pack.json`: 云来's, or 森野's, shared by Ting's team) is a world
  like any other, with two differences. Its scenes keep the ids they have (players' saves and the recordings go by
  them): name new ones the way the story does (`q_<name>` for a story, `g_<name>` for a guest, `m_day<N>` for a
  morning), never with the world's id. And players are part-way through it: change a day they may have played only
  when the request is about it, and never take a scene away (rename nothing; a release that drops one is refused).
- **A world just started in the Studio** has placeholders: one arrival scene (`<id>_arrive`, a line from `host`),
  and a town called 小镇 in its `setup`. Make them the board's: the town's name, its people and its Day 0, from the
  brief and the board (`kit/writing-worlds.md` says what a world's `setup` needs).
- **propose:** fill the board in, and write no scenes (with a `day`: only that day). Every day gets what it's about
  (`about`, with `aiAbout: true` where you wrote it), and panels in order (a `mechanic` and a `note` each), around
  the person's own. No words given: choose them (10 to 20 for a first world, at its level) into
  `storyboard.words`. Follow the length rule in `kit/writing-packs.md` (a day that brings the words back after
  every two that teach them). A new day follows from the days before it: what's happened, who's met, which words
  are known. Push.
- **read:** go over that day and change nothing. Run `check`, then the line reader and the day reader on it (the
  plugin's `ting:line-reader` and `ting:day-reader` agents, given the day's scenes from `.ting/script.md`). Send each
  finding as its own `note`, in a sentence the person can act on, with `--panel <panel id>` when it's about one
  panel's scene:

  ```bash
  node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs" note "Mr Gao's second line says 你好 twice; the second could be his name" --panel nightcart1x1
  ```

  The person ticks the ones they want, and asks for them as a `revise`.
- **revise:** change that day as the note says (often a list of the readers' findings the person chose), and
  nothing else, and nothing locked. Check it, have it read, push.
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
