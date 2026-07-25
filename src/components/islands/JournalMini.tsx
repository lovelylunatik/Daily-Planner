import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getMoonPhaseForDate } from '../../lib/celestial';
import { todayKey } from '../../lib/utils';

export default function JournalMini() {
  const [mounted, setMounted] = useState(false);
  const { journalEntries } = usePlannerStore();

  useEffect(() => { setMounted(true); }, []);

  const today = todayKey();
  const entry = journalEntries[today];
  const moon = getMoonPhaseForDate(new Date());

  if (!mounted) {
    return (
      <div className="text-center py-4">
        <div className="font-serif text-sm italic text-[var(--text-3)]/50">The parchment stirs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {entry ? (
          <motion.a
            key="has-entry"
            href="/journal"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="block paper-lift rounded-lg p-3 bg-[var(--bg-card)]/50 border border-[var(--text-3)]/10 hover:border-[var(--gold)]/20 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs">{moon.emoji}</span>
              <span className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)] uppercase">Today</span>
            </div>
            <p className="font-serif text-sm italic text-[var(--text-1)] leading-relaxed line-clamp-3">
              "{entry.content.slice(0, 120)}{entry.content.length > 120 ? '...' : ''}"
            </p>
            <p className="text-[9px] font-typewriter text-[var(--gold)]/60 mt-2 tracking-wider uppercase">
              Continue writing →
            </p>
          </motion.a>
        ) : (
          <motion.a
            key="no-entry"
            href="/journal"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="block text-center py-6"
          >
            <div className="h-20 rounded border border-dashed border-[var(--text-3)]/30 flex items-center justify-center mb-3 group hover:border-[var(--gold)]/30 transition-colors">
              <span className="font-typewriter text-[10px] text-[var(--text-3)] tracking-wider group-hover:text-[var(--gold)]/60 transition-colors">
                TAP TO WRITE
              </span>
            </div>
            <p className="text-[9px] font-typewriter text-[var(--text-3)] tracking-wider">
              {moon.emoji} {moon.name} • The stars whisper to those who listen
            </p>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
