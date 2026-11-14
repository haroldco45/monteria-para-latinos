/* =========================================================
   Montería para Latinos — Vibras Positivas HM
   PWA bilingüe (ES/EN) para latinos recién llegados a Montería, Córdoba, Colombia.
   Sin emojis ni íconos: fotos reales de Wikipedia / Wikimedia Commons.
   ========================================================= */
'use strict';

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const store = {
  get(k, d) { try { const v = localStorage.getItem('mtr_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('mtr_' + k, JSON.stringify(v)); } catch (e) {} }
};
let LANG = store.get('lang', (navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : 'es');
const L = o => (o == null ? '' : typeof o === 'string' ? o : (o[LANG] ?? o.es ?? ''));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n, d = 2) => new Intl.NumberFormat(LANG === 'es' ? 'es-CO' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const cop = n => (n < 0 ? '-$' : '$') + fmt(Math.abs(Math.round(n)), 0);
async function getJSON(url) { const r = await fetch(url); if (!r.ok) throw new Error(r.status); return r.json(); }
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400); }
const gmaps = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const ZONE = 'America/Bogota', ZONE_VE = 'America/Caracas';
const PALETTE = ['#0E7C86', '#F2B705', '#E8566C', '#2D7FF9', '#F28C28', '#2FB59A', '#8E5CD9'];
const num = (b, i) => `<b style="color:var(--red);font-family:'Barlow Condensed';font-size:1.3rem;margin-right:8px">${String(i + 1).padStart(2, '0')}</b>${b}`;


/* ---------- Textos de interfaz ---------- */
const T = {
  appName: { es: 'Montería para Latinos', en: 'Montería for Latinos' },
  tagline: { es: 'Tu guía para empezar en Montería', en: 'Your guide to starting out in Montería' },
  nHome: { es: 'Inicio', en: 'Home' }, nPapers: { es: 'Papeles', en: 'Papers' }, nMap: { es: 'Mapa', en: 'Map' }, nTalk: { es: 'Hablar', en: 'Talk' },
  cxT: { es: 'Otras ciudades para latinos', en: 'More cities for Latinos' },
  cxS: { es: 'La misma guía en otras ciudades del mundo. Toca una para abrirla.', en: 'The same guide in other cities around the world. Tap one to open it.' },
  footNote: {
    es: 'Información de referencia, no es asesoría legal. Verifica trámites en migracioncolombia.gov.co y cancilleria.gov.co, el pasaje y Businú en monteria.gov.co y la Feria en cordoba.gov.co. Mapa © colaboradores de OpenStreetMap, © CARTO. Fotos: Wikipedia / Wikimedia Commons. Clima: Open-Meteo.',
    en: 'Reference information, not legal advice. Check procedures at migracioncolombia.gov.co and cancilleria.gov.co, bus and Businú fares at monteria.gov.co and the Fair at cordoba.gov.co. Map © OpenStreetMap contributors, © CARTO. Photos: Wikipedia / Wikimedia Commons. Weather: Open-Meteo.'
  },
  updated: { es: 'Información verificada', en: 'Information checked' },
  installT: { es: 'Instala la app en tu celular para usarla sin internet.', en: 'Install the app on your phone to use it offline.' },
  install: { es: 'Instalar', en: 'Install' },
  tapClose: { es: '(Toca para cerrar)', en: '(Tap to close)' },
  back: { es: '‹ Volver al inicio', en: '‹ Back to home' }
};
const VERIFIED = '14 nov 2026';

/* ---------- Fotos reales (Wikipedia / Commons) ---------- */
// key: [título en en.wikipedia, búsquedas de respaldo en Commons en orden]
const PH = {
  monteria: ['Montería', 'Monteria Cordoba Colombia'],
  sinu: ['', 'Rio Sinu Monteria', 'Sinu river Colombia', 'Rio Sinu Cordoba'],
  ronda: ['', 'Ronda del Sinu Monteria', 'Ronda del Sinú', 'Monteria rio Sinu parque', 'Rio Sinu Monteria orilla'],
  catedral: ['', 'Catedral San Jeronimo Monteria', 'Catedral de Monteria', 'Monteria cathedral', 'Monteria iglesia'],
  bolivar: ['', 'Parque Simon Bolivar Monteria', 'Monteria plaza Bolivar', 'Monteria centro parque'],
  planchones: ['', 'planchon rio Sinu Monteria', 'planchon Monteria', 'planchon Sinu', 'Rio Sinu', 'Sinu river'],
  businu: ['', 'Businu Monteria', 'embarcadero Monteria rio Sinu', 'Monteria rio', 'Rio Sinu Cordoba Colombia', 'lancha rio Colombia'],
  muzac: ['', 'MUZAC Monteria fachada', 'Monteria Ronda del Sinu noche', 'Monteria parque', 'Monteria Cordoba'],
  mercado: ['', 'Mercado del Sur Monteria', 'mercado publico Monteria', 'Monteria mercado', 'mercado Cordoba Colombia', 'plaza de mercado Colombia frutas'],
  feria: ['', 'Feria de la Ganaderia Monteria', 'Feria ganadera Monteria', 'Feria ganadera Cordoba Colombia'],
  cebu: ['Brahman cattle', 'ganado cebu Cordoba Colombia'],
  caballo: ['Paso Fino', 'caballo de paso fino Colombia'],
  porro: ['Porro', 'Festival del Porro San Pelayo'],
  vueltiao: ['Sombrero vueltiao', 'sombrero vueltiao Tuchin'],
  lorica: ['', 'Lorica Cordoba mercado', 'Santa Cruz de Lorica', 'Lorica Cordoba', 'Lorica Colombia'],
  cispata: ['', 'Bahia de Cispata', 'Cispata San Antero', 'San Antero Cordoba manglar', 'San Antero Cordoba'],
  covenas: ['Coveñas', 'Covenas playa'],
  tuchin: ['Tuchín', 'Tuchin Cordoba'],
  sanpelayo: ['San Pelayo, Córdoba', 'San Pelayo Cordoba'],
  arboletes: ['', 'volcan de lodo Arboletes', 'Arboletes volcan', 'Arboletes playa', 'Arboletes Antioquia'],
  iguana: ['Green iguana', 'iguana Colombia'],
  perezoso: ['Brown-throated sloth', 'perezoso Colombia'],
  mote: ['', 'mote de queso', 'mote de queso Colombia', 'Colombian cheese soup'],
  bocachico: ['Prochilodus magdalenae', 'bocachico pescado'],
  bus: ['', 'buseta Monteria', 'Monteria transporte publico', 'Monteria avenida'],
  mototaxi: ['', 'mototaxi Monteria', 'mototaxi Colombia', 'moto taxi Colombia'],
  hospital: ['', 'hospital San Jeronimo Monteria', 'hospital Monteria', 'hospital Colombia'],
  peso: ['Colombian peso', 'billetes pesos colombianos'],
  airport: ['Los Garzones Airport', 'aeropuerto Los Garzones Monteria'],
  sunset: ['', 'atardecer rio Sinu Monteria', 'Monteria atardecer', 'Sinu river sunset'],
  street: ['', 'Monteria calle', 'Monteria avenida primera', 'Monteria Colombia city'],
  house: ['', 'casa Monteria barrio', 'Monteria arquitectura', 'Monteria vivienda']
};

const PHOTO_CACHE = store.get('photos4', {});
function fbColor(key) { let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0; return PALETTE[h % PALETTE.length]; }
const photo = key => `data-ph="${key}" style="--fb:${fbColor(key)}"`;

async function wikiBatch(titles) {
  const out = {};
  for (let i = 0; i < titles.length; i += 40) {
    const chunk = titles.slice(i, i + 40);
    const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=900&titles=' + encodeURIComponent(chunk.join('|'));
    try {
      const j = await getJSON(url);
      const back = {};
      (j.query.normalized || []).forEach(n => back[n.to] = n.from);
      (j.query.redirects || []).forEach(r => back[r.to] = back[r.from] || r.from);
      (j.query.pages || []).forEach(p => { if (p.thumbnail) out[back[p.title] || p.title] = p.thumbnail.source; });
    } catch (e) {}
  }
  return out;
}
async function commonsSearch(q) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&generator=search&gsrnamespace=6&gsrlimit=4&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap') + '&prop=imageinfo&iiprop=url&iiurlwidth=900';
  try {
    const j = await getJSON(url);
    const pages = (j.query && j.query.pages || []).sort((a, b) => (a.index || 0) - (b.index || 0));
    for (const p of pages) { const ii = p.imageinfo && p.imageinfo[0]; if (ii && (ii.thumburl || ii.url)) return ii.thumburl || ii.url; }
  } catch (e) {}
  return null;
}
let photosLoading = null;
async function loadPhotos() {
  if (photosLoading) return photosLoading;
  photosLoading = (async () => {
    const need = Object.keys(PH).filter(k => !PHOTO_CACHE[k]);
    const titles = need.map(k => PH[k][0]).filter(Boolean);
    if (titles.length) {
      const got = await wikiBatch(titles);
      need.forEach(k => { if (PH[k][0] && got[PH[k][0]]) PHOTO_CACHE[k] = got[PH[k][0]]; });
    }
    const rest = Object.keys(PH).filter(k => !PHOTO_CACHE[k]);
    const firsts = rest.filter(k => PH[k].length <= 2), multi = rest.filter(k => PH[k].length > 2);
    await Promise.all(firsts.map(async k => { const u = await commonsSearch(PH[k][1]); if (u) PHOTO_CACHE[k] = u; }));
    for (const k of multi) {
      for (const q of PH[k].slice(1)) {
        const u = await commonsSearch(q);
        if (u && !Object.values(PHOTO_CACHE).includes(u)) { PHOTO_CACHE[k] = u; break; }
      }
    }
    store.set('photos4', PHOTO_CACHE);
  })();
  return photosLoading;
}
function paintPhotos(root = document) {
  $$('[data-ph]', root).forEach(el => {
    const u = PHOTO_CACHE[el.dataset.ph];
    if (u && !el._painted) {
      const img = new Image();
      img.onload = () => { el.style.backgroundImage = `url("${u}")`; el._painted = true; };
      img.src = u;
    }
  });
  heroSetup();
}

/* ---------- Plazos con cuenta regresiva (verificados el 14 nov 2026) ---------- */
const DEADLINES = [
  { end: new Date('2026-12-31T23:59:59-05:00'), k: 'PEP Tutor',
    t: { es: 'PEP Tutor: puedes pedirlo hasta el jueves 31 de diciembre', en: 'PEP Tutor: apply by Thursday 31 December' },
    s: { es: 'Para papás, tutores o cuidadores de niños venezolanos que tuvieron PPT. Montería no está entre las 10 ciudades del trámite: las más cercanas son Cartagena y Barranquilla. Toca para ver requisitos.', en: 'For parents, guardians or carers of Venezuelan children who held a PPT. Montería isn\'t one of the 10 processing cities: the nearest are Cartagena and Barranquilla. Tap to see requirements.' },
    tk: { es: 'para pedir el PEP Tutor', en: 'to apply for PEP Tutor' } }
];
const activeDeadline = () => DEADLINES.find(d => d.end - Date.now() > 0) || null;

/* ---------- Datos de Montería ---------- */
// q: búsqueda para "Cómo llegar" (más precisa que las coordenadas aproximadas)
const PLACES = [
  { id: 'ronda', cat: 'beach', lat: 8.7562, lon: -75.8878, free: true, q: 'Ronda del Sinú, Montería',
    n: { es: 'Ronda del Sinú', en: 'Ronda del Sinú riverside park' },
    d: { es: 'El parque lineal a la orilla del río Sinú, junto a la Avenida Primera. Senderos, ciclorruta, iguanas y perezosos en los árboles. Gratis. Tiene su propia sección en la app.', en: 'The linear park along the Sinú River, next to Avenida Primera. Paths, bike lane, iguanas and sloths in the trees. Free. It has its own section in the app.' } },
  { id: 'catedral', cat: 'city', lat: 8.7598, lon: -75.8851, free: true, q: 'Catedral San Jerónimo, Montería',
    n: { es: 'Catedral San Jerónimo y Parque Simón Bolívar', en: 'San Jerónimo Cathedral & Simón Bolívar Park' },
    d: { es: 'El corazón del centro: la catedral blanca de la ciudad frente al parque principal, a dos cuadras del río.', en: 'The heart of downtown: the city\'s white cathedral facing the main square, two blocks from the river.' } },
  { id: 'muzac', cat: 'city', lat: 8.7553, lon: -75.8880, free: true, q: 'Museo Zenú de Arte Contemporáneo MUZAC, Montería',
    n: { es: 'Museo Zenú de Arte Contemporáneo (MUZAC)', en: 'Zenú Museum of Contemporary Art (MUZAC)' },
    d: { es: 'Museo de arte en plena Ronda del Sinú, con exposiciones de artistas de la región. La entrada suele ser libre; confirma el horario.', en: 'Art museum right on the Ronda del Sinú, with shows by regional artists. Entry is usually free; check opening hours.' } },
  { id: 'mercado', cat: 'city', lat: 8.7478, lon: -75.8832, free: true, q: 'Mercado del Sur, Montería',
    n: { es: 'Mercado del Sur', en: 'Mercado del Sur market' },
    d: { es: 'El mercado público de la ciudad: frutas, queso costeño, pescado del Sinú y víveres más baratos. Ve temprano, con poco efectivo y el celular guardado.', en: 'The city\'s public market: fruit, costeño cheese, Sinú fish and cheaper groceries. Go early, with little cash and your phone away.' } },
  { id: 'planchones', cat: 'beach', lat: 8.7580, lon: -75.8888, free: false, q: 'Planchones río Sinú, Avenida Primera, Montería',
    n: { es: 'Planchones del Sinú', en: 'Sinú river ferries (planchones)' },
    d: { es: 'Embarcaciones de madera que cruzan el río movidas por la corriente y un cable. Son parte de la historia de la ciudad y cuestan muy poco. Tiene su sección en "El centro y el río".', en: 'Wooden ferries that cross the river pushed by the current along a cable. Part of the city\'s history, and very cheap. See "Downtown & the river".' } },
  { id: 'businu', cat: 'beach', lat: 8.7640, lon: -75.8862, free: false, q: 'Embarcadero Businú Calle 22, Montería',
    n: { es: 'Businú, el bus por el río', en: 'Businú, the river bus' },
    d: { es: 'El primer transporte público fluvial de Colombia: dos embarcaciones (Betancí y Yapel) entre los embarcaderos de Rancho Grande, Calle 22 y Centro Verde.', en: 'Colombia\'s first public river transport: two boats (Betancí and Yapel) between the Rancho Grande, Calle 22 and Centro Verde piers.' } },
  { id: 'sanpelayo', cat: 'nature', lat: 8.9580, lon: -75.8380, free: true, q: 'San Pelayo, Córdoba',
    n: { es: 'San Pelayo', en: 'San Pelayo' },
    d: { es: 'La capital del porro, a unos 30 km. Cada año, a finales de junio, hace el Festival Nacional del Porro con decenas de bandas.', en: 'The capital of porro music, about 30 km away. Every year in late June it holds the National Porro Festival with dozens of bands.' } },
  { id: 'lorica', cat: 'nature', lat: 9.2386, lon: -75.8137, free: true, q: 'Mercado Público de Lorica, Córdoba',
    n: { es: 'Santa Cruz de Lorica', en: 'Santa Cruz de Lorica' },
    d: { es: 'Pueblo histórico a orillas del Sinú, a cerca de una hora: casas republicanas, herencia sirio-libanesa y su mercado público junto al río. Tiene su sección en la app.', en: 'Historic riverside town about an hour away: republican-era houses, Syrian-Lebanese heritage and its public market by the river. It has its own section in the app.' } },
  { id: 'tuchin', cat: 'nature', lat: 9.1867, lon: -75.5547, free: true, q: 'Tuchín, Córdoba',
    n: { es: 'Tuchín', en: 'Tuchín' },
    d: { es: 'Tierra del pueblo zenú y cuna del sombrero vueltiao, tejido a mano con caña flecha. Aquí lo compras directo a los artesanos.', en: 'Land of the Zenú people and home of the sombrero vueltiao, hand-woven from caña flecha. Buy it straight from the artisans.' } },
  { id: 'cispata', cat: 'nature', lat: 9.3990, lon: -75.7870, free: false, q: 'Bahía de Cispatá, San Antero, Córdoba',
    n: { es: 'Bahía de Cispatá (San Antero)', en: 'Cispatá Bay (San Antero)' },
    d: { es: 'Bahía de manglares donde antes desembocaba el Sinú. Se recorre en lancha para ver aves y manglar; pregunta el precio antes.', en: 'A mangrove bay where the Sinú once met the sea. Explore it by boat to see birds and mangroves; ask the price first.' } },
  { id: 'covenas', cat: 'nature', lat: 9.4029, lon: -75.6800, free: true, q: 'Playa Coveñas, Sucre',
    n: { es: 'Coveñas', en: 'Coveñas' },
    d: { es: 'La playa más visitada por los monterianos, a unas dos horas, ya en Sucre. Mar tranquilo, pescado frito y arroz con coco.', en: 'The beach Montería locals go to most, about two hours away in Sucre. Calm sea, fried fish and coconut rice.' } },
  { id: 'arboletes', cat: 'nature', lat: 8.8670, lon: -76.4290, free: false, q: 'Volcán de lodo de Arboletes, Antioquia',
    n: { es: 'Volcán de lodo de Arboletes', en: 'Arboletes mud volcano' },
    d: { es: 'Un baño de lodo a pocos metros del mar, en Antioquia, a unas dos horas por la vía al Urabá. Tiene entrada con costo.', en: 'A mud bath a few metres from the sea, in Antioquia, about two hours along the road to Urabá. Paid entry.' } }
];

const MAP_EXTRA = [
  { id: 'sanjeronimo', cat: 'help', lat: 8.7495, lon: -75.8775, q: 'ESE Hospital San Jerónimo de Montería', n: { es: 'Hospital San Jerónimo', en: 'San Jerónimo Hospital' }, d: { es: 'El hospital público de mayor complejidad de Córdoba, con urgencias. Toca "Cómo llegar" para la ubicación exacta.', en: 'Córdoba\'s main public tertiary hospital, with an ER. Tap "Directions" for the exact location.' } },
  { id: 'vidasinu', cat: 'help', lat: 8.7600, lon: -75.8700, q: 'ESE Vidasinú Montería', n: { es: 'Red pública ESE Vidasinú', en: 'Vidasinú public health network' }, d: { es: 'La red de salud pública del municipio: 5 hospitales y centros de salud en barrios y veredas. Busca el más cercano.', en: 'The city\'s public health network: 5 hospitals and health centres in neighbourhoods and villages. Find the nearest one.' } },
  { id: 'migra', cat: 'help', lat: 8.7590, lon: -75.8860, q: 'Migración Colombia Centro Facilitador de Servicios Migratorios Montería', n: { es: 'Migración Colombia — Centro Facilitador', en: 'Migración Colombia — Service Centre' }, d: { es: 'Trámites migratorios con cita previa en línea. Confirma la dirección antes de ir.', en: 'Immigration procedures, by online appointment only. Confirm the address before going.' } },
  { id: 'terminal', cat: 'help', lat: 8.7400, lon: -75.8700, q: 'Terminal de Transporte de Montería', n: { es: 'Terminal de Transporte', en: 'Bus terminal' }, d: { es: 'Buses a Cartagena, Sincelejo, Barranquilla, Medellín, Caucasia, el Urabá y los pueblos de Córdoba.', en: 'Buses to Cartagena, Sincelejo, Barranquilla, Medellín, Caucasia, Urabá and the towns of Córdoba.' } },
  { id: 'airport', cat: 'help', lat: 8.8237, lon: -75.8258, q: 'Aeropuerto Los Garzones, Montería', n: { es: 'Aeropuerto Los Garzones', en: 'Los Garzones Airport' }, d: { es: 'Al norte de la ciudad, a unos 20 minutos del centro. Vuelos a Bogotá, Medellín y otras ciudades.', en: 'North of the city, about 20 minutes from downtown. Flights to Bogotá, Medellín and other cities.' } }
];

const OFFICES = [
  { n: { es: 'Migración Colombia — Centro Facilitador de Servicios Migratorios (Montería)', en: 'Migración Colombia — Immigration Service Centre (Montería)' }, a: 'Migración Colombia Centro Facilitador de Servicios Migratorios Montería', tel: '+576016055454', telS: '+57 601 605 5454', h: { es: 'Línea nacional de Migración. Todos los trámites van con cita previa en migracioncolombia.gov.co; confirma la dirección en el mapa.', en: 'Migración national line. All procedures need an online appointment at migracioncolombia.gov.co; confirm the address on the map.' } },
  { n: { es: 'Cancillería de Colombia (visas, incluida la Visa V)', en: 'Colombian Foreign Ministry (visas, including Visa V)' }, a: 'Cancillería de Colombia, Bogotá', tel: '+576013814000', telS: '+57 601 381 4000', h: { es: 'Las visas se piden en línea en cancilleria.gov.co', en: 'Visas are applied for online at cancilleria.gov.co' } },
  { n: { es: 'Personería de Montería (defensa de tus derechos)', en: 'Montería Ombudsman\'s Office (Personería)' }, a: 'Personería Municipal de Montería', tel: '', telS: '', h: { es: 'Atiende gratis a cualquier persona, con o sin papeles: quejas, tutelas y orientación cuando te niegan un derecho.', en: 'Free help for anyone, with or without papers: complaints, tutela actions and advice when a right is denied to you.' } }
];

const EMERG = [
  { n: '123', cls: '', t: { es: 'Línea única de emergencias', en: 'Emergency line' }, s: { es: 'Policía, ambulancia, bomberos', en: 'Police, ambulance, fire' } },
  { n: '132', cls: 'ink', t: { es: 'Cruz Roja', en: 'Red Cross' }, s: { es: 'Ambulancia y rescate', en: 'Ambulance and rescue' } },
  { n: '119', cls: 'sea', t: { es: 'Bomberos', en: 'Fire brigade' }, s: { es: 'Incendios, rescates e inundaciones', en: 'Fires, rescues and floods' } },
  { n: '155', cls: 'sky', t: { es: 'Línea para mujeres', en: 'Women\'s line' }, s: { es: 'Orientación ante violencia', en: 'Help against violence' } },
  { n: '141', cls: 'ink', t: { es: 'ICBF (niños)', en: 'ICBF (children)' }, s: { es: 'Protección de niños y niñas', en: 'Child protection' } },
  { n: '165', cls: 'sea', t: { es: 'Gaula', en: 'Gaula' }, s: { es: 'Extorsión y secuestro', en: 'Extortion and kidnapping' } }
];

// Festivos de Colombia 2026 y 2027 (Ley Emiliani). Lunes 16 de noviembre de 2026: Independencia de Cartagena (festivo nacional).
const HOLIDAYS = [
  ['2026-01-01', { es: 'Año Nuevo', en: 'New Year\'s Day' }], ['2026-01-12', { es: 'Reyes Magos', en: 'Epiphany' }],
  ['2026-03-23', { es: 'San José', en: 'Saint Joseph' }], ['2026-04-02', { es: 'Jueves Santo', en: 'Holy Thursday' }],
  ['2026-04-03', { es: 'Viernes Santo', en: 'Good Friday' }], ['2026-05-01', { es: 'Día del Trabajo', en: 'Labour Day' }],
  ['2026-05-18', { es: 'Ascensión', en: 'Ascension' }], ['2026-06-08', { es: 'Corpus Christi', en: 'Corpus Christi' }],
  ['2026-06-15', { es: 'Sagrado Corazón', en: 'Sacred Heart' }], ['2026-06-29', { es: 'San Pedro y San Pablo', en: 'Saints Peter and Paul' }],
  ['2026-07-20', { es: 'Independencia de Colombia', en: 'Colombian Independence' }], ['2026-08-07', { es: 'Batalla de Boyacá', en: 'Battle of Boyacá' }],
  ['2026-08-17', { es: 'Asunción de la Virgen', en: 'Assumption' }], ['2026-10-12', { es: 'Día de la Raza', en: 'Columbus Day' }],
  ['2026-11-02', { es: 'Todos los Santos', en: 'All Saints\' Day' }], ['2026-11-16', { es: 'Independencia de Cartagena', en: 'Cartagena Independence' }],
  ['2026-12-08', { es: 'Inmaculada Concepción', en: 'Immaculate Conception' }], ['2026-12-25', { es: 'Navidad', en: 'Christmas Day' }],
  ['2027-01-01', { es: 'Año Nuevo', en: 'New Year\'s Day' }], ['2027-01-11', { es: 'Reyes Magos', en: 'Epiphany' }],
  ['2027-03-22', { es: 'San José', en: 'Saint Joseph' }], ['2027-03-25', { es: 'Jueves Santo', en: 'Holy Thursday' }],
  ['2027-03-26', { es: 'Viernes Santo', en: 'Good Friday' }], ['2027-05-01', { es: 'Día del Trabajo', en: 'Labour Day' }],
  ['2027-05-10', { es: 'Ascensión', en: 'Ascension' }], ['2027-05-31', { es: 'Corpus Christi', en: 'Corpus Christi' }],
  ['2027-06-07', { es: 'Sagrado Corazón', en: 'Sacred Heart' }], ['2027-07-05', { es: 'San Pedro y San Pablo', en: 'Saints Peter and Paul' }],
  ['2027-07-20', { es: 'Independencia de Colombia', en: 'Colombian Independence' }], ['2027-08-07', { es: 'Batalla de Boyacá', en: 'Battle of Boyacá' }],
  ['2027-08-16', { es: 'Asunción de la Virgen', en: 'Assumption' }], ['2027-10-18', { es: 'Día de la Raza', en: 'Columbus Day' }],
  ['2027-11-01', { es: 'Todos los Santos', en: 'All Saints\' Day' }], ['2027-11-15', { es: 'Independencia de Cartagena', en: 'Cartagena Independence' }],
  ['2027-12-08', { es: 'Inmaculada Concepción', en: 'Immaculate Conception' }], ['2027-12-25', { es: 'Navidad', en: 'Christmas Day' }]
];

// Salario mínimo 2026: Decreto 1469 de 2025 (vigente; el Consejo de Estado levantó la suspensión en julio de 2026).
// Jornada de 42 horas semanales desde el 15 de julio de 2026 (Ley 2101): hora = salario / 210.
const WAGE = { month: 1750905, aux: 249095, total: 2000000, hour: 1750905 / 210, weekH: 42,
  night: .35, extraDay: .25, extraNight: .75, sunday: .90 };
// Pasaje de bus y buseta urbana en Montería 2026 (Alcaldía, enero de 2026): $3.500 por trayecto.
const BUS = 3500;

// Agenda de Montería y Córdoba (revisada el 14 nov 2026). Cuarto valor: texto de fecha cuando aún no está confirmada.
const FIESTAS = [
  ['2026-12-01', { es: 'Alumbrado navideño en la Ronda del Sinú', en: 'Christmas lights on the Ronda del Sinú' }, { es: 'Ronda del Sinú y Avenida Primera', en: 'Ronda del Sinú and Avenida Primera' }, { es: 'Diciembre de 2026 · fecha de encendido por confirmar', en: 'December 2026 · switch-on date to be confirmed' }],
  ['2026-12-07', { es: 'Noche de Velitas', en: 'Little Candles Night' }, { es: 'Barrios de toda la ciudad', en: 'Neighbourhoods across the city' }],
  ['2026-12-31', { es: 'Fin de año', en: 'New Year\'s Eve' }, { es: 'Montería', en: 'Montería' }],
  ['2027-05-01', { es: 'Montería cumple 250 años (fundada el 1 de mayo de 1777)', en: 'Montería turns 250 (founded 1 May 1777)' }, { es: 'Toda la ciudad', en: 'The whole city' }],
  ['2027-06-01', { es: '65.ª Feria Nacional de la Ganadería', en: '65th National Cattle Fair' }, { es: 'Coliseo de Ferias Miguel Villamil Muñoz y calles de Montería', en: 'Miguel Villamil Muñoz fairground and city streets' }, { es: 'Junio de 2027 · fechas por confirmar', en: 'June 2027 · dates to be confirmed' }],
  ['2027-06-25', { es: '50.º Festival Nacional del Porro', en: '50th National Porro Festival' }, { es: 'San Pelayo, a unos 30 km', en: 'San Pelayo, about 30 km away' }, { es: 'Finales de junio de 2027 · fechas por confirmar', en: 'Late June 2027 · dates to be confirmed' }]
];

const FIRST = [
  { es: ['Llena el formulario Check-MIG antes de viajar', 'Lo piden a los extranjeros al entrar y salir de Colombia. Es gratis en el sitio de Migración Colombia.'], en: ['Fill in the Check-MIG form before travelling', 'Foreigners must complete it when entering and leaving Colombia. It\'s free on Migración Colombia\'s site.'] },
  { es: ['Guarda tus documentos y una foto de cada uno', 'Pasaporte, cédula, PPT. Copias en el celular y en el correo. Nunca entregues tu documento a un "jefe".'], en: ['Keep your documents safe and a photo of each', 'Passport, ID, PPT. Copies on your phone and email. Never hand your document to a "boss".'] },
  { es: ['Compra una SIM local', 'Los operadores grandes son Claro, Movistar y Tigo. Para registrarla te piden documento.'], en: ['Get a local SIM', 'The big carriers are Claro, Movistar and Tigo. You\'ll need ID to register it.'] },
  { es: ['Anota tu dirección en esta app', 'En Montería las direcciones son tipo "Calle 27 # 3-40, Centro". La Avenida Primera va pegada al río Sinú y las calles suben de número hacia el norte.'], en: ['Save your address in this app', 'Montería addresses look like "Calle 27 # 3-40, Centro". Avenida Primera runs along the Sinú River and street numbers go up towards the north.'] },
  { es: ['Aprende a moverte', 'El bus o la buseta cuesta $3.500 en 2026. El mototaxi es muy común pero informal: exige casco. Para cruzar el río hay planchones y el Businú.'], en: ['Learn to get around', 'A bus or minibus ride costs COP 3,500 in 2026. Moto-taxis are very common but informal: insist on a helmet. To cross the river there are planchones and the Businú.'] },
  { es: ['Pregunta si la casa se inundó', 'En febrero de 2026 el río Sinú se desbordó y hubo barrios evacuados. Antes de arrendar, pregunta a los vecinos hasta dónde llegó el agua.'], en: ['Ask if the house flooded', 'In February 2026 the Sinú overflowed and neighbourhoods were evacuated. Before renting, ask the neighbours how high the water got.'] },
  { es: ['Pide la encuesta del SISBEN', 'Con PPT o documento colombiano te pueden afiliar a salud subsidiada.'], en: ['Request the SISBEN survey', 'With a PPT or Colombian ID you can join subsidised health care.'] },
  { es: ['Busca orientación gratis', 'La Personería de Montería atiende a cualquier persona, con o sin papeles. Pregunta también por las organizaciones que apoyan a migrantes en la ciudad.'], en: ['Get free guidance', 'Montería\'s Personería helps anyone, with or without papers. Also ask about organisations supporting migrants in the city.'] },
  { es: ['Abre una billetera digital o cuenta', 'Nequi, Daviplata y los bancos abren cuentas con PPT. Así cobras sin cargar efectivo.'], en: ['Open a digital wallet or account', 'Nequi, Daviplata and banks open accounts with a PPT. That way you get paid without carrying cash.'] },
  { es: ['Registra los números de emergencia', '123 para todo: policía, ambulancia y bomberos.'], en: ['Save the emergency numbers', '123 for everything: police, ambulance and fire.'] }
];

// Hablar costeño sabanero (Montería y Córdoba): [palabra, significado ES, significado EN, ejemplo]
const COSTENO = [
  ['¿Qué hubo? / ¿Quiubo?', 'Saludo: ¿qué tal?', 'Greeting: what\'s up?', '¿Quiubo, mompa, todo bien?'],
  ['Ajá', 'Muletilla para todo: saludo, "sí", "¿y entonces?"', 'All-purpose word: hello, "yes", "so what?"', 'Ajá, ¿y qué más?'],
  ['¡Eche!', 'Exclamación muy cordobesa: sorpresa, molestia o "oye"', 'Very Córdoba exclamation: surprise, annoyance or "hey"', '¡Eche, qué calor el que está haciendo!'],
  ['Mompa', 'Compadre, amigo de confianza', 'Close buddy, pal', '¿Qué más, mompa? ¿Cómo va la familia?'],
  ['La Perla del Sinú', 'Apodo cariñoso de Montería', 'Nickname of Montería', 'Bienvenido a la Perla del Sinú.'],
  ['Sabanero', 'De las sabanas de Córdoba y Sucre: su gente, su música, su ganado', 'From the plains of Córdoba and Sucre: its people, music, cattle', 'Ese es un porro bien sabanero.'],
  ['Coger el planchón', 'Cruzar el río Sinú en planchón', 'To take the river ferry', 'Cojamos el planchón pa\' la otra orilla.'],
  ['Ombe', 'Muletilla: "hombre", "oye"', 'Filler word: "man", "hey"', 'Ombe, no te pongas así.'],
  ['Pelao / Pelaíta', 'Muchacho / muchacha', 'Young guy / young girl', 'Ese pelao trabaja conmigo.'],
  ['Erda', 'Expresión de sorpresa', 'Exclamation of surprise', '¡Erda, qué aguacero!'],
  ['Bacano', 'Chévere, muy bueno', 'Cool, great', 'La Ronda estuvo bacana anoche.'],
  ['Vaina', 'Cosa (cualquier cosa)', 'Thing (any thing)', 'Pásame esa vaina.'],
  ['Mamar gallo', 'Bromear, echar chistes', 'To joke around', 'Tranquilo, te estoy mamando gallo.'],
  ['Al pelo', 'Perfecto, quedó muy bien', 'Perfect, just right', 'Ese trabajo quedó al pelo.'],
  ['Ñapa', 'Lo que te regalan de más al comprar', 'A little extra thrown in for free', '¿Me da la ñapa?'],
  ['Tinto', 'Café negro pequeño (no es vino)', 'Small black coffee (not red wine)', 'Regáleme un tinto.'],
  ['Regálame…', 'Forma amable de pedir algo, aunque lo pagues', 'Polite way to ask for something, even when paying', 'Regáleme un mote de queso, por favor.'],
  ['Cachaco', 'Persona del interior del país (Bogotá, Medellín…)', 'Person from inland Colombia', 'Ese señor es cachaco.']
];
// Venezuela → Colombia
const VECO = [
  ['Cambur', 'Banano / guineo', 'Banana'], ['Caraota', 'Fríjol', 'Bean'], ['Cotufas', 'Crispetas', 'Popcorn'],
  ['Chamo', 'Pelao', 'Young guy'], ['Pana', 'Mompa / llave', 'Buddy'], ['Jojoto', 'Mazorca', 'Corn on the cob'],
  ['Lechosa', 'Papaya', 'Papaya'], ['Autobús / camionetica', 'Bus / buseta', 'Bus'], ['Cédula venezolana', 'Pasaporte o PPT para trámites', 'Passport or PPT for paperwork']
];
// Inglés para trabajar en turismo: [inglés, español, pronunciación aproximada]
const ENG = [
  ['Welcome to Montería!', '¡Bienvenido a Montería!', 'uél-com tu mon-te-RÍ-a'],
  ['How can I help you?', '¿En qué le puedo ayudar?', 'jáu can ái jelp yu'],
  ['Do you have a reservation?', '¿Tiene reserva?', 'du yu jav a re-ser-VÉI-shon'],
  ['Table for two?', '¿Mesa para dos?', 'TÉI-bol for tu'],
  ['Here is the menu.', 'Aquí está el menú.', 'jíer is de MÉ-niu'],
  ['Would you like something to drink?', '¿Desea algo de tomar?', 'wud yu láik SÓM-thing tu drink'],
  ['It costs fifty thousand pesos.', 'Cuesta cincuenta mil pesos.', 'it costs FÍF-ti THÁU-sand PÉ-sos'],
  ['We accept cash and card.', 'Aceptamos efectivo y tarjeta.', 'ui ak-SÉPT cash and card'],
  ['The boat leaves from the pier.', 'La lancha sale del muelle.', 'de bout livs from de píer'],
  ['The cattle fair is in June.', 'La feria ganadera es en junio.', 'de KÁ-tol fer is in yun'],
  ['Do you need a taxi?', '¿Necesita un taxi?', 'du yu nid a TÁK-si'],
  ['Sorry, can you repeat that?', 'Perdón, ¿puede repetir?', 'SÓ-ri, can yu ri-PÍT dat'],
  ['Have a nice day!', '¡Que tenga un buen día!', 'jav a náis dei']
];
const DIALOGS = [
  { t: { es: 'En la buseta', en: 'On the minibus' }, l: [
    ['a', 'Buenas. ¿Esta buseta pasa por la Circunvalar?', 'Hi. Does this minibus go along the Circunvalar?'],
    ['b', 'Sí, ajá. Súbase rápido, mompa.', 'Yes, sure. Hop on quick, pal.'],
    ['a', '¿Cuánto es?', 'How much is it?'],
    ['b', 'Tres mil quinientos, y me avisa dónde se queda.', 'Three thousand five hundred, and tell me where you\'re getting off.']] },
  { t: { es: 'En la tienda del barrio', en: 'At the corner shop' }, l: [
    ['a', 'Buenas tardes. ¿A cómo está la libra de queso costeño?', 'Good afternoon. How much is a pound of costeño cheese?'],
    ['b', 'A tanto, mija. ¿Le doy de una vez?', 'It\'s so much, dear. Shall I wrap it?'],
    ['a', 'Sí, regáleme una libra y una bolsa de agua. ¿Y la ñapa?', 'Yes, give me a pound and a bag of water. And the little extra?'],
    ['b', '¡Eche! Ajá, tome su ñapa.', 'Ha! Sure, here\'s your extra.']] },
  { t: { es: 'Buscando trabajo', en: 'Looking for work' }, l: [
    ['a', 'Buenos días. Vengo por el aviso de mesero en la Ronda. Aquí está mi hoja de vida.', 'Good morning. I\'m here about the waiter ad on the Ronda. Here\'s my CV.'],
    ['b', '¿Tiene PPT o documento al día?', 'Do you have a PPT or valid ID?'],
    ['a', 'Sí, tengo PPT. También hablo un poco de inglés.', 'Yes, I have a PPT. I also speak some English.'],
    ['b', 'Al pelo. Venga mañana a las 8 y empieza a prueba.', 'Perfect. Come tomorrow at 8 and start on trial.']] },
  { t: { es: 'En urgencias', en: 'At the ER' }, l: [
    ['a', 'Buenas noches. Mi hijo tiene fiebre alta desde ayer.', 'Good evening. My son has had a high fever since yesterday.'],
    ['b', '¿Tienen EPS?', 'Are you with a health insurer (EPS)?'],
    ['a', 'Todavía no, estamos haciendo el SISBEN.', 'Not yet, we\'re doing the SISBEN.'],
    ['b', 'Igual lo atendemos. Siéntese, ya lo llaman al triaje.', 'We\'ll see him anyway. Have a seat, triage will call you.']] }
];

const LIFE = {
  housing: { t: { es: 'Vivienda', en: 'Housing' }, ph: 'house', items: [
    { es: 'El norte (La Castellana, El Recreo y alrededores) es la zona más cara; el centro es intermedio; el sur y la margen izquierda del río son más económicos.', en: 'The north (La Castellana, El Recreo and around) is the priciest area; downtown is mid-range; the south and the river\'s left bank are cheaper.' },
    { es: 'Pregunta siempre si la casa o la calle se inundó en febrero de 2026, cuando el Sinú se desbordó y se evacuaron barrios de la margen izquierda.', en: 'Always ask whether the house or street flooded in February 2026, when the Sinú overflowed and left-bank neighbourhoods were evacuated.' },
    { es: 'Busca en grupos del barrio, avisos de "Se arrienda" en las fachadas y portales de arriendo. Desconfía de precios muy bajos en zonas caras.', en: 'Look in neighbourhood groups, "Se arrienda" signs on houses and rental sites. Distrust very low prices in pricey areas.' },
    { es: 'Nunca pagues depósito sin ver el lugar y sin contrato firmado con el nombre del dueño.', en: 'Never pay a deposit without seeing the place and a signed contract in the owner\'s name.' },
    { es: 'Pregunta si los servicios (agua, luz, gas) están incluidos: con el calor, el aire acondicionado sube mucho el recibo de luz. Pide recibo de cada pago: te sirve como prueba de residencia.', en: 'Ask if utilities (water, power, gas) are included: with the heat, air-con pushes the power bill up a lot. Get a receipt for every payment: it works as proof of address.' }] },
  food: { t: { es: 'Comida', en: 'Food' }, ph: 'mote', items: [
    { es: 'Mote de queso: la sopa espesa de ñame con queso costeño, el plato de Córdoba por excelencia.', en: 'Mote de queso: the thick yam soup with costeño cheese, Córdoba\'s signature dish.' },
    { es: 'Bocachico frito o en viudo, el pescado del Sinú, con arroz con coco y patacón.', en: 'Bocachico, the Sinú River fish, fried or stewed, with coconut rice and fried plantain.' },
    { es: 'Para el desayuno: bollo limpio con queso y suero atollabuey, carimañolas, arepa de huevo y butifarra.', en: 'For breakfast: corn bollo with cheese and suero atollabuey (sour cream), carimañolas, arepa de huevo and butifarra sausage.' },
    { es: 'Carne asada y posta: en la capital ganadera la carne es protagonista.', en: 'Grilled beef: in Colombia\'s cattle capital, meat takes centre stage.' },
    { es: 'Para el calor: raspao, chicha de maíz, jugo de corozo o de níspero. Arepas, cachapas y empanadas venezolanas se consiguen en muchos barrios.', en: 'For the heat: raspao shaved ice, corn chicha, corozo or níspero juice. Venezuelan arepas, cachapas and empanadas are found in many neighbourhoods.' }] },
  culture: { t: { es: 'Costumbres', en: 'Customs' }, ph: 'vueltiao', items: [
    { es: 'Montería es la capital ganadera de Colombia: la Feria Nacional de la Ganadería, en junio, es la fiesta grande, con cabalgata, reinado y desfiles.', en: 'Montería is Colombia\'s cattle capital: the National Cattle Fair in June is the big party, with a horse parade, a pageant and street parades.' },
    { es: 'El porro y el fandango, con bandas de viento, son la música de Córdoba. También suenan vallenato, champeta y salsa.', en: 'Porro and fandango, played by brass bands, are Córdoba\'s music. You\'ll also hear vallenato, champeta and salsa.' },
    { es: 'El sombrero vueltiao, tejido por los artesanos zenúes de Tuchín y alrededores, es símbolo cultural de la Nación. Llevarlo es motivo de orgullo.', en: 'The sombrero vueltiao, woven by Zenú artisans from Tuchín and nearby, is a national cultural symbol. Wearing one is a point of pride.' },
    { es: 'Se saluda al entrar: "Buenas" en la tienda, la buseta o la oficina. El sabanero es alegre y habla duro: no es pelea.', en: 'Greet when you walk in: "Buenas" in a shop, minibus or office. People here are cheerful and loud: it isn\'t a fight.' },
    { es: 'En oficinas públicas ve bien presentado: nada de chanclas ni esqueleto.', en: 'Dress smartly for government offices: no flip-flops or tank tops.' }] },
  safety: { t: { es: 'Seguridad', en: 'Safety' }, ph: 'street', items: [
    { es: '<b>El río:</b> no te bañes en el Sinú, tiene corrientes fuertes. Cuando sube, las autoridades suspenden planchones y lanchas: hazles caso.', en: '<b>The river:</b> don\'t swim in the Sinú, its currents are strong. When it rises, the authorities stop the ferries and boats: follow their instructions.' },
    { es: '<b>Inundaciones:</b> si vives cerca del río o en zona baja, ten a mano documentos en bolsa plástica, linterna y un plan para salir. Sigue los avisos de la Alcaldía y llama al 123.', en: '<b>Floods:</b> if you live near the river or in a low area, keep documents in a plastic bag, a torch and an exit plan. Follow city alerts and call 123.' },
    { es: 'Saca el celular solo cuando lo necesites, sobre todo en el centro, en paradas y en semáforos. Ojo con los robos en moto.', en: 'Only take your phone out when you need it, especially downtown, at stops and traffic lights. Watch out for motorbike thieves.' },
    { es: 'No aceptes bebidas, dulces ni cigarrillos de desconocidos. Y desconfía de ofertas de trabajo que piden plata o tu documento: si te extorsionan, llama al 165.', en: 'Never accept drinks, sweets or cigarettes from strangers. Distrust job offers that ask for money or your ID: if you are extorted, call 165.' },
    { es: 'Los trámites migratorios no necesitan tramitadores: paga solo en canales oficiales de Migración Colombia o Cancillería.', en: 'Immigration procedures need no middlemen: pay only through official Migración Colombia or Foreign Ministry channels.' }] }
};

// Sección "El centro y el río"
const GS = {
  what: [
    { es: 'Montería fue fundada el 1 de mayo de 1777 a orillas del río Sinú. En 2027 cumple 250 años. Es la capital de Córdoba y la "Perla del Sinú".', en: 'Montería was founded on 1 May 1777 on the banks of the Sinú River. It turns 250 in 2027. It\'s the capital of Córdoba and the "Pearl of the Sinú".' },
    { es: 'El centro gira alrededor del Parque Simón Bolívar y la Catedral San Jerónimo, a dos cuadras de la Avenida Primera y del río.', en: 'Downtown revolves around Simón Bolívar Park and San Jerónimo Cathedral, two blocks from Avenida Primera and the river.' },
    { es: 'Para cruzar el río, la ciudad conserva sus planchones: embarcaciones de madera que se mueven con la fuerza de la corriente, sujetas a un cable.', en: 'To cross the river, the city keeps its planchones: wooden ferries moved by the force of the current, held by a cable.' },
    { es: 'Desde diciembre de 2025 funciona Businú, el primer transporte público fluvial de Colombia, con dos embarcaciones (Betancí y Yapel) y embarcaderos en Rancho Grande, Calle 22 y Centro Verde.', en: 'Since December 2025 Businú has been running, Colombia\'s first public river transport, with two boats (Betancí and Yapel) and piers at Rancho Grande, Calle 22 and Centro Verde.' }
  ],
  doit: [
    [{ es: 'Catedral San Jerónimo', en: 'San Jerónimo Cathedral' }, { es: 'La catedral blanca frente al parque principal, punto de encuentro del centro.', en: 'The white cathedral facing the main square, downtown\'s meeting point.' }, 'catedral'],
    [{ es: 'Cruzar en planchón', en: 'Cross by planchón' }, { es: 'Un viaje de pocos minutos y muy barato que es pura historia monteriana.', en: 'A short, very cheap trip that is pure Montería history.' }, 'planchones'],
    [{ es: 'Montar en Businú', en: 'Ride the Businú' }, { es: 'El bus por el río: lleva pasajeros y bicicletas entre los embarcaderos.', en: 'The river bus: it carries passengers and bicycles between piers.' }, 'businu'],
    [{ es: 'Mercado del Sur', en: 'Mercado del Sur' }, { es: 'Queso costeño, frutas y pescado del río a buen precio.', en: 'Costeño cheese, fruit and river fish at good prices.' }, 'mercado']
  ],
  tips: [
    { es: 'Ve al centro de día: es muy comercial y se llena de gente. Guarda el celular y la billetera en el bolsillo de adelante.', en: 'Go downtown by day: it\'s very commercial and gets crowded. Keep your phone and wallet in a front pocket.' },
    { es: 'En el centro se consigue ropa, zapatos y cosas para la casa más baratas que en los centros comerciales.', en: 'Downtown you\'ll find clothes, shoes and household goods cheaper than in the malls.' },
    { es: 'El planchón cuesta muy poco: lleva monedas o billetes pequeños y pregunta el precio al subir.', en: 'The planchón is very cheap: bring coins or small notes and ask the price when you board.' },
    { es: 'Si el río está crecido, planchones y lanchas pueden suspenderse. No te subas a ninguna embarcación sin chaleco cuando te lo ofrezcan.', en: 'When the river is high, ferries and boats may be suspended. Wear a life jacket whenever one is offered.' },
    { es: 'Pregunta en el embarcadero el horario y el valor del Businú antes de planear tu ruta: el servicio es nuevo y puede cambiar.', en: 'Ask at the pier for Businú times and fares before planning your route: the service is new and may change.' },
    { es: 'Lleva agua y gorra: entre las 11 a. m. y las 3 p. m. el calor pega duro.', en: 'Bring water and a cap: between 11 am and 3 pm the heat is fierce.' }
  ]
};

// Sección "Lorica y el mar de Córdoba"
const IS = {
  what: [
    { es: 'Santa Cruz de Lorica, a cerca de una hora al norte, es el pueblo histórico del Sinú: casas republicanas, herencia sirio-libanesa y un mercado público a la orilla del río.', en: 'Santa Cruz de Lorica, about an hour north, is the Sinú\'s historic town: republican-era houses, Syrian-Lebanese heritage and a public market on the riverbank.' },
    { es: 'Hoy el Sinú llega al mar en Boca de Tinajones, cerca de San Bernardo del Viento. Su antigua desembocadura es la Bahía de Cispatá, en San Antero, un mundo de manglares y aves.', en: 'Today the Sinú meets the sea at Boca de Tinajones, near San Bernardo del Viento. Its old mouth is Cispatá Bay in San Antero, a world of mangroves and birds.' },
    { es: 'Para playa, los monterianos van sobre todo a Coveñas (Sucre) y a las playas de la costa de Córdoba, a unas dos horas.', en: 'For the beach, Montería people mostly go to Coveñas (Sucre) and Córdoba\'s coast, about two hours away.' }
  ],
  doit: [
    [{ es: 'Mercado de Lorica', en: 'Lorica market' }, { es: 'Desayuna bollo y queso o almuerza bocachico frente al río.', en: 'Breakfast on bollo and cheese or have bocachico for lunch by the river.' }, 'lorica'],
    [{ es: 'Manglares de Cispatá', en: 'Cispatá mangroves' }, { es: 'Paseo en lancha entre manglares, con aves y pesca artesanal.', en: 'A boat trip through mangroves, with birds and small-scale fishing.' }, 'cispata'],
    [{ es: 'Playa en Coveñas', en: 'Beach at Coveñas' }, { es: 'Mar calmado, pescado frito y arroz con coco.', en: 'Calm sea, fried fish and coconut rice.' }, 'covenas'],
    [{ es: 'Sombreros en Tuchín', en: 'Hats in Tuchín' }, { es: 'Compra el sombrero vueltiao directo a los artesanos zenúes.', en: 'Buy the sombrero vueltiao straight from Zenú artisans.' }, 'tuchin']
  ],
  tips: [
    { es: 'Los buses a Lorica, Coveñas y Tuchín salen de la Terminal de Transporte de Montería. Pregunta el último bus de regreso.', en: 'Buses to Lorica, Coveñas and Tuchín leave from Montería\'s bus terminal. Ask for the last bus back.' },
    { es: 'Báñate solo donde haya salvavidas y respeta la bandera roja.', en: 'Only swim where there are lifeguards and respect the red flag.' },
    { es: 'Pregunta el precio de la lancha, la carpa, la silla y la comida antes de usarlas. Así evitas cobros sorpresa.', en: 'Ask the price of the boat, tent, chair and food before using them. That way no surprise bills.' },
    { es: 'Un sombrero vueltiao de muchas vueltas (más fino) cuesta mucho más: el precio depende del número de vueltas del tejido.', en: 'A sombrero vueltiao with more turns (finer weave) costs much more: the price depends on the number of turns.' },
    { es: 'Lleva efectivo en billetes pequeños, documento, toalla, gorra, agua, repelente y bloqueador.', en: 'Bring cash in small notes, ID, a towel, a cap, water, repellent and sunscreen.' },
    { es: 'No botes basura ni plásticos: los manglares y la playa son de todos.', en: 'Don\'t leave rubbish or plastic: the mangroves and the beach belong to everyone.' }
  ]
};

// Sección "Ronda del Sinú"
const ML = {
  what: [
    { es: 'Es el parque lineal a la orilla del río Sinú, pegado a la Avenida Primera. La Ronda del centro va más o menos entre las calles 22 y 36 y sigue hacia el norte con la Ronda Norte.', en: 'It\'s the linear park along the Sinú River, right by Avenida Primera. The downtown Ronda runs roughly between Calles 22 and 36 and continues north as the Ronda Norte.' },
    { es: 'Está considerado uno de los parques lineales más grandes de Latinoamérica, con unos 4,5 km de senderos, ciclorruta y zonas verdes.', en: 'It\'s considered one of Latin America\'s largest linear parks, with about 4.5 km of paths, bike lanes and green space.' },
    { es: 'En sus árboles viven iguanas y perezosos. Míralos, pero no los toques ni les des comida.', en: 'Iguanas and sloths live in its trees. Look, but don\'t touch or feed them.' },
    { es: 'En diciembre se llena de luces y escenas de Navidad, y durante la Feria de la Ganadería se adorna con figuras gigantes del folclor sinuano. La entrada es gratis.', en: 'In December it fills with lights and Christmas scenes, and during the Cattle Fair it\'s decorated with giant figures from Sinú folklore. Entry is free.' }
  ],
  doit: [
    [{ es: 'Caminar o trotar junto al río', en: 'Walk or jog by the river' }, { es: 'Lo mejor es al atardecer, cuando baja el sol y entra la brisa.', en: 'Best at sunset, when the sun eases and the breeze comes in.' }, 'ronda'],
    [{ es: 'Ver iguanas y perezosos', en: 'Spot iguanas and sloths' }, { es: 'Mira hacia arriba en los árboles grandes: son parte de la ciudad.', en: 'Look up into the big trees: they\'re part of the city.' }, 'perezoso'],
    [{ es: 'Visitar el MUZAC', en: 'Visit MUZAC' }, { es: 'Arte contemporáneo de la región en plena Ronda.', en: 'Contemporary regional art right on the Ronda.' }, 'muzac'],
    [{ es: 'Ver el atardecer sobre el Sinú', en: 'Watch the sunset over the Sinú' }, { es: 'El plan gratis favorito de las familias monterianas.', en: 'Montería families\' favourite free plan.' }, 'sunset']
  ],
  tips: [
    { es: 'Es gratis y abierta a todo el mundo: el mejor plan familiar que no cuesta nada.', en: 'It\'s free and open to everyone: the best family plan that costs nothing.' },
    { es: 'Ve entre las 5 y las 8 de la noche: hace menos calor y se ve el atardecer sobre el río.', en: 'Go between 5 and 8 pm: it\'s cooler and you see the sunset over the river.' },
    { es: 'Los kioscos y restaurantes de la Avenida Primera dan trabajo de mesero y cocina: pregunta con tu hoja de vida y tus papeles.', en: 'The kiosks and restaurants on Avenida Primera hire waiters and kitchen staff: ask with your CV and papers.' },
    { es: 'Cuando el río crece, algunos tramos se inundan: no camines por zonas con agua y respeta los cierres.', en: 'When the river rises, some stretches flood: don\'t walk through water and respect closures.' },
    { es: 'De noche camina por las zonas iluminadas y con gente, y guarda el celular.', en: 'At night stay in lit, busy areas and keep your phone away.' },
    { es: 'Cuida lo que es de todos: nada de basura ni rayones, y no molestes a los animales.', en: 'Look after what belongs to everyone: no litter or graffiti, and leave the animals alone.' }
  ]
};

// Videos reales de YouTube (revisados el 14 nov 2026). El robot agrega más en data/videos.json
const VIDEO_LIB = [
  { id: 'BN96DHexP_w', k: 'ronda', t: { es: 'La Ronda del Sinú desde el aire', en: 'The Ronda del Sinú from the air' } },
  { id: 'qelb3TRGrp8', k: 'ronda', t: { es: 'Así es el parque lineal Ronda del Sinú', en: 'A walk along the Ronda del Sinú' } },
  { id: 'HtUb_OFG69U', k: 'ronda', t: { es: 'Lo que no sabes de Montería', en: 'What you don\'t know about Montería' } },
  { id: 'O-xKs1TwBkU', k: 'centro', t: { es: 'Parque Simón Bolívar y la Catedral desde el aire', en: 'Simón Bolívar Park and the Cathedral from the air' } },
  { id: 'vYIpDKO62wc', k: 'centro', t: { es: 'Los planchones, la tradición para cruzar el Sinú', en: 'The planchones, the traditional way across the Sinú' } },
  { id: '0dT1qDf-DWo', k: 'centro', t: { es: 'Así funcionan los planchones de Montería', en: 'How Montería\'s river ferries work' } },
  { id: 'TPIg_GhmxZI', k: 'centro', t: { es: 'Las naves de Businú tocan el agua por primera vez', en: 'The Businú boats touch water for the first time' } },
  { id: 'Pi3W5p3xriI', k: 'feria', t: { es: 'Feria de la Ganadería: juzgamiento de la raza Brahman', en: 'Cattle Fair: Brahman breed judging' } },
  { id: 'KBP8HHmCyZI', k: 'feria', t: { es: 'Soy Pelayero: la Gran Banda del Festival del Porro', en: 'Soy Pelayero: the Porro Festival grand band' } },
  { id: 'CmR_4sJTLd0', k: 'feria', t: { es: 'Llegada de las bandas al Festival del Porro', en: 'Bands arriving at the Porro Festival' } },
  { id: 'o1UsxLw48bc', k: 'costa', t: { es: 'Recorrido por Santa Cruz de Lorica', en: 'A walk through Santa Cruz de Lorica' } },
  { id: 'K2DYxvQ2cPo', k: 'costa', t: { es: 'El mercado público de Lorica', en: 'Lorica\'s public market' } },
  { id: 'zlnY2McZsLw', k: 'costa', t: { es: 'El sombrero vueltiao (microdocumental)', en: 'The sombrero vueltiao (short documentary)' } },
  { id: 'Q6NfXbFm5ms', k: 'costa', t: { es: 'Cómo se teje el vueltiao en Tuchín', en: 'How the vueltiao is woven in Tuchín' } },
  { id: 'BOYeEr9O54w', k: 'vida', t: { es: 'Cómo preparar mote de queso', en: 'How to make mote de queso' } },
  { id: 'CUx_9hsvU1g', k: 'vida', t: { es: 'Así se desbordó el Sinú en febrero de 2026', en: 'How the Sinú overflowed in February 2026' } }
];

/* ---------- Secciones (vistas) ---------- */
const SECTIONS = [
  { id: 'papers', ph: 'catedral', badge: { es: 'Plazo', en: 'Deadline' }, t: { es: 'Papeles, PPT y visas', en: 'Papers, PPT & visas' }, s: { es: 'PEP Tutor, Visa V, PPT para menores, Check-MIG', en: 'PEP Tutor, Visa V, PPT for minors, Check-MIG' } },
  { id: 'work', ph: 'cebu', t: { es: 'Trabajo y salario', en: 'Work & wages' }, s: { es: 'Mínimo 2026 y calculadora', en: '2026 minimum & calculator' } },
  { id: 'feria', ph: 'feria', badge: { es: '250 años', en: '250 years' }, t: { es: 'Feria y fiestas', en: 'Fair & festivals' }, s: { es: 'Navidad, 250 años, Feria Ganadera y Porro', en: 'Christmas, 250 years, Cattle Fair and Porro' } },
  { id: 'ronda', ph: 'ronda', badge: { es: 'Imperdible', en: 'Must-see' }, t: { es: 'Ronda del Sinú', en: 'Ronda del Sinú' }, s: { es: 'El parque gratis a la orilla del río', en: 'The free riverside park' } },
  { id: 'centro', ph: 'planchones', badge: { es: 'Río', en: 'River' }, t: { es: 'El centro y el río', en: 'Downtown & the river' }, s: { es: 'Catedral, planchones, Businú y mercado', en: 'Cathedral, ferries, Businú and market' } },
  { id: 'costa', ph: 'lorica', badge: { es: 'Paseo', en: 'Day trip' }, t: { es: 'Lorica y el mar de Córdoba', en: 'Lorica & Córdoba\'s coast' }, s: { es: 'Pueblo histórico, manglares, playa y sombreros', en: 'Historic town, mangroves, beach and hats' } },
  { id: 'places', ph: 'sinu', t: { es: 'Lugares', en: 'Places' }, s: { es: 'Qué conocer, gratis y de pago', en: 'What to see, free and paid' } },
  { id: 'move', ph: 'mototaxi', t: { es: 'Transporte', en: 'Getting around' }, s: { es: 'Buseta, mototaxi, Businú y taxis', en: 'Minibus, moto-taxi, Businú, taxis' } },
  { id: 'health', ph: 'hospital', t: { es: 'Salud', en: 'Health' }, s: { es: 'Urgencias, SISBEN, EPS', en: 'ER, SISBEN, insurers' } },
  { id: 'money', ph: 'peso', t: { es: 'Peso y cambio', en: 'Peso & exchange' }, s: { es: 'Dólar, euro y bolívar en vivo', en: 'Dollar, euro and bolívar live' } },
  { id: 'talk', ph: 'porro', t: { es: 'Hablar costeño', en: 'Speak costeño' }, s: { es: 'Palabras, conversaciones e inglés', en: 'Words, dialogues and English' } },
  { id: 'life', ph: 'house', t: { es: 'Vivir aquí', en: 'Living here' }, s: { es: 'Vivienda, comida, río, seguridad', en: 'Housing, food, river, safety' } },
  { id: 'weather', ph: 'sunset', t: { es: 'Clima y festivos', en: 'Weather & holidays' }, s: { es: 'Pronóstico y feriados', en: 'Forecast and holidays' } },
  { id: 'first', ph: 'airport', t: { es: 'Primeros días', en: 'First days' }, s: { es: 'Lista paso a paso', en: 'Step-by-step list' } },
  { id: 'map', ph: 'monteria', t: { es: 'Mapa', en: 'Map' }, s: { es: 'Lugares, hospitales, Migración', en: 'Places, hospitals, immigration' } },
  { id: 'media', ph: 'vueltiao', t: { es: 'Fotos y videos', en: 'Photos & videos' }, s: { es: 'Conoce la ciudad antes de ir', en: 'See the city before you go' } }
];
const WIDE = ['papers', 'feria', 'ronda', 'centro', 'costa', 'media'];


function head(id, title, sub) {
  return `<button class="back" onclick="go('home')">${L(T.back)}</button>
  <div class="sec-head" style="margin-top:0"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div></div>`;
}
const linkBtn = (href, txt, cls = '') => `<a class="btn ${cls}" href="${href}" target="_blank" rel="noopener">${txt}</a>`;

const V = {};


V.home = () => `
  <div class="hero" id="hero">
    <div class="dots" id="hero-dots"></div>
    <span class="cap" id="hero-cap"></span>
    <div class="in">
      <span class="kicker">${L({ es: 'Recién llegado a Montería', en: 'Just arrived in Montería' })}</span>
      <h1>${L({ es: 'Bienvenido a la Perla del Sinú', en: 'Welcome to the Pearl of the Sinú' })}</h1>
      <p>${L({ es: 'Papeles, trabajo, transporte, salud, cómo hablar costeño, la Feria Ganadera, el río Sinú y los mejores rincones de Montería, en un solo lugar y en tu idioma.', en: 'Papers, work, transport, health, how to speak costeño, the Cattle Fair, the Sinú River and the best of Montería, all in one place and in your language.' })}</p>
    </div>
  </div>
  <div id="alert"></div>
  <div class="live">
    <div class="lc dark"><div class="lab">${L({ es: 'Clima ahora', en: 'Weather now' })}</div><div class="big" id="wx-now"><span class="spin"></span></div><div class="sub" id="wx-sub"></div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Hora en Montería', en: 'Time in Montería' })}</div><div class="big" id="clk-co">--:--</div><div class="sub" id="clk-ve"></div></div>
    <div class="lc c3"><div class="lab">${L({ es: '1 dólar hoy', en: '1 US dollar today' })}</div><div class="big" id="fx-usd"><span class="spin"></span></div><div class="sub muted" id="fx-sub"></div></div>
  </div>
  <div id="fiesta-strip"></div>
  <div class="card mt2" id="news-card">
    <div class="row" style="justify-content:space-between"><h3 style="text-transform:uppercase">${L({ es: 'Hoy en Montería', en: 'Today in Montería' })}</h3><button class="btn sm red" onclick="loadNews(true)">${L({ es: 'Actualizar', en: 'Refresh' })}</button></div>
    <p class="small muted" id="news-meta"></p>
    <div class="status-list mt" id="news-list"><div class="sl"><span class="spin"></span></div></div>
  </div>
  <div class="sec-head"><div><h2>${L({ es: 'Video del día', en: 'Video of the day' })}</h2></div></div>
  <div class="vids">${vidCard(videoOfDay())}</div>
  <div class="ptiles">
    ${SECTIONS.map(s => `<button class="pt ${s.badge ? 'hot' : ''} ${WIDE.includes(s.id) ? 'wide' : ''}" ${s.badge ? `data-badge="${esc(L(s.badge))}"` : ''} ${photo(s.ph)} onclick="go('${s.id}')"><b>${L(s.t)}</b><small>${L(s.s)}</small></button>`).join('')}
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Mi dirección en Montería', en: 'My address in Montería' })}</h3>
    <p class="small muted">${L({ es: 'Guárdala aquí. Si te pierdes, la app te lleva de vuelta o se la muestras a alguien. Solo queda en tu celular.', en: 'Save it here. If you get lost, the app takes you back or you show it to someone. It stays on your phone only.' })}</p>
    <div class="row mt"><input id="my-addr" placeholder="${L({ es: 'Ej: Calle 27 # 3-40, Centro', en: 'E.g. Calle 27 # 3-40, Centro' })}" value="${esc(store.get('addr', ''))}"><button class="btn red" onclick="saveAddr()">${L({ es: 'Guardar', en: 'Save' })}</button></div>
    <div class="btns"><button class="btn sm" onclick="routeHome()">${L({ es: 'Llévame a casa', en: 'Take me home' })}</button><button class="btn sm ghost" onclick="openShow()">${L({ es: 'Mostrar a alguien', en: 'Show someone' })}</button></div>
  </div>`;

V.feria = () => `
  ${head('feria', L({ es: 'Feria y fiestas', en: 'Fair & festivals' }), L({ es: 'Lo que viene en Montería y Córdoba: Navidad en la Ronda, los 250 años de la ciudad, la Feria Nacional de la Ganadería y el Festival del Porro.', en: 'What\'s coming up in Montería and Córdoba: Christmas on the Ronda, the city\'s 250th birthday, the National Cattle Fair and the Porro Festival.' }))}
  <div class="hero" style="min-height:240px" ${photo('feria')}><div class="in"><span class="kicker">${L({ es: 'Capital ganadera de Colombia', en: 'Colombia\'s cattle capital' })}</span><h1 style="font-size:2.3rem">${L({ es: 'Ganado, caballos, porro y río', en: 'Cattle, horses, porro and the river' })}</h1><p id="fiesta-next"></p></div></div>
  <div class="status-list" id="fiesta-list"></div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'La Feria Nacional de la Ganadería', en: 'The National Cattle Fair' })}</h3>
    <ul class="small">
      <li>${L({ es: 'Es la fiesta grande de Montería. La edición 64 fue del 5 al 15 de junio de 2026 en el Coliseo de Ferias Miguel Villamil Muñoz y en las calles de la ciudad.', en: 'It\'s Montería\'s big festival. The 64th edition ran from 5 to 15 June 2026 at the Miguel Villamil Muñoz fairground and in the city\'s streets.' })}</li>
      <li>${L({ es: 'Trae juzgamientos y subastas de ganado, feria equina, cabalgata, el Reinado Nacional de la Ganadería, desfiles folclóricos y conciertos.', en: 'It brings cattle judging and auctions, a horse show, the horse parade, the National Cattle Pageant, folk parades and concerts.' })}</li>
      <li>${L({ es: 'Se esperaban más de 150.000 visitantes y cerca de 20.000 empleos temporales: es buena época para conseguir trabajo en eventos, comida, hoteles y logística.', en: 'Over 150,000 visitors and about 20,000 temporary jobs were expected: a good time to find work in events, food, hotels and logistics.' })}</li>
    </ul>
  </div>
  <div class="sec-head"><div><h2>${L({ es: 'Lo que vas a ver', en: 'What you\'ll see' })}</h2><p>${L({ es: 'Desliza para ver más.', en: 'Swipe for more.' })}</p></div></div>
  <div class="rail">
    <article class="place"><div class="ph" ${photo('cebu')}></div><div class="bd"><h3>${L({ es: 'Ganado cebú', en: 'Zebu cattle' })}</h3><p>${L({ es: 'La raza que domina las sabanas de Córdoba y la estrella de los juzgamientos de la Feria.', en: 'The breed that rules Córdoba\'s plains and the star of the Fair\'s judging.' })}</p></div></article>
    <article class="place"><div class="ph" ${photo('caballo')}></div><div class="bd"><h3>${L({ es: 'La cabalgata', en: 'The horse parade' })}</h3><p>${L({ es: 'Miles de jinetes recorren la ciudad con caballos de paso. Es el día más concurrido de la Feria.', en: 'Thousands of riders on gaited horses ride through the city. The Fair\'s busiest day.' })}</p></div></article>
    <article class="place"><div class="ph" ${photo('porro')}></div><div class="bd"><h3>${L({ es: 'Porro y fandango', en: 'Porro and fandango' })}</h3><p>${L({ es: 'La música de bandas de viento de Córdoba. En San Pelayo tiene su festival nacional desde 1977.', en: 'Córdoba\'s brass-band music. San Pelayo has held its national festival since 1977.' })}</p></div></article>
    <article class="place"><div class="ph" ${photo('vueltiao')}></div><div class="bd"><h3>${L({ es: 'Sombrero vueltiao', en: 'Sombrero vueltiao' })}</h3><p>${L({ es: 'Tejido por artesanos zenúes con caña flecha. Es símbolo cultural de la Nación.', en: 'Woven by Zenú artisans from caña flecha. A national cultural symbol.' })}</p></div></article>
  </div>
  ${vidRail('feria')}
  <div class="card mt2 reveal"><h3>${L({ es: 'Consejos para gozarlo', en: 'Tips to enjoy it' })}</h3><ul class="small">
    <li>${L({ es: 'Para la cabalgata y los desfiles, llega temprano y busca sombra: el sol de junio es fuerte.', en: 'For the horse parade and street parades, arrive early and find shade: the June sun is strong.' })}</li>
    <li>${L({ es: 'Compra boletas para conciertos y palcos solo en los canales oficiales: hay estafas con entradas falsas.', en: 'Buy concert and grandstand tickets only through official channels: there are scams with fake tickets.' })}</li>
    <li>${L({ es: 'No te acerques por detrás a los caballos ni dejes que los niños corran entre ellos.', en: 'Never approach horses from behind or let children run among them.' })}</li>
    <li>${L({ es: 'Bebe mucha agua y no aceptes tragos de desconocidos. Acuerda con los tuyos un punto de encuentro por si se pierden.', en: 'Drink plenty of water and never accept drinks from strangers. Agree a meeting point in case you get separated.' })}</li>
    <li>${L({ es: 'En 2027 Montería cumple 250 años: espera eventos especiales alrededor del 1 de mayo.', en: 'In 2027 Montería turns 250: expect special events around 1 May.' })}</li>
  </ul></div>
  <p class="small muted mt">${L({ es: 'Datos de la Gobernación de Córdoba y la prensa regional, revisados el 14 de noviembre de 2026. Las fechas de la Feria y del Festival del Porro de 2027 aún no están anunciadas: confírmalas antes de viajar.', en: 'Data from the Córdoba governor\'s office and regional press, checked on 14 November 2026. The 2027 Fair and Porro Festival dates haven\'t been announced yet: confirm them before travelling.' })}</p>
  <div class="btns">${linkBtn('https://www.cordoba.gov.co/', L({ es: 'Gobernación de Córdoba', en: 'Córdoba government' }), 'sm red')}<a class="btn sm" href="https://www.youtube.com/results?search_query=${encodeURIComponent('Feria Nacional de la Ganadería Montería')}" target="_blank" rel="noopener">${L({ es: 'Videos', en: 'Videos' })}</a></div>`;

function fiestaWhen(f) { return f[3] ? L(f[3]) : `<span style="text-transform:capitalize">${dateLabel(f[0])}</span>`; }
function fiestaRows() {
  const today = todayISO();
  return FIESTAS.map(f => {
    const dt = daysTo(f[0]);
    const pill = f[3] && dt > 0 ? `<span class="pill">${L({ es: 'Por confirmar', en: 'TBC' })}</span>` : f[0] === today ? `<span class="pill free">${L({ es: 'Hoy', en: 'Today' })}</span>` : dt > 0 ? `<span class="pill">${L({ es: 'En ' + dt + ' d', en: 'In ' + dt + ' d' })}</span>` : `<span class="pill paid">${L({ es: 'Ya pasó', en: 'Done' })}</span>`;
    return `<div class="sl" style="${dt < 0 ? 'opacity:.55' : ''}"><div><b>${L(f[1])}</b><small>${fiestaWhen(f)} · ${L(f[2])}</small></div>${pill}</div>`;
  }).join('');
}
function nextFiesta() { const today = todayISO(); return FIESTAS.find(f => f[0] >= today) || null; }
function fiestaIn(f) { const d = daysTo(f[0]); return f[3] ? L(f[3]) : d === 0 ? L({ es: 'hoy', en: 'today' }) : L({ es: 'en ' + d + ' días', en: 'in ' + d + ' days' }); }
function renderFiestas() {
  const box = $('#fiesta-list'); if (box) box.innerHTML = fiestaRows();
  const nf = nextFiesta();
  const p = $('#fiesta-next'); if (p) p.textContent = nf ? L({ es: 'Lo que sigue: ', en: 'Up next: ' }) + L(nf[1]) + ' (' + fiestaIn(nf) + ')' : L({ es: 'Revisa la agenda de 2028 en cordoba.gov.co.', en: 'Check the 2028 calendar at cordoba.gov.co.' });
  const s = $('#fiesta-strip');
  if (s) s.innerHTML = nf ? `<div class="card dark mt2" style="cursor:pointer" onclick="go('feria')"><div class="small" style="opacity:.75">${L({ es: 'Agenda de Montería y Córdoba', en: 'Montería & Córdoba calendar' })}</div><b style="font-family:'Barlow Condensed';font-size:1.45rem;text-transform:uppercase">${L(nf[1])}</b><div class="small" style="opacity:.85">${fiestaWhen(nf)}${nf[3] ? '' : ' · ' + fiestaIn(nf)}</div></div>` : '';
}

V.places = () => {
  const cats = [['city', { es: 'Ciudad', en: 'City' }], ['beach', { es: 'Río Sinú', en: 'Sinú River' }], ['nature', { es: 'Paseos de un día', en: 'Day trips' }]];
  const extra = { ronda: ['ronda', { es: 'Ver Ronda', en: 'See Ronda' }], muzac: ['ronda', { es: 'Ver Ronda', en: 'See Ronda' }], catedral: ['centro', { es: 'Ver centro', en: 'See downtown' }], mercado: ['centro', { es: 'Ver centro', en: 'See downtown' }], planchones: ['centro', { es: 'Ver sección', en: 'See section' }], businu: ['move', { es: 'Ver transporte', en: 'See transport' }], lorica: ['costa', { es: 'Ver sección', en: 'See section' }], cispata: ['costa', { es: 'Ver sección', en: 'See section' }], covenas: ['costa', { es: 'Ver sección', en: 'See section' }], tuchin: ['costa', { es: 'Ver sección', en: 'See section' }], sanpelayo: ['feria', { es: 'Ver fiestas', en: 'See festivals' }] };
  return `${head('places', L({ es: 'Lugares para conocer', en: 'Places to see' }), L({ es: 'Desliza para ver más. Toca "Cómo llegar" para abrir la ruta.', en: 'Swipe for more. Tap "Directions" to open the route.' }))}
  ${cats.map(c => `<h3 class="mt2" style="text-transform:uppercase">${L(c[1])}</h3><div class="rail mt">${PLACES.filter(p => p.cat === c[0]).map(p => `
    <article class="place"><div class="ph" ${photo(p.id)}><span class="pill ${p.free ? 'free' : 'paid'}">${p.free ? L({ es: 'Gratis', en: 'Free' }) : L({ es: 'Con costo', en: 'Paid' })}</span></div>
      <div class="bd"><h3>${L(p.n)}</h3><p>${L(p.d)}</p>
      <div class="btns"><a class="btn sm red" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.q || p.lat + ',' + p.lon)}" target="_blank" rel="noopener">${L({ es: 'Cómo llegar', en: 'Directions' })}</a><button class="btn sm ghost" onclick="showOnMap('${p.id}')">${L({ es: 'En el mapa', en: 'On map' })}</button>${extra[p.id] ? `<button class="btn sm" onclick="go('${extra[p.id][0]}')">${L(extra[p.id][1])}</button>` : ''}</div></div></article>`).join('')}</div>`).join('')}`;
};


V.papers = () => `
  ${head('papers', L({ es: 'Papeles, PPT y visas', en: 'Papers, PPT & visas' }), L({ es: 'Entrar, quedarte y trabajar de forma legal en Colombia.', en: 'Entering, staying and working legally in Colombia.' }))}
  <div id="alert2"></div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Si eres venezolano: las tres vías vigentes', en: 'If you\'re Venezuelan: the three current routes' })}</h3>
    <p class="small">${L({ es: 'Migración Colombia actualizó en septiembre de 2026 las opciones de regularización. La inscripción al PPT para adultos está cerrada.', en: 'Migración Colombia updated the regularization options in September 2026. PPT registration for adults is closed.' })}</p>
    <div class="status-list mt">
      <div class="sl"><div><b>1. PPT — ${L({ es: 'Permiso por Protección Temporal', en: 'Temporary Protection Permit' })}</b><small>${L({ es: 'Sigue abierto solo para niños y adolescentes venezolanos inscritos en un colegio o en programas del ICBF. El plazo para reclamar los PPT aprobados venció el <b>4 de noviembre de 2026</b>: si no alcanzaste a recogerlo, consulta en Migración o en la Personería qué opciones te quedan.', en: 'Still open only for Venezuelan children and teens enrolled in school or ICBF programmes. The deadline to collect approved PPTs passed on <b>4 November 2026</b>: if you missed it, ask Migración or the Personería what options you have left.' })}</small></div></div>
      <div class="sl"><div><b>2. PEP Tutor</b><small>${L({ es: 'Para papás, tutores o cuidadores de menores venezolanos que tenían PPT vigente al 31 de diciembre de 2023. Se pide hasta el <b>31 de diciembre de 2026</b> (Resolución 1747 de 2026). Montería <b>no</b> está entre las 10 ciudades donde se tramita: las más cercanas son Cartagena y Barranquilla.', en: 'For parents, guardians or carers of Venezuelan minors who held a valid PPT on 31 December 2023. Apply by <b>31 December 2026</b> (Resolution 1747 of 2026). Montería is <b>not</b> one of the 10 processing cities: the nearest are Cartagena and Barranquilla.' })}</small></div></div>
      <div class="sl"><div><b>3. Visa V — ${L({ es: 'Visitante Especial', en: 'Special Visitor' })}</b><small>${L({ es: 'Para venezolanos que entraron a Colombia antes del 4 de diciembre de 2024 y cumplen las condiciones de Cancillería. Dura dos años e incluye permiso abierto de trabajo. Requiere verificación previa de Migración.', en: 'For Venezuelans who entered Colombia before 4 December 2024 and meet the Foreign Ministry\'s conditions. Valid two years with an open work permit. Requires prior verification by Migración.' })}</small></div></div>
    </div>
    <div class="note red mt">${L({ es: 'No pueden acceder quienes tienen antecedentes penales, órdenes de expulsión o deportación vigentes, o están privados de la libertad. Migración insiste: no se necesitan intermediarios.', en: 'People with criminal records, active expulsion or deportation orders, or in custody are excluded. Migración insists: no middlemen are needed.' })}</div>
    <div class="btns">${linkBtn('https://www.migracioncolombia.gov.co/', 'Migración Colombia', 'red')}${linkBtn('https://www.cancilleria.gov.co/tramites_servicios/visa', L({ es: 'Visas en Cancillería', en: 'Foreign Ministry visas' }))}${linkBtn('https://help.unhcr.org/colombia/regularizacion-para-personas-venezolanas/', L({ es: 'Guía de ACNUR', en: 'UNHCR guide' }), 'ghost')}</div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Cómo pedir el PEP Tutor paso a paso', en: 'How to apply for PEP Tutor step by step' })}</h3>
    <ol class="small mt">
      <li>${L({ es: 'Llena el Formulario Único de Trámites (FUT) en el sitio de Migración.', en: 'Fill in the Single Procedures Form (FUT) on Migración\'s site.' })}</li>
      <li>${L({ es: 'Responde la encuesta socioeconómica. Te llega un número de caso al correo.', en: 'Answer the socio-economic survey. You get a case number by email.' })}</li>
      <li>${L({ es: 'Agenda la cita presencial en el sistema de Migración.', en: 'Book the in-person appointment in Migración\'s system.' })}</li>
      <li>${L({ es: 'Lleva tu documento y la prueba del vínculo: registro de nacimiento apostillado si eres papá o mamá; sentencia, escritura o acta si eres tutor o cuidador.', en: 'Bring your ID and proof of the relationship: apostilled birth certificate if you\'re the parent; court ruling, deed or record if you\'re a guardian or carer.' })}</li>
      <li>${L({ es: 'Migración tiene 30 días para responder. Si lo aprueban, recoge el permiso a tiempo.', en: 'Migración has 30 days to reply. If approved, collect the permit on time.' })}</li>
    </ol>
  </div>
  <div class="grid g2 stack mt2">
    <div class="card reveal">
      <h3>${L({ es: 'Si vienes de visita', en: 'If you\'re visiting' })}</h3>
      <ul class="small">
        <li>${L({ es: 'La mayoría de latinoamericanos entra sin visa como turista por 90 días, prorrogables hasta 180 días en el año. Confirma tu caso en Cancillería.', en: 'Most Latin Americans enter visa-free as tourists for 90 days, extendable to 180 days a year. Confirm your case with the Foreign Ministry.' })}</li>
        <li>${L({ es: '<b>Check-MIG:</b> formulario gratuito de Migración que debes llenar antes de entrar y salir del país.', en: '<b>Check-MIG:</b> free Migración form you must fill in before entering and leaving the country.' })}</li>
        <li>${L({ es: 'Como turista <b>no puedes trabajar</b>, ni siquiera "por días".', en: 'As a tourist you <b>cannot work</b>, not even casual day jobs.' })}</li>
      </ul>
      <div class="btns">${linkBtn('https://www.migracioncolombia.gov.co/', 'Check-MIG', 'sm')}</div>
    </div>
    <div class="card reveal">
      <h3>${L({ es: 'Lo que te abre tener papeles', en: 'What papers open up for you' })}</h3>
      <ul class="small">
        <li>${L({ es: 'Trabajo formal con contrato, prima, vacaciones y cesantías.', en: 'Formal work with a contract, bonuses, holidays and severance.' })}</li>
        <li>${L({ es: 'Salud: SISBEN y afiliación a una EPS.', en: 'Health: SISBEN and joining an EPS insurer.' })}</li>
        <li>${L({ es: 'Cuenta bancaria, Nequi o Daviplata.', en: 'Bank account, Nequi or Daviplata.' })}</li>
        <li>${L({ es: 'Estudiar, convalidar títulos y hacer cursos gratis del SENA.', en: 'Study, validate diplomas and take free SENA courses.' })}</li>
        <li>${L({ es: 'Si tu hijo nació en Colombia, pregunta en la Registraduría por su registro civil y nacionalidad.', en: 'If your child was born in Colombia, ask the Registry about their birth record and nationality.' })}</li>
      </ul>
    </div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Licencia de conducción', en: 'Driving licence' })}</h3>
    <ul class="small">
      <li>${L({ es: '<b>Turista:</b> puedes manejar con la licencia vigente de tu país mientras estés como turista, máximo 6 meses. Llévala con el pasaporte.', en: '<b>Tourist:</b> you can drive on your valid home licence while you are a tourist, up to 6 months. Carry it with your passport.' })}</li>
      <li>${L({ es: '<b>Si vives aquí</b> (visa M o R, cédula de extranjería o PPT) necesitas <b>licencia colombiana</b>. Sin ella: comparendo e inmovilización del carro o la moto.', en: '<b>If you live here</b> (M or R visa, foreigner ID or PPT) you need a <b>Colombian licence</b>. Without it: a fine and the vehicle gets impounded.' })}</li>
      <li>${L({ es: '<b>Venezolanos con PPT:</b> pueden sacar licencia en las categorías A1, A2 (motos), B1 y C1. La licencia venezolana <b>no se homologa</b>: el proceso empieza de cero.', en: '<b>Venezuelans with PPT:</b> can get licences in categories A1, A2 (motorbikes), B1 and C1. Venezuelan licences are <b>not recognised</b>: you start from scratch.' })}</li>
      <li>${L({ es: '<b>Pasos:</b> inscríbete en el RUNT con tu huella, haz el curso en una escuela de conducción (CEA), el examen médico en un CRC y los exámenes teórico y práctico. Pagas y recoges en la Secretaría de Tránsito de Montería.', en: '<b>Steps:</b> register in the RUNT with your fingerprint, take the course at a driving school (CEA), the medical exam at a CRC and the theory and practical tests. Pay and collect at the Montería Transit Office.' })}</li>
      <li>${L({ es: 'Para trabajar de conductor o en domicilios en moto necesitas licencia colombiana, SOAT y técnico-mecánica al día. No compres licencias "sin examen": es delito.', en: 'To work as a driver or motorbike courier you need a Colombian licence, SOAT insurance and vehicle inspection. Never buy a licence "without tests": it is a crime.' })}</li>
    </ul>
    <p class="small muted mt">${L({ es: 'Revisado el 2 de noviembre de 2026. Fuentes: Ministerio de Transporte y RUNT.', en: 'Checked on 2 November 2026. Sources: Ministry of Transport and RUNT.' })}</p>
    <div class="btns"><a class="btn sm" href="https://www.runt.gov.co/" target="_blank" rel="noopener">RUNT</a></div>
  </div>
  <div class="sec-head"><div><h2>${L({ es: 'Oficinas', en: 'Offices' })}</h2></div></div>
  <div class="status-list">${OFFICES.map(o => `<div class="sl reveal"><div><b>${L(o.n)}</b><small>${esc(o.a)} · ${L(o.h)}</small><small><a href="${gmaps(o.a)}" target="_blank" rel="noopener">${L({ es: 'Ver en el mapa', en: 'See on map' })}</a></small></div>${o.telS ? `<a class="call ink" href="tel:${o.tel}">${L({ es: 'Llamar', en: 'Call' })}</a>` : ''}</div>`).join('')}</div>`;

V.work = () => `
  ${head('work', L({ es: 'Trabajo y salario', en: 'Work & wages' }), L({ es: 'Salario mínimo 2026 (Decreto 1469 de 2025, vigente) y jornada de 42 horas desde el 15 de julio de 2026.', en: '2026 minimum wage (Decree 1469 of 2025, in force) and 42-hour week since 15 July 2026.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">${L({ es: 'Salario mínimo', en: 'Minimum wage' })}</div><div class="big">${cop(WAGE.month)}</div><div class="sub">${L({ es: 'Mensual, antes de descuentos', en: 'Monthly, before deductions' })}</div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Con auxilio de transporte', en: 'With transport allowance' })}</div><div class="big">${cop(WAGE.total)}</div><div class="sub">${L({ es: 'Auxilio: ', en: 'Allowance: ' })}${cop(WAGE.aux)}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: 'Hora ordinaria', en: 'Ordinary hour' })}</div><div class="big">${cop(WAGE.hour)}</div><div class="sub muted" id="wage-usd">${L({ es: 'Salario ÷ 210 horas', en: 'Wage ÷ 210 hours' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Recargos (sobre la hora ordinaria)', en: 'Surcharges (on the ordinary hour)' })}</h3>
    <table class="t mt"><tr><th>${L({ es: 'Concepto', en: 'Item' })}</th><th>%</th><th>${L({ es: 'Valor hora', en: 'Hourly' })}</th></tr>
      ${[[{ es: 'Hora nocturna (7 p. m. a 6 a. m.)', en: 'Night hour (7 pm to 6 am)' }, 35], [{ es: 'Hora extra diurna', en: 'Daytime overtime' }, 25], [{ es: 'Hora extra nocturna', en: 'Night overtime' }, 75], [{ es: 'Domingo o festivo', en: 'Sunday or holiday' }, 90], [{ es: 'Extra diurna en domingo o festivo', en: 'Daytime overtime, Sunday/holiday' }, 115], [{ es: 'Extra nocturna en domingo o festivo', en: 'Night overtime, Sunday/holiday' }, 165]].map(r => `<tr><td>${L(r[0])}</td><td class="n">+${r[1]}%</td><td class="n">${cop(WAGE.hour * (1 + r[1] / 100))}</td></tr>`).join('')}
    </table>
    <p class="small muted mt">${L({ es: 'El recargo por domingo y festivo subió al 90% el 1 de julio de 2026 (Ley 2466). El auxilio de transporte no entra en la base de estos cálculos.', en: 'The Sunday/holiday surcharge rose to 90% on 1 July 2026 (Law 2466). The transport allowance isn\'t part of the base for these.' })}</p>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Calculadora de sueldo', en: 'Pay calculator' })}</h3>
    <div class="grid g3">
      <div><label class="f">${L({ es: 'Horas por semana', en: 'Hours per week' })}</label><input id="w-h" type="number" min="1" max="42" value="42" oninput="calcWage()"></div>
      <div><label class="f">${L({ es: 'Horas nocturnas por semana', en: 'Night hours per week' })}</label><input id="w-n" type="number" min="0" max="42" value="0" oninput="calcWage()"></div>
      <div><label class="f">${L({ es: 'Domingos o festivos al mes', en: 'Sundays/holidays per month' })}</label><input id="w-d" type="number" min="0" max="10" value="0" oninput="calcWage()"></div>
    </div>
    <div id="w-out" class="mt"></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Tus derechos', en: 'Your rights' })}</h3>
    <ul class="small">
      <li>${L({ es: 'Con PPT, visa o documento colombiano tienes los mismos derechos laborales que cualquier trabajador en Colombia.', en: 'With a PPT, visa or Colombian ID you have the same labour rights as any worker in Colombia.' })}</li>
      <li>${L({ es: 'Si ganas hasta dos salarios mínimos te deben pagar el auxilio de transporte.', en: 'If you earn up to two minimum wages you must get the transport allowance.' })}</li>
      <li>${L({ es: 'Te descuentan 4% para salud y 4% para pensión; el empleador paga su parte y te afilia a riesgos laborales (ARL).', en: '4% for health and 4% for pension come off your pay; the employer pays its share and enrols you in workplace-risk insurance (ARL).' })}</li>
      <li>${L({ es: 'Pide contrato por escrito y desprendible de pago. Guarda fotos de todo.', en: 'Ask for a written contract and payslips. Keep photos of everything.' })}</li>
      <li>${L({ es: 'Sectores con más trabajo en Montería: comercio, ganadería y agroindustria, construcción, salud, restaurantes y hoteles, domicilios y servicios domésticos. En junio, la Feria de la Ganadería abre miles de empleos temporales. Hablar inglés te abre puertas en turismo y atención al cliente.', en: 'Sectors with most work in Montería: retail, cattle and agribusiness, construction, health, restaurants and hotels, delivery and domestic work. In June the Cattle Fair opens thousands of temporary jobs. English opens doors in tourism and customer service.' })}</li>
      <li>${L({ es: 'Busca vacantes en el Servicio Público de Empleo y en la Agencia de Empleo del SENA, y haz cursos gratis del SENA.', en: 'Find jobs at the Public Employment Service and the SENA Jobs Agency, and take free SENA courses.' })}</li>
    </ul>
    <div class="btns">${linkBtn('https://www.serviciodeempleo.gov.co/', L({ es: 'Servicio de Empleo', en: 'Employment Service' }), 'sm red')}${linkBtn('https://agenciapublicadeempleo.sena.edu.co/', L({ es: 'Agencia de Empleo SENA', en: 'SENA Jobs Agency' }), 'sm')}</div>
  </div>`;

function featureView(id, data, o) {
  return `${head(id, L(o.title), L(o.sub))}
  <div class="hero" style="min-height:260px" ${photo(o.ph)}><div class="in"><span class="kicker">${L(o.kicker)}</span><h1 style="font-size:2.3rem">${L(o.h1)}</h1><p>${L(o.p)}</p></div></div>
  <div class="card reveal"><h3>${L({ es: 'Qué es', en: 'What it is' })}</h3><ul class="small">${data.what.map(x => `<li>${L(x)}</li>`).join('')}</ul></div>
  ${o.extra || ''}
  <div class="sec-head"><div><h2>${L({ es: 'Qué hacer', en: 'What to do' })}</h2><p>${L({ es: 'Desliza para ver más.', en: 'Swipe for more.' })}</p></div></div>
  <div class="rail">${data.doit.map(d => `<article class="place"><div class="ph" ${photo(d[2])}></div><div class="bd"><h3>${L(d[0])}</h3><p>${L(d[1])}</p></div></article>`).join('')}</div>
  <div class="sec-head"><div><h2>${L(o.tipsT)}</h2></div></div>
  <div class="status-list">${data.tips.map((t, i) => `<div class="sl reveal"><div>${num(L(t), i)}</div></div>`).join('')}</div>
  ${vidRail(id)}
  <div class="btns mt2"><button class="btn red" onclick="showOnMap('${o.mapId}')">${L({ es: 'Ver en el mapa', en: 'See on map' })}</button><a class="btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent(o.yt)}" target="_blank" rel="noopener">${L({ es: 'Más en YouTube', en: 'More on YouTube' })}</a></div>`;
}
V.centro = () => featureView('centro', GS, {
  title: { es: 'El centro y el río', en: 'Downtown & the river' }, sub: { es: 'La Montería de la catedral, los planchones y el nuevo Businú.', en: 'The Montería of the cathedral, the river ferries and the new Businú.' },
  ph: 'planchones', kicker: { es: 'Montería', en: 'Montería' }, h1: { es: 'El centro y el río Sinú', en: 'Downtown & the Sinú River' },
  p: { es: 'La ciudad nació mirando al río y todavía lo cruza en planchón.', en: 'The city was born facing the river and still crosses it by ferry.' },
  tipsT: { es: 'Consejos de latino a latino', en: 'Tips from Latinos to Latinos' }, mapId: 'catedral', yt: 'planchones río Sinú Montería'
});
V.ronda = () => featureView('ronda', ML, {
  title: { es: 'Ronda del Sinú', en: 'Ronda del Sinú' }, sub: { es: 'El plan gratis de Montería, a la orilla del río Sinú.', en: 'Montería\'s free plan, on the banks of the Sinú River.' },
  ph: 'ronda', kicker: { es: 'Imperdible', en: 'Must-see' }, h1: { es: 'Ronda del Sinú', en: 'Ronda del Sinú' },
  p: { es: 'Senderos, ciclorruta, iguanas, perezosos y atardeceres sobre el río.', en: 'Paths, bike lanes, iguanas, sloths and sunsets over the river.' },
  tipsT: { es: 'Consejos para ir', en: 'Tips for going' }, mapId: 'ronda', yt: 'Ronda del Sinú Montería'
});
V.costa = () => featureView('costa', IS, {
  title: { es: 'Lorica y el mar de Córdoba', en: 'Lorica & Córdoba\'s coast' }, sub: { es: 'Paseos de un día río abajo y hasta el mar Caribe.', en: 'Day trips down the river and out to the Caribbean.' },
  ph: 'lorica', kicker: { es: 'Paseo de un día', en: 'Day trip' }, h1: { es: 'Del Sinú al mar', en: 'From the Sinú to the sea' },
  p: { es: 'Lorica, los manglares de Cispatá, la playa de Coveñas y los sombreros de Tuchín.', en: 'Lorica, the Cispatá mangroves, Coveñas beach and the hats of Tuchín.' },
  tipsT: { es: 'Antes de ir', en: 'Before you go' }, mapId: 'lorica', yt: 'Santa Cruz de Lorica Córdoba'
});

V.move = () => `
  ${head('move', L({ es: 'Transporte', en: 'Getting around' }), L({ es: 'Cómo moverte por Montería sin que te cobren de más.', en: 'How to get around Montería without being overcharged.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">${L({ es: 'Bus o buseta 2026', en: '2026 bus fare' })}</div><div class="big">${cop(BUS)}</div><div class="sub">${L({ es: 'Por trayecto, en toda la ciudad', en: 'Per ride, anywhere in the city' })}</div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Al mes (2 viajes al día)', en: 'Per month (2 rides a day)' })}</div><div class="big">${cop(BUS * 2 * 26)}</div><div class="sub">${L({ es: '26 días de trabajo', en: '26 working days' })}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: 'Auxilio de transporte', en: 'Transport allowance' })}</div><div class="big">${cop(WAGE.aux)}</div><div class="sub muted">${L({ es: 'Si ganas hasta 2 mínimos', en: 'If you earn up to 2 minimums' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Buses y busetas', en: 'Buses and minibuses' })}</h3>
    <ul class="small">
      <li>${L({ es: 'Desde enero de 2026 el pasaje del transporte urbano colectivo cuesta $3.500 por trayecto. Lo fijó la Alcaldía de Montería.', en: 'Since January 2026 the urban bus fare is COP 3,500 per ride, set by Montería city hall.' })}</li>
      <li>${L({ es: 'Se paga en efectivo al subir: lleva billetes pequeños y monedas.', en: 'You pay cash when you board: carry small notes and coins.' })}</li>
      <li>${L({ es: 'Los estudiantes pueden pedir la tarifa diferencial de la Alcaldía cuando abren convocatoria. Pregunta en el colegio o la universidad.', en: 'Students can apply for the city\'s reduced fare when applications open. Ask at the school or university.' })}</li>
    </ul>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Businú: el bus por el río', en: 'Businú: the river bus' })}</h3>
    <ul class="small">
      <li>${L({ es: 'Es el primer transporte público fluvial de Colombia. Funciona desde diciembre de 2025 con dos embarcaciones, Betancí y Yapel, para 36 personas y bicicletas.', en: 'It\'s Colombia\'s first public river transport. Running since December 2025 with two boats, Betancí and Yapel, for 36 people plus bicycles.' })}</li>
      <li>${L({ es: 'Para entre los embarcaderos de Rancho Grande, Calle 22 y Centro Verde. Sirve sobre todo a quienes viven en la margen izquierda del río.', en: 'It stops at the Rancho Grande, Calle 22 and Centro Verde piers, mainly serving people on the river\'s left bank.' })}</li>
      <li>${L({ es: 'La tarifa se anunció similar a la del bus. Confirma precio y horario en el embarcadero: si el río crece, el servicio se puede suspender.', en: 'The fare was announced as similar to the bus. Confirm price and times at the pier: if the river rises, service may be suspended.' })}</li>
    </ul>
  </div>
  <div class="grid g2 stack mt2">
    <div class="card reveal"><h3>${L({ es: 'Mototaxi', en: 'Moto-taxis' })}</h3><p class="small">${L({ es: 'En Montería el mototaxi está en todas partes y es rápido, pero es informal y sin seguro. Exige casco, acuerda el precio antes y evita las vías rápidas y la noche.', en: 'In Montería moto-taxis are everywhere and quick, but informal and uninsured. Insist on a helmet, agree the price first and avoid fast roads and night rides.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'Taxis y aplicaciones', en: 'Taxis and apps' })}</h3><p class="small">${L({ es: 'Pregunta y acuerda el precio antes de subir. De noche se cobra un recargo y es más seguro pedir el carro por aplicación o por teléfono.', en: 'Ask and agree the price before getting in. A night surcharge applies, and at night it\'s safer to book by app or phone.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'Planchones', en: 'Planchones (river ferries)' })}</h3><p class="small">${L({ es: 'Cruzan el río de orilla a orilla, empujados por la corriente y sujetos a un cable. Son baratos y rápidos; si el río está crecido, se suspenden.', en: 'They cross the river from bank to bank, pushed by the current along a cable. Cheap and quick; suspended when the river is high.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'Buses a otras ciudades y aeropuerto', en: 'Intercity buses and airport' })}</h3><p class="small">${L({ es: 'De la Terminal de Transporte salen buses a Cartagena, Sincelejo, Barranquilla, Medellín, Caucasia, el Urabá y los pueblos de Córdoba. El aeropuerto Los Garzones queda al norte, con vuelos a Bogotá y Medellín.', en: 'The bus terminal has buses to Cartagena, Sincelejo, Barranquilla, Medellín, Caucasia, Urabá and the towns of Córdoba. Los Garzones airport is in the north, with flights to Bogotá and Medellín.' })}</p></div>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: '¿Cómo llego?', en: 'How do I get there?' })}</h3>
    <label class="f">${L({ es: 'Destino', en: 'Destination' })}</label>
    <div class="row"><input id="j-to" placeholder="${L({ es: 'Ej: Ronda del Sinú, Catedral, Terminal', en: 'E.g. Ronda del Sinú, Cathedral, Terminal' })}"><button class="btn red" onclick="planTrip()">${L({ es: 'Buscar', en: 'Go' })}</button></div>
    <p class="small muted mt">${L({ es: 'Abre Google Maps con la ruta desde donde estás.', en: 'Opens Google Maps with a route from where you are.' })}</p>
  </div>`;

V.health = () => `
  ${head('health', L({ es: 'Salud', en: 'Health' }), L({ es: 'Dónde ir según lo que te pase.', en: 'Where to go depending on what happens.' }))}
  <div class="sosgrid">
    <a class="sosbtn" href="tel:123"><strong>123</strong><span>${L({ es: 'Emergencias', en: 'Emergencies' })}</span><small>${L({ es: 'Si es grave, llama ya', en: 'If serious, call now' })}</small></a>
    <a class="sosbtn ink" href="tel:132"><strong>132</strong><span>${L({ es: 'Cruz Roja', en: 'Red Cross' })}</span><small>${L({ es: 'Ambulancia', en: 'Ambulance' })}</small></a>
  </div>
  <div class="note red mt2">${L({ es: '<b>En urgencias te tienen que atender</b>, aunque no tengas papeles, EPS ni plata. La atención inicial de urgencias es obligatoria en Colombia.', en: '<b>The ER must treat you</b>, even without papers, insurance or money. Initial emergency care is mandatory in Colombia.' })}</div>
  <div class="status-list mt2">
    <div class="sl reveal"><div><b>E.S.E. Hospital San Jerónimo de Montería</b><small>${L({ es: 'El hospital público de mayor complejidad de Córdoba, con urgencias.', en: 'Córdoba\'s main public tertiary hospital, with an ER.' })}</small></div><a class="call" href="${gmaps('ESE Hospital San Jerónimo de Montería')}" target="_blank" rel="noopener">${L({ es: 'Mapa', en: 'Map' })}</a></div>
    <div class="sl reveal"><div><b>E.S.E. Vidasinú</b><small>${L({ es: 'La red pública de salud de Montería: 5 hospitales, centros de salud urbanos y rurales, consulta, vacunas, partos y urgencias.', en: 'Montería\'s public health network: 5 hospitals, urban and rural health centres, check-ups, vaccines, births and ER.' })}</small></div><a class="call ink" href="${gmaps('ESE Vidasinú Montería')}" target="_blank" rel="noopener">${L({ es: 'Mapa', en: 'Map' })}</a></div>
  </div>
  <div class="note mt2">${L({ es: 'Ojo con las estafas: Vidasinú advierte que nunca pide plata ni favores para dar empleo ni citas.', en: 'Beware of scams: Vidasinú warns it never asks for money or favours in exchange for jobs or appointments.' })}</div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Cómo afiliarte a salud', en: 'How to get health cover' })}</h3>
    <ol class="small">
      <li>${L({ es: 'Con PPT, visa o cédula pide la <b>encuesta del SISBEN</b> en la Alcaldía.', en: 'With a PPT, visa or Colombian ID, request the <b>SISBEN survey</b> from the city.' })}</li>
      <li>${L({ es: 'Si quedas clasificado, te afilias a una EPS del régimen subsidiado sin pagar.', en: 'If you qualify, you join a subsidised EPS insurer at no cost.' })}</li>
      <li>${L({ es: 'Si tienes contrato de trabajo, el empleador te afilia a una EPS del régimen contributivo.', en: 'If you have a job contract, your employer enrols you in a contributory EPS.' })}</li>
      <li>${L({ es: 'Las vacunas del esquema nacional son gratis para todos los niños, tengan o no papeles.', en: 'National-schedule vaccines are free for all children, with or without papers.' })}</li>
    </ol>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Ojo en temporada de lluvias', en: 'Watch out in rainy season' })}</h3><p class="small">${L({ es: 'Con las lluvias y después de las inundaciones aumentan el dengue y las enfermedades del agua. Elimina agua estancada, usa repelente, toma agua tratada y, si tienes fiebre alta con dolor de cuerpo, ve al médico y no tomes ibuprofeno ni aspirina sin indicación.', en: 'Dengue and water-borne illness rise with the rains and after floods. Get rid of standing water, use repellent, drink treated water and, with high fever and body aches, see a doctor and don\'t take ibuprofen or aspirin unless told to.' })}</p></div>`;

V.weather = () => `
  ${head('weather', L({ es: 'Clima y festivos', en: 'Weather & holidays' }), L({ es: 'Calor todo el año. La temporada seca va de diciembre a marzo y llueve más entre abril y noviembre.', en: 'Hot all year. The dry season runs December to March and it rains most April to November.' }))}
  <div class="card dark"><div class="small" style="opacity:.75">${L({ es: 'Pronóstico en Montería', en: 'Montería forecast' })}</div><div class="big" id="wx-now2" style="font-family:'Barlow Condensed';font-size:2.4rem;font-weight:800"><span class="spin"></span></div><div class="days" id="wx-days"></div></div>
  <div class="note mt2">${L({ es: 'En febrero de 2026, en plena temporada seca, un frente frío trajo lluvias récord: el Sinú se desbordó y unas 50.000 personas resultaron afectadas en Montería. Sigue las alertas de la Alcaldía y de la CVS cuando llueva fuerte.', en: 'In February 2026, in the middle of the dry season, a cold front brought record rain: the Sinú overflowed and about 50,000 people in Montería were affected. Follow city and CVS alerts in heavy rain.' })}</div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Qué empacar', en: 'What to pack' })}</h3><ul class="small">
    <li>${L({ es: 'Ropa fresca de algodón o lino; temperaturas de unos 24 a 34 °C y mucha humedad.', en: 'Light cotton or linen clothes; temperatures around 24 to 34 °C and high humidity.' })}</li>
    <li>${L({ es: 'Bloqueador alto, gafas de sol, gorra o sombrero, repelente y botella de agua.', en: 'High-SPF sunscreen, sunglasses, a cap or hat, repellent and a water bottle.' })}</li>
    <li>${L({ es: 'Sombrilla o capa para los aguaceros de la tarde.', en: 'An umbrella or poncho for afternoon downpours.' })}</li>
    <li>${L({ es: 'Una muda formal para entrevistas y citas en Migración.', en: 'One smart outfit for interviews and Migración appointments.' })}</li>
    <li>${L({ es: 'Documentos apostillados (nacimiento, antecedentes, títulos) si vas a hacer trámites.', en: 'Apostilled documents (birth, police record, diplomas) if you\'ll do paperwork.' })}</li>
  </ul></div>
  <div class="sec-head"><div><h2>${L({ es: 'Festivos', en: 'Public holidays' })}</h2><p id="next-hol"></p></div></div>
  <div class="status-list" id="hol-list"></div>
  <p class="small muted mt">${L({ es: 'En Colombia muchos festivos se pasan al lunes (Ley Emiliani). El lunes 16 de noviembre de 2026 es festivo en todo el país.', en: 'In Colombia many holidays move to Monday (Emiliani Law). Monday 16 November 2026 is a nationwide holiday.' })}</p>`;

V.map = () => `
  ${head('map', L({ es: 'Mapa de Montería', en: 'Map of Montería' }), L({ es: 'Toca un punto para ver detalles y la ruta.', en: 'Tap a point for details and directions.' }))}
  <div class="chips" id="map-chips">
    ${[['all', { es: 'Todo', en: 'All' }], ['city', { es: 'Ciudad', en: 'City' }], ['beach', { es: 'Río Sinú', en: 'Sinú River' }], ['nature', { es: 'Paseos', en: 'Day trips' }], ['help', { es: 'Salud y trámites', en: 'Health & offices' }]].map((c, i) => `<button data-c="${c[0]}" class="${i ? '' : 'on'}" onclick="mapFilter('${c[0]}')">${L(c[1])}</button>`).join('')}
  </div>
  <div id="map"></div>
  <div class="btns"><button class="btn red sm" onclick="locateMe()">${L({ es: 'Dónde estoy', en: 'Where am I' })}</button><a class="btn sm ghost" href="${gmaps('Montería, Córdoba, Colombia')}" target="_blank" rel="noopener">${L({ es: 'Abrir en Google Maps', en: 'Open in Google Maps' })}</a></div>`;

V.media = () => `
  ${head('media', L({ es: 'Fotos y videos', en: 'Photos & videos' }), L({ es: 'Fotos reales de Wikimedia Commons. Toca una para ver ese lugar en el mapa.', en: 'Real photos from Wikimedia Commons. Tap one to see that place on the map.' }))}
  <div class="gal">${PLACES.map(p => `<figure ${photo(p.id)} onclick="showOnMap('${p.id}')"><figcaption>${L(p.n)}</figcaption></figure>`).join('')}
    <figure ${photo('sinu')} onclick="go('ronda')"><figcaption>${L({ es: 'Río Sinú', en: 'Sinú River' })}</figcaption></figure>
    <figure ${photo('vueltiao')} onclick="go('costa')"><figcaption>${L({ es: 'Sombrero vueltiao', en: 'Sombrero vueltiao' })}</figcaption></figure>
    <figure ${photo('cebu')} onclick="go('feria')"><figcaption>${L({ es: 'Ganado cebú', en: 'Zebu cattle' })}</figcaption></figure>
    <figure ${photo('iguana')} onclick="go('ronda')"><figcaption>${L({ es: 'Iguanas de la Ronda', en: 'Ronda iguanas' })}</figcaption></figure>
    <figure ${photo('mote')}><figcaption>${L({ es: 'Mote de queso', en: 'Mote de queso' })}</figcaption></figure>
    <figure ${photo('bocachico')}><figcaption>Bocachico</figcaption></figure></div>
  <div class="sec-head"><div><h2>${L({ es: 'Videos nuevos', en: 'New videos' })}</h2><p id="rv-note">${L({ es: 'El robot los busca en YouTube cada 30 minutos.', en: 'The robot looks for them on YouTube every 30 minutes.' })}</p></div></div>
  <div class="vids" id="robot-vids"></div>
  <div class="sec-head"><div><h2>${L({ es: 'Videos de Montería', en: 'Montería videos' })}</h2><p>${L({ es: 'Toca uno para verlo aquí mismo.', en: 'Tap one to watch it right here.' })}</p></div></div>
  <div class="vids">${VIDEO_LIB.map(vidCard).join('')}</div>
  <div class="btns mt2"><a class="btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent('Montería Córdoba')}" target="_blank" rel="noopener">${L({ es: 'Más en YouTube', en: 'More on YouTube' })}</a></div>`;


V.sos = () => `
  ${head('sos', 'SOS', L({ es: 'Toca un número para llamar.', en: 'Tap a number to call.' }))}
  <div class="sosgrid">${EMERG.map(e => `<a class="sosbtn ${e.cls}" href="tel:${e.n}"><strong>${e.n}</strong><span>${L(e.t)}</span><small>${L(e.s)}</small></a>`).join('')}</div>
  <div class="sec-head"><div><h2>${L({ es: 'Ayuda y oficinas', en: 'Help & offices' })}</h2></div></div>
  <div class="status-list">${OFFICES.filter(o => o.telS).map(o => `<div class="sl"><div><b>${L(o.n)}</b><small>${esc(o.telS)}</small></div><a class="call ink" href="tel:${o.tel}">${L({ es: 'Llamar', en: 'Call' })}</a></div>`).join('')}
    <div class="sl"><div><b>${L({ es: 'Fiscalía (denuncias)', en: 'Attorney General (crime reports)' })}</b><small>122</small></div><a class="call ink" href="tel:122">${L({ es: 'Llamar', en: 'Call' })}</a></div>
  </div>
  <div class="note mt2">${L({ es: 'Si eres de otro país, busca el consulado de tu país en Colombia en la web de tu cancillería y guárdalo en tus contactos.', en: 'If you\'re from another country, find your consulate in Colombia on your foreign ministry\'s site and save it to your contacts.' })}</div>
  <div class="btns"><button class="btn red block" onclick="openShow()">${L({ es: 'Me perdí: mostrar mi dirección', en: 'I\'m lost: show my address' })}</button></div>`;

let talkTab = 'cos';
V.talk = () => `
  ${head('talk', L({ es: 'Hablar costeño', en: 'Speak costeño' }), L({ es: 'En Montería se habla español costeño sabanero, con su propio sabor. Y para trabajar en turismo y atención al cliente, el inglés vale oro. Toca "Oír" para escuchar.', en: 'Montería speaks coastal "sabanero" Spanish, with its own flavour. And for tourism and customer-service jobs, English is gold. Tap "Hear" to listen.' }))}
  <div class="tabsx" id="talk-tabs">
    <button data-k="cos" onclick="setTalk('cos')">${L({ es: 'Costeño', en: 'Costeño' })}</button>
    <button data-k="dlg" onclick="setTalk('dlg')">${L({ es: 'Conversaciones', en: 'Dialogues' })}</button>
    <button data-k="ve" onclick="setTalk('ve')">${L({ es: 'De Venezuela a Colombia', en: 'Venezuela to Colombia' })}</button>
    <button data-k="en" onclick="setTalk('en')">${L({ es: 'Inglés para trabajar', en: 'English for work' })}</button>
  </div>
  <div id="talk-body"></div>`;
function talkBody() {
  const q = s => JSON.stringify(s).replace(/"/g, '&quot;');
  if (talkTab === 'cos') return `<div class="phr">${COSTENO.map(p => `<div class="ph1"><div><div class="o">${esc(p[0])}</div><div class="tr">${esc(LANG === 'es' ? p[1] : p[2])}</div><div class="say">"${esc(p[3])}"</div></div><button onclick="say(${q(p[3])},'es')">${L({ es: 'Oír', en: 'Hear' })}</button></div>`).join('')}</div>`;
  if (talkTab === 've') return `<p class="small muted mt">${L({ es: 'Palabras que cambian de un país a otro. Así te entienden más rápido.', en: 'Words that change from one country to the other. People will get you faster.' })}</p><div class="status-list mt">${VECO.map(p => `<div class="sl"><div><b>${esc(p[0])}</b><small>${L({ es: 'En Venezuela', en: 'In Venezuela' })}</small></div><div style="text-align:right"><b>${esc(p[1])}</b><small>${LANG === 'en' ? esc(p[2]) : L({ es: 'En Colombia', en: '' })}</small></div></div>`).join('')}</div>`;
  if (talkTab === 'en') return `<div class="phr">${ENG.map(p => `<div class="ph1"><div><div class="o">${esc(p[0])}</div><div class="tr">${esc(p[1])}</div><div class="say">${esc(p[2])}</div></div><button onclick="say(${q(p[0])},'en')">${L({ es: 'Oír', en: 'Hear' })}</button></div>`).join('')}</div><p class="small muted mt">${L({ es: 'La pronunciación es aproximada; la sílaba en mayúscula es la fuerte.', en: 'Pronunciation is approximate; the capitalised syllable is stressed.' })}</p>`;
  return DIALOGS.map(d => `<div class="card mt reveal in"><h3>${L(d.t)}</h3>${d.l.map(x => `<div class="dlg ${x[0]}">${esc(x[1])}${LANG === 'en' ? `<em>${esc(x[2])}</em>` : ''}</div>`).join('')}</div>`).join('');
}
function setTalk(k) { talkTab = k; const b = $('#talk-body'); if (b) b.innerHTML = talkBody(); $$('#talk-tabs button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); }
function say(text, lang) {
  if (!('speechSynthesis' in window)) { toast(L({ es: 'Tu celular no tiene voz disponible', en: 'No voice available on this device' })); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'en' ? 'en-US' : 'es-CO'; u.rate = .9;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}

V.money = () => `
  ${head('money', L({ es: 'Peso colombiano y cambio', en: 'Colombian peso & exchange' }), L({ es: 'En Colombia se paga en pesos (COP). Precios con punto de miles: $3.900 son tres mil novecientos pesos.', en: 'Colombia pays in pesos (COP). Prices use a dot for thousands: $3.900 means three thousand nine hundred pesos.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">${L({ es: '1 dólar (USD)', en: '1 US dollar' })}</div><div class="big" id="fx-usd2"><span class="spin"></span></div><div class="sub" id="fx-sub2"></div></div>
    <div class="lc sea"><div class="lab">${L({ es: '1 euro (EUR)', en: '1 euro' })}</div><div class="big" id="fx-eur"><span class="spin"></span></div><div class="sub">${L({ es: 'Tasa del día', en: 'Today\'s rate' })}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: '100 bolívares (VES)', en: '100 bolívars (VES)' })}</div><div class="big" id="fx-ves"><span class="spin"></span></div><div class="sub muted">${L({ es: 'Tasa de referencia', en: 'Reference rate' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Convertidor', en: 'Converter' })}</h3>
    <div class="grid g2"><div><label class="f">${L({ es: 'Cantidad', en: 'Amount' })}</label><input id="fx-amt" type="number" value="100000" min="0" oninput="convert()"></div>
    <div><label class="f">${L({ es: 'Moneda', en: 'Currency' })}</label><select id="fx-from" onchange="convert()"><option value="COP">${L({ es: 'Peso colombiano (COP)', en: 'Colombian peso (COP)' })}</option><option value="USD">${L({ es: 'Dólar (USD)', en: 'US dollar (USD)' })}</option><option value="EUR">Euro (EUR)</option><option value="VES">${L({ es: 'Bolívar (VES)', en: 'Bolívar (VES)' })}</option></select></div></div>
    <div id="fx-out" class="mt"></div>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Consejos', en: 'Tips' })}</h3><ul class="small">
    <li>${L({ es: 'Cambia dinero solo en casas de cambio autorizadas o bancos, nunca con cambistas en la calle.', en: 'Change money only at authorised exchange houses or banks, never with street changers.' })}</li>
    <li>${L({ es: 'Revisa los billetes de $50.000 y $100.000: hay falsos. Mira la marca de agua y el hilo de seguridad.', en: 'Check COP 50,000 and 100,000 notes: fakes circulate. Look at the watermark and security thread.' })}</li>
    <li>${L({ es: 'Nequi y Daviplata abren cuenta con PPT desde el celular y sirven para cobrar, pagar y enviar plata.', en: 'Nequi and Daviplata open accounts with a PPT from your phone, to get paid, pay and send money.' })}</li>
    <li>${L({ es: 'Para enviar plata a tu país compara comisiones y tasa entre agencias de giros y apps antes de mandar.', en: 'To send money home, compare fees and rates between remittance agencies and apps first.' })}</li>
    <li>${L({ es: 'En playas y en el centro algunos venden en dólares a turistas, pero tú paga en pesos: casi siempre sale más barato.', en: 'At beaches and downtown some sell to tourists in dollars, but you pay in pesos: it\'s almost always cheaper.' })}</li>
  </ul></div>`;

let lifeTab = 'housing';
V.life = () => `
  ${head('life', L({ es: 'Vivir en Montería', en: 'Living in Montería' }), L({ es: 'Lo que nadie te cuenta al llegar.', en: 'What nobody tells you when you arrive.' }))}
  <div class="tabsx" id="life-tabs">${Object.keys(LIFE).map(k => `<button data-k="${k}" onclick="setLife('${k}')">${L(LIFE[k].t)}</button>`).join('')}</div>
  <div id="life-body" class="mt"></div>
  ${vidRail('vida')}`;
function lifeBody() {
  const x = LIFE[lifeTab];
  return `<div class="hero" style="min-height:190px" ${photo(x.ph)}><div class="in"><h1 style="font-size:2rem">${L(x.t)}</h1></div></div>
  <div class="status-list">${x.items.map((it, i) => `<div class="sl"><div>${num(L(it), i)}</div></div>`).join('')}</div>`;
}
function setLife(k) { lifeTab = k; const b = $('#life-body'); if (b) { b.innerHTML = lifeBody(); paintPhotos(b); } $$('#life-tabs button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); }


V.first = () => `
  ${head('first', L({ es: 'Primeros días', en: 'First days' }), L({ es: 'Marca cada paso. Tu avance se guarda en el celular.', en: 'Tick each step. Your progress is saved on your phone.' }))}
  <div class="progress"><i id="chk-bar"></i></div><p class="small muted mt" id="chk-txt"></p>
  <div class="status-list mt">${FIRST.map((f, i) => { const x = L(f); return `<label class="chk" id="chk-${i}"><input type="checkbox" onchange="tick(${i},this.checked)"><div><b>${esc(x[0])}</b><div class="small muted">${esc(x[1])}</div></div></label>`; }).join('')}</div>`;


/* ---------- Videos (reproductor dentro de la app) ---------- */
const ytThumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
function vidCard(v) {
  const title = typeof v.t === 'object' ? L(v.t) : (v.titulo || '');
  const sub = v.canal ? esc(v.canal) + (v.hace ? ' · ' + esc(v.hace) : '') : 'YouTube';
  return `<button class="vid" style="--fb:#111;background-image:url('${ytThumb(v.id)}')" onclick="playVideo('${v.id}')"><span class="playc"></span><div><b>${esc(title)}</b><small>${sub}</small></div></button>`;
}
function vidRail(k) {
  const vs = VIDEO_LIB.filter(v => v.k === k); if (!vs.length) return '';
  return `<div class="sec-head"><div><h2>${L({ es: 'Videos', en: 'Videos' })}</h2><p>${L({ es: 'Toca uno para verlo aquí mismo.', en: 'Tap one to watch it right here.' })}</p></div></div><div class="vids">${vs.map(vidCard).join('')}</div>`;
}
function videoOfDay() { const n = Math.floor(new Date(todayISO() + 'T00:00:00Z') / 864e5); return VIDEO_LIB[n % VIDEO_LIB.length]; }
function playVideo(id) {
  const m = $('#player'); if (!m) return;
  $('#player-frame').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1" title="YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  $('#player-yt').href = 'https://www.youtube.com/watch?v=' + id;
  m.classList.add('on');
}
function closeVideo() { const m = $('#player'); if (!m) return; m.classList.remove('on'); $('#player-frame').innerHTML = ''; }

/* ---------- Noticias y videos del robot (GitHub Actions cada 30 min) ---------- */
let NEWS = store.get('news', null), RVIDS = store.get('rvids', null);
function ago(iso) {
  if (!iso) return '';
  const m = Math.max(0, Math.round((Date.now() - new Date(iso)) / 6e4));
  if (m < 60) return L({ es: 'hace ' + m + ' min', en: m + ' min ago' });
  const h = Math.round(m / 60); if (h < 48) return L({ es: 'hace ' + h + ' h', en: h + ' h ago' });
  return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { day: 'numeric', month: 'short', timeZone: ZONE }).format(new Date(iso));
}
function paintNews() {
  const box = $('#news-list'); if (!box) return;
  const list = (NEWS && NEWS.noticias || []).slice(0, 6);
  box.innerHTML = list.length ? list.map(n => `<a class="sl" href="${esc(n.enlace)}" target="_blank" rel="noopener" style="color:inherit"><div><b>${esc(n.titulo)}</b><small>${esc(n.medio)} · ${ago(n.fecha)}</small></div></a>`).join('')
    : `<div class="sl"><div><small>${L({ es: 'Sin noticias por ahora. Toca Actualizar.', en: 'No news yet. Tap Refresh.' })}</small></div></div>`;
  const meta = $('#news-meta'); if (meta) meta.textContent = NEWS && NEWS.revisado ? L({ es: 'El robot revisó las noticias ', en: 'The robot checked the news ' }) + ago(NEWS.revisado) + L({ es: ' · hora Colombia', en: ' · Colombia time' }) : '';
}
function paintRobotVids() {
  const box = $('#robot-vids'); if (!box) return;
  const vs = (RVIDS && RVIDS.videos || []).slice(0, 8);
  box.innerHTML = vs.length ? vs.map(vidCard).join('') : `<p class="small muted">${L({ es: 'El robot todavía no ha traído videos nuevos. Mira los de abajo.', en: 'The robot hasn\'t brought new videos yet. See the ones below.' })}</p>`;
}
async function loadNews(manual) {
  if (manual) { const b = $('#news-list'); if (b) b.innerHTML = '<div class="sl"><span class="spin"></span></div>'; }
  try { NEWS = await getJSON('data/noticias.json?v=' + Date.now()); store.set('news', NEWS); } catch (e) {}
  paintNews(); buildTicker();
  if (manual) toast(L({ es: 'Noticias al día', en: 'News updated' }));
}
async function loadRobotVids() {
  try { RVIDS = await getJSON('data/videos.json?v=' + Date.now()); store.set('rvids', RVIDS); } catch (e) {}
  paintRobotVids();
}

/* ---------- Render y navegación ---------- */
const VIEWS = ['home', 'papers', 'work', 'feria', 'ronda', 'centro', 'costa', 'places', 'move', 'health', 'sos', 'talk', 'money', 'life', 'weather', 'first', 'map', 'media'];
let current = 'home';
function render() {
  document.documentElement.lang = LANG;
  $$('[data-t]').forEach(el => { const k = el.dataset.t; if (T[k]) el.textContent = L(T[k]); });
  $('#lang-es').classList.toggle('on', LANG === 'es'); $('#lang-en').classList.toggle('on', LANG === 'en');
  $('#main').innerHTML = VIEWS.map(v => `<section class="view ${v === current ? 'on' : ''}" id="v-${v}">${V[v]()}</section>`).join('');
  $('#upd').textContent = VERIFIED + ' · ' + L({ es: 'hora Colombia', en: 'Colombia time' });
  setTalk(talkTab); setLife(lifeTab); paintNews(); paintRobotVids(); renderAlert(); renderHolidays(); renderFiestas(); restoreChecks(); calcWage(); renderCities();
  if (WX) paintWeather(); paintFX();
  tickClock(); buildTicker(); observeReveal(); paintPhotos();
  map = null; if (current === 'map') setTimeout(initMap, 50);
}
function go(v) {
  if (!VIEWS.includes(v)) v = 'home';
  current = v;
  $$('section.view').forEach(s => s.classList.toggle('on', s.id === 'v-' + v));
  $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  if (location.hash.slice(1) !== v) history.replaceState(null, '', v === 'home' ? location.pathname : '#' + v);
  window.scrollTo(0, 0);
  if (v === 'map') setTimeout(initMap, 60);
  observeReveal();
}
function setLang(l) { LANG = l; store.set('lang', l); render(); }
function observeReveal() {
  const els = $$('.view.on .reveal:not(.in)');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .08 });
  els.forEach(e => io.observe(e));
}

/* ---------- Hero en movimiento ---------- */
const HERO = ['ronda', 'catedral', 'sinu', 'feria', 'planchones', 'lorica', 'vueltiao', 'monteria'];
let heroI = 0, heroTimer = null;
function heroSetup() {
  const h = $('#hero'); if (!h) return;
  const ready = HERO.filter(k => PHOTO_CACHE[k]);
  if (!ready.length || h.dataset.n == ready.length) return;
  h.dataset.n = ready.length;
  $$('.slide', h).forEach(s => s.remove());
  ready.forEach((k, i) => { const s = document.createElement('div'); s.className = 'slide' + (i === 0 ? ' on' : ''); s.style.backgroundImage = `url("${PHOTO_CACHE[k]}")`; s.dataset.k = k; h.prepend(s); });
  $('#hero-dots').innerHTML = ready.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('');
  heroI = 0; heroCaption(ready[0]);
  clearInterval(heroTimer);
  if (ready.length > 1) heroTimer = setInterval(() => {
    const ss = $$('#hero .slide'); if (!ss.length) return;
    const order = ss.slice().reverse();
    order[heroI].classList.remove('on'); heroI = (heroI + 1) % order.length; order[heroI].classList.add('on');
    $$('#hero-dots i').forEach((d, i) => d.classList.toggle('on', i === heroI));
    heroCaption(order[heroI].dataset.k);
  }, 6000);
}
function heroCaption(k) { const p = PLACES.find(x => x.id === k); const c = $('#hero-cap'); if (c) c.textContent = (p ? L(p.n) + ' · ' : '') + L({ es: 'Foto: Wikimedia Commons', en: 'Photo: Wikimedia Commons' }); }

/* ---------- Plazos: cuenta regresiva ---------- */
function renderAlert() {
  const d0 = activeDeadline();
  const html = d0 ? (() => {
    const left = d0.end - Date.now();
    const d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60;
    return `<div class="alert" onclick="go('papers')"><div><span class="kicker" style="background:#fff;color:var(--red)">${esc(d0.k)}</span><b>${L(d0.t)}</b><div class="small" style="opacity:.92;margin-top:4px">${L(d0.s)}</div></div>
      <div class="count"><div><strong>${d}</strong><small>${L({ es: 'días', en: 'days' })}</small></div><div><strong>${h}</strong><small>${L({ es: 'horas', en: 'hours' })}</small></div><div><strong>${m}</strong><small>min</small></div></div></div>`;
  })() : `<div class="alert closed" onclick="go('papers')"><div><span class="kicker">${L({ es: 'Papeles', en: 'Papers' })}</span><b>${L({ es: 'Revisa las vías vigentes de regularización', en: 'Check the current regularization routes' })}</b><div class="small" style="opacity:.9;margin-top:4px">${L({ es: 'Los plazos de 2026 ya vencieron. Consulta novedades en migracioncolombia.gov.co.', en: 'The 2026 deadlines have passed. Check for news at migracioncolombia.gov.co.' })}</div></div></div>`;
  ['#alert', '#alert2'].forEach(s => { const e = $(s); if (e) e.innerHTML = html; });
}

/* ---------- Relojes y franja "Hoy" ---------- */
function tzf(zone, o) { return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { timeZone: zone, ...o }).format(new Date()); }
function tickClock() {
  const co = $('#clk-co'); if (co) co.textContent = tzf(ZONE, { hour: '2-digit', minute: '2-digit', hour12: false });
  const ve = $('#clk-ve'); if (ve) ve.textContent = L({ es: 'Caracas: ', en: 'Caracas: ' }) + tzf(ZONE_VE, { hour: '2-digit', minute: '2-digit', hour12: false }) + L({ es: ' · Venezuela va 1 hora adelante', en: ' · Venezuela is 1 hour ahead' });
}
const todayISO = () => new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(new Date());
function nextHoliday() { const iso = todayISO(); return HOLIDAYS.find(h => h[0] >= iso) || null; }
function dateLabel(iso) { const [y, m, d] = iso.split('-').map(Number); return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d)); }
function daysTo(iso) { const now = new Date(todayISO() + 'T00:00:00Z'); return Math.round((new Date(iso + 'T00:00:00Z') - now) / 864e5); }
function buildTicker() {
  const parts = [];
  parts.push(`<span><i class="dot"></i>${L({ es: 'Hoy en Montería', en: 'Today in Montería' })}: <b>${tzf(ZONE, { weekday: 'long', day: 'numeric', month: 'long' })}</b></span>`);
  if (NEWS && NEWS.noticias && NEWS.noticias[0]) parts.push(`<span>${L({ es: 'Noticia', en: 'News' })}: <b>${esc(NEWS.noticias[0].titulo)}</b></span>`);
  const d0 = activeDeadline();
  if (d0) parts.push(`<span>${esc(d0.k)}: <b>${L({ es: 'quedan ' + Math.ceil((d0.end - Date.now()) / 864e5) + ' días ', en: Math.ceil((d0.end - Date.now()) / 864e5) + ' days left ' })}${L(d0.tk)}</b></span>`);
  if (WX) parts.push(`<span>${L({ es: 'Clima', en: 'Weather' })}: <b>${Math.round(WX.current.temperature_2m)} °C</b>, ${L({ es: 'sensación', en: 'feels' })} ${Math.round(WX.current.apparent_temperature)} °C</span>`);
  if (FX && FX.COP) parts.push(`<span>1 USD = <b>${cop(FX.COP)}</b></span>`);
  const nf = nextFiesta(); if (nf) parts.push(`<span>${L({ es: 'Agenda', en: 'Coming up' })}: <b>${L(nf[1])}</b> (${fiestaIn(nf)})</span>`);
  const nh = nextHoliday(); if (nh) parts.push(`<span>${L({ es: 'Próximo festivo', en: 'Next holiday' })}: <b>${L(nh[1])}</b> (${daysTo(nh[0]) === 0 ? L({ es: 'hoy', en: 'today' }) : L({ es: 'en ' + daysTo(nh[0]) + ' días', en: 'in ' + daysTo(nh[0]) + ' days' })})</span>`);
  { const dc = daysTo('2027-05-01'); if (dc > 0) parts.push(`<span>${L({ es: 'Montería 250 años', en: 'Montería at 250' })}: <b>${L({ es: 'faltan ' + dc + ' días', en: dc + ' days to go' })}</b></span>`); }
  parts.push(`<span>${L({ es: 'Plan gratis', en: 'Free plan' })}: <b>Ronda del Sinú</b> ${L({ es: 'atardecer junto al río', en: 'sunset by the river' })}</span>`);
  parts.push(`<span>${L({ es: 'Emergencias', en: 'Emergencies' })}: <b>123</b></span>`);
  parts.push(`<span>${L({ es: 'Bus y buseta', en: 'Bus fare' })}: <b>${cop(BUS)}</b></span>`);
  parts.push(`<span>${L({ es: 'Salario mínimo 2026', en: '2026 minimum wage' })}: <b>${cop(WAGE.month)}</b></span>`);
  const t = $('#ticker'); if (t) t.innerHTML = parts.join('');
}

/* ---------- Clima en vivo (Open-Meteo) ---------- */
let WX = store.get('wx', null);
const WCODE = c => c === 0 ? { es: 'Despejado', en: 'Clear' } : c <= 3 ? { es: 'Parcialmente nublado', en: 'Partly cloudy' } : c <= 48 ? { es: 'Neblina', en: 'Fog' } : c <= 67 ? { es: 'Lluvia', en: 'Rain' } : c <= 82 ? { es: 'Chubascos', en: 'Showers' } : { es: 'Tormenta', en: 'Thunderstorm' };
async function loadWeather() {
  try {
    WX = await getJSON('https://api.open-meteo.com/v1/forecast?latitude=8.7479&longitude=-75.8814&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FBogota&forecast_days=5');
    store.set('wx', WX); paintWeather(); buildTicker();
  } catch (e) { if (!WX) $$('#wx-now,#wx-now2').forEach(x => x.textContent = '--'); }
}
function paintWeather() {
  if (!WX || !WX.current) return;
  const c = WX.current, txt = Math.round(c.temperature_2m) + ' °C';
  const a = $('#wx-now'); if (a) a.textContent = txt;
  const s = $('#wx-sub'); if (s) s.textContent = L(WCODE(c.weather_code)) + ' · ' + L({ es: 'sensación ', en: 'feels ' }) + Math.round(c.apparent_temperature) + ' °C';
  const b = $('#wx-now2'); if (b) b.textContent = txt + ' · ' + L(WCODE(c.weather_code));
  const d = $('#wx-days'); if (d && WX.daily) d.innerHTML = WX.daily.time.map((t, i) => `<div>${new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { weekday: 'short', timeZone: 'UTC' }).format(new Date(t + 'T12:00:00Z'))}<b>${Math.round(WX.daily.temperature_2m_max[i])}°</b>${Math.round(WX.daily.temperature_2m_min[i])}° · ${WX.daily.precipitation_probability_max[i] ?? 0}%</div>`).join('');
}

/* ---------- Cambio en vivo ---------- */
let FX = store.get('fx', null);
async function loadFX() {
  try {
    const j = await getJSON('https://open.er-api.com/v6/latest/USD');
    if (j && j.rates && j.rates.COP) { FX = { COP: j.rates.COP, EUR: j.rates.EUR, VES: j.rates.VES, t: j.time_last_update_utc }; store.set('fx', FX); }
  } catch (e) {}
  paintFX(); buildTicker();
}
function paintFX() {
  const ok = FX && FX.COP;
  ['#fx-usd', '#fx-usd2'].forEach(s => { const e = $(s); if (e) e.textContent = ok ? cop(FX.COP) : '--'; });
  const sub = ok ? L({ es: 'pesos colombianos · tasa del día', en: 'Colombian pesos · today\'s rate' }) : L({ es: 'Sin conexión: conecta para ver la tasa', en: 'Offline: connect to see the rate' });
  ['#fx-sub', '#fx-sub2'].forEach(s => { const e = $(s); if (e) e.textContent = sub; });
  const eu = $('#fx-eur'); if (eu) eu.textContent = ok && FX.EUR ? cop(FX.COP / FX.EUR) : '--';
  const vs = $('#fx-ves'); if (vs) vs.textContent = ok && FX.VES ? cop(100 * FX.COP / FX.VES) : '--';
  const wu = $('#wage-usd'); if (wu && ok) wu.textContent = L({ es: 'Salario ÷ 210 h · mínimo ≈ US$', en: 'Wage ÷ 210 h · minimum ≈ US$' }) + fmt(WAGE.month / FX.COP, 0);
  convert(); calcWage();
}
function convert() {
  const o = $('#fx-out'); if (!o) return;
  const amt = parseFloat($('#fx-amt').value) || 0, from = $('#fx-from').value;
  const perUSD = { USD: 1, COP: FX && FX.COP, EUR: FX && FX.EUR, VES: FX && FX.VES };
  if (!perUSD[from] || !(FX && FX.COP)) { o.innerHTML = `<div class="note">${L({ es: 'Necesitas conexión una vez para traer la tasa del día. Después funciona sin internet.', en: 'You need a connection once to get today\'s rate. Then it works offline.' })}</div>`; return; }
  const usd = amt / perUSD[from];
  const rows = ['COP', 'USD', 'EUR', 'VES'].filter(c => c !== from && perUSD[c]).map(c => `<div class="sl"><div><b>${c}</b></div><div style="font-family:'Barlow Condensed';font-size:1.5rem;font-weight:800">${fmt(usd * perUSD[c], c === 'COP' ? 0 : 2)}</div></div>`).join('');
  o.innerHTML = `<div class="status-list">${rows}</div>`;
}

/* ---------- Salario ---------- */
function calcWage() {
  const o = $('#w-out'); if (!o) return;
  const h = Math.max(0, Math.min(WAGE.weekH, parseFloat($('#w-h').value) || 0));
  const n = Math.max(0, Math.min(h, parseFloat($('#w-n').value) || 0));
  const d = Math.max(0, Math.min(10, parseFloat($('#w-d').value) || 0));
  const base = WAGE.month * h / WAGE.weekH;                       // proporcional a 42 h
  const night = n * 5 * WAGE.hour * WAGE.night;                    // ~5 semanas de 210 h al mes
  const sunday = d * (h / 6) * WAGE.hour * WAGE.sunday;            // horas de un día de trabajo
  const devengado = base + night + sunday;
  const aux = devengado <= 2 * WAGE.month ? WAGE.aux * Math.min(1, h / WAGE.weekH) : 0;
  const desc = devengado * 0.08;
  const neto = devengado + aux - desc;
  const row = (t, v, s = '') => `<div class="sl"><div><b>${t}</b>${s ? `<small>${s}</small>` : ''}</div><div style="font-family:'Barlow Condensed';font-size:1.4rem;font-weight:800">${cop(v)}</div></div>`;
  const usd = FX && FX.COP ? ' · ≈ US$' + fmt(neto / FX.COP, 0) : '';
  o.innerHTML = `<div class="status-list">${row(L({ es: 'Salario base', en: 'Base pay' }), base, L({ es: h + ' h por semana', en: h + ' h a week' }))}
    ${night ? row(L({ es: 'Recargo nocturno', en: 'Night surcharge' }), night) : ''}${sunday ? row(L({ es: 'Recargo dominical/festivo', en: 'Sunday/holiday surcharge' }), sunday) : ''}
    ${row(L({ es: 'Auxilio de transporte', en: 'Transport allowance' }), aux)}
    ${row(L({ es: 'Descuentos salud y pensión (8%)', en: 'Health & pension deductions (8%)' }), -desc)}
    ${row(L({ es: 'Te llega al mes (aprox.)', en: 'Take-home per month (approx.)' }), neto, L({ es: 'Cálculo de referencia', en: 'Reference estimate' }) + usd)}</div>`;
}

/* ---------- Festivos ---------- */
function renderHolidays() {
  const box = $('#hol-list'); if (!box) return;
  const iso = todayISO();
  const up = HOLIDAYS.filter(h => h[0] >= iso).slice(0, 10);
  box.innerHTML = up.map(h => `<div class="sl"><div><b>${L(h[1])}</b><small style="text-transform:capitalize">${dateLabel(h[0])}</small></div><span class="pill">${daysTo(h[0]) === 0 ? L({ es: 'Hoy', en: 'Today' }) : L({ es: 'En ' + daysTo(h[0]) + ' d', en: 'In ' + daysTo(h[0]) + ' d' })}</span></div>`).join('');
  const nh = nextHoliday(), n = $('#next-hol');
  if (n && nh) n.textContent = L({ es: 'Próximo: ', en: 'Next: ' }) + L(nh[1]);
}

/* ---------- Checklist ---------- */
function tick(i, v) { const s = store.get('chk', {}); s[i] = v; store.set('chk', s); restoreChecks(); }
function restoreChecks() {
  const s = store.get('chk', {}); let n = 0;
  FIRST.forEach((_, i) => { const el = $('#chk-' + i); if (!el) return; const on = !!s[i]; el.classList.toggle('done', on); $('input', el).checked = on; if (on) n++; });
  const bar = $('#chk-bar'); if (bar) bar.style.width = (n / FIRST.length * 100) + '%';
  const t = $('#chk-txt'); if (t) t.textContent = L({ es: `${n} de ${FIRST.length} listos`, en: `${n} of ${FIRST.length} done` });
}

/* ---------- Dirección ---------- */
function saveAddr() { const v = $('#my-addr').value.trim(); store.set('addr', v); toast(v ? L({ es: 'Dirección guardada', en: 'Address saved' }) : L({ es: 'Dirección borrada', en: 'Address cleared' })); }
function routeHome() { const a = store.get('addr', ''); if (!a) { toast(L({ es: 'Primero guarda tu dirección', en: 'Save your address first' })); go('home'); return; } open('https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=' + encodeURIComponent(a + ', Montería, Córdoba, Colombia'), '_blank', 'noopener'); }
function openShow() {
  const a = store.get('addr', '');
  if (!a) { toast(L({ es: 'Primero guarda tu dirección en Inicio', en: 'Save your address on Home first' })); go('home'); return; }
  $('#show-big').innerHTML = 'Buenas, disculpe. Soy nuevo en Montería y me perdí.<br>¿Me ayuda a llegar a esta dirección, por favor?<br><span class="small muted" style="font-family:Barlow">Hi, sorry. I\'m new in Montería and I\'m lost. Could you help me get to this address?</span>';
  $('#show-addr').textContent = a; $('#showcard').classList.add('on');
}
function planTrip() { const d = $('#j-to').value.trim(); if (!d) return; open('https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=' + encodeURIComponent(d + ', Montería, Córdoba, Colombia'), '_blank', 'noopener'); }

/* ---------- Mapa (Leaflet) ---------- */
let map = null, layers = {};
const CAT_COLOR = { city: '#EB0A1E', beach: '#2D7FF9', nature: '#2FB59A', help: '#0B0B0C' };
function initMap() {
  const el = $('#map'); if (!el || map || typeof window.L === 'undefined') return;
  const LF = window.L;
  map = LF.map(el, { zoomControl: true }).setView([8.765, -75.88], 13);
  LF.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap, © CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(map);
  layers = {};
  [...PLACES, ...MAP_EXTRA].forEach(p => {
    const icon = LF.divIcon({ className: '', html: `<div class="mk" style="background:${CAT_COLOR[p.cat]}"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] });
    const img = PHOTO_CACHE[p.id] ? `<div style="width:220px;height:110px;border-radius:8px;background:url('${PHOTO_CACHE[p.id]}') center/cover;margin-bottom:6px"></div>` : '';
    const m = LF.marker([p.lat, p.lon], { icon }).bindPopup(`${img}<b>${esc(L(p.n))}</b><br><span>${esc(L(p.d))}</span><br><a href="https://www.google.com/maps/dir/?api=1&destination=${p.q ? encodeURIComponent(p.q) : p.lat + ',' + p.lon}" target="_blank" rel="noopener">${L({ es: 'Cómo llegar', en: 'Directions' })}</a>`, { maxWidth: 240 });
    m._cat = p.cat; m.addTo(map); layers[p.id] = m;
  });
  setTimeout(() => map.invalidateSize(), 200);
  if (pendingPlace) { const id = pendingPlace; pendingPlace = null; setTimeout(() => focusPlace(id), 250); }
}
function mapFilter(c) {
  $$('#map-chips button').forEach(b => b.classList.toggle('on', b.dataset.c === c));
  if (!map) return;
  Object.values(layers).forEach(m => { const show = c === 'all' || m._cat === c; if (show && !map.hasLayer(m)) m.addTo(map); if (!show && map.hasLayer(m)) map.removeLayer(m); });
}
let pendingPlace = null;
function showOnMap(id) { pendingPlace = id; go('map'); if (map) { pendingPlace = null; setTimeout(() => focusPlace(id), 120); } }
function focusPlace(id) { const m = layers[id]; if (!m) return; mapFilter('all'); map.setView(m.getLatLng(), ['lorica', 'tuchin', 'cispata', 'covenas', 'arboletes', 'sanpelayo'].includes(id) ? 12 : 15); m.openPopup(); }
function locateMe() {
  if (!navigator.geolocation) { toast(L({ es: 'Tu celular no permite ubicación', en: 'Location not available' })); return; }
  navigator.geolocation.getCurrentPosition(p => {
    if (!map) return; const ll = [p.coords.latitude, p.coords.longitude];
    window.L.circleMarker(ll, { radius: 9, color: '#fff', weight: 3, fillColor: '#2D7FF9', fillOpacity: 1 }).addTo(map).bindPopup(L({ es: 'Estás aquí', en: 'You are here' })).openPopup();
    map.setView(ll, 14);
  }, () => toast(L({ es: 'No pude obtener tu ubicación', en: 'Could not get your location' })), { enableHighAccuracy: true, timeout: 10000 });
}

/* ---------- Otras ciudades de la serie ---------- */
const HUB = 'https://haroldco45.github.io/latinos-por-el-mundo/ciudades.json';
const CITY_FALLBACK = [
  { id: 'barranquilla', es: 'Barranquilla', en: 'Barranquilla', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/barranquilla-para-latinos/' },
  { id: 'cartagena', es: 'Cartagena', en: 'Cartagena', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/cartagena-para-latinos/' },
  { id: 'norcasia', es: 'Norcasia', en: 'Norcasia', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/norcasia-para-latinos/' },
  { id: 'londres', es: 'Londres', en: 'London', pais: { es: 'Reino Unido', en: 'United Kingdom' }, url: 'https://haroldco45.github.io/londres-para-latinos/' },
  { id: 'madrid', es: 'Madrid', en: 'Madrid', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/madrid-para-latinos/' },
  { id: 'bilbao', es: 'Bilbao', en: 'Bilbao', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/bilbao-para-latinos/' },
  { id: 'medellin', es: 'Medellín', en: 'Medellín', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/medellin-para-latinos/' },
  { id: 'miami', es: 'Miami', en: 'Miami', pais: { es: 'Estados Unidos', en: 'United States' }, url: 'https://haroldco45.github.io/miami-para-latinos/' },
  { id: 'nueva-york', es: 'Nueva York', en: 'New York', pais: { es: 'Estados Unidos', en: 'United States' }, url: 'https://haroldco45.github.io/nueva-york-para-latinos/' },
  { id: 'toledo', es: 'Toledo', en: 'Toledo', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/toledo-para-latinos/' },
  { id: 'leamington', es: 'Leamington', en: 'Leamington', pais: { es: 'Canadá', en: 'Canada' }, url: 'https://haroldco45.github.io/leamington-para-latinos/' },
  { id: 'hamamatsu', es: 'Hamamatsu', en: 'Hamamatsu', pais: { es: 'Japón', en: 'Japan' }, url: 'https://haroldco45.github.io/hamamatsu-para-latinos/' },
  { id: 'oizumi', es: 'Oizumi', en: 'Oizumi', pais: { es: 'Japón', en: 'Japan' }, url: 'https://haroldco45.github.io/oizumi-para-latinos/' },
  { id: 'getxo', es: 'Getxo', en: 'Getxo', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/getxo-para-latinos/' },
  { id: 'willemstad', es: 'Willemstad', en: 'Willemstad', pais: { es: 'Curazao', en: 'Curaçao' }, url: 'https://haroldco45.github.io/willemstad-para-latinos/' }
];
const CITY_WIKI = { londres: 'London', madrid: 'Madrid', bilbao: 'Bilbao', medellin: 'Medellín', miami: 'Miami', 'nueva-york': 'New York City', toledo: 'Toledo, Spain', leamington: 'Leamington, Ontario', hamamatsu: 'Hamamatsu', oizumi: 'Ōizumi, Gunma', getxo: 'Getxo', willemstad: 'Willemstad', cartagena: 'Cartagena, Colombia', norcasia: 'Norcasia', svalbard: 'Svalbard', barranquilla: 'Barranquilla', 'cano-canoas': 'Caño Canoas', aldeas: 'Spain', monteria: 'Montería' };
let CITIES = store.get('cities', CITY_FALLBACK);
const CITY_PH = store.get('cityph', {});
function renderCities() {
  const box = $('#cx'); if (!box) return;
  box.innerHTML = CITIES.filter(c => c.id !== 'monteria').map(c => {
    const name = c[LANG] || c.es, pais = (c.pais && (c.pais[LANG] || c.pais.es)) || '';
    const bg = CITY_PH[c.id] ? `background-image:url('${CITY_PH[c.id]}');` : '';
    if (c.pronto) return `<div class="cxc soon" style="--fb:${fbColor(c.id)};${bg}"><b>${esc(name)}</b><small>${esc(pais)} · ${L({ es: 'Muy pronto', en: 'Coming soon' })}</small></div>`;
    return `<a class="cxc" style="--fb:${fbColor(c.id)};${bg}" href="${esc(c.url)}"><b>${esc(name)}</b><small>${esc(pais)}</small></a>`;
  }).join('');
}
async function loadCities() {
  try {
    const j = await getJSON(HUB + '?v=' + Date.now());
    if (j && j.ciudades && j.ciudades.length) {
      // Une la lista del hub con las ciudades conocidas que aún no estén publicadas allí
      const ids = new Set(j.ciudades.map(c => c.id));
      CITIES = j.ciudades.concat(CITY_FALLBACK.filter(c => !ids.has(c.id))); store.set('cities', CITIES);
    }
  } catch (e) {}
  renderCities();
  const need = CITIES.filter(c => !CITY_PH[c.id]);
  if (need.length) {
    const titles = need.map(c => CITY_WIKI[c.id] || c.en || c.es);
    const got = await wikiBatch(titles);
    need.forEach((c, i) => { if (got[titles[i]]) CITY_PH[c.id] = got[titles[i]]; });
    store.set('cityph', CITY_PH); renderCities();
  }
}

/* ---------- PWA ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; setTimeout(() => $('#install').classList.add('on'), 4000); });
$('#install-btn').addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $('#install').classList.remove('on'); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

/* ---------- Arranque ---------- */
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });
window.addEventListener('hashchange', () => go(location.hash.slice(1) || 'home'));
current = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
render();
$$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === current));
setTimeout(() => $('#splash').classList.add('off'), 900);
loadWeather(); loadFX(); loadCities(); loadNews(); loadRobotVids();
loadPhotos().then(() => { paintPhotos(); if (map) { map.remove(); map = null; if (current === 'map') initMap(); } });
setInterval(() => { tickClock(); renderAlert(); }, 30000);
setInterval(() => { buildTicker(); renderFiestas(); }, 300000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { tickClock(); renderAlert(); buildTicker(); renderFiestas(); loadWeather(); loadFX(); loadNews(); loadRobotVids(); } });
