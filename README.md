# Documentación del Funcionamiento y Arquitectura: App Web de Pruebas Psicotécnicas

## 1. Visión General del Proyecto
Esta aplicación es una herramienta web de evaluación psicotécnica desarrollada sobre **Google Apps Script (GAS)**. Permite a los candidatos realizar dos tipos de pruebas estandarizadas (**Valanti** y **DISC**) bajo un cronómetro estricto de 56 minutos, y a los reclutadores consultar, visualizar e imprimir los resultados a través de un Dashboard seguro.

La aplicación funciona como una **Single Page Application (SPA)** para la experiencia del candidato y ofrece un **Dashboard de Reportes** separado para el administrador, utilizando Google Sheets como base de datos y backend serverless.

---

## 2. Arquitectura del Sistema

### 2.1 Backend: Google Apps Script (`Código.gs`)
El archivo `Código.gs` actúa como el controlador del servidor y la capa de acceso a datos.
*   **Enrutamiento (`doGet`)**: Gestiona la navegación inicial mediante parámetros URL (`?view=dashboard`). Cuenta con bloqueo de renderizado si el acceso no es válido.
*   **Autenticación y Seguridad**: 
    *   `verifyAndGetDashboardAccess(password)`: Verifica la clave contra un hash **SHA-256**, implementando mitigaciones de fuerza bruta (bloqueo de 5 mins en el servidor tras 5 intentos fallidos) vía `PropertiesService` y generando un token UUID de sesión.
*   **Servicio de Datos**:
    *   `getStaticQuestions()`: Entrega las preguntas de las pruebas de forma estática para maximizar la velocidad.
    *   `saveTestResults()`: Recibe y guarda las respuestas en Google Sheets protegiéndose de colisiones mediante `LockService`.
    *   `getPruebasData()`: Recupera y consolida información desde valanti y disc para los reportes visuales.

### 2.2 Frontend: Estructura y Vistas
Diseñada con **HTML5**, **TailwindCSS** (CDN), y **CSS personalizado** enfocado al Glassmorphism.

#### A. Vista del Candidato (`index.html` y `js-logic.html`)
1.  **Login (`view-login`)**: Formulario para registro.
2.  **Cronómetro Global**: Temporizador de 56 minutos. Se pausa en el menú intermedio y se reanuda en las pruebas. Sus estados se almacenan en `sessionStorage`.
3.  **Zona de Pruebas (`view-test`)**: Las vistas dinámicas por prueba.
4.  **Fin por Timeout (`view-timeout`)**: Pantalla activada al expirar el tiempo, auto-guardando resultados parciales.

#### B. Vista del Reclutador (`Dashboard.html` y `Controller.js.html`)
*   **Acceso**: Oculto tras un modal de autenticación segura. Protegido en la parte superior mediante un validador JavaScript contra su `sessionStorage`.
*   **Visualización**: Gráficos de Radar y Barras (Chart.js), tablas detalladas.
*   **Impresión Optimizada**: Salida para hoja A4 con color renderizado exacto, repetición inteligente de encabezados de identificación (`#repeat-header`), pie de página estático corporativo y títulos de PDF dinámicos según el candidato.

---

## 3. Funcionamiento Detallado

### 3.1 Flujo del Candidato
1.  **Inicio**: Ingresa datos. Se inicializa el cronómetro global.
2.  **Ejecución**: El usuario alterna libremente entre Valanti y DISC. El cronómetro corre en el fondo.
    *   **Valanti**: Parte 1 (Identificación positiva) y Parte 2 (Identificación negativa, advertida a mitad de camino). Sumatorias de 3 puntos.
    *   **DISC**: Ordenamiento obligatorio de 1 a 4.
3.  **Finalización**: Al terminar o si el cronómetro llega a `00:00`, se guardan los datos procesados en la Hoja de Google vinculada.

### 3.2 Flujo del Reclutador (Dashboard)
1.  **Autenticación**: Desde el logo discreto del inicio, aparece el modal. Entra clave y el servidor valida.
2.  **Consulta**: Búsqueda del candidato por ID. Siempre devuelve el registro más moderno (búsqueda inversa en hoja de cálculo).
3.  **Exportación PDF**: Clic en botón "Descargar Informe". El sistema oculta menús, fija el pie de página y activa cabeceras descriptivas en las páginas secundarias.

---

## 4. Tecnologías Clave
*   **Google Apps Script**: Backend y BBDD Proxy.
*   **TailwindCSS / CSS Vanilla**: Styling responsivo.
*   **Chart.js**: Renderizado de gráficos en el Canvas.
*   **HTML5/JS (ES6)**: Lógica principal (Timeouts, SessionStorage, Autenticación en Cliente/Servidor).
