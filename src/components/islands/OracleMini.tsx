import { useState, useEffect } from 'react';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getCardForDate } from '../../lib/oracle';
import { getMoonPhaseForDate } from '../../lib/celestial';
import { todayKey } from '../../lib/utils';

export default function OracleMini() {
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { oracleQuotes, addOracleQuote } = usePlannerStore();

  useEffect(() => { setMounted(true); }, []);

  const today = todayKey();
  const stored = oracleQuotes[today];
  const moon = getMoonPhaseForDate(new Date());

  const handleReveal = () => {
    if (!stored) {
      const card = getCardForDate(today);
      addOracleQuote(today, card.quote, card.source);
    }
    setRevealed(true);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealed(false);
  };

  if (!mounted) {
    return (
      <div className="h-20 flex items-center justify-center">
        <span className="w-6 h-6 border border-[var(--gold)]/60 rounded-full animate-pulse" />
      </div>
    );
  }

  const card = oracleQuotes[today] || getCardForDate(today);

  return (
    <div className="relative mx-auto w-full max-w-md" style={{ perspective: '800px' }}>
      <div
        className="relative w-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* === FRONT: Decorative card back === */}
        <div
          className="w-full min-h-[180px] flex flex-col items-center justify-center gap-3 cursor-pointer select-none paper-grain"
          style={{ backfaceVisibility: 'hidden' }}
          onClick={handleReveal}
        >
          <div className="text-3xl text-[var(--gold)]/30 star-slow">✦</div>
          <p className="font-typewriter text-[10px] tracking-[0.35em] text-[var(--gold)]/70 uppercase">
            Today&apos;s Oracle
          </p>
          <div className="w-6 h-px bg-[var(--gold)]/20" />
          <p className="font-typewriter text-[9px] text-[var(--text-3)]/50 tracking-wider uppercase">
            Tap to reveal
          </p>
          <p className="text-xs mt-1">{moon.emoji}</p>
        </div>

        {/* === BACK: Quote revealed === */}
        <div
          className="absolute inset-0 w-full min-h-[180px] flex flex-col items-center justify-center gap-3 p-5"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <blockquote className="font-serif text-base md:text-lg italic text-[var(--text-1)] leading-relaxed text-center">
            &ldquo;{card.quote}&rdquo;
          </blockquote>

          <div className="w-8 h-px bg-[var(--gold-dim)]" />

          <p className="font-typewriter text-[10px] text-[var(--gold)] tracking-[0.2em] uppercase">
            {card.source}
          </p>

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleReset}
              className="text-[9px] font-typewriter text-[var(--text-3)]/40 hover:text-[var(--text-3)] tracking-wider uppercase transition-colors"
            >
              Flip back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
