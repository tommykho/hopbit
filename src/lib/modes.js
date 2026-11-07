// Habit Challenge exam lengths: hop, skip and jump.
export const MODES = [
  { id: 'hop', name: 'Hop', n: 6, blurb: 'Six quick habits. A fast check of your instincts.' },
  { id: 'skip', name: 'Skip', n: 12, blurb: 'Twelve habits across the chapters. The standard run.' },
  { id: 'jump', name: 'Jump', n: 20, blurb: 'Twenty habits from every part. The full challenge.' },
];
export const modeById = (id) => MODES.find((m) => m.id === id) || MODES[1];
