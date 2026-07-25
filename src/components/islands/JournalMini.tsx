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
      <div className="text-center py-6">
        <div className="w-8 h-8 mx-auto mb-3 rounded-full border border-[var(--gold)]/20 animate-pulse" />
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
            className="block group"
          >
            {/* Scroll aesthetic top */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]/40" />
              <span className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)] uppercase">
                Today's Seal
              </span>
              <span className="flex-1 h-px bg-[var(--text-3)]/10" />
              <span className="text-xs">{moon.emoji}</span>
            </div>

            <div className="paper-lift rounded-lg p-3.5 bg-[var(--bg-card)]/40 border border-[var(--text-3)]/10 group-hover:border-[var(--gold)]/20 transition-colors">
              <p className="font-serif text-sm italic text-[var(--text-1)] leading-relaxed line-clamp-3">
                "{entry.content.slice(0, 140)}{entry.content.length > 140 ? '...' : ''}"
              </p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--text-3)]/10">
                <span className="text-[9px] font-typewriter text-[var(--text-3)]/60 tracking-wider">
                  {entry.content.trim().split(/\s+/).filter(Boolean).length} WORDS
                </span>
                <span className="text-[9px] font-typewriter text-[var(--gold)]/60 tracking-wider uppercase group-hover:text-[var(--gold)] transition-colors">
                  Open →
                </span>
              </div>
            </div>
          </motion.a>
        ) : (
          <motion.a
            key="no-entry"
            href="/journal"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="block text-center py-6 group"
          >
            <div className="relative mx-auto w-24 h-24 mb-3 opacity-40 group-hover:opacity-60 transition-opacity">
              {/* Decorative unwritten scroll */}
              <div className="absolute inset-0 border border-dashed border-[var(--gold)]/30 rounded-lg" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-px h-6 bg-[var(--gold)]/20" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-px h-6 bg-[var(--gold)]/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-2xl text-[var(--gold)]/30 italic">§</div>
            </div>
            <p className="font-typewriter text-[10px] text-[var(--text-3)] tracking-wider group-hover:text-[var(--gold)]/70 transition-colors uppercase">
              The page awaits your hand
            </p>
            <p className="text-[9px] font-typewriter text-[var(--text-3)]/50 mt-1 tracking-wider">
              {moon.emoji} {moon.name} • {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
