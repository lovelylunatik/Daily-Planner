const LUNAR_CYCLE = 29.53058867;
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime();

export function getMoonPhaseForDate(date: Date): { name: string; emoji: string; illumination: number } {
  const daysSinceNew = (date.getTime() - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
  let phase = (daysSinceNew % LUNAR_CYCLE) / LUNAR_CYCLE;
  if (phase < 0) phase += 1;
  const illumination = phase < 0.5 ? phase * 2 : (1 - phase) * 2;

  if (phase < 0.02 || phase > 0.98) return { name: 'New Moon', emoji: '🌑', illumination };
  if (phase < 0.24) return { name: 'Waxing Crescent', emoji: '🌒', illumination };
  if (phase < 0.26) return { name: 'First Quarter', emoji: '🌓', illumination };
  if (phase < 0.49) return { name: 'Waxing Gibbous', emoji: '🌔', illumination };
  if (phase < 0.51) return { name: 'Full Moon', emoji: '🌕', illumination };
  if (phase < 0.74) return { name: 'Waning Gibbous', emoji: '🌖', illumination };
  if (phase < 0.76) return { name: 'Last Quarter', emoji: '🌗', illumination };
  return { name: 'Waning Crescent', emoji: '🌘', illumination };
}

export const ZODIAC_SIGNS = [
  { name: 'Aries', start: [3, 21], end: [4, 19], symbol: '♈', element: 'Fire', tone: 'dusty-rose' },
  { name: 'Taurus', start: [4, 20], end: [5, 20], symbol: '♉', element: 'Earth', tone: 'sage' },
  { name: 'Gemini', start: [5, 21], end: [6, 20], symbol: '♊', element: 'Air', tone: 'dusty-lavender' },
  { name: 'Cancer', start: [6, 21], end: [7, 22], symbol: '♋', element: 'Water', tone: 'dusty-lavender' },
  { name: 'Leo', start: [7, 23], end: [8, 22], symbol: '♌', element: 'Fire', tone: 'antique-gold' },
  { name: 'Virgo', start: [8, 23], end: [9, 22], symbol: '♍', element: 'Earth', tone: 'sage' },
  { name: 'Libra', start: [9, 23], end: [10, 22], symbol: '♎', element: 'Air', tone: 'dusty-rose' },
  { name: 'Scorpio', start: [10, 23], end: [11, 21], symbol: '♏', element: 'Water', tone: 'navy' },
  { name: 'Sagittarius', start: [11, 22], end: [12, 21], symbol: '♐', element: 'Fire', tone: 'antique-gold' },
  { name: 'Capricorn', start: [12, 22], end: [1, 19], symbol: '♑', element: 'Earth', tone: 'parchment' },
  { name: 'Aquarius', start: [1, 20], end: [2, 18], symbol: '♒', element: 'Air', tone: 'dusty-lavender' },
  { name: 'Pisces', start: [2, 19], end: [3, 20], symbol: '♓', element: 'Water', tone: 'dusty-lavender' },
];

export function getZodiacSign(date: Date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  for (const sign of ZODIAC_SIGNS) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    if (sm === em) {
      if (m === sm && d >= sd && d <= ed) return sign;
    } else if (sm < em) {
      if ((m > sm || (m === sm && d >= sd)) && (m < em || (m === em && d <= ed))) return sign;
    } else {
      if ((m > sm || (m === sm && d >= sd)) || (m < em || (m === em && d <= ed))) return sign;
    }
  }
  return ZODIAC_SIGNS[0];
}

export function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
export function getFirstDayOfMonth(year: number, month: number) { return new Date(year, month, 1).getDay(); }
export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
export function formatDateKey(date: Date) { return date.toISOString().split('T')[0]; }
export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
