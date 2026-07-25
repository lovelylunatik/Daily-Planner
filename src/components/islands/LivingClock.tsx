import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMoonPhaseForDate, getZodiacSign } from '../../lib/celestial';

export default function LivingClock() {
  const [mounted, setMounted] = useState(false);
  const [hStr, setHStr] = useState('--');
  const [mStr, setMStr] = useState('--');
  const [sStr, setSStr] = useState('--');
  const [ampm, setAmPm] = useState('--');

  const now = new Date();
  const moon = getMoonPhaseForDate(now);
  const zodiac = getZodiacSign(now);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const t = new Date();
      let h = t.getHours();
      const m = t.getMinutes();
      const s = t.getSeconds();
      setAmPm(h >= 12 ? 'PM' : 'AM');
      h = h % 12 || 12;
      setHStr(String(h).padStart(2, '0'));
      setMStr(String(m).padStart(2, '0'));
      setSStr(String(s).padStart(2, '0'));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return (
      <div className="text-center py-2">
        <div className="relative inline-block">
          <div className="font-typewriter text-2xl md:text-3xl text-[var(--gold)]/40 tracking-widest tabular-nums">
            --:--<span className="text-lg md:text-xl align-top">:--</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-3 text-[10px] font-typewriter text-[var(--text-3)]/40 tracking-wider">
          <span>{moon.emoji}</span>
          <span>{moon.name}</span>
          <span>•</span>
          <span>{zodiac.symbol}</span>
          <span>{zodiac.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-2">
      <div className="relative inline-block">
        <motion.div
          className="font-typewriter text-2xl md:text-3xl text-[var(--gold)] tracking-widest tabular-nums"
          animate={{ opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {hStr}
          <motion.span className="mx-0.5" animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}>:</motion.span>
          {mStr}
          <span className="text-lg md:text-xl align-top opacity-70">
            <motion.span className="mx-0.5" animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}>:</motion.span>
            {sStr}
          </span>
        </motion.div>

        <motion.div
          className="absolute -top-1 -right-7 md:-right-8 text-[10px] font-typewriter text-[var(--text-3)] bg-[var(--bg-card)] border border-[var(--text-3)]/10 rounded px-1.5 py-0.5 tabular-nums"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {ampm}
        </motion.div>
      </div>

      <motion.div
        className="flex items-center justify-center gap-3 mt-3 text-[10px] font-typewriter text-[var(--text-3)] tracking-wider"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          {moon.emoji}
        </motion.span>
        <span>{moon.name}</span>
        <span className="opacity-40">•</span>
        <span>{zodiac.symbol}</span>
        <span>{zodiac.name}</span>
      </motion.div>

      <div className="relative mx-auto mt-4 w-24 h-24 opacity-30 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => {
          const rot = i * 30;
          return (
            <div
              key={i}
              className="absolute w-0.5 h-1.5 bg-[var(--gold)] left-1/2 top-0 origin-bottom"
              style={{ transform: `rotate(${rot}deg) translateY(1px)`, transformOrigin: '0 48px' }}
            />
          );
        })}
        <motion.div
          className="absolute w-px bg-[var(--gold)] left-1/2 top-2 origin-bottom"
          style={{ height: '40px', marginLeft: '-0.5px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[var(--gold)] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
