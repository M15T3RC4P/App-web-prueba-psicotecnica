# Contexto de la Aplicación: Evaluación Psicotécnica (Asmet Salud)

Este documento sirve como base de conocimiento para que cualquier IA comprenda la arquitectura, lógica y flujo de la aplicación web actual, facilitando la generación de ajustes precisos y prompts efectivos.

## 1. Naturaleza Tecnológica
La aplicación es una **Web App desarrollada en Google Apps Script (GAS)**.
- **Backend:** Archivo `.gs` (Javascript ejecutado en servidores de Google).
- **Frontend:** Archivos `.html` procesados por el motor de plantillas de GAS.
- **Base de Datos:** Google Sheets (Hoja de cálculo vinculada).
- **Estilos:** TailwindCSS (CDN) + CSS Vanilla personalizado con estética *Glassmorphism* y colores corporativos de Asmet Salud (Teal y Rojo).
- **Librerías Externas:** FontAwesome (iconos), Chart.js (gráficos en el Dashboard).

---

## 2. Arquitectura de Archivos
- **`Código.gs`:** Punto de entrada del servidor. Gestiona enrutamiento (`doGet`), autenticación segura SHA-256 con rate limiting, entrega de preguntas (`getStaticQuestions`), guardado de respuestas (`saveTestResults`) y extracción de reportes (`getPruebasData`).
- **`index.html`:** Interfaz principal. Contiene el flujo SPA del candidato (Login, zona de pruebas, cronómetro, timeout) y el modal de autenticación segura (Glassmorphism) para administradores.
- **`Dashboard.html`:** Panel de resultados. Protegido por un guard de `sessionStorage`. Incluye encabezados repetitivos (para impresión) y estructura de celdas.
- **`js-logic.html`:** Lógica del lado del cliente para el candidato. Gestiona el estado (`appData`), cronómetro global (56 min), validación de respuestas y envío al backend.
- **`Controller.js.html`:** Lógica del Dashboard. Búsqueda por ID, inyección de gráficos (Chart.js), tablas de interpretación y nombrado dinámico de PDFs al imprimir.
- **`css-styles.html`:** Sistema de diseño unificado. Tokens de color corporativos, animaciones (pulso del cronómetro) y reglas `@media print` extensivas (saltos de página, footer fijo).

---

## 3. Flujo Lógico de Usuario (Candidato)
1. **Landing:** El usuario ingresa a la prueba mediante un botón principal o al dashboard mediante un candado discreto.
2. **Login:** Captura datos básicos (Nombre, ID, Edad, Cargo, Sede). Se guardan temporalmente en `appData.user`.
3. **Cronómetro Global:** Al hacer login, inicia una cuenta regresiva de 56 minutos. Se pausa al estar en el menú de selección y se reanuda al entrar a una prueba, usando `sessionStorage` para persistencia. Si se agota el tiempo, guarda respuestas parciales automáticamente.
4. **Ejecución de Pruebas:**
   - **Valanti:** Prueba de valores dividida en dos partes (positivo y negativo). Regla estricta de suma de 3 puntos por par.
   - **DISC:** Prueba comportamental. Ordenamiento de 1 a 4 sin repetir números.
5. **Finalización:** Se envían datos a Google Sheets vía `saveTestResults()`.

---

## 4. Lógica del Dashboard (Administrador)
- **Autenticación Segura:** El administrador ingresa la clave en un modal. El backend valida contra un hash SHA-256 (`ADMIN_PASS_HASH`), aplicando rate limiting (bloqueos locales de 30s y del servidor de 5min). Si es exitoso, se genera un token UUID (`admin_session_token`).
- **Visualización y Gráficos:** Gráficos responsivos de Radar (Valanti) y Barras (DISC) con Chart.js, junto con interpretaciones en tarjetas optimizadas.
- **Sistema de Impresión:** Optimizaciones avanzadas para PDF:
  - Header repetitivo con datos del candidato a partir de la segunda página.
  - Footer corporativo fijado al final de todas las páginas.
  - Generación de salto de página inteligente (`page-break-inside: avoid`).
  - Nombre del archivo PDF dinámico (Día-Mes-Año_Nombre_Cargo).

---

## 5. Estructura de la Base de Datos (Google Sheets)
- **Hoja 'DISC':** Columnas A-H (Datos Candidato), Columnas I-DK (Respuestas Crudas), **Columnas DI-DN (Cálculos y Resultados)**.
- **Hoja 'Valanti':** Columnas A-H (Datos Candidato), Columnas I-BU (Respuestas Crudas), **Columnas BV-CF (Resultados e Interpretaciones)**.
- **Hoja 'Datos':** Contiene etiquetas y configuraciones globales.

---

## 6. Consideraciones para Ajustes Futuros
1. **Seguridad:** Las contraseñas nunca deben viajar ni guardarse en texto plano. Se usa `Utilities.computeDigest`.
2. **Impresión:** Cualquier alteración del DOM en el Dashboard debe probarse en la vista de impresión (`Ctrl+P`) para validar que las tablas/gráficos no se corten.
3. **Persistencia:** Almacenamiento local se apoya en `sessionStorage` para el token admin y el estado del cronómetro.
4. **Cálculos:** Las puntuaciones dependen enteramente de las fórmulas nativas de Google Sheets. El código se limita a insertar datos crudos y leer celdas finales.

---
*Este archivo debe ser proporcionado a la IA al inicio de cualquier sesión de ajuste para garantizar que comprenda el ecosistema completo.*
