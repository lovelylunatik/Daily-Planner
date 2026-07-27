import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { todayKey } from '../../lib/utils';

// ═══ Hand-drawn sketch-style SVG mood icons ═══
const ink = '#3a2e1f';

const SketchDice = () => (
  <svg viewBox="0 0 52 52" width="52" height="52" fill="none" style={{filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.15))'}}>
    <rect x="8" y="14" width="16" height="16" rx="2.5"
      stroke="#5a4a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      fill="rgba(90,70,50,0.06)" transform="rotate(-8 16 22)"/>
    <circle cx="13" cy="19" r="1.2" fill="#5a4a3a" transform="rotate(-8 13 19)"/>
    <circle cx="19" cy="19" r="1.2" fill="#5a4a3a" transform="rotate(-8 19 19)"/>
    <circle cx="13" cy="25" r="1.2" fill="#5a4a3a" transform="rotate(-8 13 25)"/>
    <circle cx="19" cy="25" r="1.2" fill="#5a4a3a" transform="rotate(-8 19 25)"/>
    <rect x="26" y="18" width="16" height="16" rx="2.5"
      stroke="#5a4a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      fill="rgba(90,70,50,0.06)" transform="rotate(6 34 26)"/>
    <circle cx="31" cy="23" r="1.2" fill="#5a4a3a" transform="rotate(6 31 23)"/>
    <circle cx="37" cy="23" r="1.2" fill="#5a4a3a" transform="rotate(6 37 23)"/>
    <circle cx="31" cy="29" r="1.2" fill="#5a4a3a" transform="rotate(6 31 29)"/>
    <circle cx="37" cy="29" r="1.2" fill="#5a4a3a" transform="rotate(6 37 29)"/>
    <circle cx="34" cy="26" r="1.2" fill="#5a4a3a" transform="rotate(6 34 26)"/>
  </svg>
);

const SketchSun = () => (
  <svg viewBox="0 0 52 52" width="52" height="52" fill="none" style={{filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.15))'}}>
    <circle cx="26" cy="26" r="9" stroke="#b8963a" strokeWidth="1.8" strokeLinecap="round"
      fill="rgba(200,170,80,0.12)"/>
    <path d="M21.5 23 Q23 21.5 24.5 23" stroke="#5a4a3a" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <path d="M27.5 23 Q29 21.5 30.5 23" stroke="#5a4a3a" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <path d="M23 28 Q26 31 29 28" stroke="#5a4a3a" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <path d="M26 6 L26 12" stroke="#b8963a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M26 40 L26 46" stroke="#b8963a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 26 L12 26" stroke="#b8963a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M40 26 L46 26" stroke="#b8963a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11.8 11.8 L16 16" stroke="#b8963a" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M36 36 L40.2 40.2" stroke="#b8963a" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M40.2 11.8 L36 16" stroke="#b8963a" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M16 36 L11.8 40.2" stroke="#b8963a" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const SketchCryingFace = () => (
  <svg viewBox="0 0 52 52" width="52" height="52" fill="none" style={{filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.15))'}}>
    {/* Face circle */}
    <circle cx="26" cy="26" r="16" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round"
      fill="rgba(140,170,200,0.06)"/>
    {/* Sad left eye — downward arc */}
    <path d="M16.5 22 Q19.5 25 22.5 22" stroke="#5a4a3a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    {/* Sad right eye */}
    <path d="M29.5 22 Q32.5 25 35.5 22" stroke="#5a4a3a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    {/* Tears falling from eyes */}
    <path d="M17 24 Q16 30 17.5 34 Q18.5 32.5 18 28 Q17.8 25 17 24Z"
      stroke="#6a8aaa" strokeWidth="1" strokeLinecap="round" fill="rgba(120,160,200,0.18)"/>
    <path d="M35 24 Q36 30 34.5 34 Q33.5 32.5 34 28 Q34.2 25 35 24Z"
      stroke="#6a8aaa" strokeWidth="1" strokeLinecap="round" fill="rgba(120,160,200,0.18)"/>
    {/* Highlight in tears */}
    <ellipse cx="17.5" cy="30" rx="0.6" ry="1.5" fill="rgba(200,220,240,0.5)" transform="rotate(8 17.5 30)"/>
    <ellipse cx="34.5" cy="30" rx="0.6" ry="1.5" fill="rgba(200,220,240,0.5)" transform="rotate(-8 34.5 30)"/>
    {/* Downturned mouth */}
    <path d="M20 34 Q26 30 32 34" stroke="#5a4a3a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    {/* Little eyebrows */}
    <path d="M15 19 Q19 18 23 19" stroke="#5a4a3a" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
    <path d="M29 19 Q33 18 37 19" stroke="#5a4a3a" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
  </svg>
);

const SketchFire = () => (
  <svg viewBox="0 0 52 52" width="52" height="52" fill="none" style={{filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.15))'}}>
    <path d="M18 38 Q14 28 18 20 Q20 14 22 18 Q26 24 24 32 Q22 36 18 38Z"
      stroke="#a05040" strokeWidth="1.4" strokeLinecap="round" fill="rgba(180,100,60,0.10)"/>
    <path d="M24 40 Q18 28 24 16 Q26 10 28 14 Q34 22 30 34 Q28 38 24 40Z"
      stroke="#b06040" strokeWidth="1.5" strokeLinecap="round" fill="rgba(200,110,60,0.14)"/>
    <path d="M32 39 Q28 30 32 22 Q34 18 36 22 Q40 28 36 34 Q34 37 32 39Z"
      stroke="#a05040" strokeWidth="1.4" strokeLinecap="round" fill="rgba(180,100,60,0.10)"/>
    <path d="M25 36 Q22 30 26 22 Q28 18 30 22 Q32 28 28 34Z"
      fill="rgba(220,160,80,0.18)"/>
  </svg>
);

