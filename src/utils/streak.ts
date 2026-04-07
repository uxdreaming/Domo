import { differenceInDays, parseISO } from 'date-fns'
import type { Habit, HabitLog } from '../types'

// Coverage in days per frequency and level
export function getCoverageDays(habit: Habit, level: 'min' | 'max'): number {
  if (habit.frequency === 'custom') return Infinity // custom habits never lose streak

  const coverage: Record<Habit['frequency'], { min: number; max: number }> = {
    daily:   { min: 2,   max: 4 },
    weekly:  { min: 7,   max: 14 },
    monthly: { min: 30,  max: 60 },
    yearly:  { min: 365, max: 365 },
    custom:  { min: Infinity, max: Infinity },
  }

  return coverage[habit.frequency][level]
}

// Get the most recent log for a habit
export function getLastLog(habit: Habit): HabitLog | null {
  if (habit.logs.length === 0) return null
  return [...habit.logs].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0]
}

// Get hours remaining before streak breaks (null = never breaks)
export function getHoursUntilStreakBreak(habit: Habit): number | null {
  if (habit.frequency === 'custom') return null

  const lastLog = getLastLog(habit)
  if (!lastLog) return 0

  const coverageDays = getCoverageDays(habit, lastLog.level)
  if (coverageDays === Infinity) return null

  const lastTimestamp = new Date(lastLog.timestamp)
  const expiresAt = new Date(lastTimestamp)
  expiresAt.setDate(expiresAt.getDate() + coverageDays)

  const now = new Date()
  const diffMs = expiresAt.getTime() - now.getTime()
  return Math.max(0, diffMs / (1000 * 60 * 60))
}

// Is streak currently active (not broken)?
export function isStreakActive(habit: Habit): boolean {
  if (habit.frequency === 'custom') return true

  const hours = getHoursUntilStreakBreak(habit)
  if (hours === null) return true
  return hours > 0
}

// Get urgency based on hours remaining
export function getStreakUrgency(habit: Habit): 1 | 2 | 7 | null {
  if (habit.frequency === 'custom') return null

  const hours = getHoursUntilStreakBreak(habit)
  if (hours === null) return null
  if (hours <= 24) return 1
  if (hours <= 48) return 2
  if (hours <= 168) return 7
  return null
}

// Calculate individual streak length in "units" (days/weeks/months/years)
export function getStreakLength(habit: Habit): number {
  if (habit.logs.length === 0) return 0

  const sortedLogs = [...habit.logs].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const createdAt = parseISO(habit.createdAt)
  const now = new Date()

  // Days since creation with at least one log in coverage window
  let streak = 0
  let cursor = new Date(now)

  for (const log of sortedLogs) {
    const logDate = parseISO(log.date)
    const coverageDays = getCoverageDays(habit, log.level)
    const expiresDate = new Date(logDate)
    expiresDate.setDate(expiresDate.getDate() + coverageDays)

    if (cursor <= expiresDate) {
      streak = Math.max(streak, differenceInDays(cursor, createdAt))
      cursor = logDate
    } else {
      break
    }
  }

  return streak
}

// Get completion status for a specific date
export function getLogForDate(habit: Habit, date: string): HabitLog | null {
  return habit.logs.find(l => l.date === date) || null
}

// Get last 7 days completion statuses
export function getLast7Days(habit: Habit): Array<{ date: string; level: 'min' | 'max' | null }> {
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const log = getLogForDate(habit, dateStr)
    result.push({ date: dateStr, level: log?.level || null })
  }
  return result
}

// General streak: average completion across all habits for a date
export function getDailyCompletionRate(habits: Habit[], date: string): number {
  if (habits.length === 0) return 0
  const completed = habits.filter(h => getLogForDate(h, date) !== null).length
  return Math.round((completed / habits.length) * 100)
}

// Is today's habit done?
export function isTodayDone(habit: Habit): boolean {
  const today = new Date().toISOString().split('T')[0]
  return getLogForDate(habit, today) !== null
}
