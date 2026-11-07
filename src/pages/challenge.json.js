// Habit Challenge question bank, with idea summaries and tactic titles resolved at build time.
import { getIdea, chapterOf, tactics } from '../lib/content.js';

const sets = import.meta.glob('../../data/challenge/set*.json', { eager: true, import: 'default' });
const tacticTitle = new Map(tactics.map((t) => [t.slug, t.title]));

export function GET() {
  const questions = Object.values(sets)
    .flat()
    .map((q) => {
      const ch = chapterOf(q.chapter);
      return {
        id: q.id,
        chapter: q.chapter,
        chapterTitle: ch.short,
        part: ch.part.label,
        color: ch.part.color,
        domain: q.domain,
        difficulty: q.difficulty,
        title: q.title,
        scenario: q.scenario,
        options: q.options.map((o) => ({ text: o.text, correct: o.correct, why: o.why })),
        ideas: q.ideas.map((id) => { const i = getIdea(id); return { id, name: i.name, text: i.text }; }),
        tactic: q.tactic && tacticTitle.has(q.tactic) ? { slug: q.tactic, title: tacticTitle.get(q.tactic) } : null,
        lesson: q.lesson,
      };
    })
    .sort((a, b) => a.chapter - b.chapter);
  return new Response(JSON.stringify({ v: 1, count: questions.length, questions }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
