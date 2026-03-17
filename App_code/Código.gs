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
 * Lee la hoja unificada 'Resultado' y retorna los datos
 * del candidato cuyo ID coincide con targetId (búsqueda inversa = registro más reciente).
 *
 * Estructura de columnas (0-based):
 *  A(0): fecha, B(1): ID, C(2): nombre, D(3): sede, E(4): cargo
 *  F(5): suma_a_dominante, G(6): suma_b_influyente, H(7): suma_c_estable, I(8): suma_d_minucioso
 *  J(9): perfil_mas_alto, K(10): caracteristicas_mas_alto, L(11): descripcion_mas_alto, M(12): aporte_mas_alto
 *  N(13): verdad_normalizado, O(14): rectitud_normalizado, P(15): paz_normalizado, Q(16): amor_normalizado, R(17): noviolencia_normalizado
 *  S(18): valor_mas_alto
 *  T(19): interpretacion_verdad, U(20): interpretacion_rectitud, V(21): interpretacion_paz
 *  W(22): interpretacion_amor,  X(23): interpretacion_noviolencia
 */
function getPruebasData(targetId) {

  if (!targetId) {
    return { success: false, error: "ID no proporcionado." };
  }

  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Resultado');

    if (!sheet) {
      return { success: false, error: "Hoja 'Resultado' no encontrada en el Spreadsheet." };
    }

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    Logger.log('[getPruebasData] Buscando ID: "%s" | Filas totales: %s | Columnas totales: %s', targetId, lastRow, lastCol);

    if (lastRow < 2) {
      return { success: false, error: "La hoja 'Resultado' no contiene datos." };
    }

    // Leer todas las filas de datos: A2 hasta la columna X (24).
    const numCols = Math.max(lastCol, 24);
    const dataRows = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();
    const targetStr = String(targetId).trim();

    // Búsqueda inversa: último registro primero.
    let row = null;
    let foundIndex = -1;
    for (let i = dataRows.length - 1; i >= 0; i--) {
      const cellId = String(dataRows[i][1]).trim();
      if (cellId === targetStr) {
        row = dataRows[i];
        foundIndex = i + 2;
        break;
      }
    }

    if (!row) {
      Logger.log('[getPruebasData] ID "%s" NO encontrado. Total filas escaneadas: %s', targetId, dataRows.length);
      const muestra = dataRows.slice(0, 5).map(r => String(r[1])).join(', ');
      Logger.log('[getPruebasData] Primeros IDs en la hoja: %s', muestra);
      return {
        success: false,
        error: `No se encontraron resultados para el ID "${targetId}". Verifique que el candidato haya completado alguna prueba.`
      };
    }

    Logger.log('[getPruebasData] ID "%s" encontrado en fila %s.', targetId, foundIndex);

    let fechaStr = '';
    try {
      if (row[0] && row[0] instanceof Date) {
        fechaStr = row[0].toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
      } else if (row[0]) {
        fechaStr = String(row[0]).trim();
      }
    } catch(e) { fechaStr = 'Sin información'; }

    const parseText = (val) => {
        if (val === null || val === undefined || String(val).trim() === '') return "Sin información";
        return String(val).trim();
    };

    const parseNum = (val) => {
        if (val === null || val === undefined || String(val).trim() === '') return 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

    if (fechaStr === '') fechaStr = 'Sin información';

    const dataObj = {
      fecha: fechaStr,
      id: parseText(row[1] || targetId),
      nombre: parseText(row[2]),
      sede: parseText(row[3]),
      cargo: parseText(row[4]),
      
      dominante: parseNum(row[5]),
      influyente: parseNum(row[6]),
      estable: parseNum(row[7]),
      minucioso: parseNum(row[8]),
      
      perfilMasAlto: parseText(row[9]),
      caracteristicasMasAlto: parseText(row[10]),
      descripcionMasAlto: parseText(row[11]),
      aporteMasAlto: parseText(row[12]),
      
      verdad: parseNum(row[13]),
      rectitud: parseNum(row[14]),
      paz: parseNum(row[15]),
      amor: parseNum(row[16]),
      noviolencia: parseNum(row[17]),
      
      valorMasAlto: parseText(row[18]),
      
      interpVerdad: parseText(row[19]),
      interpRectitud: parseText(row[20]),
      interpPaz: parseText(row[21]),
      interpAmor: parseText(row[22]),
      interpNoViolencia: parseText(row[23])
    };

    const resultado = {
      success: true,
      data: dataObj
    };

    return JSON.parse(JSON.stringify(resultado));

  } catch (error) {
    Logger.log('[getPruebasData] ERROR: %s', error.toString());
    return {
      success: false,
      error: "Error al procesar la solicitud: " + error.toString()
    };
  }
}