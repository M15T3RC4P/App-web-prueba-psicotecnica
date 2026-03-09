# Documentación del Funcionamiento y Arquitectura: App Web de Pruebas Psicotécnicas

## 1. Visión General del Proyecto
Esta aplicación es una herramienta web de evaluación psicotécnica desarrollada sobre **Google Apps Script (GAS)**. Permite a los candidatos realizar dos tipos de pruebas estandarizadas (**Valanti** y **DISC**) y a los reclutadores consultar, visualizar e imprimir los resultados de manera centralizada.

La aplicación funciona como una **Single Page Application (SPA)** para la experiencia del candidato y un **Dashboard de Reportes** separado para el administrador, utilizando Google Sheets como base de datos y backend serverless.

---

## 2. Arquitectura del Sistema

### 2.1 Backend: Google Apps Script (`Código.gs`)
El archivo `Código.gs` actúa como el controlador del servidor y la capa de acceso a datos.
*   **Enrutamiento (`doGet`)**: Gestiona la navegación inicial mediante parámetros URL (`?view=dashboard` o `?view=consultas`). Por defecto, sirve la vista del candidato (`index`).
*   **Servicio de Datos**:
    *   `getStaticQuestions()`: Entrega las preguntas de las pruebas (Valanti y DISC) de forma estática para maximizar la velocidad de carga.
    *   `saveTestResults()`: Recibe las respuestas del frontend y las almacena en las hojas de Google Sheets correspondientes.
    *   `getPruebasData()`: Recupera y consolida la información de un candidato desde las hojas 'Valanti', 'DISC' y 'Datos' para generar el reporte.
*   **Inclusión de Archivos**: Utiliza la función `include()` para separar el código HTML, CSS (`css-styles`) y JS (`js-logic`, `Controller.js`) en archivos distintos, mejorando la mantenibilidad.

### 2.2 Frontend: Estructura y Vistas
La interfaz de usuario está construida con **HTML5** y estilizada principalmente con **TailwindCSS** (vía CDN) y estilos personalizados en `css-styles.html`.

#### A. Vista del Candidato (`index.html`)
Diseñada como una SPA con secciones que se muestran u ocultan dinámicamente:
1.  **Login (`view-login`)**: Formulario para capturar datos demográficos (Nombre, Cédula, Cargo, etc.).
2.  **Dashboard del Candidato (`view-dashboard`)**: Menú principal donde selecciona qué prueba realizar.
3.  **Zona de Pruebas (`view-test`)**: Interfaz dinámica que renderiza las preguntas una a una.
    *   **Lógica (`js-logic.html`)**: Controla el estado de la aplicación (`appData`), la navegación entre vistas, la validación de respuestas y el envío de datos al servidor.

#### B. Vista del Reclutador (`Dashboard.html`)
Un panel administrativo optimizado para la visualización y la impresión física (formato A4).
*   **Buscador**: Permite localizar candidatos por Cédula/ID.
*   **Visualización (`Controller.js.html`)**:
    *   Usa **Chart.js** para renderizar gráficos de Radar (Valores Valanti) y Barras (Perfil DISC).
    *   Tablas detalladas con puntajes e interpretaciones.
*   **Seguridad**: Acceso protegido por contraseña simple ("ADMIN26") implementada en el frontend del index, o acceso directo vía URL.

### 2.3 Base de Datos: Google Sheets
El sistema utiliza una hoja de cálculo vinculada con las siguientes pestañas:
*   **'Valanti'**: Almacena fecha, datos del candidato y los puntajes de los 5 valores (Verdad, Rectitud, Paz, Amor, No Violencia).
*   **'DISC'**: Almacena fecha, datos y los puntajes de los 4 factores (Dominancia, Influencia, Estabilidad, Cumplimiento).
*   **'Datos'**: Contiene metadatos o etiquetas utilizadas para la configuración (ej. nombres de los valores Valanti).

---

## 3. Funcionamiento Detallado

### 3.1 Flujo del Candidato
1.  **Inicio**: El usuario ingresa sus datos personales.
2.  **Selección**: El sistema muestra el estado de las pruebas (Pendiente/Completado). El usuario elige una.
3.  **Ejecución de Pruebas**:
    *   **Valanti**: Se presentan pares de frases. El usuario distribuye 3 puntos entre ellas (0-3, 1-2, etc.).
        *   *Parte 1*: Identificación positiva (lo que más se parece a mí).
        *   *Parte 2*: Identificación negativa (lo que menos acepto). El sistema notifica el cambio de reglas en la pregunta 10.
    *   **DISC**: Se presentan 4 adjetivos/frases por pregunta. El usuario los ordena del 1 (menos) al 4 (más) sin repetir números.
4.  **Finalización**: Al terminar cada módulo, los datos se envían a Google Sheets. Al completar ambas, se muestra una pantalla de agradecimiento.

### 3.2 Flujo del Reclutador (Dashboard)
1.  **Acceso**: Puede entrar desde el `index` (botón de candado) o mediante la URL con `?view=dashboard`.
2.  **Consulta**: Ingresa el ID del candidato. El backend busca en ambas hojas ('Valanti' y 'DISC').
3.  **Reporte**:
    *   Se genera un informe visual con encabezado corporativo.
    *   **Gráficos**: Radar para el equilibrio de valores y Barras para el perfil de comportamiento.
    *   **Tablas**: Desglose numérico de los resultados.
4.  **Exportación**: El diseño incluye hoja de estilos `@media print` para asegurar que el reporte se imprima perfectamente en tamaño carta/A4, ocultando elementos de navegación.

---

## 4. Tecnologías Clave
*   **Google Apps Script**: Lógica de servidor y conexión a Sheets.
*   **TailwindCSS**: Diseño responsivo y moderno.
*   **Chart.js**: Visualización de datos (Gráficos).
*   **HTML5/JS (ES6)**: Lógica del cliente sin frameworks pesados, garantizando carga rápida.
*   **FontAwesome**: Iconografía.
