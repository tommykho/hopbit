# CLAUDE.md — Hopbit: Micro incremental habits

Static Astro site that turns micro-habit ideas into practical tactics for work, career, business, health, family and
self, with an AI Habit Coach and a 30-second podcast generator. Live test site: https://tommykho.github.io/hopbit/

This file is also the **consolidated knowledge base for all three sister sites** (Hopbit, Sun Tzu, Five Rings),
pooled from the Nov 2026 build sessions. Part A is Hopbit; Part B applies to all three.

---

# Part A — Hopbit

## Commands

```bash
npm ci                 # Node 20+ (CI uses 22)
npm run dev            # http://localhost:4321
npm run validate       # MUST print OK: book, chapters, tactics, challenge, long-quote guard
npm run build          # validate + astro build → dist/ (~88 pages)
npm test               # relay unit tests (24)
```
Sub-path build (as GitHub Pages): `SITE_URL=https://tommykho.github.io BASE_PATH=/hopbit npm run build`.

## Repo facts

- GitHub `tommykho/hopbit` (renamed from `atomichabits`). The local clone may still be `/home/user/atomichabits`, and a
  container restart can revert `origin` to the old URL: run `git remote -v` and re-set it before every push.
- Working branch `claude/pensive-cray-kiis8w`; `main` was fast-forwarded to it on 2026-11-07. Pages deploys from both,
  so a push to either replaces the live site. Fast-forward `main` only with the user's go-ahead.

## Copyright and trademark — non-negotiable

- *Atomic Habits* (James Clear, 2018) is **copyrighted**; the title is also a trademark. It is not public domain.
- Never use pirated copies (the archive.org "PDFDrive" upload was refused). Never reproduce or paraphrase closely.
- All content is original summaries ("ideas") cited by ID `[5.3]`. Chapter titles are **original question-style titles**
  (`data/book.json`); chapter numbers follow the source.
- Credit the book **only** in the footer and About → Credits (`SITE.book` in `src/site.config.js`). Everywhere else
  say "micro-habits". The validator rejects quoted passages over 12 words.

## Content model (data/)

| File | What | Key rules (validator) |
|---|---|---|
| `book.json` | parts (Fundamentals + 4 Laws, `rule`/`inverse`/`color`) + chapter titles | chapters 1..N in order, each in a part |
| `chapters/chNN.json` | `n, short, essence, modern_lens, key_idea, ideas[]` · idea `{id, name, text, try}` | 4–6 ideas, id `n.k`, name ≤ 6 words, text 20–70 words, try ≤ 30 |
| `tactics/chNN.json` | 60 tactics (3/chapter), `mode` build/break, `domain`, `ideas` 1–3, `moves` 3–5, `script`, `backfire`, `signals` | title ≤ 6 words, an idea from its own chapter, ≤ 3 featured |
| `challenge/set1.json` | 30 Habit Challenge scenarios, 5 options (1–3 correct), `ideas` 1–2, `lesson` | scenario 40–130 words, no "all/none of the above" |
| `community-demo.json` | demo board entries | — |

Domains: `work, career, business, health, family, self`. Full brief: `docs/CONTENT-GUIDE.md`.

## Site architecture

- `src/site.config.js` — `SITE` (name, tagline, `book` credit, `url`, `repo`).
- `src/lib/content.js` — `chapters`, `parts`, `tactics`, `ideaMap`/`getIdea`, `ideaHref` (`/chapters/5/#i5-3`),
  `relatedTactics`, `featured`, `DOMAINS`, `MODES` (build/break), `corpus()` for the AI.
- `src/lib/url.js` — `BASE`, `u()`, `RELAY_URL` (env-guarded so Node scripts/tests can import it).
- `src/lib/ranks.js` — Kit → Hopper → Sprinter → Jackrabbit → Snow Hare → Moon Rabbit (marks `1`–`6`), unranked
  `Wild Rabbit`; `coachRank(provider, model)` rates AI coaches, `rankForScore` rates players.
  `src/lib/modes.js` — Hop 6 / Skip 12 / Jump 20.
- Pages: `/`, `/chapters/`, `/chapters/[n]/`, `/tactics/` (`?ch=` filter), `/tactics/[slug]/`, `/challenge/`,
  `/coach/` (Ask the Coach), `/community/`, `/about/`, `/corpus.json`, `/challenge.json`, `/robots.txt` (generated).
- localStorage prefix `op.`: `op.settings.v2`, `op.keys.v1`, `op.ratings.v1`, `op.challenge.v1`, `op.theme`, `op.moves`,
  `op.community.*`.
- Brand: Hopbit brand kit (skill `hopbit-brand-kit`). `public/hopbit-diecut.svg` = V3 die-cut rabbit (mist belly),
  `BrandMark.astro`; icons `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` use the avatar (die-cut is illegible
  under 24 px). Habit-journal theme, light + dark toggle.

