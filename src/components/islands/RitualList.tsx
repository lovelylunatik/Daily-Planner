import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore, type Task } from '../../stores/usePlannerStore';
import { getMoonPhaseForDate } from '../../lib/celestial';
import { todayKey, formatDayName, isCarriedOver } from '../../lib/utils';

export default function RitualList() {
  const [expandId, setExpandId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSub, setNewSub] = useState('');
  const [viewDate, setViewDate] = useState<string>(todayKey());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const d = params.get('date');
      if (d) setViewDate(d);
    }
  }, []);

  const { events, tasks, addTask, toggleTask, deleteTask, addSubTask, toggleSubTask } = usePlannerStore();

  const selectedDate = new Date(viewDate + 'T00:00:00');
  const moon = getMoonPhaseForDate(selectedDate);
  const dayName = formatDayName(viewDate);

  const scheduled = events.filter((e) => e.date === viewDate);
  const incomplete = tasks.filter((t) => !t.completed);
  const complete = tasks.filter((t) => t.completed);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addTask(newTitle.trim());
    setNewTitle('');
  };

  const handleAddSub = (parentId: string) => {
    if (!newSub.trim()) return;
    addSubTask(parentId, newSub.trim());
    setNewSub('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pt-2 pb-16">
      <div className="text-center mb-2">
        <h1 className="font-serif text-3xl md:text-4xl italic text-[var(--text-1)]">The Altar</h1>
        <p className="font-typewriter text-xs tracking-[0.3em] text-[var(--text-3)] mt-2">
          {dayName} &bull; {moon.emoji} {moon.name}
        </p>
      </div>

      {scheduled.length > 0 && (
        <section>
          <SectionTitle icon="☉">Scheduled</SectionTitle>
          <div className="space-y-2">
            {scheduled.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionTitle>Standalone Rituals</SectionTitle>

        <AnimatePresence mode="popLayout">
          {incomplete.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask}>
              {task.subTasks.length > 0 && (
                <div className="ml-7 mt-1 space-y-1">
                  {task.subTasks.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={(e) => { e.stopPropagation(); toggleSubTask(task.id, sub.id); }}
                      className="flex items-center gap-2 text-xs w-full text-left"
                    >
                      <span className={`w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0 ${sub.completed ? 'border-[var(--gold)] bg-[var(--gold)]/20' : 'border-[var(--text-3)]/30'}`}>
                        {sub.completed && <span className="text-[8px] text-[var(--gold)]">✓</span>}
                      </span>
                      <span className={sub.completed ? 'text-[var(--text-3)] line-through' : 'text-[var(--text-2)]'}>{sub.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {expandId === task.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="ml-7 mt-2 flex gap-2"
                >
                  <input
                    value={newSub}
                    onChange={(e) => setNewSub(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); handleAddSub(task.id); } }}
                    placeholder="Add sub-ritual"
                    className="flex-1 bg-[var(--bg-card)] border border-[var(--text-3)]/20 rounded px-2 py-1 text-[10px] font-serif placeholder:text-[var(--text-3)]/40"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddSub(task.id); }}
                    className="text-[9px] font-typewriter text-[var(--gold)] px-2 border border-[var(--gold)]/30 rounded"
                  >
                    + add
                  </button>
                </motion.div>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); setExpandId(expandId === task.id ? null : task.id); }}
                className="ml-7 mt-1 text-[9px] font-typewriter text-[var(--text-3)] hover:text-[var(--gold)] transition-colors"
              >
                {expandId === task.id ? '− collapse' : '+ sub-rituals'}
              </button>
            </TaskCard>
          ))}
        </AnimatePresence>

        {incomplete.length === 0 && (
          <div className="text-center py-10 text-[var(--text-3)] italic font-serif">
            <div className="text-2xl mb-2">✨</div>
            No rituals today — the stars are quiet.
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a standalone ritual..."
            className="flex-1 bg-[var(--bg-card)] border border-[var(--text-3)]/20 rounded-lg px-3 py-2 text-sm font-serif text-[var(--text-1)] placeholder:text-[var(--text-3)]/40 focus:outline-none focus:border-[var(--gold)]/50"
          />
          <button onClick={handleAdd} className="wax-seal px-4 py-2 rounded-full font-typewriter text-xs tracking-wider transition-transform hover:scale-105 active:scale-95">
            +
          </button>
        </div>
      </section>

      {complete.length > 0 && (
        <section className="border-t border-[var(--text-3)]/15 pt-6">
          <h2 className="font-typewriter text-[10px] tracking-[0.25em] text-[var(--text-3)] uppercase mb-3 line-through">Completed</h2>
          <AnimatePresence>
            {complete.map((task) => (
              <CompletedCard key={task.id} task={task} onToggle={() => toggleTask(task.id)} />
            ))}
          </AnimatePresence>
        </section>
      )}
    </div>
  );
}

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <h2 className="font-typewriter text-[10px] tracking-[0.25em] text-[var(--gold)] uppercase mb-3 flex items-center gap-2">
      {icon && <span className="w-5 h-5 rounded-full border border-[var(--gold)]/40 flex items-center justify-center text-[10px]">{icon}</span>}
      {children}
    </h2>
  );
}

