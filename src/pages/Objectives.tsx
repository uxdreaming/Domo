import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Target } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useObjectivesStore } from '../store'
import type { ObjectiveTask } from '../types'
import { Modal } from '../components/ui/Modal'
import { Field, Input, Select } from '../components/ui/FormFields'

type Priority = 'alta' | 'media' | 'baja'

const STATUS_LABELS = { pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completado' }
const STATUS_COLORS = { pending: '#6366f1', in_progress: '#f59e0b', completed: '#22c55e' }
const STATUS_BG    = { pending: '#1a1b2e',  in_progress: '#1a1810',  completed: '#0f1a10' }

function NewObjectiveModal({ onClose }: { onClose: () => void }) {
  const { addObjective } = useObjectivesStore()
  const [name, setName]         = useState('')
  const [dueDate, setDueDate]   = useState('')
  const [priority, setPriority] = useState<Priority>('media')
  const [category, setCategory] = useState('')
  const [taskText, setTaskText] = useState('')
  const [tasks, setTasks]       = useState<string[]>([])

  const addTask = () => {
    if (!taskText.trim()) return
    setTasks(t => [...t, taskText.trim()])
    setTaskText('')
  }

  const save = () => {
    if (!name.trim() || !dueDate) return
    const now = new Date().toISOString()
    const objTasks: ObjectiveTask[] = tasks.map((text, i) => ({
      id: crypto.randomUUID(), text, status: 'pending', order: i + 1,
    }))
    addObjective({
      id: crypto.randomUUID(), name: name.trim(),
      status: 'in_progress', priority,
      dueDate, category: category.trim() || '',
      tasks: objTasks, createdAt: now, urgency: 2,
    })
    onClose()
  }

  return (
    <Modal title="Nuevo Objetivo" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field label="Nombre">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Preparar certificación AWS" autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Fecha límite">
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none text-white"
              style={{ background: '#1a1c28', border: '1px solid #2a2d3a' }} />
          </Field>
          <Field label="Prioridad">
            <Select value={priority} onChange={e => setPriority(e.target.value as Priority)}>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </Select>
          </Field>
        </div>
        <Field label="Categoría (opcional)">
          <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Ej: Certificaciones" />
        </Field>
        <Field label="Tareas">
          <div className="flex gap-2">
            <input value={taskText} onChange={e => setTaskText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Agregar tarea y presionar Enter"
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none text-white placeholder-[#374151]"
              style={{ background: '#1a1c28', border: '1px solid #2a2d3a' }} />
            <button onClick={addTask} className="px-3 py-2 rounded-lg text-xs" style={{ background: '#1f2333', color: '#94a3b8' }}>+</button>
          </div>
          {tasks.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              {tasks.map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded"
                  style={{ background: '#1a1c28', color: '#94a3b8' }}>
                  <span className="w-4 text-right shrink-0" style={{ color: '#374151' }}>{i + 1}.</span>
                  <span className="flex-1">{t}</span>
                  <button onClick={() => setTasks(ts => ts.filter((_, j) => j !== i))} style={{ color: '#ef4444' }}>×</button>
                </div>
              ))}
            </div>
          )}
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ background: '#1a1c28', color: '#64748b' }}>
            Cancelar
          </button>
          <button onClick={save} disabled={!name.trim() || !dueDate}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40"
            style={{ background: '#eab308' }}>
            Crear objetivo
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function Objectives() {
  const navigate = useNavigate()
  const { objectives } = useObjectivesStore()
  const [showNew, setShowNew] = useState(false)

  const active    = objectives.filter(o => o.status !== 'completed')
  const completed = objectives.filter(o => o.status === 'completed')
  const all = [...active, ...completed]

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#0d0e14' }}>
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid #1a1c28' }}>
        <h1 className="text-base font-semibold text-white">Objetivos</h1>
        {active.length > 0 && (
          <span className="px-2 py-0.5 rounded text-xs font-semibold"
            style={{ background: '#eab30822', color: '#eab308', border: '1px solid #eab30833' }}>
            {active.length} activos
          </span>
        )}
        <div className="flex-1" />
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ background: '#eab308' }}>
          <Plus size={12} />
          Nuevo objetivo
        </button>
      </div>

      {all.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Target size={32} style={{ color: '#1a1c28' }} className="mb-4" />
          <p className="text-sm mb-2" style={{ color: '#374151' }}>Sin objetivos todavía</p>
          <button onClick={() => setShowNew(true)} className="text-xs underline" style={{ color: '#eab308' }}>
            Crear el primero
          </button>
        </div>
      ) : (
        all.map(obj => {
          const total = obj.tasks.length
          const done  = obj.tasks.filter(t => t.status === 'completed').length
          const pct   = total > 0 ? (done / total) * 100 : 0
          const statusColor = STATUS_COLORS[obj.status]
          const statusBg    = STATUS_BG[obj.status]

          return (
            <div key={obj.id}
              className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#111218] transition-colors"
              style={{ borderBottom: '1px solid #1a1c28' }}
              onClick={() => navigate(`/objetivos/${obj.id}`)}>
              <span className="text-sm font-medium text-white w-56 shrink-0 truncate">{obj.name}</span>
              <div className="flex-1 mx-2">
                <div className="h-0.5 rounded-full" style={{ background: '#1a1c28' }}>
                  <div className="h-0.5 rounded-full transition-all" style={{ width: `${pct}%`, background: statusColor }} />
                </div>
              </div>
              <span className="text-xs font-mono shrink-0" style={{ color: '#4b5563' }}>{done}/{total}</span>
              <span className="text-xs shrink-0" style={{ color: '#374151' }}>
                {format(parseISO(obj.dueDate), 'd MMM yyyy', { locale: es })}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium shrink-0"
                style={{ background: statusBg, color: statusColor, border: `1px solid ${statusColor}33` }}>
                {STATUS_LABELS[obj.status]}
              </span>
            </div>
          )
        })
      )}

      {showNew && <NewObjectiveModal onClose={() => setShowNew(false)} />}
    </div>
  )
}
