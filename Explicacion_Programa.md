# Documentación y Explicación del Programa: App Web Prueba Psicotécnica

Este documento detalla la lógica general del aplicativo y realiza un desglose detallado de cada archivo que lo compone, incluyendo el uso de variables, funciones y sus objetivos. Esto permitirá comprender a fondo la arquitectura para realizar ajustes específicos.

## 1. Lógica General del Programa

El aplicativo es una **Aplicación Web basada en Google Apps Script (GAS)** diseñada para realizar y consultar pruebas psicotécnicas (Test de Valanti y Test DISC) para gestión de talento humano.

**El flujo de trabajo general se divide en dos grandes roles:**

1.  **Rol Candidato (Tomar la prueba):**
    *   Ingresa a la pantalla inicial (`Landing Page`).
    *   Selecciona "Ingresar a Prueba Psicotécnica" y llena un formulario de registro.
    *   Ingresa a un panel intermedio donde debe completar ambas pruebas (Valanti y DISC).
    *   Responde cada prueba (con lógica dinámica de renderizado y pausas si lo requiere).
    *   Al terminar, las respuestas se envían al backend (`Código.gs`) y se guardan en una Google Sheet que sirve de Base de Datos.

2.  **Rol Administrador / Reclutador (Consultar resultados):**
    *   Ingresa a la pantalla inicial (`Landing Page`).
    *   Selecciona "Ingresar al Dashboard de Resultados", ingresa una contraseña predefinida.
    *   Accede a un Dashboard donde puede buscar los resultados de los candidatos a través de su ID o número de documento.
    *   El sistema carga los datos desde Google Sheets, incluyendo los puntajes calculados, los gráfica mediante `Chart.js` y genera un reporte visual listo para imprimir.

La aplicación sigue el patrón MVC (Modelo-Vista-Controlador) levemente adaptado para Google Apps Script, separando el backend (`Código.gs`), la estructura (`.html`), estilos (`css-styles.html`) y la lógica frontend del candidato (`js-logic.html`) y del dashboard (`Controller.js.html`).

---

## 2. Detalle de los Archivos del Programa

### 2.1. `Código.gs`
Este archivo contiene el backend de la aplicación. Se ejecuta en los servidores de Google y es el único archivo capaz de interaccionar directamente con la hoja de cálculo de Google (Base de Datos).

*   **Variables Globales:**
    *   `SPREADSHEET_ID` *(const, string)*: Almacena el ID del documento de Google Sheets usado como base de datos.
    *   `ADMIN_KEY` *(const, string)*: Contraseña estática usada para autenticar a los reclutadores en el dashboard.

*   **Funciones Principales:**
    *   `doGet(e)`: **Objetivo:** Recibir peticiones HTTP GET y enrutar la aplicación (servir `index.html`, o `Dashboard.html` si el parámetro de la URL lo solicita).
    *   `include(filename)`: **Objetivo:** Permite inyectar (`includes`) código de otros archivos HTML (como CSS y JS) en el archivo principal.
    *   `verifyAdminAccess(password)`: **Objetivo:** Valida desde el servidor que la contraseña ingresada sea correcta (retorna `true/false`).
    *   `getStaticQuestions()`: **Objetivo:** Retorna las preguntas fijas (variables `valanti` y `disc`, ambos *arrays de objetos*) para cargar rápidamente la interfaz del usuario. Estas variables definen el cuestionario y evitan consultar la base de datos para cargar las preguntas.
    *   `saveTestResults(testType, userData, answers)`: **Objetivo:** Guarda las respuestas en la Google Sheet usando bloqueos de scripts (variables `lock`, `ss`, `sheet`) para asegurar que si dos personas terminan al mismo tiempo no haya conflictos de guardado.
    *   `findRowById(sheet, id, columnIndex)`: **Objetivo:** Helper para encontrar eficientemente la fila de un usuario en Sheets según su ID, iterando un array 2D.
    *   `getPruebasData(targetId, authKey)`: **Objetivo:** Busca las calificaciones de Valanti, DISC, datos del usuario, y etiquetas en las hojas de cálculo. Retorna un objeto JSON unificado al frontend del Dashboard. Variables clave: `candidatoData` (objeto JSON), `discData` (objeto JSON), `valantiData` (objeto JSON).

### 2.2. `index.html`
Este archivo es la estructura HTML de la plataforma de evaluación (la parte que utiliza el candidato y el landing page).

*   **Estructura y Lógica:**
    *   Contiene múltiples secciones (`<section>`) ocultas que actúan como "Vistas" (`view-landing`, `view-login`, `view-dashboard`, `view-test`, `view-finish`).
    *   A través de Javascript, cambia entre la visibilidad de estas clases para crear el efecto de navegación sin recargar la página (Single Page Application).
    *   Incluye estilos de `css-styles` y lógica de `js-logic` usando etiquetas `<?!= include() ?>` de Apps Script.

