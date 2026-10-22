// Vérifie que chaque classe hachée du thème (ex. .sidebar__5e434) existe encore
// dans le CSS servi par Discord. À lancer après une mise à jour de Discord.
//   node strata/tools/check-selectors.mjs
// Télécharge toujours une version fraîche (et met à jour le cache de css-query).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLASS_RE, discordSheets } from './discord-css.mjs';

const themeDir = fileURLToPath(new URL('../theme', import.meta.url));

function themeClasses() {
  const used = new Map();
  for (const file of readdirSync(themeDir).filter((f) => f.endsWith('.css'))) {
    const css = readFileSync(join(themeDir, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const [, cls] of css.matchAll(CLASS_RE)) used.set(cls, [...(used.get(cls) ?? []), file]);
  }
  return used;
}

const known = new Set();
for (const { css } of await discordSheets({ refresh: true })) {
  for (const [, cls] of css.matchAll(CLASS_RE)) known.add(cls);
}
console.log(`${known.size} classes connues`);

const missing = [...themeClasses()].filter(([cls]) => !known.has(cls));
if (missing.length === 0) {
  console.log('Toutes les classes du thème existent encore.');
} else {
  console.log(`${missing.length} classe(s) disparue(s) :`);
  for (const [cls, files] of missing) console.log(`  .${cls}  (${[...new Set(files)].join(', ')})`);
  process.exitCode = 1;
}
