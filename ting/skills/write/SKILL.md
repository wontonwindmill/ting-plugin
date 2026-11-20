---
description: Write a Ting world's scenes into pack.json from its agreed plan - quests in shapes and pieces, new words, people and things - then check it, have it read, and loop until it's clean, then save it. Use for "write day 1 of my world", "write the next day", "write my world from the plan".
argument-hint: [which day]
---

# Write a Ting world

From the agreed `plan.md` to scenes that play. **Write only what the plan says**: a change of design goes back
to the plan, and to the person. (With no plan, for something small, write from what the person asked, and say
what you decided.) Work in the world's folder (`pack.json`, `plan.md`, `kit/`, `.ting/`); the
client is `node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs"`.

A world of its own (`"kind": "world"`) is written in Ting's authoring format, with what a world has besides its
quests: its `setup` (name, opening, motives, goal), its `letter`, its `town` (signs on the buildings it uses, named
spots) and `places` lines. Its first quest is on Day 0.

## 1. Read before writing

- **The plan's day**, and the days either side of it.
- **What comes before:** what the world has so far (`check` writes it to `.ting/script.md`).
- **How it's written:** `kit/writing-worlds.md`, then the example worlds (`kit/examples/*.json`): copy their idiom,
  not the plan's prose. `kit/writing-packs.md` (shapes, steps, bars, workstations), `kit/quests.schema.json` (every
  step's fields), `kit/taste.md` (what the readers hold it to).
- **The setting:** `kit/setting/README.md` and `kit/setting/setting.json` (its buildings, spots, rooms and sets).

## 2. What a world holds

All in `pack.json`:
- `quests`: every id starts with the world's id and `_` (`nightmarket_arrive`). Give each its `day`. Keep
  `"more": true` on a story quest that shouldn't end its day.
- `words`: every word it uses, its own (there's no glossary to borrow from), as the setting's language writes them
  (Chinese: `s`, `pinyin`, `meaning`, `kind`, `hsk`; Japanese: `s`, `reading`, `romaji`, `meaning`, `kind`, `jlpt`).
  A taught word is `"kind": "word"` with its level: on `kit/setting/level-list.json` it's level 1 (HSK) or 5
  (JLPT); otherwise its level on the same exam's later lists. A person's name is a word too, `"kind": "name"`.
- `npcs`: its people, shaped like the example worlds' (copy one similar and change it): `look`, `at` (where they
  stand), `voice` (one of the voices the examples use, of a similar age and sex).
- `items`: things to hand over (the `letter` among them); `props`: its own workstation props, if any.

Choose shapes from `kit/writing-packs.md`: a visitor at the desk is a `guest`, even one who isn't staying (a key,
a card or a payment are pieces to add when the visit needs them, not requirements).

For a beat the pieces can't play, use the plan's closest version and say so; never invent fields (the check
refuses them). The schema is long: the example worlds show each step kind's fields faster.

## 3. Write it

Every line in the house voice: clear full sentences, natural English, the language only as taught, one topic
per run of lines.

**The rules that bite** (each one costs a round):
- **Correct language only.** In 云来 (Chinese): 不 only right before a verb or adjective (不要, 不好), never
  "不 the X" or a lone 不, and 没有 for haven't got. A Chinese number never straight before a Chinese noun:
  "three 孩子", "两个包子", "两杯茶", never "三 孩子". 两 for counted things, 二 only counting aloud. Time words
  before the verb ("今天 开", never "开 今天"). In 森野 (Japanese), the same care: particles and counters right.
- **A wrong answer is still correct language,** and every option looks alike, so the right one isn't the only
  one with extra English. The key is in the language, never only the English.
- **Nobody quizzes the player** except in character with a reason; each person keeps their own job; no feuds
  in town; no clipped lines ("Bed. Now."), no odd idioms.
- **Flags:** a skipped step's `sets` count once it's passed, so never gate on a flag a skipped step sets: gate
  on a grade or on a chosen option's `sets`. Every flag set must be read somewhere.
- **Pointing:** a wrong thing must not lead on, and its reply must not give the answer away.
- **A free talk moves no bar;** a hand-over after a conversation adds nothing to it.
- **Recording:** English straight before or after the language garbles when it's voiced ("Thirty! 好的").
  Put words between them, or reword.

## 4. Make it play

Loop until clean:
1. **Check:** `check`. No ✗ problems. The notes are to read over (word budgets, claims that may no longer be
   true): fix what's real. "Not back by Day N" asks for a word to come back within two days: in a short pack,
   bring it back in a later scene of yours if you can, or say it's accepted.
2. **Guessing:** every graded conversation (one with a bar and a grade) under 20% for a player picking at
   random; picks that aren't graded aren't measured. Tune by the grade's
   thresholds, by more plausible wrong moves, or by what's neutral; never by making the right answer harder
   to read.
3. **The readers,** in one message, on `.ting/script.md` with the day before for context, each told what the
   plan meant the day to do: the **ting:line-reader** agent and the **ting:day-reader** agent. Fold in
   what's right; put the judgement calls to the person.

## 5. Save it

Save it (`/ting:save`), and tell the person: the day in three sentences, the choices to make, and that
`/ting:link` plays it on their phone, and `/ting:publish` sends it for review once they're happy (it's published,
and its lines recorded, once it's approved).
