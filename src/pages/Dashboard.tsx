import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Flame, Timer, FolderKanban, Target } from 'lucide-react'
import { useHabitsStore, useS900Store, useProjectsStore, useObjectivesStore, useAppStore } from '../store'
import { getHoursUntilStreakBreak, isStreakActive, isTodayDone } from '../utils/streak'
import { useNavigate } from 'react-router-dom'

const today = new Date().toISOString().split('T')[0]

const categoryColor: Record<string, string> = {
  programacion: '#22c55e',
  lectura: '#6366f1',
  ejercicio: '#f59e0b',
  escritura: '#a855f7',
  descanso: '#64748b',
  social: '#38bdf8',
  deep_rest: '#f59e0b',
  ausente: '#1f2333',
  otro: '#374151',
}

function HabitCheckbox({ level, done, onClick }: { level: 'Min' | 'Max'; done: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-[26px] h-[26px] rounded transition-all"
      style={{
        background: done ? '#6366f1' : 'transparent',
        border: `1px solid ${done ? '#6366f1' : '#2a2f40'}`,
      }}
      title={level}
    >
      {done && <span className="text-white text-[11px]">✓</span>}
    </button>
  )
}

function CountdownClock({ hours }: { hours: number | null }) {
  if (hours === null) return null
  if (hours <= 0) return <span className="text-[11px] font-mono text-[#ef4444]">vencido</span>
  const h = Math.floor(hours)
  const m = Math.floor((hours - h) * 60)
  const urgent = hours <= 6
  return (
    <span className={`text-[11px] font-mono ${urgent ? 'text-[#ef4444]' : 'text-[#374151]'}`}>
      {h}h {m}m
    </span>
  )
}

