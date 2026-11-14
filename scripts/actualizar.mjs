// Robot de actualización — Montería para Latinos (Vibras Positivas HM)
// Corre en GitHub Actions cada 30 minutos. No necesita librerías ni claves.
//  1. Noticias de Montería y Córdoba (Google Noticias)  -> data/noticias.json
//  2. Videos recientes de Montería en YouTube            -> data/videos.json
import { readFile, writeFile } from 'node:fs/promises';

const RAIZ = new URL('../data/', import.meta.url);
const UA = { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36 VibrasPositivasHM-robot', 'Accept-Language': 'es-CO,es;q=0.9' };

/* ---------------- Noticias ---------------- */
const BUSQUEDAS = [
  'Montería Córdoba',
  'Montería alcaldía',
  '"río Sinú" Montería',
  'Businú Montería',
  'Feria de la Ganadería Montería',
  'migrantes venezolanos Montería',
  'Montería 250 años'
];
const MAX_NOTICIAS = 150;
const rss = q => `https://news.google.com/rss/search?q=${encodeURIComponent(q + ' when:30d')}&hl=es-419&gl=CO&ceid=CO:es-419`;

const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&nbsp;': ' ' };
const limpiar = (t = '') => t
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, m => ENT[m])
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const etiqueta = (b, tag) => { const m = b.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)); return m ? limpiar(m[1]) : ''; };

export function leerRSS(xml) {
  const items = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const b = m[1];
    const medio = etiqueta(b, 'source');
    let titulo = etiqueta(b, 'title');
    if (medio && titulo.endsWith(` - ${medio}`)) titulo = titulo.slice(0, -(medio.length + 3));
    const fecha = new Date(etiqueta(b, 'pubDate'));
    items.push({ titulo, medio: medio || 'Medio', enlace: etiqueta(b, 'link'), fecha: isNaN(fecha) ? null : fecha.toISOString() });
  }
  return items;
}
// Solo titulares que hablan de Montería o de su región
const RELEVANTE = /monter[ií]a|sin[uú]|businú|c[oó]rdoba|ceret[eé]|lorica|san pelayo|tuch[ií]n/i;
const NO = /c[oó]rdoba,? (argentina|espa[ñn]a)|cordobés del|real madrid|la liga/i;
export const clave = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

export function fusionar(actuales, nuevas) {
  const vistos = new Set(actuales.map(n => clave(n.titulo)));
  const agregadas = [];
  for (const n of nuevas) {
    if (!n.titulo || n.titulo.length < 25 || /^[-–]/.test(n.titulo) || !RELEVANTE.test(n.titulo) || NO.test(n.titulo)) continue;
    const k = clave(n.titulo); if (vistos.has(k)) continue;
    vistos.add(k); agregadas.push({ ...n, auto: true });
  }
  const todas = [...agregadas, ...actuales].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')).slice(0, MAX_NOTICIAS);
  return { todas, agregadas };
}

async function noticias() {
  const archivo = new URL('noticias.json', RAIZ);
  const datos = JSON.parse(await readFile(archivo, 'utf8'));
  const encontradas = []; let ok = 0;
  for (const q of BUSQUEDAS) {
    try {
      const r = await fetch(rss(q), { headers: UA });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      encontradas.push(...leerRSS(await r.text())); ok++;
    } catch (e) { console.error('Noticias, falló', q, e.message); }
  }
  if (!ok) { console.error('Ninguna búsqueda de noticias respondió.'); return false; }
  const { todas, agregadas } = fusionar(datos.noticias || [], encontradas);
  datos.noticias = todas; datos.revisado = new Date().toISOString();
  if (agregadas.length) datos.actualizado = datos.revisado;
  await writeFile(archivo, JSON.stringify(datos, null, 2) + '\n');
  console.log(`Noticias: revisadas ${encontradas.length}, nuevas ${agregadas.length}, total ${todas.length}`);
  return true;
}

/* ---------------- Videos de YouTube ---------------- */
const VIDEO_BUSQUEDAS = [
  'Montería Córdoba',
  'Ronda del Sinú Montería',
  'Businú Montería',
  'Feria de la Ganadería Montería',
  'planchones río Sinú',
  'vivir en Montería'
];
const MAX_VIDEOS = 24;
// sp=CAI%3D ordena por fecha de subida
const yt = q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=CAI%253D&hl=es&gl=CO`;
const VIDEO_REL = /monter[ií]a|sin[uú]|c[oó]rdoba|lorica|ceret[eé]|san pelayo|tuch[ií]n|businú/i;

function texto(o) { if (!o) return ''; if (o.simpleText) return o.simpleText; if (o.runs) return o.runs.map(r => r.text).join(''); return ''; }
export function leerYouTube(html) {
  const m = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/) || html.match(/ytInitialData"\]\s*=\s*(\{[\s\S]*?\});/);
  if (!m) return [];
  let data; try { data = JSON.parse(m[1]); } catch { return []; }
  const out = [];
  (function recorrer(n) {
    if (!n || typeof n !== 'object') return;
    if (n.videoRenderer && n.videoRenderer.videoId) {
      const v = n.videoRenderer;
      out.push({
        id: v.videoId,
        titulo: texto(v.title),
        canal: texto(v.ownerText || v.longBylineText),
        hace: texto(v.publishedTimeText),
        duracion: texto(v.lengthText)
      });
      return;
    }
    for (const k in n) recorrer(n[k]);
  })(data);
  return out;
}

async function videos() {
  const archivo = new URL('videos.json', RAIZ);
  let datos; try { datos = JSON.parse(await readFile(archivo, 'utf8')); } catch { datos = { videos: [] }; }
  const ids = new Set(); const nuevos = []; let ok = 0;
  for (const q of VIDEO_BUSQUEDAS) {
    try {
      const r = await fetch(yt(q), { headers: UA });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const lista = leerYouTube(await r.text()); if (lista.length) ok++;
      for (const v of lista.slice(0, 8)) {
        if (!v.titulo || !v.duracion || ids.has(v.id) || !VIDEO_REL.test(v.titulo)) continue; // sin duración = en vivo o short raro
        ids.add(v.id); nuevos.push({ ...v, tema: q, visto: new Date().toISOString() });
      }
    } catch (e) { console.error('Videos, falló', q, e.message); }
  }
  if (!ok || !nuevos.length) { console.error('YouTube no respondió; se dejan los videos anteriores.'); return false; }
  // Los nuevos primero; se conservan los anteriores que no se repiten
  const viejos = (datos.videos || []).filter(v => !ids.has(v.id));
  datos.videos = [...nuevos, ...viejos].slice(0, MAX_VIDEOS);
  datos.revisado = new Date().toISOString();
  await writeFile(archivo, JSON.stringify(datos, null, 2) + '\n');
  console.log(`Videos: ${nuevos.length} encontrados, total ${datos.videos.length}`);
  return true;
}

async function main() {
  const a = await noticias();
  const b = await videos();
  if (!a && !b) process.exitCode = 1;
}
if (import.meta.url === `file://${process.argv[1]}`) main();
