// Télécharge le CSS servi par Discord (feuilles de la page + feuilles chargées à la
// demande) et le met en cache dans strata/.cache/discord-css/.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://discord.com';
export const CACHE_DIR = fileURLToPath(new URL('../.cache/discord-css', import.meta.url));

// Classes des modules CSS de Discord : nom_hash ou nom__hash (hash hexadécimal de 5-6 caractères)
export const CLASS_RE = /\.([A-Za-z][A-Za-z0-9-]*_{1,2}[a-f0-9]{5,6})(?![A-Za-z0-9_-])/g;

async function text(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

// Une adresse inconnue renvoie la page HTML de l'appli avec un statut 200 : on la rejette
async function stylesheet(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  const type = res.headers.get('content-type') ?? '';
  if (!res.ok || !type.includes('css')) throw new Error(`pas une feuille CSS : ${url}`);
  return res.text();
}

// Feuilles listées dans la page + table webpack du bundle web.*.js. Deux formes coexistent :
// `"123"===e?""+e+".<hash>.css"` -> 123.<hash>.css, et `({123:"<hash>"})[e]+".css"` -> <hash>.css
async function cssUrls() {
  const html = await text(`${ORIGIN}/app`);
  const urls = new Set(html.match(/\/assets\/[\w.-]+\.css/g));
  const webJs = html.match(/\/assets\/web\.[\w]+\.js/)?.[0];
  if (!webJs) throw new Error('bundle web.*.js introuvable dans la page');
  const js = await text(ORIGIN + webJs);

  for (const [, id, hash] of js.matchAll(/"(\d+)"===e\?""\+e\+"\.([a-f0-9]{16})\.css"/g)) urls.add(`/assets/${id}.${hash}.css`);
  const end = js.indexOf(')[e]+".css"');
  if (end < 0) throw new Error('table des CSS webpack introuvable dans web.*.js');
  const map = js.slice(js.lastIndexOf('({', end), end);
  for (const [, hash] of map.matchAll(/\d+:"([a-f0-9]{16})"/g)) urls.add(`/assets/${hash}.css`);
  return [...urls];
}

// Renvoie la liste des feuilles { name, css }. `refresh` force un nouveau téléchargement.
export async function discordSheets({ refresh = false } = {}) {
  if (!refresh && existsSync(CACHE_DIR) && readdirSync(CACHE_DIR).length > 0) {
    return readdirSync(CACHE_DIR).map((name) => ({ name, css: readFileSync(join(CACHE_DIR, name), 'utf8') }));
  }

  const urls = await cssUrls();
  mkdirSync(CACHE_DIR, { recursive: true });
  const sheets = [];
  let failed = 0;
  for (let i = 0; i < urls.length; i += 24) {
    const batch = urls.slice(i, i + 24).map(async (u) => {
      try {
        const css = await stylesheet(ORIGIN + u);
        const name = u.split('/').pop();
        writeFileSync(join(CACHE_DIR, name), css);
        sheets.push({ name, css });
      } catch {
        failed++;
      }
    });
    await Promise.all(batch);
  }
  console.log(`${urls.length - failed}/${urls.length} feuilles Discord lues`);
  if (failed > urls.length / 10) throw new Error(`${failed} feuilles illisibles : le format des adresses a sans doute changé`);
  return sheets;
}
