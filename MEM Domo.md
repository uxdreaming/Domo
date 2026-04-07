# MEM Domo
> Documento de memoria completa del proyecto. No es el README técnico — es la fuente de verdad conceptual de Domo.
> Última actualización: 7 Abril 2026

---

## Visión

Domo es un **sistema de vida personal** — no una app de productividad. Es la infraestructura que permite a Aru invertir su tiempo con intención, medir el impacto de sus decisiones a lo largo del tiempo, y recuperar tiempo de calidad para lo que realmente importa.

El objetivo final: cuando Aru consiga trabajo, va a volar. Domo es el sistema que lo prepara para eso.

**Filosofía central:** Domo existe para cuando podés usarlo. No para castigarte cuando no podés.

---

## Las 4 Áreas de Domo

### 1. Hábitos
### 2. Objetivos
### 3. Proyectos
### 4. Journalist

Estas cuatro áreas están interconectadas pero son independientes. Journalist alimenta nuevos Hábitos. Los Hábitos sostienen los Proyectos. Los Objetivos preparan el terreno para nuevos Hábitos.

---

## 1. Hábitos

### Filosofía
Los hábitos **nunca mueren — se transforman**. No existe "terminar" un hábito. Cuando una formación de AI for UX termina, el hábito se edita a "Portfolio AI for UX", luego a "Ampliar conocimientos de UX", y sigue vivo con otra forma. Editar un hábito no rompe ni resetea su racha.

### Sistema Min/Max
Cada hábito tiene dos niveles de cumplimiento diario:

- **Min** — versión mínima viable del día (ej: leer 15 minutos)
- **Max** — versión completa (ej: leer 8 capítulos)

Min y Max son **mutuamente excluyentes** — se marca uno u otro, nunca ambos. Marcar cualquiera de los dos cuenta como día cumplido. La elección depende de la energía y disponibilidad del día.

### Frecuencias y Cobertura de Racha

Cada frecuencia tiene su propia cobertura al marcar Min o Max:

| Frecuencia | Cobertura Min | Cobertura Max | Pierde racha |
|---|---|---|---|
| Diario | Hoy + 1 día (2 días total) | Hoy + 3 días (4 días total) | Sí |
| Semanal | 1 semana | 2 semanas | Sí |
| Mensual | 1 mes | 2 meses | Sí |
| Anual | 1 año | 1 año | Sí |
| Personalizado | — | — | **Nunca** |

**Hábitos personalizados**: tienen días específicos de la semana (ej: Lunes y Jueves). Generalmente asociados a formaciones, webinars o compromisos con calendarios externos que Aru no controla. Si falta, puede repasar el video o prepararse para la próxima clase — nunca se pierde el aprendizaje, por lo tanto nunca se pierde la racha.

### Cobertura como Seguro Emocional
Los días de cobertura no son gamificación — son un **seguro contra lo imprevisto**. Si Aru trabaja 3 meses con disciplina, se desmaya y descansa una semana, no pierde todo su progreso. La cobertura protege el esfuerzo acumulado.

La **última acción** define la cobertura actual. Si el último registro fue Max, la cobertura es de Max. Si fue Min, la cobertura es de Min.

### Countdown por Hábito
Cada hábito muestra un **clock de cuenta regresiva** indicando cuánto tiempo resta antes de perder la racha. La hora exacta del último check-in importa para el cálculo. Esto genera urgencia visual y motiva a actuar.

### Rachas

**Racha Individual:**
- Empieza el día que se crea el hábito
- Se rompe si se vence la cobertura sin nuevo check-in
- Editar el hábito NO resetea la racha
- Eliminar el hábito sí termina la racha (es la única forma de terminar)
- Visible en el detalle de cada hábito

**Racha General:**
- Nunca se rompe
- Es un promedio acumulado del cumplimiento de TODOS los hábitos
- Se visualiza como un gráfico histórico día a día
- Muestra qué hábitos se hicieron cada día, ayer, antes de ayer, etc.
- Sirve para medir el impacto de decisiones en el tiempo
- Ejemplo: al agregar un nuevo hábito, se puede ver cómo afecta el promedio general

### Urgencia 1/2/7
Cada hábito (y elemento de Obj/Proj/Journ) tiene un estado de urgencia temporal asignado manualmente por Aru:

- **1** → prioritario para las próximas 24 horas (hoy)
- **2** → para los próximos 2 días
- **7** → para los próximos 7 días

Aru asigna estos estados. En el futuro, una IA los sugerirá automáticamente basándose en los datos.

---

## 2. Objetivos

### Filosofía
Los objetivos son **listas de tareas ordenadas y editables, medibles por impacto**. Son finitos — tienen una lista de pasos y una fecha de fin. A diferencia de los hábitos, los objetivos sí terminan.

