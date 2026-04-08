import React from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Flame } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useObjectivesStore, useHabitsStore } from '../store'
import type { ObjectiveTask } from '../types'

const STATUS_ICONS: Record<ObjectiveTask['status'], React.ReactElement> = {
  completed:   <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#22c55e', border: '2px solid #22c55e' }}><span className="text-white text-[10px]">✓</span></div>,
  in_progress: <div className="w-5 h-5 rounded-full shrink-0" style={{ background: '#f59e0b', border: '2px solid #f59e0b' }} />,
  pending:     <div className="w-5 h-5 rounded-full shrink-0" style={{ border: '2px solid #374151' }} />,
}

const PRIORITY_CONFIG = {
  alta:  { color: '#f59e0b', label: 'Alta' },
  media: { color: '#6366f1', label: 'Media' },
  baja:  { color: '#64748b', label: 'Baja' },
}

export function ObjectiveDetail() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const { objectives, updateTask, updateObjective } = useObjectivesStore()
  const { habits } = useHabitsStore()
  const [newTask, setNewTask] = useState('')
  const objective  = objectives.find(o => o.id === id)

  if (!objective) return (
    <div className="p-10 text-center" style={{ color: '#64748b' }}>
      Objetivo no encontrado.{' '}
      <button onClick={() => navigate('/objetivos')} className="underline">Volver</button>
    </div>
  )

  const total       = objective.tasks.length
  const done        = objective.tasks.filter(t => t.status === 'completed').length
  const pct         = total > 0 ? Math.round((done / total) * 100) : 0
  const linkedHabit = objective.linkedHabitId ? habits.find(h => h.id === objective.linkedHabitId) : null
  const priority    = PRIORITY_CONFIG[objective.priority]

  const cycleStatus = (task: ObjectiveTask) => {
    const next: Record<ObjectiveTask['status'], ObjectiveTask['status']> = {
      pending: 'in_progress', in_progress: 'completed', completed: 'pending',
    }
    updateTask(objective.id, task.id, { status: next[task.status] })
  }

  const handleAddTask = () => {
    if (!newTask.trim()) return
    const task: ObjectiveTask = {
      id: crypto.randomUUID(),
      text: newTask.trim(),
      status: 'pending',
      order: objective.tasks.length + 1,
    }
    updateObjective(objective.id, { tasks: [...objective.tasks, task] })
    setNewTask('')
  }

  const statusLabel = { pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completado' }[objective.status]
  const statusColor = { pending: '#64748b',   in_progress: '#f59e0b',     completed: '#22c55e' }[objective.status]
  const statusBg    = { pending: '#1c1f28',   in_progress: '#1a1810',     completed: '#0f1a10' }[objective.status]

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ background: '#0d0e14' }}>
      <button onClick={() => navigate('/objetivos')} className="flex items-center gap-2 text-sm mb-8 hover:text-white transition-colors" style={{ color: '#64748b' }}>
        <ArrowLeft size={14} />
        Objetivos
      </button>

      <div className="flex gap-8">
        {/* Main */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-white mb-4">{objective.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: statusBg, color: statusColor, border: `1px solid ${statusColor}44` }}>
              {statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-6 mb-5 text-xs" style={{ color: '#64748b' }}>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              Fecha límite: {format(parseISO(objective.dueDate), "d 'de' MMMM yyyy", { locale: es })}
            </div>
            <span>{done} de {total} tareas completadas</span>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="h-1.5 rounded-full" style={{ background: '#1f2333' }}>
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: '#f59e0b' }} />
            </div>
          </div>

          {/* Tasks */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#161820', border: '1px solid #1f2333' }}>
            {[...objective.tasks].sort((a, b) => a.order - b.order).map((task, i) => (
              <div
                key={task.id}
                className="flex items-center gap-4 px-6 py-4 border-b border-[#1f2333] last:border-0 hover:bg-[#1c1f28] cursor-pointer transition-colors"
                onClick={() => cycleStatus(task)}
              >
                <span className="text-xs font-mono w-5 shrink-0 text-right" style={{ color: '#374151' }}>{i + 1}.</span>
                {STATUS_ICONS[task.status]}
                <span className={`text-sm flex-1 ${task.status === 'completed' ? 'line-through text-[#374151]' : 'text-white'}`}>
                  {task.text}
                </span>
                {task.status === 'in_progress' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#1a1810', color: '#f59e0b', border: '1px solid #f59e0b33' }}>
                    En progreso
                  </span>
                )}
              </div>
            ))}

            {/* Add task inline */}
            <div className="flex items-center gap-4 px-6 py-3.5 border-t border-[#1f2333]">
              <span className="text-xs font-mono w-5 shrink-0 text-right" style={{ color: '#374151' }}>{total + 1}.</span>
              <div className="w-5 h-5 rounded-full shrink-0" style={{ border: '2px dashed #2a2f40' }} />
              <input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                placeholder="Nueva tarea…"
                className="flex-1 text-sm bg-transparent outline-none placeholder-[#374151] text-white"
              />
              {newTask.trim() && (
                <button onClick={handleAddTask} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: '#f59e0b22', color: '#f59e0b' }}>
                  Agregar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-52 shrink-0">
          <div className="rounded-xl p-5 sticky top-10" style={{ background: '#161820', border: '1px solid #1f2333' }}>
            <h3 className="text-xs font-semibold text-white mb-5">Detalles</h3>
            <div className="flex flex-col gap-4 text-xs">
              <div>
                <p className="mb-1" style={{ color: '#374151' }}>Creado</p>
                <p style={{ color: '#94a3b8' }}>{format(parseISO(objective.createdAt), 'd MMM yyyy', { locale: es })}</p>
              </div>
              {objective.category && (
                <div>
                  <p className="mb-1" style={{ color: '#374151' }}>Categoría</p>
                  <p style={{ color: '#94a3b8' }}>{objective.category}</p>
                </div>
              )}
              {linkedHabit && (
                <div>
                  <p className="mb-1" style={{ color: '#374151' }}>Hábito vinculado</p>
                  <div className="flex items-center gap-1.5">
                    <Flame size={10} style={{ color: '#6366f1' }} />
                    <span style={{ color: '#818cf8' }}>{linkedHabit.name}</span>
                  </div>
                </div>
              )}
              <div>
                <p className="mb-1" style={{ color: '#374151' }}>Prioridad</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: priority.color }} />
                  <span style={{ color: '#94a3b8' }}>{priority.label}</span>
                </div>
              </div>
              {objective.importedFrom && (
                <div>
                  <p className="mb-1" style={{ color: '#374151' }}>Importado</p>
                  <span className="px-2 py-1 rounded text-[10px]" style={{ background: '#1c1f28', color: '#64748b', border: '1px solid #1f2333' }}>
                    Generado via JSON · Claude AI
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
