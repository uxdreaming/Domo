import type { Habit, Objective, Project, S900Snapshot, JournalistEntry, AppSettings } from '../types'

const today = new Date()
const dateStr = (offset: number = 0) => {
  const d = new Date(today)
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}
const daysAgo = (n: number) => dateStr(-n)
const timeStr = (h: number, m: number = 0) => {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

// Generate logs for past N days
const generateLogs = (days: number, level: 'min' | 'max' | 'mixed' = 'mixed') => {
  const logs = []
  for (let i = days; i >= 0; i--) {
    if (Math.random() > 0.15) { // ~85% completion rate
      const lvl = level === 'mixed' ? (Math.random() > 0.4 ? 'max' : 'min') : level
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      d.setHours(8 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60))
      logs.push({
        date: d.toISOString().split('T')[0],
        level: lvl as 'min' | 'max',
        timestamp: d.toISOString(),
      })
    }
  }
  return logs
}

export const seedHabits: Habit[] = [
  // SALUD
  {
    id: 'h1',
    name: 'Meditación',
    category: 'salud',
    frequency: 'daily',
    minDescription: 'Meditar 5 minutos',
    maxDescription: 'Meditar 20 minutos con journaling post-sesión',
    createdAt: new Date(today.getFullYear(), today.getMonth() - 3, 1).toISOString(),
    logs: generateLogs(90),
    urgency: 1,
    isJournalist: false,
    archived: false,
  },
  {
    id: 'h2',
    name: 'Ejercicio',
    category: 'salud',
    frequency: 'daily',
    minDescription: 'Caminar 20 minutos',
    maxDescription: 'Entrenamiento completo 1h + natación',
    createdAt: new Date(today.getFullYear(), today.getMonth() - 4, 15).toISOString(),
    logs: generateLogs(120, 'max'),
    urgency: 1,
    isJournalist: false,
    archived: false,
  },
  {
    id: 'h3',
    name: 'Sin azúcar',
    category: 'salud',
    frequency: 'daily',
    minDescription: 'Reducir azúcar procesada',
    maxDescription: 'Cero azúcar añadida en el día',
    createdAt: new Date(today.getFullYear(), today.getMonth() - 1, 10).toISOString(),
    logs: generateLogs(35, 'mixed'),
    urgency: 2,
    isJournalist: false,
    archived: false,
  },
  {
    id: 'h4',
    name: 'Agua 2L',
    category: 'salud',
    frequency: 'daily',
    minDescription: 'Tomar 1 litro de agua',
    maxDescription: 'Tomar 2 litros o más',
    createdAt: new Date(today.getFullYear(), today.getMonth() - 5, 1).toISOString(),
    logs: generateLogs(150),
    urgency: 1,
    isJournalist: false,
    archived: false,
  },
  // PRODUCTIVIDAD
  {
    id: 'h5',
    name: 'Lectura 30min',
    category: 'productividad',
    frequency: 'daily',
    minDescription: 'Leer 15 minutos',
    maxDescription: 'Leer 8 capítulos',
    createdAt: new Date(today.getFullYear() - 1, today.getMonth(), 1).toISOString(),
    logs: generateLogs(365, 'mixed'),
    urgency: 1,
    isJournalist: false,
    archived: false,
  },
  {
    id: 'h6',
    name: 'Deep Work 2h',
    category: 'productividad',
    frequency: 'daily',
    minDescription: '45 minutos de trabajo sin interrupciones',
    maxDescription: '2 horas de deep work en bloque',
    createdAt: new Date(today.getFullYear(), today.getMonth() - 2, 1).toISOString(),
    logs: generateLogs(60, 'mixed'),
    urgency: 1,
    isJournalist: false,
    archived: false,
  },
  // JOURNALIST
  {
    id: 'h7',
    name: 'Morning thinking',
    category: 'journalist',
    frequency: 'daily',
    minDescription: 'Anotar 1 idea o reflexión',
    maxDescription: '10 min de journaling completo',
    createdAt: new Date(today.getFullYear(), today.getMonth() - 3, 1).toISOString(),
    logs: generateLogs(90, 'mixed'),
    urgency: 1,
    isJournalist: true,
    archived: false,
  },
  {
    id: 'h8',
    name: 'Daily note',
    category: 'journalist',
    frequency: 'daily',
    minDescription: 'Escribir 1 párrafo del día',
    maxDescription: 'Entrada completa del día',
    createdAt: new Date(today.getFullYear(), today.getMonth() - 2, 15).toISOString(),
    logs: generateLogs(75, 'mixed'),
    urgency: 1,
    isJournalist: true,
    archived: false,
  },
  {
    id: 'h9',
    name: 'Weekly review',
    category: 'journalist',
    frequency: 'weekly',
    minDescription: 'Listar logros de la semana',
    maxDescription: 'Reflexión escrita completa + plan siguiente semana',
    createdAt: new Date(today.getFullYear(), today.getMonth() - 4, 1).toISOString(),
    logs: generateLogs(28, 'mixed'),
    urgency: 7,
    isJournalist: true,
    archived: false,
  },
]

