import { useState } from 'react'
import { Plus, PenLine, Star, FileText, Calendar, BookOpen, Edit2, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useJournalistStore } from '../store'
import type { JournalistEntry, JournalistEntryType } from '../types'

const ENTRY_TYPES: Record<JournalistEntryType, { label: string; icon: typeof Star; color: string; group: string; minDesc?: string; maxDesc?: string }> = {
  morning_thinking: { label: 'Morning thinking', icon: Star,     color: '#f59e0b', group: 'DIARIO',     minDesc: 'Escribir 3 Min', maxDesc: 'Jrn 20 min journaling' },
  daily_note:       { label: 'Daily note',       icon: FileText, color: '#6366f1', group: 'DIARIO',     minDesc: 'Log 3 cosas', maxDesc: 'Log relatos completo' },
  weekly_review:    { label: 'Weekly review',    icon: Calendar, color: '#22c55e', group: 'REVISIONES', minDesc: 'Revisar logros', maxDesc: 'Reflexión profunda' },
  monthly_review:   { label: 'Monthly review',   icon: Calendar, color: '#38bdf8', group: 'REVISIONES', minDesc: 'Revisión mensual', maxDesc: 'Análisis profundo' },
  yearly_review:    { label: 'Yearly review',    icon: Calendar, color: '#f59e0b', group: 'REVISIONES', minDesc: 'Balance anual', maxDesc: 'Plan y reflexión' },
  writing:          { label: 'Writings',          icon: Edit2,    color: '#a855f7', group: 'CREATIVOS',  minDesc: 'Escribir a mano', maxDesc: 'Texto largo completo' },
  buyo:             { label: 'Buyo',             icon: BookOpen, color: '#64748b', group: 'CREATIVOS',  minDesc: 'Entrada corta', maxDesc: 'Reflexión extendida' },
}

const GROUPS = ['DIARIO', 'REVISIONES', 'CREATIVOS']