const SketchTrophy = () => (
  <svg viewBox="0 0 52 52" width="52" height="52" fill="none" style={{filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.15))'}}>
    <path d="M14 14 Q12 14 12 16 L12 22 Q12 30 18 34 Q22 36 26 36 Q30 36 34 34 Q40 30 40 22 L40 16 Q40 14 38 14Z"
      stroke="#8a7a3a" strokeWidth="1.6" strokeLinecap="round" fill="rgba(160,140,60,0.10)"/>
    <path d="M12 18 Q8 18 8 22 Q8 26 12 26" stroke="#8a7a3a" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M40 18 Q44 18 44 22 Q44 26 40 26" stroke="#8a7a3a" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <rect x="22" y="36" width="8" height="5" rx="1.5" stroke="#8a7a3a" strokeWidth="1.3" fill="rgba(160,140,60,0.08)"/>
    <ellipse cx="26" cy="44" rx="7" ry="2.5" stroke="#8a7a3a" strokeWidth="1.3" fill="rgba(160,140,60,0.08)"/>
    <text x="26" y="26" textAnchor="middle" fontSize="10" fill="#b8963a" style={{fontFamily:'serif'}}>✦</text>
  </svg>
);

const MOODS = [
  { key: 'lucky', label: 'Lucky', icon: SketchDice, color: '#6a8a5a', scent: 'clover & rain' },
  { key: 'happy', label: 'Happy', icon: SketchSun, color: '#c9a050', scent: 'honey & light' },
  { key: 'sad', label: 'Sad', icon: SketchCryingFace, color: '#7a8aaa', scent: 'petals & salt' },
  { key: 'angry', label: 'Angry', icon: SketchFire, color: '#b06040', scent: 'ember & ash' },
  { key: 'proud', label: 'Proud', icon: SketchTrophy, color: '#a08040', scent: 'gold & laurel' },
] as const;

export default function MoodMini() {
  const [mounted, setMounted] = useState(false);
  const [idx, setIdx] = useState(0);
  const { moods, addMood } = usePlannerStore();

  useEffect(() => { setMounted(true); }, []);

  const today = todayKey();
  const savedMood = moods[today]?.mood;

  useEffect(() => {
    if (savedMood) {
      const found = MOODS.findIndex(m => m.key === savedMood);
      if (found >= 0) setIdx(found);
    }
  }, [savedMood]);

  const current = MOODS[idx];
  const Icon = current.icon;

  const prev = () => setIdx(i => (i === 0 ? MOODS.length - 1 : i - 1));
  const next = () => setIdx(i => (i === MOODS.length - 1 ? 0 : i + 1));
  const select = () => addMood(today, current.key);

  if (!mounted) {
    return <div className="h-24 flex items-center justify-center"><span className="w-5 h-5 border border-[var(--gold)]/20 rounded-full animate-pulse" /></div>;
  }

  return (
    <div className="w-full" style={{ padding: '0.25rem 0.5rem' }}>
      <p className="text-center font-typewriter text-[8px] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(201,169,110,0.55)' }}>
        How does the ether find you?
      </p>

      <div className="flex items-center justify-center gap-2">
        <button onClick={prev} type="button" className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ border: '1px solid rgba(201,169,110,0.22)', color: 'rgba(201,169,110,0.45)' }} aria-label="Previous mood">
          <span className="text-xs">◀</span>
        </button>

        <div className="relative" style={{ width: 64, height: 64 }}>
          <AnimatePresence mode="wait">
            <motion.div key={current.key} initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotate: 8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center">
              <Icon />
            </motion.div>
          </AnimatePresence>
          {savedMood === current.key && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
              style={{ background: current.color, boxShadow: '0 0 5px ' + current.color }} />
          )}
        </div>

        <button onClick={next} type="button" className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ border: '1px solid rgba(201,169,110,0.22)', color: 'rgba(201,169,110,0.45)' }} aria-label="Next mood">
          <span className="text-xs">▶</span>
        </button>
      </div>

      <div className="text-center mt-1.5">
        <p className="font-serif text-sm italic" style={{ color: current.color }}>{current.label}</p>
        <p className="font-typewriter text-[7px] tracking-wider mt-0.5" style={{ color: 'rgba(201,169,110,0.40)' }}>
          {current.scent}
        </p>
      </div>

      <div className="flex justify-center mt-2">
        <button onClick={select} type="button" className="px-3 py-1 rounded-full text-[9px] font-typewriter tracking-wider uppercase transition-all hover:scale-105 active:scale-95"
          style={{
            background: savedMood === current.key ? current.color + '18' : 'rgba(201,169,110,0.06)',
            border: '1px solid ' + (savedMood === current.key ? current.color + '45' : 'rgba(201,169,110,0.22)'),
            color: savedMood === current.key ? current.color : 'rgba(201,169,110,0.55)',
          }}>
          {savedMood === current.key ? 'Recorded ✓' : 'Select'}
        </button>
      </div>
    </div>
  );
}
