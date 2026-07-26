import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getMoonPhaseForDate, getZodiacSign, getDaysInMonth, getFirstDayOfMonth, formatDateKey, MONTH_NAMES, DAY_NAMES } from '../../lib/celestial';

export default function CalendarGrid() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState(formatDateKey(today));
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventRecurring, setNewEventRecurring] = useState<'' | 'daily' | 'weekly' | 'monthly'>('');

  const { events, addEvent, deleteEvent } = usePlannerStore();

  useEffect(() => { setMounted(true); }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const currentMonthKey = formatYearMonth(year, month);
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

  const openForm = (dateStr?: string) => {
    const target = dateStr || formatDateKey(new Date());
    setFormDate(target);
    setNewEventTitle('');
    setNewEventTime('');
    setNewEventRecurring('');
    setShowForm(true);
  };

  const handleSave = () => {
    if (!newEventTitle.trim()) return;
    addEvent({
      title: newEventTitle.trim(),
      date: formDate,
      time: newEventTime || undefined,
      recurring: newEventRecurring || undefined,
    });
    setShowForm(false);
    setNewEventTitle('');
    setNewEventTime('');
    setNewEventRecurring('');
  };

  const openRituals = (day: number) => {
    const dstr = formatDate(year, month, day);
    window.location.href = '/rituals?date=' + dstr;
  };

  const handleContextMenu = (e: React.MouseEvent, d: number) => {
    e.preventDefault();
    openForm(formatDate(year, month, d));
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
        onClick={() => showForm ? setShowForm(false) : openRituals(d)}
        onContextMenu={(e) => handleContextMenu(e, d)}
        className={`
          relative rounded-sm p-1.5 min-h-[88px] cursor-pointer select-none transition-all duration-200
          border border-[var(--text-3)]/10
          ${isToday ? 'ring-[1.5px] ring-[var(--gold)] bg-[var(--gold)]/5' : ''}
          ${isPast ? 'opacity-50 sepia-[0.3]' : 'hover:border-[var(--gold)]/30 hover:bg-[var(--bg-card)]/50'}
          paper-grain
        `}
      >
        <span className={`text-[10px] font-typewriter block mb-0.5 ${isToday ? 'text-[var(--gold)] font-bold' : 'text-[var(--text-2)]'}`}>{d}</span>
        <span className="text-[11px] block" title={moonPhase.name}>{moonPhase.emoji}</span>

        {dayEvents.length > 0 && (
          <div className="mt-1 space-y-1">
            {dayEvents.map((e) => (
              <div key={e.id} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[var(--rose)] flex-shrink-0" />
                {e.time && <span className="text-[8px] font-typewriter text-[var(--text-3)] tabular-nums">{e.time}</span>}
                <span className="text-[8px] font-serif italic text-[var(--text-2)] truncate leading-tight">{e.title}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  });

  const blanks = Array.from({ length: firstDay }, (_, i) => (
    <div key={`bl-${i}`} className="p-1.5 min-h-[88px]" />
  ));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => navigate(-1)} className="wax-seal px-3 py-1.5 rounded-full text-xs font-typewriter shrink-0">←</button>
        <div className="text-center min-w-0">
          <h2 className="font-serif text-2xl italic text-[var(--text-1)]">{MONTH_NAMES[month]} {year}</h2>
          <p className="font-typewriter text-[10px] tracking-[0.2em] text-[var(--gold)] uppercase mt-0.5">
            {zodiac.symbol} {zodiac.name} Season — {zodiac.element}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => navigate(1)} className="wax-seal px-3 py-1.5 rounded-full text-xs font-typewriter">→</button>
          <button onClick={() => openForm()} className="wax-seal w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" title="Add event">+</button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_NAMES.map((d) => (
          <span key={d} className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)] uppercase py-1">{d}</span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">{blanks}{days}</div>

      {/* Footer */}
      <div className="flex items-center justify-between font-typewriter text-[10px] text-[var(--text-3)] tracking-wider pt-2">
        <span>{moon.emoji} {moon.name}</span>
        <span>Right-click a day to add an event</span>
      </div>

      {/* Event Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 top-1/4 left-1/2 -translate-x-1/2 w-full max-w-sm"
            >
              <div className="paper-lift rounded-lg bg-[var(--bg-card)] border border-[var(--text-3)]/15 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-lg italic text-[var(--text-1)]">Add a Ritual</p>
                  <button onClick={() => setShowForm(false)} className="text-[var(--text-3)] hover:text-[var(--text-1)] text-lg leading-none">×</button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)] uppercase block mb-1">Name</label>
                    <input
                      autoFocus
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="What is the ritual?"
                      className="w-full bg-[var(--bg-paper)] border border-[var(--text-3)]/20 rounded px-3 py-2 text-sm font-serif placeholder:text-[var(--text-3)]/40 focus:outline-none focus:border-[var(--gold)]/40 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)] uppercase block mb-1">Date</label>
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full bg-[var(--bg-paper)] border border-[var(--text-3)]/20 rounded px-3 py-2 text-sm font-typewriter text-[var(--text-1)] focus:outline-none focus:border-[var(--gold)]/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)] uppercase block mb-1">Time</label>
                      <input
                        type="time"
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        className="w-full bg-[var(--bg-paper)] border border-[var(--text-3)]/20 rounded px-3 py-2 text-sm font-typewriter text-[var(--text-1)] focus:outline-none focus:border-[var(--gold)]/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)] uppercase block mb-1">Recurring</label>
                    <div className="flex items-center gap-2">
                      {(['daily', 'weekly', 'monthly'] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setNewEventRecurring(newEventRecurring === r ? '' : r)}
                          className={`
                            px-2.5 py-1 rounded-full text-[9px] font-typewriter capitalize tracking-wider transition-all
                            ${newEventRecurring === r
                              ? 'wax-seal'
                              : 'bg-[var(--bg-paper)] border border-[var(--text-3)]/15 text-[var(--text-3)] hover:border-[var(--gold)]/30'
                            }
                          `}
                        >
                          {r === 'daily' ? '↻ Daily' : r === 'weekly' ? '☉ Weekly' : '☽ Monthly'}
                        </button>
                      ))}
                      {newEventRecurring && (
                        <button onClick={() => setNewEventRecurring('')} className="text-[9px] text-[var(--text-3)]/50 hover:text-[var(--rose)] ml-1">✕</button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-full border border-[var(--text-3)]/20 font-typewriter text-[10px] text-[var(--text-3)] tracking-wider hover:bg-[var(--bg-card)] transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={!newEventTitle.trim()} className="flex-1 py-2 wax-seal rounded-full font-typewriter text-[10px] disabled:opacity-40 disabled:hover:scale-100">
                    Save Ritual
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatDate(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function formatYearMonth(y: number, m: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}