
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getCardForDate } from '../../lib/oracle';
import { getMoonPhaseForDate } from '../../lib/celestial';
import { todayKey } from '../../lib/utils';

export default function OraclePage() {
  const [mounted, setMounted] = useState(false);
  const [dateStr, setDateStr] = useState(todayKey());
  const [revealed, setRevealed] = useState(false);
  const [shuffling, setShuffling] = useState(false);

  const { oracleQuotes, addOracleQuote } = usePlannerStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isToday = dateStr === todayKey();
  const stored = oracleQuotes[dateStr];
  const card = stored ? { quote: stored.quote, source: stored.source, card: '' } : getCardForDate(dateStr);

  const date = new Date(dateStr + 'T00:00:00');
  const moon = getMoonPhaseForDate(date);

  const handleReveal = () => {
    if (stored) {
      setRevealed(true);
      return;
    }
    setShuffling(true);
    setTimeout(() => {
      setShuffling(false);
      setRevealed(true);
      addOracleQuote(dateStr, card.quote, card.source);
    }, 1200);
  };

  const prevDay = () => {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    const next = d.toISOString().split('T')[0];
    setDateStr(next);
    setRevealed(!!oracleQuotes[next]);
    setShuffling(false);
  };

  const nextDay = () => {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    const next = d.toISOString().split('T')[0];
    setDateStr(next);
    setRevealed(!!oracleQuotes[next]);
    setShuffling(false);
  };

  if (!mounted) {
    return (
      <div className="text-center py-20">
        <motion.div className="w-16 h-16 mx-auto mb-6 border border-[var(--gold)]/30 rounded-full"
          animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-[var(--text-3)] italic font-serif">The cosmos shuffles the deck...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-2 pb-16 text-center">
      {/* Date nav */}
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

      {/* Card area */}
      <div className="relative mx-auto w-full max-w-md aspect-[3/4] bg-[var(--bg-card)]/60 border border-[var(--text-3)]/10 rounded-lg flex items-center justify-center" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          {!revealed && !shuffling ? (
            <motion.div
              key="back"
              initial={{ rotateY: -180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 180, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <button
                onClick={handleReveal}
                className="relative w-full h-full flex items-center justify-center group"
              >
                {/* Card back pattern */}
                <div className="absolute inset-2 border border-[var(--gold)]/10 rounded" />
                <div className="absolute inset-4 border border-[var(--gold)]/5 rounded" />
                <div className="text-[var(--gold)]/20 text-6xl group-hover:text-[var(--gold)]/30 transition-colors">✧</div>
                <div className="absolute bottom-8 w-full text-center">
                  <p className="font-typewriter text-[10px] tracking-[0.3em] text-[var(--text-3)]/40 uppercase group-hover:text-[var(--text-3)]/60 transition-colors">
                    {stored ? 'Already Pulled' : 'Pull a Card'}
                  </p>
                </div>
              </button>
            </motion.div>
          ) : shuffling ? (
            <motion.div
              key="shuffle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                className="text-5xl text-[var(--gold)]/30"
                animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                ✦
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="front"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -180, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
            >
              <div className="flex-1 flex items-center justify-center">
                <blockquote className="font-serif text-lg md:text-xl italic text-[var(--text-1)] leading-relaxed">
                  “{card.quote}”
                </blockquote>
              </div>
              <div className="pt-6 mt-6 border-t border-[var(--text-3)]/10 w-full">
                <p className="font-typewriter text-[10px] tracking-[0.25em] text-[var(--gold)] uppercase">
                  {card.source}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Re-pull button for today */}
      {revealed && isToday && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => { setRevealed(false); setShuffling(false); }}
          className="mt-6 text-[10px] font-typewriter tracking-wider text-[var(--text-3)]/40 hover:text-[var(--text-3)] uppercase transition-colors"
        >
          Return Card to Deck
        </motion.button>
      )}
    </div>
  );
}
