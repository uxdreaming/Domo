import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Flame } from 'lucide-react'
import { useHabitsStore } from '../store'
import { isTodayDone, getHoursUntilStreakBreak, getLast7Days } from '../utils/streak'
import type { Habit, HabitCategory, HabitFrequency } from '../types'
import { Modal } from '../components/ui/Modal'
import { Field, Input, Select } from '../components/ui/FormFields'

const today = new Date().toISOString().split('T')[0]

const CATEGORY_LABELS: Record<HabitCategory, string> = {
  salud: 'Salud',
  productividad: 'Productividad',
  journalist: 'Journalist',
  aprendizaje: 'Aprendizaje',
  social: 'Social',
  otro: 'Otro',
}

function DotCalendar({ habit }: { habit: Habit }) {
  const days = getLast7Days(habit)
  return (
    <div className="flex gap-1.5">
      {days.map(({ date, level }) => (
        <div
          key={date}
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: level === 'max' ? '#6366f1' : level === 'min' ? '#3730a3' : '#1f2333',
          }}
          title={date}
        />
      ))}
    </div>
  )
}

function MinMaxCell({ habit, level }: { habit: Habit; level: 'min' | 'max' }) {
  const { logHabit, removeLog } = useHabitsStore()
  const todayLog = habit.logs.find(l => l.date === today)
  const active = todayLog?.level === level

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (active) {
      removeLog(habit.id, today)
    } else {
      logHabit(habit.id, { date: today, level, timestamp: new Date().toISOString() })
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-[26px] h-[26px] rounded flex items-center justify-center transition-all"
      style={{
        background: active ? '#6366f1' : 'transparent',
        border: `1px solid ${active ? '#6366f1' : '#2a2f40'}`,
      }}
    >
      {active && <span className="text-white text-[11px]">✓</span>}
    </button>
  )
}

interface NewHabitForm {
  name: string
  category: HabitCategory
  frequency: HabitFrequency
  minDescription: string
  maxDescription: string
}

function NewHabitModal({ onClose }: { onClose: () => void }) {
  const { addHabit } = useHabitsStore()
  const [form, setForm] = useState<NewHabitForm>({
    name: '',
    category: 'salud',
    frequency: 'daily',
    minDescription: '',
    maxDescription: '',
  })

  const set = (key: keyof NewHabitForm, val: string) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    if (!form.name.trim()) return
    addHabit({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      category: form.category,
      frequency: form.frequency,
      minDescription: form.minDescription,
      maxDescription: form.maxDescription,
      createdAt: new Date().toISOString(),
      logs: [],
      urgency: 1,
      isJournalist: form.category === 'journalist',
      archived: false,
    })
    onClose()
  }

  return (
    <Modal title="Nuevo hábito" onClose={onClose}>
      <div className="flex flex-col gap-5 p-6">
        <Field label="Nombre">
          <Input
            placeholder="ej. Lectura 30min"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoría">
            <Select value={form.category} onChange={e => set('category', e.target.value)}>
              {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </Select>
          </Field>

          <Field label="Frecuencia">
            <Select value={form.frequency} onChange={e => set('frequency', e.target.value)}>
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
              <option value="custom">Personalizado</option>
            </Select>
          </Field>
        </div>

        <Field label="Mínimo" hint="Versión mínima viable del día">
          <Input
            placeholder="ej. Leer 15 minutos"
            value={form.minDescription}
            onChange={e => set('minDescription', e.target.value)}
          />
        </Field>

        <Field label="Máximo" hint="Versión completa ideal">
          <Input
            placeholder="ej. Leer 8 capítulos"
            value={form.maxDescription}
            onChange={e => set('maxDescription', e.target.value)}
          />
        </Field>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: '#1c1f28', color: '#64748b', border: '1px solid #1f2333' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim()}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-40"
            style={{ background: '#6366f1' }}
          >
            Crear hábito
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function Habits() {
  const { habits } = useHabitsStore()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const activeHabits = habits.filter(h => !h.archived)

  const grouped = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    category: key as HabitCategory,
    label,
    habits: activeHabits.filter(h => h.category === key),
  })).filter(g => g.habits.length > 0)

  return (
    <div className="p-10 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">Hábitos</h1>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: '#6366f122', color: '#818cf8', border: '1px solid #6366f133' }}
          >
            {activeHabits.length}
          </span>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: '#6366f1' }}
        >
          <Plus size={14} />
          Nuevo hábito
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#161820', border: '1px solid #1f2333' }}>
        {/* Table header */}
        <div
          className="grid px-6 py-4 text-xs border-b border-[#1f2333]"
          style={{ color: '#374151', gridTemplateColumns: '1fr 52px 52px 72px 100px' }}
        >
          <span>Nombre</span>
          <span className="text-center">Min</span>
          <span className="text-center">Max</span>
          <span className="text-center">Racha</span>
          <span className="text-center">7 días</span>
        </div>

        {grouped.map(({ category, label, habits: catHabits }) => (
          <div key={category}>
            {/* Category header */}
            <div className="px-6 pt-5 pb-2">
              <span
                className="text-[10px] font-semibold tracking-[0.15em]"
                style={{ color: '#374151' }}
              >
                {label.toUpperCase()}
              </span>
            </div>

            {catHabits.map(habit => {
              const streakLen = habit.logs.length
              const hours = getHoursUntilStreakBreak(habit)
              const isUrgent = hours !== null && hours <= 24 && !isTodayDone(habit)

              return (
                <div
                  key={habit.id}
                  className="grid items-center px-6 py-4 border-t border-[#1f2333] hover:bg-[#1c1f28] cursor-pointer transition-colors"
                  style={{ gridTemplateColumns: '1fr 52px 52px 72px 100px' }}
                  onClick={() => navigate(`/habitos/${habit.id}`)}
                >
                  <div className="flex items-center gap-2.5">
                    {habit.isJournalist && (
                      <span
                        className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ background: '#a855f722', color: '#a855f7' }}
                      >
                        J
                      </span>
                    )}
                    <span className={`text-sm ${isUrgent ? 'text-[#ef4444]' : 'text-white'}`}>
                      {habit.name}
                    </span>
                    {isUrgent && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0"
                        style={{ background: '#1a1015', color: '#ef4444' }}
                      >
                        {Math.floor(hours!)}h
                      </span>
                    )}
                  </div>

                  <div className="flex justify-center" onClick={e => e.stopPropagation()}>
                    <MinMaxCell habit={habit} level="min" />
                  </div>
                  <div className="flex justify-center" onClick={e => e.stopPropagation()}>
                    <MinMaxCell habit={habit} level="max" />
                  </div>

                  <div className="flex items-center justify-center gap-1.5">
                    <Flame size={12} style={{ color: '#f59e0b' }} />
                    <span className="text-sm font-mono text-white">{streakLen}</span>
                  </div>

                  <div className="flex justify-center">
                    <DotCalendar habit={habit} />
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        {activeHabits.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm mb-2" style={{ color: '#374151' }}>Sin hábitos todavía</p>
            <button
              onClick={() => setShowNew(true)}
              className="text-xs underline"
              style={{ color: '#6366f1' }}
            >
              Crear el primero
            </button>
          </div>
        )}
      </div>

      {showNew && <NewHabitModal onClose={() => setShowNew(false)} />}
    </div>
  )
}
