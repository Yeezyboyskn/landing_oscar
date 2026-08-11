import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const root = process.cwd();
const baseUrl = 'https://fariaslabs.cl';
const contactEmail = 'contacto@fariaslabs.cl';
const linkedInUrl = 'https://www.linkedin.com/in/oscar-alejandro-farias-baeza-yzkn3922';

const services = [
  {
    slug: 'automatizacion-de-procesos',
    code: '01',
    name: 'Automatización de procesos',
    short: 'Reduce tareas repetitivas, doble digitación y errores con flujos diseñados alrededor de tu operación real.',
    title: 'Automatización de procesos para pymes en Chile | Farias Labs',
    description: 'Automatiza reportes, seguimiento, ingreso de datos y tareas repetitivas con pilotos medibles y documentación clara. Diagnóstico gratuito en Chile.',
    h1: 'Automatización de procesos para reducir trabajo manual, errores y tiempos de espera.',
    lead: 'Transformo tareas repetitivas y traspasos manuales en flujos confiables que conectan personas, datos y herramientas sin perder control del proceso.',
    problem: 'La automatización tiene sentido cuando una tarea ocurre con frecuencia, sigue reglas claras y consume tiempo que podría dedicarse a vender, atender o decidir.',
    signals: ['La misma información se copia entre correo, planillas y sistemas.', 'Los reportes se preparan manualmente cada semana o mes.', 'El seguimiento depende de que una persona recuerde hacerlo.', 'Existen errores por formato, omisiones o versiones duplicadas.'],
    ideal: ['Pymes con procesos administrativos o comerciales repetitivos.', 'Equipos pequeños que necesitan aumentar capacidad sin sumar burocracia.', 'Operaciones que ya usan varias herramientas, pero siguen desconectadas.'],
    includes: ['Captura automática desde formularios o correo.', 'Sincronización entre CRM, planillas y bases de datos.', 'Alertas, recordatorios y generación de reportes.', 'Validaciones, trazabilidad y manejo de errores.', 'Documentación y traspaso operativo.'],
    metrics: ['Tiempo medio por operación.', 'Número de intervenciones manuales.', 'Errores, duplicados u omisiones.', 'Porcentaje de casos procesados correctamente.'],
    faq: [['¿Necesito cambiar todas mis herramientas?', 'No necesariamente. Muchas automatizaciones parten conectando o mejorando lo que ya existe.'], ['¿Qué pasa si el flujo falla?', 'El diseño contempla registros, alertas, reintentos y una ruta manual de contingencia.']]
  },
  {
    slug: 'asistentes-ia-empresas',
    code: 'AI',
    name: 'Asistentes con IA',
    short: 'Convierte información dispersa en respuestas útiles, clasificación y apoyo operativo con límites definidos.',
    title: 'Asistentes de IA para empresas en Chile | Farias Labs',
    description: 'Diseño de asistentes con IA para soporte interno, búsqueda documental y clasificación de solicitudes, con control humano y alcance claro.',
    h1: 'Asistentes con IA que trabajan con el contexto y los límites de tu empresa.',
    lead: 'Diseño asistentes para consultar información, clasificar solicitudes y preparar respuestas sin convertir decisiones sensibles en una caja negra.',
    problem: 'Un asistente aporta valor cuando existe información repetida, consultas frecuentes o documentos difíciles de explorar, y cuando sus respuestas pueden evaluarse con criterios claros.',
    signals: ['El equipo responde las mismas preguntas una y otra vez.', 'Encontrar información exige revisar múltiples documentos.', 'Las solicitudes deben clasificarse manualmente antes de avanzar.', 'Se necesitan borradores rápidos, pero con revisión humana.'],
    ideal: ['Equipos con documentación interna verificable.', 'Operaciones con consultas frecuentes y repetibles.', 'Empresas dispuestas a medir calidad y mantener supervisión humana.'],
    includes: ['Búsqueda y respuesta sobre fuentes autorizadas.', 'Clasificación y resumen de solicitudes o documentos.', 'Flujos de aprobación y revisión humana.', 'Registro de fuentes, errores y retroalimentación.', 'Pruebas de calidad y documentación de límites.'],
    metrics: ['Tiempo hasta una respuesta útil.', 'Precisión revisada sobre un conjunto de pruebas.', 'Solicitudes correctamente clasificadas.', 'Tasa de uso y correcciones humanas.'],
    faq: [['¿Es lo mismo que un chatbot?', 'No. Un chatbot puede seguir reglas fijas; un asistente con IA interpreta lenguaje y contexto, por lo que requiere controles adicionales.'], ['¿Puede tomar decisiones solo?', 'Las decisiones sensibles deben conservar revisión humana y reglas explícitas.']]
  },
  {
    slug: 'integraciones-apis',
    code: 'API',
    name: 'Integraciones y APIs',
    short: 'Conecta formularios, CRM, correo, pagos y sistemas para que los datos avancen sin copiar y pegar.',
    title: 'Integración de sistemas y APIs en Chile | Farias Labs',
    description: 'Integra plataformas, formularios, CRM, pagos y bases de datos mediante APIs y webhooks con trazabilidad y seguridad.',
    h1: 'Conecta tus herramientas para eliminar traspasos manuales y datos duplicados.',
    lead: 'Creo conexiones confiables entre las herramientas que tu empresa ya utiliza, con reglas claras para sincronizar, validar y recuperar información.',
    problem: 'Las integraciones reducen fricción cuando un proceso se interrumpe porque los datos deben moverse manualmente entre aplicaciones.',
    signals: ['Una venta debe registrarse en más de una plataforma.', 'Los datos de clientes quedan desactualizados o duplicados.', 'Las notificaciones llegan tarde o al responsable equivocado.', 'Un cambio en un sistema no se refleja en los demás.'],
    ideal: ['Empresas con herramientas SaaS y APIs disponibles.', 'Equipos comerciales u operativos con doble digitación.', 'Procesos que necesitan trazabilidad entre plataformas.'],
    includes: ['APIs REST y webhooks.', 'Sincronización programada o por eventos.', 'Mapeo y validación de datos.', 'Autenticación, permisos mínimos y gestión de errores.', 'Monitoreo y documentación de la integración.'],
    metrics: ['Registros sincronizados correctamente.', 'Duplicados o inconsistencias detectadas.', 'Tiempo entre origen y destino.', 'Errores recuperados sin intervención.'],
    faq: [['¿Todas las plataformas se pueden integrar?', 'Depende de sus APIs, permisos y condiciones de uso. Eso se verifica antes de proponer el alcance.'], ['¿Qué ocurre si una plataforma cambia?', 'La documentación y el monitoreo permiten detectar el cambio y evaluar la actualización necesaria.']]
  },
  {
    slug: 'datos-y-dashboards',
    code: 'BI',
    name: 'Datos y dashboards',
    short: 'Ordena datos dispersos y conviértelos en indicadores que ayuden a operar y decidir.',
    title: 'Dashboards y datos para pymes en Chile | Farias Labs',
    description: 'Diseño de dashboards, indicadores y flujos de datos para pymes que necesitan reportes claros, oportunos y verificables.',
    h1: 'Convierte datos dispersos en indicadores claros para operar y decidir.',
    lead: 'Antes de dibujar gráficos, ordeno definiciones, fuentes y responsabilidades para que cada indicador pueda explicarse y mantenerse.',
    problem: 'Un dashboard solo es útil cuando los datos son consistentes y las personas comparten una definición clara de cada métrica.',
    signals: ['Distintas áreas reportan cifras diferentes para el mismo indicador.', 'El reporte llega demasiado tarde para tomar decisiones.', 'Los datos viven en archivos y versiones dispersas.', 'Preparar una reunión exige horas de consolidación manual.'],
    ideal: ['Equipos que ya generan datos, pero no una visión común.', 'Pymes que necesitan seguimiento comercial u operativo.', 'Procesos con indicadores que hoy se calculan manualmente.'],
    includes: ['Inventario y limpieza de fuentes.', 'Definición de KPIs y reglas de cálculo.', 'Modelo de datos y actualizaciones.', 'Dashboard responsive y filtros esenciales.', 'Diccionario de métricas y documentación.'],
    metrics: ['Tiempo de preparación del reporte.', 'Consistencia entre fuentes.', 'Puntualidad de actualización.', 'Uso de indicadores en reuniones y decisiones.'],
    faq: [['¿Pueden usarse mis planillas actuales?', 'Sí, si tienen una estructura suficientemente estable. El diagnóstico identifica qué debe ordenarse primero.'], ['¿Un dashboard reemplaza el análisis?', 'No. Facilita una lectura común, pero las decisiones siguen necesitando contexto.']]
  },
  {
    slug: 'software-a-medida',
    code: 'DEV',
    name: 'Software a medida',
    short: 'Herramientas internas y aplicaciones web enfocadas en una necesidad que las plataformas existentes no resuelven bien.',
    title: 'Desarrollo de software a medida en Chile | Farias Labs',
    description: 'Software a medida, sistemas internos y aplicaciones web con alcance controlado, documentación y una base preparada para crecer.',
    h1: 'Software enfocado en una necesidad concreta, con alcance y operación sostenibles.',
    lead: 'Construyo aplicaciones y herramientas internas cuando adaptar un producto existente agrega más fricción que valor.',
    problem: 'El software a medida conviene cuando el proceso es diferenciador, las reglas son específicas y ninguna herramienta existente resuelve el núcleo de la necesidad.',
    signals: ['El equipo usa soluciones improvisadas que ya no escalan.', 'Una plataforma obliga a cambiar un proceso que sí aporta valor.', 'Se necesita una experiencia específica para usuarios internos o clientes.', 'El negocio depende de archivos sin trazabilidad ni permisos.'],
    ideal: ['Empresas con un problema bien delimitado.', 'Equipos dispuestos a validar primero una versión mínima.', 'Procesos que requieren control, permisos o experiencia propia.'],
    includes: ['Descubrimiento y definición de alcance.', 'Prototipo de experiencia y arquitectura.', 'Frontend, backend y datos según necesidad.', 'Pruebas, despliegue y monitoreo inicial.', 'Documentación y backlog de evolución.'],
    metrics: ['Adopción por usuarios objetivo.', 'Tareas completadas sin asistencia.', 'Tiempo del proceso principal.', 'Incidentes y solicitudes de soporte.'],
    faq: [['¿Por qué no usar una plataforma existente?', 'Esa es la primera pregunta del diagnóstico. Si una solución existente encaja mejor, se recomienda antes de construir.'], ['¿La primera versión incluye todo?', 'No. Se prioriza el flujo esencial para validar uso y valor antes de ampliar.']]
  },
  {
    slug: 'base-tecnica-segura',
    code: 'SEC',
    name: 'Base técnica segura',
    short: 'Ordena dominios, repositorios, despliegues, ambientes y credenciales antes de seguir creciendo.',
    title: 'Infraestructura y base técnica segura | Farias Labs',
    description: 'Ordena dominios, DNS, repositorios, despliegues y credenciales con buenas prácticas y documentación para operar con seguridad.',
    h1: 'Ordena dominios, despliegues, repositorios y credenciales antes de escalar.',
    lead: 'Creo una base técnica reproducible para que publicar, mantener y recuperar un sistema no dependa de una sola persona o de pasos improvisados.',
    problem: 'Una base segura reduce riesgo cuando los accesos están dispersos, los despliegues son manuales o nadie sabe con precisión cómo recuperar el servicio.',
    signals: ['Claves y tokens aparecen en archivos o conversaciones.', 'Publicar depende de seguir pasos manuales no documentados.', 'No existe separación entre prueba y producción.', 'El dominio, DNS o repositorio dependen de cuentas personales sin control.'],
    ideal: ['Pymes que profesionalizan su primera infraestructura.', 'Equipos con sitios o aplicaciones sin proceso de despliegue.', 'Negocios que necesitan ordenar propiedad, accesos y recuperación.'],
    includes: ['Repositorios y flujo de cambios.', 'Despliegue automatizado y ambientes.', 'Gestión de secretos y permisos mínimos.', 'DNS, HTTPS y encabezados defensivos.', 'Respaldos, recuperación y documentación operativa.'],
    metrics: ['Despliegues reproducibles.', 'Credenciales fuera del código.', 'Tiempo de recuperación probado.', 'Dependencias y cambios auditables.'],
    faq: [['¿La seguridad termina al configurar el sitio?', 'No. Se entrega una base y un proceso de mantenimiento; la seguridad necesita revisiones continuas.'], ['¿Quién debe ser dueño de las cuentas?', 'El cliente debe conservar la propiedad y Farias Labs trabajar con accesos acotados y revocables.']]
  }
];

