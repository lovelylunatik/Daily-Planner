import { useMemo } from 'react';
import { usePlannerStore } from '../../stores/usePlannerStore';

export default function MoodConstellation() {
  const { moods } = usePlannerStore();
  const entries = useMemo(() => Object.values(moods).sort((a, b) => a.date.localeCompare(b.date)), [moods]);

  return (
    <div className="max-w-4xl mx-auto pt-2 pb-16 text-center">
      <h1 className="font-serif text-3xl md:text-4xl italic text-[var(--text-1)]">My Constellation</h1>
      <p className="font-typewriter text-xs tracking-[0.3em] text-[var(--text-3)] mt-2">
        {entries.length} STAR{entries.length === 1 ? '' : 'S'} RECORDED
      </p>
      <div className="mt-12 text-[var(--text-3)] italic font-serif">
        {entries.length === 0 ? 'No stars yet. Record your mood on the Hub to begin your constellation.' : 'Constellation visualization coming in next update.'}
      </div>
    </div>
  );
}
