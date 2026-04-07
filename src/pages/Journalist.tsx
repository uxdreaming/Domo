import { useState } from 'react'
import { Plus, Edit2, Trash2, Star, FileText, Calendar, BookOpen } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useJournalistStore } from '../store'
import type { JournalistEntry, JournalistEntryType } from '../types'

const ENTRY_TYPES: Record<JournalistEntryType, { label: string; icon: typeof Star; color: string; group: string }> = {
  morning_thinking: { label: 'Morning thinking', icon: Star,     color: '#f59e0b', group: 'DIARIO' },
  daily_note:       { label: 'Daily note',       icon: FileText, color: '#6366f1', group: 'DIARIO' },
  weekly_review:    { label: 'Weekly review',    icon: Calendar, color: '#22c55e', group: 'REVISIONES' },
  monthly_review:   { label: 'Monthly review',   icon: Calendar, color: '#38bdf8', group: 'REVISIONES' },
  yearly_review:    { label: 'Yearly review',    icon: Calendar, color: '#f59e0b', group: 'REVISIONES' },
  writing:          { label: 'Writing',          icon: Edit2,    color: '#a855f7', group: 'CREATIVOS' },
  buyo:             { label: 'Buyo',             icon: BookOpen, color: '#64748b', group: 'CREATIVOS' },
}

const GROUPS = ['DIARIO', 'REVISIONES', 'CREATIVOS']

// ─── Entry Editor ────────────────────────────────────────────────────────────

function EntryEditor({
  entry, onSave, onClose,
}: {
  entry?: JournalistEntry | null
  onSave: (type: JournalistEntryType, title: string, content: string) => void
  onClose: () => void
}) {
  const [type, setType]       = useState<JournalistEntryType>(entry?.type || 'morning_thinking')
  const [title, setTitle]     = useState(entry?.title || '')
  const [content, setContent] = useState(entry?.content || '')

  const typeConfig = ENTRY_TYPES[type]
  const Icon = typeConfig.icon

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="flex flex-col rounded-2xl shadow-2xl"
        style={{ background: '#161820', border: '1px solid #1f2333', width: 720, maxHeight: '85vh' }}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1f2333] shrink-0">
          <Icon size={14} style={{ color: typeConfig.color }} />

          <select
            value={type}
            onChange={e => setType(e.target.value as JournalistEntryType)}
            className="text-sm outline-none px-2 py-1 rounded-lg"
            style={{ background: '#1c1f28', color: '#94a3b8', border: '1px solid #1f2333' }}
          >
            {Object.entries(ENTRY_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título..."
            className="flex-1 text-sm bg-transparent outline-none text-white placeholder-[#374151]"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: '#1c1f28', color: '#64748b' }}>
              Cancelar
            </button>
            <button
              onClick={() => { onSave(type, title, content); onClose() }}
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ background: typeConfig.color }}
            >
              Guardar
            </button>
          </div>
        </div>

        {/* Editor */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={`# ${typeConfig.label}\n\nEscribe en Markdown...`}
          className="flex-1 px-8 py-6 text-sm text-white placeholder-[#374151] bg-transparent resize-none outline-none font-mono leading-relaxed"
          style={{ minHeight: 400 }}
          autoFocus
        />
      </div>
    </div>
  )
}

// ─── Entry row ───────────────────────────────────────────────────────────────

