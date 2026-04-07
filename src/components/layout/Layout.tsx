import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { S900Popup } from '../s900/S900Popup'

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto" style={{ background: '#0d0f14' }}>
        <Outlet />
      </main>
      <S900Popup />
    </div>
  )
}
