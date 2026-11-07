// The Hopbit ladder. Used for two things:
//  1. AI coaches (Ask the Coach): an editorial estimate of model strength, Kit → Moon Rabbit.
//  2. Players (Habit Challenge): the rank earned from the final score.
export const RANKS = [
  { id: 'kit', mark: '1', en: 'Kit', min: 0, blurb: 'Just out of the burrow: quick, free and willing, fine for simple habits.' },
  { id: 'hopper', mark: '2', en: 'Hopper', min: 40, blurb: 'Steady on everyday habits, light on nuance.' },
  { id: 'sprinter', mark: '3', en: 'Sprinter', min: 55, blurb: 'Reliable systems and a good read of what gets in the way.' },
  { id: 'jackrabbit', mark: '4', en: 'Jackrabbit', min: 70, blurb: 'Strong judgment across work, health and home habits.' },
  { id: 'snowhare', mark: '5', en: 'Snow Hare', min: 85, blurb: 'Deep habit design: subtle, precise and kind.' },
  { id: 'moonrabbit', mark: '6', en: 'Moon Rabbit', min: 95, blurb: 'The legendary rabbit in the moon: the sharpest coaching available.' },
];
export const UNRANKED = { id: 'wild', mark: '?', en: 'Wild Rabbit', level: 0, blurb: 'A self-hosted or unknown model: rank not assessed.' };
export const rankById = (id) => RANKS.find((r) => r.id === id) || UNRANKED;
export const rankLevel = (r) => (r.id === 'wild' ? 0 : RANKS.indexOf(r) + 1);

/** Player rank from a 0–100 score. */
export const rankForScore = (pct) => [...RANKS].reverse().find((r) => pct >= r.min) || RANKS[0];

/** Editorial rank of an AI provider + model (ordered rules: first match wins). */
const MODEL_RULES = [
  [/opus|fable|mythos/i, 'moonrabbit'],
  [/sonnet|muse-spark|gemini-[\d.]+-pro|gemini-pro|gpt-5(?!-nano|-mini)|gpt-4\.1(?!-)|o3\b/i, 'snowhare'],
  [/haiku|deepseek-(r1|v3|chat)|qwen3-235|gpt-oss-120b|gemini-flash(?!-lite)|gemini-[\d.]+-flash(?!-lite)|nemotron-super|gpt-4\.1-mini|mistral-medium/i, 'jackrabbit'],
  [/70b|72b|llama-3\.3|qwen2\.5-72|gemma-3-27b|gpt-oss-20b|mistral-small|qwen-3-32b/i, 'sprinter'],
  [/flash-lite|8b|nemo|mini|nano|gemma|3b|1b|phi/i, 'hopper'],
];
export function coachRank(providerId, model = '') {
  if (providerId === 'puter' && !model) return rankById('kit'); // Puter's default model
  if (providerId === 'webllm') return rankById('kit'); // small on-device models
  for (const [re, id] of MODEL_RULES) if (re.test(model)) return rankById(id);
  if (providerId === 'custom') return UNRANKED;
  return rankById('hopper');
}

export const stars = (r) => {
  const lvl = rankLevel(r);
  return lvl ? '★'.repeat(lvl) + '☆'.repeat(6 - lvl) : '—';
};
