// Toma capturas del sitio publicado (tamaño celular 1080x1920) para hacer el video promocional.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const URL_APP = 'https://monteria-para-latinos.netlify.app/';
const VISTAS = ['home', 'feria', 'ronda', 'centro', 'costa', 'move', 'papers', 'talk', 'media', 'map', 'work'];
await mkdir('capturas', { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 432, height: 768 }, deviceScaleFactor: 2.5, locale: 'es-CO', timezoneId: 'America/Bogota', isMobile: true, hasTouch: true });
await ctx.addInitScript(() => { try { localStorage.setItem('mtr_lang', '"es"'); } catch (e) {} });
const pg = await ctx.newPage();
await pg.goto(URL_APP, { waitUntil: 'load', timeout: 60000 });
await pg.waitForTimeout(15000); // fotos, clima, noticias
for (const v of VISTAS) {
  await pg.evaluate(x => go(x), v);
  await pg.waitForTimeout(v === 'map' ? 7000 : 3500);
  await pg.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important} nav.tabs,#install,.toast{display:none!important} header.top{position:static!important} body{padding-bottom:0!important}' });
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: `capturas/${v}.jpg`, type: 'jpeg', quality: 92, fullPage: true });
  console.log('captura', v);
}
await b.close();
