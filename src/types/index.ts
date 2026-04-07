// ─── HABITS ────────────────────────────────────────────────────────────────

export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
export type HabitCategory = 'salud' | 'productividad' | 'journalist' | 'aprendizaje' | 'social' | 'otro'
export type CheckLevel = 'min' | 'max'
export type UrgencyLevel = 1 | 2 | 7

export interface HabitCustomDays {
  days: number[] // 0=Sun, 1=Mon, ... 6=Sat
}

export interface HabitLog {
  date: string       // ISO date string YYYY-MM-DD
  level: CheckLevel
  timestamp: string  // ISO datetime — exact time of check-in
}

export interface Habit {
  id: string
  name: string
  category: HabitCategory
  frequency: HabitFrequency
  customDays?: HabitCustomDays
  minDescription: string
  maxDescription: string
  createdAt: string       // ISO datetime
  logs: HabitLog[]
  urgency: UrgencyLevel
  isJournalist: boolean
  archived: boolean
}

// ─── OBJECTIVES ────────────────────────────────────────────────────────────

export type ObjectiveStatus = 'pending' | 'in_progress' | 'completed'
export type Priority = 'alta' | 'media' | 'baja'

export interface ObjectiveTask {
  id: string
  text: string
  status: 'pending' | 'in_progress' | 'completed'
  order: number
}

export interface Objective {
  id: string
  name: string
  category: string
  status: ObjectiveStatus
  dueDate: string        // ISO date
  tasks: ObjectiveTask[]
  linkedHabitId?: string
  priority: Priority
  createdAt: string
  urgency: UrgencyLevel
  importedFrom?: string  // 'claude_ai' | manual
}

// ─── PROJECTS ──────────────────────────────────────────────────────────────

export type StageStatus = 'pending' | 'in_progress' | 'completed'
export type ProjectStatus = 'active' | 'paused' | 'pending' | 'completed'

export interface StageSubTask {
  id: string
  text: string
  completed: boolean
}

export interface ProjectStage {
  id: string
  number: string         // "1", "2", "2.1", etc
  name: string
  description: string
  status: StageStatus
  subTasks: StageSubTask[]
  completedDate?: string
  estimatedDate?: string
  progress?: number      // 0-100
}

export interface ProcessNote {
  id: string
  date: string
  content: string
}

export interface Project {
  id: string
  name: string
  status: ProjectStatus
  startDate: string
  projectedEndDate?: string
  stages: ProjectStage[]
  notes: ProcessNote[]
  parentProjectId?: string
  subProjectIds: string[]
  urgency: UrgencyLevel
  createdAt: string
}

// ─── 900S ──────────────────────────────────────────────────────────────────

export type S900Category =
  | 'programacion'
  | 'lectura'
  | 'ejercicio'
  | 'escritura'
  | 'descanso'
  | 'social'
  | 'deep_rest'
  | 'ausente'
  | 'otro'

export interface S900Snapshot {
  id: string
  timestamp: string      // ISO datetime
  activity: string       // free text
  category: S900Category
  edited: boolean        // true if added/edited retroactively
}

// ─── JOURNALIST ────────────────────────────────────────────────────────────

export type JournalistEntryType =
  | 'morning_thinking'
  | 'daily_note'
  | 'weekly_review'
  | 'monthly_review'
  | 'yearly_review'
  | 'writing'
  | 'buyo'

export interface JournalistEntry {
  id: string
  type: JournalistEntryType
  title: string
  content: string        // Markdown
  date: string           // ISO date
  createdAt: string
  updatedAt: string
}

// ─── APP STATE ─────────────────────────────────────────────────────────────

export type AppMode = 'normal' | 'deep_rest' | 'afk'
export type RestType = 'habit' | 'rest' | 'deep_rest'

export interface AppSettings {
  userName: string
  theme: 'dark' | 'light'
  language: 'es' | 'en'
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  timeFormat: '24h' | '12h'
  weekStartsOn: 0 | 1    // 0=Sun, 1=Mon
  s900IntervalMinutes: number
  s900Enabled: boolean
  s900Categories: S900Category[]
}
