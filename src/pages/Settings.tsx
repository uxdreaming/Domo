import { useState } from 'react'
import { Settings as SettingsIcon, Flame, Timer, Plug, Database } from 'lucide-react'
import { useAppStore } from '../store'

type SettingsTab = 'general' | 'habitos' | '900s' | 'integraciones' | 'datos'

const TABS: { id: SettingsTab; label: string; icon: typeof SettingsIcon }[] = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'habitos', label: 'Hábitos', icon: Flame },
  { id: '900s', label: '900S', icon: Timer },
  { id: 'integraciones', label: 'Integraciones', icon: Plug },
  { id: 'datos', label: 'Datos', icon: Database },
]

function ToggleButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
      style={{
        background: active ? '#1e2130' : '#161820',
        color: active ? 'white' : '#64748b',
        border: `1px solid ${active ? '#6366f1' : '#1f2333'}`,
      }}
    >
      {label}
    </button>
  )
}

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-5" style={{ borderBottom: '1px solid #1f2333' }}>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function GeneralTab() {
  const { settings, updateSettings } = useAppStore()

  return (
    <div>
      <SettingRow label="App Theme" description="Choose your preferred color theme">
        <div className="flex gap-2">
          <ToggleButton active={settings.theme === 'dark'} label="🌙 Dark" onClick={() => updateSettings({ theme: 'dark' })} />
          <ToggleButton active={settings.theme === 'light'} label="☀️ Light" onClick={() => updateSettings({ theme: 'light' })} />
        </div>
      </SettingRow>

      <SettingRow label="Nombre" description="Tu nombre en el dashboard">
        <input
          value={settings.userName}
          onChange={e => updateSettings({ userName: e.target.value })}
          className="px-3 py-1.5 rounded-lg text-sm outline-none text-white w-40"
          style={{ background: '#1c1f28', border: '1px solid #1f2333' }}
        />
      </SettingRow>

      <SettingRow label="Language" description="Select the display language for the app">
        <select
          value={settings.language}
          onChange={e => updateSettings({ language: e.target.value as 'es' | 'en' })}
          className="px-3 py-1.5 rounded-lg text-sm outline-none text-white w-40"
          style={{ background: '#1c1f28', border: '1px solid #1f2333' }}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </SettingRow>

      <SettingRow label="Date Format" description="How dates are displayed throughout the app">
        <select
          value={settings.dateFormat}
          onChange={e => updateSettings({ dateFormat: e.target.value as typeof settings.dateFormat })}
          className="px-3 py-1.5 rounded-lg text-sm outline-none text-white w-40"
          style={{ background: '#1c1f28', border: '1px solid #1f2333' }}
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </SettingRow>

      <SettingRow label="Time Format" description="12-hour or 24-hour clock display">
        <div className="flex gap-2">
          <ToggleButton active={settings.timeFormat === '24h'} label="24h" onClick={() => updateSettings({ timeFormat: '24h' })} />
          <ToggleButton active={settings.timeFormat === '12h'} label="12h" onClick={() => updateSettings({ timeFormat: '12h' })} />
        </div>
      </SettingRow>

      <SettingRow label="Start of Week" description="First day of the week in calendars and charts">
        <select
          value={settings.weekStartsOn}
          onChange={e => updateSettings({ weekStartsOn: Number(e.target.value) as 0 | 1 })}
          className="px-3 py-1.5 rounded-lg text-sm outline-none text-white w-40"
          style={{ background: '#1c1f28', border: '1px solid #1f2333' }}
        >
          <option value={1}>Lunes</option>
          <option value={0}>Domingo</option>
        </select>
      </SettingRow>
    </div>
  )
}

function S900Tab() {
  const { settings, updateSettings } = useAppStore()

  return (
    <div>
      <SettingRow label="900S activado" description="Habilitar el sistema de snapshots cada 15 minutos">
        <ToggleButton
          active={settings.s900Enabled}
          label={settings.s900Enabled ? 'Activo' : 'Inactivo'}
          onClick={() => updateSettings({ s900Enabled: !settings.s900Enabled })}
        />
      </SettingRow>

      <SettingRow label="Intervalo" description="Cada cuántos minutos aparece el popup">
        <select
          value={settings.s900IntervalMinutes}
          onChange={e => updateSettings({ s900IntervalMinutes: Number(e.target.value) })}
          className="px-3 py-1.5 rounded-lg text-sm outline-none text-white w-40"
          style={{ background: '#1c1f28', border: '1px solid #1f2333' }}
        >
          <option value={5}>5 minutos</option>
          <option value={10}>10 minutos</option>
          <option value={15}>15 minutos (900S)</option>
          <option value={30}>30 minutos</option>
          <option value={60}>1 hora</option>
        </select>
      </SettingRow>
    </div>
  )
}

function DatosTab() {
  const handleExport = () => {
    const data = {
      habits: localStorage.getItem('domo-habits'),
      objectives: localStorage.getItem('domo-objectives'),
      projects: localStorage.getItem('domo-projects'),
      s900: localStorage.getItem('domo-s900'),
      journalist: localStorage.getItem('domo-journalist'),
      app: localStorage.getItem('domo-app'),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `domo-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <SettingRow label="Exportar datos" description="Descargar todos tus datos como JSON">
        <button
          onClick={handleExport}
          className="px-4 py-1.5 rounded-lg text-sm font-medium text-white"
          style={{ background: '#6366f1' }}
        >
          Exportar JSON
        </button>
      </SettingRow>

      <SettingRow label="Backup GitHub" description="Repositorio: github.com/uxdreaming/Domo">
        <span className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#0f1a10', color: '#22c55e', border: '1px solid #22c55e33' }}>
          Configurado
        </span>
      </SettingRow>
    </div>
  )
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  return (
    <div className="flex h-full">
      {/* Settings sub-nav */}
      <div className="w-52 shrink-0 py-8 px-4" style={{ borderRight: '1px solid #1f2333' }}>
        <p className="text-[10px] font-semibold tracking-widest mb-4 px-3" style={{ color: '#374151' }}>SETTINGS</p>
        <div className="flex flex-col gap-0.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all text-left"
              style={{
                background: activeTab === id ? '#1e2130' : 'transparent',
                color: activeTab === id ? 'white' : '#64748b',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-10 max-w-[720px]">
        <h1 className="text-2xl font-semibold text-white mb-1">
          {TABS.find(t => t.id === activeTab)?.label}
        </h1>
        <p className="text-sm mb-8" style={{ color: '#64748b' }}>
          {activeTab === 'general' && 'App preferences and display settings'}
          {activeTab === 'habitos' && 'Configuración del sistema de hábitos'}
          {activeTab === '900s' && 'Configuración del proceso 900S'}
          {activeTab === 'integraciones' && 'Conexiones con herramientas externas'}
          {activeTab === 'datos' && 'Backup y exportación de datos'}
        </p>

        {activeTab === 'general' && <GeneralTab />}
        {activeTab === '900s' && <S900Tab />}
        {activeTab === 'datos' && <DatosTab />}
        {(activeTab === 'habitos' || activeTab === 'integraciones') && (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: '#374151' }}>Próximamente</p>
          </div>
        )}
      </div>
    </div>
  )
}
