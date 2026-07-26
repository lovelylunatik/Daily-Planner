import { useState, useEffect } from 'react';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { todayKey } from '../../lib/utils';

export default function OracleMini() {
  const [mounted, setMounted] = useState(false);
  const { oracleQuotes } = usePlannerStore();

  useEffect(() => { setMounted(true); }, []);

  const today = todayKey();
  const stored = oracleQuotes[today];
  const card = stored ? { quote: stored.quote, source: stored.source } : null;

  if (!mounted) {
    return (
      <div className="h-20 flex items-center justify-center">
        <span className="w-6 h-6 border border-[var(--gold)]/60 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!card) {
    return (
      <a href="/oracle" className="block text-center py-4 group">
        <div className="text-3xl text-[var(--gold)]/40 group-hover:text-[var(--gold)]/60 transition-colors mb-2"
          style={{ animation: 'sway 4s ease-in-out infinite' }}>
          ✧
        </div>
        <p className="font-typewriter text-[9px] tracking-[0.3em] text-[var(--text-3)]/50 uppercase group-hover:text-[var(--text-3)]/80 transition-colors">
          Pull Today's Card
        </p>
      </a>
    );
  }

  return (
    <a href="/oracle" className="block group">
      <blockquote className="font-serif text-lg italic text-[var(--text-1)] leading-relaxed border-l-2 border-[var(--gold-dim)] pl-4">
        "{card.quote}"
      </blockquote>
      <p className="font-typewriter text-[10px] text-[var(--text-3)] mt-3 tracking-wide">
        — {card.source}
      </p>
    </a>
  );
}
