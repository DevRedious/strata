# Strata

Ce dépôt est un fork de Vencord. On y construit **Strata** : Vencord, plus un plugin maison (thème et menu de réglages), compilé et publié depuis `DevRedious/strata`. Lire d'abord `strata/README.md`, puis `strata/docs/ARCHITECTURE.md`, `strata/docs/ROADMAP.md` et `strata/docs/THEME-NOTES.md`.

Les règles de Vencord dans `AGENTS.md` s'appliquent : ne jamais créer d'issue ni de pull request.

## Règles du projet

- Répondre et documenter en français. Le code et ses identifiants restent en anglais, comme dans Vencord ; les commentaires de nos fichiers sont en français.
- Tout ce qui est propre à Strata vit dans `strata/`, et le plugin dans `src/plugins/strata/`. On ne modifie un fichier de Vencord que si c'est indispensable, et on note la modification dans `strata/docs/ARCHITECTURE.md` : chaque modification est un conflit possible lors des fusions avec `upstream`.
- Ne pas créer `src/plugins/strata/` sans son fichier `index` : un dossier de plugin vide casse la compilation.
- Commit et push uniquement à la demande de l'utilisateur.
- Avant toute action qui redémarre Discord ou remplace son installation de Vencord (`pnpm inject`…), demander l'accord de l'utilisateur : il peut être en appel.
- Vérifier chaque changement visuel sur capture (`strata/tools/screenshot/`) avant de dire qu'il fonctionne. Discord tourne sur l'écran de droite de l'utilisateur.
- Après une modification de classes, lancer `node strata/tools/check-selectors.mjs`.
