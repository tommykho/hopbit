// Validate content JSON: book structure, chapter ideas, tactic schema and idea-ID citations.
// Prints OK or a list of problems. `npm run build` refuses to build when this fails.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const j = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const errors = [], warns = [];
const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length;
const only = process.argv[2]; // optional: "chapters" | "tactics"
const files = (dir) => existsSync(join(root, dir)) ? readdirSync(join(root, dir)).filter((f) => /^ch\d\d\.json$/.test(f)).sort() : [];
// Guard against pasted book text: long double-quoted passages are not allowed anywhere in content.
const longQuote = (s) => /["“][^"”]{0,400}["”]/.test(s || '') && [...(s || '').matchAll(/["“]([^"”]+)["”]/g)].some((m) => words(m[1]) > 12);

const book = j('data/book.json');
const N = book.chapters.length;
const partOf = new Map(book.parts.flatMap((p) => p.chapters.map((n) => [n, p.id])));
for (let n = 1; n <= N; n++) {
  if (book.chapters[n - 1].n !== n) errors.push(`book.json: chapter ${n} out of order`);
  if (!partOf.has(n)) errors.push(`book.json: chapter ${n} has no part`);
}

const ids = new Set();
if (!only || ['chapters', 'tactics', 'challenge'].includes(only)) for (const f of files('data/chapters')) {
  const c = j(`data/chapters/${f}`); const at = `chapters/${f}`;
  if (`ch${String(c.n).padStart(2, '0')}.json` !== f) errors.push(`${at}: n mismatch`);
  for (const i of c.ideas || []) ids.add(i.id);
  if (only === 'tactics' || only === 'challenge') continue;
  if (!c.short || words(c.short) > 6) errors.push(`${at}: short missing or > 6 words`);
  if (!c.essence || c.essence.length > 90) errors.push(`${at}: essence missing or > 90 chars`);
  if (!c.modern_lens) errors.push(`${at}: modern_lens missing`);
  if (!Array.isArray(c.ideas) || c.ideas.length < 4 || c.ideas.length > 6) errors.push(`${at}: ideas must be 4–6`);
  (c.ideas || []).forEach((i, k) => {
    const ia = `${at}:${i.id}`;
    if (i.id !== `${c.n}.${k + 1}`) errors.push(`${ia}: id must be ${c.n}.${k + 1}`);
    if (!i.name || words(i.name) > 6) errors.push(`${ia}: name missing or > 6 words`);
    const w = words(i.text); if (w < 20 || w > 70) errors.push(`${ia}: text ${w} words (20–70)`);
    if (!i.try || words(i.try) > 30) errors.push(`${ia}: try missing or > 30 words`);
    if (longQuote(i.text)) errors.push(`${ia}: long quoted passage — write ideas in your own words`);
  });
  if (!(c.ideas || []).some((i) => i.id === c.key_idea)) errors.push(`${at}: key_idea ${c.key_idea} not in ideas`);
}
if (files('data/chapters').length !== N) errors.push(`chapters: expected ${N} files, found ${files('data/chapters').length}`);

const DOMAINS = ['work', 'career', 'business', 'health', 'family', 'self'];
const slugs = new Map();
let featured = 0;
const domainCount = Object.fromEntries(DOMAINS.map((d) => [d, 0]));
if (!only || only === 'tactics') for (const f of files('data/tactics')) {
  const arr = j(`data/tactics/${f}`);
  if (!Array.isArray(arr)) { errors.push(`tactics/${f}: not an array`); continue; }
  for (const t of arr) {
    const at = `tactics/${f}:${t.slug}`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug || '') || t.slug.length > 40) errors.push(`${at}: bad slug`);
    if (slugs.has(t.slug)) errors.push(`${at}: duplicate slug (also in ${slugs.get(t.slug)})`); else slugs.set(t.slug, f);
    if (!t.title || words(t.title) > 6) errors.push(`${at}: title missing or > 6 words`);
    if (!t.situation || t.situation.length > 140) errors.push(`${at}: situation missing or > 140 chars`);
    if (!DOMAINS.includes(t.domain)) errors.push(`${at}: domain "${t.domain}" invalid`); else domainCount[t.domain]++;
    if (!['build', 'break'].includes(t.mode)) errors.push(`${at}: mode must be build or break`);
    if (!Array.isArray(t.tags) || t.tags.length < 3 || t.tags.length > 6) errors.push(`${at}: tags must be 3–6`);
    if (`ch${String(t.chapter).padStart(2, '0')}.json` !== f) errors.push(`${at}: chapter ${t.chapter} does not match file`);
    if (!t.principle) errors.push(`${at}: principle missing`);
    if (!Array.isArray(t.ideas) || t.ideas.length < 1 || t.ideas.length > 3) errors.push(`${at}: ideas must be 1–3`);
    for (const v of t.ideas || []) if (!ids.has(v)) errors.push(`${at}: idea ${v} unknown`);
    if (!(t.ideas || []).some((v) => v.startsWith(`${t.chapter}.`))) errors.push(`${at}: needs an idea from its own chapter`);
    const sw = words(t.scene); if (sw < 55 || sw > 150) warns.push(`${at}: scene ${sw} words`);
    if (!Array.isArray(t.moves) || t.moves.length < 3 || t.moves.length > 5) errors.push(`${at}: moves must be 3–5`);
    for (const m of t.moves || []) { if (!m.title || !m.detail) errors.push(`${at}: move missing title/detail`); else if (words(m.detail) > 75) warns.push(`${at}: move detail ${words(m.detail)} words`); }
    if (!t.script || !t.script.label || !t.script.text) errors.push(`${at}: script missing`);
    if (!t.backfire) errors.push(`${at}: backfire missing`);
    if (!t.signals) errors.push(`${at}: signals missing`);
    if (!['minutes', 'hours', 'days'].includes(t.effort)) errors.push(`${at}: effort invalid`);
    if (![1, 2, 3].includes(t.difficulty)) errors.push(`${at}: difficulty invalid`);
    if (t.featured) featured++;
    for (const k of ['scene', 'backfire', 'signals']) if (longQuote(t[k])) errors.push(`${at}: long quoted passage in ${k}`);
  }
}
if (!only || only === 'tactics') {
  if (featured > 3) errors.push(`tactics: at most 3 featured (found ${featured})`);
  console.log(`tactics: ${slugs.size} · ` + DOMAINS.map((d) => `${d} ${domainCount[d]}`).join(' · '));
}