const nav = (active) => `
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <header class="site-header">
    <nav class="nav container" aria-label="Navegación principal">
      <a class="brand" href="/" aria-label="Farias Labs, inicio"><span class="brand-mark">FL</span><span>Farias <strong>Labs</strong></span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Abrir menú">☰</button>
      <div class="nav-links" id="nav-links">
        <a href="/servicios/" ${active === 'servicios' ? 'aria-current="page"' : ''}>Servicios</a>
        <a href="/#metodo">Cómo trabajo</a>
        <a href="/nosotros/" ${active === 'nosotros' ? 'aria-current="page"' : ''}>Nosotros</a>
        <a href="/contacto/" ${active === 'contacto' ? 'aria-current="page"' : ''}>Contacto</a>
        <a class="nav-cta" href="/contacto/">Diagnóstico gratis</a>
      </div>
    </nav>
  </header>`;

const footer = () => `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="brand" href="/"><span class="brand-mark">FL</span><span>Farias <strong>Labs</strong></span></a>
        <p>Ingeniería, automatización e IA aplicada para pymes y empresas en Chile.</p>
        <a class="text-link" href="mailto:${contactEmail}">${contactEmail}</a>
      </div>
      <div class="footer-column"><strong>Soluciones</strong>${services.map((service) => `<a href="/servicios/${service.slug}/">${service.name}</a>`).join('')}</div>
      <div class="footer-column"><strong>Farias Labs</strong><a href="/#metodo">Cómo trabajo</a><a href="/nosotros/">Nosotros</a><a href="/contacto/">Contacto</a><a href="/privacidad/">Privacidad</a></div>
      <div class="footer-column"><strong>Conecta</strong><a href="${linkedInUrl}" target="_blank" rel="noopener">LinkedIn de Oscar</a><a href="mailto:${contactEmail}">Correo directo</a><span>Respuesta en menos de un día hábil.</span></div>
    </div>
    <div class="container footer-bottom"><p>© <span data-current-year></span> Farias Labs. Marca comercial operada por Oscar Farías, prestador independiente en Chile.</p><a href="/privacidad/">Aviso de privacidad</a></div>
  </footer>`;

