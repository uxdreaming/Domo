import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Flame } from 'lucide-react'
import { format, subMonths, eachDayOfInterval, startOfMonth, endOfMonth, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { useHabitsStore } from '../store'
import { getHoursUntilStreakBreak } from '../utils/streak'

const CATEGORY_LABELS: Record<string, string> = {
  salud: 'Salud', productividad: 'Productividad', journalist: 'Journalist',
  aprendizaje: 'Aprendizaje', social: 'Social', otro: 'Otro',
}
const CATEGORY_COLORS: Record<string, string> = {
  salud: '#22c55e', productividad: '#6366f1', journalist: '#a855f7',
  aprendizaje: '#38bdf8', social: '#f59e0b', otro: '#64748b',
}

function HeatmapCalendar({ logs }: { logs: Array<{ date: string; level: 'min' | 'max' }> }) {
  const logMap = new Map(logs.map(l => [l.date, l.level]))
  const end    = new Date()

  const months = Array.from({ length: 12 }, (_, i) => {
    const monthDate = subMonths(end, 11 - i)
    const mStart    = startOfMonth(monthDate)
    const mEnd      = endOfMonth(monthDate)
    const days      = eachDayOfInterval({ start: mStart, end: mEnd })
    const firstDow  = (getDay(mStart) + 6) % 7 // Mon=0

    const cells = [
      ...Array.from({ length: firstDow }, () => ({ date: '', level: null as null, padding: true })),
      ...days.map(d => {
        const ds = d.toISOString().split('T')[0]
        return { date: ds, level: logMap.get(ds) || null, padding: false }
      }),
    ]
    return { label: format(monthDate, 'MMM', { locale: es }), cells }
  })

  const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  return (
    <div className="rounded-xl p-6" style={{ background: '#161820', border: '1px solid #1f2333' }}>
      <h3 className="text-sm font-medium text-white mb-5">Últimos 12 meses</h3>
      <div className="flex gap-1.5 overflow-x-auto pb-2">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1 shrink-0 pt-5">
          {dayLabels.map(d => (
            <div key={d} className="h-[13px] text-[9px] flex items-center justify-end pr-1 w-4" style={{ color: '#374151' }}>{d}</div>
          ))}
        </div>
        {months.map(({ label, cells }) => {
          const weeks: typeof cells[] = []
          for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
          return (
            <div key={label} className="shrink-0">
              <div className="text-[9px] mb-1.5 text-center" style={{ color: '#374151' }}>{label}</div>
              <div className="flex gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day, di) => (
                      <div
                        key={di}
                        className="w-[13px] h-[13px] rounded-sm"
                        style={{
                          background: day.padding   ? 'transparent'
                            : day.level === 'max'   ? '#6366f1'
                            : day.level === 'min'   ? '#3730a3'
                            : '#1f2333',
                        }}
                        title={day.date || ''}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-5 mt-4">
        {[
          { bg: '#1f2333', label: 'Sin registro' },
          { bg: '#3730a3', label: 'Min' },
          { bg: '#6366f1', label: 'Max' },
        ].map(({ bg, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: bg }} />
            <span className="text-[10px]" style={{ color: '#374151' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MonthlyBars({ logs }: { logs: Array<{ date: string; level: 'min' | 'max' }> }) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const d      = subMonths(new Date(), 5 - i)
    const prefix = format(d, 'yyyy-MM')
    const total  = endOfMonth(d).getDate()
    const count  = logs.filter(l => l.date.startsWith(prefix)).length
    return { label: format(d, 'MMM', { locale: es }), rate: Math.round((count / total) * 100) }
  })
  const maxRate = Math.max(...months.map(m => m.rate), 1)

  return (
    <div className="rounded-xl p-6" style={{ background: '#161820', border: '1px solid #1f2333' }}>
      <div className="flex items-end justify-around gap-3" style={{ height: 120 }}>
        {months.map(({ label, rate }) => (
          <div key={label} className="flex flex-col items-center gap-2 flex-1">
            <span className="text-[10px]" style={{ color: '#64748b' }}>{rate}%</span>
            <div className="w-full rounded-sm" style={{
              background: '#6366f1',
              height: `${Math.max((rate / maxRate) * 80, rate > 0 ? 4 : 0)}px`,
            }} />
            <span className="text-[10px]" style={{ color: '#374151' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HabitDetail() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const { habits } = useHabitsStore()
  const habit      = habits.find(h => h.id === id)

  if (!habit) return (
    <div className="p-10 text-center" style={{ color: '#64748b' }}>
      Hábito no encontrado.{' '}
      <button onClick={() => navigate('/habitos')} className="underline">Volver</button>
    </div>
  )

  const streakLen      = habit.logs.length
  const completionRate = habit.logs.length > 0
    ? Math.round((habit.logs.filter(l => l.level === 'max').length / habit.logs.length) * 100)
    : 0
  const hours        = getHoursUntilStreakBreak(habit)
  const categoryColor = CATEGORY_COLORS[habit.category] || '#6366f1'

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ background: '#0d0e14' }}>
      {/* Back */}
      <button
        onClick={() => navigate('/habitos')}
        className="flex items-center gap-2 text-sm mb-8 transition-colors hover:text-white"
        style={{ color: '#64748b' }}
      >
        <ArrowLeft size={14} />
        Hábitos
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Flame size={22} style={{ color: categoryColor }} />
        <h1 className="text-2xl font-semibold text-white">{habit.name}</h1>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: `${categoryColor}22`, color: categoryColor, border: `1px solid ${categoryColor}33` }}>
          {CATEGORY_LABELS[habit.category]}
        </span>
      </div>

      {/* Min / Max */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: 'Mínimo', value: habit.minDescription },
          { label: 'Máximo', value: habit.maxDescription },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-5" style={{ background: '#161820', border: '1px solid #1f2333' }}>
            <p className="text-xs mb-2" style={{ color: '#374151' }}>{label}</p>
            <p className="text-sm text-white">{value || '—'}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-5" style={{ background: '#161820', border: '1px solid #1f2333' }}>
          <p className="text-xs mb-3" style={{ color: '#64748b' }}>Racha actual</p>
          <p className="text-3xl font-bold" style={{ color: '#6366f1' }}>{streakLen} días</p>
          {hours !== null && hours <= 48 && (
            <p className="text-xs mt-2" style={{ color: '#ef4444' }}>
              Vence en {Math.floor(hours)}h {Math.floor((hours % 1) * 60)}m
            </p>
          )}
        </div>
        <div className="rounded-xl p-5" style={{ background: '#161820', border: '1px solid #1f2333' }}>
          <p className="text-xs mb-3" style={{ color: '#64748b' }}>Racha máxima</p>
          <p className="text-3xl font-bold text-white">{streakLen} días</p>
        </div>
        <div className="rounded-xl p-5" style={{ background: '#161820', border: '1px solid #1f2333' }}>
          <p className="text-xs mb-3" style={{ color: '#64748b' }}>Tasa de completado</p>
          <p className="text-3xl font-bold" style={{ color: '#6366f1' }}>{completionRate}%</p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="mb-4">
        <HeatmapCalendar logs={habit.logs} />
      </div>

      {/* Monthly bars */}
      <MonthlyBars logs={habit.logs} />
    </div>
  )
}
