export interface MoodEntry {
  mood: string;
  note?: string;
  date: string;
}

export const MOODS = [
  { emoji: '🌙', name: 'serene', color: '#8fa8d8', element: 'water' },
  { emoji: '☁️', name: 'overcast', color: '#9a9aaa', element: 'air' },
  { emoji: '🌸', name: 'blossom', color: '#d4a5a5', element: 'earth' },
  { emoji: '⚡', name: 'storm', color: '#c9a96e', element: 'fire' },
  { emoji: '🔥', name: 'blaze', color: '#b87070', element: 'fire' },
  { emoji: '💫', name: 'starstruck', color: '#a895b6', element: 'air' },
] as const;

export type MoodKey = typeof MOODS[number]['name'];

export function getMoodByName(name: string) {
  return MOODS.find(m => m.name === name) || MOODS[0];
}
