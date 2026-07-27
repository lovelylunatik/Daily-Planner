import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { isCarriedOver, todayKey } from '../../lib/utils';

export default function RitualMini() {
  const { tasks, events, toggleTask, addTask } = usePlannerStore();
  const today = todayKey();

  const incomplete = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  // Today's scheduled events by type
  const todayEvents = events.filter((e) => e.date === today);
  const birthdays = todayEvents.filter((e) => e.type === 'birthday');
  const appointments = todayEvents.filter((e) => e.type === 'appointment');
  const eventReminders = todayEvents.filter((e) => e.type === 'reminder');
  const eventTodos = todayEvents.filter((e) => e.type === 'todo');

  // Standalone tasks by type (reminders pinned)
  const standaloneReminders = incomplete.filter((t) => t.type === 'reminder');
  const standaloneTodos = incomplete.filter((t) => t.type === 'todo');

  // Merge all reminders (events + standalone) — pinned to top
  const allReminders = [
    ...eventReminders.map((e) => ({ ...e, isEvent: true as const, source: 'event' as const })),
    ...standaloneReminders.map((t) => ({ ...t, isEvent: false as const, source: 'task' as const })),
  ];

  // Todos (events + standalone)
  const allTodos = [
    ...eventTodos.map((e) => ({ ...e, isEvent: true as const })),
    ...standaloneTodos.map((t) => ({ ...t, isEvent: false as const })),
  ];

  const [quickTitle, setQuickTitle] = useState('');

  const handleQuickAdd = () => {
    if (!quickTitle.trim()) return;
    addTask(quickTitle.trim(), 'todo');
    setQuickTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleQuickAdd();
    }
  };

  return (
    <div className="space-y-3">
      {/* ═══ BIRTHDAY BANNERS ═══ */}
      <AnimatePresence>
        {birthdays.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="birthday-banner"
          >
            {birthdays.map((b) => (
              <div key={b.id} className="flex items-center gap-2 py-2 px-3 rounded-sm">
                <span className="text-lg">🎂</span>
                <span className="font-serif text-sm italic" style={{ color: 'rgba(240,230,210,0.9)' }}>
                  {b.title}
                </span>
                {b.time && (
                  <span className="font-typewriter text-[9px] tracking-wider ml-auto" style={{ color: 'rgba(201,169,110,0.7)' }}>
                    {b.time}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ APPOINTMENTS ═══ */}
      <AnimatePresence>
        {appointments.length > 0 && (
          <motion.div layout className="space-y-1.5">
            {appointments.map((appt) => (
              <motion.div
                key={appt.id}
                layout
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="appointment-row"
              >
                <span className="text-[13px]">🕐</span>
                <span className="font-serif text-sm font-bold truncate flex-1" style={{ color: 'var(--text-1)' }}>
                  {appt.title}
                </span>
                {appt.time && (
                  <span className="font-typewriter text-[9px] tracking-wider tabular-nums px-2 py-0.5 rounded-sm" style={{ background: 'rgba(201,169,110,0.12)', color: 'var(--gold)' }}>
                    {appt.time}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ REMINDERS (pinned, checkbox) ═══ */}
      <AnimatePresence mode="popLayout">
        {allReminders.map((item) => {
          const carried = !item.isEvent && isCarriedOver((item as any).createdAt || '');
          const key = item.id;
          const title = item.title;
          const isEvent = item.isEvent;
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`ritual-strip reminder-row ${carried ? 'carry-glow' : ''}`}
            >
              <button
                onClick={() => {
                  if (!isEvent) toggleTask(item.id);
                }}
                className={`wax-seal-check ${isEvent ? 'event-pin cursor-default' : 'cursor-pointer hover:brightness-110'}`}
                disabled={isEvent}
                title={isEvent ? 'Scheduled reminder' : 'Toggle reminder'}
              >
                {!isEvent && <span className="opacity-0 group-hover:opacity-100 text-[8px]">✓</span>}
                {isEvent && <span className="text-[8px] text-[var(--gold)]">📌</span>}
              </button>
              <span className="truncate text-xs font-serif flex-1" style={{ color: 'var(--text-1)' }}>
                {title}
              </span>
              {carried && <span className="text-[10px] opacity-60 ml-auto">⟳</span>}
              {isEvent && (
                <span className="text-[8px] font-typewriter tracking-wider ml-2" style={{ color: 'var(--gold)', opacity: 0.6 }}>
                  EVENT
                </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* ═══ TODOS (regular checkbox) ═══ */}
      <AnimatePresence mode="popLayout">
        {allTodos.slice(0, 5).map((item) => {
          const carried = !item.isEvent && isCarriedOver((item as any).createdAt || '');
          const key = item.id;
          const title = item.title;
          const isEvent = item.isEvent;
          return (
            <motion.button
              key={key}
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => {
                if (!isEvent) toggleTask(item.id);
              }}
              className={`w-full text-left flex items-center gap-2 text-sm group py-2 px-3 ritual-strip ${carried ? 'carry-glow' : ''}`}
            >
              <span className="wax-seal-check">
                <span className="opacity-0 group-hover:opacity-100 text-[8px]">✓</span>
              </span>
              <span className="truncate text-xs font-serif flex-1">{title}</span>
              {carried && <span className="text-[10px] opacity-60 ml-auto">⟳</span>}
              {(item as any).subTasks?.length > 0 && (
                <span className="text-[9px] font-typewriter opacity-50 ml-auto">
                  {(item as any).subTasks.filter((s: any) => s.completed).length}/{(item as any).subTasks.length}
                </span>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>

      {allTodos.length > 5 && (
        <p className="text-[9px] font-typewriter opacity-50 tracking-wider uppercase text-center">
          +{allTodos.length - 5} more
        </p>
      )}

      {/* ═══ EMPTY STATE ═══ */}
      {birthdays.length === 0 && appointments.length === 0 && allReminders.length === 0 && allTodos.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4 italic text-xs font-serif opacity-50">
          {completed.length > 0
            ? `All ${completed.length} ritual${completed.length === 1 ? '' : 's'} complete`
            : 'The altar awaits your first ritual'}
        </motion.div>
      )}

      {/* ═══ QUICK-ADD LINE ═══ */}
      <div className="quick-add-row mt-3 pt-2" style={{ borderTop: '1px dashed rgba(201,169,110,0.12)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] opacity-40 font-typewriter">+</span>
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a ritual..."
            className="flex-1 bg-transparent border-none outline-none text-xs font-serif placeholder:text-[var(--text-3)]/30 placeholder:font-serif placeholder:italic"
            style={{ color: 'var(--text-1)' }}
          />
          <button
            type="button" onClick={(e) => { e.preventDefault(); handleQuickAdd(); }}
            disabled={!quickTitle.trim()}
            className="text-[10px] font-typewriter px-2 py-0.5 rounded-sm transition-all"
            style={{
              color: quickTitle.trim() ? 'var(--gold)' : 'rgba(201,169,110,0.25)',
              border: `1px solid ${quickTitle.trim() ? 'rgba(201,169,110,0.4)' : 'transparent'}`,
            }}
          >
            add
          </button>
        </div>
      </div>
    </div>
  );
}
