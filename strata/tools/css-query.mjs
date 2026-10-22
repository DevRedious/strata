// Fouille le CSS de Discord pour trouver les classes d'un élément.
//   node strata/tools/css-query.mjs mod <hash...>        classes d'un module (ex. 5e434, _5e434)
//   node strata/tools/css-query.mjs rules <classe...>    règles d'une classe (ex. sidebar__5e434)
//   node strata/tools/css-query.mjs find <regex>         classes dont le nom correspond (sans le hash)
//   node strata/tools/css-query.mjs grep <regex> [max]   règles dont le texte correspond
// Ajouter --refresh pour retélécharger le CSS (sinon le cache est utilisé).
import { discordSheets } from './discord-css.mjs';

const args = process.argv.slice(2).filter((a) => a !== '--refresh');
const [cmd, ...rest] = args;
const sheets = await discordSheets({ refresh: process.argv.includes('--refresh') });

// Découpe naïve en règles : suffisante pour des feuilles minifiées
const rules = [];
for (const { css } of sheets) {
  for (const chunk of css.split('}')) {
    const i = chunk.lastIndexOf('{');
    if (i < 0) continue;
    const before = chunk.slice(0, i);
    rules.push({ selector: before.slice(before.lastIndexOf('{') + 1).trim(), body: chunk.slice(i + 1) });
  }
}

const CLASS_IN_SELECTOR = /\.([A-Za-z][A-Za-z0-9-]*)_(_?[a-f0-9]{5,6})(?![A-Za-z0-9_-])/g;
const show = (r) => console.log(`  ${r.selector.slice(0, 200)} { ${r.body.slice(0, 300)} }`);

if (cmd === 'mod') {
  for (const hash of rest) {
    const names = new Set();
    for (const r of rules) for (const [, name, h] of r.selector.matchAll(CLASS_IN_SELECTOR)) if (h === hash) names.add(name);
    console.log(`== ${hash}: ${[...names].join(' ') || '(aucune classe)'}`);
  }
} else if (cmd === 'rules') {
  for (const cls of rest) {
    const re = new RegExp(`\\.${cls}(?![A-Za-z0-9_-])`);
    const hits = [...new Map(rules.filter((r) => re.test(r.selector)).map((r) => [r.selector + r.body, r])).values()];
    console.log(`== ${cls} (${hits.length} règle(s))`);
    hits.slice(0, 15).forEach(show);
  }
} else if (cmd === 'find') {
  const re = new RegExp(rest[0]);
  const found = new Set();
  for (const r of rules) for (const [, name, h] of r.selector.matchAll(CLASS_IN_SELECTOR)) if (re.test(name)) found.add(`${name}_${h}`);
  console.log([...found].sort().join('\n') || '(aucune)');
} else if (cmd === 'grep') {
  const re = new RegExp(rest[0]);
  const max = Number(rest[1]) || 30;
  rules.filter((r) => re.test(`${r.selector}{${r.body}}`)).slice(0, max).forEach(show);
} else {
  console.log('Commandes : mod <hash...> | rules <classe...> | find <regex> | grep <regex> [max]  (--refresh)');
}