function EntryRow({ entry, onEdit, onDelete }: {
  entry: JournalistEntry
  onEdit: () => void
  onDelete: () => void
}) {
  const cfg  = ENTRY_TYPES[entry.type]
  const Icon = cfg.icon
  const preview = entry.content.replace(/[#*`\n]/g, ' ').trim().slice(0, 100)

  return (
    <div
      className="flex items-start gap-4 px-6 py-5 border-b border-[#1f2333] last:border-0 hover:bg-[#1c1f28] cursor-pointer transition-colors group"
      onClick={onEdit}
    >
      <Icon size={15} style={{ color: cfg.color, marginTop: 2, flexShrink: 0 }} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span
            className="text-[10px] px-2 py-0.5 rounded font-medium"
            style={{ background: `${cfg.color}22`, color: cfg.color }}
          >
            {cfg.label}
          </span>
          <span className="text-xs" style={{ color: '#374151' }}>
            {format(parseISO(entry.date), "d 'de' MMM yyyy", { locale: es })}
          </span>
        </div>
        <p className="text-sm font-medium text-white mb-1 truncate">{entry.title}</p>
        {preview && (
          <p className="text-xs leading-relaxed truncate" style={{ color: '#64748b' }}>{preview}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={e => { e.stopPropagation(); onEdit() }}
          className="p-2 rounded-lg"
          style={{ background: '#1c1f28', color: '#64748b' }}
        >
          <Edit2 size={12} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="p-2 rounded-lg"
          style={{ background: '#1c1f28', color: '#ef4444' }}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export function Journalist() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournalistStore()
  const [showEditor, setShowEditor]   = useState(false)
  const [editing, setEditing]         = useState<JournalistEntry | null>(null)
  const [filterType, setFilterType]   = useState<JournalistEntryType | 'all'>('all')

  const sorted = [...entries]
    .filter(e => filterType === 'all' || e.type === filterType)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleSave = (type: JournalistEntryType, title: string, content: string) => {
    if (editing) {
      updateEntry(editing.id, { type, title, content, updatedAt: new Date().toISOString() })
    } else {
      const now = new Date().toISOString()
      addEntry({
        id: crypto.randomUUID(),
        type,
        title: title || `${ENTRY_TYPES[type].label} — ${format(new Date(), "d 'de' MMM yyyy", { locale: es })}`,
        content,
        date: now.split('T')[0],
        createdAt: now,
        updatedAt: now,
      })
    }
    setEditing(null)
  }

  const openEdit = (entry: JournalistEntry) => {
    setEditing(entry)
    setShowEditor(true)
  }

  const openNew = () => {
    setEditing(null)
    setShowEditor(true)
  }

  return (
    <div className="p-10 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <Edit2 size={20} style={{ color: '#a855f7' }} />
          <h1 className="text-2xl font-semibold text-white">Journalist</h1>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: '#a855f722', color: '#a855f7', border: '1px solid #a855f733' }}>
            {entries.length} entradas
          </span>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ background: '#a855f7' }}
        >
          <Plus size={14} />
          Nueva entrada
        </button>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilterType('all')}
          className="px-3 py-1.5 rounded-lg text-xs transition-colors"
          style={{
            background: filterType === 'all' ? '#a855f722' : '#1c1f28',
            color:      filterType === 'all' ? '#a855f7'   : '#64748b',
            border:     `1px solid ${filterType === 'all' ? '#a855f744' : '#1f2333'}`,
          }}
        >
          Todas
        </button>
        {Object.entries(ENTRY_TYPES).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setFilterType(key as JournalistEntryType)}
            className="px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{
              background: filterType === key ? `${color}22` : '#1c1f28',
              color:      filterType === key ? color         : '#64748b',
              border:     `1px solid ${filterType === key ? `${color}44` : '#1f2333'}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Entries grouped by type */}
      {filterType === 'all' ? (
        <div className="flex flex-col gap-6">
          {GROUPS.map(group => {
            const groupEntries = sorted.filter(e => ENTRY_TYPES[e.type].group === group)
            if (groupEntries.length === 0) return null
            return (
              <div key={group}>
                <p className="text-[10px] font-semibold tracking-[0.15em] px-1 mb-3" style={{ color: '#374151' }}>
                  {group}
                </p>
                <div className="rounded-xl overflow-hidden" style={{ background: '#161820', border: '1px solid #1f2333' }}>
                  {groupEntries.map(entry => (
                    <EntryRow
                      key={entry.id}
                      entry={entry}
                      onEdit={() => openEdit(entry)}
                      onDelete={() => deleteEntry(entry.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: '#161820', border: '1px solid #1f2333' }}>
          {sorted.map(entry => (
            <EntryRow
              key={entry.id}
              entry={entry}
              onEdit={() => openEdit(entry)}
              onDelete={() => deleteEntry(entry.id)}
            />
          ))}
        </div>
      )}

      {sorted.length === 0 && (
        <div className="py-20 text-center">
          <Edit2 size={28} className="mx-auto mb-4" style={{ color: '#1f2333' }} />
          <p className="text-sm mb-2" style={{ color: '#374151' }}>Sin entradas todavía</p>
          <button onClick={openNew} className="text-xs underline" style={{ color: '#a855f7' }}>
            Escribir la primera
          </button>
        </div>
      )}

      {showEditor && (
        <EntryEditor
          entry={editing}
          onSave={handleSave}
          onClose={() => { setShowEditor(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
