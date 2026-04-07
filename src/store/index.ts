import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Habit, HabitLog, Objective, ObjectiveTask,
  Project, ProjectStage, ProcessNote,
  S900Snapshot, JournalistEntry, AppSettings, AppMode
} from '../types'
import {
  seedHabits, seedObjectives, seedProjects,
  seedSnapshots, seedJournalistEntries, defaultSettings
} from '../data/seed'

// ─── HABITS STORE ──────────────────────────────────────────────────────────

interface HabitsState {
  habits: Habit[]
  addHabit: (habit: Habit) => void
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  logHabit: (id: string, log: HabitLog) => void
  removeLog: (habitId: string, date: string) => void
}

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set) => ({
      habits: seedHabits,
      addHabit: (habit) => set((s) => ({ habits: [...s.habits, habit] })),
      updateHabit: (id, updates) => set((s) => ({
        habits: s.habits.map(h => h.id === id ? { ...h, ...updates } : h)
      })),
      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter(h => h.id !== id) })),
      logHabit: (id, log) => set((s) => ({
        habits: s.habits.map(h => {
          if (h.id !== id) return h
          const existing = h.logs.findIndex(l => l.date === log.date)
          const logs = existing >= 0
            ? h.logs.map((l, i) => i === existing ? log : l)
            : [...h.logs, log]
          return { ...h, logs }
        })
      })),
      removeLog: (habitId, date) => set((s) => ({
        habits: s.habits.map(h =>
          h.id === habitId ? { ...h, logs: h.logs.filter(l => l.date !== date) } : h
        )
      })),
    }),
    { name: 'domo-habits' }
  )
)

// ─── OBJECTIVES STORE ──────────────────────────────────────────────────────

interface ObjectivesState {
  objectives: Objective[]
  addObjective: (obj: Objective) => void
  updateObjective: (id: string, updates: Partial<Objective>) => void
  deleteObjective: (id: string) => void
  updateTask: (objId: string, taskId: string, updates: Partial<ObjectiveTask>) => void
  reorderTasks: (objId: string, tasks: ObjectiveTask[]) => void
}

export const useObjectivesStore = create<ObjectivesState>()(
  persist(
    (set) => ({
      objectives: seedObjectives,
      addObjective: (obj) => set((s) => ({ objectives: [...s.objectives, obj] })),
      updateObjective: (id, updates) => set((s) => ({
        objectives: s.objectives.map(o => o.id === id ? { ...o, ...updates } : o)
      })),
      deleteObjective: (id) => set((s) => ({ objectives: s.objectives.filter(o => o.id !== id) })),
      updateTask: (objId, taskId, updates) => set((s) => ({
        objectives: s.objectives.map(o =>
          o.id === objId
            ? { ...o, tasks: o.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) }
            : o
        )
      })),
      reorderTasks: (objId, tasks) => set((s) => ({
        objectives: s.objectives.map(o => o.id === objId ? { ...o, tasks } : o)
      })),
    }),
    { name: 'domo-objectives' }
  )
)

// ─── PROJECTS STORE ────────────────────────────────────────────────────────

