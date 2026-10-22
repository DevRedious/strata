// Concatène strata/theme/*.css en un thème Vencord autonome, en attendant que le
// plugin Strata injecte lui-même le thème.
//   node strata/tools/build-theme.mjs            -> strata/.cache/strata.theme.css
//   node strata/tools/build-theme.mjs --install  -> copie aussi dans %APPDATA%\Vencord\themes
//   node strata/tools/build-theme.mjs --watch    -> reconstruit à chaque modification
// Vencord recharge un thème installé dès que le fichier change.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, watch, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const themeDir = fileURLToPath(new URL('../theme', import.meta.url));
const outDir = fileURLToPath(new URL('../.cache', import.meta.url));
const outFile = join(outDir, 'strata.theme.css');
const args = new Set(process.argv.slice(2));

function build() {
  const header = `/**
 * @name Strata
 * @description Sombre, un seul accent couleur, panneaux flottants, salons en tiroir.
 * @author DevRedious
 * @version 0.1.0
 */
`;
  const parts = readdirSync(themeDir)
    .filter((f) => f.endsWith('.css'))
    .sort()
    .map((f) => `/* ---- ${f} ---- */\n${readFileSync(join(themeDir, f), 'utf8').trim()}\n`);

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, `${header}\n${parts.join('\n')}`);
  console.log(`[build] ${outFile}`);

  if (args.has('--install')) {
    const dir = join(process.env.APPDATA ?? join(process.env.HOME ?? '', '.config'), 'Vencord', 'themes');
    if (!existsSync(dir)) throw new Error(`Dossier Vencord introuvable : ${dir}`);
    copyFileSync(outFile, join(dir, 'strata.theme.css'));
    console.log(`[install] ${join(dir, 'strata.theme.css')}`);
  }
}

build();

if (args.has('--watch')) {
  let timer;
  watch(themeDir, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        build();
      } catch (err) {
        console.error(err.message);
      }
    }, 100);
  });
  console.log('[watch] en attente de modifications dans strata/theme/ (Ctrl+C pour arrêter)');
}
