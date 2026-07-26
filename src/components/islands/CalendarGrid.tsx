import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getMoonPhaseForDate, getZodiacSign, getDaysInMonth, getFirstDayOfMonth, formatDateKey, MONTH_NAMES, DAY_NAMES } from '../../lib/celestial';

/* ─── seeded helpers ─── */
function seeded(seed: number): number {
  const v = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return v - Math.floor(v);          // 0.0  – 1.0
}
function cardRotation(seed: number): number {
  return (seeded(seed) - 0.5) * 5;   // -2.5° … +2.5°
}
function cardZ(seed: number): number {
  return 1 + Math.floor(seeded(seed + 1) * 5);
}
function cardShadow(seed: number): string {
  const x = Math.floor((seeded(seed + 2) - 0.5) * 3);
  const y = 2 + Math.floor(seeded(seed + 3) * 4);
  const blur = 5 + Math.floor(seeded(seed + 4) * 5);
  return `${x}px ${y}px ${blur}px rgba(0,0,0,0.45), ${x + 1}px ${y + 2}px ${blur + 6}px rgba(0,0,0,0.2)`;
}

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

  const { events, addEvent } = usePlannerStore();

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

  const openForm = useCallback((dateStr?: string) => {
    setFormDate(dateStr || formatDateKey(new Date()));
    setNewEventTitle('');
    setNewEventTime('');
    setNewEventRecurring('');
    setShowForm(true);
  }, []);

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
    if (showForm) return;
    window.location.href = '/rituals?date=' + formatDate(year, month, day);
  };

  const handleContextMenu = (e: React.MouseEvent, d: number) => {
    e.preventDefault();
    openForm(formatDate(year, month, d));
  };

  return (
    <div className="max-w-5xl mx-auto pt-2 pb-16">
      {/* ═══ ALMANAC BOARD ═══ */}
      <div
        className="relative p-6 md:p-10 rounded-sm"
        style={{
          background: 'radial-gradient(ellipse at 20% 0%, rgba(22,33,62,0.6) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(176,112,120,0.08) 0%, transparent 50%), #0c1525',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4)',
          border: '1px solid rgba(240,230,210,0.04)',
        }}
      >
        {/* pressed-flower corner ornaments */}
        {[
          { t: 4, l: 4 }, { t: 4, r: 4 },
          { b: 4, l: 4 }, { b: 4, r: 4 },
        ].map((pos, i) => (
          <span
            key={i}
            className="absolute text-[var(--gold)]/20 text-xl pointer-events-none select-none"
            style={{
              ...(pos.t !== undefined ? { top: pos.t } : { bottom: pos.b }),
              ...(pos.l !== undefined ? { left: pos.l } : { right: pos.r }),
              fontFamily: 'serif',
            }}
          >
            ❦
          </span>
        ))}

        {/* header */}
        <div className="relative text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-3">
            <button onClick={() => navigate(-1)} className="wax-seal px-3 py-1.5 rounded-full text-xs font-typewriter transition-transform hover:scale-105 active:scale-95">←</button>
            <div className="min-w-0">
              <h1 className="font-serif text-3xl md:text-4xl italic text-[var(--text-1)]">
                {MONTH_NAMES[month]} <span className="text-[var(--gold)]">{year}</span>
              </h1>
              <p className="font-typewriter text-[10px] tracking-[0.25em] text-[var(--gold)]/70 uppercase mt-1.5">
                {zodiac.symbol} {zodiac.name} Season — {zodiac.element}
              </p>
            </div>
            <button onClick={() => navigate(1)} className="wax-seal px-3 py-1.5 rounded-full text-xs font-typewriter transition-transform hover:scale-105 active:scale-95">→</button>
            <button onClick={() => openForm()} className="wax-seal w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-transform hover:scale-110 active:scale-95" title="Add ritual">+</button>
          </div>
          <div className="flex items-center justify-center gap-3 opacity-40">
            <span className="w-16 h-px bg-[var(--gold)]" />
            <span className="text-[var(--gold)] text-sm">{moon.emoji}</span>
            <span className="w-16 h-px bg-[var(--gold)]" />
          </div>
        </div>

        {/* day-of-week headers */}
        <div className="grid grid-cols-7 gap-1.5 md:gap-2 mb-2">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center pb-1">
              <span className="font-typewriter text-[9px] tracking-[0.2em] text-[var(--gold)]/40 uppercase">{d}</span>
            </div>
          ))}
        </div>

        {/* ═══ DAY GRID ═══ */}
        <div className="grid grid-cols-7 gap-1.5 md:gap-2">
          {/* blanks */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={'bl-' + i} className="min-h-[92px]" />
          ))}

          {/* days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1;
            const seed = year * 10000 + (month + 1) * 100 + d;
            const date = new Date(year, month, d);
            const dk = formatDateKey(date);
            const moonPhase = getMoonPhaseForDate(date);
            const isToday = dk === todayKeyStr;
            const isPast = date < today && !isToday;
            const isFuture = date > today && !isToday;
            const dayEvents = monthEvents.filter((e) => e.date === dk);

            const rot = isToday ? 0 : cardRotation(seed);
            const z = isToday ? 20 : cardZ(seed);
            const shadow = cardShadow(seed);

            return (
              /* outer div handles rotation + z so Framer Motion can't clobber it */
              <div
                key={dk}
                className="relative"
                style={{
                  zIndex: z,
                  transform: `rotate(${rot}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <motion.div
                  initial={mounted ? { opacity: 0, y: 14, scale: 0.92 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.012, duration: 0.35, ease: 'easeOut' }}
                  onClick={() => openRituals(d)}
                  onContextMenu={(e) => handleContextMenu(e, d)}
                  className={`relative cursor-pointer select-none group min-h-[92px] p-2 flex flex-col ${
                    isToday ? 'bg-[#1a2847]' : isPast ? 'bg-[var(--bg-card)]/25' : 'bg-[var(--bg-card)]/50'
                  }`}
                  style={{
                    borderRadius: '3px 9px 2px 11px / 4px 3px 9px 4px',
                    boxShadow: isToday
                      ? '0 0 20px rgba(201,169,110,0.22), 0 5px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)'
                      : shadow + ', inset 0 1px 0 rgba(255,255,255,0.02)',
                    border: isToday
                      ? '1.5px solid rgba(201,169,110,0.4)'
                      : '1px solid rgba(240,230,210,0.06)',
                  }}
                >
                  {/* grain texture */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      opacity: isToday ? 0.07 : 0.05,
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',
                      backgroundSize: '128px 128px',
                      mixBlendMode: 'overlay',
                      borderRadius: 'inherit',
                    }}
                  />

                  {/* today's candle glow */}
                  {isToday && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(ellipse at 50% 35%, rgba(201,169,110,0.12) 0%, transparent 65%)',
                        animation: 'candle-flicker 4s ease-in-out infinite alternate',
                        borderRadius: 'inherit',
                      }}
                    />
                  )}

                  {/* date */}
                  <span
                    className={`
                      text-[10px] font-typewriter block mb-0.5 leading-none
                      ${isToday ? 'text-[var(--gold)] font-bold tracking-wider' : 'text-[var(--text-2)]/90'}
                    `}
                  >
                    {d}
                  </span>

                  {/* moon */}
                  <span
                    className={`text-[11px] block leading-none ${
                      isToday ? 'opacity-90' : isPast ? 'opacity-30' : 'opacity-80'
                    }`}
                    title={moonPhase.name}
                  >
                    {moonPhase.emoji}
                  </span>

                  {/* events */}
                  {dayEvents.length > 0 && (
                    <div className="mt-auto pt-1.5 space-y-0.5">
                      {dayEvents.map((e) => (
                        <div key={e.id} className="flex items-center gap-1 min-w-0">
                          <span className="w-1 h-1 rounded-full bg-[var(--rose)] flex-shrink-0" />
                          {e.time && (
                            <span className="text-[7px] font-typewriter text-[var(--text-3)]/60 tabular-nums leading-tight">{e.time}</span>
                          )}
                          <span className="text-[8px] font-serif italic text-[var(--text-2)]/70 truncate leading-tight">{e.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* future star watermark */}
                  {isFuture && dayEvents.length === 0 && (
                    <div className="absolute bottom-1.5 right-1.5 pointer-events-none text-[var(--gold)]/15 text-base">✦</div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* footer */}
        <div className="relative flex items-center justify-between font-typewriter text-[10px] text-[var(--text-3)]/30 tracking-wider mt-5 pt-3 border-t border-[var(--text-3)]/5">
          <span>{moon.emoji} {moon.name}</span>
          <span>Right-click to add a ritual</span>
        </div>
      </div>

      {/* ═══ FORM MODAL ═══ */}
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
              className="fixed z-50 top-1/4 left-1/2 -translate-x-1/2 w-full max-w-sm px-4"
            >
              <div className="paper-lift rounded-lg p-5 space-y-4 bg-[var(--bg-card)] border border-[var(--text-3)]/10">
                <div className="flex items-center justify-between">
                  <p className="font-serif text-lg italic text-[var(--text-1)]">Add a Ritual</p>
                  <button onClick={() => setShowForm(false)} className="text-[var(--text-3)] hover:text-[var(--text-1)] text-lg leading-none transition-colors">×</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)]/60 uppercase block mb-1">Name</label>
                    <input autoFocus value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} placeholder="What is the ritual?" className="w-full bg-[var(--bg-paper)] border border-[var(--text-3)]/20 rounded px-3 py-2 text-sm font-serif placeholder:text-[var(--text-3)]/30 focus:outline-none focus:border-[var(--gold)]/40 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)]/60 uppercase block mb-1">Date</label>
                      <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full bg-[var(--bg-paper)] border border-[var(--text-3)]/20 rounded px-3 py-2 text-xs font-typewriter text-[var(--text-1)]" />
                    </div>
                    <div>
                      <label className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)]/60 uppercase block mb-1">Time</label>
                      <input type="time" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} className="w-full bg-[var(--bg-paper)] border border-[var(--text-3)]/20 rounded px-3 py-2 text-xs font-typewriter text-[var(--text-1)]" />
                    </div>
                  </div>
                  <div>
                    <label className="font-typewriter text-[9px] tracking-wider text-[var(--text-3)]/60 uppercase block mb-1">Recurring</label>
                    <div className="flex items-center gap-2">
                      {(['daily', 'weekly', 'monthly'] as const).map((r) => (
                        <button key={r} onClick={() => setNewEventRecurring(newEventRecurring === r ? '' : r)} className={"px-2.5 py-1 rounded-full text-[9px] font-typewriter capitalize tracking-wider transition-all " + (newEventRecurring === r ? 'wax-seal' : 'bg-[var(--bg-paper)] border border-[var(--text-3)]/15 text-[var(--text-3)]/70 hover:border-[var(--gold)]/30')}>{r === 'daily' ? '↻ Daily' : r === 'weekly' ? '☉ Weekly' : '☽ Monthly'}</button>
                      ))}
                      {newEventRecurring && <button onClick={() => setNewEventRecurring('')} className="text-[9px] text-[var(--text-3)]/40 hover:text-[var(--rose)] ml-1">✕</button>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-full border border-[var(--text-3)]/20 font-typewriter text-[10px] text-[var(--text-3)]/70">Cancel</button>
                  <button onClick={handleSave} disabled={!newEventTitle.trim()} className="flex-1 py-2 wax-seal rounded-full font-typewriter text-[10px] disabled:opacity-40">Save Ritual</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatDate(y: number, m: number, d: number) {
  return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}
function formatYearMonth(y: number, m: number) {
  return y + '-' + String(m + 1).padStart(2, '0');
}