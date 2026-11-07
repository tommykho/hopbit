# Hopbit: Micro incremental habits

*Hop one small step a day.* Micro-habit ideas for work, business and home.

A static website that turns 20 chapters of habit ideas into practical habit tactics for work, career, business, health, family and self. It is a sister project of [Sun Tzu · Modern Field Manual](https://github.com/tommykho/suntze) and uses the same stack, features and deployment model. It includes:

- **Chapters, mapped**: the Fundamentals, the Four Laws (and their inversions) and Advanced Tactics. Every chapter has an original title and 5 numbered **key ideas** (100 in total), written in plain words for this project, each with a one-line "Try" exercise.
- **Tactic library**: 60 tactics (3 per chapter), filterable by chapter, domain and build/break. Each has a scene, idea citations, a step-by-step system with tickable steps, a ready-to-use script, a backfire check and signs that it is working.
- **Habit Challenge (skill test)**: Hop (6), Skip (12) or Jump (20) everyday habit dilemmas from a 30-scenario bank. Pick every helpful move (one to three of five); score = correct ÷ (correct + missed); your average earns a rank from Kit to Moon Rabbit. Each reveal explains every move and links the idea and tactic.
- **Ask the Coach (AI)**: describe a habit to start or stop and get your habit loop, a four-law system, a script and a backfire check. Each provider/model has an editorial coach rank (Puter.js default = Kit, Claude Opus = Moon Rabbit), and you can rate every plan. Every `[chapter.idea]` citation is checked against the dataset: exact phrases, paraphrases and invented IDs are labelled.
- **30-second podcast**: the plan becomes a spoken script, voiced on your device (Kokoro-82M) or with your own TTS key, with a soft chime intro, and downloaded as an MP3.
- **Community habit journals** (preview): post the habit you built or broke, rate others' entries, flag unhealthy ones. Phase 2 adds accounts and shared storage.
- **Brand**: the Hopbit V3 die-cut rabbit (`public/hopbit-diecut.svg`, generated from the Hopbit brand kit geometry) in the header and footer; favicon and touch icon from the Hopbit avatar.
- **Habit-journal design**: paper, ruled index cards, washi tape and handwriting, with light and dark ("night journal") themes, GSAP + Lenis scroll motion and reduced-motion support.

**Cost to the site owner: $0.** The site is static. AI and voice run on the visitor's device or on the visitor's own provider key. The only server code is a small stateless CORS relay.

## Credits, copyright and trademark

Hopbit is inspired by the ideas in *Atomic Habits* by James Clear (2018); chapter numbers follow that book. Hopbit is
independent and not affiliated with or endorsed by the author or publisher. The book is copyrighted and its title is the
author's mark, so this project:

- names the book **only** in the site footer credit and on About → Credits (and here); everywhere else the UI says "micro-habits";
- does **not** reproduce any text from the book: chapter titles, key ideas and tactics are original writing, cited by ID;
- tells the AI never to quote or name any book, and verifies citations only against Hopbit's own idea summaries.

Do not add book excerpts, scans or PDFs to this repository. See [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md).

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # validates content, then builds to dist/
npm test           # relay unit tests
```

Node 20+ is required.

## AI providers (bring your own key)

| Provider | Cost to visitor | Route |
|---|---|---|
| Puter.js | free, no key (Puter sign-in) | browser |
| WebLLM on-device | free, no key, about a 2 GB download | browser (WebGPU) |
| OpenRouter `:free` models | free key | browser |
| Google Gemini | free key | browser (relay fallback) |
| Groq · Mistral · Cerebras · GitHub Models | free keys | browser (relay fallback) |
| NVIDIA NIM | free key | relay (NVIDIA blocks browsers) |
| Anthropic Claude | paid key | browser (official SDK) |
| Meta Muse Spark | paid key (public preview) | relay |
| Custom OpenAI-compatible, e.g. Ollama on your NAS | free | browser |

Default coach: **Puter.js** (no key). Podcast voice: Kokoro-82M Heart on the device (default, free, GPU with automatic CPU fallback) · Gemini TTS · OpenAI TTS · ElevenLabs (visitor's key).

## Project layout

```
data/            book.json (parts + original chapter titles), chapters/ (ideas), tactics/, challenge/ (quiz bank), community-demo.json
scripts/         validate-content.mjs (schema, idea-ID and no-long-quote checks)
src/pages/       index, chapters/, chapters/[n], tactics/, tactics/[slug], challenge, coach, community, about, corpus.json, challenge.json
src/scripts/     motion.js (GSAP + Lenis, theme, back-to-top) · challenge.js · field/* (providers, retrieval, prompt, tts, worker) · community.js
src/lib/         content.js · ranks.js (Kit → Moon Rabbit) · modes.js (Hop/Skip/Jump) · url.js
server/          relay-core.js (portable) · node-relay.mjs (NAS / self-host)
functions/api/   relay.js (Cloudflare Pages Function)
api/             relay.js (Vercel Function)
docs/            ARCHITECTURE · DEPLOY · ROADMAP · CONTENT-GUIDE
```

## Deploy

Cloudflare Pages (primary, free, commercial use allowed) · Vercel (relay, optional full site) · GitHub Pages (test site).
Steps: [docs/DEPLOY.md](docs/DEPLOY.md).

## Licences

Code: add your preferred licence before accepting contributions. Original content (summaries, tactics) © the project owner.
Third-party credits are on the About page.
