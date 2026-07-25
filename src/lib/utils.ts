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



// ── Export Grimoire ──

export function downloadGrimoire(entries: Record<string, { date: string; content: string }>): void {
  const dates = Object.keys(entries).sort();
  if (dates.length === 0) return;

  const totalWords = Object.values(entries).reduce(
    (sum, e) => sum + e.content.trim().split(/\s+/).filter(Boolean).length, 0
  );

  const fmtDate = (d: string) => {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const first = fmtDate(dates[0]);
  const last = fmtDate(dates[dates.length - 1]);

  let txt = '';
  txt += '╔══════════════════════════════════════════════════════════════╗\n';
  txt += '║                                                              ║\n';
  txt += '║          T H E   G R I M O I R E                             ║\n';
  txt += '║                                                              ║\n';
  txt += '║     A journal of stars, seasons & whispered things           ║\n';
  txt += '║                                                              ║\n';
  txt += `║     ${first}`.padEnd(63, ' ') + '║\n';
  txt += `║     through ${last}`.padEnd(63, ' ') + '║\n';
  txt += '║                                                              ║\n';
  txt += '╚══════════════════════════════════════════════════════════════╝\n';
  txt += '\n\n';

  for (const date of dates) {
    const entry = entries[date];
    const d = new Date(date + 'T00:00:00');
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    const day = d.getDate();
    const year = d.getFullYear();

    txt += `═══ ${weekday}, ${month} ${day}, ${year} ═══\n\n`;
    txt += entry.content.trim();
    txt += '\n\n\n';
  }

  txt += '═══════════════════════════════════════════════════════════════\n';
  txt += `   ✦  ${dates.length} entr${dates.length === 1 ? 'y' : 'ies'} · ${totalWords.toLocaleString()} word${totalWords === 1 ? '' : 's'}  ✦\n`;
  txt += '═══════════════════════════════════════════════════════════════\n';

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `the-grimoire-${dates[dates.length - 1]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
