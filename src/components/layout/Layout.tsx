import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { S900Popup } from '../s900/S900Popup'

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-h-0 overflow-hidden flex flex-col" style={{ background: '#0d0e14' }}>
        <Outlet />
      </main>
      <S900Popup />
    </div>
  )
}
