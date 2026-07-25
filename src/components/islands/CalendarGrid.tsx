import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getMoonPhaseForDate, getZodiacSign, getDaysInMonth, getFirstDayOfMonth, isSameDay, formatDateKey, MONTH_NAMES, DAY_NAMES } from '../../lib/celestial';

export default function CalendarGrid() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [mounted, setMounted] = useState(false);
  const [addMode, setAddMode] = useState<{ day: number; x: number; y: number } | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');

  const { events, addEvent, deleteEvent } = usePlannerStore();

  useEffect(() => { setMounted(true); }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const currentMonthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const moon = getMoonPhaseForDate(today);
  const zodiac = getZodiacSign(new Date(year, month, 15));

  const monthEvents = events.filter((e) => e.date.startsWith(currentMonthKey));
  const todayKeyStr = formatDateKey(today);

  const navigate = (delta: number) => {
    let nm = month + delta;
    let ny = year;
    if (nm > 11) { nm = 0; ny++; }
    if (nm < 0) { nm = 11; ny--; }
    setMonth(nm);
    setYear(ny);
  };

  const handleAdd = (day: number) => {
    if (!newEventTitle.trim()) { setAddMode(null); return; }
    const dstr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    addEvent({ title: newEventTitle.trim(), date: dstr });
    setNewEventTitle('');
    setAddMode(null);
  };

  const openRituals = (day: number) => {
    const dstr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    window.location.href = `/rituals?date=${dstr}`;
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const date = new Date(year, month, d);
    const dk = formatDateKey(date);
    const moonPhase = getMoonPhaseForDate(date);
    const isToday = dk === todayKeyStr;
    const isPast = date < today && !isToday;
    const dayEvents = monthEvents.filter((e) => e.date === dk);
    return (
      <motion.div
        key={dk}
        initial={mounted ? { opacity: 0, scale: 0.95 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.01, duration: 0.25 }}
        onClick={() => addMode ? setAddMode(null) : openRituals(d)}
        onContextMenu={(e) => { e.preventDefault(); setAddMode({ day: d, x: e.clientX, y: e.clientY }); }}
        className={`
          relative rounded-lg p-2 min-h-[72px] cursor-pointer select-none transition-all duration-200
          ${isToday ? 'ring-2 ring-[var(--gold)] bg-[var(--gold)]/5' : 'border border-[var(--text-3)]/10'}
          ${isPast ? 'opacity-50 sepia-[0.3]' : 'opacity-100'}
          hover:bg-[var(--bg-card)]
        `}
      >
        <span className={`text-[10px] font-typewriter block mb-1 ${isToday ? 'text-[var(--gold)] font-bold' : 'text-[var(--text-2)]'}`}>{d}</span>
        <span className="text-xs block" title={moonPhase.name}>{moonPhase.emoji}</span>
        {dayEvents.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">{dayEvents.map((e) => (
            <span key={e.id} className="w-1.5 h-1.5 rounded-full bg-[var(--rose)]" />
          ))}</div>
        )}
      </motion.div>
    );
  });

  const blanks = Array.from({ length: firstDay }, (_, i) => (
    <div key={`bl-${i}`} className="rounded-lg p-2 min-h-[72px]" />
  ));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="wax-seal px-3 py-1.5 rounded-full text-xs font-typewriter">←</button>
        <div className="text-center">
          <h2 className="font-serif text-2xl italic text-[var(--text-1)]">{MONTH_NAMES[month]} {year}</h2>
          <p className="font-typewriter text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase mt-0.5">
            {zodiac.symbol} {zodiac.name} Season — {zodiac.element}
          </p>
        </div>
        <button onClick={() => navigate(1)} className="wax-seal px-3 py-1.5 rounded-full text-xs font-typewriter">→</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_NAMES.map((d) => (
          <span key={d} className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)] uppercase">{d}</span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">{blanks}{days}</div>

      {/* Footer */}
      <div className="text-center font-typewriter text-[10px] text-[var(--text-3)] tracking-wider">
        {moon.emoji} {moon.name} &bull; Right-click a day to add an event
      </div>

      {/* Context menu popup */}
      <AnimatePresence>
        {addMode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setAddMode(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-50 bg-[var(--bg-card)] border border-[var(--text-3)]/20 shadow-paper-lg rounded-lg p-3 space-y-2 min-w-[200px]"
              style={{ left: addMode.x, top: addMode.y - 80 }}
            >
              <p className="font-typewriter text-[10px] text-[var(--text-2)] uppercase">Add Event</p>
              <input
                autoFocus
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd(addMode.day)}
                placeholder="Event title"
                className="w-full bg-[var(--bg-paper)] border border-[var(--text-3)]/20 rounded px-2 py-1.5 text-xs font-serif placeholder:text-[var(--text-3)]/40"
              />
              <button onClick={() => handleAdd(addMode.day)} className="wax-seal w-full px-3 py-1.5 rounded text-[10px]">Add</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