function EventCard({ event }: { event: { id: string; title: string; time?: string; date: string } }) {
  return (
    <motion.div className="paper-lift rounded-lg p-3 bg-[var(--bg-card)]/60 flex items-center gap-3 border-l-2 border-[var(--rose)]">
      <div className="w-5 h-5 rounded-full border border-[var(--text-3)]/30 flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] text-[var(--text-3)]">☉</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[var(--text-1)] text-sm font-serif">{event.title}</p>
        {event.time && <p className="text-[var(--text-3)] text-[10px] font-typewriter">{event.time}</p>}
      </div>
    </motion.div>
  );
}

function TaskCard({ task, onToggle, onDelete, children }: {
  task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void; children?: React.ReactNode;
}) {
  const carried = isCarriedOver(task.createdAt);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={`
        paper-lift rounded-lg p-3 flex items-start gap-3 mb-2 flex-col
        bg-[var(--paper-cream)]/5
        ${carried ? 'shadow-[0_0_12px_rgba(201,169,110,0.12)] border border-[var(--gold)]/10' : 'border border-transparent'}
      `}
    >
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={() => onToggle(task.id)}
          className="relative w-5 h-5 rounded-full border-2 border-[var(--gold)] flex items-center justify-center flex-shrink-0 hover:bg-[var(--gold)]/10 transition-colors"
        >
          <span className="opacity-0 hover:opacity-100 text-[10px] text-[var(--gold)] absolute">✓</span>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-snug text-[var(--text-1)]">{task.title}</p>
          {task.subTasks.length > 0 && (
            <p className="text-[9px] font-typewriter text-[var(--text-3)] mt-0.5 tracking-wide">
              {task.subTasks.filter((s) => s.completed).length} OF {task.subTasks.length}
            </p>
          )}
        </div>
        {carried && <span className="text-[10px] text-[var(--gold)]/60" title="Carried over from a previous day">⟳</span>}
        <button onClick={() => onDelete(task.id)} className="text-[var(--text-3)]/40 hover:text-[var(--rose)] text-xs px-1 transition-colors">×</button>
      </div>
      {children}
    </motion.div>
  );
}

function CompletedCard({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 0.5, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="paper-lift rounded-lg p-3 flex items-center gap-3 mb-2 bg-[var(--bg-card)]/30 border border-transparent"
    >
      <button onClick={() => onToggle(task.id)} className="w-5 h-5 rounded-full border-2 border-[var(--gold)] bg-[var(--gold)]/20 flex items-center justify-center flex-shrink-0">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="text-[var(--gold)] text-xs">✓</motion.span>
      </button>
      <span className="text-sm text-[var(--text-3)] line-through flex-1">{task.title}</span>
      {task.subTasks.length > 0 && <span className="text-[9px] font-typewriter text-[var(--text-3)]/50">{task.subTasks.length}</span>}
    </motion.div>
  );
}