## Deploy

- `.github/workflows/pages.yml`: on push to the branch or `main`; `actions/configure-pages` (id `pages`) feeds
  `SITE_URL`/`BASE_PATH`; `PUBLIC_RELAY_URL=https://hopbit-relay.vercel.app/api/relay`.
- Vercel: `hopbit-relay` is live. The old `atomichabits-relay` project still exists, unused: delete only if the user asks.
- Cloudflare Pages (`wrangler.toml` name `hopbit`, `https://hopbit.pages.dev`) = production option, not yet set up.
  Details: `docs/DEPLOY.md`.

---

# Part B — Sister sites: shared knowledge

Three sites, one stack. Fix a shared bug in all three; port features between them. Sun Tzu has no CLAUDE.md (this
section covers it); Five Rings has its own CLAUDE.md with its source and copy-guard details.

| | suntze | hopbit | fiverings |
|---|---|---|---|
| Book | Sun Tzu, *Art of War*: Giles 1910 + 原文, both public domain | *Atomic Habits*: **copyrighted**, credited only | Musashi, *Book of Five Rings*: 原文 public domain, own English |
| Live | tommykho.github.io/suntze/ | tommykho.github.io/hopbit/ | tommykho.github.io/fiverings/ |
| Pages deploys from | `main` | branch **and** `main` | `main` |
| BASE_PATH in workflow | hardcoded `/suntze` | `actions/configure-pages` outputs | hardcoded `/fiverings` |
| AI relay | suntze-relay.vercel.app | hopbit-relay.vercel.app | reuses suntze-relay |
| Units | 13 chapters · 383 verses · 52 tactics | 20 chapters · 100 ideas · 60 tactics | 5 scrolls · 89 sections · 45 tactics |
| Citation IDs | `[3.18]` verse | `[5.3]` idea | `[3.4]` section |
| Skill test | `/field/` Field Challenge · 探花/榜眼/狀元 · 鄉 → 帝 | `/challenge/` · Hop/Skip/Jump · Kit → Moon Rabbit | `/trial/` Dojo Trial · 稽古/試合/真剣 · 入門 → 二天 |
| AI page | `/ask/` Ask the General | `/coach/` Ask the Coach | `/ask/` Ask Musashi |
| localStorage | `sz.` (+ `sz.lang` EN/中文) | `op.` | `fr.` (+ `fr.lang`, `fr.furi`) |
| Theme | ink-wash dark | habit journal, light + dark | lacquer/washi dark |
| Data | `verses.en.json`, `zh/`, `sources/`, `npm run data` rebuilds verses | see Part A | `sources/gorin-ja.json`, `scrolls.en.json`, `guard/` |

Skill-test modes are always 6 / 12 / 20 questions.

**Shared stack:** Astro 7 static, no inline scripts, strict CSP (`public/_headers` + `vercel.json`); GSAP + Lenis
(`src/scripts/motion.js`, also theme and back-to-top); MiniSearch retrieval; 12 bring-your-own-key AI providers
(`src/scripts/field/providers.js`, **Puter.js default**); Kokoro-82M voice in a worker + lamejs MP3; stateless CORS relay
(`server/relay-core.js` → `functions/api/relay.js` Cloudflare, `api/relay.js` Vercel, `server/node-relay.mjs` NAS; 24
tests); community board in preview (browser storage only); content validator before every build; `ChapterNav` dropdown +
arrows.

## AI coach language policy (fixed on all three, Nov 2026)

- Root cause: a prompt line "if the user writes in Chinese, answer in Traditional Chinese" made Puter.js's small default
  model answer **English** questions in Chinese; the Kokoro voices speak English only, so the podcast broke.
- Policy: answer in the language of the situation (English stays English); the six headings stay in English (the parser
  needs them); the **Podcast Script is always English**.
- Code (`src/scripts/field/prompt.js`): `languageReminder(situation)` is the last line of every user message;
  `languageProblem(md, situation)` → `'answer'` (English question, > 40 CJK chars) | `'podcast'` (script missing or not
  English) | `null`; `app.js` retries once with `LANGUAGE_RETRY[problem]`; `isEnglish` = fewer than 4 CJK/kana/hangul
  chars. The podcast is copied to the studio only if English; `tts.js` refuses non-English scripts.
- UI note on the AI page: "English voices only for now; Japanese, Cantonese and Mandarin are coming."
- Adding non-English voices: change `prompt.js` (podcast rule), `app.js` (copy-to-studio check) and `tts.js` together.
- Defaults: Puter.js, Kokoro `af_heart`, GPU on with automatic CPU fallback (`kokoro.worker.js`). Bump the settings key
  (`…settings.vN`) whenever defaults change, or saved settings override them.
