import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Upload, Calendar } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useObjectivesStore } from '../store'
import type { Objective, Priority } from '../types'
import { Modal } from '../components/ui/Modal'
import { Field, Input, Select } from '../components/ui/FormFields'

const STATUS_CONFIG = {
  pending:     { label: 'Pendiente',   color: '#64748b', bg: '#1c1f28',  border: '#64748b33' },
  in_progress: { label: 'En progreso', color: '#f59e0b', bg: '#1a1810',  border: '#f59e0b33' },
  completed:   { label: 'Completado',  color: '#22c55e', bg: '#0f1a10',  border: '#22c55e33' },
}

function ProgressBar({ objective }: { objective: Objective }) {
  const total = objective.tasks.length
  const done  = objective.tasks.filter(t => t.status === 'completed').length
  const pct   = total > 0 ? (done / total) * 100 : 0
  const color = objective.status === 'completed' ? '#22c55e' : '#f59e0b'
  return (
    <div className="flex-1 h-1 rounded-full" style={{ background: '#1f2333' }}>
      <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

function NewObjectiveModal({ onClose }: { onClose: () => void }) {
  const { addObjective } = useObjectivesStore()
  const [name, setName]         = useState('')
  const [category, setCategory] = useState('Personal')
  const [dueDate, setDueDate]   = useState('')
  const [priority, setPriority] = useState<Priority>('media')
  const [tasks, setTasks]       = useState<string[]>([''])

  const addTask = () => setTasks(t => [...t, ''])
  const setTask = (i: number, v: string) => setTasks(t => t.map((x, j) => j === i ? v : x))
  const removeTask = (i: number) => setTasks(t => t.filter((_, j) => j !== i))

  const handleSave = () => {
    if (!name.trim()) return
    addObjective({
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      status: 'pending',
      dueDate: dueDate || new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0],
      tasks: tasks
        .filter(t => t.trim())
        .map((text, i) => ({ id: crypto.randomUUID(), text: text.trim(), status: 'pending', order: i + 1 })),
      priority,
      createdAt: new Date().toISOString(),
      urgency: 7,
    })
    onClose()
  }

  return (
    <Modal title="Nuevo objetivo" onClose={onClose} width="560px">
      <div className="flex flex-col gap-5 p-6">
        <Field label="Nombre">
          <Input placeholder="ej. Aprender a nadar" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoría">
            <Input placeholder="Personal, Trabajo…" value={category} onChange={e => setCategory(e.target.value)} />
          </Field>
          <Field label="Prioridad">
            <Select value={priority} onChange={e => setPriority(e.target.value as Priority)}>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </Select>
          </Field>
        </div>

        <Field label="Fecha límite">
          <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </Field>

        <Field label="Tareas" hint="Podés agregar más después">
          <div className="flex flex-col gap-2">
            {tasks.map((task, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs font-mono w-5 text-right shrink-0" style={{ color: '#374151' }}>{i + 1}.</span>
                <Input
                  placeholder={`Tarea ${i + 1}`}
                  value={task}
                  onChange={e => setTask(i, e.target.value)}
                />
                {tasks.length > 1 && (
                  <button onClick={() => removeTask(i)} className="text-xs px-2 py-1 shrink-0" style={{ color: '#374151' }}>✕</button>
                )}
              </div>
            ))}
            <button
              onClick={addTask}
              className="text-xs text-left px-5 py-2 rounded-lg transition-colors hover:bg-[#1c1f28]"
              style={{ color: '#6366f1' }}
            >
              + Agregar tarea
            </button>
          </div>
        </Field>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium" style={{ background: '#1c1f28', color: '#64748b', border: '1px solid #1f2333' }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={!name.trim()} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-40" style={{ background: '#f59e0b' }}>
            Crear objetivo
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function Objectives() {
  const { objectives } = useObjectivesStore()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)

  const sorted = [...objectives].sort((a, b) => {
    const o = { in_progress: 0, pending: 1, completed: 2 }
    return o[a.status] - o[b.status]
  })

  return (
    <div className="p-10 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">Objetivos</h1>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: '#f59e0b22', color: '#f59e0b', border: '1px solid #f59e0b33' }}>
            {objectives.filter(o => o.status !== 'completed').length} activos
          </span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: '#161820', color: '#64748b', border: '1px solid #1f2333' }}>
            <Upload size={14} />
            Import JSON
          </button>
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: '#f59e0b' }}>
            <Plus size={14} />
            Nuevo objetivo
          </button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#161820', border: '1px solid #1f2333' }}>
        {sorted.map(obj => {
          const total  = obj.tasks.length
          const done   = obj.tasks.filter(t => t.status === 'completed').length
          const status = STATUS_CONFIG[obj.status]
          return (
            <div
              key={obj.id}
              className="flex items-center gap-5 px-6 py-5 border-b border-[#1f2333] last:border-0 hover:bg-[#1c1f28] cursor-pointer transition-colors"
              onClick={() => navigate(`/objetivos/${obj.id}`)}
            >
              <span className="text-sm text-white font-medium w-52 shrink-0 truncate">{obj.name}</span>

              <ProgressBar objective={obj} />

              <span className="text-xs font-mono shrink-0" style={{ color: '#64748b' }}>
                {done}/{total}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <Calendar size={12} style={{ color: '#374151' }} />
                <span className="text-xs" style={{ color: '#64748b' }}>
                  {format(parseISO(obj.dueDate), 'd MMM yyyy', { locale: es })}
                </span>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs shrink-0"
                style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                {status.label}
              </span>
            </div>
          )
        })}
        {objectives.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm mb-2" style={{ color: '#374151' }}>Sin objetivos todavía</p>
            <button onClick={() => setShowNew(true)} className="text-xs underline" style={{ color: '#f59e0b' }}>
              Crear el primero
            </button>
          </div>
        )}
      </div>

      {showNew && <NewObjectiveModal onClose={() => setShowNew(false)} />}
    </div>
  )
}
