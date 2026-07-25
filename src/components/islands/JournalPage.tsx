import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getMoonPhaseForDate, getZodiacSign } from '../../lib/celestial';
import { todayKey, formatDayName } from '../../lib/utils';

const PROMPTS = [
  'What did the moon whisper to you tonight?',
  'A secret the wind carried past your window...',
  'The stars arranged themselves differently. Why?',
  'Trace the path of a single thought from dawn til now.',
  'What ritual did you perform today, however small?',
  'If your shadow could speak, what would it confess?',
  'Describe the color of silence in this hour.',
  'A letter to the version of you who lived here a year ago.',
  'What scent carries the most memory for you?',
  'The garden teaches patience. What did you learn?',
  'If tonight were a tarot card, which would it be?',
  'What are you leaving unsaid?',
];

const STAMPS = [
  { icon: '☽', name: 'crescent' },
  { icon: '☾', name: 'moon' },
  { icon: '✧', name: 'star' },
  { icon: '✦', name: 'heavy star' },
  { icon: '🌙', name: 'luna' },
  { icon: '⭐', name: 'bright star' },
  { icon: '🔥', name: 'flame' },
  { icon: '🌿', name: 'herb' },
  { icon: '🕯️', name: 'candle' },
  { icon: '🔮', name: 'crystal' },
  { icon: '🦋', name: 'moth' },
  { icon: '🌸', name: 'blossom' },
];