export function Dashboard() {
  const { habits, logHabit, removeLog } = useHabitsStore()
  const { snapshots } = useS900Store()
  const { projects } = useProjectsStore()
  const { objectives } = useObjectivesStore()
  const { settings } = useAppStore()
  const navigate = useNavigate()

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Buenos días' : now.getHours() < 19 ? 'Buenas tardes' : 'Buenas noches'
  const dateLabel = format(now, "EEEE, d 'de' MMMM yyyy", { locale: es })
  const dateCapitalized = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)

  const activeStreaks = habits.filter(h => isStreakActive(h) && !h.archived).length
  const todaySnapshots = snapshots.filter(s => s.timestamp.startsWith(today))
  const totalSnapsToday = Math.max(Math.floor((now.getHours() * 60 + now.getMinutes()) / 15), 1)
  const activeProjects = projects.filter(p => p.status === 'active').length
  const plannedProjects = projects.filter(p => p.status === 'pending').length
  const allObjTasks = objectives.flatMap(o => o.tasks)
  const completedObjTasks = allObjTasks.filter(t => t.status === 'completed').length
  const objProgress = allObjTasks.length > 0 ? Math.round((completedObjTasks / allObjTasks.length) * 100) : 0

  const urgentHabits = habits
    .filter(h => !h.archived)
    .map(h => ({ habit: h, hours: getHoursUntilStreakBreak(h), done: isTodayDone(h) }))
    .filter(({ hours, done }) => hours !== null && hours <= 24 && !done)
    .sort((a, b) => (a.hours ?? 999) - (b.hours ?? 999))

  const handleToggle = (habitId: string, level: 'min' | 'max', currentLevel?: 'min' | 'max') => {
    if (currentLevel === level) {
      removeLog(habitId, today)
    } else {
      logHabit(habitId, { date: today, level, timestamp: new Date().toISOString() })
    }
  }

  // 900S mini bar chart
  const s900Blocks = Array.from({ length: Math.min(totalSnapsToday, 20) }, (_, i) => {
    const snap = todaySnapshots[i]
    return snap?.category
  })

  const activeHabits = habits.filter(h => !h.archived)
  const todayDone = activeHabits.filter(h => isTodayDone(h)).length

  return (
    <div className="p-10 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold text-white leading-tight">
          {greeting}, {settings.userName}
        </h1>
        <p className="text-sm mt-1.5" style={{ color: '#64748b' }}>{dateCapitalized}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-5 mb-10">
        {/* Rachas activas */}
        <div
          className="rounded-xl p-6 cursor-pointer transition-colors hover:border-[#6366f144]"
          style={{ background: '#161820', border: '1px solid #1f2333' }}
          onClick={() => navigate('/habitos')}
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame size={14} style={{ color: '#6366f1' }} />
            <span className="text-xs" style={{ color: '#64748b' }}>Rachas Activas</span>
          </div>
          <p className="text-[40px] font-bold text-white leading-none mb-2">{activeStreaks}</p>
          <p className="text-xs" style={{ color: '#374151' }}>hábitos con racha activa</p>
        </div>

        {/* 900S hoy */}
        <div
          className="rounded-xl p-6 cursor-pointer transition-colors hover:border-[#ef444444]"
          style={{ background: '#161820', border: '1px solid #1f2333' }}
          onClick={() => navigate('/900s')}
        >
          <div className="flex items-center gap-2 mb-4">
            <Timer size={14} style={{ color: '#ef4444' }} />
            <span className="text-xs" style={{ color: '#64748b' }}>900S Hoy</span>
          </div>
          <div className="flex items-end gap-0.5 mb-3 h-8">
            {s900Blocks.map((cat, i) => (
              <div
                key={i}
                className="w-3 rounded-sm"
                style={{
                  background: categoryColor[cat || 'ausente'] || '#1f2333',
                  height: cat && cat !== 'ausente' ? '100%' : '40%',
                }}
              />
            ))}
          </div>
          <p className="text-xs" style={{ color: '#374151' }}>
            {todaySnapshots.length} registros · {Math.round(todaySnapshots.length * 0.25)}h registradas
          </p>
        </div>

        {/* Proyectos activos */}
        <div
          className="rounded-xl p-6 cursor-pointer transition-colors hover:border-[#22c55e44]"
          style={{ background: '#161820', border: '1px solid #1f2333' }}
          onClick={() => navigate('/proyectos')}
        >
          <div className="flex items-center gap-2 mb-4">
            <FolderKanban size={14} style={{ color: '#22c55e' }} />
            <span className="text-xs" style={{ color: '#64748b' }}>Proyectos Activos</span>
          </div>
          <p className="text-[40px] font-bold text-white leading-none mb-2">{activeProjects}</p>
          <p className="text-xs" style={{ color: '#374151' }}>
            {activeProjects} en progreso · {plannedProjects} planificados
          </p>
        </div>

        {/* Objetivos */}
        <div
          className="rounded-xl p-6 cursor-pointer transition-colors hover:border-[#f59e0b44]"
          style={{ background: '#161820', border: '1px solid #1f2333' }}
          onClick={() => navigate('/objetivos')}
        >
          <div className="flex items-center gap-2 mb-4">
            <Target size={14} style={{ color: '#f59e0b' }} />
            <span className="text-xs" style={{ color: '#64748b' }}>Objetivos</span>
          </div>
          <p className="text-[40px] font-bold leading-none mb-3" style={{ color: '#f59e0b' }}>
            {objProgress}%
          </p>
          <div className="h-1.5 rounded-full mb-2" style={{ background: '#1f2333' }}>
            <div className="h-1.5 rounded-full" style={{ width: `${objProgress}%`, background: '#f59e0b' }} />
          </div>
          <p className="text-xs" style={{ color: '#374151' }}>progreso promedio</p>
        </div>
      </div>

      {/* Urgency alert */}
      {urgentHabits.length > 0 && (
        <div className="mb-6 rounded-xl px-5 py-4" style={{ background: '#1a1015', border: '1px solid #ef444433' }}>
          <p className="text-xs font-semibold mb-2.5" style={{ color: '#ef4444' }}>
            Rachas en riesgo hoy
          </p>
          <div className="flex flex-wrap gap-2">
            {urgentHabits.map(({ habit, hours }) => (
              <button
                key={habit.id}
                onClick={() => navigate(`/habitos/${habit.id}`)}
                className="px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{ background: '#1f1318', color: '#ef4444', border: '1px solid #ef444422' }}
              >
                {habit.name}
                {hours !== null && <span className="font-mono ml-1.5 opacity-70">{Math.floor(hours)}h</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Hábitos de Hoy */}
        <div className="rounded-xl" style={{ background: '#161820', border: '1px solid #1f2333' }}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1f2333]">
            <h2 className="text-sm font-semibold text-white">Hábitos de Hoy</h2>
            <span className="text-xs" style={{ color: '#64748b' }}>
              {todayDone}/{activeHabits.length} completados
            </span>
          </div>

          <div>
            {activeHabits.map(habit => {
              const todayLog = habit.logs.find(l => l.date === today)
              const hours = getHoursUntilStreakBreak(habit)
              const isUrgent = hours !== null && hours <= 24 && !todayLog
              return (
                <div
                  key={habit.id}
                  className="flex items-center gap-4 px-6 py-4 border-b border-[#1f2333] last:border-0 hover:bg-[#1c1f28] cursor-pointer transition-colors"
                  onClick={() => navigate(`/habitos/${habit.id}`)}
                >
                  <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                    <HabitCheckbox
                      level="Min"
                      done={todayLog?.level === 'min'}
                      onClick={() => handleToggle(habit.id, 'min', todayLog?.level)}
                    />
                    <HabitCheckbox
                      level="Max"
                      done={todayLog?.level === 'max'}
                      onClick={() => handleToggle(habit.id, 'max', todayLog?.level)}
                    />
                  </div>

                  <span className={`flex-1 text-sm ${todayLog ? 'text-[#374151] line-through' : isUrgent ? 'text-[#ef4444]' : 'text-white'}`}>
                    {habit.name}
                  </span>

                  <div className="flex items-center gap-3 shrink-0">
                    <CountdownClock hours={todayLog ? null : hours} />
                    <div className="flex items-center gap-1">
                      <Flame size={12} style={{ color: '#f59e0b' }} />
                      <span className="text-xs font-mono text-white">{habit.logs.length}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 900S Reciente */}
        <div className="rounded-xl" style={{ background: '#161820', border: '1px solid #1f2333' }}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1f2333]">
            <h2 className="text-sm font-semibold text-white">900S Reciente</h2>
            <button
              onClick={() => navigate('/900s')}
              className="text-xs transition-colors hover:text-white"
              style={{ color: '#64748b' }}
            >
              Hoy
            </button>
          </div>

          <div>
            {[...todaySnapshots]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 12)
              .map(snap => (
                <div
                  key={snap.id}
                  className="flex items-center gap-4 px-6 py-3.5 border-b border-[#1f2333] last:border-0"
                >
                  <span className="text-xs font-mono w-10 shrink-0" style={{ color: '#374151' }}>
                    {format(new Date(snap.timestamp), 'HH:mm')}
                  </span>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: categoryColor[snap.category] || '#374151' }} />
                  <span className="text-sm text-white truncate">{snap.activity}</span>
                </div>
              ))}
            {todaySnapshots.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm" style={{ color: '#374151' }}>Sin registros hoy</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
