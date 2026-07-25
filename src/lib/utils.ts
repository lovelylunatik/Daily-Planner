export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function isCarriedOver(createdAt: string): boolean {
  return createdAt && createdAt !== todayKey();
}

export function formatDayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