### Tipos de Objetivos
- **Independientes**: construir un mueble, organizar la biblioteca digital
- **Preparatorios**: "Inscribirme en clases de natación" → habilita el hábito "Nadar"
- **Con múltiples tareas**: preparar certificación AWS (6 pasos ordenados)

### Características
- Lista secuencial de tareas (ordenadas)
- Fecha límite visible
- Progreso medible (X/Y tareas completadas)
- Importación de pasos via JSON generado por AI (ej: Claude AI)
- Los objetivos completados se archivan (no desaparecen)

### Estado 1/2/7 en Objetivos
Las tareas individuales de un objetivo pueden marcarse como 1, 2 o 7 para que aparezcan en la pantalla de inicio con la urgencia correspondiente.

---

## 3. Proyectos

### Filosofía
Los proyectos son **entidades vivas y documentadas**. Todo el mundo sabe lo que es un proyecto. Se diferencian de los objetivos en que requieren interfaces que permitan **deep focus** — concentración profunda y sostenida.

### Características
- Tienen **etapas que pueden mutar**: puede aparecer una etapa 2.1 que no estaba planificada
- Tienen **documentación del proceso** (making process) — notas por etapa
- Pueden **ramificarse** en sub-proyectos
- Tienen **proyección en el tiempo** (fecha de inicio, proyección de fin)
- Importación de roadmap inicial via JSON

### Vista
Kanban por etapas con área de notas/documentación. Las notas del proceso son parte del valor del proyecto — registran decisiones, aprendizajes, pivotes.

### Estado 1/2/7 en Proyectos
Las etapas activas y tareas de proyectos aparecen en la pantalla de inicio según su estado de urgencia.

---

## 4. Journalist

### Filosofía
Journalist es la **etapa reflexiva e introspectiva de Domo**. No son hábitos — es un sistema de escritura. De Journalist nacen nuevos hábitos, objetivos y proyectos. Es el motor filosófico de todo Domo.

Lo que Aru escribe en Journalist alimenta las otras 3 áreas.

### Características
- Editor **Markdown** minimalista dentro de Domo
- Las entradas se organizan y se pueden abrir, editar, releer
- Backup automático a repositorio GitHub llamado **"Domo"** via cron jobs (2 backups)
- No depende de Obsidian — todo vive en Domo

### Tipos de Entradas
- **Morning thinking** — primer acto del día, antes de los hábitos
- **Writings** — poemas, ideas, reflexiones, sueños
- **Daily note** — nota del día
- **Weekly review** — revisión semanal
- **Monthly review** — revisión mensual
- **Yearly review** — revisión anual
- **Buyo** — entrada libre/especial
- Y cualquier diario que Aru necesite llevar

### Flujo Natural
Journalist es lo primero del día: reflexión → acción. El Morning thinking precede a los hábitos.

---

## 5. 900S (Proceso 900 Segundos)

### Filosofía
900 segundos = 15 minutos. El 900S es el **elemento central que empuja todo Domo**. Es un registro honesto de vida — no un tracker de productividad. Luego de años de uso, Aru podrá ver todo lo que aprovechó y todo lo que no en su tiempo. Es un evento reflexivo, un soliloquio, una conversación íntima con uno mismo.

**No contestar el 900S no significa procrastinación** — solo significa que no se contestó. No hay racha, no hay pérdida.

### Funcionamiento del Popup
Cada 15 minutos aparece un popup con:
- **H2**: "¿Qué estás haciendo ahora mismo?"
- **Textarea**: para elaborar si se quiere
- **Botón Registrar** (primario)
- **Botón Snooze** (secundario)

Si no hay respuesta en **1 minuto**: se cierra automáticamente y registra **"Aru no se encuentra en la laptop"** (o similar). Los registros de ausencia son datos válidos — también cuentan.

### Registros Editables
Si Aru no contestó en el momento (estaba fuera, de viaje, etc.), puede **editar ese snapshot retroactivamente** y escribir qué estaba haciendo realmente. El historial es honesto, no automático.

### Dashboard 900S
- Distribución de tiempo por categoría
- Filtros: Día / Semana / Mes / Año
- Historial reciente con timestamps
- Correlación con hábitos y proyectos activos
- Vista anual/plurianual del uso del tiempo

### Categorías 900S
Programación, Lectura, Ejercicio, Escritura, Descanso, Social, Otro (configurables en Settings).

---

## Modos Especiales de Domo

### Los 3 Tipos de Descanso

**1. Hábito de Descanso**
- Descanso integrado al trabajo productivo
- Ejemplo: nadar a las 8pm después de un día intenso
- Genera paz mental, nuevas ideas, recarga energía
- Se registra como hábito cumplido
- Forma parte del día productivo

**2. Rest (~2 horas)**
- Desconexión corta del ritmo de trabajo
- Actividades: PlayStation, salir un momento, tarea liviana de un objetivo
- Pausa el ritmo pero no es sagrado — se puede volver al trabajo después
- No congela rachas automáticamente