// ---------- Habit Challenge questions ----------
const tacticSlugs = new Set(files('data/tactics').flatMap((f) => j(`data/tactics/${f}`).map((t) => t.slug)));
const challengeFiles = existsSync(join(root, 'data/challenge')) ? readdirSync(join(root, 'data/challenge')).filter((f) => /^set\d+\.json$/.test(f)).sort() : [];
const qids = new Map();
let qCount = 0;
if (!only || only === 'challenge') for (const f of challengeFiles) {
  let arr;
  try { arr = j(`data/challenge/${f}`); } catch (e) { errors.push(`challenge/${f}: invalid JSON (${e.message})`); continue; }
  if (!Array.isArray(arr)) { errors.push(`challenge/${f}: not an array`); continue; }
  for (const q of arr) {
    qCount++;
    const at = `challenge/${f}:${q.id}`;
    if (!/^c-[a-z0-9]+(-[a-z0-9]+)*$/.test(q.id || '') || q.id.length > 40) errors.push(`${at}: bad id`);
    if (qids.has(q.id)) errors.push(`${at}: duplicate id (also in ${qids.get(q.id)})`); else qids.set(q.id, f);
    if (!Number.isInteger(q.chapter) || q.chapter < 1 || q.chapter > N) errors.push(`${at}: chapter invalid`);
    if (!DOMAINS.includes(q.domain)) errors.push(`${at}: domain "${q.domain}" invalid`);
    if (![1, 2, 3].includes(q.difficulty)) errors.push(`${at}: difficulty invalid`);
    if (!q.title || words(q.title) > 6) errors.push(`${at}: title missing or > 6 words`);
    const sw = words(q.scenario); if (sw < 40 || sw > 130) errors.push(`${at}: scenario ${sw} words (40–130)`);
    if (!Array.isArray(q.options) || q.options.length !== 5) { errors.push(`${at}: needs exactly 5 options`); continue; }
    const nCorrect = q.options.filter((o) => o.correct === true).length;
    if (nCorrect < 1 || nCorrect > 3) errors.push(`${at}: ${nCorrect} correct options (need 1–3)`);
    for (const o of q.options) {
      if (!o.text || typeof o.correct !== 'boolean' || !o.why) errors.push(`${at}: option missing text/correct/why`);
      else {
        if (words(o.text) > 26) warns.push(`${at}: option text ${words(o.text)} words`);
        if (words(o.why) > 45) warns.push(`${at}: why ${words(o.why)} words`);
        if (/all of the above|none of the above/i.test(o.text)) errors.push(`${at}: "all/none of the above" not allowed`);
      }
    }
    if (!Array.isArray(q.ideas) || q.ideas.length < 1 || q.ideas.length > 2) errors.push(`${at}: ideas must be 1–2`);
    for (const v of q.ideas || []) if (!ids.has(v)) errors.push(`${at}: idea ${v} unknown`);
    if (!(q.ideas || []).some((v) => v.startsWith(`${q.chapter}.`))) errors.push(`${at}: needs an idea from its own chapter`);
    if (q.tactic && !tacticSlugs.has(q.tactic)) errors.push(`${at}: tactic "${q.tactic}" unknown`);
    if (!q.lesson || q.lesson.length > 160) errors.push(`${at}: lesson missing or > 160 chars`);
    for (const k of ['scenario', 'lesson']) if (longQuote(q[k])) errors.push(`${at}: long quoted passage in ${k}`);
  }
}
if ((!only || only === 'challenge') && challengeFiles.length) console.log(`challenge: ${qCount} questions`);

for (const w of warns) console.log('warn  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(errors.length ? `${errors.length} error(s)` : 'OK');
process.exit(errors.length ? 1 : 0);