const layout = ({ title, description, path, active, content, schema, noindex = false }) => {
  const canonical = `${baseUrl}${path}`;
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
${noindex ? '  <meta name="robots" content="noindex,follow">\n' : ''}  <meta name="theme-color" content="#07111f">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Farias Labs">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${baseUrl}/assets/og-farias-labs.png">
  <meta property="og:image:width" content="1736">
  <meta property="og:image:height" content="909">
  <meta property="og:image:alt" content="Farias Labs — Ingeniería, Automatización e IA aplicada">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${baseUrl}/assets/og-farias-labs.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${nav(active)}
<main id="contenido">${content}</main>
${footer()}
<script src="/script.js" defer></script>
</body>
</html>
`;
};

const breadcrumbSchema = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, ...(item.path ? { item: `${baseUrl}${item.path}` } : {}) }))
});

const breadcrumbs = (items) => `<nav class="breadcrumbs container" aria-label="Migas de pan"><ol>${items.map((item, index) => `<li>${item.path && index < items.length - 1 ? `<a href="${item.path}">${item.name}</a>` : `<span aria-current="page">${item.name}</span>`}</li>`).join('')}</ol></nav>`;
const list = (items, className = 'check-list') => `<ul class="${className}">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
const serviceCard = (service) => `<article class="service-card"><span class="service-code">${service.code}</span><h3>${service.name}</h3><p>${service.short}</p><a class="card-link" href="/servicios/${service.slug}/">Explorar servicio <span aria-hidden="true">→</span></a></article>`;
const finalCta = (title = '¿Qué proceso te está quitando tiempo cada semana?') => `<section class="section"><div class="container cta-panel"><div><p class="eyebrow">Diagnóstico inicial</p><h2>${title}</h2><p>Cuéntame cómo funciona hoy. Recibirás una primera mirada técnica y un siguiente paso razonable en menos de un día hábil.</p></div><div class="cta-actions"><a class="btn primary" href="/contacto/">Solicitar diagnóstico gratis</a><a class="btn secondary" href="mailto:${contactEmail}">Escribir por correo</a></div></div></section>`;

const homeContent = `
  <section class="hero container home-hero">
    <div class="hero-copy">
      <p class="eyebrow">Ingeniería de software · Automatización · IA aplicada</p>
      <h1>Automatización e IA aplicada para operar mejor, sin complejidad innecesaria.</h1>
      <p class="hero-text">Farias Labs es una firma técnica independiente liderada por Oscar Farías, Ingeniero Civil Informático. Ayudo a pymes y equipos en Chile a convertir procesos manuales y datos dispersos en sistemas claros, seguros y medibles.</p>
      <div class="hero-actions"><a class="btn primary" href="/contacto/">Solicitar diagnóstico gratis</a><a class="btn secondary" href="/servicios/">Explorar servicios</a></div>
      <p class="hero-note">Primera conversación sin costo. Si la tecnología no es la solución correcta, también te lo diré.</p>
    </div>
    <aside class="hero-panel" aria-label="Método de trabajo Farias Labs">
      <div class="panel-top"><span class="status-dot"></span><span>Sistema de trabajo Farias Labs</span></div>
      <div class="terminal-card"><p><span>01</span> entender el proceso real</p><p><span>02</span> priorizar impacto y riesgo</p><p><span>03</span> construir un piloto medible</p><p><span>04</span> documentar antes de escalar</p></div>
      <div class="panel-grid"><div><strong>Directo</strong><span>Sin intermediarios</span></div><div><strong>Medible</strong><span>Criterios acordados</span></div><div><strong>Seguro</strong><span>Control del cliente</span></div><div><strong>Iterativo</strong><span>Pequeño antes de escalar</span></div></div>
    </aside>
  </section>
  <section class="proof-strip container" aria-label="Compromisos de trabajo"><div class="proof-grid"><span>Atención directa del fundador</span><span>Alcance y precio antes de construir</span><span>Pilotos pequeños</span><span>Documentación y traspaso</span></div></section>
  <section class="section container"><div class="section-heading"><p class="eyebrow">Servicios destacados</p><h2>Resuelve fricción operativa con la herramienta adecuada.</h2><p>El foco no es usar tecnología porque sí. Es reducir costos ocultos, mejorar tiempos de respuesta y crear una base que el negocio pueda mantener.</p></div><div class="grid cards highlighted-services">${services.slice(0, 4).map(serviceCard).join('')}</div><div class="section-actions"><a class="btn secondary" href="/servicios/">Ver los seis servicios</a></div></section>
  <section class="section alt"><div class="container"><div class="section-heading"><p class="eyebrow">Una firma en lanzamiento</p><h2>Una etapa inicial puede ser una ventaja cuando el trabajo exige foco.</h2><p>Farias Labs está construyendo su primera cartera formal de clientes. No reemplazo esa realidad con testimonios inventados: la compenso con atención directa, transparencia técnica y proyectos acotados.</p></div><div class="value-grid"><article><strong>01</strong><h3>Atención uno a uno</h3><p>Hablas con quien diagnostica, diseña y construye. El contexto no se pierde entre capas comerciales.</p></article><article><strong>02</strong><h3>Decisiones rápidas</h3><p>Una estructura liviana permite priorizar, probar y corregir sin burocracia innecesaria.</p></article><article><strong>03</strong><h3>Alcance controlado</h3><p>El primer paso es un problema concreto, un piloto y una forma acordada de medirlo.</p></article><article><strong>04</strong><h3>Condición de lanzamiento</h3><p>Los primeros proyectos aceptados reciben condiciones preferentes, sin exigir testimonios positivos.</p></article></div></div></section>
  <section class="section container" id="metodo"><div class="method"><div><p class="eyebrow">Cómo trabajo</p><h2>Primero claridad. Después código.</h2><p class="muted">No comienzo una implementación sin dejar por escrito el problema, alcance, entregables, precio y criterios de aceptación.</p></div><ol class="steps"><li><strong>Diagnóstico</strong><span>Revisamos proceso, herramientas, datos, dolores y resultado esperado.</span></li><li><strong>Propuesta</strong><span>Recibes alcance, prioridades, riesgos, inversión y criterios de aceptación.</span></li><li><strong>Piloto</strong><span>Construimos la versión mínima que permite validar la solución.</span></li><li><strong>Medición y escala</strong><span>Evaluamos uso, impacto y próximos pasos antes de agregar complejidad.</span></li></ol></div></section>
  <section class="section container"><div class="launch-card"><div><span class="badge">Clientes fundadores</span><h2>Condiciones preferentes para los primeros proyectos.</h2><p>Busco problemas pequeños, repetitivos y medibles para construir los primeros pilotos formales. Si el proyecto puede documentarse, tú decides previamente si será público, anónimo o privado.</p></div><a class="btn primary" href="/contacto/?service=cliente-fundador">Proponer un piloto</a></div></section>
  <section class="section alt"><div class="container proof-case"><div><p class="eyebrow">Prueba técnica propia</p><h2>Este sitio también demuestra cómo trabajo.</h2><p>Farias Labs funciona sobre una arquitectura estática y serverless, con despliegue automático, gestión segura de credenciales, control de dependencias y un endpoint de contacto protegido.</p><a class="text-link" href="/nosotros/">Conocer la visión y el estándar técnico →</a></div><div class="architecture-card"><span>GitHub</span><i>→</i><span>Validación</span><i>→</i><span>Cloudflare</span><i>→</i><span>fariaslabs.cl</span></div></div></section>
  ${finalCta()}`;

const homeSchema = {
  '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Farias Labs', url: `${baseUrl}/`, email: contactEmail,
  description: 'Firma técnica independiente de ingeniería, automatización e IA aplicada para pymes y empresas en Chile.',
  areaServed: { '@type': 'Country', name: 'Chile' },
  founder: { '@type': 'Person', name: 'Oscar Farías', jobTitle: 'Ingeniero Civil Informático', sameAs: linkedInUrl },
  sameAs: [linkedInUrl]
};

const servicesContent = `
  ${breadcrumbs([{ name: 'Inicio', path: '/' }, { name: 'Servicios' }])}
  <section class="page-hero container"><p class="eyebrow">Servicios</p><h1>Soluciones técnicas para procesos que ya no deberían depender de trabajo manual.</h1><p>No parto desde una herramienta de moda. Primero entiendo el proceso, el costo de mantenerlo como está y el resultado que necesita el negocio.</p><div class="hero-actions"><a class="btn primary" href="/contacto/">Solicitar diagnóstico gratis</a></div></section>
  <section class="section container"><div class="grid cards service-index">${services.map(serviceCard).join('')}</div></section>
  <section class="section alt"><div class="container split-callout"><div><p class="eyebrow">Cómo elegir</p><h2>No necesitas llegar con la solución decidida.</h2></div><div><p>Si sabes que existe un problema, pero no si corresponde automatizar, integrar o construir, el diagnóstico sirve para separar síntomas de causas y priorizar el primer paso.</p><a class="text-link" href="/contacto/">Ayúdame a priorizar →</a></div></div></section>
  ${finalCta('Partamos por el problema, no por la herramienta.')}`;

const servicePageContent = (service) => {
  const crumbs = [{ name: 'Inicio', path: '/' }, { name: 'Servicios', path: '/servicios/' }, { name: service.name }];
  return `
    ${breadcrumbs(crumbs)}
    <section class="page-hero container service-hero"><p class="eyebrow">${service.name}</p><h1>${service.h1}</h1><p>${service.lead}</p><div class="hero-actions"><a class="btn primary" href="/contacto/?service=${service.slug}">Cotizar este servicio</a><a class="btn secondary" href="#proceso">Ver el proceso</a></div></section>
    <section class="section container detail-grid"><div><p class="eyebrow">El problema</p><h2>Cuándo vale la pena intervenir.</h2><p class="muted">${service.problem}</p></div><div class="content-card"><h3>Señales habituales</h3>${list(service.signals)}</div></section>
    <section class="section alt"><div class="container two-panel"><div class="content-card"><p class="eyebrow">Para quién</p><h2>Un buen encaje inicial.</h2>${list(service.ideal)}</div><div class="content-card"><p class="eyebrow">Qué puede incluir</p><h2>Alcance modular.</h2>${list(service.includes)}</div></div></section>
    <section class="section container" id="proceso"><div class="section-heading"><p class="eyebrow">Proceso</p><h2>Un piloto antes de una transformación grande.</h2></div><ol class="process-grid"><li><span>01</span><h3>Levantar</h3><p>Documentamos el proceso, responsables, datos, reglas y excepciones.</p></li><li><span>02</span><h3>Priorizar</h3><p>Evaluamos impacto, esfuerzo, riesgo y dependencias reales.</p></li><li><span>03</span><h3>Construir</h3><p>Implementamos un alcance pequeño con criterios de aceptación.</p></li><li><span>04</span><h3>Medir</h3><p>Comparamos, documentamos y decidimos si corresponde escalar.</p></li></ol></section>
    <section class="section alt"><div class="container detail-grid"><div><p class="eyebrow">Medición</p><h2>Qué observaríamos en el piloto.</h2><p class="muted">Estas son métricas a observar, no resultados prometidos de antemano.</p></div><div class="content-card">${list(service.metrics)}</div></div></section>
    <section class="section container"><div class="section-heading"><p class="eyebrow">Preguntas frecuentes</p><h2>Antes de comenzar.</h2></div><div class="faq-list">${service.faq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}<details><summary>¿Quién conserva las cuentas y credenciales?</summary><p>El cliente conserva el control. Farias Labs trabaja con accesos mínimos y documenta su entrega o revocación.</p></details></div></section>
    ${finalCta(`Evaluemos ${service.name.toLowerCase()} con un alcance concreto.`)}`;
};

const aboutContent = `
  ${breadcrumbs([{ name: 'Inicio', path: '/' }, { name: 'Nosotros' }])}
  <section class="page-hero container"><p class="eyebrow">Nosotros</p><h1>Ingeniería cercana, decisiones rápidas y responsabilidad técnica directa.</h1><p>Farias Labs es una firma independiente en etapa de lanzamiento. Hoy está liderada directamente por Oscar Farías, desde el diagnóstico hasta la entrega.</p></section>
  <section class="section container founder-story"><div class="founder-monogram" aria-hidden="true"><span>OF</span><small>Ingeniero Civil Informático</small></div><div><p class="eyebrow">Historia</p><h2>Soy Oscar Farías.</h2><p>Creé Farias Labs para ayudar a pymes y equipos a resolver problemas operativos con tecnología útil: automatizaciones que ahorran trabajo, integraciones que ordenan información, asistentes con IA que respetan el contexto y software construido alrededor de una necesidad real.</p><p>La etapa inicial define una forma de trabajo deliberadamente cercana. Quien conversa contigo es también quien analiza el problema, diseña la solución y responde por las decisiones técnicas.</p><div class="founder-links"><a class="pill-link" href="${linkedInUrl}" target="_blank" rel="noopener">Ver LinkedIn</a><a class="pill-link" href="mailto:${contactEmail}">Escribir a Oscar</a></div></div></section>
  <section class="section alt"><div class="container vision-grid"><div><p class="eyebrow">Visión</p><h2>Tecnología útil primero. Productos y empleo después.</h2><p>La visión de Farias Labs es construir tecnología útil, rentable y con impacto real: primero para clientes, luego como base de productos propios y empleo tecnológico desde Chile hacia el mundo.</p></div><div class="quote-card"><p>“La mejor tecnología no es la más compleja: es la que elimina fricción, se mantiene bien y genera valor medible.”</p></div></div></section>
  <section class="section container"><div class="section-heading"><p class="eyebrow">Principios</p><h2>Cómo tomo decisiones técnicas.</h2></div><div class="value-grid"><article><strong>01</strong><h3>El problema antes que la herramienta</h3><p>No toda empresa necesita IA, una aplicación nueva o una automatización compleja.</p></article><article><strong>02</strong><h3>Pequeño y medible</h3><p>Un piloto útil vale más que una gran promesa difícil de verificar.</p></article><article><strong>03</strong><h3>Control del cliente</h3><p>Las cuentas, dominios, datos y credenciales permanecen bajo propiedad del cliente.</p></article><article><strong>04</strong><h3>Límites transparentes</h3><p>Riesgos, exclusiones y dependencias se explican antes de comenzar.</p></article></div></section>
  <section class="section alt"><div class="container capability-layout"><div><p class="eyebrow">Capacidad verificable</p><h2>Una base técnica construida para operar.</h2><p>La plataforma actual de Farias Labs utiliza JavaScript, APIs, GitHub, automatización de despliegues, funciones serverless y Cloudflare. El stack de cada cliente se elige según el problema.</p></div><div class="stack-tags"><span>JavaScript</span><span>APIs</span><span>Git y GitHub</span><span>Cloudflare Pages</span><span>Funciones serverless</span><span>CI/CD</span><span>Gestión de secretos</span><span>Arquitectura web</span></div></div></section>
  ${finalCta('Conversemos directamente sobre tu proceso.')}`;

const contactContent = `
  ${breadcrumbs([{ name: 'Inicio', path: '/' }, { name: 'Contacto' }])}
  <section class="page-hero container"><p class="eyebrow">Contacto</p><h1>Cuéntame qué quieres mejorar y partamos por el problema real.</h1><p>Describe el proceso, las herramientas involucradas y lo que hoy genera demoras, errores o trabajo repetitivo. Responderé en menos de un día hábil.</p></section>
  <section class="section container contact-page"><div class="contact-aside"><p class="eyebrow">Contacto directo</p><h2>Una primera mirada técnica, sin costo.</h2><p>No necesitas llegar con una solución decidida. Comparte el contexto y revisaremos si corresponde automatizar, integrar, construir o simplemente ordenar.</p><div class="channel-card"><span>Correo</span><a href="mailto:${contactEmail}">${contactEmail}</a><small>Respuesta en menos de un día hábil.</small></div><div class="channel-card"><span>LinkedIn</span><a href="${linkedInUrl}" target="_blank" rel="noopener">Oscar Farías</a><small>Perfil profesional verificable.</small></div><div class="next-steps"><strong>Qué ocurre después</strong><ol><li>Leo personalmente la solicitud.</li><li>Respondo con preguntas de contexto.</li><li>Si existe encaje, coordinamos una conversación breve.</li><li>Recibes una primera priorización.</li></ol></div></div>
    <form class="lead-form" id="lead-form">
      <div class="form-header"><span class="form-badge">Diagnóstico inicial</span><h2>Empecemos por el problema.</h2><p>Los campos marcados son necesarios para responder con contexto.</p></div>
      <input type="text" name="_honey" tabindex="-1" autocomplete="off" class="hp-field" aria-hidden="true">
      <div class="form-row two-cols"><div><label for="name">Nombre *</label><input id="name" name="name" type="text" autocomplete="name" required></div><div><label for="email">Correo de trabajo *</label><input id="email" name="email" type="email" autocomplete="email" required></div></div>
      <div class="form-row"><label for="company">Empresa o proyecto</label><input id="company" name="company" type="text" autocomplete="organization"></div>
      <div class="form-row two-cols"><div><label for="service">¿Qué necesitas? *</label><select id="service" name="service" required><option value="">Selecciona una opción</option>${services.map((service) => `<option value="${service.slug}">${service.name}</option>`).join('')}<option value="cliente-fundador">Evaluar un piloto fundador</option><option value="diagnostico">No estoy seguro; necesito diagnóstico</option></select></div><div><label for="urgency">Urgencia *</label><select id="urgency" name="urgency" required><option value="">Selecciona</option><option>Esta semana</option><option>Este mes</option><option>Próximos tres meses</option><option>Solo estoy evaluando</option></select></div></div>
      <div class="form-row"><label for="message">Describe el problema u oportunidad *</label><textarea id="message" name="message" rows="6" minlength="12" placeholder="Ej.: cada semana consolidamos datos manualmente desde tres planillas..." required></textarea></div>
      <label class="privacy-check"><input type="checkbox" name="privacy" required><span>Acepto que Farias Labs use estos datos únicamente para responder mi solicitud. <a href="/privacidad/" target="_blank">Ver privacidad</a>.</span></label>
      <button class="btn primary form-submit" type="submit">Enviar diagnóstico</button>
      <p class="form-note" id="form-note" role="status" aria-live="polite">Tu solicitud se enviará de forma segura a ${contactEmail}.</p>
    </form>
  </section>`;

const privacyContent = `
  ${breadcrumbs([{ name: 'Inicio', path: '/' }, { name: 'Privacidad' }])}
  <section class="page-hero container legal-hero"><p class="eyebrow">Privacidad</p><h1>Aviso de privacidad.</h1><p>Información clara sobre los datos que recibe Farias Labs mediante este sitio.</p></section>
  <article class="section container legal-copy"><p><strong>Última actualización:</strong> 11 de agosto de 2026.</p><h2>Responsable</h2><p>Farias Labs es una marca comercial operada por Oscar Farías, prestador independiente en Chile. Para consultas sobre privacidad escribe a <a href="mailto:${contactEmail}">${contactEmail}</a>.</p><h2>Datos recopilados</h2><p>El formulario puede recibir nombre, correo, empresa o proyecto, servicio de interés, urgencia, mensaje y página de origen. No se solicitan contraseñas, datos bancarios ni información especialmente sensible.</p><h2>Finalidad</h2><p>Los datos se utilizan para responder la solicitud, evaluar el posible servicio y mantener el seguimiento de esa conversación. No se venden ni se usan para campañas masivas sin consentimiento.</p><h2>Proveedores técnicos</h2><p>El sitio opera sobre Cloudflare Pages y el envío de correo puede utilizar proveedores técnicos configurados de forma segura. Estos proveedores procesan únicamente la información necesaria para prestar el servicio.</p><h2>Conservación y eliminación</h2><p>La información se conserva durante el tiempo necesario para responder y mantener el contexto comercial razonable. Puedes solicitar acceso, corrección o eliminación escribiendo al correo de contacto.</p><h2>Seguridad</h2><p>Farias Labs aplica HTTPS, gestión de secretos fuera del código, validación del formulario y controles de despliegue. Ningún sistema elimina por completo el riesgo; cualquier incidente relevante se evaluará y gestionará con transparencia.</p><h2>Cambios</h2><p>Este aviso puede actualizarse cuando cambien las herramientas o finalidades. La fecha visible indicará la versión vigente.</p></article>`;

const notFoundContent = `<section class="page-hero container error-page"><p class="eyebrow">Error 404</p><h1>Esta página no existe o cambió de dirección.</h1><p>Puedes volver al inicio, explorar los servicios o contarme qué proceso quieres mejorar.</p><div class="hero-actions"><a class="btn primary" href="/">Volver al inicio</a><a class="btn secondary" href="/servicios/">Ver servicios</a></div></section>`;

const pages = [
  { file: 'index.html', title: 'Automatización e IA para pymes en Chile | Farias Labs', description: 'Farias Labs diseña automatizaciones, integraciones, asistentes con IA y software a medida para pymes en Chile. Solicita un diagnóstico técnico gratuito.', path: '/', active: 'inicio', content: homeContent, schema: homeSchema },
  { file: 'servicios/index.html', title: 'Servicios de automatización, IA y software | Farias Labs', description: 'Automatización de procesos, asistentes con IA, integraciones, dashboards, software a medida y bases técnicas seguras para empresas en Chile.', path: '/servicios/', active: 'servicios', content: servicesContent, schema: { '@context': 'https://schema.org', '@graph': [homeSchema, breadcrumbSchema([{ name: 'Inicio', path: '/' }, { name: 'Servicios' }])] } },
  ...services.map((service) => {
    const path = `/servicios/${service.slug}/`;
    return { file: `servicios/${service.slug}/index.html`, title: service.title, description: service.description, path, active: 'servicios', content: servicePageContent(service), schema: { '@context': 'https://schema.org', '@graph': [{ '@type': 'Service', name: service.name, serviceType: service.name, description: service.description, url: `${baseUrl}${path}`, areaServed: { '@type': 'Country', name: 'Chile' }, provider: { '@type': 'ProfessionalService', name: 'Farias Labs', url: `${baseUrl}/` } }, breadcrumbSchema([{ name: 'Inicio', path: '/' }, { name: 'Servicios', path: '/servicios/' }, { name: service.name }])] } };
  }),
  { file: 'nosotros/index.html', title: 'Oscar Farías y la visión de Farias Labs', description: 'Conoce a Oscar Farías, Ingeniero Civil Informático y fundador de Farias Labs, una firma independiente de automatización, software e IA aplicada en Chile.', path: '/nosotros/', active: 'nosotros', content: aboutContent, schema: { '@context': 'https://schema.org', '@graph': [{ '@type': 'Person', name: 'Oscar Farías', jobTitle: 'Ingeniero Civil Informático', url: `${baseUrl}/nosotros/`, sameAs: linkedInUrl }, breadcrumbSchema([{ name: 'Inicio', path: '/' }, { name: 'Nosotros' }])] } },
  { file: 'contacto/index.html', title: 'Contacto y diagnóstico gratuito | Farias Labs', description: 'Cuéntale a Farias Labs qué proceso quieres mejorar. Recibe una primera mirada técnica sobre automatización, IA, integraciones o software.', path: '/contacto/', active: 'contacto', content: contactContent, schema: { '@context': 'https://schema.org', '@graph': [{ '@type': 'ContactPage', name: 'Contacto Farias Labs', url: `${baseUrl}/contacto/` }, breadcrumbSchema([{ name: 'Inicio', path: '/' }, { name: 'Contacto' }])] } },
  { file: 'privacidad/index.html', title: 'Privacidad | Farias Labs', description: 'Aviso de privacidad del sitio Farias Labs y del formulario de diagnóstico.', path: '/privacidad/', active: '', content: privacyContent, schema: { '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', name: 'Aviso de privacidad', url: `${baseUrl}/privacidad/` }, breadcrumbSchema([{ name: 'Inicio', path: '/' }, { name: 'Privacidad' }])] } },
  { file: '404.html', title: 'Página no encontrada | Farias Labs', description: 'La página solicitada no existe o cambió de dirección.', path: '/404', active: '', content: notFoundContent, noindex: true, schema: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Página no encontrada', url: `${baseUrl}/404` } }
];

for (const page of pages) {
  const output = join(root, page.file);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, layout(page), 'utf8');
}

const sitemapEntries = pages
  .filter((page) => !page.noindex)
  .map((page) => `  <url>\n    <loc>${baseUrl}${page.path}</loc>\n    <lastmod>2026-08-11</lastmod>\n    <changefreq>${page.path === '/' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${page.path === '/' ? '1.0' : page.path === '/servicios/' ? '0.9' : '0.7'}</priority>\n  </url>`)
  .join('\n');

await writeFile(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`, 'utf8');

console.log(`Sitio generado: ${pages.length} páginas.`);
