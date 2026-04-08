import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, GitBranch, Plus, CheckCircle2, Circle, Loader } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useProjectsStore } from '../store'
import type { ProjectStage } from '../types'

const STAGE_CONFIG = {
  completed:   { icon: CheckCircle2, color: '#22c55e', label: 'Completada' },
  in_progress: { icon: Loader,       color: '#f59e0b', label: 'En progreso' },
  pending:     { icon: Circle,       color: '#374151', label: 'Pendiente' },
}

function StageCard({ stage }: { stage: ProjectStage }) {
  const { icon: Icon, color } = STAGE_CONFIG[stage.status]
  return (
    <div className="rounded-xl p-4" style={{ background: '#1c1f28', border: `1px solid ${color}33` }}>
      <div className="flex items-start gap-2.5 mb-3">
        <Icon size={14} style={{ color, marginTop: 1, flexShrink: 0 }} />
        <div>
          <span className="text-[10px] font-mono" style={{ color: '#374151' }}>{stage.number}.</span>
          <h4 className="text-sm font-medium text-white leading-tight">{stage.name}</h4>
          {stage.description && (
            <p className="text-xs mt-1" style={{ color: '#64748b' }}>{stage.description}</p>
          )}
        </div>
      </div>

      {stage.status === 'in_progress' && stage.progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-[10px]" style={{ color: '#f59e0b' }}>En progreso · {stage.progress}%</span>
          </div>
          <div className="h-0.5 rounded-full" style={{ background: '#1f2333' }}>
            <div className="h-0.5 rounded-full" style={{ width: `${stage.progress}%`, background: '#f59e0b' }} />
          </div>
        </div>
      )}

      {stage.subTasks.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          {stage.subTasks.map(st => (
            <div key={st.id} className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0"
                style={{ border: `1px solid ${st.completed ? '#22c55e' : '#374151'}`, background: st.completed ? '#22c55e' : 'transparent' }}>
                {st.completed && <span className="text-white text-[8px]">✓</span>}
              </div>
              <span className={`text-xs ${st.completed ? 'line-through text-[#374151]' : 'text-[#94a3b8]'}`}>
                {st.text}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3">
        {stage.completedDate && (
          <span className="text-[10px]" style={{ color: '#22c55e' }}>
            Completada {format(parseISO(stage.completedDate), 'd MMM', { locale: es })}
          </span>
        )}
        {stage.estimatedDate && stage.status !== 'completed' && (
          <span className="text-[10px]" style={{ color: '#374151' }}>
            Estimado: {format(parseISO(stage.estimatedDate), 'MMM yyyy', { locale: es })}
          </span>
        )}
      </div>
    </div>
  )
}

export function ProjectDetail() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const { projects, addNote } = useProjectsStore()
  const [newNote, setNewNote] = useState('')
  const project    = projects.find(p => p.id === id)

  if (!project) return (
    <div className="p-10 text-center" style={{ color: '#64748b' }}>
      Proyecto no encontrado.{' '}
      <button onClick={() => navigate('/proyectos')} className="underline">Volver</button>
    </div>
  )

  const { label: statusLabel, color: statusColor } = {
    active:    { label: 'En progreso', color: '#22c55e' },
    paused:    { label: 'Pausado',     color: '#64748b' },
    pending:   { label: 'Pendiente',   color: '#6366f1' },
    completed: { label: 'Completado',  color: '#22c55e' },
  }[project.status]

  const groups = {
    completed:   project.stages.filter(s => s.status === 'completed'),
    in_progress: project.stages.filter(s => s.status === 'in_progress'),
    pending:     project.stages.filter(s => s.status === 'pending'),
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    addNote(project.id, { id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0], content: newNote.trim() })
    setNewNote('')
  }

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ background: '#0d0e14' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate('/proyectos')} className="flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: '#64748b' }}>
          <ArrowLeft size={14} />
          Proyectos
        </button>
        <span style={{ color: '#1f2333' }}>/</span>
        <h1 className="text-lg font-semibold text-white">{project.name}</h1>
        <div className="ml-auto">
          <span className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44` }}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-6 mb-8 text-xs" style={{ color: '#64748b' }}>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} />
          Iniciado: {format(parseISO(project.startDate), "d 'de' MMM yyyy", { locale: es })}
        </div>
        {project.projectedEndDate && (
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            Proyección: {format(parseISO(project.projectedEndDate), 'MMM yyyy', { locale: es })}
          </div>
        )}
        {project.subProjectIds.length > 0 && (
          <div className="flex items-center gap-1.5">
            <GitBranch size={12} />
            {project.subProjectIds.length} sub-proyectos
          </div>
        )}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-4 gap-4">
        {/* Completada */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
            <span className="text-xs font-semibold text-white">Completada</span>
            <span className="text-xs" style={{ color: '#374151' }}>{groups.completed.length}</span>
          </div>
          <div className="flex flex-col gap-3">
            {groups.completed.map(s => <StageCard key={s.id} stage={s} />)}
          </div>
        </div>

        {/* En progreso */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
            <span className="text-xs font-semibold text-white">En progreso</span>
            <span className="text-xs" style={{ color: '#374151' }}>{groups.in_progress.length}</span>
          </div>
          <div className="flex flex-col gap-3">
            {groups.in_progress.map(s => <StageCard key={s.id} stage={s} />)}
          </div>
        </div>

        {/* Pendiente */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#374151' }} />
            <span className="text-xs font-semibold text-white">Pendiente</span>
            <span className="text-xs" style={{ color: '#374151' }}>{groups.pending.length}</span>
          </div>
          <div className="flex flex-col gap-3">
            {groups.pending.map(s => <StageCard key={s.id} stage={s} />)}
          </div>
        </div>

        {/* Notas del proceso */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-white">Notas del proceso</span>
          </div>
          <div className="flex flex-col gap-3">
            {[...project.notes]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(note => (
                <div key={note.id} className="rounded-xl p-4" style={{ background: '#1c1f28', border: '1px solid #1f2333' }}>
                  <p className="text-[10px] mb-2" style={{ color: '#374151' }}>
                    {format(new Date(note.date), "d MMM yyyy", { locale: es })}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{note.content}</p>
                </div>
              ))}

            {/* Add note */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1f2333' }}>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Nota del proceso…"
                rows={3}
                className="w-full px-4 py-3 text-xs text-white placeholder-[#374151] resize-none outline-none"
                style={{ background: '#1c1f28' }}
              />
              <button
                onClick={handleAddNote}
                className="w-full py-2.5 text-xs flex items-center justify-center gap-1.5 transition-colors hover:bg-[#1c1f28]"
                style={{ background: '#161820', color: '#64748b', borderTop: '1px solid #1f2333' }}
              >
                <Plus size={12} />
                Agregar nota
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
