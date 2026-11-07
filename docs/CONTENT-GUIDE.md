# Content Guide — chapters, ideas, tactics

All content is JSON in `data/`. Run `npm run validate` after every change; it must print `OK`.

**Golden rule: never copy text from a published book.** The source book (credited in `src/site.config.js`) is copyrighted. Write every title, summary, idea and
tactic in your own words, and do not name the book or its author anywhere except the footer credit and About → Credits. Content cites ideas by ID (`"5.3"`); the site renders the idea from `data/chapters/`.
The validator rejects double-quoted passages longer than 12 words.

## 1. Outline — `data/book.json`

Parts (`fundamentals`, `law1`–`law4`, `advanced`) with `label`, `rule`, `inverse` (for the four laws), `color`
(`ink | blue | pink | green | amber | violet`) and their chapter numbers; plus 20 original chapter titles (questions, e.g. "Who are you copying?").

## 2. Chapter — `data/chapters/chNN.json` (NN = 01..20)

```json
{
  "n": 5,
  "short": "Time, place, stack",
  "essence": "Give every new habit a time, a place and an anchor.",
  "modern_lens": "2–3 sentences: what this chapter means for work, business and home.",
  "key_idea": "5.3",
  "ideas": [
    { "id": "5.1", "name": "Implementation Intentions", "text": "20–70 words, original wording.", "try": "One small exercise, ≤ 30 words." }
  ]
}
```
- `short` ≤ 6 words (our own label; shown on cards). `essence` ≤ 90 characters.
- `ideas`: 4–6, IDs in order `n.1`, `n.2`, … `name` ≤ 6 words. `key_idea` must be one of them (it is the chapter's anchor for AI retrieval).

## 3. Tactics — `data/tactics/chNN.json` (array, 3 per chapter)

```json
{
  "slug": "stack-it-on-standup",
  "title": "Stack It on Standup",
  "situation": "One line, ≤ 140 chars.",
  "domain": "work",
  "mode": "build",
  "tags": ["recognition", "team", "standup"],
  "chapter": 5,
  "principle": "Habit stacking",
  "ideas": ["5.3", "5.4"],
  "scene": "Picture this: … (70–120 words, second person, ends with a one-line lesson)",
  "moves": [ { "title": "≤ 6 words", "detail": "25–60 words of concrete action." } ],
  "script": { "label": "Team message", "text": "40–110 words with [placeholders]." },
  "backfire": "When NOT to use it, health/ethics line, when to get professional help (30–70 words).",
  "signals": "How you know it is working (15–40 words).",
  "effort": "minutes",
  "difficulty": 1,
  "featured": false
}
```

Field rules
- `slug` kebab-case, unique, ≤ 40 chars. `title` ≤ 6 words.
- `domain`: `work`, `career`, `business`, `health`, `family`, `self`. `mode`: `build` or `break`.
- `ideas`: 1–3 IDs that exist; at least one from the tactic's own chapter.
- `moves`: 3–5. `effort`: `minutes | hours | days`. `difficulty`: 1–3. `featured`: `true` for at most 3 (the starter habits on the home page).

Tone
- Warm, practical, specific. Tiny steps over big plans. Never shaming.
- Modern details (Slack, CRM, standups, delivery apps, group chats, school runs). Plain English, no emojis.
- Health: no crash diets, extreme fasting or overtraining; point to a doctor for dependence, eating, mood or safety issues.

Domain mix: ≥ 40% `work`/`career`/`business`, ≥ 25% `health`/`family`/`self`. Current: 33 / 27 of 60.

---

## 4. Habit Challenge questions — `data/challenge/setN.json` (array)

The Habit Challenge has three runs: Hop (6), Skip (12) and Jump (20), drawn from a bank of **30 scenarios**
(`set1.json`). Questions cycle: unseen ones come first. Each question is an everyday habit dilemma with
**5 candidate moves**; the player selects every move that would help. Score per question =
correct ÷ (correct + missed), where *missed* = helpful moves left out + unhelpful moves picked.

```json
{
  "id": "c-nine-days-of-avoidance",
  "chapter": 13,
  "domain": "work",
  "difficulty": 2,
  "title": "Nine Days of Avoidance",
  "scenario": "40–130 words, second person, present tense, concrete details (who, what, stakes).",
  "options": [
    { "text": "Imperative move, at most ~22 words.", "correct": true, "why": "At most ~35 words: why this helps or backfires." },
    { "text": "…", "correct": false, "why": "…" }
  ],
  "ideas": ["13.1", "13.2"],
  "tactic": "just-open-the-file",
  "lesson": "One-line takeaway, at most 140 characters."
}
```

Rules
- `id`: `c-` + kebab-case, unique across all sets, at most 40 characters.
- `chapter` 1–20, `domain` one of `work`, `career`, `business`, `health`, `family`, `self`, `difficulty` 1–3.
- `title`: at most 6 words. `options`: exactly 5; 1, 2 or 3 correct (aim for about 20% / 50% / 30%). Never "all of the above".
- Wrong moves must be **plausible human reactions** that break a habit principle: relying on willpower, going too big,
  all-or-nothing after a miss, waiting for motivation or a fresh start, shaming or punishing, adding rules instead of
  removing friction, tracking the wrong number. Do not make them silly.
- Correct moves must be safe, kind and practical: obvious cues, attractive pairings, less friction, immediate rewards,
  identity votes, tiny starts, tracking, review.
- `why`: explain the principle in plain words; no quotes from any book.
- `ideas`: 1–2 idea IDs; at least one from the question's `chapter`. `tactic`: optional slug of an existing tactic.
- Mix domains: at least 40% work/career/business, at least 25% health/family/self.