export const seedObjectives: Objective[] = [
  {
    id: 'o1',
    name: 'Construir mueble estudio',
    category: 'Personal',
    status: 'in_progress',
    dueDate: dateStr(23),
    tasks: [
      { id: 'o1t1', text: 'Elegir diseño y materiales', status: 'completed', order: 1 },
      { id: 'o1t2', text: 'Comprar materiales en ferretería', status: 'completed', order: 2 },
      { id: 'o1t3', text: 'Cortar tablones según medidas', status: 'completed', order: 3 },
      { id: 'o1t4', text: 'Lijar y preparar superficies', status: 'in_progress', order: 4 },
      { id: 'o1t5', text: 'Pintar y terminaciones', status: 'pending', order: 5 },
    ],
    priority: 'alta',
    createdAt: daysAgo(30),
    urgency: 1,
  },
  {
    id: 'o2',
    name: 'Preparar certificación AWS',
    category: 'Certificaciones',
    status: 'in_progress',
    dueDate: dateStr(69),
    tasks: [
      { id: 'o2t1', text: 'Crear cuenta AWS Free Tier', status: 'completed', order: 1 },
      { id: 'o2t2', text: 'Completar curso SAA-C03 en Udemy', status: 'completed', order: 2 },
      { id: 'o2t3', text: 'Hacer labs prácticos en AWS', status: 'in_progress', order: 3 },
      { id: 'o2t4', text: 'Simulacros de examen (3 rondas)', status: 'pending', order: 4 },
      { id: 'o2t5', text: 'Agendar examen en Pearson VUE', status: 'pending', order: 5 },
      { id: 'o2t6', text: 'Repasar weak areas antes del examen', status: 'pending', order: 6 },
    ],
    linkedHabitId: 'h6',
    priority: 'alta',
    createdAt: daysAgo(65),
    urgency: 7,
    importedFrom: 'claude_ai',
  },
  {
    id: 'o3',
    name: 'Aprender a nadar',
    category: 'Salud',
    status: 'pending',
    dueDate: dateStr(84),
    tasks: [
      { id: 'o3t1', text: 'Averiguar academias de natación cercanas', status: 'in_progress', order: 1 },
      { id: 'o3t2', text: 'Inscribirse en clases', status: 'pending', order: 2 },
      { id: 'o3t3', text: 'Comprar equipamiento básico', status: 'pending', order: 3 },
    ],
    priority: 'media',
    createdAt: daysAgo(5),
    urgency: 7,
  },
]

export const seedProjects: Project[] = [
  {
    id: 'p1',
    name: 'App Domo',
    status: 'active',
    startDate: daysAgo(60),
    projectedEndDate: dateStr(90),
    stages: [
      {
        id: 'p1s1', number: '1', name: 'Investigación y diseño',
        description: 'Mockups, PRD, sistema de diseño',
        status: 'completed', subTasks: [], completedDate: daysAgo(30),
      },
      {
        id: 'p1s2', number: '2', name: 'Diseño de interfaces',
        description: 'Componentes UI, pantallas en alta fidelidad',
        status: 'completed', subTasks: [], completedDate: daysAgo(5),
      },
      {
        id: 'p1s3', number: '3', name: 'Desarrollo frontend',
        description: 'React + TypeScript, todos los módulos',
        status: 'in_progress',
        progress: 15,
        subTasks: [
          { id: 'st1', text: 'Scaffold + design system', completed: true },
          { id: 'st2', text: 'Módulo Hábitos', completed: false },
          { id: 'st3', text: 'Módulo 900S', completed: false },
          { id: 'st4', text: 'Módulo Proyectos', completed: false },
        ],
        estimatedDate: dateStr(60),
      },
      {
        id: 'p1s4', number: '4', name: 'Testing y deploy',
        description: 'QA, optimización, deploy en Debian',
        status: 'pending', subTasks: [],
        estimatedDate: dateStr(85),
      },
    ],
    notes: [
      { id: 'n1', date: daysAgo(5), content: 'Decidí usar localStorage para v1 y migrar a IndexedDB cuando el volumen de 900S lo requiera.' },
      { id: 'n2', date: daysAgo(2), content: 'El módulo más crítico es la pantalla de urgencia — debe ser perfecta desde el día 1.' },
    ],
    subProjectIds: [],
    urgency: 1,
    createdAt: daysAgo(60),
  },
  {
    id: 'p2',
    name: 'Rediseño del Portfolio',
    status: 'active',
    startDate: daysAgo(50),
    projectedEndDate: dateStr(75),
    stages: [
      { id: 'p2s1', number: '1', name: 'Investigación y referencias', description: 'Análisis de portfolios referentes, moodboard, paleta', status: 'completed', subTasks: [], completedDate: daysAgo(30) },
      { id: 'p2s2', number: '2', name: 'Wireframes y estructura', description: 'Layout, flujo de navegación, prototipo low-fi', status: 'completed', subTasks: [], completedDate: daysAgo(15) },
      { id: 'p2s3', number: '3', name: 'Diseño visual y componentes', description: 'Design system, componentes UI, páginas en alta fidelidad', status: 'in_progress', progress: 60,
        subTasks: [
          { id: 'st1', text: 'Paleta y tipografía', completed: true },
          { id: 'st2', text: 'Componentes de formulario', completed: false },
          { id: 'st3', text: 'Páginas principales', completed: false },
        ],
        estimatedDate: dateStr(20),
      },
      { id: 'p2s4', number: '4', name: 'Desarrollo front-end', description: 'Implementación en React + Next.js, animaciones, deploy', status: 'pending', subTasks: [], estimatedDate: dateStr(55) },
      { id: 'p2s5', number: '5', name: 'Testing y lanzamiento', description: 'QA, optimización de performance, dominio y deploy final', status: 'pending', subTasks: [], estimatedDate: dateStr(72) },
    ],
    notes: [
      { id: 'n1', date: daysAgo(20), content: 'Decidí usar single-page con scroll suave. Mejor experiencia para portfolio corto.' },
      { id: 'n2', date: daysAgo(10), content: 'Los wireframes revelaron que necesito un proyecto hijo para el blog integrado.' },
    ],
    subProjectIds: [],
    urgency: 2,
    createdAt: daysAgo(50),
  },
]

