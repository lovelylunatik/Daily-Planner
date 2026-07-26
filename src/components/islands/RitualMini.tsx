import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { isCarriedOver } from '../../lib/utils';

export default function RitualMini() {
  const { tasks, toggleTask } = usePlannerStore();
  const incomplete = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {incomplete.slice(0, 5).map((task) => {
          const carried = isCarriedOver(task.createdAt);
          return (
            <motion.button
              key={task.id}
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => toggleTask(task.id)}
              className={`w-full text-left flex items-center gap-2 text-sm group py-2 px-3 ritual-strip ${carried ? 'carry-glow' : ''}`}
            >
              <span className="wax-seal-check">
                <span className="opacity-0 group-hover:opacity-100 text-[8px] text-[var(--gold)]">✓</span>
              </span>
              <span className="truncate text-[var(--text-1)] text-xs font-serif">{task.title}</span>
              {carried && <span className="text-[10px] text-[var(--gold)]/60 ml-auto">⟳</span>}
              {task.subTasks.length > 0 && (
                <span className="text-[9px] font-typewriter text-[var(--text-3)] ml-auto">
                  {task.subTasks.filter((s) => s.completed).length}/{task.subTasks.length}
                </span>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>

      {incomplete.length > 5 && (
        <p className="text-[9px] font-typewriter text-[var(--text-3)] tracking-wider uppercase">
          +{incomplete.length - 5} more
        </p>
      )}

      {incomplete.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4 text-[var(--text-3)] italic text-xs font-serif"
        >
          {completed.length > 0
            ? `All ${completed.length} ritual${completed.length === 1 ? '' : 's'} complete`
            : 'The altar awaits your first ritual'}
        </motion.div>
      )}
    </div>
  );
}

