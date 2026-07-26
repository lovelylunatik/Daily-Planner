import { useState, useEffect } from 'react';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getCardForDate } from '../../lib/oracle';
import { getMoonPhaseForDate } from '../../lib/celestial';
import { todayKey } from '../../lib/utils';

export default function OraclePage() {
  const [dateStr, setDateStr] = useState(todayKey());
  const { oracleQuotes } = usePlannerStore();

  const isToday = dateStr === todayKey();
  const stored = oracleQuotes[dateStr];
  const card = stored ? stored : getCardForDate(dateStr);

  const date = new Date(dateStr + 'T00:00:00');
  const moon = getMoonPhaseForDate(date);

  const prevDay = () => { const d = new Date(dateStr + 'T00:00:00'); d.setDate(d.getDate() - 1); setDateStr(d.toISOString().split('T')[0]); };
  const nextDay = () => { const d = new Date(dateStr + 'T00:00:00'); d.setDate(d.getDate() + 1); setDateStr(d.toISOString().split('T')[0]); };

  return (
    <div className="max-w-2xl mx-auto pt-2 pb-16 text-center">
      <div className="flex items-center justify-center gap-4 mb-8">
        <button onClick={prevDay} className="wax-seal px-3 py-1 rounded-full text-xs font-typewriter">←</button>
        <div>
          <h1 className="font-serif text-3xl md:text-4xl italic text-[var(--text-1)]">
            {isToday ? "Today's Oracle" : date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h1>
          <p className="font-typewriter text-xs tracking-[0.3em] text-[var(--text-3)] mt-1">
            {moon.emoji} {moon.name}
          </p>
        </div>
        <button onClick={nextDay} className="wax-seal px-3 py-1 rounded-full text-xs font-typewriter">→</button>
      </div>

      <div className="relative mx-auto w-full max-w-sm min-h-[360px] bg-[var(--bg-card)]/60 border border-[var(--text-3)]/10 rounded-lg p-8 flex flex-col items-center justify-center">
        <blockquote className="font-serif text-lg md:text-xl italic text-[var(--text-1)] leading-relaxed">
          "{card.quote}"
        </blockquote>
        <div className="pt-6 mt-6 border-t border-[var(--text-3)]/10 w-full">
          <p className="font-typewriter text-[10px] tracking-[0.25em] text-[var(--gold)] uppercase">
            {card.source}
          </p>
        </div>
      </div>
    </div>
  );
}
