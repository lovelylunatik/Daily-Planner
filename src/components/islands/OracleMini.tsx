
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getCardForDate } from '../../lib/oracle';
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
        <span className="w-6 h-6 border border-[var(--gold)]/20 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!card) {
    return (
      <a href="/oracle" className="block text-center py-4 group">
        <motion.div
          className="text-3xl text-[var(--gold)]/20 group-hover:text-[var(--gold)]/30 transition-colors mb-2"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✧
        </motion.div>
        <p className="font-typewriter text-[9px] tracking-[0.3em] text-[var(--text-3)]/40 uppercase group-hover:text-[var(--text-3)]/70 transition-colors">
          Pull Today's Card
        </p>
      </a>
    );
  }

  return (
    <a href="/oracle" className="block group">
      <blockquote className="font-serif text-lg italic text-[var(--text-1)] leading-relaxed border-l-2 border-[var(--gold-dim)] pl-4">
        “{card.quote}”
      </blockquote>
      <p className="font-typewriter text-[10px] text-[var(--text-3)] mt-3 tracking-wide">
        — {card.source}
      </p>
    </a>
  );
}
