import { useState } from 'react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useS900Store } from '../store'
import type { S900Category } from '../types'

type TimeFilter = 'dia' | 'semana' | 'mes' | 'año'

const CATEGORY_CONFIG: Record<S900Category, { label: string; color: string; shortLabel: string }> = {
  programacion: { label: 'Programación', color: '#22c55e', shortLabel: 'Prog.' },
  lectura:      { label: 'Lectura',       color: '#6366f1', shortLabel: 'Lectura' },
  ejercicio:    { label: 'Ejercicio',     color: '#f59e0b', shortLabel: 'Ejerc.' },
  escritura:    { label: 'Escritura',     color: '#a855f7', shortLabel: 'Escrit.' },
  descanso:     { label: 'Descanso',      color: '#64748b', shortLabel: 'Desc.' },
  social:       { label: 'Social',        color: '#38bdf8', shortLabel: 'Social' },
  deep_rest:    { label: 'Deep Rest',     color: '#6366f1', shortLabel: 'Rest' },
  ausente:      { label: 'Ausente',       color: '#1f2333', shortLabel: 'Aus.' },
  otro:         { label: 'Otro',          color: '#ef4444', shortLabel: 'Otro' },
}

function getDateRange(filter: TimeFilter) {
  const now = new Date()
  switch (filter) {
    case 'dia':    return { start: now, end: now }
    case 'semana': return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
    case 'mes':    return { start: startOfMonth(now), end: endOfMonth(now) }
    case 'año':    return { start: startOfYear(now), end: now }
  }
}

