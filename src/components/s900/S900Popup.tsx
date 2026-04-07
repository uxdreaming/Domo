import { useState, useEffect } from 'react'
import { Timer } from 'lucide-react'
import { format } from 'date-fns'
import { useS900Store } from '../../store'
import { useAppStore } from '../../store'
import type { S900Category } from '../../types'

const CATEGORIES: { id: S900Category; label: string; icon: string }[] = [
  { id: 'programacion', label: 'Programación', icon: '<>' },
  { id: 'lectura', label: 'Lectura', icon: '📖' },
  { id: 'ejercicio', label: 'Ejercicio', icon: '🏃' },
  { id: 'escritura', label: 'Escritura', icon: '✍️' },
  { id: 'descanso', label: 'Descanso', icon: '☕' },
  { id: 'social', label: 'Social', icon: '👥' },
]

export function S900Popup() {
  const { showPopup, popupTimestamp, addSnapshot, skipPopup } = useS900Store()
  const { mode } = useAppStore()
  const [activity, setActivity] = useState('')
  const [category, setCategory] = useState<S900Category | null>(null)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (!showPopup) {
      setActivity('')
      setCategory(null)
      setCountdown(60)
      return
    }
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) return 0
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [showPopup])

  if (!showPopup || mode === 'afk' || mode === 'deep_rest') return null

  const timestamp = popupTimestamp || new Date().toISOString()
  const timeLabel = format(new Date(timestamp), 'HH:mm')

  const handleRegister = () => {
    if (!activity.trim() && !category) return
    addSnapshot({
      id: crypto.randomUUID(),
      timestamp,
      activity: activity.trim() || category || 'Sin descripción',
      category: category || 'otro',
      edited: false,
    })
  }

  const handleSkip = () => {
    skipPopup(timestamp)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-[480px] rounded-2xl p-8 shadow-2xl" style={{ background: '#161820', border: '1px solid #1f2333' }}>

        {/* Header badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: '#1a1015', border: '1px solid #ef444433', color: '#ef4444' }}>
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
            <Timer size={12} />
            900S · {timeLabel}
          </div>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-semibold text-white text-center leading-tight mb-6">
          ¿Qué estás haciendo<br />ahora mismo?
        </h2>

        {/* Textarea */}
        <textarea
          value={activity}
          onChange={e => setActivity(e.target.value)}
          placeholder="Escribe lo que estás haciendo..."
          rows={3}
          className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#374151] resize-none outline-none transition-colors"
          style={{ background: '#1c1f28', border: '1px solid #1f2333' }}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#1f2333'}
          autoFocus
        />

        {/* Quick categories */}
        <div className="mt-4 mb-6">
          <p className="text-xs text-[#374151] mb-2">Categoría rápida</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id === category ? null : cat.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: category === cat.id ? '#1e2240' : '#1c1f28',
                  border: `1px solid ${category === cat.id ? '#6366f1' : '#1f2333'}`,
                  color: category === cat.id ? '#818cf8' : '#64748b',
                }}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ background: '#1c1f28', color: '#64748b', border: '1px solid #1f2333' }}
          >
            Saltar
          </button>
          <button
            onClick={handleRegister}
            disabled={!activity.trim() && !category}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: '#ef4444' }}
          >
            Registrar
          </button>
        </div>

        {/* Countdown */}
        <p className="text-center text-xs mt-3 font-mono" style={{ color: '#374151' }}>
          Se cierra en {countdown}s · Próximo check-in en {useS900Store.getState().snapshots ? '15:00' : '--'} min
        </p>
      </div>
    </div>
  )
}
