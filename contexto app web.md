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
- **`Código.gs`:** Punto de entrada del servidor. Gestiona el enrutamiento (`doGet`), la entrega de preguntas (`getStaticQuestions`), el guardado de respuestas (`saveTestResults`) y la extracción de datos para reportes (`getPruebasData`).
- **`index.html`:** Estructura principal para los candidatos (Login y zona de pruebas).
- **`Dashboard.html`:** Interfaz de visualización de resultados para administradores.
- **`js-logic.html`:** Lógica del lado del cliente para el flujo de las pruebas (SPA, validación de respuestas, timers, modales).
- **`Controller.js.html`:** Lógica específica para el Dashboard (Búsqueda por ID, renderizado de gráficos y tablas de interpretación).
- **`css-styles.html`:** Sistema de diseño unificado, tokens de color y clases de utilidad propias.

---

## 3. Flujo Lógico de Usuario (Candidato)
1. **Landing:** El usuario elige entre "Ingresar al Dashboard" o "Ingresar a Prueba".
2. **Login:** Captura de datos básicos (Nombre, ID, Edad, Cargo, Sede). Estos se almacenan temporalmente en el objeto `appData.user`.
3. **Panel de Pruebas:** El candidato visualiza dos módulos: **Valanti** y **DISC**. Puede realizarlos en cualquier orden.
4. **Ejecución de Pruebas:**
   - **Valanti:** Prueba de valores (Verdad, Rectitud, Paz, Amor, No Violencia). Se divide en dos partes con reglas de puntuación distintas (Suma obligatoria de 3 puntos por par).
   - **DISC:** Prueba de personalidad comportamental. Ordenamiento de 1 a 4 por grupo de adjetivos/situaciones.
5. **Finalización:** Al terminar cada módulo, se llama a `google.script.run.saveTestResults()`, que añade una fila al Google Sheet correspondiente con los datos del usuario + sus respuestas crudas.

---

## 4. Lógica del Dashboard (Administrador)
- **Búsqueda:** Se ingresa el ID/Cédula del candidato.
- **Extracción de Datos:** El backend busca en las hojas `DISC` y `Valanti`. 
  - **Importante:** La búsqueda es inversa (de abajo hacia arriba) para obtener siempre el registro más reciente en caso de múltiples intentos.
- **Visualización:**
  - **DISC:** Gráfico de barras horizontales (Chart.js) + Interpretación textual basada en la característica más alta.
  - **Valanti:** Gráfico de radar (Chart.js) + Interpretación de los 5 valores universales.
- **Impresión:** Sistema de @media print optimizado para generar reportes en PDF tamaño A4 con membrete corporativo.

---

## 5. Estructura de la Base de Datos (Google Sheets)
- **Hoja 'DISC':** Columnas A-H (Datos Candidato), Columnas I-DK (Respuestas Crudas), **Columnas DI-DN (Cálculos y Resultados)**.
- **Hoja 'Valanti':** Columnas A-H (Datos Candidato), Columnas I-BU (Respuestas Crudas), **Columnas BV-CF (Resultados e Interpretaciones)**.
- **Hoja 'Datos':** Contiene etiquetas y configuraciones globales.

---

## 6. Consideraciones para Ajustes Futuros
Al solicitar cambios, ten en cuenta:
1. **Integridad de Fórmulas:** Los resultados numéricos dependen de fórmulas pre-existentes en las columnas finales de las hojas de cálculo. El código solo lee esos resultados calculados.
2. **Clasificación de Preguntas:** Las preguntas están "hardcodeadas" en `getStaticQuestions()` en `Código.gs` para evitar latencia de lectura del sheet.
3. **Persistencia:** No hay base de datos SQL o NoSQL; toda la persistencia es `appendRow()` en Sheets.
4. **Diseño:** Se debe mantener la coherencia con las variables CSS definidas en `css-styles.html`.

---
*Este archivo debe ser proporcionado a la IA al inicio de cualquier sesión de ajuste para garantizar que comprenda el ecosistema completo.*