// Generate 900S snapshots for today
export const seedSnapshots: S900Snapshot[] = [
  { id: 's1', timestamp: timeStr(7, 0), activity: 'Morning thinking — Journalist', category: 'escritura', edited: false },
  { id: 's2', timestamp: timeStr(7, 15), activity: 'Meditación + Ejercicio', category: 'ejercicio', edited: false },
  { id: 's3', timestamp: timeStr(8, 45), activity: 'Deep Work — App Domo frontend', category: 'programacion', edited: false },
  { id: 's4', timestamp: timeStr(9, 0), activity: 'Deep Work — App Domo frontend', category: 'programacion', edited: false },
  { id: 's5', timestamp: timeStr(9, 15), activity: 'Deep Work — App Domo frontend', category: 'programacion', edited: false },
  { id: 's6', timestamp: timeStr(10, 30), activity: 'Revisión diseño Portfolio', category: 'programacion', edited: false },
  { id: 's7', timestamp: timeStr(11, 30), activity: 'Journaling — Daily note', category: 'escritura', edited: false },
  { id: 's8', timestamp: timeStr(12, 0), activity: 'Almuerzo', category: 'descanso', edited: false },
  { id: 's9', timestamp: timeStr(12, 15), activity: 'Almuerzo', category: 'descanso', edited: false },
  { id: 's10', timestamp: timeStr(12, 45), activity: 'Lectura — Atomic Habits cap.11', category: 'lectura', edited: false },
  { id: 's11', timestamp: timeStr(13, 0), activity: 'Lectura — Atomic Habits cap.12', category: 'lectura', edited: false },
]

export const seedJournalistEntries: JournalistEntry[] = [
  {
    id: 'j1',
    type: 'morning_thinking',
    title: 'Morning thinking — ' + dateStr(),
    content: `# Morning thinking\n\nHoy me levanto con energía. Quiero enfocarme en terminar el scaffold de Domo y avanzar con los mockups del portfolio.\n\n**Una idea:** el sistema de urgencia 1/2/7 podría tener una visualización de semáforo en la pantalla principal.`,
    date: dateStr(),
    createdAt: timeStr(7, 5),
    updatedAt: timeStr(7, 20),
  },
  {
    id: 'j2',
    type: 'daily_note',
    title: 'Daily note — ' + daysAgo(1),
    content: `# Daily note\n\nDía productivo. Terminé 3 etapas del portfolio y avancé con la certificación AWS.\n\nMañana quiero levantarme más temprano para tener más horas de deep work.`,
    date: daysAgo(1),
    createdAt: daysAgo(1) + 'T22:00:00.000Z',
    updatedAt: daysAgo(1) + 'T22:15:00.000Z',
  },
]

export const defaultSettings: AppSettings = {
  userName: 'Aru',
  theme: 'dark',
  language: 'es',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  weekStartsOn: 1,
  s900IntervalMinutes: 15,
  s900Enabled: true,
  s900Categories: ['programacion', 'lectura', 'ejercicio', 'escritura', 'descanso', 'social', 'otro'],
}