interface ProjectsState {
  projects: Project[]
  addProject: (p: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  updateStage: (projId: string, stageId: string, updates: Partial<ProjectStage>) => void
  addNote: (projId: string, note: ProcessNote) => void
  updateNote: (projId: string, noteId: string, content: string) => void
  deleteNote: (projId: string, noteId: string) => void
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: seedProjects,
      addProject: (p) => set((s) => ({ projects: [...s.projects, p] })),
      updateProject: (id, updates) => set((s) => ({
        projects: s.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProject: (id) => set((s) => ({ projects: s.projects.filter(p => p.id !== id) })),
      updateStage: (projId, stageId, updates) => set((s) => ({
        projects: s.projects.map(p =>
          p.id === projId
            ? { ...p, stages: p.stages.map(st => st.id === stageId ? { ...st, ...updates } : st) }
            : p
        )
      })),
      addNote: (projId, note) => set((s) => ({
        projects: s.projects.map(p =>
          p.id === projId ? { ...p, notes: [...p.notes, note] } : p
        )
      })),
      updateNote: (projId, noteId, content) => set((s) => ({
        projects: s.projects.map(p =>
          p.id === projId
            ? { ...p, notes: p.notes.map(n => n.id === noteId ? { ...n, content } : n) }
            : p
        )
      })),
      deleteNote: (projId, noteId) => set((s) => ({
        projects: s.projects.map(p =>
          p.id === projId ? { ...p, notes: p.notes.filter(n => n.id !== noteId) } : p
        )
      })),
    }),
    { name: 'domo-projects' }
  )
)

// ─── 900S STORE ────────────────────────────────────────────────────────────

interface S900State {
  snapshots: S900Snapshot[]
  showPopup: boolean
  popupTimestamp: string | null
  addSnapshot: (snap: S900Snapshot) => void
  updateSnapshot: (id: string, updates: Partial<S900Snapshot>) => void
  triggerPopup: () => void
  dismissPopup: () => void
  skipPopup: (timestamp: string) => void
}

export const useS900Store = create<S900State>()(
  persist(
    (set) => ({
      snapshots: seedSnapshots,
      showPopup: false,
      popupTimestamp: null,
      addSnapshot: (snap) => set((s) => ({ snapshots: [...s.snapshots, snap], showPopup: false })),
      updateSnapshot: (id, updates) => set((s) => ({
        snapshots: s.snapshots.map(sn => sn.id === id ? { ...sn, ...updates } : sn)
      })),
      triggerPopup: () => set({ showPopup: true, popupTimestamp: new Date().toISOString() }),
      dismissPopup: () => set({ showPopup: false }),
      skipPopup: (timestamp) => set((s) => ({
        showPopup: false,
        snapshots: [...s.snapshots, {
          id: crypto.randomUUID(),
          timestamp,
          activity: 'Aru no se encuentra en la laptop',
          category: 'ausente',
          edited: false,
        }],
      })),
    }),
    { name: 'domo-s900' }
  )
)

// ─── JOURNALIST STORE ──────────────────────────────────────────────────────

interface JournalistState {
  entries: JournalistEntry[]
  addEntry: (entry: JournalistEntry) => void
  updateEntry: (id: string, updates: Partial<JournalistEntry>) => void
  deleteEntry: (id: string) => void
}

export const useJournalistStore = create<JournalistState>()(
  persist(
    (set) => ({
      entries: seedJournalistEntries,
      addEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),
      updateEntry: (id, updates) => set((s) => ({
        entries: s.entries.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      deleteEntry: (id) => set((s) => ({ entries: s.entries.filter(e => e.id !== id) })),
    }),
    { name: 'domo-journalist' }
  )
)

// ─── APP STORE ─────────────────────────────────────────────────────────────

interface AppState {
  settings: AppSettings
  mode: AppMode
  deepRestStartedAt: string | null
  afkStartedAt: string | null
  updateSettings: (updates: Partial<AppSettings>) => void
  activateDeepRest: () => void
  deactivateDeepRest: () => void
  activateAFK: () => void
  deactivateAFK: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      mode: 'normal',
      deepRestStartedAt: null,
      afkStartedAt: null,
      updateSettings: (updates) => set((s) => ({ settings: { ...s.settings, ...updates } })),
      activateDeepRest: () => set({ mode: 'deep_rest', deepRestStartedAt: new Date().toISOString() }),
      deactivateDeepRest: () => set({ mode: 'normal', deepRestStartedAt: null }),
      activateAFK: () => set({ mode: 'afk', afkStartedAt: new Date().toISOString() }),
      deactivateAFK: () => set({ mode: 'normal', afkStartedAt: null }),
    }),
    { name: 'domo-app' }
  )
)