- Test AI flows without keys: Playwright `addInitScript` sets `window.puter = { ai: { chat: async () => asyncIterator of
  { text } } }` and records the messages. Matrix that passed on all three: EN→EN; EN→ZH then EN (retry); ZH→ZH + EN
  podcast; ZH podcast then EN (retry); ZH podcast twice (not copied); EN→ZH twice (error note).

## Content and copyright

- Public-domain text may be rendered verbatim, always from data by ID; never type quotes into content.
- Copyrighted books: never use pirated copies; never reproduce text; write original summaries cited by IDs. Guards:
  long-quote check (hopbit), 8-word shingle fingerprints (fiverings).
- Trademarks: a book title is not a brand, repo, domain or project name (atomichabits → **hopbit**). Credit the source
  once (footer + About → Credits); if chapter titles contain the mark, write original ones.

## Deploy

- GitHub Pages: Settings → Pages → Source = **GitHub Actions** ("Deploy from a branch" runs Jekyll on raw Astro → 404).
  suntze and hopbit switched 2026-11-07; fiverings still showed branch-mode Jekyll runs then. A failed "pages build and
  deployment" run after a push means the source is still (or again) a branch; the Actions deploy still goes live.
- Prefer `actions/configure-pages` outputs for `BASE_PATH`/`SITE_URL`: a hardcoded `/atomichabits` broke every link when
  the repo was renamed. Every internal link goes through `u()`/`BASE`; `robots.txt` is generated, not static.
- Vercel relay = direct upload of `api/relay.js` + `server/relay-core.js` + `package.json` (`"type": "module"`) +
  `index.html`; framework none; Vercel Authentication off; env `ALLOWED_ORIGINS=https://tommykho.github.io`. Unchanged
  files can be referenced by SHA-1 (relay.js `1ec02708…`, relay-core.js `03fdde40…`).
- Never point `PUBLIC_RELAY_URL` at an unregistered Vercel name: anyone could claim it and receive visitors' API keys.
- Pushing to `main` deploys suntze and fiverings (and hopbit): only with the user's explicit go-ahead, each time, as a
  fast-forward of the designated branch. Repo renamed? Update `git remote` and attach the new name with `add_repo`.

## Environment gotchas (cloud sessions)

- The sandbox cannot reach `*.github.io`, `*.vercel.app` or `*.blob.core.windows.net`. Verify deploys through the GitHub
  Actions API (run/job status, logs) and Vercel MCP `web_fetch_vercel_url`.
- Astro 7 `astro preview` runs as a background daemon per project and prints its real port; stop it with
  `npx astro preview stop` (a stale daemon held 4321 and served another site). Check `ss -ltnp`.
- Container restarts stop background agents (re-launch them) and can revert `git remote` URLs (re-set before pushing).
- MCP servers (Vercel, GitHub) drop mid-call: check whether the action ran (e.g. `list_deployments`) before repeating.
- Network is allowlisted; source sites (archive.org, koten.net, …) must be added to the environment before fetching.

## UI patterns and bugs already fixed

- `data-count` is animated by `motion.js`; never reuse it for other numbers (library count showed NaN) → `data-tcount`.
- `ChapterNav` is the first block under the fixed header; the tactic library filters by `?ch=` and works without JS.
- Mobile flex eyebrows: wrap text in a `<span>`, give `::before` `flex: none`, or it splits into columns.
- Dark mode: check footer brand name, button shadows (`var(--hl)`) and accent contrast (amber `#a5640a` on light).
- Pluralise counts ("1 section").
- Before shipping: every page at 390 px (no horizontal overflow), dark mode, reduced motion, no page errors;
  Playwright screenshots desktop 1400 + mobile 390.

## Repeatable workflow (new sister site or big feature)

1. **/95p first**: ask focused questions until 95% confident; give recommended defaults; if the user answers only part,
   proceed on the stated defaults and say so.
2. **Fork, don't rebuild**: copy the sister repo (minus `.git`, `node_modules`, `dist`, `data/`), then adapt. Clone
   sisters read-only. After copying, check nothing was skipped (hopbit once missed `app.js`).
3. **Haiku agents only when the user asks**: `model: "haiku"`, background, one bounded packet each, strict file
   ownership; shared files (`content.js`, `Base.astro`, CSS, validator) stay with the integrator. Create stub data
   files before agents run the validator.
4. **Integrator review**: grep for stale names from the source site (prefixes, routes, book names, "Chapter N" in
   content), re-check agent claims, build, test, Playwright screenshots.

## Working with this user

- Concise, direct, tight bullets; actionable answers; no fluff.
- Verify with builds, tests and screenshots before saying "done".
- Ask before pushing to `main`, deleting infrastructure (Vercel projects, Pages) or removing working features. Terse
  instructions that would delete something: confirm first ("stop creating a GitHub page" did not mean remove Pages).
- Commit and push only to the designated branch. Commits end with the Co-Authored-By / Claude-Session lines from the
  session's attribution reminder. No PRs unless asked.
