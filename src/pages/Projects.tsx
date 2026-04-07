import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Upload, Clock, FolderKanban } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useProjectsStore } from '../store'
import type { Project, ProjectStatus } from '../types'
import { Modal } from '../components/ui/Modal'
import { Field, Input, Select } from '../components/ui/FormFields'

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string; border: string }> = {
  active:    { label: 'En progreso', color: '#22c55e', bg: '#0f1a10',  border: '#22c55e44' },
  paused:    { label: 'Pausado',     color: '#64748b', bg: '#1c1f28',  border: '#64748b44' },
  pending:   { label: 'Pendiente',   color: '#6366f1', bg: '#1a1b2e',  border: '#6366f144' },
  completed: { label: 'Completado',  color: '#22c55e', bg: '#0f1a10',  border: '#22c55e44' },
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const status      = STATUS_CONFIG[project.status]
  const totalStages = project.stages.length
  const doneStages  = project.stages.filter(s => s.status === 'completed').length
  const currentStage = project.stages.find(s => s.status === 'in_progress')
  const pct = totalStages > 0 ? (doneStages / totalStages) * 100 : 0

  const lastActivity = project.notes.length > 0
    ? [...project.notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
    : project.createdAt

  const timeAgo = formatDistanceToNow(new Date(lastActivity), { locale: es, addSuffix: true })

  return (
    <div
      className="rounded-xl p-6 cursor-pointer hover:border-[#2a2f40] transition-all"
      style={{ background: '#161820', border: '1px solid #1f2333' }}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 mb-4">
        <FolderKanban size={16} style={{ color: '#22c55e', marginTop: 2, flexShrink: 0 }} />
        <h3 className="text-sm font-semibold text-white leading-tight">{project.name}</h3>
      </div>

      <div className="mb-4">
        <span className="px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
          {status.label}
        </span>
      </div>

      {currentStage && (
        <p className="text-xs mb-4" style={{ color: '#64748b' }}>
          Etapa actual: {currentStage.name}
        </p>
      )}
      {!currentStage && project.status === 'pending' && (
        <p className="text-xs mb-4" style={{ color: '#374151' }}>
          Sin iniciar · {totalStages} etapas planificadas
        </p>
      )}

      <div className="mb-3">
        <div className="h-1 rounded-full mb-2" style={{ background: '#1f2333' }}>
          <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: '#22c55e' }} />
        </div>
        <span className="text-xs font-mono" style={{ color: '#374151' }}>{doneStages}/{totalStages}</span>
      </div>

      <div className="flex items-center gap-1.5 mt-4">
        <Clock size={11} style={{ color: '#374151' }} />
        <span className="text-[11px]" style={{ color: '#374151' }}>
          {project.status === 'pending' ? `Creado ${timeAgo}` : `Actualizado ${timeAgo}`}
        </span>
      </div>
    </div>
  )
}

function NewProjectModal({ onClose }: { onClose: () => void }) {
  const { addProject } = useProjectsStore()
  const [name, setName]               = useState('')
  const [status, setStatus]           = useState<ProjectStatus>('active')
  const [startDate, setStartDate]     = useState(new Date().toISOString().split('T')[0])
  const [projectedEnd, setProjectedEnd] = useState('')
  const [stages, setStages]           = useState<string[]>([''])

  const addStage   = () => setStages(s => [...s, ''])
  const setStage   = (i: number, v: string) => setStages(s => s.map((x, j) => j === i ? v : x))
  const removeStage = (i: number) => setStages(s => s.filter((_, j) => j !== i))

  const handleSave = () => {
    if (!name.trim()) return
    addProject({
      id: crypto.randomUUID(),
      name: name.trim(),
      status,
      startDate,
      projectedEndDate: projectedEnd || undefined,
      stages: stages
        .filter(s => s.trim())
        .map((stageName, i) => ({
          id: crypto.randomUUID(),
          number: String(i + 1),
          name: stageName.trim(),
          description: '',
          status: i === 0 ? 'in_progress' : 'pending',
          subTasks: [],
        })),
      notes: [],
      subProjectIds: [],
      urgency: 7,
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <Modal title="Nuevo proyecto" onClose={onClose} width="560px">
      <div className="flex flex-col gap-5 p-6">
        <Field label="Nombre">
          <Input placeholder="ej. Rediseño del Portfolio" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Estado inicial">
            <Select value={status} onChange={e => setStatus(e.target.value as ProjectStatus)}>
              <option value="active">En progreso</option>
              <option value="pending">Pendiente</option>
              <option value="paused">Pausado</option>
            </Select>
          </Field>
          <Field label="Fecha de inicio">
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </Field>
        </div>

        <Field label="Proyección de fin" hint="Opcional">
          <Input type="date" value={projectedEnd} onChange={e => setProjectedEnd(e.target.value)} />
        </Field>

        <Field label="Etapas" hint="Podés editar y agregar más después">
          <div className="flex flex-col gap-2">
            {stages.map((stage, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs font-mono w-5 text-right shrink-0" style={{ color: '#374151' }}>{i + 1}.</span>
                <Input
                  placeholder={`Etapa ${i + 1}`}
                  value={stage}
                  onChange={e => setStage(i, e.target.value)}
                />
                {stages.length > 1 && (
                  <button onClick={() => removeStage(i)} className="text-xs px-2 py-1 shrink-0" style={{ color: '#374151' }}>✕</button>
                )}
              </div>
            ))}
            <button onClick={addStage} className="text-xs text-left px-5 py-2 rounded-lg hover:bg-[#1c1f28]" style={{ color: '#22c55e' }}>
              + Agregar etapa
            </button>
          </div>
        </Field>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium" style={{ background: '#1c1f28', color: '#64748b', border: '1px solid #1f2333' }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={!name.trim()} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-40" style={{ background: '#22c55e' }}>
            Crear proyecto
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function Projects() {
  const { projects } = useProjectsStore()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)

  const sorted = [...projects].sort((a, b) => {
    const o = { active: 0, paused: 1, pending: 2, completed: 3 }
    return o[a.status] - o[b.status]
  })

  return (
    <div className="p-10 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">Proyectos</h1>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e33' }}>
            {projects.filter(p => p.status === 'active').length} proyectos
          </span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: '#161820', color: '#64748b', border: '1px solid #1f2333' }}>
            <Upload size={14} />
            Import Roadmap
          </button>
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: '#22c55e' }}>
            <Plus size={14} />
            Nuevo proyecto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {sorted.map(project => (
          <ProjectCard key={project.id} project={project} onClick={() => navigate(`/proyectos/${project.id}`)} />
        ))}
        {projects.length === 0 && (
          <div className="col-span-2 py-20 text-center">
            <p className="text-sm mb-2" style={{ color: '#374151' }}>Sin proyectos todavía</p>
            <button onClick={() => setShowNew(true)} className="text-xs underline" style={{ color: '#22c55e' }}>
              Crear el primero
            </button>
          </div>
        )}
      </div>

      {showNew && <NewProjectModal onClose={() => setShowNew(false)} />}
    </div>
  )
}
