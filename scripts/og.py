# Robot de la imagen de vista previa (og-image.png) — Montería para Latinos
# Corre en GitHub Actions: busca una foto real de Montería en Wikimedia Commons
# (licencia libre), la recorta a 1200x630 y le pone el texto de la app.
# Solo trabaja una vez: cuando termina deja data/og-foto.json con el crédito de la foto.
import io, json, os, re, sys, urllib.request, urllib.parse
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'VibrasPositivasHM-robot/1.0 (haroldco45.github.io/monteria-para-latinos)'}
BUSQUEDAS = ['Ronda del Sinú Montería', 'Río Sinú Montería', 'Montería Córdoba Colombia', 'Catedral de Montería']
FUENTES = {
    'bc800': 'https://github.com/google/fonts/raw/main/ofl/barlowcondensed/BarlowCondensed-ExtraBold.ttf',
    'b500': 'https://github.com/google/fonts/raw/main/ofl/barlow/Barlow-Medium.ttf',
    'b700': 'https://github.com/google/fonts/raw/main/ofl/barlow/Barlow-Bold.ttf',
}

def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
        return r.read()

def buscar_foto():
    for q in BUSQUEDAS:
        api = ('https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6'
               '&gsrlimit=10&gsrsearch=' + urllib.parse.quote(q + ' filetype:bitmap') +
               '&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1600')
        pages = json.loads(get(api)).get('query', {}).get('pages', {})
        for p in sorted(pages.values(), key=lambda x: x.get('index', 99)):
            ii = (p.get('imageinfo') or [{}])[0]
            if ii.get('width', 0) >= 1000 and ii.get('width', 0) > ii.get('height', 0):
                meta = ii.get('extmetadata', {})
                autor = meta.get('Artist', {}).get('value', '')
                lic = meta.get('LicenseShortName', {}).get('value', '')
                autor = re.sub('<[^>]+>', '', autor).strip()[:60]
                return ii.get('thumburl') or ii['url'], p.get('title', ''), autor, lic, ii.get('descriptionurl', '')
    return None

def main():
    if os.path.exists(os.path.join(RAIZ, 'data', 'og-foto.json')):
        print('La imagen de vista previa ya tiene foto real.'); return
    foto = buscar_foto()
    if not foto:
        print('No encontré foto en Commons; se deja la imagen actual.'); return
    url, titulo, autor, lic, pagina = foto
    img = Image.open(io.BytesIO(get(url))).convert('RGB')
    bytes_f = {k: get(u) for k, u in FUENTES.items()}
    font = lambda k, s: ImageFont.truetype(io.BytesIO(bytes_f[k]), s)

    W, H = 1200, 630
    # foto a la derecha, recortada para llenar
    r = max(W / img.width, H / img.height)
    img = img.resize((int(img.width * r) + 1, int(img.height * r) + 1), Image.LANCZOS)
    x0 = (img.width - W) // 2 + 200; x0 = max(0, min(x0, img.width - W))
    y0 = (img.height - H) // 2
    lienzo = img.crop((x0, y0, x0 + W, y0 + H))
    d = ImageDraw.Draw(lienzo)
    RED, WHITE, INK = (235, 10, 30), (255, 255, 255), (11, 11, 12)
    d.polygon([(0, 0), (690, 0), (650, 630), (0, 630)], fill=RED)
    d.rounded_rectangle([60, 58, 300, 110], radius=10, fill=WHITE)
    d.text((76, 62), 'RECIÉN LLEGADO', font=font('bc800', 36), fill=RED)
    d.text((60, 135), 'MONTERÍA', font=font('bc800', 118), fill=WHITE)
    d.text((60, 255), 'PARA LATINOS', font=font('bc800', 60), fill=WHITE)
    for i, l in enumerate(['Papeles · PEP Tutor · Visa V · Trabajo', 'Salario 2026 · Buses y Businú · Salud', 'Costeño · Feria Ganadera · Ronda del Sinú']):
        d.text((60, 335 + i * 40), l, font=font('b500', 28), fill=WHITE)
    d.rounded_rectangle([60, 460, 368, 508], radius=24, fill=INK)
    d.text((84, 467), 'Gratis · Español / English', font=font('b700', 24), fill=WHITE)
    d.text((60, 592), 'Desarrollada por Vibras Positivas HM', font=font('b700', 16), fill=WHITE)
    cred = f'Foto: {autor or "Wikimedia Commons"} · {lic}'.strip(' ·')
    tw = d.textlength(cred, font=font('b500', 14))
    d.rounded_rectangle([W - tw - 30, H - 34, W - 8, H - 10], radius=10, fill=(0, 0, 0))
    d.text((W - tw - 19, H - 31), cred, font=font('b500', 14), fill=WHITE)
    lienzo.save(os.path.join(RAIZ, 'og-image.png'), optimize=True)
    with open(os.path.join(RAIZ, 'data', 'og-foto.json'), 'w', encoding='utf-8') as fh:
        json.dump({'archivo': titulo, 'autor': autor, 'licencia': lic, 'pagina': pagina}, fh, ensure_ascii=False, indent=2)
    print('Imagen de vista previa creada con', titulo)

if __name__ == '__main__':
    try: main()
    except Exception as e:
        print('No se pudo crear la imagen de vista previa:', e); sys.exit(0)
