---
description: Write a Ting pack's scenes into pack.json from its agreed plan - quests in shapes and pieces, new words, people and things - then check it, have it read, and loop until it's clean, then save it. Use for "write day 1 of my pack", "write the next day", "write my pack from the plan".
argument-hint: [which day]
---

# Write a Ting pack

From the agreed `plan.md` to scenes that play. **Write only what the plan says**: a change of design goes back
to the plan, and to the person. (With no plan, for something small, write from what the person asked, and say
what you decided.) Work in the pack's folder (`pack.json`, `plan.md`, `kit/`, `.ting/`); the
client is `node "${CLAUDE_PLUGIN_ROOT}/scripts/ting-pack.cjs"`.

**A world of its own** (`"kind": "world"`): read `kit/writing-worlds.md` first. It's written like a pack, with what
a world has that a pack doesn't: its `setup` (name, opening, motives, goal), its `letter`, its `town` (signs on
the buildings it uses, named spots) and `places` lines. Its words, people and things are all its own (there's no
world glossary to reuse: every word it uses is in its own `words`, the first hello too). Where this skill points
at `kit/world/…`, read the setting instead (`kit/setting/README.md`, `kit/setting/setting.json`) and copy the
idiom of the example worlds (`kit/examples/`). Its first quest is on Day 0, and it has no `after`.

## 1. Read before writing

- **The plan's day**, and the days either side of it.
- **What comes before:** the world's quests up to the pack's day in `kit/world/quests.md` (each one's goal, and
  what it tells the player of tomorrow), and what the pack has so far (`check` writes it to `.ting/script.md`).
- **How it's written:** the example packs (`kit/examples/*.json`): copy their idiom, not the plan's prose. `kit/writing-packs.md` (the pack, shapes, steps, bars), `kit/quests.schema.json`
  (every step's fields), `kit/taste.md` (what the readers hold it to).
- **The words:** `kit/world/words.json` and `kit/world/word-pacing.md`.

## 2. What a pack can hold

All in `pack.json`; the pack adds to the world and never changes what's there:
- `quests`: every id starts with the pack's id and `_` (`tearoad_xu`). The first goes on the pack's day, after
  the quest in `after`. Keep `"more": true` on a story quest that shouldn't end its day.
- `words`: new words, as the world writes them (in 云来 `s`, `pinyin`, `meaning`, `kind`, `hsk`; in 森野
  `s`, `reading`, `romaji`, `meaning`, `kind`, `jlpt`). A taught word is `"kind": "word"` with its level:
  on `kit/world/level-list.json` it's level 1 (HSK) or 5 (JLPT); otherwise its level on the same exam's later
  lists. A new person's name is a word too, `"kind": "name"`, with no level. A word the world already has is
  used, never added again.
- `npcs`: new people, shaped like `kit/world/people.json`: copy the entry of someone similar and change it.
  `look` takes the values the world's people use; `at` is where they stand (a visitor at the desk stands
  where the world's desk guests do); `from` and `until` are the quests they're around for (usually your own).
  Their `voice` is one of the voices the world's people already use, of a similar age and sex.
- `items`: new things to hand over, shaped like `kit/world/things.json`.

Your first quest starts by itself once the quest in `after` is done, and someone of yours who only turns up
for it needs nothing else. Choose shapes from `kit/writing-packs.md`: a visitor at the desk is a `guest`,
even one who isn't staying (a key, a card or a payment are pieces to add when the visit needs them, not
requirements).

For a beat the pieces can't play, use the plan's closest version and say so; never invent fields (the check
refuses them). The schema is long: the world's quest files show each step kind's fields faster.

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
