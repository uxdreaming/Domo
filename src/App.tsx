import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Habits } from './pages/Habits'
import { HabitDetail } from './pages/HabitDetail'
import { Objectives } from './pages/Objectives'
import { ObjectiveDetail } from './pages/ObjectiveDetail'
import { Projects } from './pages/Projects'
import { ProjectDetail } from './pages/ProjectDetail'
import { S900Dashboard } from './pages/S900Dashboard'
import { Journalist } from './pages/Journalist'
import { Settings } from './pages/Settings'
import { useS900Timer } from './hooks/useS900Timer'

function AppInner() {
  useS900Timer()
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/habitos" element={<Habits />} />
        <Route path="/habitos/:id" element={<HabitDetail />} />
        <Route path="/objetivos" element={<Objectives />} />
        <Route path="/objetivos/:id" element={<ObjectiveDetail />} />
        <Route path="/proyectos" element={<Projects />} />
        <Route path="/proyectos/:id" element={<ProjectDetail />} />
        <Route path="/900s" element={<S900Dashboard />} />
        <Route path="/journalist" element={<Journalist />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
