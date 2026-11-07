# Architecture

```
            ┌──────────── Cloudflare Pages / Vercel / GitHub Pages (static, free) ────────────┐
 Visitor ──▶│  HTML/CSS/JS · /corpus.json (ideas + tactics) · Kokoro worker + WASM (lazy)     │
 browser    │  /api/relay  ← Pages/Vercel Function: stateless, allowlisted, never stores     │
            └────────────────────────────────────────────────────────────────────────────────┘
   │  key stays in browser storage (session by default)
   ├──▶ OpenRouter / Gemini / Groq / Mistral / Cerebras / GitHub Models   (direct; relay if CORS blocked)
   ├──▶ Anthropic (official SDK, direct browser access)                   (direct)
   ├──▶ NVIDIA NIM / Meta Muse ──▶ relay ──▶ provider                      (relay)
   ├──▶ Puter.js (no key) · WebLLM (on device) · Custom (e.g. NAS Ollama)
   └──▶ TTS: Kokoro-82M on device (default) · Gemini / OpenAI / ElevenLabs with the visitor's key → MP3 (lamejs)
```

GitHub Pages has no functions, so that build sets `PUBLIC_RELAY_URL` to the Vercel relay
(`https://hopbit-relay.vercel.app/api/relay`).

## Content model

| Sun Tzu project | This project |
|---|---|
| 383 public-domain verses (Giles + 原文) | 100 original **key ideas** (`data/chapters/chNN.json`, IDs `chapter.idea`) |
| Verse IDs `3.18` | Idea IDs `5.3` (same citation format) |
| 13 chapters | 20 chapters in 6 parts, original titles (`data/book.json`) |
| 52 tactics | 60 tactics, each with `mode: build | break` |

No book text is stored. `scripts/validate-content.mjs` rejects long quoted passages.

## Habit Challenge

`/challenge.json` is built from `data/challenge/set*.json` with idea summaries and tactic titles resolved at build
time. `src/scripts/challenge.js` picks a run (Hop 6 · Skip 12 · Jump 20), cycling unseen scenarios first and spreading
them across chapters; scores, best per run and the seen-cycle are kept in browser storage (`op.challenge.v1`). Ranks
come from `src/lib/ranks.js`, which also gives each AI provider/model an editorial coach rank on Ask the Coach.

## Ask the Coach pipeline

1. **Retrieve (local):** MiniSearch over 100 ideas and 60 tactics → top tactics, their ideas, keyword-matched ideas, plus one key idea per chapter (about 25–30 ideas).
2. **Prompt:** the system prompt sets the stance (tiny steps, no shaming), health and ethics limits, a strict six-section format (Read the Loop · Ideas That Apply · Your System · Script to Use · Backfire Check · Podcast Script), *cite only listed IDs*, and *never quote the book*. The habit text is wrapped as data, not instructions.
3. **Stream** the answer and render it with a whitelist markdown renderer (escaped HTML).
4. **Verify:** each `[c.i]` is checked against the dataset; each quoted phrase is checked for an exact match against its idea. The UI shows *Exact phrase*, *Paraphrased* or *Not in the manual*, with the full idea.
5. **Podcast:** the *Podcast Script* section fills the studio → TTS → a synthesized two-note chime intro and outro → MP3 Blob → download.

## Security notes

- CSP in `public/_headers` and `vercel.json`: no inline scripts (Astro emits external scripts only). Scripts may come only from self, Puter, esm.run (WebLLM) and jsDelivr.
- Relay: origin check, https-only allowlisted prefixes, no ports or credentials in URLs, path-traversal check, 100 KB body cap, forwarded-header allowlist, no redirects, no logging. 24 unit tests.
- Community preview: all user text is escaped on render. Emails, URLs and phone numbers are masked before saving.
- Browser storage keys are prefixed `op.` (theme, ticked steps, settings, keys, community preview).

## Phase 2: community backend (planned)

Same plan as the Sun Tzu project: Cloudflare D1 (`users`, `posts`, `ratings`, `flags`), GitHub/Google OAuth via a Pages Function, alias-only public identity, flag-to-hide moderation. `src/scripts/community.js` already isolates storage in `store`.
