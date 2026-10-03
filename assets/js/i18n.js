/* ============================================================
   i18n.js · Traducción del portafolio (ES por defecto, EN)
   ------------------------------------------------------------
   Cómo funciona:
   - El HTML se escribe en español (funciona sin JS).
   - Cada texto lleva data-i18n="clave" (textContent) o
     data-i18n-html="clave" (innerHTML, para textos con <em>, <br>…).
   - Los atributos traducibles usan data-i18n-attr="aria-label:clave"
     (lista separada por comas).
   - El idioma vive en <html lang> y se recuerda en localStorage
     ("portafolio-lang"). Prioridad: ?lang= → localStorage → <html lang> → ES.
   - Al cambiar se emite "i18n:changed" para que projects.js y main.js
     puedan repintar sus cadenas dinámicas.
   Sin build, sin dependencias.
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "portafolio-lang";
  var DEFAULT_LANG = "es";
  var SUPPORTED = ["es", "en"];

  /* ---------- Diccionarios ---------- */
  var DICT = {
    es: {
      /* --- Meta --- */
      "meta.title": "Alejandro Espinoza López · Marketing & Diseño Gráfico",
      "meta.description": "Portafolio de Alejandro Espinoza López, estudiante de Marketing: diseño gráfico, contenido y herramientas propias. Años de trabajo operativo encima, sigo aprendiendo.",
      "meta.ogTitle": "Alejandro Espinoza López · Marketing & Diseño Gráfico",
      "meta.ogDescription": "Vengo de puestos operativos y de hacer piezas visuales por mi cuenta. Ahora lo estudio en serio: Marketing + Diseño.",

      /* --- Accesibilidad / nav --- */
      "a11y.brand": "Ir al inicio",
      "a11y.nav": "Navegación principal",
      "a11y.theme.light": "Cambiar a tema claro",
      "a11y.theme.dark": "Cambiar a tema oscuro",
      "a11y.eggs": "Ver huevos de pascua",
      "a11y.menu.open": "Abrir menú",
      "a11y.menu.close": "Cerrar menú",
      "a11y.lang": "Cambiar idioma",
      "a11y.langList": "Idiomas disponibles",
      "a11y.scrollCue": "Bajar al perfil",
      "a11y.metrics": "Cifras clave",
      "a11y.langLabel": "Idioma",

      "nav.perfil": "Perfil",
      "nav.trayectoria": "Trayectoria",
      "nav.competencias": "Competencias",
      "nav.proyectos": "Proyectos",
      "nav.formacion": "Formación",
      "nav.contacto": "Contacto",
      "nav.cta": "Hablemos",

      /* --- Hero --- */
      "hero.eyebrow": "Lima, Perú · Estudiante de Marketing · 1<sup>er</sup> ciclo",
      "hero.secret": "hecho a mano, con café",
      "hero.rotStatic": "Me muevo entre",
      "hero.lead": "No llego a marketing desde cero. Trabajé años en puestos operativos: moderando transmisiones en vivo, apoyando eventos en la calle y haciendo trámites de oficina. En el camino hice piezas visuales y me armé mis propias herramientas para facilitarme el trabajo. Ahora estudio Marketing para entender la teoría de lo que hacía por instinto.",
      "hero.ctaProjects": "Ver proyectos",
      "hero.ctaTrajectory": "Ver trayectoria",
      "hero.cue": "Desliza",

      /* --- Rotador (se usa desde main.js) --- */
      "rot.words": "marketing digital|diseño gráfico|contenido|brand safety|game design|game development|game asset creation",

      /* --- Métricas --- */
      "metrics.a11y": "Cifras clave",
      "metrics.years": "Años de trayectoria",
      "metrics.games": "Videojuegos publicados",
      "metrics.jams": "Game jams",
      "metrics.industries": "Industrias",
      "metrics.note": "BPO y Trust&nbsp;&amp;&nbsp;Safety · IA generativa · Publicidad y eventos · Certificaciones técnicas · Arquitectura · Retail farmacéutico · Delivery y logística · Seguridad · Automotriz",

      /* --- Perfil --- */
      "perfil.eyebrow": "01 · Perfil",
      "perfil.title": "Lo aprendí trabajando.<br>Ahora lo estudio.",
      "perfil.p1": "Soy estudiante de primer ciclo de Marketing. Antes de entrar a la carrera trabajé varios años en puestos operativos: moderando transmisiones en vivo, supervisando activaciones en eventos, haciendo trámites de oficina y escribiendo prompts para generar imágenes. No eran puestos de marketing, pero ahí fue donde empecé a fijarme en cómo las marcas tratan a la gente.",
      "perfil.p2": "En esos trabajos aprendí cosas simples que me sirven hasta ahora: revisar dos veces, decidir rápido cuando hay presión, anotar todo para que otro pueda seguir, y mantener el ritmo aunque el día venga cargado. No lo aprendí en un aula: lo aprendí haciendo, que es como mejor aprendo.",
      "perfil.p3": "Entré a estudiar Marketing porque quiero entender la teoría detrás de lo que ya vi en la práctica: por qué la gente mira lo que mira y cómo se mide si algo funcionó. Voy en el primer ciclo, así que todavía me falta mucho, pero llego con ganas y con experiencia previa.",
      "perfil.twistTag": "En corto",
      "perfil.twist": "Estudiante de Marketing con años de trabajo encima y muchas ganas de seguir aprendiendo. Inglés intermedio y me acomodo al trabajo remoto.",

      /* --- Trayectoria --- */
      "tl.eyebrow": "02 · Trayectoria",
      "tl.title": "Dónde estuve<br>y qué me dejó.",
      "tl.sub": "Cada puesto me enseñó algo distinto. Esto es lo que me llevo de cada uno.",
      "tl.j1.role": "Moderador de contenido LIVE",
      "tl.j1.org": "Teleperformance <span class=\"tl-client\">· plataforma global de ByteDance</span>",
      "tl.j1.p1": "Revisión y moderación de transmisiones en vivo aplicando políticas y estándares comunitarios. Mi parte era chica, pero aprendí lo que cuesta cuidar una marca a escala global.",
      "tl.j1.p2": "Identificación de infracciones y documentación de decisiones, dejando trazabilidad para auditoría.",
      "tl.j1.p3": "Escalamiento de casos sensibles con precisión y confidencialidad, cumpliendo métricas de calidad y productividad.",
      "tl.j2.role": "Apoyo a eventos · EPSON",
      "tl.j2.org": "Mayo Publicidad",
      "tl.j2.p1": "Apoyo en evento de premiación de EPSON.",
      "tl.j2.p2": "Atención y orientación a invitados para que la ceremonia fluyera sin contratiempos.",
      "tl.j3.role": "Apoyo a eventos · Enfaland",
      "tl.j3.org": "Mayo Publicidad",
      "tl.j3.p1": "Apoyo en evento de Enfaland (Mead Johnson).",
      "tl.j3.p2": "Soporte en logística y atención para el desarrollo del evento.",
      "tl.j4.role": "Personal de seguridad nocturno · Eucerin",
      "tl.j4.org": "Mayo Publicidad",
      "tl.j4.p1": "Resguardo nocturno de una máquina de detección de tratamiento facial de Eucerin.",
      "tl.j4.p2": "Vigilancia del equipo durante la noche, entregándolo sin novedades.",
      "tl.j5.role": "Moderador de contenido LIVE",
      "tl.j5.org": "Majorel <span class=\"tl-client\">· plataforma global de ByteDance</span>",
      "tl.j5.p1": "Evaluación de contenido LIVE con criterios consistentes, para sostener el mismo estándar en miles de casos.",
      "tl.j5.p2": "Toma de decisiones en tiempo real y reporte de casos para revisión adicional, sin frenar el flujo.",
      "tl.j6.role": "Apoyo a eventos · EPSON",
      "tl.j6.org": "Mayo Publicidad",
      "tl.j6.p1": "Apoyo en evento de EPSON en cochera, redirigiendo a los invitados hacia el evento.",
      "tl.j6.p2": "Orientación en accesos para un ingreso ordenado.",
      "tl.j7.role": "Soporte Técnico Administrativo",
      "tl.j7.org": "Inspecciones, Ensayos, Supervisión y Certificaciones Operativas SAC",
      "tl.j7.p1": "Gestión de documentación y registros de múltiples proyectos simultáneos, manteniendo la información al día.",
      "tl.j7.p2": "Organización de información y soporte oportuno a los equipos, para que el trabajo diario no se detenga.",
      "tl.j8.role": "Apoyo a eventos · MiBanco",
      "tl.j8.org": "Mayo Publicidad",
      "tl.j8.p1": "Orientación y soporte a asistentes para una experiencia ordenada en un evento corporativo.",
      "tl.j8.p2": "Colaboración en logística y atención al público en el evento del 25 aniversario, cuidando que cada interacción dejara una buena impresión.",
      "tl.j9.role": "Apoyo a activación · Tambo",
      "tl.j9.org": "Mayo Publicidad",
      "tl.j9.p1": "Apoyo en activación de Tambo por el día del pollo a la brasa.",
      "tl.j9.p2": "Atención al público y soporte en la dinámica del evento.",
      "tl.j10.role": "Ingeniero de prompts",
      "tl.j10.org": "OpenArt.ai",
      "tl.j10.p1": "Diseño y ajuste de prompts para generar piezas visuales orientadas a ventas y comunicación comercial.",
      "tl.j10.p2": "Traducción de objetivos de negocio a resultados visuales concretos, convirtiendo briefs en piezas listas para comunicar.",
      "tl.j10.p3": "Ajuste de cada resultado al objetivo de la solicitud, iterando hasta lograr la pieza adecuada.",
      "tl.j11.role": "Supervisor de Activación de Eventos · Eucerin",
      "tl.j11.org": "Mayo Publicidad",
      "tl.j11.p1": "Supervisión de activaciones promocionales para Eucerin, de cara al consumidor real.",
      "tl.j11.p2": "Coordinación de actividades y verificación de tareas durante los eventos, para cumplir lo planificado.",
      "tl.j12.role": "Delivery",
      "tl.j12.org": "LQ Products",
      "tl.j12.p1": "Entrega de pedidos de una empresa de importación.",
      "tl.j12.p2": "Rutas y tiempos cumplidos para que cada pedido llegara en fecha.",
      "tl.j13.role": "Asistente de inventario",
      "tl.j13.org": "Farmacia Kellertas",
      "tl.j13.p1": "Control de inventario, actualización de registros y verificación de disponibilidad, manteniendo la base de datos actualizada.",
      "tl.j13.p2": "Seguimiento de stock y reposición para que nunca falte producto.",
      "tl.j14.role": "Auxiliar de oficina",
      "tl.j14.org": "Luis Espinoza Arce",
      "tl.j14.p1": "Organización documental y atención de requerimientos administrativos para la operación diaria.",
      "tl.j14.p2": "Orden y constancia en las tareas de oficina durante siete años.",
      "tl.j15.role": "Auxiliar de oficina",
      "tl.j15.org": "E&amp;M Arquitectos Asociados SRL",
      "tl.j15.p1": "Organización de documentación y tareas administrativas para el equipo.",
      "tl.j15.p2": "Soporte al funcionamiento diario del equipo de arquitectura, para que trabajara sin interrupciones.",
      "tl.j16.role": "Operario de limpieza",
      "tl.j16.org": "Kia",
      "tl.j16.p1": "Limpieza de vehículos en exhibición.",
      "tl.j16.p2": "Cada unidad presentable para los clientes del local.",

      /* --- Competencias --- */
      "skills.eyebrow": "03 · Competencias",
      "skills.title": "Herramientas<br>con las que trabajo.",
      "skills.c1.title": "Marketing y contenido digital",
      "skills.c1.i1": "Comunicación visual",
      "skills.c1.i2": "Contenido digital",
      "skills.c1.i3": "Materiales promocionales",
      "skills.c1.i4": "Redacción de prompts comerciales",
      "skills.c1.i5": "Brand safety",
      "skills.c2.title": "Diseño y comunicación visual",
      "skills.c2.i1": "Adobe Suite <em>(intermedio)</em>",
      "skills.c2.i2": "Diseño gráfico",
      "skills.c3.title": "Datos y reportes",
      "skills.c3.i1": "Excel",
      "skills.c3.i2": "Elaboración de reportes",
      "skills.c3.i3": "Bases de datos",
      "skills.c4.title": "Producto y tecnología",
      "skills.c4.i1": "Unity 3D <em>(intermedio)</em>",
      "skills.c4.i2": "Diseño y desarrollo web",
      "skills.c5.title": "Idiomas",
      "skills.c5.i1": "Español <em>nativo</em>",
      "skills.c5.i2": "Inglés <em>intermedio</em>",

      /* --- Softs --- */
      "softs.kicker": "Cómo trato de trabajar",
      "softs.s1.t": "Atención al detalle",
      "softs.s1.d": "En un vivo no hay segundos de margen. Eso me acostumbró a revisar dos veces y a no confiarme.",
      "softs.s2.t": "Criterio bajo presión",
      "softs.s2.d": "Me tocó decidir en tiempo real con métricas de calidad y productividad encima, cuidando no romperle la experiencia a quien está del otro lado.",
      "softs.s3.t": "Confidencialidad",
      "softs.s3.d": "Vi casos sensibles en una plataforma global. Aprendí a ser discreto y a cuidar qué se documenta y cómo.",
      "softs.s4.t": "Resiliencia",
      "softs.s4.d": "Meses moderando en vivo con volumen alto, tratando de mantener el mismo estándar todos los días.",
      "softs.s5.t": "Adaptabilidad",
      "softs.s5.d": "Pasé del retail farmacéutico a la IA generativa. Cada cambio me obligó a ordenarme rápido, y eso se volvió costumbre.",
      "softs.s6.t": "Orientación a resultados",
      "softs.s6.d": "Trato de que cada registro, reporte o pieza sirva para algo después, no solo de que quede bonita.",
      "softs.s7.t": "Comunicación clara",
      "softs.s7.d": "Trato de explicar sin vueltas, por escrito y en persona. Si algo no se entiende, el problema es cómo lo dije.",
      "softs.s8.t": "Aprendizaje rápido",
      "softs.s8.d": "Estoy en primer ciclo: todo me toca aprenderlo dos veces, en la práctica y en clase. Ya tengo el hábito.",
      "softs.s9.t": "Apertura al feedback",
      "softs.s9.d": "Prefiero que me corrijan temprano a entregar algo mal tarde. Pregunto cuando no sé.",

      /* --- Proyectos --- */
      "proj.eyebrow": "04 · Proyectos",
      "proj.title": "Cosas que hice<br>y de las que aprendí.",
      "proj.sub": "Herramientas, videojuegos y experimentos que publiqué en el camino. Están tal cual salieron.",
      "proj.loading": "Cargando proyectos…",
      "proj.empty": "Aún no hay proyectos publicados.",
      "proj.repo": "Repositorio",
      "proj.demoFallback": "Ver / jugar",
      "proj.source": "Fuente: <code>{file}</code> · {n} proyecto(s)",
      "proj.sourceNone": "Fuente: <code>{file}</code> · sin datos",
      "proj.status.Publicado": "Publicado",
      "proj.status.En desarrollo": "En desarrollo",

      /* --- Formación --- */
      "edu.eyebrow": "05 · Formación",
      "edu.title": "Estudiando<br>para entender mejor<br>lo que hago.",
      "edu.period1": "2026 · en curso",
      "edu.role1": "Carrera de Marketing",
      "edu.org1": "Primer ciclo",
      "edu.desc1": "Investigación de mercados, comportamiento del consumidor, estrategia de marca. Haber visto estos temas en la práctica me ayuda a aterrizar la teoría.",
      "edu.period2": "Junio 2021",
      "edu.role2": "Diseño Gráfico",
      "edu.org2": "LinkedIn Learning",
      "edu.period3": "Enero 2021",
      "edu.role3": "Diseño y Desarrollo Web",
      "edu.org3": "IDAT",

      /* --- Contacto --- */
      "contact.eyebrow": "06 · Contacto",
      "contact.title": "¿Conversamos?",
      "contact.lead": "Soy estudiante de Marketing y estoy abierto a prácticas, posiciones junior y colaboraciones en marketing digital, contenido, diseño gráfico y producto interactivo. Escríbeme y te respondo rápido.",

      /* --- Footer --- */
      "footer.note": "Marketing · Diseño gráfico · Contenido · Lima, Perú",

      /* --- Easter eggs: panel --- */
      "egg.title": "Huevos de pascua",
      "egg.close": "Cerrar",
      "egg.subMobile": "Cazados en este dispositivo: celular.",
      "egg.subPC": "Cazados en este dispositivo: PC. Los de celular solo aparecen en celular.",
      "egg.hidden": "???",
      "egg.empty": "Aún no hay huevos para este dispositivo.",
      "egg.found": "Huevo encontrado: {n}/{total} en tu colección.",

      /* --- Easter eggs: nombres y pistas (PC) --- */
      "egg.konami.name": "Código legendario",
      "egg.konami.hint": "Una secuencia de flechas y letras de otra época...",
      "egg.consola.name": "Ojos curiosos",
      "egg.consola.hint": "Abre las herramientas de desarrollo.",
      "egg.flama.name": "Aviva la flama",
      "egg.flama.hint": "La página perdida esconde una flama juguetona.",
      "egg.fantasma.name": "¿Sigues ahí?",
      "egg.fantasma.hint": "Quédate quieto un buen rato...",
      "egg.fuegos.name": "Celebración",
      "egg.fuegos.hint": "Haz clic en mi correo.",
      "egg.logro.name": "Lector completo",
      "egg.logro.hint": "Llega hasta el final de la página.",
      "egg.fiesta.name": "GG",
      "egg.fiesta.hint": "Dos veces la misma letra gamer.",

      /* --- Easter eggs: nombres y pistas (celular) --- */
      "egg.shake.name": "Terremoto",
      "egg.shake.hint": "Sacude el celular...",
      "egg.landscape.name": "Panorámica",
      "egg.landscape.hint": "Gira el celular a horizontal...",
      "egg.tripletap.name": "Tercer dedo",
      "egg.tripletap.hint": "Toca con tres dedos a la vez...",
      "egg.holdmail.name": "Copiado",
      "egg.holdmail.hint": "Mantén presionado mi correo...",
      "egg.dragtitle.name": "Detrás del nombre",
      "egg.dragtitle.hint": "Arrastra el título a un lado...",
      "egg.nightowl.name": "Trasnochador",
      "egg.nightowl.hint": "Abre el portafolio de madrugada...",
      "egg.battery.name": "Ahorro",
      "egg.battery.hint": "Entra con la batería baja...",

      /* --- Toasts --- */
      "toast.shake": "Terremoto: lluvia de brasas.",
      "toast.landscape": "Buena vista panorámica.",
      "toast.tripletap": "Tema prestado por 10 segundos.",
      "toast.holdmail": "Correo copiado. Escríbeme cuando quieras.",
      "toast.nightowl": "¿Trasnochando? Yo también hice esto de noche.",
      "toast.battery": "Batería baja: descansemos los dos.",
      "toast.konami": "Ves, los videojuegos sí sirven para algo.",
      "toast.fiesta": "Modo fiesta: 15 segundos. GG.",
      "toast.fantasma": "¿Sigues ahí? Mueve el mouse para avivar las brasas.",
      "toast.logro": "🏆 Logro desbloqueado: llegaste al final. Pocos lo hacen.",
      "toast.console": "Hola, curioso. Si abriste DevTools, ya tenemos algo en común: nos gusta ver cómo están hechas las cosas. Hablemos: esplopale@gmail.com",

      /* --- Tooltip / nav micro --- */
      "lang.es": "Español",
      "lang.en": "Inglés",
      "lang.code": "ES"
    },

    en: {
      /* --- Meta --- */
      "meta.title": "Alejandro Espinoza López · Marketing & Graphic Design",
      "meta.description": "Portfolio of Alejandro Espinoza López, Marketing student: graphic design, content and self-built tools. Years of operational work behind me, still learning.",
      "meta.ogTitle": "Alejandro Espinoza López · Marketing & Graphic Design",
      "meta.ogDescription": "I come from operational roles and from making visual pieces on my own. Now I'm studying it seriously: Marketing + Design.",

      /* --- Accesibilidad / nav --- */
      "a11y.brand": "Go to top",
      "a11y.nav": "Main navigation",
      "a11y.theme.light": "Switch to light theme",
      "a11y.theme.dark": "Switch to dark theme",
      "a11y.eggs": "View easter eggs",
      "a11y.menu.open": "Open menu",
      "a11y.menu.close": "Close menu",
      "a11y.lang": "Change language",
      "a11y.langList": "Available languages",
      "a11y.scrollCue": "Scroll to profile",
      "a11y.metrics": "Key figures",
      "a11y.langLabel": "Language",

      "nav.perfil": "Profile",
      "nav.trayectoria": "Background",
      "nav.competencias": "Skills",
      "nav.proyectos": "Projects",
      "nav.formacion": "Education",
      "nav.contacto": "Contact",
      "nav.cta": "Let's talk",

      /* --- Hero --- */
      "hero.eyebrow": "Lima, Peru · Marketing student · 1<sup>st</sup> term",
      "hero.secret": "handmade, with coffee",
      "hero.rotStatic": "I move between",
      "hero.lead": "I didn't come to marketing from scratch. I worked for years in operational roles: moderating live streams, supporting street events and handling office paperwork. Along the way I made visual pieces and built my own tools to make the work easier. Now I'm studying Marketing to understand the theory behind what I used to do by instinct.",
      "hero.ctaProjects": "See projects",
      "hero.ctaTrajectory": "See background",
      "hero.cue": "Scroll",

      /* --- Rotator --- */
      "rot.words": "digital marketing|graphic design|content|brand safety|game design|game development|game asset creation",

      /* --- Métricas --- */
      "metrics.a11y": "Key figures",
      "metrics.years": "Years of experience",
      "metrics.games": "Games published",
      "metrics.jams": "Game jams",
      "metrics.industries": "Industries",
      "metrics.note": "BPO & Trust&nbsp;&amp;&nbsp;Safety · Generative AI · Advertising and events · Technical certifications · Architecture · Pharmaceutical retail · Delivery and logistics · Security · Automotive",

      /* --- Perfil --- */
      "perfil.eyebrow": "01 · Profile",
      "perfil.title": "I learned it by working.<br>Now I study it.",
      "perfil.p1": "I'm a first-term Marketing student. Before starting my degree I worked several years in operational roles: moderating live streams, supervising activations at events, handling office paperwork and writing prompts to generate images. They weren't marketing roles, but that's where I started noticing how brands treat people.",
      "perfil.p2": "In those jobs I learned simple things I still use: double-checking, deciding fast under pressure, writing everything down so someone else can pick it up, and keeping the pace even on heavy days. I didn't learn it in a classroom: I learned it by doing, which is how I learn best.",
      "perfil.p3": "I started studying Marketing because I want to understand the theory behind what I've already seen in practice: why people look at what they look at and how you measure whether something worked. I'm in my first term, so I still have a long way to go, but I arrive with motivation and prior experience.",
      "perfil.twistTag": "In short",
      "perfil.twist": "Marketing student with years of work behind me and a real appetite to keep learning. Intermediate English and comfortable with remote work.",

      /* --- Trayectoria --- */
      "tl.eyebrow": "02 · Background",
      "tl.title": "Where I've been<br>and what it left me.",
      "tl.sub": "Every role taught me something different. This is what I take from each one.",
      "tl.j1.role": "LIVE Content Moderator",
      "tl.j1.org": "Teleperformance <span class=\"tl-client\">· ByteDance global platform</span>",
      "tl.j1.p1": "Reviewing and moderating live streams by applying policies and community standards. My part was small, but I learned what it costs to protect a brand at a global scale.",
      "tl.j1.p2": "Identifying violations and documenting decisions, leaving a traceable record for auditing.",
      "tl.j1.p3": "Escalating sensitive cases with precision and confidentiality, meeting quality and productivity targets.",
      "tl.j2.role": "Event Support · EPSON",
      "tl.j2.org": "Mayo Publicidad",
      "tl.j2.p1": "Support at an EPSON awards event.",
      "tl.j2.p2": "Guiding guests so the ceremony ran without a hitch.",
      "tl.j3.role": "Event Support · Enfaland",
      "tl.j3.org": "Mayo Publicidad",
      "tl.j3.p1": "Support at an Enfaland (Mead Johnson) event.",
      "tl.j3.p2": "Logistics and guest support for the event.",
      "tl.j4.role": "Night Security Guard · Eucerin",
      "tl.j4.org": "Mayo Publicidad",
      "tl.j4.p1": "Overnight guarding of an Eucerin facial-treatment detection machine.",
      "tl.j4.p2": "Watching over the equipment through the night, handing it over with nothing to report.",
      "tl.j5.role": "LIVE Content Moderator",
      "tl.j5.org": "Majorel <span class=\"tl-client\">· ByteDance global platform</span>",
      "tl.j5.p1": "Assessing LIVE content with consistent criteria, to hold the same standard across thousands of cases.",
      "tl.j5.p2": "Real-time decision-making and reporting cases for further review, without slowing the flow.",
      "tl.j6.role": "Event Support · EPSON",
      "tl.j6.org": "Mayo Publicidad",
      "tl.j6.p1": "Support at an EPSON event in a parking garage, redirecting guests toward the event.",
      "tl.j6.p2": "Guiding access points for an orderly entrance.",
      "tl.j7.role": "Administrative Technical Support",
      "tl.j7.org": "Inspecciones, Ensayos, Supervisión y Certificaciones Operativas SAC",
      "tl.j7.p1": "Managing documentation and records for several projects at once, keeping the information current.",
      "tl.j7.p2": "Organising information and giving timely support to the teams, so the daily work never stops.",
      "tl.j8.role": "Event Support · MiBanco",
      "tl.j8.org": "Mayo Publicidad",
      "tl.j8.p1": "Guiding and supporting attendees for an orderly experience at a corporate event.",
      "tl.j8.p2": "Helping with logistics and public attention at the 25th anniversary event, making sure every interaction left a good impression.",
      "tl.j9.role": "Activation Support · Tambo",
      "tl.j9.org": "Mayo Publicidad",
      "tl.j9.p1": "Support at a Tambo activation for rotisserie chicken day.",
      "tl.j9.p2": "Guest attention and support in the event dynamics.",
      "tl.j10.role": "Prompt Engineer",
      "tl.j10.org": "OpenArt.ai",
      "tl.j10.p1": "Designing and tuning prompts to generate visual pieces aimed at sales and commercial communication.",
      "tl.j10.p2": "Translating business goals into concrete visual results, turning briefs into pieces ready to communicate.",
      "tl.j10.p3": "Shaping each result to the goal of the request, iterating until the right piece came out.",
      "tl.j11.role": "Event Activation Supervisor · Eucerin",
      "tl.j11.org": "Mayo Publicidad",
      "tl.j11.p1": "Supervising promotional activations for Eucerin, face to face with real consumers.",
      "tl.j11.p2": "Coordinating activities and verifying tasks during the events, to deliver what was planned.",
      "tl.j12.role": "Delivery",
      "tl.j12.org": "LQ Products",
      "tl.j12.p1": "Delivering orders for an import company.",
      "tl.j12.p2": "Routes and times met so every order arrived on schedule.",
      "tl.j13.role": "Inventory Assistant",
      "tl.j13.org": "Farmacia Kellertas",
      "tl.j13.p1": "Inventory control, record updates and availability checks, keeping the database up to date.",
      "tl.j13.p2": "Tracking stock and restocking so the product was never missing.",
      "tl.j14.role": "Office Assistant",
      "tl.j14.org": "Luis Espinoza Arce",
      "tl.j14.p1": "Document organisation and handling administrative requests for the daily operation.",
      "tl.j14.p2": "Order and consistency in office tasks for seven years.",
      "tl.j15.role": "Office Assistant",
      "tl.j15.org": "E&amp;M Arquitectos Asociados SRL",
      "tl.j15.p1": "Organising documentation and administrative tasks for the team.",
      "tl.j15.p2": "Supporting the daily work of the architecture team, so it could run without interruptions.",
      "tl.j16.role": "Cleaning Operator",
      "tl.j16.org": "Kia",
      "tl.j16.p1": "Cleaning display vehicles.",
      "tl.j16.p2": "Keeping every unit presentable for showroom customers.",

      /* --- Competencias --- */
      "skills.eyebrow": "03 · Skills",
      "skills.title": "Tools<br>I work with.",
      "skills.c1.title": "Marketing and digital content",
      "skills.c1.i1": "Visual communication",
      "skills.c1.i2": "Digital content",
      "skills.c1.i3": "Promotional materials",
      "skills.c1.i4": "Commercial prompt writing",
      "skills.c1.i5": "Brand safety",
      "skills.c2.title": "Design and visual communication",
      "skills.c2.i1": "Adobe Suite <em>(intermediate)</em>",
      "skills.c2.i2": "Graphic design",
      "skills.c3.title": "Data and reporting",
      "skills.c3.i1": "Excel",
      "skills.c3.i2": "Report building",
      "skills.c3.i3": "Databases",
      "skills.c4.title": "Product and technology",
      "skills.c4.i1": "Unity 3D <em>(intermediate)</em>",
      "skills.c4.i2": "Web design and development",
      "skills.c5.title": "Languages",
      "skills.c5.i1": "Spanish <em>native</em>",
      "skills.c5.i2": "English <em>intermediate</em>",

      /* --- Softs --- */
      "softs.kicker": "How I try to work",
      "softs.s1.t": "Attention to detail",
      "softs.s1.d": "On a live stream there are no spare seconds. That taught me to double-check and never get complacent.",
      "softs.s2.t": "Judgement under pressure",
      "softs.s2.d": "I had to decide in real time with quality and productivity metrics on top, without ruining the experience for whoever was on the other side.",
      "softs.s3.t": "Confidentiality",
      "softs.s3.d": "I saw sensitive cases on a global platform. I learned to be discreet and to be careful about what gets documented and how.",
      "softs.s4.t": "Resilience",
      "softs.s4.d": "Months moderating live with high volume, trying to hold the same standard every day.",
      "softs.s5.t": "Adaptability",
      "softs.s5.d": "I went from pharmaceutical retail to generative AI. Every change forced me to get organised fast, and that became a habit.",
      "softs.s6.t": "Results orientation",
      "softs.s6.d": "I try to make every record, report or piece useful for something later, not just pretty.",
      "softs.s7.t": "Clear communication",
      "softs.s7.d": "I try to explain without detours, in writing and in person. If something isn't understood, the problem is how I said it.",
      "softs.s8.t": "Fast learning",
      "softs.s8.d": "I'm in my first term: I get to learn everything twice, in practice and in class. I already have the habit.",
      "softs.s9.t": "Open to feedback",
      "softs.s9.d": "I'd rather be corrected early than deliver something bad late. I ask when I don't know.",

      /* --- Proyectos --- */
      "proj.eyebrow": "04 · Projects",
      "proj.title": "Things I made<br>and learned from.",
      "proj.sub": "Tools, games and experiments I published along the way. They're shown exactly as they came out.",
      "proj.loading": "Loading projects…",
      "proj.empty": "No projects published yet.",
      "proj.repo": "Repository",
      "proj.demoFallback": "View / play",
      "proj.source": "Source: <code>{file}</code> · {n} project(s)",
      "proj.sourceNone": "Source: <code>{file}</code> · no data",
      "proj.status.Publicado": "Published",
      "proj.status.En desarrollo": "In development",

      /* --- Formación --- */
      "edu.eyebrow": "05 · Education",
      "edu.title": "Studying<br>to better understand<br>what I do.",
      "edu.period1": "2026 · ongoing",
      "edu.role1": "Marketing Degree",
      "edu.org1": "First term",
      "edu.desc1": "Market research, consumer behaviour, brand strategy. Having seen these topics in practice helps me ground the theory.",
      "edu.period2": "June 2021",
      "edu.role2": "Graphic Design",
      "edu.org2": "LinkedIn Learning",
      "edu.period3": "January 2021",
      "edu.role3": "Web Design and Development",
      "edu.org3": "IDAT",

      /* --- Contacto --- */
      "contact.eyebrow": "06 · Contact",
      "contact.title": "Shall we talk?",
      "contact.lead": "I'm a Marketing student and I'm open to internships, junior positions and collaborations in digital marketing, content, graphic design and interactive product. Write to me and I'll reply quickly.",

      /* --- Footer --- */
      "footer.note": "Marketing · Graphic design · Content · Lima, Peru",

      /* --- Easter eggs: panel --- */
      "egg.title": "Easter eggs",
      "egg.close": "Close",
      "egg.subMobile": "Caught on this device: mobile.",
      "egg.subPC": "Caught on this device: PC. The mobile ones only appear on mobile.",
      "egg.hidden": "???",
      "egg.empty": "No eggs for this device yet.",
      "egg.found": "Egg found: {n}/{total} in your collection.",

      /* --- Easter eggs: names and hints (PC) --- */
      "egg.konami.name": "Legendary code",
      "egg.konami.hint": "A sequence of arrows and letters from another era...",
      "egg.consola.name": "Curious eyes",
      "egg.consola.hint": "Open the developer tools.",
      "egg.flama.name": "Feed the flame",
      "egg.flama.hint": "The lost page hides a playful flame.",
      "egg.fantasma.name": "Still there?",
      "egg.fantasma.hint": "Stay still for a good while...",
      "egg.fuegos.name": "Celebration",
      "egg.fuegos.hint": "Click on my email.",
      "egg.logro.name": "Full reader",
      "egg.logro.hint": "Reach the end of the page.",
      "egg.fiesta.name": "GG",
      "egg.fiesta.hint": "Twice the same gamer letter.",

      /* --- Easter eggs: names and hints (mobile) --- */
      "egg.shake.name": "Earthquake",
      "egg.shake.hint": "Shake the phone...",
      "egg.landscape.name": "Panorama",
      "egg.landscape.hint": "Turn the phone landscape...",
      "egg.tripletap.name": "Third finger",
      "egg.tripletap.hint": "Tap with three fingers at once...",
      "egg.holdmail.name": "Copied",
      "egg.holdmail.hint": "Long-press my email...",
      "egg.dragtitle.name": "Behind the name",
      "egg.dragtitle.hint": "Drag the title to one side...",
      "egg.nightowl.name": "Night owl",
      "egg.nightowl.hint": "Open the portfolio in the small hours...",
      "egg.battery.name": "Saver",
      "egg.battery.hint": "Come in with low battery...",

      /* --- Toasts --- */
      "toast.shake": "Earthquake: rain of embers.",
      "toast.landscape": "Nice panoramic view.",
      "toast.tripletap": "Theme borrowed for 10 seconds.",
      "toast.holdmail": "Email copied. Write to me whenever you like.",
      "toast.nightowl": "Still up? I built this at night too.",
      "toast.battery": "Low battery: let's both rest.",
      "toast.konami": "See, video games really are good for something.",
      "toast.fiesta": "Party mode: 15 seconds. GG.",
      "toast.fantasma": "Still there? Move the mouse to feed the embers.",
      "toast.logro": "🏆 Achievement unlocked: you reached the end. Few do.",
      "toast.console": "Hi, curious one. If you opened DevTools, we already have something in common: we like seeing how things are made. Let's talk: esplopale@gmail.com",

      /* --- Lang micro --- */
      "lang.es": "Spanish",
      "lang.en": "English",
      "lang.code": "EN"
    }
  };

  function normalize(l) {
    var s = String(l || "").toLowerCase().slice(0, 2);
    return SUPPORTED.indexOf(s) === -1 ? DEFAULT_LANG : s;
  }

  function detect() {
    /* 1) ?lang=xx en la URL (para compartir un enlace en inglés) */
    try {
      var q = new URLSearchParams(window.location.search).get("lang");
      if (q && SUPPORTED.indexOf(q.toLowerCase().slice(0, 2)) !== -1) return normalize(q);
    } catch (e) {}
    /* 2) Preferencia guardada */
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return normalize(saved);
    } catch (e) {}
    /* 3) <html lang="..."> */
    var htmlLang = document.documentElement.getAttribute("lang");
    if (htmlLang) return normalize(htmlLang);
    /* 4) Navegador */
    return normalize(navigator.language);
  }

  var current = detect();

  /* ---------- API ---------- */
  function t(key, vars) {
    var d = DICT[current] || DICT[DEFAULT_LANG];
    var s = d[key];
    if (s === undefined) s = (DICT[DEFAULT_LANG][key] !== undefined ? DICT[DEFAULT_LANG][key] : key);
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split("{" + k + "}").join(vars[k]);
      });
    }
    return s;
  }

  /* Devuelve un array desde una clave pipe-separada ("a|b|c") */
  function tList(key) {
    return String(t(key)).split("|").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function applyMeta() {
    var title = t("meta.title");
    if (document.title !== title) document.title = title;

    var map = [
      ['meta[name="description"]', "meta.description", "content"],
      ['meta[property="og:title"]', "meta.ogTitle", "content"],
      ['meta[property="og:description"]', "meta.ogDescription", "content"]
    ];
    map.forEach(function (m) {
      var el = document.querySelector(m[0]);
      if (el) el.setAttribute(m[2], t(m[1]));
    });
  }

  function applyAttrs(root) {
    var nodes = (root || document).querySelectorAll("[data-i18n-attr]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var spec = el.getAttribute("data-i18n-attr");
      spec.split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length !== 2) return;
        var attr = bits[0].trim();
        var key = bits[1].trim();
        if (attr && key) el.setAttribute(attr, t(key));
      });
    }
  }

  function applyNode(root) {
    var scope = root || document;

    var textNodes = scope.querySelectorAll("[data-i18n]");
    for (var i = 0; i < textNodes.length; i++) {
      var el = textNodes[i];
      var key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    }

    var htmlNodes = scope.querySelectorAll("[data-i18n-html]");
    for (var j = 0; j < htmlNodes.length; j++) {
      var el2 = htmlNodes[j];
      var key2 = el2.getAttribute("data-i18n-html");
      if (key2) el2.innerHTML = t(key2);
    }

    applyAttrs(scope);
  }

  function set(lang, opts) {
    var next = normalize(lang);
    if (next === current && !(opts && opts.force)) return current;
    current = next;

    try { localStorage.setItem(STORAGE_KEY, current); } catch (e) {}
    document.documentElement.setAttribute("lang", current);

    applyMeta();
    applyNode(document);

    /* Marca visualmente el idioma activo en TODOS los dropdowns
       (barra superior y menú móvil) */
    var opts2 = document.querySelectorAll("[data-lang-opt]");
    for (var k = 0; k < opts2.length; k++) {
      var on = opts2[k].getAttribute("data-lang-opt") === current;
      opts2[k].setAttribute("aria-selected", on ? "true" : "false");
      opts2[k].classList.toggle("is-active", on);
    }
    var labels = document.querySelectorAll("#langLabel, .lang-label-menu");
    for (var m = 0; m < labels.length; m++) {
      labels[m].textContent = current.toUpperCase();
    }

    /* Avisa a los módulos que pintan cadenas dinámicas */
    document.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: current } }));
    return current;
  }

  window.I18N = {
    t: t,
    tList: tList,
    set: set,
    get: function () { return current; },
    is: function (l) { return current === normalize(l); },
    supported: SUPPORTED.slice(),
    defaultLang: DEFAULT_LANG,
    /* Permite a projects.js registrar su diccionario de proyectos */
    merge: function (lang, obj) {
      var l = normalize(lang);
      if (!DICT[l]) return;
      Object.keys(obj).forEach(function (k) { DICT[l][k] = obj[k]; });
    }
  };

  /* ---------- Arranque ---------- */
  function boot() {
    document.documentElement.setAttribute("lang", current);
    applyMeta();
    applyNode(document);
    var opts2 = document.querySelectorAll("[data-lang-opt]");
    for (var k = 0; k < opts2.length; k++) {
      var on = opts2[k].getAttribute("data-lang-opt") === current;
      opts2[k].setAttribute("aria-selected", on ? "true" : "false");
      opts2[k].classList.toggle("is-active", on);
    }
    var labels = document.querySelectorAll("#langLabel, .lang-label-menu");
    for (var m = 0; m < labels.length; m++) {
      labels[m].textContent = current.toUpperCase();
    }
    document.dispatchEvent(new CustomEvent("i18n:ready", { detail: { lang: current } }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
