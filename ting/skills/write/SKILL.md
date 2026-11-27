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
  step's fields), `kit/taste.md` (what the readers hold it to). Read **`kit/taste.md` §12, What good looks like**,
  closely: its lines are the standard. Write like them.
- **The plan's facts sheet** (`plan.md`, Facts): every price, room, time and who-knows-what you write must match
  it. A new fact the story needs goes on the sheet as you write it.
- **The setting:** `kit/setting/README.md` and `kit/setting/setting.json` (its buildings, spots, rooms and sets).

## 2. What a world holds

All in `pack.json`:
- `quests`: every id starts with the world's id and `_` (`schooltrip_arrive`). Give each its `day`. Keep
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
per run of lines. **At the world's `level`:** a beginner's world (0) is English with the taught words in it. A
Chinese world for learners past beginners (`"level"` 1 or more) is written in two goes:
1. **You write every line in English**, as the scene should go: natural, clear, in each person's voice, with the
   taught words in Chinese where they're used and names as the glossary writes them. Options, a build's tiles and a
   note's phrases too, in English, as they tie to the lines.
2. **`level` writes them in Chinese at the level** (on the service: what each line does is read first, then the
   Chinese written from that, checked, and read by a native speaker). It saves a version and pulls it. Lines it has
   written already, and lines the person keeps exactly, are left alone; so a line you change by hand afterwards
   stays, if it passes.
How much is Chinese follows the level (`kit/writing-worlds.md` has lines at each): at HSK 1, English with whole short
Chinese pieces (好的。谢谢！); at HSK 2, short lines in Chinese; from HSK 3, what people say is in Chinese, English only
for a word above the level that isn't taught. A line may reach one word from the level above (tapped for its meaning).
The quest bar, the sky's lines and Ting's help stay in English. (A Japanese world is written in its language at its
level by you: there's no `level` for it yet.)

**The rules that bite** (each one costs a round):
- **Correct language only.** In 云来 (Chinese): 不 only right before a verb or adjective (不要, 不好), never
  "不 the X" or a lone 不, and 没有 for haven't got. A Chinese number never straight before a Chinese noun:
  "three 孩子", "两个包子", "两杯茶", never "三 孩子". 两 for counted things, 二 only counting aloud. Time words
  before the verb ("今天 开", never "开 今天"). In 森野 (Japanese), the same care: particles and counters right.
- **Measure words, 块 and polite forms.** Prices said aloud are in 块 (元 is for signs). 少 and 多 never stand
  alone ("A thousand is 少" is 太少, or English). In Japanese, you work at the desk: おはようございます and 5000円です
  to a guest, plain forms only to friends.
- **A wrong answer is still correct language, and something a sensible person would say.** Every option looks
  alike, so the right one isn't the only one with extra English. The key is in the language, never the English,
  the numbers or kindness: cover the language, and you shouldn't be able to tell which is right.
- **Hints point; they never say the answer.** A nudge says where to listen ("He changed his mind, dear. Listen to
  the end."), never the right move's words; a wrong answer's reply points the way in character, never "Say 你好."
- **Explain a word only when it's for something** (what you're about to do, or how things are done here), once.
  Most words are taught in use: the moment makes the meaning.
- **Nobody quizzes the player.** A question is real only when the asker doesn't know the answer; bad eyes or bad
  ears never make a test a question. Each person keeps their own job; no feuds in town; no clipped lines ("Bed.
  Now."), no odd idioms.
- **Each guest gets a beat of their own,** each fact wins one encounter, each scene opens on what's happening, and
  a word comes back where it's needed, never crammed into a scene to count.
- **Flags:** a skipped step's `sets` count once it's passed, so never gate on a flag a skipped step sets: gate
  on a grade or on a chosen option's `sets`. Every flag set must be read somewhere.
- **Pointing:** a wrong thing must not lead on, and its reply must not give the answer away.
- **A free talk moves no bar;** a hand-over after a conversation adds nothing to it.
- **Recording:** English straight before or after the language garbles when it's voiced ("Thirty! 好的").
  Put words between them, or reword.

## 4. Make it play

Loop until clean:
0. **Level it** (a Chinese world past beginners): `level`, once the day's scenes are written in English and saved
   (it pushes what's here first). It says what it wrote, and lists any line it couldn't get to pass: fix those by
   hand, in Chinese at the level. Run it again after you add scenes or rewrite lines in English; the rest stays.
1. **Check:** `check`. No ✗ problems. Read every note (explanations, 元 said aloud, crammed words, twin scenes,
   pet phrases, words that could come back more): fix what's real. Coming back is an ideal: bring a word back
   where a later scene needs it, never by saying it more. "Before it goes out" lists what must be done before
   it's sent for review (fine while writing).
2. **Guessing:** every graded conversation (one with a bar and a grade) under 20% for a player picking at
   random. Get there first with wrong moves a sensible person would make, ruled out by something said earlier;
   then by what's neutral; tune the grade's thresholds last, and leave a point to spare at the top. Never by
   making the right answer harder to read, and never with absurd wrong options.
3. **The readers,** in one message, on `.ting/script.md` with the day before for context, each told what the
   plan meant the day to do: the **ting:line-reader**, **ting:day-reader** and **ting:guess-reader** agents.
   Once a whole day or more is written, the **ting:arc-reader** too, with the plan's facts sheet. Fold in what's
   right; put the judgement calls to the person.

## 5. Save it

Save it (`/ting:save`), and tell the person: the day in three sentences, the choices to make, and that
`/ting:link` plays it on their phone, and `/ting:publish` sends it for review once they're happy (it's published,
and its lines recorded, once it's approved).
