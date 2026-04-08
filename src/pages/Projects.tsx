import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Kanban, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useProjectsStore } from '../store'
import type { ProjectStatus } from '../types'
import { Modal } from '../components/ui/Modal'
import { Field, Input, Select } from '../components/ui/FormFields'

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  active:    { label: 'En progreso', color: '#22c55e', bg: '#0f1a10' },
  paused:    { label: 'Pausado',     color: '#64748b', bg: '#1c1f28' },
  pending:   { label: 'Pendiente',   color: '#6366f1', bg: '#1a1b2e' },
  completed: { label: 'Completado',  color: '#22c55e', bg: '#0f1a10' },
}

function NewProjectModal({ onClose }: { onClose: () => void }) {
  const { addProject } = useProjectsStore()
  const [name, setName]           = useState('')
  const [status, setStatus]       = useState<ProjectStatus>('active')
  const [stageText, setStageText] = useState('')
  const [stages, setStages]       = useState<string[]>([])

  const addStage = () => {
    if (!stageText.trim()) return
    setStages(s => [...s, stageText.trim()])
    setStageText('')
  }

  const save = () => {
    if (!name.trim()) return
    const now = new Date().toISOString()
    addProject({
      id: crypto.randomUUID(), name: name.trim(),
      status, urgency: 2,
      startDate: now.split('T')[0],
      stages: stages.map((s, i) => ({
        id: crypto.randomUUID(), number: String(i + 1), name: s,
        description: '', status: 'pending', subTasks: [],
      })),
      notes: [], subProjectIds: [], createdAt: now,
    })
    onClose()
  }

  return (
    <Modal title="Nuevo Proyecto" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Field label="Nombre del proyecto">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Rediseño del Portfolio" autoFocus />
        </Field>
        <Field label="Estado inicial">
          <Select value={status} onChange={e => setStatus(e.target.value as ProjectStatus)}>
            <option value="active">En progreso</option>
            <option value="pending">Pendiente</option>
            <option value="paused">Pausado</option>
          </Select>
        </Field>
        <Field label="Etapas">
          <div className="flex gap-2">
            <input value={stageText} onChange={e => setStageText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addStage()}
              placeholder="Nombre de etapa y presionar Enter"
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none text-white placeholder-[#374151]"
              style={{ background: '#1a1c28', border: '1px solid #2a2d3a' }} />
            <button onClick={addStage} className="px-3 py-2 rounded-lg text-xs" style={{ background: '#1f2333', color: '#94a3b8' }}>+</button>
          </div>
          {stages.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              {stages.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded"
                  style={{ background: '#1a1c28', color: '#94a3b8' }}>
                  <span className="shrink-0" style={{ color: '#374151' }}>{i + 1}.</span>
                  <span className="flex-1">{s}</span>
                  <button onClick={() => setStages(ss => ss.filter((_, j) => j !== i))} style={{ color: '#ef4444' }}>×</button>
                </div>
              ))}
            </div>
          )}
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ background: '#1a1c28', color: '#64748b' }}>
            Cancelar
          </button>
          <button onClick={save} disabled={!name.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40"
            style={{ background: '#22c55e' }}>
            Crear proyecto
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function Projects() {
  const navigate = useNavigate()
  const { projects } = useProjectsStore()
  const [showNew, setShowNew] = useState(false)

  const inProgressCount = projects.filter(p => p.status === 'active').length

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#0d0e14' }}>
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid #1a1c28' }}>
        <h1 className="text-base font-semibold text-white">Proyectos</h1>
        {inProgressCount > 0 && (
          <span className="px-2 py-0.5 rounded text-xs font-semibold"
            style={{ background: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e33' }}>
            {inProgressCount} en progreso
          </span>
        )}
        <div className="flex-1" />
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ background: '#22c55e' }}>
          <Plus size={12} />
          Nuevo proyecto
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Kanban size={32} style={{ color: '#1a1c28' }} className="mb-4" />
          <p className="text-sm mb-2" style={{ color: '#374151' }}>Sin proyectos todavía</p>
          <button onClick={() => setShowNew(true)} className="text-xs underline" style={{ color: '#22c55e' }}>
            Crear el primero
          </button>
        </div>
      ) : (
        <div className="p-5 grid grid-cols-2 gap-4">
          {projects.map(proj => {
            const cfg = STATUS_CONFIG[proj.status]
            const completedStages = proj.stages.filter(s => s.status === 'completed').length
            const totalStages = proj.stages.length
            const pct = totalStages > 0 ? (completedStages / totalStages) * 100 : 0
            const currentStage = proj.stages.find(s => s.status === 'in_progress') || proj.stages[0]
            const createdAgo = formatDistanceToNow(new Date(proj.createdAt), { locale: es, addSuffix: true })

            return (
              <div key={proj.id}
                className="rounded-xl p-5 cursor-pointer transition-colors hover:border-[#2a2d3a]"
                style={{ background: '#111218', border: '1px solid #1a1c28' }}
                onClick={() => navigate(`/proyectos/${proj.id}`)}>
                <div className="flex items-start gap-3 mb-3">
                  <Kanban size={13} style={{ color: cfg.color, marginTop: 2, flexShrink: 0 }} />
                  <h3 className="text-sm font-semibold text-white flex-1 leading-tight">{proj.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium shrink-0"
                    style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs mb-3" style={{ color: '#4b5563' }}>
                  {currentStage ? `Etapa actual: ${currentStage.name}` : 'Sin etapas'}
                </p>
                <div className="h-0.5 rounded-full mb-3" style={{ background: '#1a1c28' }}>
                  <div className="h-0.5 rounded-full" style={{ width: `${pct}%`, background: cfg.color }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: '#374151' }}>{completedStages}/{totalStages}</span>
                  <div className="flex items-center gap-1">
                    <Clock size={9} style={{ color: '#374151' }} />
                    <span className="text-[10px]" style={{ color: '#374151' }}>Creado {createdAgo}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showNew && <NewProjectModal onClose={() => setShowNew(false)} />}
    </div>
  )
}
