import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getMoonPhaseForDate, getZodiacSign, getDaysInMonth, getFirstDayOfMonth, formatDateKey, MONTH_NAMES, DAY_NAMES } from '../../lib/celestial';

function seeded(seed: number): number {
  const v = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return v - Math.floor(v);
}
function cardRotation(seed: number): number {
  return (seeded(seed) - 0.5) * 5;
}
function cardZ(seed: number): number {
  return 1 + Math.floor(seeded(seed + 1) * 5);
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
    let nm = month + delta; let ny = year;
    if (nm > 11) { nm = 0; ny++; }
    if (nm < 0) { nm = 11; ny--; }
    setMonth(nm); setYear(ny);
  };

  const openForm = useCallback((dateStr?: string) => {
    setFormDate(dateStr || formatDateKey(new Date()));
    setNewEventTitle(''); setNewEventTime(''); setNewEventRecurring('');
    setShowForm(true);
  }, []);

  const handleSave = () => {
    if (!newEventTitle.trim()) return;
    addEvent({ title: newEventTitle.trim(), date: formDate, time: newEventTime || undefined, recurring: newEventRecurring || undefined });
    setShowForm(false); setNewEventTitle(''); setNewEventTime(''); setNewEventRecurring('');
  };

  const openRituals = (day: number) => { if (showForm) return; window.location.href = '/rituals?date=' + formatDate(year, month, day); };
  const handleContextMenu = (e: React.MouseEvent, d: number) => { e.preventDefault(); openForm(formatDate(year, month, d)); };

  return (
    <div className="max-w-5xl mx-auto pt-2 pb-16">
      {/* ═══ ALMANAC BOARD — rich sage velvet ═══ */}
      <div className="relative p-6 md:p-10"
        style={{
          backgroundColor: '#1e2a26',
          backgroundImage: `
            radial-gradient(ellipse at 15% 10%, rgba(122,148,122,0.14) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 90%, rgba(201,169,110,0.08) 0%, transparent 50%),
            repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(240,230,210,0.018) 3px 4px),
            repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(240,230,210,0.018) 3px 4px)
          `,
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.35), 0 10px 40px rgba(0,0,0,0.4)',
          border: '1px solid rgba(201,169,110,0.12)',
        }}
      >
        {/* pressed flowers on board corners */}
        {/* gold top border */}
        <div style={{ position: 'absolute', top: 6, left: 20, right: 20, height: 2, background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.35) 15%, rgba(201,169,110,0.5) 50%, rgba(201,169,110,0.35) 85%, transparent 100%)', borderRadius: 1 }} />
        {/* gold bottom border */}
        <div style={{ position: 'absolute', bottom: 6, left: 20, right: 20, height: 2, background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.35) 15%, rgba(201,169,110,0.5) 50%, rgba(201,169,110,0.35) 85%, transparent 100%)', borderRadius: 1 }} />
        {[{t:8,l:8},{t:8,r:8},{b:8,l:8},{b:8,r:8}].map((pos,i) => (
          <span key={i} className="absolute text-[var(--gold)]/20 text-2xl pointer-events-none select-none" style={{ ...(pos.t!==undefined?{top:pos.t}:{bottom:pos.b}), ...(pos.l!==undefined?{left:pos.l}:{right:pos.r}), fontFamily:'serif' }}>❦</span>
        ))}

        {/* header */}
        <div className="relative text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-3">
            <button onClick={() => navigate(-1)} className="wax-seal px-3 py-1.5 rounded-full text-xs font-typewriter hover:scale-105 active:scale-95 transition-transform">←</button>
            <div className="min-w-0">
              <h1 className="font-serif text-3xl md:text-4xl italic text-[var(--text-1)]">{MONTH_NAMES[month]} <span className="text-[var(--gold)]">{year}</span></h1>
              <p className="font-typewriter text-[10px] tracking-[0.25em] text-[var(--gold)]/70 uppercase mt-1.5">{zodiac.symbol} {zodiac.name} Season — {zodiac.element}</p>
            </div>
            <button onClick={() => navigate(1)} className="wax-seal px-3 py-1.5 rounded-full text-xs font-typewriter hover:scale-105 active:scale-95 transition-transform">→</button>
            <button onClick={() => openForm()} className="wax-seal w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold hover:scale-110 active:scale-95 transition-transform" title="Add ritual">+</button>
          </div>
          <div className="flex items-center justify-center gap-3 opacity-40">
            <span className="w-16 h-px bg-[var(--gold)]" /><span className="text-[var(--gold)] text-sm">{moon.emoji}</span><span className="w-16 h-px bg-[var(--gold)]" />
          </div>
        </div>

        {/* day-of-week headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center pb-1"><span className="font-typewriter text-[9px] tracking-[0.2em] text-[var(--gold)]/40 uppercase">{d}</span></div>
          ))}
        </div>

        {/* ═══ DAY GRID — torn paper cards ═══ */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDay }, (_, i) => <div key={`bl-${i}`} className="min-h-[100px]" />)}

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
            const z = isToday ? 50 : cardZ(seed);

            /* Card colors */
            const cardBg = isToday ? '#f5efe3' : isPast ? '#c9bca8' : '#ddd0ba';
            const textColor = '#3a2e1f';

            return (
              <div key={dk} className="relative" style={{ zIndex: z, transform: `rotate(${rot}deg)`, transformOrigin: 'center center' }}>
                <motion.div
                  initial={mounted ? { opacity: 0, y: 16, scale: 0.9 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.012, duration: 0.35, ease: 'easeOut' }}
                  onClick={() => openRituals(d)}
                  onContextMenu={(e) => handleContextMenu(e, d)}
                  className="relative cursor-pointer select-none group min-h-[100px] p-2 flex flex-col"
                  style={{
                    background: cardBg,
                    color: textColor,
                    clipPath: `polygon(
                      0% ${3 + seeded(seed)*2}%, ${2 + seeded(seed+1)*3}% 0%, ${8 + seeded(seed+2)*4}% ${2 + seeded(seed+3)*3}%,
                      15% ${1 + seeded(seed+4)*2}%, 22% ${3 + seeded(seed+5)*3}%, 30% ${1 + seeded(seed+6)*2}%,
                      38% ${4 + seeded(seed+7)*2}%, 46% ${1 + seeded(seed+8)*2}%, 54% ${3 + seeded(seed+9)*3}%,
                      62% ${1 + seeded(seed+10)*2}%, 70% ${4 + seeded(seed+11)*2}%, 78% ${2 + seeded(seed+12)*3}%,
                      86% ${1 + seeded(seed+13)*2}%, 94% ${3 + seeded(seed+14)*3}%, 100% ${2 + seeded(seed+15)*2}%,
                      100% ${94 + seeded(seed+16)*4}%, ${96 + seeded(seed+17)*2}% 100%,
                      88% ${97 + seeded(seed+18)*2}%, 80% ${95 + seeded(seed+19)*3}%,
                      72% ${98 + seeded(seed+20)*2}%, 64% ${94 + seeded(seed+21)*3}%,
                      56% ${97 + seeded(seed+22)*2}%, 48% ${95 + seeded(seed+23)*3}%,
                      40% ${98 + seeded(seed+24)*2}%, 32% ${94 + seeded(seed+25)*3}%,
                      24% ${97 + seeded(seed+26)*2}%, 16% ${95 + seeded(seed+27)*3}%,
                      8% ${98 + seeded(seed+28)*2}%, 0% ${96 + seeded(seed+29)*3}%
                    )`,
                    boxShadow: isToday
                      ? '0 0 30px rgba(201,169,110,0.55), 0 8px 20px rgba(0,0,0,0.3), inset 0 -2px 0 rgba(0,0,0,0.08), inset 2px 2px 8px rgba(255,255,255,0.3)'
                      : '4px 6px 14px rgba(0,0,0,0.35), 2px 3px 6px rgba(0,0,0,0.2), inset 0 -1px 0 rgba(0,0,0,0.06), inset 1px 1px 4px rgba(255,255,255,0.2)',
                    filter: isToday ? 'drop-shadow(0 0 8px rgba(201,169,110,0.4))' : 'none',
                  }}
                >
                  {/* heavy paper grain overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.28,
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20256%20256%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cfilter%20id%3D%27n%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.85%27%20numOctaves%3D%274%27%20stitchTiles%3D%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url(%23n)%27%2F%3E%3C%2Fsvg%3E")',
                    backgroundSize: '80px 80px',
                    mixBlendMode: 'multiply',
                  }} />

                  {/* top-left light catch */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: '35%', height: '2px', background: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: '35%', width: '2px', background: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />

                  {/* TODAY: warm outer glow */}
                  {isToday && (
                    <div style={{
                      position: 'absolute', inset: '-8px', pointerEvents: 'none', zIndex: -1,
                      boxShadow: '0 0 24px rgba(201,169,110,0.6), 0 0 50px rgba(201,169,110,0.25), inset 0 0 18px rgba(201,169,110,0.15)',
                      animation: 'candle-flicker 2.5s ease-in-out infinite alternate',
                      borderRadius: '4px',
                    }} />
                  )}

                  {/* date */}
                  <span className="text-[11px] font-typewriter block mb-0.5 leading-none font-bold" style={{ color: textColor }}>{d}</span>

                  {/* moon */}
                  <span className="text-[13px] block leading-none" style={{ opacity: isPast ? 0.5 : 0.9 }}>{moonPhase.emoji}</span>

                  {/* events */}
                  {dayEvents.length > 0 && (
                    <div className="mt-auto pt-1.5 space-y-0.5">
                      {dayEvents.map((e) => (
                        <div key={e.id} className="flex items-center gap-1 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#9c4a5a' }} />
                          {e.time && <span className="text-[7px] font-typewriter tabular-nums leading-tight" style={{ color: 'rgba(58,46,31,0.5)' }}>{e.time}</span>}
                          <span className="text-[8px] font-serif italic truncate leading-tight" style={{ color: 'rgba(58,46,31,0.8)' }}>{e.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* future watermark */}
                  {isFuture && dayEvents.length === 0 && (
                    <div className="absolute bottom-2 right-2 pointer-events-none text-lg" style={{ color: 'rgba(58,46,31,0.1)' }}>☆</div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* footer */}
        <div className="relative flex items-center justify-between font-typewriter text-[10px] text-[var(--gold)]/30 tracking-wider mt-5 pt-3" style={{ borderTop: '1px solid rgba(201,169,110,0.08)' }}>
          <span>{moon.emoji} {moon.name}</span>
          <span>Right-click to add a ritual</span>
        </div>
      </div>

      {/* ═══ FORM MODAL ═══ */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.2 }} className="fixed z-50 top-1/4 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
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
                      {(['daily','weekly','monthly'] as const).map((r) => (
                        <button key={r} onClick={() => setNewEventRecurring(newEventRecurring===r?'':r)} className={"px-2.5 py-1 rounded-full text-[9px] font-typewriter capitalize tracking-wider transition-all "+(newEventRecurring===r?'wax-seal':'bg-[var(--bg-paper)] border border-[var(--text-3)]/15 text-[var(--text-3)]/70 hover:border-[var(--gold)]/30')}>{r==='daily'?'↻ Daily':r==='weekly'?'☉ Weekly':'☽ Monthly'}</button>
                      ))}
                      {newEventRecurring && <button onClick={()=>setNewEventRecurring('')} className="text-[9px] text-[var(--text-3)]/40 hover:text-[var(--rose)] ml-1">✕</button>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={()=>setShowForm(false)} className="flex-1 py-2 rounded-full border border-[var(--text-3)]/20 font-typewriter text-[10px] text-[var(--text-3)]/70">Cancel</button>
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

function formatDate(y: number, m: number, d: number) { return y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'); }
function formatYearMonth(y: number, m: number) { return y+'-'+String(m+1).padStart(2,'0'); }