export default function JournalPage() {
  const [mounted, setMounted] = useState(false);
  const [dateStr, setDateStr] = useState(todayKey());
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrompts, setShowPrompts] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { journalEntries, addJournalEntry } = usePlannerStore();

  useEffect(() => {
    setMounted(true);
    const existing = journalEntries[dateStr];
    setContent(existing?.content || '');
    setSaved(false);
    setShowPrompts(!existing?.content);
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
  const isToday = dateStr === todayKey();

  const handleSave = useCallback(() => {
    if (!content.trim()) return;
    addJournalEntry({ date: dateStr, content: content.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }, [content, dateStr, addJournalEntry]);

  const insertStamp = (stamp: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart || content.length;
    const end = ta.selectionEnd || content.length;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const insertion = before.length > 0 && !before.endsWith(' ') ? ' ' + stamp : stamp;
    const newText = before + insertion + after;
    setContent(newText);
    setTimeout(() => {
      ta.focus();
      const pos = start + insertion.length;
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  const usePrompt = (prompt: string) => {
    setContent(prompt + '\n\n');
    setShowPrompts(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
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

  const sealDate = journalEntries[dateStr]?.date
    ? new Date(journalEntries[dateStr].date + 'T12:00:00')
    : null;

  const allEntries = Object.entries(journalEntries)
    .filter(([d]) => d !== dateStr)
    .sort(([a], [b]) => b.localeCompare(a));

  const filteredEntries = searchTerm.trim()
    ? allEntries.filter(([, e]) =>
        e.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allEntries;

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto pt-2 pb-16">
        <div className="text-center py-20">
          <motion.div
            className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-[var(--gold)]/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <div className="text-[var(--text-3)] italic font-serif">The grimoire opens...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-2 pb-16 space-y-6">
      {/* Header */}
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

      {/* Stamp toolbar */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {STAMPS.map((s) => (
          <button
            key={s.name}
            onClick={() => insertStamp(s.icon)}
            onMouseEnter={() => setSelectedStamp(s.name)}
            onMouseLeave={() => setSelectedStamp(null)}
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-sm
              border transition-all duration-200
              ${selectedStamp === s.name
                ? 'border-[var(--gold)]/50 bg-[var(--gold)]/10 scale-110'
                : 'border-[var(--text-3)]/10 bg-[var(--bg-card)]/40 hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/5'
              }
            `}
            title={s.name}
          >
            {s.icon}
          </button>
        ))}
        {selectedStamp && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[9px] font-typewriter text-[var(--text-3)]/60 tracking-wider ml-2 capitalize"
          >
            {selectedStamp}
          </motion.span>
        )}
      </div>

      {/* Writing area */}
      <div className="relative">
        <div className="absolute inset-0 bg-[var(--paper-cream)]/5 rounded-lg pointer-events-none" />
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => { setContent(e.target.value); setSaved(false); setShowPrompts(false); }}
          placeholder="Write what the stars whispered..."
          className="w-full min-h-[280px] bg-[var(--bg-card)]/40 border border-[var(--text-3)]/15 rounded-lg p-5 font-serif text-[var(--text-1)] text-sm leading-[1.9] placeholder:text-[var(--text-3)]/30 placeholder:italic focus:outline-none focus:border-[var(--gold)]/30 focus:bg-[var(--bg-card)]/60 resize-none transition-colors"
        />
        {/* Corner marks */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[var(--gold)]/20 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[var(--gold)]/20 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[var(--gold)]/20 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[var(--gold)]/20 pointer-events-none" />

        {/* Watermark when empty */}
        {!content.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.06 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="font-serif text-8xl text-[var(--gold)] select-none">§</span>
          </motion.div>
        )}
      </div>

      {/* Prompt cards (when empty) */}
      <AnimatePresence>
        {showPrompts && !content.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="space-y-2"
          >
            <p className="text-[10px] font-typewriter text-[var(--text-3)]/60 tracking-[0.2em] uppercase text-center">
              Or begin with a prompt
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROMPTS.slice(0, 4).map((prompt, i) => (
                <motion.button
                  key={i}
                  onClick={() => usePrompt(prompt)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-left p-3 rounded-lg border border-[var(--text-3)]/10 bg-[var(--bg-card)]/30 hover:border-[var(--gold)]/20 hover:bg-[var(--gold)]/5 transition-all group"
                >
                  <span className="font-serif text-xs italic text-[var(--text-2)] group-hover:text-[var(--text-1)] transition-colors leading-relaxed">
                    {prompt}
                  </span>
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => setShowPrompts(false)}
              className="block mx-auto text-[9px] font-typewriter text-[var(--text-3)]/40 hover:text-[var(--text-3)] tracking-wider uppercase"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seal bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-typewriter text-[var(--text-3)] tracking-wider">
            {content.trim().split(/\s+/).filter(Boolean).length} WORDS
          </span>
          {sealDate && (
            <span className="text-[9px] font-typewriter text-[var(--gold)]/40 tracking-wider uppercase">
              Sealed {sealDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: 8, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex items-center gap-1.5"
              >
                <span className="w-5 h-5 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center">
                  <span className="text-[10px] text-[var(--gold)]">✓</span>
                </span>
                <span className="text-[10px] font-typewriter text-[var(--gold)] tracking-wider">SEALED</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="wax-seal px-6 py-2.5 rounded-full font-typewriter text-xs tracking-wider transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            SEAL
          </button>
        </div>
      </div>

      {/* Previous entries with search */}
      {allEntries.length > 0 && (
        <div className="border-t border-[var(--text-3)]/10 pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-[10px] font-typewriter tracking-[0.25em] text-[var(--text-3)] uppercase hover:text-[var(--gold)] transition-colors"
            >
              <motion.span animate={{ rotate: showHistory ? 90 : 0 }} transition={{ duration: 0.2 }}>→</motion.span>
              Archive ({allEntries.length})
            </button>
            <div className="flex-1 h-px bg-[var(--text-3)]/10" />
          </div>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden space-y-3"
              >
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search entries..."
                    className="w-full bg-[var(--bg-card)]/30 border border-[var(--text-3)]/15 rounded-lg px-3 py-2 pl-8 text-xs font-serif text-[var(--text-1)] placeholder:text-[var(--text-3)]/40 focus:outline-none focus:border-[var(--gold)]/30"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-3)]/40 text-xs">⌕</span>
                </div>

                {filteredEntries.length === 0 && searchTerm && (
                  <p className="text-center text-[var(--text-3)]/40 italic text-xs font-serif py-4">
                    No entries match your search
                  </p>
                )}

                <div className="space-y-2">
                  {filteredEntries.slice(0, 12).map(([d, entry]) => {
                    const ed = new Date(d + 'T00:00:00');
                    const em = getMoonPhaseForDate(ed);
                    const ez = getZodiacSign(ed);
                    return (
                      <button
                        key={d}
                        onClick={() => setDateStr(d)}
                        className="w-full text-left paper-lift rounded-lg p-3 bg-[var(--bg-card)]/30 border border-[var(--text-3)]/10 hover:border-[var(--gold)]/20 transition-colors group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs">{em.emoji}</span>
                          <span className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)] uppercase">{formatDayName(d)}</span>
                          <span className="flex-1 h-px bg-[var(--text-3)]/10" />
                          <span className="text-[9px] font-typewriter text-[var(--text-3)]/50 tracking-wider">
                            {entry.content.trim().split(/\s+/).filter(Boolean).length}w
                          </span>
                        </div>
                        <p className="font-serif text-xs italic text-[var(--text-1)] leading-relaxed line-clamp-2">
                          "{entry.content.slice(0, 140)}{entry.content.length > 140 ? '...' : ''}"
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[8px] font-typewriter text-[var(--text-3)]/40 tracking-wider uppercase">
                          <span>{ez.symbol}</span>
                          <span>{ez.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {filteredEntries.length > 12 && (
                  <p className="text-center text-[9px] font-typewriter text-[var(--text-3)]/40 tracking-wider uppercase">
                    +{filteredEntries.length - 12} more entries
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
