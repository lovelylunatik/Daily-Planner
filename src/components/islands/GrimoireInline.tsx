import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getMoonPhaseForDate, getZodiacSign } from '../../lib/celestial';
import { todayKey, formatDayName } from '../../lib/utils';

const PROMPTS = [
  'What did the moon whisper to you tonight?',
  'A secret the wind carried past your window...',
  'Trace the path of a single thought from dawn til now.',
  'If tonight were a tarot card, which would it be?',
  'What are you leaving unsaid?',
];

export default function GrimoireInline() {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { journalEntries, addJournalEntry, moods, oracleQuotes } = usePlannerStore();

  const today = todayKey();
  const entry = journalEntries[today];
  const moon = getMoonPhaseForDate(new Date());
  const zodiac = getZodiacSign(new Date());
  const mood = moods[today];
  const oracle = oracleQuotes[today];

  useEffect(() => {
    setMounted(true);
    if (entry) {
      setContent(entry.content);
      setShowPrompts(false);
    }
  }, [entry]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }, [content]);

  const handleSave = useCallback(() => {
    if (!content.trim()) return;
    addJournalEntry({ date: today, content: content.trim() });
    setSaved(true);
    setShowPrompts(false);
    setTimeout(() => setSaved(false), 2200);
  }, [content, today, addJournalEntry]);

  const usePrompt = (prompt: string) => {
    setContent(prompt + '\n\n');
    setShowPrompts(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  if (!mounted) {
    return (
      <div className="flex w-full h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-5 h-5 border border-[#c9a96e]/30 rounded-full animate-pulse" />
        </div>
        <div className="w-px bg-[#b4a082]/20" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-5 h-5 border border-[#c9a96e]/30 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      {/* ═══════ LEFT PAGE — Preview ═══════ */}
      <div className="flex-1 flex flex-col p-4 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-typewriter text-[8px] tracking-[0.25em] uppercase" style={{ color: 'rgba(90,74,58,0.45)' }}>
            {formatDayName(today)}
          </span>
          <span className="flex-1 h-px" style={{ background: 'rgba(90,74,58,0.12)' }} />
        </div>

        {/* Moon & Zodiac line */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">{moon.emoji}</span>
          <span className="font-typewriter text-[8px] tracking-wider" style={{ color: 'rgba(90,74,58,0.4)' }}>
            {moon.name}
          </span>
          <span className="text-[8px]" style={{ color: 'rgba(90,74,58,0.3)' }}>•</span>
          <span className="font-typewriter text-[8px] tracking-wider" style={{ color: 'rgba(90,74,58,0.4)' }}>
            {zodiac.symbol} {zodiac.name}
          </span>
        </div>

        {/* Entry preview or empty state */}
        {entry ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-hidden"
          >
            <p className="font-serif text-sm italic leading-relaxed" style={{ color: '#3a2e1f' }}>
              "{entry.content.slice(0, 200)}{entry.content.length > 200 ? '...' : ''}"
            </p>
            <div className="mt-3 pt-2 flex items-center justify-between" style={{ borderTop: '1px solid rgba(90,74,58,0.1)' }}>
              <span className="font-typewriter text-[7px] tracking-wider" style={{ color: 'rgba(90,74,58,0.35)' }}>
                {entry.content.trim().split(/\s+/).filter(Boolean).length} WORDS
              </span>
              <span className="font-typewriter text-[7px] tracking-wider" style={{ color: 'rgba(201,169,110,0.5)' }}>
                SEALED
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
            <div className="w-16 h-16 rounded-full border border-dashed flex items-center justify-center mb-3" style={{ borderColor: 'rgba(90,74,58,0.12)' }}>
              <span className="font-serif text-xl italic" style={{ color: 'rgba(90,74,58,0.18)' }}>§</span>
            </div>
            <p className="font-typewriter text-[9px] tracking-wider uppercase" style={{ color: 'rgba(90,74,58,0.35)' }}>
              The page awaits your hand
            </p>
            {mood && (
              <p className="font-typewriter text-[8px] tracking-wider mt-1" style={{ color: 'rgba(90,74,58,0.25)' }}>
                Mood: {mood.mood}
              </p>
            )}
          </div>
        )}

        {/* Oracle preview at bottom */}
        {oracle && (
          <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(90,74,58,0.08)' }}>
            <p className="font-typewriter text-[7px] tracking-wider uppercase mb-1" style={{ color: 'rgba(90,74,58,0.3)' }}>
              Daily Oracle
            </p>
            <p className="font-serif text-[11px] italic leading-relaxed line-clamp-2" style={{ color: 'rgba(58,46,31,0.65)' }}>
              "{oracle.quote}"
            </p>
          </div>
        )}
      </div>

      {/* Center spine divider */}
      <div className="w-px flex-shrink-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(90,74,58,0.15) 20%, rgba(90,74,58,0.15) 80%, transparent)' }} />

      {/* ═══════ RIGHT PAGE — Editor ═══════ */}
      <div className="flex-1 flex flex-col p-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-typewriter text-[8px] tracking-[0.25em] uppercase" style={{ color: 'rgba(90,74,58,0.45)' }}>
            Write
          </span>
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1"
              >
                <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px]"
                  style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e' }}>
                  ✓
                </span>
                <span className="font-typewriter text-[7px] tracking-wider" style={{ color: '#c9a96e' }}>SAVED</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Textarea */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => { setContent(e.target.value); setSaved(false); }}
            placeholder="Write what the stars whispered..."
            className="w-full h-full min-h-[120px] bg-transparent border-none p-0 font-serif text-sm italic leading-relaxed resize-none focus:outline-none placeholder:italic"
            style={{ color: '#3a2e1f' }}
            spellCheck={false}
          />
          {/* Corner marks */}
          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(90,74,58,0.15)' }} />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(90,74,58,0.15)' }} />
          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(90,74,58,0.15)' }} />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(90,74,58,0.15)' }} />
        </div>

        {/* Prompts */}
        <AnimatePresence>
          {showPrompts && !content.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-1.5 mt-2 mb-2"
            >
              <p className="font-typewriter text-[7px] tracking-[0.2em] uppercase text-center" style={{ color: 'rgba(90,74,58,0.3)' }}>
                Or begin with a prompt
              </p>
              <div className="space-y-1">
                {PROMPTS.slice(0, 3).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => usePrompt(prompt)}
                    className="w-full text-left p-1.5 rounded transition-all hover:opacity-80"
                    style={{ background: 'rgba(90,74,58,0.04)' }}
                  >
                    <span className="font-serif text-[10px] italic leading-snug" style={{ color: 'rgba(58,46,31,0.55)' }}>
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-2 mt-auto" style={{ borderTop: '1px solid rgba(90,74,58,0.1)' }}>
          <span className="font-typewriter text-[7px] tracking-wider" style={{ color: 'rgba(90,74,58,0.3)' }}>
            {content.trim().split(/\s+/).filter(Boolean).length} WORDS
          </span>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="px-4 py-1.5 rounded-full font-typewriter text-[9px] tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
            style={{
              background: content.trim() ? 'rgba(201,169,110,0.18)' : 'transparent',
              border: '1px solid rgba(201,169,110,0.35)',
              color: content.trim() ? '#c9a96e' : 'rgba(201,169,110,0.25)',
            }}
          >
            SEAL
          </button>
        </div>
      </div>
    </div>
  );
}
