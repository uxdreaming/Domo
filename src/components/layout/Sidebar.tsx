import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Flame, Target, FolderKanban,
  Timer, PenLine, Settings, Zap
} from 'lucide-react'
import { useAppStore } from '../../store'
import { useS900Store } from '../../store'
import { format } from 'date-fns'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/habitos', icon: Flame, label: 'Hábitos' },
  { to: '/objetivos', icon: Target, label: 'Objetivos' },
  { to: '/proyectos', icon: FolderKanban, label: 'Proyectos' },
  { to: '/900s', icon: Timer, label: '900S' },
  { to: '/journalist', icon: PenLine, label: 'Journalist' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

const moduleColors: Record<string, string> = {
  '/': '#6366f1',
  '/habitos': '#6366f1',
  '/objetivos': '#f59e0b',
  '/proyectos': '#22c55e',
  '/900s': '#ef4444',
  '/journalist': '#a855f7',
  '/settings': '#64748b',
}

export function Sidebar() {
  const { mode, activateDeepRest, deactivateDeepRest, activateAFK, deactivateAFK } = useAppStore()
  const { snapshots } = useS900Store()
  const now = new Date()
  const timeLabel = format(now, 'HH:mm')

  const lastSnap = snapshots.length > 0
    ? [...snapshots].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    : null
  const lastSnapTime = lastSnap ? format(new Date(lastSnap.timestamp), 'HH:mm') : timeLabel

  return (
    <aside className="w-[240px] min-h-screen flex flex-col shrink-0" style={{ background: '#111318', borderRight: '1px solid #1f2333' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
          D
        </div>
        <span className="font-semibold text-white text-base">Domo</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'text-white'
                  : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1c1f28]'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: '#1e2130',
              color: moduleColors[to] || '#6366f1',
            } : {}}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} style={{ color: isActive ? moduleColors[to] : undefined }} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Mode buttons */}
      {mode === 'normal' && (
        <div className="px-3 pb-4 flex flex-col gap-1">
          <button
            onClick={activateDeepRest}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-[#64748b] hover:text-white hover:bg-[#1c1f28] transition-all w-full text-left"
          >
            <Zap size={13} style={{ color: '#f59e0b' }} />
            Deep Rest
          </button>
          <button
            onClick={activateAFK}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-[#64748b] hover:text-white hover:bg-[#1c1f28] transition-all w-full text-left"
          >
            <span className="w-2 h-2 rounded-full" style={{ background: '#374151' }} />
            Modo AFK
          </button>
        </div>
      )}

      {mode === 'deep_rest' && (
        <div className="px-3 pb-4">
          <button
            onClick={deactivateDeepRest}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs w-full text-left"
            style={{ background: '#1a1f2e', color: '#f59e0b', border: '1px solid #f59e0b33' }}
          >
            <Zap size={12} />
            Deep Rest activo · Terminar
          </button>
        </div>
      )}

      {mode === 'afk' && (
        <div className="px-3 pb-4">
          <button
            onClick={deactivateAFK}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs w-full text-left"
            style={{ background: '#1a2020', color: '#22c55e', border: '1px solid #22c55e33' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            AFK activo · Volver
          </button>
        </div>
      )}

      {/* 900S status */}
      <div className="px-6 py-4 border-t border-[#1f2333]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
          <span className="text-[11px] font-mono" style={{ color: '#ef4444' }}>
            900S activo · {lastSnapTime}
          </span>
        </div>
      </div>
    </aside>
  )
}
