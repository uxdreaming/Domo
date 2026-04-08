import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Flame, Target, Kanban,
  Timer, PenLine, Settings, Moon, Pause
} from 'lucide-react'
import { useAppStore, useS900Store } from '../../store'
import { format } from 'date-fns'

const NAV = [
  { to: '/',           label: 'Dashboard', icon: LayoutDashboard, color: '#94a3b8' },
  { to: '/habitos',    label: 'Hábitos',   icon: Flame,           color: '#f97316' },
  { to: '/objetivos',  label: 'Objetivos', icon: Target,          color: '#eab308' },
  { to: '/proyectos',  label: 'Proyectos', icon: Kanban,          color: '#22c55e' },
  { to: '/900s',       label: '900S',      icon: Timer,           color: '#ef4444' },
  { to: '/journalist', label: 'Journalist',icon: PenLine,         color: '#a855f7' },
  { to: '/settings',   label: 'Settings',  icon: Settings,        color: '#64748b' },
]

export function Sidebar() {
  const location = useLocation()
  const { mode, activateDeepRest, deactivateDeepRest, activateAFK, deactivateAFK } = useAppStore()
  const { snapshots, showPopup } = useS900Store()

  const todayStr = new Date().toISOString().split('T')[0]
  const lastSnap = [...snapshots].filter(s => s.timestamp.startsWith(todayStr)).pop()
  const lastTime = lastSnap ? format(new Date(lastSnap.timestamp), 'HH:mm') : format(new Date(), 'HH:mm')

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <aside className="flex flex-col shrink-0 h-screen" style={{ width: 200, background: '#0d0e14', borderRight: '1px solid #1a1c28' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          D
        </div>
        <span className="text-white font-semibold text-base tracking-tight">Domo</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {NAV.map(({ to, label, icon: Icon, color }) => {
          const active = isActive(to)
          return (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: active ? '#1a1c28' : 'transparent',
                color: active ? 'white' : '#4b5563',
              }}
            >
              <Icon size={15} style={{ color: active ? color : '#374151', flexShrink: 0 }} />
              {label}
            </NavLink>
          )
        })}
      </nav>

      {/* Mode buttons */}
      <div className="px-3 pb-3 flex flex-col gap-0.5">
        {mode !== 'deep_rest' ? (
          <button
            onClick={activateDeepRest}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs w-full transition-all text-left"
            style={{ color: '#374151' }}
          >
            <Moon size={13} style={{ color: '#374151' }} />
            Deep Rest
          </button>
        ) : (
          <button
            onClick={deactivateDeepRest}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs w-full text-left"
            style={{ color: '#6366f1', background: '#6366f111' }}
          >
            <Moon size={13} style={{ color: '#6366f1' }} />
            Salir Deep Rest
          </button>
        )}
        {mode !== 'afk' ? (
          <button
            onClick={activateAFK}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs w-full transition-all text-left"
            style={{ color: '#374151' }}
          >
            <Pause size={13} style={{ color: '#374151' }} />
            AFK
          </button>
        ) : (
          <button
            onClick={deactivateAFK}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs w-full text-left"
            style={{ color: '#f59e0b', background: '#f59e0b11' }}
          >
            <Pause size={13} style={{ color: '#f59e0b' }} />
            Volver de AFK
          </button>
        )}
      </div>

      {/* 900S Status */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid #1a1c28' }}>
        <span className="text-xs font-mono" style={{ color: '#ef4444' }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
            style={{ background: showPopup ? '#f59e0b' : '#ef4444' }} />
          900S activo {lastTime}
        </span>
      </div>
    </aside>
  )
}
