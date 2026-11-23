---
description: Plan a Ting world before writing it - from a premise and a word list - its words day by day, its arc, each day's guest and project with a problem worth solving, its cast, places and papers, and what Ting can't do yet; then have it read. Writes plan.md, no scenes. Use for "plan my world", "plan a world about a night market with these words", or before /ting:write on anything new.
argument-hint: [premise, words, how long]
---

# Plan a Ting world

A plan is cheap to change and written scenes aren't, so the problems this catches (nothing at stake, the same
beat twice, a word taught and never used, a mechanic Ting doesn't have) are caught here. **Write no scenes and
don't touch `pack.json`.** The output is `plan.md` in the world's folder, agreed with the person.

Work in the world's folder (it has `pack.json`, `kit/` and `.ting/`). If there's no world yet, start one first
(`/ting:new`).

**A world of its own** (`"kind": "world"` in `pack.json`, its setting's kit in `kit/setting/`): read
`kit/writing-worlds.md` first. There's no story before it: the player knows nothing on Day 0, so the word plan starts
from the first hello, and every person, place and thread is yours. The plan also says: the town's name and why the
player has come (the notice, the letter, the host), the long goal, which buildings the story uses and what they're
called, and Day 0 (short: arrive, meet the host, learn why you're here).

## 1. What it's for

From the person: the premise, the words they want taught (or the topic, and you propose words), and roughly
how long (days). If something the plan can't do without is missing, ask in one message; otherwise decide and
say what you assumed at the top of the plan.

## 2. Know what's there

Read before planning (the plan is only as good as this):
- **The setting:** `kit/setting/README.md` (its buildings, named spots and rooms, and what each can be),
  `kit/setting/setting.json` (the sets: where a conversation can happen and what can be handed over),
  `kit/setting/glyphs.md` (the pictures things can have).
- **The words:** `kit/setting/level-list.json` (what counts as a first-level word); every word the world uses is its
  own, in its `words`, the first hello too.
- **How a world reads:** the example worlds (`kit/examples/`): their days, their people, how words come in.
- **What Ting can do:** `kit/writing-packs.md` (shapes and steps, and what each is good for) and
  `kit/quests.schema.json` (every step kind and field).
- **What works:** `kit/taste.md`, all of it.

## 3. The word plan

For each day: its 3–5 new words, and for each word:
- **not already taught** by the world before the pack's day (word-pacing says), and not taught twice;
- **the player uses it the day it's taught** (says it, picks it, builds it, reads it), not just hears it;
- **back within two days**, in a different beat;
- whether it needs **a measure word or a pattern** taught with it.

Then the totals, and flag a day over budget.

## 4. The arc

The pack in one sentence: what's at stake, and what's different at the end. Then each day:
- **The guest** (if the world has an inn's desk) and **the project**, each with **a problem worth solving**, a
  choice or a consequence, and what the player must understand in the language to do well. The key is in
  the language, never only in the English.
- **The pieces** each beat uses, and why that one (a listen-in for something overheard, a read for something
  written, a conversation on a bar for winning someone over). No beat twice in three days.
- **The people** (new or from the world, each with a want), **places**, **papers**, and a short **morning**
  (a small job, never a tap-through).
- **Setups and payoffs:** what each day plants and pays off. Leave the world's own threads as they are:
  the pack adds, it never changes what happens in the world.
- **The facts sheet:** a short **Facts** list the writing and the readers check every line against: prices
  (what each thing costs, and in what words: 块 aloud), rooms (who sleeps where, what's in them), times (what's
  open when, which train), who knows what and from when, and promises made. The arc reader holds the days to it.
- **House rules:** no feuds in town; nobody quizzes the player (a question is real only when the asker doesn't know the answer; a game is fine when it's plainly one); each
  person keeps their own job.

## 5. What Ting can't do yet

For a beat that needs something the pieces don't have: the closest version made from what's there (the plan
uses that), and the wish, one line. Never plan around a mechanic that isn't there.

## 6. Write it, and have it read

1. Write `plan.md`: the assumptions; the one-sentence arc; the word plan (a table, then the totals); each
   day; the facts sheet; the cast, places and papers; the wishes.
2. Have it read: send the **ting:day-reader** agent the plan with the days before it from the kit, telling it
   this is a plan, not a script, so it judges the design (a problem, a choice, variety, the key in the
   language), not the lines.
3. Fold in what's clearly right. Put the judgement calls to the person as short choices.
4. Show them the plan in brief (the arc, the days, the words) and ask them to agree or change it. Once they
   agree, `/ting:write` builds from it.
