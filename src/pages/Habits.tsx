import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Flame } from 'lucide-react'
import { useHabitsStore } from '../store'
import { getHoursUntilStreakBreak } from '../utils/streak'
import type { Habit, HabitCategory, HabitFrequency } from '../types'
import { Modal } from '../components/ui/Modal'
import { Field, Input, Select } from '../components/ui/FormFields'

const today = new Date().toISOString().split('T')[0]

const CATEGORY_LABELS: Record<HabitCategory, string> = {
  salud: 'Salud', productividad: 'Productividad', journalist: 'Journalist',
  aprendizaje: 'Aprendizaje', social: 'Social', otro: 'Otro',
}
const CATEGORY_COLORS: Record<HabitCategory, string> = {
  salud: '#22c55e', productividad: '#6366f1', journalist: '#a855f7',
  aprendizaje: '#38bdf8', social: '#f59e0b', otro: '#64748b',
}
const CATEGORY_ORDER: HabitCategory[] = ['salud', 'productividad', 'journalist', 'aprendizaje', 'social', 'otro']
const FREQ_LABELS: Record<HabitFrequency, string> = {
  daily: 'Diario', weekly: 'Semanal', monthly: 'Mensual', yearly: 'Anual', custom: 'Custom',
}

function NewHabitModal({ onClose }: { onClose: () => void }) {
  const { addHabit } = useHabitsStore()
  const [name, setName]         = useState('')
  const [category, setCategory] = useState<HabitCategory>('salud')
  const [frequency, setFreq]    = useState<HabitFrequency>('daily')
  const [minDesc, setMinDesc]   = useState('')
  const [maxDesc, setMaxDesc]   = useState('')

  const save = () => {
    if (!name.trim()) return
    addHabit({
      id: crypto.randomUUID(), name: name.trim(),
      category, frequency,
      minDescription: minDesc.trim(), maxDescription: maxDesc.trim(),
      logs: [], createdAt: new Date().toISOString(), urgency: 2,
      isJournalist: category === 'journalist', archived: false,
    })
    onClose()
  }

  return (
    <Modal title="Nuevo Hábito" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field label="Nombre">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Lectura 30min" autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoría">
            <Select value={category} onChange={e => setCategory(e.target.value as HabitCategory)}>
              {CATEGORY_ORDER.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </Select>
          </Field>
          <Field label="Frecuencia">
            <Select value={frequency} onChange={e => setFreq(e.target.value as HabitFrequency)}>
              {(Object.entries(FREQ_LABELS) as [HabitFrequency, string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Mínimo" hint="¿Qué es hacer el mínimo aceptable?">
          <Input value={minDesc} onChange={e => setMinDesc(e.target.value)} placeholder="Ej: Leer 15 minutos" />
        </Field>
        <Field label="Máximo" hint="¿Qué es dar el 100%?">
          <Input value={maxDesc} onChange={e => setMaxDesc(e.target.value)} placeholder="Ej: Leer 8 capítulos" />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ background: '#1a1c28', color: '#64748b' }}>
            Cancelar
          </button>
          <button onClick={save} disabled={!name.trim()} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40"
            style={{ background: CATEGORY_COLORS[category] }}>
            Crear hábito
          </button>
        </div>
      </div>
    </Modal>
  )
}

function isLevelDone(habit: Habit, level: 'min' | 'max'): boolean {
  return habit.logs.some(l => l.date === today && l.level === level)
}

function HabitRow({ habit }: { habit: Habit }) {
  const navigate = useNavigate()
  const { logHabit, removeLog } = useHabitsStore()
  const minDone = isLevelDone(habit, 'min')
  const maxDone = isLevelDone(habit, 'max')
  const hours = getHoursUntilStreakBreak(habit)
  const color = CATEGORY_COLORS[habit.category as HabitCategory] || '#64748b'

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const ds = d.toISOString().split('T')[0]
    const log = habit.logs.find(l => l.date === ds)
    return log?.level || null
  })

  const toggleMin = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (minDone) removeLog(habit.id, today)
    else logHabit(habit.id, { date: today, level: 'min', timestamp: new Date().toISOString() })
  }
  const toggleMax = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (maxDone) removeLog(habit.id, today)
    else logHabit(habit.id, { date: today, level: 'max', timestamp: new Date().toISOString() })
  }

  return (
    <div className="flex items-center px-5 py-3 cursor-pointer hover:bg-[#161820] transition-colors"
      style={{ borderBottom: '1px solid #1a1c28' }}
      onClick={() => navigate(`/habitos/${habit.id}`)}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />
        <span className="text-sm text-white truncate">{habit.name}</span>
      </div>
      <div className="w-12 flex justify-center">
        <button onClick={toggleMin} className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold transition-all"
          style={{ background: minDone ? color : '#1a1c28', color: minDone ? 'white' : '#374151', border: `1px solid ${minDone ? color : '#2a2d3a'}` }}>
          {minDone ? '✓' : ''}
        </button>
      </div>
      <div className="w-12 flex justify-center">
        <button onClick={toggleMax} className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold transition-all"
          style={{ background: maxDone ? color : '#1a1c28', color: maxDone ? 'white' : '#374151', border: `1px solid ${maxDone ? color : '#2a2d3a'}` }}>
          {maxDone ? '✓' : ''}
        </button>
      </div>
      <div className="w-16 text-right pr-2">
        <span className="text-sm font-mono" style={{ color: habit.logs.length > 0 ? 'white' : '#374151' }}>
          {habit.logs.length}
        </span>
        {hours !== null && hours <= 24 && (
          <span className="text-[9px] ml-1" style={{ color: '#ef4444' }}>{Math.floor(hours)}h</span>
        )}
      </div>
      <div className="w-20 flex items-center justify-end gap-0.5">
        {last7.map((level, i) => (
          <span key={i} className="w-2.5 h-2.5 rounded-full"
            style={{ background: level === 'max' ? color : level === 'min' ? `${color}66` : '#1f2333' }} />
        ))}
      </div>
    </div>
  )
}

