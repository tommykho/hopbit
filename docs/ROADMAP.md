# Roadmap & open decisions

## Shipped (v0.1, static MVP)
- [x] 20 chapters in 6 parts, 100 original key ideas with "Try" exercises, chapter map page
- [x] 60 tactics (3 per chapter, build and break), filters by chapter, domain and goal, tickable steps
- [x] Habit-journal design: light paper and night-journal themes, compounding-curve hero, animated habit tracker, GSAP + Lenis motion, reduced-motion support
- [x] Habit Challenge: 30-scenario skill test (Hop 6 · Skip 12 · Jump 20), cycling bank, ranks Kit → Moon Rabbit
- [x] Chapter dropdown + arrows on chapter pages, the tactic library (?ch=) and tactic pages; floating back-to-top
- [x] Ask the Coach: Puter.js default, coach ranks and your own ratings, 12 AI options (bring your own key, no key, on device, self-hosted), local retrieval, idea-citation verification, manual-only mode
- [x] 30-second podcast: Kokoro on device plus Gemini/OpenAI/ElevenLabs keys, chime intro, MP3 download
- [x] Community habit journals preview (stored in the browser), relay with tests
- [x] Deploy configs: Cloudflare Pages (Function relay), Vercel (relay project `hopbit-relay`), GitHub Pages workflow

## Decisions needed from the owner
1. **Repo, URLs and domain (done).** The repo was renamed from `atomichabits` to `tommykho/hopbit`; GitHub Pages is at `https://tommykho.github.io/hopbit/`, the Vercel relay is `hopbit-relay`, and the Cloudflare Pages project is `hopbit`. Brand is *Hopbit: Micro incremental habits*. Remaining choice: an optional custom domain.
2. **Hopbit palette and fonts (optional).** The site keeps the habit-journal theme; the Hopbit kit's navy/sunshine palette and Fredoka/Nunito fonts could replace it.
3. **Code licence** (MIT or AGPL, for example) before accepting contributions.
4. **Monetisation** (Cloudflare allows commercial use). Do not sell summaries as a substitute for the source book; link to it from the credits instead.

## Phase 2: community
- [ ] Cloudflare D1 schema and `/api/posts`, `/api/ratings`, `/api/flags` Pages Functions
- [ ] GitHub and Google sign-in, public alias only
- [ ] Flag threshold auto-hide, admin queue, Turnstile on posting

## Phase 3
- [ ] Printable habit tracker and habit scorecard (PDF)
- [ ] Full Traditional Chinese interface (繁體中文) and AI answers
- [ ] Daily 30-second episode page, tactic packs (new manager, new parent, small business)
- [ ] Shared "series" navigation with the Sun Tzu site

## Known limits
- Free model names change often (OpenRouter `:free`, Gemini aliases); defaults are editable, and OpenRouter has a "Load free models" button.
- Kokoro first run downloads about 80 MB (q8, WASM). WebLLM needs WebGPU (desktop Chrome or Edge).