export function S900Dashboard() {
  const { snapshots } = useS900Store()
  const [filter, setFilter] = useState<TimeFilter>('semana')

  const { start, end } = getDateRange(filter)
  const filtered = snapshots.filter(s => {
    const d = new Date(s.timestamp)
    const s0 = new Date(start); s0.setHours(0, 0, 0, 0)
    const e0 = new Date(end);   e0.setHours(23, 59, 59, 999)
    return d >= s0 && d <= e0
  })

  const maxPossible = { dia: 64, semana: 7 * 64, mes: 30 * 64, año: 365 * 64 }[filter]
  const completionRate = Math.round((filtered.length / Math.min(maxPossible, 112)) * 100)

  const catCounts: Partial<Record<S900Category, number>> = {}
  filtered.forEach(s => {
    if (s.category !== 'ausente') catCounts[s.category] = (catCounts[s.category] || 0) + 1
  })

  const totalNonAbsent = Object.values(catCounts).reduce((a, b) => a + (b || 0), 0)
  const chartData = (Object.entries(catCounts) as [S900Category, number][])
    .map(([cat, count]) => ({
      category: cat,
      label: CATEGORY_CONFIG[cat]?.shortLabel || cat,
      count,
      pct: totalNonAbsent > 0 ? Math.round((count / totalNonAbsent) * 100) : 0,
      color: CATEGORY_CONFIG[cat]?.color || '#374151',
    }))
    .sort((a, b) => b.count - a.count)

  const topCategory = chartData[0]
  const productive = ['programacion', 'lectura', 'escritura', 'ejercicio']
  const productiveRate = filtered.length > 0
    ? Math.round((filtered.filter(s => productive.includes(s.category)).length / filtered.length) * 100)
    : 0

  const todaySnaps = snapshots.filter(s => s.timestamp.startsWith(new Date().toISOString().split('T')[0]))
  const totalToday = Math.floor((new Date().getHours() * 60 + new Date().getMinutes()) / 15)

  const FILTER_LABELS = { dia: 'Día', semana: 'Semana', mes: 'Mes', año: 'Año' }

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#0d0e14' }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-5" style={{ borderBottom: '1px solid #1a1c28' }}>
        <h1 className="text-lg font-semibold text-white flex-1">900S Dashboard</h1>
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #1a1c28', background: '#111218' }}>
          {(['dia', 'semana', 'mes', 'año'] as TimeFilter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 text-xs font-medium transition-colors"
              style={{ background: filter === f ? '#1a1c28' : 'transparent', color: filter === f ? 'white' : '#4b5563' }}>
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="rounded-xl p-5" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <p className="text-xs mb-3" style={{ color: '#4b5563' }}>Registros esta semana</p>
            <p className="text-4xl font-bold text-white leading-none mb-2">{filtered.length}</p>
            <p className="text-xs" style={{ color: '#374151' }}>
              de {Math.min(maxPossible, 112)} posibles ({completionRate}%)
            </p>
          </div>

          <div className="rounded-xl p-5" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <p className="text-xs mb-3" style={{ color: '#4b5563' }}>Categoría principal</p>
            {topCategory ? (
              <>
                <p className="text-xl font-bold leading-none mb-2" style={{ color: topCategory.color }}>
                  {CATEGORY_CONFIG[topCategory.category]?.label}
                </p>
                <p className="text-xs" style={{ color: '#374151' }}>
                  {topCategory.pct}% del tiempo · {Math.round(topCategory.count * 0.25)}h
                </p>
              </>
            ) : <p className="text-sm" style={{ color: '#374151' }}>Sin datos</p>}
          </div>

          <div className="rounded-xl p-5" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <p className="text-xs mb-3" style={{ color: '#4b5563' }}>Tiempo productivo</p>
            <p className="text-4xl font-bold leading-none mb-2" style={{ color: '#22c55e' }}>{productiveRate}%</p>
            <p className="text-xs" style={{ color: '#22c55e' }}>en actividades productivas</p>
          </div>

          <div className="rounded-xl p-5" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <p className="text-xs mb-3" style={{ color: '#4b5563' }}>Snapshots hoy</p>
            <p className="text-4xl font-bold leading-none mb-2 text-white">
              {todaySnaps.length} <span className="text-2xl" style={{ color: '#374151' }}>/ {totalToday}</span>
            </p>
            <p className="text-xs" style={{ color: '#374151' }}>4 por hora · {Math.round(todaySnaps.length * 0.25)}h</p>
          </div>
        </div>

        {/* Main 2-col */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 300px' }}>
          {/* Chart */}
          <div className="rounded-xl p-5" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <h3 className="text-sm font-medium text-white mb-5">Distribución por categoría</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 24, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#111218', border: '1px solid #1a1c28', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(val) => [`${val} registros`, '']}
                  />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}
                    label={{ position: 'top', fill: '#4b5563', fontSize: 11, formatter: (v: unknown) => `${totalNonAbsent > 0 ? Math.round((Number(v) / totalNonAbsent) * 100) : 0}%` }}>
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-56 flex items-center justify-center">
                <p className="text-sm" style={{ color: '#374151' }}>Sin registros en este período</p>
              </div>
            )}
            {/* Insights */}
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid #1a1c28' }}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: '#6366f1', fontSize: 13 }}>↗</span>
                <span className="text-xs font-semibold text-white">Correlación con hábitos</span>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { color: '#6366f1', text: 'Lectura correlaciona +82% con productividad matutina' },
                  { color: '#f59e0b', text: "Ejercicio reduce tiempo en 'Descanso' un 40%" },
                  { color: '#a855f7', text: 'Escritura matutina aumenta focus en Programación +25%' },
                ].map(({ color, text }) => (
                  <div key={text} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                    <span className="text-xs" style={{ color: '#4b5563' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historial */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #1a1c28' }}>
              <h3 className="text-sm font-medium text-white">Historial reciente</h3>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
              {[...filtered]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 20)
                .map(snap => {
                  const cat = CATEGORY_CONFIG[snap.category]
                  return (
                    <div key={snap.id} className="flex items-start gap-2.5 px-5 py-3" style={{ borderBottom: '1px solid #1a1c28' }}>
                      <span className="text-[10px] font-mono w-9 shrink-0 pt-0.5" style={{ color: '#374151' }}>
                        {format(new Date(snap.timestamp), 'HH:mm')}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: cat?.color || '#374151' }} />
                      <span className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{snap.activity}</span>
                    </div>
                  )
                })}
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-xs" style={{ color: '#374151' }}>Sin registros</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
