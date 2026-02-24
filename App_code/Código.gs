const SPREADSHEET_ID = '1aT_i1NXsvtiydBRdnT1iBlBDpQiI_9upFHUnToBYvcY';
const ADMIN_KEY = 'ADMIN26'; // INFO: En producción, idealmente usar PropertiesService

function doGet(e) {
  // Routing simple basado en parámetro URL
  if (e.parameter && e.parameter.view === 'dashboard') {
    return HtmlService.createTemplateFromFile('Dashboard')
      .evaluate()
      .setTitle('Resultados Psicotécnicos')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  // Nueva ruta para consultas
  if (e.parameter && e.parameter.view === 'consultas') {
    return HtmlService.createTemplateFromFile('Consultas')
      .evaluate()
      .setTitle('Consulta de Resultados')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Evaluación Psicotécnica')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

/**
 * Validar credenciales de administrador desde el servidor
 * Evita exponer la contraseña en el código cliente.
 */
function verifyAdminAccess(password) {
  return password === ADMIN_KEY;
}

/**
 * ESTA ES LA SOLUCIÓN:
 * Las preguntas están "hardcodeadas" aquí. Carga instantánea y cero errores.
 */
function getStaticQuestions() {
  
  // --- BASE DE DATOS VALANTI ---
  const valanti = [
    { id: 1, part: 1, pair: ["Muestro dedicación a las personas que amo", "Actúo con perseverancia"] },
    { id: 2, part: 1, pair: ["Soy tolerante", "Prefiero actuar con ética"] },
    { id: 3, part: 1, pair: ["Al pensar, utilizo mi intuición o 'sexto sentido'", "Me siento una persona digna"] },
    { id: 4, part: 1, pair: ["Logro buena concentración mental", "Perdono todas las ofensas de cualquier persona"] },
    { id: 5, part: 1, pair: ["Normalmente razono mucho", "Me destaco por el liderazgo en mis acciones"] },
    { id: 6, part: 1, pair: ["Pienso con integridad", "Me coloco objetivos y metas en mi vida personal"] },
    { id: 7, part: 1, pair: ["Soy una persona de iniciativa", "En mi trabajo normalmente soy curioso"] },
    { id: 8, part: 1, pair: ["Doy amor", "Para pensar hago síntesis de las distintas ideas"] },
    { id: 9, part: 1, pair: ["Me siento en calma", "Pienso con veracidad"] },
    { id: 10, part: 2, pair: ["Irrespetar la propiedad", "Sentir inquietud"] },
    { id: 11, part: 2, pair: ["Ser irresponsable", "Ser desconsiderado hacia cualquier persona"] },
    { id: 12, part: 2, pair: ["Caer en contradicciones al pensar", "Sentir intolerancia"] },
    { id: 13, part: 2, pair: ["Ser violento", "Actuar con cobardía"] },
    { id: 14, part: 2, pair: ["Sentirse presumido", "Generar divisiones y discordia entre los seres humanos"] },
    { id: 15, part: 2, pair: ["Ser Cruel", "Sentir Ira"] },
    { id: 16, part: 2, pair: ["Pensar con confusión", "Tener odio en el corazón"] },
    { id: 17, part: 2, pair: ["Decir blasfemias", "Ser escandaloso"] },
    { id: 18, part: 2, pair: ["Crear desigualdades entre los seres humanos", "Apasionarse por una idea"] },
    { id: 19, part: 2, pair: ["Sentirse inconstante", "Crear rivalidad hacia otros"] },
    { id: 20, part: 2, pair: ["Pensamientos irracionales", "Traicionar a un desconocido"] },
    { id: 21, part: 2, pair: ["Ostentar las riquezas materiales", "Sentirse infeliz"] },
    { id: 22, part: 2, pair: ["Entorpecer la cooperación entre los seres humanos", "La maldad"] },
    { id: 23, part: 2, pair: ["Odiar a cualquier ser de la naturaleza", "Hacer distinciones entre las personas"] },
    { id: 24, part: 2, pair: ["Sentirse intranquilo", "Ser infiel"] },
    { id: 25, part: 2, pair: ["Tener la mente dispersa", "Mostrar apatía al pensar"] },
    { id: 26, part: 2, pair: ["La injusticia", "Sentirse angustiado"] },
    { id: 27, part: 2, pair: ["Vengarse de los que odian a todo el mundo", "Vengarse del que hace daño a un familiar"] },
    { id: 28, part: 2, pair: ["Usar abusivamente el poder", "Distraerse"] },
    { id: 29, part: 2, pair: ["Ser desagradecido con los que ayudan", "Ser egoísta con todos"] },
    { id: 30, part: 2, pair: ["Cualquier forma de irrespeto", "Odiar"] }
  ];

  // --- BASE DE DATOS DISC ---
  // He unido tus contextos (preguntas) con las opciones correspondientes
  const disc = [
    { id: 1, text: "En un restaurante. Estoy esperando mesa, me dicen que faltan 10 minutos y pasan veinte:", options: ["Me molesto y le digo al mesero que ya pasó el doble de tiempo...", "No me doy cuenta, pues estoy metídisimo en la plática.", "No me fijo o, aunque me de cuenta, no digo algo.", "Le digo al mesero exactamente la hora en que llegué..."] },
    { id: 2, text: "Tengo mucha hambre y prisa. El mesero me trae un platillo que yo no pedí:", options: ["Me molesto y le digo impositivamente si no estaba poniendo atención...", "Cotorreo con el mesero para explicarle que no es lo que le pedí.", "Me quedo callado y me adapto a lo que me trajeron.", "Le digo de manera directa que eso no fue lo que pedí."] },
    { id: 3, text: "En una reunión de amigos:", options: ["Me gusta convencer a los demás de mis opiniones...", "Platico mucho o cuento chistes, hablo más de lo que escucho.", "Me quedo escuchando; la gente me busca porque soy excelente escucha...", "Observo y analizo a la gente, si doy mi opinión, lo hago únicamente si conozco..."] },
    { id: 4, text: "Mis compañeros de trabajo me describirían como alguien:", options: ["Energético, fuerte y agresivo.", "Social, alegre, platicador.", "Tranquilo, paciente, amable.", "Concreto, disciplinado, metódico."] },
    { id: 5, text: "En una discusión:", options: ["Busco tener la razón y no paro hasta conseguirla...", "Traro de decirles que no es para tanto, pues discutir me da flojera.", "Odio la agresión y mejor digo que sí, que estoy de acuerdo...", "Me baso en los hechos y busco comprobar mi punto de vista..."] },
    { id: 6, text: "Lo que realmente me emociona en la vida:", options: ["Los retos, la novedad, arriesgar.", "Las sorpresas, la diversión, el juego.", "La dulzura, el cariño, aceptación.", "Aprender, sabiduría, el conocimiento."] },
    { id: 7, text: "Si alguien me agrede:", options: ["Agredo de regreso pues necesito sacar mi enojo de inmediato...", "Evado la situación, o lo tiro de a loco.", "Me quedo callado y no demuestro lo que siento.", "Me angustio, me privo y me lo guardo, pero a la larga exploto..."] },
    { id: 8, text: "Cuando voy de compras:", options: ["Busco buenas ofertas, me encantan los descuentos.", "Me divierte ir de compras y me encanta comprar regalos...", "Soy indeciso, me cuesta mucho trabajo decidir y escoger.", "Sé lo que quiero y no gasto mi dinero si no lo encuentro..."] },
    { id: 9, text: "¿Qué frase te describe mejor?", options: ["Soy activo y energético; me gusta hacer más de una cosa a la vez...", "Soy alegre y jovial, si veo a alguien triste busco ponerlo de buen humor...", "Soy tranquilo y pasivo, me gusta que la gente se lleve bien...", "Soy analítico y observador, me gusta resolver problemas mentales..."] },
    { id: 10, text: "Cuando estoy trabajando en equipo soy:", options: ["El que manda y organiza.", "El que anima para que todos le echen ganas.", "El que apoya para lograr un equipo unido.", "El que organiza la parte estratégica para lograr la mayor probabilidad..."] },
    { id: 11, text: "Mis hermanos y la gente que me rodea, dicen que mis peores defectos son:", options: ["Ser agresivo y visceral.", "Ser distraído y desorganizado.", "Ser pasivo y lento.", "Ser terco y cuadrado."] },
    { id: 12, text: "Algunas de mis cualidades son:", options: ["Ser Determinado y seguro.", "Ser Optimista y alegre.", "Ser Adaptado y pacífico.", "Ser Cumplido y estable."] },
    { id: 13, text: "Estoy caminando, me tropiezo con algún desconocido:", options: ["Espero a que se quite de mi camino para seguir adelante.", "Les sonrío y me sigo de frente.", "Le pido perdón y me sigo de frente.", "Me hago a un lado y sin hablar sigo mi camino."] },
    { id: 14, text: "En el trabajo, sobresalgo en:", options: ["La toma de decisiones rápidas.", "Las relaciones públicas.", "La capacidad para adaptarme en equipos.", "La seguridad de tener calidad y puntualidad."] },
    { id: 15, text: "Mis defectos en el trabajo son:", options: ["No me gusta que me digan qué hacer.", "Desordenado y olvidadizo, a veces impuntual.", "Trabajo mal bajo presión.", "No me gusta delegar, prefiero trabajar solo."] },
    { id: 16, text: "Mi madre dice que de chico yo era:", options: ["Mandón y exigente.", "Alegre y platicaba con todo el mundo.", "Obediente y tranquilo.", "Bien hecho y no me gustaba ensuciarme."] },
    { id: 17, text: "Al expresarme:", options: ["Digo las cosas como son.", "Las digo de manera indirecta para no lastimar.", "Casi no expreso lo que siento.", "Digo las cosas de manera diplomática."] },
    { id: 18, text: "La emoción que demuestro con más frecuencia es:", options: ["Enojo.", "Optimismo.", "No demuestro emoción.", "Miedo."] },
    { id: 19, text: "Las maestras me reconocían porque:", options: ["Discutía mucho, y me encantaba demostrar que todo lo sabía.", "Era muy amiguero y hablaba mucho.", "No interrumpía y era callado.", "Buen estudiante y muy analítico."] },
    { id: 20, text: "Características que más te describen:", options: ["Autosuficiente y ambicioso.", "Despreocupado y popular.", "Cooperativo y adaptable.", "Preciso y exacto."] },
    { id: 21, text: "Características que más te describen:", options: ["Valiente y osado.", "Amiguero y platicador.", "Tolerante y flexible.", "Reservado y respetuoso."] },
    { id: 22, text: "Características que más te describen:", options: ["Obstinado, determinación para defenderme.", "Confianzudo, creo en los demás.", "Servicial, me gusta ayudar a los demás.", "Prudente, me gusta reflexionar bien las cosas."] },
    { id: 23, text: "Características que más te describen:", options: ["Emprendedor, fuerza de voluntad.", "Juguetón, atrae gente.", "Generoso, se adapta a los demás.", "Cuidadoso, tacto al decir las cosas."] },
    { id: 24, text: "Características que más te describen:", options: ["Atrevido, cree en sí mismo.", "Cálido, motiva a los demás.", "Calmado, hace lo que le piden.", "Pulcro, ordenado y limpio."] },
    { id: 25, text: "Características que más te describen:", options: ["Confrontador, gusta argumentar.", "Animado, alma de la fiesta.", "Armonioso, abierto a sugerencias.", "Culto, busca tener conocimiento."] },
    { id: 26, text: "Características que más te describen:", options: ["Toma acción, persuasivo, convincente.", "Carismático, magnético, desinhibido.", "Humilde, compasivo con la gente.", "Sistemático, escéptico, precavido."] }
  ];

  return { valanti: valanti, disc: disc, success: true };
}


// --- GUARDADO DE RESPUESTAS ---
function saveTestResults(testType, userData, answers) {
  // LockService para evitar condiciones de carrera (concurrencia)
  const lock = LockService.getScriptLock();
  try {
    // Esperar hasta 10 segundos por el lock
    lock.waitLock(10000); 

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(testType); 
    
    if(!sheet) return { success: false, error: "No se encontró la hoja " + testType };

    const finalRow = [
      new Date(),
      userData.id,
      userData.nombre,
      userData.edad,
      userData.genero,
      userData.sede,
      userData.cargo,
      userData.estudios,
      ...answers
    ];
    
    sheet.appendRow(finalRow);
    return { success: true };

  } catch(e) {
    return { success: false, error: "Error de servidor: " + e.toString() };
  } finally {
    // Siempre liberar el lock
    lock.releaseLock();
  }
}

/**
 * Helper robusto y optimizado para buscar ID.
 * OPTIMIZACIÓN: Solo carga la columna de interés para evitar latencia en bases datos grandes.
 */
function findRowById(sheet, id, columnIndex) {
  // columnIndex es 0-based. Columna A=0, B=1.
  // getRange(row, col, numRows, numCols). 
  // Empezamos en fila 2 para saltar cabecera.
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1; // Hoja vacía

  // Leer SOLAMENTE la columna de IDs
  const range = sheet.getRange(2, columnIndex + 1, lastRow - 1, 1);
  const values = range.getValues(); // Array de Arrays [[val1], [val2]...]
  
  const targetId = String(id).trim().toLowerCase();
  
  for (let i = 0; i < values.length; i++) {
    const cellValue = String(values[i][0]).trim().toLowerCase();
    if (cellValue === targetId) {
      // +2: porque iteramos un array que empieza en 0, pero leimos desde fila 2
      // Si i=0, es la fila 2.
      return i + 2; 
    }
  }
  return -1;
}

/**
 * Nueva función: Busca un ID en las hojas DISC y Valanti, extrae datos específicos
 * y retorna un objeto JSON unificado con toda la información.
 * SEGURIDAD: Requiere password de admin para funcionar.
 * @param {string} targetId - ID del candidato a buscar (Columna B en ambas hojas).
 * @param {string} authKey - Clave de administrador para autorizar la lectura.
 * @return {Object} JSON con datos del candidato, resultados DISC, Valanti y etiquetas.
 */
function getPruebasData(targetId, authKey) {
  // CAPA DE SEGURIDAD
  if (authKey !== ADMIN_KEY) {
    return { success: false, error: "ACCESO DENEGADO: Credenciales inválidas." };
  }

  if (!targetId) {
    return { success: false, error: "ID no proporcionado." };
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // 1. Obtener hojas
    const sheetDisc = ss.getSheetByName('DISC');
    const sheetValanti = ss.getSheetByName('Valanti');
    const sheetDatos = ss.getSheetByName('Datos');
    
    if (!sheetDisc) return { success: false, error: "Hoja 'DISC' no encontrada." };
    if (!sheetValanti) return { success: false, error: "Hoja 'Valanti' no encontrada." };
    if (!sheetDatos) return { success: false, error: "Hoja 'Datos' no encontrada." };
    
    // 2. Buscar el targetId en columna B (índice 1) de ambas hojas
    const discRowIndex = findRowById(sheetDisc, targetId, 1);
    const valantiRowIndex = findRowById(sheetValanti, targetId, 1);
    
    // 3. Validar que se encontró en al menos una hoja
    if (discRowIndex === -1 && valantiRowIndex === -1) {
      return { 
        success: false, 
        error: `No se encontró el ID "${targetId}" en ninguna de las hojas (DISC o Valanti).` 
      };
    }
    
    // 4. Preparar objeto de respuesta
    let candidatoData = {};
    let discData = null;
    let valantiData = null;
    
    // 5. EXTRAER DATOS DE DISC si se encontró
    if (discRowIndex !== -1) {
      // Datos del candidato: Columnas 3 a 8 (C a H) → índices 2 a 7
      // Usamos indices 0-based para getValues, pero getRange usa 1-based para coordenadas
      // fila, col, numRows, numCols
      // Col 3 = C.
      const candidatoValues = sheetDisc.getRange(discRowIndex, 3, 1, 6).getValues()[0];
      
      candidatoData = {
        nombre: candidatoValues[0],      // Col C (3)
        edad: candidatoValues[1],        // Col D (4)
        genero: candidatoValues[2],      // Col E (5)
        sede: candidatoValues[3],        // Col F (6)
        cargo: candidatoValues[4],       // Col G (7)
        estudios: candidatoValues[5]     // Col H (8)
      };
      
      // Resultados DISC: Columnas 113 a 116 (DI a DL)
      const discScores = sheetDisc.getRange(discRowIndex, 113, 1, 4).getValues()[0];
      
      discData = {
        D: discScores[0],   // DI (113)
        I: discScores[1],   // DJ (114)
        S: discScores[2],   // DK (115)
        C: discScores[3]    // DL (116)
      };
    }
    
    // 6. EXTRAER DATOS DE VALANTI si se encontró
    if (valantiRowIndex !== -1) {
      // Si no se encontró en DISC, extraer datos del candidato de Valanti
      if (Object.keys(candidatoData).length === 0) {
        const candidatoValues = sheetValanti.getRange(valantiRowIndex, 3, 1, 6).getValues()[0];
        
        candidatoData = {
          nombre: candidatoValues[0],
          edad: candidatoValues[1],
          genero: candidatoValues[2],
          sede: candidatoValues[3],
          cargo: candidatoValues[4],
          estudios: candidatoValues[5]
        };
      }
      
      // Resultados Valanti: Columnas 74 a 78 (BV a BZ)
      const valantiScores = sheetValanti.getRange(valantiRowIndex, 74, 1, 5).getValues()[0];
      
      valantiData = {
        valor1: valantiScores[0],  // BV (74)
        valor2: valantiScores[1],  // BW (75)
        valor3: valantiScores[2],  // BX (76)
        valor4: valantiScores[3],  // BY (77)
        valor5: valantiScores[4]   // BZ (78)
      };
    }
    
    // 7. EXTRAER ETIQUETAS DE LA HOJA 'Datos' (O2:O6)
    const etiquetasRange = sheetDatos.getRange('O2:O6').getValues();
    const etiquetas = etiquetasRange.map(row => row[0]); // Convertir array 2D a 1D
    
    // 8. Retornar objeto JSON unificado
    return {
      success: true,
      candidato: candidatoData,
      disc: discData,
      valanti: valantiData,
      etiquetasValanti: etiquetas  // [Verdad, Rectitud, Paz, Amor, No violencia]
    };
    
  } catch (error) {
    return { 
      success: false, 
      error: "Error al procesar la solicitud: " + error.toString() 
    };
  }
}