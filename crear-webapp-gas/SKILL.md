---
name: crear-webapp-gas
description: Guía y estandariza la creación de aplicaciones web (Web Apps) usando Google Apps Script (GAS) con Google Sheets como base de datos. Enfocado en diseño UI/UX excepcional, separación de código y mejores prácticas. Úsese cuando el usuario solicite crear o mejorar una Web App en GAS.
---

# Desarrollo de Web Apps en Google Apps Script (GAS)

## Cuándo usar esta skill
- El usuario quiere crear una aplicación web utilizando Google Apps Script.
- El usuario menciona usar Google Sheets como base de datos o backend para una aplicación web.
- El usuario pide mejorar la interfaz de usuario (UI), la experiencia de usuario (UX) o estructurar el código de un proyecto existente en GAS.
- Se requiere conectar un frontend HTML/JS/CSS con funciones backend (`.gs`) de forma asíncrona.

## Arquitectura y Estructura del Proyecto
Un proyecto profesional de GAS debe separar las responsabilidades. Adhiérete a la siguiente estructura lógica de archivos (todos en el mismo entorno de GAS):

- `Código.gs`: Archivo principal del backend. Incluye manejo de rutas iniciales (`doGet`, `doPost`) y la función utilitaria `include()` para renderizar plantillas.
- `Controller.gs`: Funciones que el frontend llama asíncronamente (conexión con la base de datos).
- `Index.html`: El archivo HTML principal de la vista.
- `css-styles.html`: Hoja de estilos global (CSS).
- `js-logic.html`: Archivo para la lógica del lado del cliente (JavaScript).

> **Nota de Implementación**: En GAS, los archivos CSS y JS deben incluirse en el HTML principal usando un script de evaluación en el backend: `<?!= include("css-styles"); ?>`.

## 1. Diseño UX/UI Excepcional
Tu prioridad en el frontend es brindar una experiencia premium, moderna y responsive:

- **Estética Moderna**: Usa patrones como Glassmorphism (fondos translúcidos, `backdrop-filter: blur`), sombras de caja suaves (`box-shadow`), y bordes redondeados (`border-radius`).
- **Paleta de Colores**: Evita colores básicos. Crea gradientes estéticos y define variables CSS para colores universales (Primary, Secondary, Background, Text, Danger).
- **Tipografía**: Importa fuentes modernas de Google Fonts (`Inter`, `Roboto`, `Poppins` o `Outfit`) y úsalas jerárquicamente.
- **Micro-interacciones y Animaciones**:
  - Efectos `:hover` en botones, tarjetas y enlaces (cambios de color, elevaciones ligeras).
  - Transiciones suaves en interacciones (`transition: all 0.3s ease;`).
  - Mostar indicadores de carga claros (spinners modales o loaders) para cualquier operación de red. No dejes al usuario preguntándose si la app se congeló.
- **Responsividad (Mobile-First)**: Emplea CSS Grid y Flexbox. La UI debe ser 100% fluida y no romperse en pantallas pequeñas.

## 2. Bases de Datos con Google Sheets
Consideraciones para `Controller.gs` al trabajar con Sheets para asegurar la escalabilidad:

- **Caché y Rendimiento**: Minimiza y agrupa las llamadas a `SpreadsheetApp`. Lee las hojas enteras con `getValues()`, procesa la lógica en arreglos de JavaScript nativo, y, si es posible, escribe de vuelta en bloque con `setValues()`.
- **Concurrencia**: Implementa siempre el `LockService` (`LockService.getScriptLock()`) en operaciones de escritura concurrentes. Esto previene colisiones y corrupción de datos si varios usuarios interactúan con la base al mismo tiempo.
- **Seguridad**: Valida los roles o privilegios desde el lado del servidor y filtra datos confidenciales antes de enviarlos de vuelta al frontend.

## 3. Comunicación Asíncrona (Frontend ↔ Backend)
Utiliza siempre la API asíncrona de GAS (`google.script.run`) y proporciona un feedback claro al usuario:

```javascript
// Ejemplo de flujo estándar desde js-logic.html
function fetchData() {
    showLoadingSpinner(); // Componente UI para bloquear pantalla
    google.script.run
        .withSuccessHandler(function(response) {
            hideLoadingSpinner();
            renderData(response); // Manejo prolijo del DOM
        })
        .withFailureHandler(function(error) {
            hideLoadingSpinner();
            showSweetAlertError("Ocurrió un error interno: " + error.message);
        })
        .obtenerDatosBackend(); // Llama directo a la función en Controller.gs
}
```

## Flujo de Trabajo Obligatorio (Checklist)
Al abordar tareas de desarrollo de Web Apps bajo este contexto, sigue este paso a paso:

- [ ] **1. Entendimiento y Modelo de Datos**: Comprender qué variables/columnas existen en Google Sheets y delinear las operaciones CRUD requeridas.
- [ ] **2. Setup del Backend (`Código.gs` + `Controller.gs`)**:
  - Redactar `doGet(e)` y `include(filename)`.
  - Crear funciones de lectura/escritura con protección `LockService`.
- [ ] **3. Maquetado Frontend (`Index.html`)**:
  - Crear el esqueleto semántico, añadir CDN's (Google Fonts, SweetAlert2, Iconos).
  - Incluir los archivos de estilos y lógica.
- [ ] **4. Implementación UI/UX (`css-styles.html`)**:
  - Definir `:root` con el tema de colores, tipografías y sombras. Estilizar componentes con foco en interacciones (`hover`, `focus`) y responsividad (`@media queries`).
- [ ] **5. Interactividad DOM y Flujo (`js-logic.html`)**:
  - Definir escuchadores de eventos, validaciones de formularios y llamadas con `google.script.run`.
- [ ] **6. Verificación**: Validar manejo de errores (FailureHandlers), carga visual y usabilidad multi-dispositivo.

## Recursos UX Útiles
- **Librería de Iconos**: Usa Material Symbols de Google (`<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />`).
- **Ventanas Modales/Alertas**: Incorpora [SweetAlert2](https://sweetalert2.github.io/) (vía CDN) para notificaciones y confirmaciones, desplazando a los anticuados `alert()` nativos.
