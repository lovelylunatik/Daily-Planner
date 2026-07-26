import { useState, useEffect } from 'react';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { MOODS, getMoodByName } from '../../lib/mood';
import { getMoonPhaseForDate } from '../../lib/celestial';
import { todayKey } from '../../lib/utils';

export default function MoodMini() {
  const [mounted, setMounted] = useState(false);
  const { moods, addMood } = usePlannerStore();

  useEffect(() => { setMounted(true); }, []);

  const today = todayKey();
  const todayMood = moods[today];
  const moon = getMoonPhaseForDate(new Date());

  const handleMoodClick = (name: string) => {
    addMood(today, name);
  };

  if (!mounted) {
    return (
      <div className="h-16 flex items-center justify-center">
        <span className="w-6 h-6 border border-[var(--gold)]/20 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {MOODS.map(m => {
          const active = todayMood?.mood === m.name;
          return (
            <button
              key={m.name}
              onClick={() => handleMoodClick(m.name)}
              className={
                "relative w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all duration-200 cursor-pointer " +
                (active
                  ? "ring-2 ring-[var(--gold)] bg-[var(--gold)]/10 scale-110"
                  : "opacity-40 hover:opacity-80 hover:scale-105")
              }
              title={m.name}
            >
              {m.emoji}
              {active && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--gold)]" />
              )}
            </button>
          );
        })}
      </div>

      {todayMood ? (
        <div className="text-center">
          <p className="font-serif text-sm italic text-[var(--text-2)] capitalize">{getMoodByName(todayMood.mood).name}</p>
          <p className="font-typewriter text-[9px] text-[var(--text-3)]/60 tracking-wider mt-1">{moon.emoji} {moon.name} &bull; Recorded</p>
          <a href="/mood" className="inline-block mt-2 text-[9px] font-typewriter text-[var(--gold)]/50 hover:text-[var(--gold)] tracking-wider uppercase transition-colors">View constellation →</a>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-typewriter text-[10px] text-[var(--text-3)]/40 tracking-wider uppercase">{moon.emoji} {moon.name}</p>
          <p className="text-[9px] font-typewriter text-[var(--text-3)]/30 mt-1 tracking-wider">Tap a star to record your mood</p>
        </div>
      )}
    </div>
  );
}