**3. Deep Rest (3-4 horas)**
- **Premio mayor** — tiempo de calidad sin rendimiento
- Actividades: familia, restaurante, viaje corto, sueño extra, cosas que alimentan el alma
- No se mide, no se evalúa, no produce nada visible
- Nadar durante Deep Rest NO cuenta como hábito — cuenta como disfrute
- **Activa automáticamente el modo AFK de 900S**: cada snapshot del popup se responde solo con "Deep Rest" sin interrumpir a Aru
- Congela las rachas durante su duración
- Se activa manualmente cuando Aru completó todo lo importante del día

**Condición para Deep Rest:** haber completado todos los elementos marcados como "1" (urgentes del día) en Hábitos, Objetivos, Proyectos y Journalist.

### Modo AFK
Para viajes, hospitales, emergencias, cuidado de salud mental.

- **Rachas congeladas** — nada se pierde
- **900S suspendido** — no registra nada, ese tiempo no existe en Domo
- **Sin notificaciones ni popups**
- Al volver, Domo recibe a Aru como si el tiempo no hubiera pasado
- Se activa manualmente, con fecha estimada de regreso opcional

**Diferencia clave:**
- Deep Rest **registra** (Domo sabe que Aru descansó)
- AFK **pausa** (ese tiempo simplemente no existe en Domo)

---

## Pantalla de Inicio (Urgencia del Día)

La primera pantalla que ve Aru al abrir Domo no es un dashboard de estadísticas — es una **agenda de supervivencia**: qué hay que hacer hoy para no perder lo construido.

### Estructura
**Lo que muere hoy** (estado 1 — racha en riesgo crítico)
- Hábitos con cobertura que vence en las próximas 24 horas

**Lo que avanza hoy** (estado 1 — objetivos)
- Tareas de objetivos marcadas como prioritarias para hoy

**Lo que necesita focus hoy** (estado 1 — proyectos)
- Etapas o tareas de proyectos activos marcadas para hoy

**Lo que muere mañana** (estado 2)
- Todo lo que vence en 2 días

**Lo que viene esta semana** (estado 7)
- Vista de los próximos 7 días

Cuando Aru completa todos los elementos de estado **1** → Domo habilita el Deep Rest.

---

## Simulación de un Día en Domo

1. Aru abre Domo → ve la pantalla de urgencia con las tareas del día
2. Trabaja en 3 tareas del proyecto Dict (app de dictado para Linux)
3. Va a Journalist → escribe Morning thinking (15 min)
4. Completa hábitos: 12 Min y 8 Max
5. Trabaja en un objetivo: averigua dónde comenzar natación
6. A los 15 min → popup 900S: registra "trabajando en objetivo natación"
7. Sale a hacer gestiones, pierde un 900S → al volver, lo edita retroactivamente
8. En 4 horas logró: 3 tareas de proyecto, todos los hábitos del día, 40% del objetivo, Morning thinking
9. Domo detecta que completó todos los "1" → habilita Deep Rest
10. Aru activa Deep Rest → las rachas se congelan, el 900S se auto-responde "Deep Rest"
11. 3 horas con la familia, sin interrupciones, feliz

---

## Diseño y UX

### Principios
- **Oscuro preferentemente** (uso diurno y nocturno)
- **Denso pero no congestionado** — mucha info, jerarquía clara
- **Enfocado** — sin distracciones decorativas
- **Minimalista funcional** — cada elemento tiene propósito
- **Urgencia visible** — el estado 1/2/7 debe leerse de un vistazo
- **Satisfacción al completar** — la UI celebra el progreso sin ser ruidosa
- Inspiración: Linear, Obsidian, Raycast

### Layout
- Sidebar de navegación (persistente) + área principal
- Indicador permanente de 900S activo en la esquina inferior izquierda
- Desktop-first, luego mobile

### Navegación
Dashboard | Hábitos | Objetivos | Proyectos | 900S | Journalist | Settings

### Color por Módulo
- Hábitos: azul/índigo
- Objetivos: amarillo/ámbar
- Proyectos: verde
- 900S: rojo
- Journalist: violeta
- Settings: gris

---

## Stack Técnico

- **Framework**: Vite + React + TypeScript
- **Persistencia v1**: localStorage
- **Backup**: Cron jobs → repositorio GitHub "Domo"
- **Charts**: Recharts (o similar)
- **Fechas**: date-fns
- **Estilos**: Tailwind CSS
- **Estado**: Zustand (por definir)
- **Deploy**: local en Debian 13 como app web
- **Plataforma**: Desktop-first

---

## Futuro

- IA que sugiere automáticamente el estado 1/2/7 de cada tarea
- Sincronización multi-dispositivo
- Estadísticas avanzadas de correlación 900S ↔ Hábitos ↔ Proyectos
- Vista anual/plurianual del tiempo invertido

---

*Este documento captura la conversación fundacional de Domo entre Aru y Claude, 7 de Abril 2026.*