function EntryEditor({ entry, onSave, onClose }: {
  entry?: JournalistEntry | null
  onSave: (type: JournalistEntryType, title: string, content: string) => void
  onClose: () => void
}) {
  const [type, setType]       = useState<JournalistEntryType>(entry?.type || 'morning_thinking')
  const [title, setTitle]     = useState(entry?.title || '')
  const [content, setContent] = useState(entry?.content || '')
  const cfg = ENTRY_TYPES[type]
  const Icon = cfg.icon

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div className="flex flex-col rounded-xl shadow-2xl"
        style={{ background: '#111218', border: '1px solid #1a1c28', width: 700, maxHeight: '85vh' }}>
        <div className="flex items-center gap-3 px-5 py-3.5 shrink-0" style={{ borderBottom: '1px solid #1a1c28' }}>
          <Icon size={13} style={{ color: cfg.color }} />
          <select value={type} onChange={e => setType(e.target.value as JournalistEntryType)}
            className="text-xs outline-none px-2 py-1 rounded"
            style={{ background: '#1a1c28', color: '#94a3b8', border: '1px solid #2a2d3a' }}>
            {Object.entries(ENTRY_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título..."
            className="flex-1 text-sm bg-transparent outline-none text-white placeholder-[#374151]" />
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1.5 rounded text-xs" style={{ background: '#1a1c28', color: '#64748b' }}>
              Cancelar
            </button>
            <button onClick={() => { onSave(type, title, content); onClose() }}
              className="px-3 py-1.5 rounded text-xs font-medium text-white"
              style={{ background: cfg.color }}>
              Guardar
            </button>
          </div>
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder={`# ${cfg.label}\n\nEscribe en Markdown...`}
          className="flex-1 px-7 py-5 text-sm text-white placeholder-[#374151] bg-transparent resize-none outline-none font-mono leading-relaxed"
          style={{ minHeight: 380 }} autoFocus />
      </div>
    </div>
  )
}

export function Journalist() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournalistStore()
  const [showEditor, setShowEditor]   = useState(false)
  const [editing, setEditing]         = useState<JournalistEntry | null>(null)

  const handleSave = (type: JournalistEntryType, title: string, content: string) => {
    if (editing) {
      updateEntry(editing.id, { type, title, content, updatedAt: new Date().toISOString() })
    } else {
      const now = new Date().toISOString()
      addEntry({
        id: crypto.randomUUID(), type, title: title || `${ENTRY_TYPES[type].label} — ${format(new Date(), "d MMM", { locale: es })}`,
        content, date: now.split('T')[0], createdAt: now, updatedAt: now,
      })
    }
    setEditing(null)
  }

  const openEdit = (entry: JournalistEntry) => { setEditing(entry); setShowEditor(true) }
  const openNew  = () => { setEditing(null); setShowEditor(true) }

  // Group by type
  const byType: Partial<Record<JournalistEntryType, JournalistEntry[]>> = {}
  entries.forEach(e => { byType[e.type] = [...(byType[e.type] || []), e] })

  // Count & stats per type (mock: count + racha from logs count)
  const typeStats = (type: JournalistEntryType) => {
    const list = byType[type] || []
    return { count: list.length, streak: list.length }
  }

  // Last 7 days for a type
  const last7 = (type: JournalistEntryType) => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      const ds = d.toISOString().split('T')[0]
      return (byType[type] || []).some(e => e.date === ds)
    })
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#0d0e14' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid #1a1c28' }}>
        <PenLine size={16} style={{ color: '#a855f7' }} />
        <h1 className="text-lg font-semibold text-white">Journalist</h1>
        {entries.length > 0 && (
          <span className="px-2 py-0.5 rounded text-xs font-semibold"
            style={{ background: '#a855f722', color: '#a855f7', border: '1px solid #a855f733' }}>
            {entries.length} entradas
          </span>
        )}
        <div className="flex-1" />
        <button onClick={openNew}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
          style={{ background: '#a855f7' }}>
          <Plus size={12} />
          Nueva entrada
        </button>
      </div>

      {/* Sub-header description */}
      <div className="px-6 py-3" style={{ borderBottom: '1px solid #1a1c28' }}>
        <p className="text-xs" style={{ color: '#374151' }}>
          Prácticas de escritura e introspección · Contenido en DOMO / Journalist
        </p>
      </div>

      {/* Column headers */}
      <div className="flex items-center px-6 py-2" style={{ borderBottom: '1px solid #1a1c28' }}>
        <div className="flex-1" />
        <div className="w-10 text-right"><span className="text-[10px]" style={{ color: '#374151' }}>Min</span></div>
        <div className="w-10 text-right"><span className="text-[10px]" style={{ color: '#374151' }}>Max</span></div>
        <div className="w-12 text-right"><span className="text-[10px]" style={{ color: '#374151' }}>Racha</span></div>
        <div className="w-20 text-right"><span className="text-[10px]" style={{ color: '#374151' }}>7 días</span></div>
      </div>

      {/* Groups */}
      {GROUPS.map(group => {
        const groupTypes = (Object.entries(ENTRY_TYPES) as [JournalistEntryType, typeof ENTRY_TYPES[JournalistEntryType]][])
          .filter(([, v]) => v.group === group)

        return (
          <div key={group}>
            <div className="px-6 py-2.5" style={{ borderBottom: '1px solid #1a1c28' }}>
              <span className="text-[10px] font-semibold tracking-widest" style={{ color: '#374151' }}>
                {group}
              </span>
            </div>

            {groupTypes.map(([key, cfg]) => {
              const Icon = cfg.icon
              const stats = typeStats(key)
              const dots = last7(key)
              const color = cfg.color

              return (
                <div key={key}
                  className="flex items-center px-6 py-3.5 cursor-pointer hover:bg-[#111218] transition-colors group"
                  style={{ borderBottom: '1px solid #1a1c28' }}
                  onClick={() => openNew()}>
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Icon size={14} style={{ color, marginTop: 1, flexShrink: 0 }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white">{cfg.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#374151' }}>
                        {cfg.minDesc && `Min: ${cfg.minDesc}`}{cfg.maxDesc && ` · Max: ${cfg.maxDesc}`}
                      </p>
                    </div>
                  </div>
                  {/* Min/Max buttons */}
                  <div className="w-10 flex justify-end">
                    <button onClick={e => { e.stopPropagation() }}
                      className="w-7 h-7 rounded flex items-center justify-center"
                      style={{ background: '#1a1c28', border: '1px solid #2a2d3a' }} />
                  </div>
                  <div className="w-10 flex justify-end">
                    <button onClick={e => { e.stopPropagation() }}
                      className="w-7 h-7 rounded flex items-center justify-center"
                      style={{ background: '#1a1c28', border: '1px solid #2a2d3a' }} />
                  </div>
                  {/* Streak */}
                  <div className="w-12 text-right">
                    <span className="text-sm font-mono" style={{ color: stats.count > 0 ? 'white' : '#374151' }}>
                      {stats.streak}
                    </span>
                  </div>
                  {/* 7 días */}
                  <div className="w-20 flex items-center justify-end gap-0.5">
                    {dots.map((done, i) => (
                      <span key={i} className="w-2.5 h-2.5 rounded-full"
                        style={{ background: done ? color : '#1f2333' }} />
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Recent entries for this group (collapsed) */}
            {(Object.entries(ENTRY_TYPES) as [JournalistEntryType, typeof ENTRY_TYPES[JournalistEntryType]][])
              .filter(([, v]) => v.group === group)
              .flatMap(([key]) => byType[key] || [])
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 2)
              .map(entry => {
                const cfg = ENTRY_TYPES[entry.type]
                return (
                  <div key={entry.id}
                    className="flex items-center gap-4 px-6 py-3 cursor-pointer hover:bg-[#111218] transition-colors group"
                    style={{ borderBottom: '1px solid #13141a', background: '#0a0b10' }}
                    onClick={() => openEdit(entry)}>
                    <span className="w-4 shrink-0" />
                    <span className="text-xs px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: `${cfg.color}22`, color: cfg.color }}>{cfg.label}</span>
                    <span className="text-xs text-white flex-1 truncate">{entry.title}</span>
                    <span className="text-[10px] shrink-0" style={{ color: '#374151' }}>
                      {format(parseISO(entry.date), "d MMM", { locale: es })}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={e => { e.stopPropagation(); openEdit(entry) }}
                        className="p-1 rounded" style={{ color: '#64748b' }}><Edit2 size={11} /></button>
                      <button onClick={e => { e.stopPropagation(); deleteEntry(entry.id) }}
                        className="p-1 rounded" style={{ color: '#ef4444' }}><Trash2 size={11} /></button>
                    </div>
                  </div>
                )
              })}
          </div>
        )
      })}

      {entries.length === 0 && (
        <div className="py-16 text-center">
          <PenLine size={28} className="mx-auto mb-4" style={{ color: '#1a1c28' }} />
          <p className="text-sm mb-2" style={{ color: '#374151' }}>Sin entradas todavía</p>
          <button onClick={openNew} className="text-xs underline" style={{ color: '#a855f7' }}>
            Escribir la primera
          </button>
        </div>
      )}

      {/* Bottom status bar */}
      {entries.length > 0 && (
        <div className="px-6 py-3 text-xs flex gap-4" style={{ borderTop: '1px solid #1a1c28', color: '#374151' }}>
          <span>● Journalist tiene <span style={{ color: '#a855f7' }}>{entries.length} entradas</span></span>
          <span>Última hace {entries.length > 0 ? format(new Date(entries[entries.length-1].createdAt), "d MMM", { locale: es }) : '—'}</span>
        </div>
      )}

      {showEditor && (
        <EntryEditor entry={editing} onSave={handleSave}
          onClose={() => { setShowEditor(false); setEditing(null) }} />
      )}
    </div>
  )
}
