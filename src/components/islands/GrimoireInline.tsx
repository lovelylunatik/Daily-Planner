import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { todayKey } from '../../lib/utils';

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

  const { journalEntries, addJournalEntry } = usePlannerStore();

  const today = todayKey();
  const entry = journalEntries[today];

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
        <div className="w-px flex-shrink-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(90,74,58,0.15) 20%, rgba(90,74,58,0.15) 80%, transparent)' }} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-5 h-5 border border-[#c9a96e]/30 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full">
      {/* ═══════ LEFT PAGE — Encouragement ═══════ */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
        {/* Decorative top mark */}
        <div className="mb-4">
          <span className="font-serif text-3xl italic" style={{ color: 'rgba(58,46,31,0.12)' }}>✦</span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-lg italic mb-3" style={{ color: '#3a2e1f' }}>
          The Page Awaits
        </h2>

        {/* Encouragement text */}
        <p className="font-serif text-xs italic leading-relaxed max-w-[140px]" style={{ color: 'rgba(58,46,31,0.55)' }}>
          "There is magic in the unwritten — a spark waiting for your hand to give it form."
        </p>

        {/* Subtle separator */}
        <div className="w-8 h-px my-4" style={{ background: 'rgba(90,74,58,0.15)' }} />

        {/* Words of encouragement */}
        <p className="font-typewriter text-[8px] tracking-[0.2em] uppercase leading-relaxed" style={{ color: 'rgba(90,74,58,0.35)' }}>
          No wrong words.<br/>
          No empty pages.<br/>
          Only yours.
        </p>

        {/* Bottom decorative */}
        <div className="mt-auto pt-4">
          <span className="font-serif text-xl italic" style={{ color: 'rgba(58,46,31,0.08)' }}>§</span>
        </div>
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
