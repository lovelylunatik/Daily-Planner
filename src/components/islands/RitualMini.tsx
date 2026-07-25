import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '../../stores/usePlannerStore';

export default function RitualMini() {
  const { tasks, toggleTask } = usePlannerStore();
  const incomplete = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {incomplete.slice(0, 5).map((task) => (
          <motion.button
            key={task.id}
            layout
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => toggleTask(task.id)}
            className="w-full text-left flex items-center gap-2 text-sm group py-1"
          >
            <span className="w-4 h-4 rounded-full border border-[var(--gold)]/40 flex items-center justify-center flex-shrink-0 group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)]/10 transition-colors">
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-[var(--gold)]">✓</span>
            </span>
            <span className="truncate text-[var(--text-1)] text-xs font-serif">{task.title}</span>
            {task.subTasks.length > 0 && (
              <span className="text-[9px] font-typewriter text-[var(--text-3)] ml-auto">
                {task.subTasks.filter((s) => s.completed).length}/{task.subTasks.length}
              </span>
            )}
          </motion.button>
        ))}
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