import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useHabitsStore, useObjectivesStore, useProjectsStore, useS900Store } from '../store'
import { getHoursUntilStreakBreak } from '../utils/streak'

const today = new Date().toISOString().split('T')[0]

const CAT_COLORS: Record<string, string> = {
  programacion: '#22c55e', lectura: '#6366f1', ejercicio: '#f59e0b',
  escritura: '#a855f7', descanso: '#64748b', social: '#38bdf8',
  deep_rest: '#6366f1', ausente: '#1f2333', otro: '#ef4444',
}

const HAB_CAT_COLORS: Record<string, string> = {
  salud: '#22c55e', productividad: '#6366f1', journalist: '#a855f7',
  aprendizaje: '#38bdf8', social: '#f59e0b', otro: '#64748b',
}

function MiniBar({ count, max, color }: { count: number; max: number; color: string }) {
  const h = max > 0 ? Math.max((count / max) * 28, count > 0 ? 3 : 0) : 0
  return <div className="w-2.5 rounded-sm self-end" style={{ height: h, background: color }} />
}

export function Dashboard() {
  const navigate = useNavigate()
  const { habits } = useHabitsStore()
  const { objectives } = useObjectivesStore()
  const { projects } = useProjectsStore()
  const { snapshots } = useS900Store()

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 19) return 'Buenas tardes'
    return 'Buenas noches'
  })()

  const activeStreaks = habits.filter(h => h.logs.some(l => l.date === today)).length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const totalTasks = objectives.reduce((acc, o) => acc + o.tasks.length, 0)
  const doneTasks  = objectives.reduce((acc, o) => acc + o.tasks.filter(t => t.status === 'completed').length, 0)
  const objPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const todaySnaps = snapshots.filter(s => s.timestamp.startsWith(today))
  const totalSlots = Math.floor((new Date().getHours() * 60 + new Date().getMinutes()) / 15)

  const catCounts: Record<string, number> = {}
  todaySnaps.forEach(s => { if (s.category !== 'ausente') catCounts[s.category] = (catCounts[s.category] || 0) + 1 })
  const catEntries = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxCat = catEntries.length > 0 ? Math.max(...catEntries.map(([, v]) => v)) : 1

  const recentSnaps = [...snapshots]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  const todayHabits = habits.slice(0, 7)

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#0d0e14' }}>
      <div className="px-8 pt-8 pb-10 max-w-[1400px]">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">{greeting}, Aru</h1>
          <p className="text-sm mt-0.5 capitalize" style={{ color: '#374151' }}>
            {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="rounded-xl p-5" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <p className="text-xs mb-3" style={{ color: '#4b5563' }}>Rachas Activas</p>
            <p className="text-4xl font-bold text-white leading-none mb-2">{activeStreaks}</p>
            <p className="text-xs" style={{ color: '#374151' }}>hábitos con racha activa</p>
          </div>

          <div className="rounded-xl p-5" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <p className="text-xs mb-3" style={{ color: '#4b5563' }}>900S Hoy</p>
            <div className="flex items-end gap-1 h-8 mb-2">
              {catEntries.length > 0
                ? catEntries.map(([cat, count]) => (
                    <MiniBar key={cat} count={count} max={maxCat} color={CAT_COLORS[cat] || '#374151'} />
                  ))
                : <p className="text-xs self-center" style={{ color: '#374151' }}>Sin registros</p>
              }
            </div>
            <p className="text-xs" style={{ color: '#374151' }}>{todaySnaps.length} de {totalSlots} registrados</p>
          </div>

          <div className="rounded-xl p-5" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <p className="text-xs mb-3" style={{ color: '#4b5563' }}>Proyectos Activos</p>
            <p className="text-4xl font-bold text-white leading-none mb-2">{activeProjects}</p>
            <p className="text-xs" style={{ color: '#374151' }}>
              {completedProjects > 0 ? `${completedProjects} completados` : 'en progreso'}
            </p>
          </div>

          <div className="rounded-xl p-5" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <p className="text-xs mb-3" style={{ color: '#4b5563' }}>Objetivos</p>
            <p className="text-4xl font-bold leading-none mb-3" style={{ color: '#eab308' }}>{objPct}%</p>
            <div className="h-0.5 rounded-full mb-1" style={{ background: '#1a1c28' }}>
              <div className="h-0.5 rounded-full" style={{ width: `${objPct}%`, background: '#eab308' }} />
            </div>
            <p className="text-xs" style={{ color: '#374151' }}>progreso acumulado</p>
          </div>
        </div>

        {/* 2-col */}
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 300px' }}>
          {/* Hábitos de Hoy */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1a1c28' }}>
              <h3 className="text-sm font-semibold text-white">Hábitos de Hoy</h3>
              <button onClick={() => navigate('/habitos')} className="text-xs hover:text-white transition-colors" style={{ color: '#374151' }}>
                Add consecutivos →
              </button>
            </div>
            {habits.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm" style={{ color: '#374151' }}>Sin hábitos todavía</p>
                <button onClick={() => navigate('/habitos')} className="text-xs mt-2 underline" style={{ color: '#6366f1' }}>
                  Agregar primer hábito
                </button>
              </div>
            ) : (
              todayHabits.map(habit => {
                const minDone = habit.logs.some(l => l.date === today && l.level === 'min')
                const maxDone = habit.logs.some(l => l.date === today && l.level === 'max')
                const hours = getHoursUntilStreakBreak(habit)
                const catColor = HAB_CAT_COLORS[habit.category] || '#64748b'
                const last7 = Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(); d.setDate(d.getDate() - (6 - i))
                  const ds = d.toISOString().split('T')[0]
                  const log = habit.logs.find(l => l.date === ds)
                  return log?.level || null
                })
                return (
                  <div key={habit.id}
                    className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-[#161820] transition-colors"
                    style={{ borderBottom: '1px solid #1a1c28' }}
                    onClick={() => navigate(`/habitos/${habit.id}`)}>
                    <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: catColor }} />
                    <span className="text-sm text-white flex-1 truncate">{habit.name}</span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={e => e.stopPropagation()} className="w-6 h-6 rounded text-[9px] font-bold"
                        style={{ background: minDone ? catColor : '#1a1c28', color: minDone ? 'white' : '#374151', border: `1px solid ${minDone ? catColor : '#2a2d3a'}` }}>
                        M
                      </button>
                      <button onClick={e => e.stopPropagation()} className="w-6 h-6 rounded text-[9px] font-bold"
                        style={{ background: maxDone ? catColor : '#1a1c28', color: maxDone ? 'white' : '#374151', border: `1px solid ${maxDone ? catColor : '#2a2d3a'}` }}>
                        X
                      </button>
                    </div>
                    <span className="text-xs font-mono w-5 text-right shrink-0" style={{ color: '#4b5563' }}>
                      {habit.logs.length}
                    </span>
                    <div className="flex gap-0.5 shrink-0">
                      {last7.map((level, i) => (
                        <span key={i} className="w-2 h-2 rounded-full"
                          style={{ background: level === 'max' ? catColor : level === 'min' ? `${catColor}66` : '#1f2333' }} />
                      ))}
                    </div>
                    {hours !== null && hours <= 24 && (
                      <span className="text-[10px] shrink-0" style={{ color: '#ef4444' }}>{Math.floor(hours)}h</span>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* 900S Reciente */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#111218', border: '1px solid #1a1c28' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1a1c28' }}>
              <h3 className="text-sm font-semibold text-white">900S Reciente</h3>
              <button onClick={() => navigate('/900s')} className="text-xs hover:text-white transition-colors" style={{ color: '#374151' }}>Ver →</button>
            </div>
            {recentSnaps.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm" style={{ color: '#374151' }}>Sin registros hoy</p>
              </div>
            ) : (
              recentSnaps.map(snap => (
                <div key={snap.id} className="flex items-start gap-2.5 px-5 py-3" style={{ borderBottom: '1px solid #1a1c28' }}>
                  <span className="text-[10px] font-mono w-9 shrink-0 pt-0.5" style={{ color: '#374151' }}>
                    {format(new Date(snap.timestamp), 'HH:mm')}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                    style={{ background: CAT_COLORS[snap.category] || '#374151' }} />
                  <span className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{snap.activity}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
