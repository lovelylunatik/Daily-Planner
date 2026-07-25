import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getMoonPhaseForDate, getZodiacSign } from '../../lib/celestial';
import { todayKey, formatDayName } from '../../lib/utils';

export default function JournalPage() {
  const [mounted, setMounted] = useState(false);
  const [dateStr, setDateStr] = useState(todayKey());
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { journalEntries, addJournalEntry } = usePlannerStore();

  useEffect(() => {
    setMounted(true);
    const existing = journalEntries[dateStr];
    setContent(existing?.content || '');
    setSaved(false);
  }, [dateStr, journalEntries]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }, [content]);

  const selectedDate = new Date(dateStr + 'T00:00:00');
  const moon = getMoonPhaseForDate(selectedDate);
  const zodiac = getZodiacSign(selectedDate);

  const handleSave = () => {
    if (!content.trim()) return;
    addJournalEntry({ date: dateStr, content: content.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const prevDay = () => {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setDateStr(d.toISOString().split('T')[0]);
  };

  const nextDay = () => {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setDateStr(d.toISOString().split('T')[0]);
  };

  const isToday = dateStr === todayKey();

  const pastEntries = Object.entries(journalEntries)
    .filter(([d]) => d !== dateStr)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 10);

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto pt-2 pb-16">
        <div className="text-center py-20 text-[var(--text-3)] italic font-serif">The grimoire opens...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-2 pb-16 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <button onClick={prevDay} className="wax-seal px-3 py-1 rounded-full text-xs font-typewriter">←</button>
          <h1 className="font-serif text-3xl md:text-4xl italic text-[var(--text-1)]">
            {isToday ? "Today's Entry" : formatDayName(dateStr)}
          </h1>
          <button onClick={nextDay} className="wax-seal px-3 py-1 rounded-full text-xs font-typewriter">→</button>
        </div>
        <p className="font-typewriter text-xs tracking-[0.3em] text-[var(--text-3)] mt-1">
          {moon.emoji} {moon.name} &bull; {zodiac.symbol} {zodiac.name}
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-[var(--paper-cream)]/5 rounded-lg pointer-events-none" />
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => { setContent(e.target.value); setSaved(false); }}
          placeholder="Write what the stars whispered..."
          className="w-full min-h-[280px] bg-[var(--bg-card)]/40 border border-[var(--text-3)]/15 rounded-lg p-5 font-serif text-[var(--text-1)] text-sm leading-[1.9] placeholder:text-[var(--text-3)]/30 placeholder:italic focus:outline-none focus:border-[var(--gold)]/30 focus:bg-[var(--bg-card)]/60 resize-none transition-colors"
        />
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[var(--gold)]/20 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[var(--gold)]/20 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[var(--gold)]/20 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[var(--gold)]/20 pointer-events-none" />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-typewriter text-[var(--text-3)] tracking-wider">
          {content.trim().split(/\s+/).filter(Boolean).length} WORDS
        </span>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-typewriter text-[var(--gold)] tracking-wider"
              >
                SAVED ✓
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="wax-seal px-5 py-2 rounded-full font-typewriter text-xs tracking-wider transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            SEAL
          </button>
        </div>
      </div>

      {pastEntries.length > 0 && (
        <div className="border-t border-[var(--text-3)]/10 pt-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-[10px] font-typewriter tracking-[0.25em] text-[var(--text-3)] uppercase hover:text-[var(--gold)] transition-colors"
          >
            <motion.span animate={{ rotate: showHistory ? 90 : 0 }} transition={{ duration: 0.2 }}>→</motion.span>
            Previous Entries ({pastEntries.length})
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 mt-4">
                  {pastEntries.map(([d, entry]) => {
                    const ed = new Date(d + 'T00:00:00');
                    const em = getMoonPhaseForDate(ed);
                    return (
                      <button
                        key={d}
                        onClick={() => setDateStr(d)}
                        className="w-full text-left paper-lift rounded-lg p-3 bg-[var(--bg-card)]/30 border border-[var(--text-3)]/10 hover:border-[var(--gold)]/20 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs">{em.emoji}</span>
                          <span className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)] uppercase">{formatDayName(d)}</span>
                        </div>
                        <p className="font-serif text-xs italic text-[var(--text-1)] leading-relaxed line-clamp-2">
                          "{entry.content.slice(0, 140)}{entry.content.length > 140 ? '...' : ''}"
                        </p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
