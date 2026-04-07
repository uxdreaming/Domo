# PRD — Domo: Sistema Personal de Gestión de Vida

**Versión:** 1.0
**Fecha:** Abril 2026
**Autor:** Aru
**Estado:** En revisión

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Planteamiento del Problema](#2-planteamiento-del-problema)
3. [Usuario Objetivo](#3-usuario-objetivo)
4. [Metas y Métricas de Éxito](#4-metas-y-métricas-de-éxito)
5. [Funcionalidades por Módulo](#5-funcionalidades-por-módulo)
6. [Modelos de Datos](#6-modelos-de-datos)
7. [Flujos de Usuario](#7-flujos-de-usuario)
8. [Sistema de Diseño y Guía de UI](#8-sistema-de-diseño-y-guía-de-ui)
9. [Arquitectura Técnica](#9-arquitectura-técnica)
10. [Fuera de Alcance (v1)](#10-fuera-de-alcance-v1)
11. [Consideraciones Futuras](#11-consideraciones-futuras)

---

## 1. Resumen Ejecutivo

Domo es una aplicación web personal de tema oscuro construida con React + TypeScript que funciona como un **sistema operativo de vida personal**. Integra en una sola interfaz:

- **Hábitos** con sistema Min/Max (mínimo y máximo diario) y seguimiento de rachas
- **Objetivos** estructurados en tareas con fechas límite y prioridades
- **Proyectos** con etapas tipo Kanban y notas de proceso
- **900S** — sistema de auditoría de tiempo por snapshots cada 15 minutos (900 segundos)
- **Journalist** — módulo de escritura e introspección sincronizado con Obsidian

Todo funciona en el cliente (localStorage) sin necesidad de backend en la versión inicial. La aplicación está diseñada para uso personal exclusivo del usuario Aru, con soporte de importación de datos vía JSON generado por IA (Claude).

---

## 2. Planteamiento del Problema

El usuario gestiona múltiples dimensiones de su vida personal —hábitos diarios, proyectos creativos y de desarrollo, objetivos a mediano plazo, prácticas de escritura y reflexión— utilizando una combinación dispersa de herramientas: Obsidian para notas, archivos JSON para objetivos generados con Claude, hojas de cálculo para seguimiento. Esta fragmentación genera:

- **Pérdida de contexto**: sin una vista unificada es difícil ver cómo los hábitos impactan los proyectos.
- **Fricción para el registro**: herramientas separadas aumentan la resistencia para registrar actividades cotidianas.
- **Sin auditoría de tiempo real**: no existe un mecanismo que capture de forma regular qué se está haciendo durante el día.
- **Desconexión entre intención y ejecución**: objetivos y proyectos existen en documentos separados de los hábitos que los sostienen.

Domo resuelve esto unificando todas estas dimensiones en una sola aplicación de escritorio/web, con flujos de registro de baja fricción y visualizaciones que hacen visible el progreso a lo largo del tiempo.

---

## 3. Usuario Objetivo

**Usuario primario:** Aru — desarrollador/creativo individual, usuario avanzado de herramientas de productividad personal, con un sistema de vida establecido basado en hábitos, proyectos activos y práctica de escritura.

### Perfil del usuario

| Atributo | Descripción |
|---|---|
| Nombre | Aru |
| Tipo de uso | Personal, uso diario intensivo |
| Dispositivo principal | Computadora de escritorio/laptop, navegador web |
| Idioma | Español |
| Herramientas actuales | Obsidian, Claude AI, JSON estructurado |
| Nivel técnico | Alto — puede editar archivos JSON, entiende la estructura de datos |
| Motivación principal | Visibilidad del progreso, reducción de fricción en el registro, coherencia entre hábitos y metas |

### Casos de uso principales

1. Revisar el dashboard cada mañana para orientar el día
2. Marcar hábitos completados (mínimo y máximo) a lo largo del día
3. Responder el popup de 900S cada 15 minutos cuando está trabajando
4. Revisar el avance de proyectos activos semanalmente
5. Importar objetivos nuevos generados por Claude vía JSON
6. Registrar entradas de Journalist (diario, revisiones semanales/mensuales)

---

## 4. Metas y Métricas de Éxito

### Metas del producto

1. **Centralización**: Consolidar la gestión de hábitos, objetivos, proyectos, tiempo y escritura en una sola interfaz.
2. **Baja fricción**: Cada interacción de registro debe completarse en menos de 30 segundos.
3. **Visibilidad del progreso**: El usuario debe poder responder "¿qué tan bien me está yendo?" mirando el dashboard en menos de 10 segundos.
4. **Consistencia del sistema**: Las conexiones entre módulos (hábito vinculado a objetivo, journal vinculado a hábito) deben ser visibles y navegables.

### Métricas de éxito

| Métrica | Meta v1 |
|---|---|
| Tasa de respuesta 900S | > 70% de los snapshots diarios respondidos |
| Hábitos marcados diariamente | Registro de Min completado en > 80% de los días |
| Tiempo de carga inicial | < 1 segundo (datos desde localStorage) |
| Tiempo para completar registro 900S | < 20 segundos desde apertura del popup |
| Tiempo para marcar un hábito | < 5 segundos desde apertura de la app |
| Importación de JSON sin errores | 100% de los JSONs válidos importados correctamente |

---

## 5. Funcionalidades por Módulo

---

### 5.1 Sidebar (Componente Global Persistente)

El sidebar es el componente de navegación principal, siempre visible.

#### Requisitos funcionales

| ID | Requisito |
|---|---|
| SB-01 | Mostrar logo "D" como avatar + texto "Domo" |
| SB-02 | Mostrar ítem de navegación con ícono y etiqueta para: Dashboard, Hábitos, Objetivos, Proyectos, 900S, Journalist, Settings |
| SB-03 | Resaltar el ítem activo con fondo diferenciado |
| SB-04 | Mostrar en la parte inferior un indicador de estado 900S: punto rojo + texto "900S activo · HH:MM" |
| SB-05 | El indicador de tiempo 900S debe actualizarse cada segundo mostrando el tiempo transcurrido desde el último snapshot |
| SB-06 | El indicador 900S debe estar visible en todo momento mientras el sistema esté activo |
| SB-07 | Hacer clic en cualquier ítem de navegación actualiza la vista principal sin recargar la página |

#### Requisitos no funcionales

- El sidebar ocupa un ancho fijo (aprox. 220px) y no colapsa en la versión v1.
- El componente es completamente independiente del contenido de la vista principal.

---

### 5.2 Dashboard

Vista principal al iniciar la aplicación. Ofrece un resumen del estado actual del día.

#### Requisitos funcionales

| ID | Requisito |
|---|---|
| DB-01 | Mostrar saludo dinámico: "Buenos días/tardes/noches, Aru" según la hora del sistema |
| DB-02 | Mostrar la fecha actual formateada: ej. "Lunes, 6 de Abril 2026" |
| DB-03 | **Tarjeta Rachas Activas**: número total de hábitos con racha > 0 + subtexto "hábitos con racha activa" |
| DB-04 | **Tarjeta 900S Hoy**: mini gráfica de barras de las últimas horas + texto "Xh Xm registradas hoy" |
| DB-05 | **Tarjeta Proyectos Activos**: total de proyectos con estado activo + "X en progreso · X planificados" |
| DB-06 | **Tarjeta Objetivos**: porcentaje de progreso promedio + barra de progreso + "progreso promedio" |
| DB-07 | **Panel Hábitos de Hoy** (izquierda): lista de todos los hábitos del día con checkbox Min y checkbox Max por separado, ícono de fuego + número de racha, contador "X/Y completados" |
| DB-08 | Marcar Min o Max en el panel de Hábitos de Hoy actualiza inmediatamente el estado en localStorage |
| DB-09 | **Panel 900S Reciente** (derecha): feed cronológico de los últimos snapshots del día con punto de color por categoría, descripción de actividad, rango horario y duración |
| DB-10 | El panel 900S Reciente muestra los snapshots más recientes primero |
| DB-11 | Si no hay snapshots del día en 900S, el panel muestra un estado vacío con mensaje invitando a registrar |

#### Layout

- Dos columnas en la fila inferior: Hábitos de Hoy (izquierda, ~60%) | 900S Reciente (derecha, ~40%)
- Las 4 tarjetas de estadísticas ocupan una fila completa en la parte superior

---

### 5.3 Módulo Hábitos

Sistema de seguimiento de hábitos con niveles mínimo y máximo, rachas y visualización histórica.

#### 5.3.1 Lista de Hábitos

| ID | Requisito |
|---|---|
| HB-01 | Mostrar encabezado "Hábitos" con badge del total de hábitos activos |
| HB-02 | Agrupar hábitos por categoría (ej. SALUD, PRODUCTIVIDAD, JOURNALIST) con encabezados de sección |
| HB-03 | Columnas de la tabla: Nombre \| Min (checkbox) \| Max (checkbox) \| Racha (número) \| 7 días (7 puntos de colores) |
| HB-04 | Los 7 puntos de "últimos 7 días" deben ser: morado si se completó el Mínimo, morado brillante/dorado si se completó el Máximo, gris si no se completó nada |
| HB-05 | El checkbox Min y Max en la lista permiten marcar/desmarcar el hábito del día actual directamente |
| HB-06 | Los hábitos vinculados a Journalist muestran un badge "J" en la columna Nombre |
| HB-07 | Hacer clic en la fila (fuera de los checkboxes) navega al detalle del hábito |
| HB-08 | Botón o acción para añadir nuevo hábito (modal o página de creación) |

#### 5.3.2 Detalle de Hábito

| ID | Requisito |
|---|---|
| HB-09 | Breadcrumb/botón de regreso a la lista de Hábitos |
| HB-10 | Encabezado: ícono de fuego + nombre del hábito + badge de categoría |
| HB-11 | Dos tarjetas de información: **Mínimo** (descripción de qué constituye completar el mínimo) \| **Máximo** (descripción del máximo) |
| HB-12 | Fila de estadísticas: Racha actual \| Racha máxima histórica \| Tasa de completado (%) |
| HB-13 | **Heatmap estilo GitHub**: grilla de los últimos 12 meses, eje X = semanas/meses, eje Y = días de la semana (Lun–Dom), coloreada por nivel de completado con tonalidades de morado |
| HB-14 | Leyenda del heatmap: sin datos / mínimo / máximo |
| HB-15 | **Gráficas de barras mensuales**: una barra por mes de los últimos 6 meses con porcentaje de completado como etiqueta encima |
| HB-16 | Botón para editar el hábito (nombre, descripción Min/Max, categoría) |

#### Modelo lógico de completado

- Cada hábito tiene dos checkboxes independientes por día: **Min** y **Max**.
- Completar **Max** implica automáticamente que **Min** también está completado.
- La **racha** se incrementa si se completa al menos el **Min** en días consecutivos.
- Si no se completa el Min en un día, la racha se reinicia a 0.

---

### 5.4 Módulo Objetivos

Gestión de objetivos con tareas estructuradas, fechas límite y vínculo con hábitos.

#### 5.4.1 Lista de Objetivos

| ID | Requisito |
|---|---|
| OB-01 | Mostrar encabezado "Objetivos" con badge de cantidad de objetivos activos |
| OB-02 | Botón "Import JSON" en la esquina superior derecha |
| OB-03 | Cada fila muestra: nombre del objetivo \| barra de progreso coloreada \| "X/Y tareas" \| fecha límite \| badge de estado |
| OB-04 | Estados posibles con colores: "En progreso" (ámbar), "Pendiente" (gris), "Completado" (verde) |
| OB-05 | Hacer clic en una fila navega al detalle del objetivo |
| OB-06 | Ordenamiento por defecto: objetivos "En progreso" primero, luego "Pendiente", luego "Completado" |

#### 5.4.2 Importación via JSON

| ID | Requisito |
|---|---|
| OB-07 | El botón "Import JSON" abre un modal con un área de texto para pegar JSON |
| OB-08 | El sistema valida la estructura del JSON antes de importar |
| OB-09 | Si el JSON es válido, muestra una vista previa del objetivo a importar |
| OB-10 | El objetivo importado recibe un badge "Generado via JSON · Claude AI" en su panel de detalles |
| OB-11 | Errores de validación se muestran en el modal con mensajes claros |
| OB-12 | Se soporta importación de un objetivo a la vez o múltiples en un array |

**Esquema JSON esperado para importación:**

```json
{
  "name": "string",
  "category": "string",
  "dueDate": "YYYY-MM-DD",
  "priority": "Alta|Media|Baja",
  "linkedHabitId": "string (opcional)",
  "tasks": [
    {
      "name": "string",
      "status": "pending|in_progress|completed"
    }
  ]
}
```

#### 5.4.3 Detalle de Objetivo

| ID | Requisito |
|---|---|
| OB-13 | Breadcrumb/botón de regreso a lista de Objetivos |
| OB-14 | Encabezado con nombre del objetivo |
| OB-15 | Badge de estado en la parte superior derecha |
| OB-16 | Meta info: fecha límite + "X de Y tareas completadas" |
| OB-17 | Barra de progreso general del objetivo |
| OB-18 | Lista numerada de tareas con íconos de estado: check completada (verde) \| circulo lleno en progreso (ámbar) \| circulo vacío pendiente (gris) |
| OB-19 | Cada tarea muestra nombre + tag opcional "En progreso" |
| OB-20 | Hacer clic en una tarea cambia su estado (ciclo: pendiente → en progreso → completado) |
| OB-21 | **Panel lateral "Detalles"**: fecha de creación, categoría, hábito vinculado (con ícono y enlace al hábito), prioridad (con punto de color), badge de importación si aplica |
| OB-22 | El hábito vinculado en el panel lateral es un enlace clickeable que navega al detalle del hábito |

---

### 5.5 Módulo Proyectos

Gestión de proyectos con etapas, sub-proyectos, vista Kanban y notas de proceso.

#### 5.5.1 Lista de Proyectos

| ID | Requisito |
|---|---|
| PR-01 | Mostrar encabezado "Proyectos" con badge del total |
| PR-02 | Botón "Import Roadmap" en la esquina superior derecha |
| PR-03 | Vista en cuadrícula de 2 columnas |
| PR-04 | Cada tarjeta muestra: ícono del proyecto \| nombre \| badge de estado \| "Etapa actual: [nombre]" \| barra de progreso "X/Y etapas" \| timestamp de última actualización o fecha de creación |
| PR-05 | Hacer clic en una tarjeta navega al detalle del proyecto |
| PR-06 | Estados de proyecto: "Activo" (verde), "Planificado" (gris), "Pausado" (ámbar), "Completado" (morado) |

#### 5.5.2 Detalle de Proyecto

| ID | Requisito |
|---|---|
| PR-07 | Breadcrumb "Proyectos" + nombre del proyecto + badge de estado en la parte superior |
| PR-08 | Fila de metadatos: fecha de inicio \| fecha de proyección/entrega \| cantidad de sub-proyectos |
| PR-09 | **Tablero Kanban** con 4 columnas fijas: Completada \| En progreso \| Pendiente \| Notas del proceso |
| PR-10 | Las tarjetas de etapa muestran: número de etapa \| nombre \| descripción breve |
| PR-11 | Etapas completadas muestran la fecha de completado |
| PR-12 | Etapas en progreso muestran "En progreso · X%" con subtareas tipo checklist |
| PR-13 | Etapas pendientes muestran la fecha estimada |
| PR-14 | La columna "Notas del proceso" muestra entradas de notas con fecha + texto, y un botón "+ Agregar nota" |
| PR-15 | Al hacer clic en "+ Agregar nota" se abre un input inline para escribir la nota |
| PR-16 | Drag-and-drop para mover etapas entre columnas del Kanban (deseable para v1.1) |
| PR-17 | Las subtareas de una etapa "En progreso" son checkboxes que actualizan el porcentaje de la etapa |

---

### 5.6 Módulo 900S

Sistema de auditoría temporal mediante snapshots cada 15 minutos (900 segundos). El objetivo es capturar qué está haciendo el usuario de forma regular para generar datos de uso del tiempo.

#### 5.6.1 Popup 900S (Modal de Registro)

El popup es el componente más crítico del módulo: aparece automáticamente cada 15 minutos.

| ID | Requisito |
|---|---|
| 9S-01 | El sistema mantiene un temporizador interno de 15 minutos desde el último snapshot registrado o desde que se inició la sesión |
| 9S-02 | Al cumplirse 15 minutos, aparece un modal overlay sobre toda la interfaz |
| 9S-03 | El modal muestra un badge "900S · HH:MM" con punto rojo indicando la hora del snapshot |
| 9S-04 | Título: "¿Qué estás haciendo ahora mismo?" |
| 9S-05 | Campo de texto libre con placeholder "Escribe lo que estás haciendo..." |
| 9S-06 | Sección "Categoría rápida" con chips seleccionables: Programación (ícono código) \| Lectura (ícono libro) \| Ejercicio (ícono mancuerna) \| Escritura (ícono pluma) \| Descanso (ícono café) \| Social (ícono personas) |
| 9S-07 | Solo se puede seleccionar una categoría a la vez |
| 9S-08 | Botón "Saltar" (estilo secundario oscuro): cierra el modal sin guardar, snapshot queda como omitido |
| 9S-09 | Botón "Registrar" (estilo primario rojo): guarda el snapshot con hora, actividad y categoría, reinicia el timer |
| 9S-10 | El botón "Registrar" se habilita solo si hay texto en el campo de actividad O se ha seleccionado una categoría |
| 9S-11 | Footer del modal: "Próximo check-in en MM:SS" con cuenta regresiva en tiempo real |
| 9S-12 | Si el usuario está en el modal y no lo responde, la cuenta regresiva del footer continúa hacia el siguiente check-in |
| 9S-13 | El popup no bloquea el sonido ni interrumpe procesos externos; es solo visual |
| 9S-14 | El temporizador persiste en localStorage para sobrevivir recargas de página |

#### 5.6.2 Dashboard 900S

| ID | Requisito |
|---|---|
| 9S-15 | Encabezado "900S Dashboard" con tabs de filtro temporal: Día \| Semana \| Mes \| Año |
| 9S-16 | **Tarjeta Registros**: cantidad de snapshots en el período \| "de X posibles (Y%)" donde X = minutos del período / 15 |
| 9S-17 | **Tarjeta Categoría Principal**: nombre de la categoría con más tiempo \| porcentaje \| horas totales |
| 9S-18 | **Tarjeta Tiempo Productivo**: porcentaje de tiempo en categorías productivas (Programación + Escritura + Lectura) \| variación vs período anterior |
| 9S-19 | **Tarjeta Snapshots Hoy**: "X / Y" completados hoy \| ritmo por hora \| horas registradas |
| 9S-20 | **Gráfica de distribución por categoría**: barras verticales con porcentaje por categoría para el período seleccionado, colores según sistema de diseño |
| 9S-21 | **Historial reciente**: lista cronológica con HH:MM \| categoría (badge de color) \| descripción de actividad |
| 9S-22 | **Sección "Correlación con hábitos"**: lista de insights generados localmente basados en coincidencias de fechas entre snapshots y logs de hábitos |
| 9S-23 | El tab activo por defecto al entrar al módulo es "Semana" |

#### Lógica de categorías productivas

- **Productivas**: Programación, Lectura, Escritura
- **Neutras**: Descanso, Social
- **Otras**: Ejercicio (positivo pero no directamente productivo), Otro

---

### 5.7 Módulo Journalist

Módulo especializado para hábitos de escritura e introspección, con sincronización con Obsidian.

| ID | Requisito |
|---|---|
| JN-01 | Encabezado "Journalist" con badge del número de hábitos de escritura |
| JN-02 | Subtítulo descriptivo: "Prácticas de escritura e introspección · Contenido en DOMO/ #Journalist" |
| JN-03 | Tabla con las mismas columnas que Hábitos Lista: nombre \| Min \| Max \| Racha \| 7 días |
| JN-04 | Cada fila muestra el ícono del hábito + nombre + descripción breve del Min/Max como subtexto |
| JN-05 | Agrupar hábitos por subcategoría: DIARIO \| REVISIONES \| CREATIVOS |
| JN-06 | Los checkboxes Min/Max funcionan igual que en el módulo de Hábitos |
| JN-07 | **Barra de estado inferior**: indicador "Obsidian sync · DOMO/ #Journalist · Última sync: hace X min" |
| JN-08 | La barra de estado de sync muestra el tiempo transcurrido desde la última sincronización, actualizándose cada minuto |
| JN-09 | En v1, la "sincronización" con Obsidian es un indicador de estado simulado; la integración real es futura |

#### Hábitos de Journalist predefinidos

| Subcategoría | Hábito | Min | Max |
|---|---|---|---|
| DIARIO | Morning thinking | Escribir 1 pensamiento | Escribir reflexión completa (10+ min) |
| DIARIO | Daily note | Crear la nota del día | Completar template con revisión |
| REVISIONES | Weekly review | Revisar la semana brevemente | Review completo con métricas |
| REVISIONES | Monthly review | Revisar el mes | Review profundo con objetivos |
| REVISIONES | Yearly review | Revisión anual básica | Revisión completa y planificación |
| CREATIVOS | Writings | Escribir un párrafo | Publicar o completar pieza |
| CREATIVOS | Buyo | Registrar 1 entrada | Sesión completa de escritura libre |

---

### 5.8 Módulo Settings

Configuración de la aplicación.

| ID | Requisito |
|---|---|
| ST-01 | Sub-navegación izquierda con secciones: General \| Hábitos \| 900S \| Integraciones \| Datos |
| ST-02 | **General — Tema**: botones toggle "Oscuro" (activo) \| "Claro" |
| ST-03 | **General — Idioma**: dropdown, opciones: Español (default), English |
| ST-04 | **General — Formato de fecha**: dropdown: DD/MM/YYYY \| MM/DD/YYYY \| YYYY-MM-DD |
| ST-05 | **General — Formato de hora**: toggle 24h (activo) \| 12h |
| ST-06 | **General — Inicio de semana**: dropdown: Lunes (default) \| Domingo |
| ST-07 | **900S — Intervalo de check-in**: número editable (default: 15 minutos) |
| ST-08 | **900S — Horario activo**: hora de inicio y hora de fin del día para el sistema 900S |
| ST-09 | **900S — Activar/desactivar sistema**: toggle para pausar el 900S sin perder la configuración |
| ST-10 | **Hábitos — Gestión**: lista de hábitos con acciones de edición, eliminación y reordenamiento |
| ST-11 | **Datos — Exportar**: botón para exportar todos los datos a JSON |
| ST-12 | **Datos — Importar**: botón para importar un JSON de backup completo |
| ST-13 | **Datos — Reset**: botón para borrar todos los datos locales (con confirmación de doble clic) |
| ST-14 | Todos los cambios en Settings se aplican y guardan inmediatamente (no hay botón "Guardar") |

---

## 6. Modelos de Datos

Todos los datos se almacenan en `localStorage` del navegador, bajo claves con prefijo `domo_`.

### 6.1 Habit

```typescript
interface Habit {
  id: string;                    // UUID v4
  name: string;
  category: string;              // "SALUD" | "PRODUCTIVIDAD" | "JOURNALIST" | custom
  minDescription: string;        // Descripción de qué constituye completar el Mínimo
  maxDescription: string;        // Descripción de qué constituye completar el Máximo
  icon?: string;                 // Nombre del ícono (opcional)
  isJournalist: boolean;         // True si pertenece al módulo Journalist
  journalistSubcategory?: "DIARIO" | "REVISIONES" | "CREATIVOS";
  order: number;                 // Orden dentro de su categoría
  createdAt: string;             // ISO 8601
  isActive: boolean;             // Soft delete
}

interface HabitLog {
  id: string;                    // UUID v4
  habitId: string;               // FK -> Habit.id
  date: string;                  // "YYYY-MM-DD"
  minCompleted: boolean;
  maxCompleted: boolean;         // Si true, minCompleted también debe ser true
  timestamp: string;             // ISO 8601 de cuándo se registró
}

// Datos derivados (calculados en runtime, no almacenados)
interface HabitStats {
  habitId: string;
  currentStreak: number;         // Días consecutivos con Min completado hasta hoy
  maxStreak: number;             // Racha máxima histórica
  completionRate: number;        // Porcentaje de días completados (Min) en los últimos 30 días
  last7Days: DayStatus[];        // Array de 7 elementos para los últimos 7 días
}

type DayStatus = "none" | "min" | "max";
```

### 6.2 Objective

```typescript
interface Objective {
  id: string;                    // UUID v4
  name: string;
  category: string;
  status: ObjectiveStatus;
  dueDate: string;               // "YYYY-MM-DD"
  priority: "Alta" | "Media" | "Baja";
  linkedHabitId?: string;        // FK -> Habit.id (opcional)
  tasks: ObjectiveTask[];
  createdAt: string;             // ISO 8601
  importedFromAI: boolean;       // True si fue importado via JSON de Claude
  notes?: string;
}

type ObjectiveStatus = "pending" | "in_progress" | "completed";

interface ObjectiveTask {
  id: string;                    // UUID v4
  name: string;
  status: TaskStatus;
  order: number;
  completedAt?: string;          // ISO 8601, si está completada
}

type TaskStatus = "pending" | "in_progress" | "completed";

// Dato derivado
interface ObjectiveProgress {
  objectiveId: string;
  completedTasks: number;
  totalTasks: number;
  percentage: number;            // 0-100
}
```

### 6.3 Project

```typescript
interface Project {
  id: string;                    // UUID v4
  name: string;
  icon?: string;                 // Emoji o nombre de ícono
  status: ProjectStatus;
  startDate: string;             // "YYYY-MM-DD"
  projectedEndDate?: string;     // "YYYY-MM-DD"
  subProjectCount: number;       // Contador de sub-proyectos vinculados
  stages: ProjectStage[];
  notes: ProjectNote[];
  createdAt: string;
  updatedAt: string;
}

type ProjectStatus = "active" | "planned" | "paused" | "completed";

interface ProjectStage {
  id: string;                    // UUID v4
  projectId: string;
  number: number;                // Número de etapa (1, 2, 3...)
  name: string;
  description: string;
  status: StageStatus;
  subTasks: StageSubTask[];
  completedAt?: string;          // ISO 8601
  estimatedDate?: string;        // "YYYY-MM-DD"
  order: number;
}

type StageStatus = "completed" | "in_progress" | "pending";

interface StageSubTask {
  id: string;
  name: string;
  completed: boolean;
}

interface ProjectNote {
  id: string;
  projectId: string;
  content: string;
  createdAt: string;             // ISO 8601
}

// Dato derivado
interface ProjectProgress {
  projectId: string;
  completedStages: number;
  totalStages: number;
  percentage: number;
  currentStage?: ProjectStage;   // La primera etapa con status "in_progress"
}
```

### 6.4 Snapshot900S

```typescript
interface Snapshot900S {
  id: string;                    // UUID v4
  timestamp: string;             // ISO 8601 — hora exacta del snapshot
  scheduledTime: string;         // ISO 8601 — hora en que debía aparecer el popup
  activity: string;              // Texto libre del usuario
  category: SnapshotCategory;
  skipped: boolean;              // True si el usuario hizo "Saltar"
}

type SnapshotCategory =
  | "programacion"
  | "lectura"
  | "ejercicio"
  | "escritura"
  | "descanso"
  | "social"
  | "otro";

interface Config900S {
  intervalMinutes: number;       // Default: 15
  activeStartTime: string;       // "HH:MM", default: "07:00"
  activeEndTime: string;         // "HH:MM", default: "23:00"
  isActive: boolean;
  lastSnapshotTime?: string;     // ISO 8601 — persiste entre recargas
}
```

### 6.5 AppSettings

```typescript
interface AppSettings {
  theme: "dark" | "light";
  language: "es" | "en";
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  timeFormat: "24h" | "12h";
  startOfWeek: "monday" | "sunday";
  userName: string;              // Default: "Aru"
}
```

### 6.6 Claves de localStorage

| Clave | Contenido |
|---|---|
| `domo_habits` | `Habit[]` |
| `domo_habit_logs` | `HabitLog[]` |
| `domo_objectives` | `Objective[]` |
| `domo_projects` | `Project[]` |
| `domo_snapshots_900s` | `Snapshot900S[]` |
| `domo_config_900s` | `Config900S` |
| `domo_settings` | `AppSettings` |

---

## 7. Flujos de Usuario

### 7.1 Flujo de inicio del día

```
Abrir Domo
  └─> Dashboard
        ├─> Ver saludo con fecha actual
        ├─> Revisar 4 tarjetas de resumen
        ├─> Panel Hábitos de Hoy → marcar Min de hábitos matutinos
        └─> Panel 900S Reciente (vacío al inicio del día)
```

### 7.2 Flujo de registro 900S

```
[Timer llega a 15 min]
  └─> Aparece modal 900S
        ├─> Opción A: Escribir actividad + seleccionar categoría → "Registrar"
        │     └─> Snapshot guardado → modal se cierra → timer reinicia
        └─> Opción B: "Saltar"
              └─> Modal se cierra → snapshot marcado como skipped → timer continúa
```

### 7.3 Flujo de importación de objetivo via JSON

```
Objetivos → Lista
  └─> Clic "Import JSON"
        └─> Modal de importación
              ├─> Pegar JSON en área de texto
              ├─> Validación automática
              │     ├─> Error → mostrar mensaje con campo problemático
              │     └─> Válido → mostrar vista previa del objetivo
              └─> Confirmar importación
                    └─> Objetivo creado con badge "Generado via JSON · Claude AI"
                          └─> Navegar al detalle del objetivo recién creado
```

### 7.4 Flujo de progreso de proyecto

```
Proyectos → Lista → Tarjeta de proyecto
  └─> Detalle del proyecto
        └─> Tablero Kanban
              ├─> Ver etapas en columnas
              ├─> Clic en subtarea de etapa "En progreso" → checkbox toggle
              │     └─> Porcentaje de la etapa se actualiza
              ├─> Cuando todas las subtareas completan → etapa pasa a "Completada"
              └─> Columna "Notas" → "+ Agregar nota" → input inline → Enter para guardar
```

### 7.5 Flujo de revisión de hábito

```
Hábitos → Lista
  └─> Clic en fila de hábito
        └─> Detalle del hábito
              ├─> Ver estadísticas: racha actual, racha máxima, tasa de completado
              ├─> Explorar heatmap de 12 meses
              └─> Ver barras de progreso mensual
```

### 7.6 Flujo de configuración de 900S

```
Settings → Sub-nav "900S"
  └─> Ajustar intervalo (default 15 min)
  └─> Ajustar horario activo (inicio: 07:00, fin: 23:00)
  └─> Toggle activar/desactivar
        └─> Si desactiva → indicador del sidebar cambia a inactivo/gris
```

---

## 8. Sistema de Diseño y Guía de UI

### 8.1 Paleta de colores

#### Fondos

| Rol | Color hex | Uso |
|---|---|---|
| Background principal | `#0D0F14` | Fondo del body/main content |
| Background cards | `#161820` | Tarjetas, paneles, modales |
| Background sidebar | `#111318` | Sidebar de navegación |
| Background input | `#1C1F28` | Campos de formulario, inputs |
| Border sutil | `#2A2D3A` | Bordes de separación |

#### Colores funcionales

| Rol | Color | Uso |
|---|---|---|
| Primario 900S / acciones | `#E53935` rojo | Botón Registrar, indicador 900S activo |
| Hábitos / Productividad | `#7C3AED` morado-indigo | Heatmap, badges de productividad |
| Activo / Progreso positivo | `#10B981` verde | Rachas activas, estado completado |
| Objetivos / Advertencia | `#F59E0B` ámbar | Estado "En progreso", prioridad media |
| Inactivo / Sin datos | `#374151` gris oscuro | Días sin completar, estado pendiente |
| Texto principal | `#F3F4F6` | Texto primario |
| Texto secundario | `#9CA3AF` | Texto de apoyo, metadatos |
| Texto terciario | `#6B7280` | Timestamps, etiquetas secundarias |

#### Colores de categorías 900S

| Categoría | Color |
|---|---|
| Programación | `#10B981` verde |
| Lectura | `#6366F1` indigo |
| Ejercicio | `#F97316` naranja |
| Escritura | `#8B5CF6` morado |
| Descanso | `#6B7280` gris |
| Social | `#60A5FA` azul claro |
| Otro | `#EF4444` rojo |

### 8.2 Tipografía

- **Familia**: Inter (principal), con fallback a system-ui, sans-serif
- **Tamaños**:
  - H1 (títulos de página): 24px / font-bold
  - H2 (títulos de sección): 18px / font-semibold
  - H3 (títulos de tarjeta): 14px / font-semibold
  - Body: 14px / font-normal
  - Small / metadata: 12px / font-normal
  - Badge: 11px / font-medium

### 8.3 Componentes reutilizables

#### Badge de estado
- Forma: pill redondeado (border-radius: 9999px)
- Padding: 2px 8px
- Tamaño de texto: 11px / font-medium
- Variantes: success (verde), warning (ámbar), default (gris), error (rojo), purple (morado)

#### Tarjeta de estadística (Stat Card)
- Background: `#161820`
- Border: `1px solid #2A2D3A`
- Border-radius: 12px
- Padding: 20px
- Estructura: label pequeño arriba + valor grande + subtexto

#### Barra de progreso
- Height: 6px
- Background track: `#2A2D3A`
- Fill: color según contexto (verde para completado, ámbar para en progreso)
- Border-radius: 3px

#### Checkbox Min/Max
- Forma circular (para distinguirlos de checkboxes estándar cuadrados)
- Min: borde morado, fill morado al completar
- Max: borde dorado/ámbar, fill dorado al completar

#### Punto de día (7-day dots)
- Tamaño: 8px de diámetro
- none: `#374151`
- min: `#7C3AED`
- max: `#F59E0B`

### 8.4 Spacing y layout

- Sistema de espaciado: múltiplos de 4px (4, 8, 12, 16, 20, 24, 32, 40, 48px)
- Ancho del sidebar: 220px fijo
- Padding del contenido principal: 32px
- Gap entre tarjetas: 16px
- Grid de proyectos: 2 columnas con gap 16px

### 8.5 Iconografía

- Librería: Lucide React
- Tamaño estándar: 16px (inline) / 20px (nav) / 24px (encabezados)
- Íconos clave: Flame (racha), Check (completado), Circle (pendiente), Timer (900S), BookOpen (Journalist)

### 8.6 Estados de interacción

- **Hover en filas de tabla**: background `#1C1F28`
- **Hover en botones**: opacity 90% o shade más claro
- **Focus en inputs**: outline `2px solid #7C3AED`
- **Transiciones**: 150ms ease para cambios de estado visual

### 8.7 Responsive

- La app está diseñada para uso en escritorio (min-width: 1200px)
- No se requiere soporte móvil en v1
- Mínimo funcional aceptable: 1024px de ancho

---

## 9. Arquitectura Técnica

### 9.1 Stack tecnológico

| Tecnología | Versión recomendada | Rol |
|---|---|---|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Tipado estático |
| Vite | 5.x | Build tool y dev server |
| Tailwind CSS | 3.x | Estilos utilitarios |
| Recharts | 2.x | Gráficas (heatmap, barras, líneas) |
| date-fns | 3.x | Manipulación de fechas |
| Lucide React | latest | Iconografía |
| uuid | latest | Generación de IDs |
| React Router | 6.x | Navegación entre módulos |

### 9.2 Estructura de directorios

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── StatCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── HabitCheckbox.tsx
│   │   ├── DayDots.tsx
│   │   └── Button.tsx
│   ├── habits/
│   │   ├── HabitsList.tsx
│   │   ├── HabitDetail.tsx
│   │   ├── HabitHeatmap.tsx
│   │   └── HabitMonthlyChart.tsx
│   ├── objectives/
│   │   ├── ObjectivesList.tsx
│   │   ├── ObjectiveDetail.tsx
│   │   └── ImportJsonModal.tsx
│   ├── projects/
│   │   ├── ProjectsList.tsx
│   │   ├── ProjectDetail.tsx
│   │   └── KanbanBoard.tsx
│   ├── 900s/
│   │   ├── Dashboard900S.tsx
│   │   ├── Popup900S.tsx
│   │   └── Snapshot900STimer.tsx
│   ├── journalist/
│   │   └── JournalistView.tsx
│   └── settings/
│       └── SettingsView.tsx
├── pages/
│   ├── DashboardPage.tsx
│   ├── HabitsPage.tsx
│   ├── HabitDetailPage.tsx
│   ├── ObjectivesPage.tsx
│   ├── ObjectiveDetailPage.tsx
│   ├── ProjectsPage.tsx
│   ├── ProjectDetailPage.tsx
│   ├── Dashboard900SPage.tsx
│   ├── JournalistPage.tsx
│   └── SettingsPage.tsx
├── store/
│   ├── habitsStore.ts
│   ├── objectivesStore.ts
│   ├── projectsStore.ts
│   ├── snapshots900sStore.ts
│   ├── settingsStore.ts
│   └── index.ts
├── hooks/
│   ├── useHabitStats.ts
│   ├── use900STimer.ts
│   ├── useLocalStorage.ts
│   └── useObjectiveProgress.ts
├── utils/
│   ├── dateUtils.ts
│   ├── habitUtils.ts
│   ├── statsUtils.ts
│   └── jsonImportUtils.ts
├── types/
│   └── index.ts
├── constants/
│   └── categories.ts
├── App.tsx
├── main.tsx
└── index.css
```

### 9.3 Gestión de estado

Se recomienda **Zustand** con el middleware `persist` para sincronización automática con localStorage:

```typescript
const useHabitsStore = create<HabitsStore>()(
  persist(
    (set, get) => ({
      habits: [],
      habitLogs: [],
      addHabit: (habit) => set(state => ({ habits: [...state.habits, habit] })),
      toggleHabitLog: (habitId, date, field) => { /* lógica de toggle */ },
      getStatsForHabit: (habitId) => { /* cálculo de racha */ },
    }),
    { name: 'domo_habits' }
  )
);
```

Si se prefiere sin dependencias adicionales, usar React Context + useReducer con un `useEffect` que persiste en cada cambio de estado.

### 9.4 Lógica del timer 900S

El timer de 900S debe sobrevivir navegación entre páginas y recargas de página.

```typescript
// Pseudocódigo del hook use900STimer
function use900STimer() {
  const config = useConfig900SStore();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!config.isActive) return;

    const lastSnapshot = config.lastSnapshotTime
      ? new Date(config.lastSnapshotTime)
      : new Date();

    const interval = config.intervalMinutes * 60 * 1000;
    const nextCheckIn = new Date(lastSnapshot.getTime() + interval);
    const msUntilNext = nextCheckIn.getTime() - Date.now();

    if (msUntilNext <= 0) {
      // Ya pasó el tiempo, mostrar popup inmediatamente
      if (isWithinActiveHours(config)) setShowPopup(true);
      return;
    }

    const timeout = setTimeout(() => {
      if (isWithinActiveHours(config)) setShowPopup(true);
    }, msUntilNext);

    return () => clearTimeout(timeout);
  }, [config.lastSnapshotTime, config.isActive, config.intervalMinutes]);

  return { showPopup, closePopup: () => setShowPopup(false) };
}
```

### 9.5 Cálculo de rachas de hábitos

```typescript
// habitUtils.ts
function calculateCurrentStreak(habitId: string, logs: HabitLog[]): number {
  const completedDates = logs
    .filter(l => l.habitId === habitId && l.minCompleted)
    .map(l => l.date)
    .sort()
    .reverse();

  if (completedDates.length === 0) return 0;

  let streak = 0;
  let checkDate = format(new Date(), 'yyyy-MM-dd');

  for (const logDate of completedDates) {
    if (logDate === checkDate) {
      streak++;
      checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd');
    } else if (logDate === format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd')) {
      // Permitir un día de gracia si hoy aún no se ha marcado
      streak++;
      checkDate = logDate;
    } else {
      break;
    }
  }

  return streak;
}
```

### 9.6 Enrutamiento

```typescript
// App.tsx con React Router v6
<Routes>
  <Route path="/" element={<DashboardPage />} />
  <Route path="/habitos" element={<HabitsPage />} />
  <Route path="/habitos/:id" element={<HabitDetailPage />} />
  <Route path="/objetivos" element={<ObjectivesPage />} />
  <Route path="/objetivos/:id" element={<ObjectiveDetailPage />} />
  <Route path="/proyectos" element={<ProjectsPage />} />
  <Route path="/proyectos/:id" element={<ProjectDetailPage />} />
  <Route path="/900s" element={<Dashboard900SPage />} />
  <Route path="/journalist" element={<JournalistPage />} />
  <Route path="/settings" element={<SettingsPage />} />
</Routes>
```

### 9.7 Estimación de almacenamiento en localStorage

| Fuente de datos | Estimación anual |
|---|---|
| Snapshots 900S (~40/día × 200 bytes) | ~3 MB |
| Logs de hábitos (~10 hábitos × 365 días × 100 bytes) | ~365 KB |
| Objetivos + Proyectos | < 500 KB |
| **Total estimado** | **~4 MB / año** |

LocalStorage tiene un límite de ~5–10 MB. Se recomienda implementar una función de limpieza/archivado que exporte datos de años anteriores a JSON descargable cuando el almacenamiento supere el 80% del límite.

### 9.8 Seed de datos iniciales

Al iniciar por primera vez (sin datos en localStorage), la app carga un conjunto de datos de ejemplo:

- Hábitos predefinidos del sistema de Aru organizados por categorías (Salud, Productividad, Journalist)
- Sin objetivos ni proyectos (el usuario los crea o importa)
- Configuración 900S activa por defecto: 07:00 – 23:00, intervalo 15 min
- Settings: español, tema oscuro, formato DD/MM/YYYY, inicio de semana lunes

---

## 10. Fuera de Alcance (v1)

| Elemento | Razón |
|---|---|
| Sincronización real con Obsidian | Requiere integración con plugin o API de Obsidian; complejidad elevada |
| Backend / base de datos remota | v1 es 100% client-side |
| Autenticación / multi-usuario | App de uso personal exclusivo |
| Notificaciones push del sistema operativo | Requiere permisos del navegador; el popup 900S solo funciona con la pestaña abierta |
| Drag-and-drop en Kanban | Puede añadirse en v1.1 |
| Generación automática de insights 900S con IA | En v1, los insights son patrones pre-calculados localmente |
| Exportación a PDF | No prioritario |
| Service Worker / PWA completa | La app es client-side pero no requiere SW en v1 |
| Integración con Google Calendar | Futura |
| Modo Focus que pausa el 900S manualmente | Futura |
| Vista de calendario para hábitos (semana/mes) | Futura |

---

## 11. Consideraciones Futuras

### v1.1 (Post-lanzamiento inmediato)

- **Drag-and-drop en Kanban**: mover etapas entre columnas con mouse.
- **Notificaciones del navegador**: usar Notification API para alertar del 900S si la pestaña está en segundo plano.
- **Modo Focus para 900S**: botón manual para pausar el timer temporalmente.
- **Búsqueda global**: buscar hábitos, objetivos y proyectos desde el sidebar.
- **Vista de calendario para hábitos**: ver el estado de todos los hábitos en una grilla tipo calendario semanal o mensual.

### v1.2

- **Sincronización real con Obsidian**: a través del plugin Local REST API de Obsidian, leer y escribir notas desde Domo.
- **Importación de roadmap desde JSON**: similar a objetivos, importar un proyecto completo con etapas pre-definidas.
- **Templates de proyectos**: guardar proyectos como plantillas reutilizables.
- **Edición inline en listas**: editar nombre de tareas u objetivos directamente en la lista sin abrir detalle.

### v2.0

- **Backend con sincronización**: migrar de localStorage a una base de datos con acceso desde múltiples dispositivos (SQLite + API local, o Supabase).
- **Integración Claude AI nativa**: desde Domo, solicitar a Claude que genere objetivos, sugiera hábitos nuevos, o analice los patrones de 900S.
- **Módulo de revisiones asistidas**: guía interactiva para completar la weekly review y monthly review dentro de Domo con prompts predefinidos.
- **Dashboard de energía**: correlacionar categorías 900S con horas del día para identificar picos de productividad personal.
- **App de escritorio con Tauri o Electron**: para notificaciones nativas del sistema operativo y ejecución sin necesidad de navegador.

### Consideraciones técnicas de escalabilidad

- A medida que los datos históricos crezcan, migrar de `localStorage` a **IndexedDB** para mayor capacidad y mejor rendimiento en consultas complejas.
- Implementar memoización (useMemo/useCallback) o una capa de caché para los cálculos de heatmap y rachas que se recalculan en cada render.
- Considerar **Web Workers** para el procesamiento de datos históricos masivos sin bloquear el hilo principal de React.

---

*Documento creado: Abril 2026. Versión 1.0.*