export function Habits() {
  const { habits } = useHabitsStore()
  const [showNew, setShowNew] = useState(false)

  const byCategory = CATEGORY_ORDER.reduce((acc, cat) => {
    const group = habits.filter(h => h.category === cat && !h.archived)
    if (group.length > 0) acc[cat] = group
    return acc
  }, {} as Partial<Record<HabitCategory, Habit[]>>)

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#0d0e14' }}>
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid #1a1c28' }}>
        <h1 className="text-base font-semibold text-white">Hábitos</h1>
        {habits.length > 0 && (
          <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: '#1a1c28', color: '#4b5563' }}>
            {habits.filter(h => !h.archived).length}
          </span>
        )}
        <div className="flex-1" />
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ background: '#f97316' }}>
          <Plus size={12} />
          Nuevo hábito
        </button>
      </div>

      {habits.filter(h => !h.archived).length > 0 && (
        <div className="flex items-center px-5 py-2" style={{ borderBottom: '1px solid #1a1c28' }}>
          <div className="flex-1">
            <span className="text-[10px]" style={{ color: '#374151' }}>Nombre</span>
          </div>
          <div className="w-12 text-center"><span className="text-[10px]" style={{ color: '#374151' }}>Min</span></div>
          <div className="w-12 text-center"><span className="text-[10px]" style={{ color: '#374151' }}>Max</span></div>
          <div className="w-16 text-right pr-2"><span className="text-[10px]" style={{ color: '#374151' }}>Racha</span></div>
          <div className="w-20 text-right"><span className="text-[10px]" style={{ color: '#374151' }}>7 días</span></div>
        </div>
      )}

      {habits.filter(h => !h.archived).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Flame size={32} style={{ color: '#1a1c28' }} className="mb-4" />
          <p className="text-sm mb-2" style={{ color: '#374151' }}>Sin hábitos todavía</p>
          <button onClick={() => setShowNew(true)} className="text-xs underline" style={{ color: '#f97316' }}>
            Crear el primero
          </button>
        </div>
      ) : (
        (Object.entries(byCategory) as [HabitCategory, Habit[]][]).map(([cat, group]) => (
          <div key={cat}>
            <div className="px-5 py-2" style={{ borderBottom: '1px solid #1a1c28' }}>
              <span className="text-[10px] font-semibold tracking-widest" style={{ color: '#374151' }}>
                {CATEGORY_LABELS[cat].toUpperCase()}
              </span>
            </div>
            {group.map(h => <HabitRow key={h.id} habit={h} />)}
          </div>
        ))
      )}

      {showNew && <NewHabitModal onClose={() => setShowNew(false)} />}
    </div>
  )
}
