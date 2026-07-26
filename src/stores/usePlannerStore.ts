import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  subTasks: SubTask[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  time?: string;
  date: string;
  recurring?: 'daily' | 'weekly' | 'monthly';
}

export interface JournalEntry {
  date: string;
  content: string;
  mood?: string;
  decoration?: string;
}

export interface MoodEntry {
  mood: string;
  note?: string;
  date: string;
}

interface PlannerState {
  tasks: Task[];
  events: CalendarEvent[];
  journalEntries: Record<string, JournalEntry>;
  oracleQuotes: Record<string, { quote: string; source: string }>;
  moods: Record<string, MoodEntry>;

  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addSubTask: (parentId: string, title: string) => void;
  toggleSubTask: (parentId: string, subId: string) => void;

  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;

  addJournalEntry: (entry: JournalEntry) => void;
  addOracleQuote: (date: string, quote: string, source: string) => void;
  addMood: (date: string, mood: string, note?: string) => void;

  getEventsForDate: (date: string) => CalendarEvent[];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      tasks: [],
      events: [],
      journalEntries: {},
      oracleQuotes: {},
      moods: {},

      addTask: (title) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: generateId(),
              title,
              completed: false,
              createdAt: new Date().toISOString().split('T')[0],
              subTasks: [],
            },
          ],
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      addSubTask: (parentId, title) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === parentId
              ? { ...t, subTasks: [...t.subTasks, { id: generateId(), title, completed: false }] }
              : t
          ),
        })),

      toggleSubTask: (parentId, subId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === parentId
              ? {
                  ...t,
                  subTasks: t.subTasks.map((st) =>
                    st.id === subId ? { ...st, completed: !st.completed } : st
                  ),
                }
              : t
          ),
        })),

      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: generateId() }],
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      addJournalEntry: (entry) =>
        set((state) => ({
          journalEntries: { ...state.journalEntries, [entry.date]: entry },
        })),

      addOracleQuote: (date, quote, source) =>
        set((state) => ({
          oracleQuotes: { ...state.oracleQuotes, [date]: { quote, source } },
        })),

      addMood: (date, mood, note) =>
        set((state) => ({
          moods: { ...state.moods, [date]: { mood, note, date } },
        })),

      getEventsForDate: (date) => get().events.filter((e) => e.date === date),
    }),
    { name: 'daily-planner-storage' }
  )
);