### 2.3. `js-logic.html`
Contiene toda la lógica del lado del cliente (frontend JavaScript) interactuando con `index.html` (para cuando el usuario está realizando el examen).

*   **Variables Globales:**
    *   `appData` *(let, objeto principal)*: Mantiene el "Estado" (State) completo de la aplicación en el navegador del usuario.
        *   `appData.user` *(Object)*: Almacena los datos del login (cedula, nombre, cargo).
        *   `appData.questions` *(Object con arrays)*: Guarda las preguntas devueltas por el servidor.
        *   `appData.answers` *(Object con arrays)*: Historial de las respuestas que el usuario va ingresando.
        *   `appData.status` *(Object)*: Validadores booleanos para saber si ya completó el Valanti o el Disc.
        *   `appData.indexes` *(Object)*: Contadores numéricos que indican en qué número de pregunta va para cada prueba.
        *   `appData.current.type` *(String)*: Identifica si está en "Valanti" o "DISC".
        *   `appData.seenInstructions` *(Object)*: Validadores boleanos para lanzar las alertas e instrucciones correctas una sola vez.

*   **Funciones Principales:**
    *   `verifyAdmin()`: Obtiene el password, llama a `verifyAdminAccess` del backend y redirige al dashboard asincrónicamente si es correcto.
    *   `showView(id)`: Lógica de renderizado principal. Oculta las demás secciones y muestra la enviada en `id`.
    *   `startTest(type)`: Inicializa la prueba, actualiza colores corporativos y renderiza la pregunta inicial.
    *   `renderQuestion()`: Lee `appData.indexes`, inyecta el HTML dinámico de la pregunta Valanti o DISC, y gestiona las instrucciones específicas.
    *   `nextQuestion()`: Valida mediante reglas obligatorias (ej. la suma en valanti es 3, en disc es de 1 a 4 sin repetir) antes de dejar avanzar al candidato y guarda en `appData.answers`.
    *   `finishSubTest(type)`: Se dispara cuando no quedan más preguntas. Cambia botones, dispara el `loading-overlay` y llama al backend `saveTestResults` enviando la información retenida en `appData`.

### 2.4. `Dashboard.html`
Es el archivo HTML que forma la estructura visual del reporte o informe final cuando entra el reclutador/administrador. Está fuertemente enfocado y ajustado para poder imprimir hojas tamaño A4 limpias.

*   **Estructura:**
    *   Menú de navegación que no se imprime (`no-print`).
    *   Barra de búsqueda enlazada al ID del candidato.
    *   Contenedor principal en forma de hoja (`reportContainer`), donde se ubican grillas para datos personales, tabla y gráfico DISC (`discChart`), y tabla, gráfico (`valantiChart`) y textos del resultado de Valores.

### 2.5. `Controller.js.html`
Es el motor Javascript del Frontend para el Dashboard (Reclutador).

*   **Variables Globales:**
    *   `discChartInstance` *(let, Objeto Chart.js)*: Almacena la instancia temporal del gráfico radial de DISC.
    *   `valantiChartInstance` *(let, Objeto Chart.js)*: Almacena la instancia temporal del gráfico tipo radar para Valanti.
    *   `COLORS` *(const, objeto)*: Centraliza la paleta de colores para insertarlos dinámicamente en los gráficos a través de JavaScript (ej. Teal, Coral, Aqua).

*   **Funciones Principales:**
    *   `initCharts()`: Configura y crea las instancias de gráficos usando valores por defecto antes de que exista el puntaje.
    *   `searchCandidate()`: Captura el input texto, verifica credencial de sesión (`sessionStorage.getItem('adminKey')`) y contacta a `getPruebasData` del servidor.
    *   `handleSuccess(response)`: Función callback o Promesa. Se activa si el Backend responde bien. Destruye los gráficos y los reconstruye usando los números reales llamando funciones de render.
    *   `renderCandidateInfo(data)`, `renderDiscTable(disc)`, `renderDiscChart(disc)`, `renderValantiTable`, `renderValantiChart`: Funciones de Inyección del DOM encargadas de reemplazar (usando innerHTML y textContent) los contenedores vacíos con la información final.
    *   `showToast(message, type)`: Crea notificaciones flotantes temporales dependientes del contexto (error rojo, exito verde/teal).

### 2.6. `css-styles.html`
Contiene los estilos CSS, sirviendo de complemento a la librería TailwindCSS usada.

*   **Variables:**
    *   `--color-teal`, `--color-red`, `--body-bg`, etc. *(Custom properties CSS)*: Centralizan la temática de los portales para cambiarla con facilidad y asegurar cohesión estética.
*   **Lógica Principal:**
    *   Ajusta elementos custom como `btn-primary`, aplicando gradientes corporativos y hover/glassmorphism a nivel global.
    *   Dispone un query especializado en `@media print` el cual remueve sombras, fondos coloreados e invisibiliza botones/menús de navegación (`.no-print`) para dejar exclusivamente el reporte imprimible físico o PDF de manera limpia.
