# Documentación y Explicación del Programa: App Web Prueba Psicotécnica

Este documento detalla la lógica general del aplicativo y realiza un desglose minucioso de cada archivo que lo compone, incluyendo el uso de variables, funciones y sus objetivos. Esto permitirá comprender a fondo la arquitectura actual para realizar mantenimiento o expansiones.

## 1. Lógica General del Programa

El aplicativo es una **Aplicación Web basada en Google Apps Script (GAS)** diseñada para realizar y consultar pruebas psicotécnicas (Test de Valanti y Test DISC) para la gestión del talento humano.

**El flujo de trabajo general se divide en dos grandes roles:**

1.  **Rol Candidato (Tomar la prueba):**
    *   Ingresa a la pantalla inicial (`Landing Page`).
    *   Llena un formulario de registro. En ese instante, inicia un **cronómetro global de 56 minutos**.
    *   Ingresa a un panel intermedio donde debe completar ambas pruebas (Valanti y DISC). Si vuelve a este panel, el cronómetro se pausa. Al entrar a una prueba, se reanuda.
    *   Al terminar o al expirar el tiempo, las respuestas se envían al backend (`Código.gs`) y se guardan en Google Sheets.

2.  **Rol Administrador / Reclutador (Consultar resultados):**
    *   Desde la pantalla inicial, presiona un icono de candado discreto.
    *   Aparece un modal (Glassmorphism). Ingresa una contraseña que se verifica de forma segura (hash SHA-256 en el servidor).
    *   Accede al Dashboard protegido por un token de sesión. Busca candidatos por ID.
    *   Carga datos tabulados y gráficos de `Chart.js`, pudiendo generar e imprimir un reporte en PDF.

---

## 2. Detalle de los Archivos del Programa

### 2.1. `Código.gs`
Este archivo es el backend central. Se ejecuta en Google Servers.

*   **Variables Globales:**
    *   `SPREADSHEET_ID` *(const, string)*: ID del documento de Sheets usado como BBDD.
    *   `ADMIN_PASS_HASH` *(const, string)*: Almacena el hash SHA-256 pre-calculado de la contraseña segura, evitando texto plano.

*   **Funciones de Sistema y Autenticación:**
    *   `doGet(e)`: **Objetivo:** Recibir peticiones HTTP GET y enrutar la aplicación usando parámetros (ej. `?view=dashboard`).
    *   `include(filename)`: **Objetivo:** Permite inyectar código HTML/CSS/JS (templating).
    *   `computeHashHex_(text)`: **Objetivo:** Helper para encriptar claves usando `Utilities.computeDigest`.
    *   `verifyAndGetDashboardAccess(password)`: **Objetivo:** Verifica contraseña contra el hash. Aplica un rate limiting (bloqueo) de 5 minutos mediante `PropertiesService` en caso de 5 fallos. Retorna un token (`generateSessionToken()`) y la URL de acceso en un solo viaje al servidor para mayor velocidad.

*   **Funciones de Pruebas:**
    *   `getStaticQuestions()`: **Objetivo:** Retorna las preguntas fijas sin consultar la red/Sheets.
    *   `saveTestResults(testType, userData, answers)`: **Objetivo:** Guarda las respuestas usando `LockService` para prevenir sobre-escritura en alta concurrencia.
    *   `getPruebasData(targetId)`: **Objetivo:** Consolida toda la información matemática y visual de un candidato leyendo desde las pestañas Valanti y DISC (desde abajo hacia arriba para traer el registro más reciente).

### 2.2. `index.html`
Es el contenedor SPA (Single Page Application) para el candidato y el login de administradores.

*   **Estructura y Lógica:**
    *   Transiciona entre vistas (`view-landing`, `view-login`, `view-dashboard`, `view-test`, `view-finish`, y `view-timeout`).
    *   `view-timeout`: Muestra un mensaje formal si el tiempo expiró.
    *   `#auth-modal-overlay`: Modal interactivo que lanza cuenta regresiva de 30 segundos si el administrador se equivoca 3 veces continuas antes de hacer solicitudes al servidor.

### 2.3. `js-logic.html`
Lógica frontend (Candidatos).

*   **Variables Globales:**
    *   `appData` *(Objeto)*: Mantiene el estado local (Respuestas marcadas, índices).
    *   `TIMER_DURATION_MS` y `_timerInterval`: Mantienen la duración constante (56 min) y el puntero del intervalo JS.

*   **Funciones de Cronómetro y Progreso:**
    *   `startGlobalTimer()`: Valida si hay sesiones previas en `sessionStorage` y arranca la cuenta.
    *   `pauseTimer()` y `resumeTimer()`: Controlan la congelación del tiempo.
    *   `onTimeUp(wasExpired)`: Frenado drástico. Oculta pruebas activas y dispara el guardado automático vía `saveTestResults()`.
*   **Funciones de Pruebas:**
    *   `startTest()`, `renderQuestion()`, `nextQuestion()`: Ciclo lógico que procesa, dibuja HTML y obliga al cumplimiento de sumas cruzadas (Valanti) o exclusividad númerica (DISC).

### 2.4. `Dashboard.html`
Formato principal del informe final.

*   **Seguridad:** 
    *   Al inicio del `<body>` se encuentra un guard `<script>`. Impide ver el HTML o hacer peticiones si `sessionStorage.getItem('admin_session_token')` está vacío o es nulo.
*   **Estructura de Impresión:**
    *   `#repeat-header`: Elemento HTML que se fuerza vía CSS a repetirse en la parte superior a partir de la hoja #2 al exportar a PDF, manteniendo la identificación del sujeto sin ensuciar la portada.

### 2.5. `Controller.js.html`
Motor Javascript para el Dashboard (Reclutador).

*   **Funciones Principales:**
    *   `initCharts()`: Instancia los radiales vacíos al inicio.
    *   `searchCandidate()`: Captura la ID y realiza la petición asíncrona a `getPruebasData`.
    *   `renderCandidateInfo(...)`, `renderDiscChart(...)`: Parsean los JSON devueltos y dibujan colores/puntuaciones usando manipulación limpia del DOM e inyección textual. Modifica además el título del documento (`<title>`) dinámicamente (`fecha_Nombre_Cargo`) para exportaciones rápidas PDF.

### 2.6. `css-styles.html`
*   **Diseño Interactivo:** Agrega las animaciones keyframes `@keyframes timer-pulse` (ámbar y rojo) para la alerta de finanzas de cronómetro.
*   **Impresión Avanzada:** `@media print` anula flexboxes irrelevantes, fuerza `-webkit-print-color-adjust` y añade `page-break-inside: avoid` a las celdas asegurando reportes nítidos listos para gerencia.
