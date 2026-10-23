# Strata

Strata est une distribution de [Vencord](https://github.com/Vendicated/Vencord) : Vencord, plus un plugin maison qui habille Discord et ajoute un menu de réglages. Elle est compilée et publiée depuis ce dépôt. Une fois Strata installé, l'outil de mise à jour intégré à Vencord récupère ses mises à jour dans les releases de `DevRedious/strata`, et non plus dans celles de Vencord.

Ce dossier `strata/` contient tout ce qui est propre au projet. Le reste du dépôt est Vencord, à modifier le moins possible pour que les mises à jour de Vencord s'intègrent sans conflit. Le choix de cette architecture est expliqué dans [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), et les étapes à venir sont listées dans [docs/ROADMAP.md](docs/ROADMAP.md).

## État actuel

Le thème est appliqué par le plugin `src/plugins/strata/`, activé par défaut, et vérifié visuellement dans Discord. Ses réglages (accent, fonds, espacement, arrondis, délais du tiroir, un interrupteur par partie, export et import) s'ouvrent dans une fenêtre sur mesure, depuis le bouton Strata de la barre de titre ; la liste standard de Vencord (Paramètres → Vencord → Plugins → Strata) reste disponible en secours. Chaque modification de `src/` publie une release que l'outil de mise à jour de Vencord récupère, et le launcher [DevRedious/strata-launcher](https://github.com/DevRedious/strata-launcher) installe Strata sans ligne de commande.

Ce que fait le thème :

- **Couleurs.** Fond très sombre, une seule couleur d'accent (violet `#7c6cff` par défaut), appliquée via les variables de Discord.
- **Panneaux flottants.** La liste des salons, l'en-tête, le chat, la liste des membres et la zone d'appel deviennent des cartes arrondies séparées par un espace.
- **Liste des salons en tiroir.** Repliée, elle laisse seulement la barre des serveurs ; elle s'ouvre par-dessus le chat au survol. Le panneau utilisateur reste visible en version compacte.
- **Panneau utilisateur.** Survol des boutons à l'accent, nom et statut plus lisibles sur une bannière (nameplate), compteur d'appel en police normale.
- **Barre de titre.** Boutons de fenêtre en pastilles façon macOS.

## Structure

Le plugin vit hors de ce dossier, dans `src/plugins/strata/` : Vencord ne compile que les plugins de `src/plugins/`.

| Chemin (depuis la racine du dépôt) | Rôle |
|---|---|
| `src/plugins/strata/index.ts` | Déclaration du plugin et patch de la barre de titre. |
| `src/plugins/strata/TitlebarButton.tsx` | Bouton Strata de la barre de titre. Le patch l'insère en tête de la zone de droite, sans remplacer le `Fragment` comme VencordToolbox : les deux plugins cohabitent. |
| `src/plugins/strata/titlebar.css` | Style du bouton (`no-drag`, sinon la barre de titre intercepte le clic). |
| `src/plugins/strata/StrataIcon.tsx` | Logo en icône, à la couleur des icônes de Discord (`currentColor`). |
| `src/plugins/strata/colors.ts` | Validation des couleurs, surfaces dérivées du fond, couleur du texte posé sur l'accent. |
| `src/plugins/strata/menu/` | Fenêtre de réglages Strata : `StrataModal.tsx` (fenêtre et navigation), `sections/` (Thèmes, Couleurs, Texte, Disposition, Effets, Tiroir, Mode épuré, Parties, Partager), `controls.tsx` (titres, interrupteurs, pastilles à choix, curseurs avec présélections), `Slider.tsx` et `ColorPicker.tsx` (curseur et sélecteur de couleur maison), `LayoutPreview.tsx` (aperçu miniature qui suit les réglages), `drag.ts` (glisser et écriture espacée des réglages), `state.ts` (valeurs par défaut, réinitialisation), `transfer.ts` (export et import, avec la validation de chaque réglage), `themes.ts` (galerie et thèmes enregistrés dans le DataStore), `presets.ts`, `icons.tsx`. Chaque composant a son fichier CSS ; `menu.css` porte la fenêtre. |
| `src/plugins/strata/settings.ts` | Options du plugin et leurs valeurs par défaut. |
| `src/plugins/strata/image.ts` | Image de fond choisie sur l'ordinateur : réduite à 2 560 px, gardée dans le DataStore de Vencord (IndexedDB, pas dans `settings.json` ni la synchronisation cloud), affichée par une adresse `blob:`. Calcule aussi sa couleur moyenne, qui teinte les panneaux. |
| `src/plugins/strata/applyTheme.ts` | Active ou retire chaque fichier du thème, et écrit les valeurs choisies en variables CSS dans sa propre balise `<style>` (pas dans l'attribut `style` de `<html>`, que Discord réécrit quand la fenêtre perd le focus). |
| `src/plugins/strata/styles/10-settings.css` | Valeurs par défaut des variables du thème (couleurs, espacements, arrondis, tiroir). |
| `src/plugins/strata/styles/20-discord-tokens.css` | Branche ces variables sur celles de Discord. Toujours actif, comme `10`. |
| `src/plugins/strata/styles/25-accent.css` | Accent en dégradé (boutons principaux, accueil, salon actif, mentions) et couleurs des pastilles de statut. Toujours actif ; sans réglage modifié, ne change rien. |
| `src/plugins/strata/styles/30-layout.css` | Disposition en panneaux flottants, avec leurs bordures, ombres et la lueur du chat (section Effets). |
| `src/plugins/strata/styles/35-glass.css` | Fonds « Translucide » et « Image » : les panneaux reprennent les calques des thèmes Nitro de Discord (`--background-gradient-*`), actifs avec la classe `custom-theme-background` que le plugin pose sur `<html>`. Activé seulement dans ce mode. |
| `src/plugins/strata/styles/40-chat.css` | Messages et barre de saisie. |
| `src/plugins/strata/styles/45-text.css` | Section Texte : taille du texte des messages, espacement, forme des avatars et des icônes de serveur. Aux valeurs par défaut, Discord garde ses propres réglages d'accessibilité. |
| `src/plugins/strata/styles/50-settings.css` | Paramètres utilisateur de Discord. |
| `src/plugins/strata/styles/60-voice.css` | Salons vocaux et appels. |
| `src/plugins/strata/styles/70-drawer.css` | Liste des salons en tiroir et panneau utilisateur compact. |
| `src/plugins/strata/styles/80-panel.css` | Panneau utilisateur et bloc « Voix connectée ». |
| `src/plugins/strata/styles/85-effects.css` | Lueur du champ de saisie et animations, activées par des requêtes `@container style(--ui-…: on)`. |
| `src/plugins/strata/styles/95-clean.css` | Mode épuré : un bloc `@container style(--ui-hide-…: on)` par élément masquable. |
| `src/plugins/strata/styles/90-winbuttons-*.css` | Boutons de fenêtre (réduire, agrandir, fermer), un fichier par style : `mac` (pastilles), `strata` (boutons arrondis, par défaut), `pill` (capsule). Le style « Discord » n'en active aucun. |
| `src/plugins/strata/styles/.stylelintrc.json` | Assouplit le stylelint de Vencord pour un thème : classes hachées de Discord, `:not(#_)`, spécificité. |

| Chemin (dans `strata/`) | Rôle |
|---|---|
| `assets/` | Logo Strata en SVG, noir et blanc. |
| `site/` | Site public [devredious.github.io/strata](https://devredious.github.io/strata/), bilingue (français à la racine, anglais dans `en/`) : accueil, téléchargement et guide d'installation, confidentialité, politique de signature. HTML et CSS sans compilation, publié par `.github/workflows/strata-pages.yml`. Aucune capture du vrai Discord de l'utilisateur : elles montreraient ses conversations. |
| `tools/discord-css.mjs` | Télécharge le CSS servi par Discord et le met en cache. |
| `tools/check-selectors.mjs` | Vérifie que les classes du thème existent encore chez Discord. |
| `tools/css-query.mjs` | Cherche des classes et des règles dans le CSS de Discord. |
| `tools/screenshot/` | Captures de l'écran où tourne Discord, pour vérifier un rendu. |
| `docs/` | Architecture, feuille de route, notes sur le CSS de Discord. |

## Travailler sur le thème

Toutes les commandes se lancent depuis la racine du dépôt.

```bash
pnpm watch
```

Cette commande recompile Vencord, et donc le plugin et son CSS, à chaque modification. Il suffit ensuite de recharger Discord (`Ctrl+R`). Cela suppose que Discord charge la version compilée de ce dépôt, ce que fait `pnpm inject -branch stable` une fois pour toutes. **Demander l'accord de l'utilisateur avant** : l'injection remplace son Vencord et redémarre Discord, ce qui coupe un appel en cours. Discord charge ensuite Vencord directement depuis `dist/` : supprimer ce dossier le laisse sans Vencord ni Strata jusqu'à la prochaine compilation.

Les fichiers de `styles/` passent par le stylelint de Vencord (`pnpm lint-styles`), lancé par `pnpm test`.

Après une mise à jour de Discord, ou avant de publier :

```bash
node strata/tools/check-selectors.mjs
```

Le script télécharge le CSS que Discord sert actuellement (environ 1 270 feuilles) et liste les classes du thème qui n'existent plus.

Pour trouver la classe d'un élément :

```bash
node strata/tools/css-query.mjs find '^navItem$'          # noms de classes
node strata/tools/css-query.mjs mod _5e434                # toutes les classes d'un module
node strata/tools/css-query.mjs rules sidebar__5e434      # règles d'une classe
node strata/tools/css-query.mjs grep 'var\(--font-code\)' # règles contenant un motif
```

Ces requêtes travaillent sur un cache dans `strata/.cache/`, qui n'est pas versionné ; `check-selectors` le rafraîchit, et `--refresh` force un nouveau téléchargement. Certains éléments n'ont pas de classe dédiée (le compteur d'appel reçoit sa police en style inline, par exemple) : dans ce cas, la seule méthode fiable est l'inspecteur de Discord (`Ctrl+Shift+I`). Les cas déjà rencontrés sont dans [docs/THEME-NOTES.md](docs/THEME-NOTES.md).

## Vérifier un rendu

`tools/screenshot/shot.ps1 <nom>` capture l'écran le plus à droite, celui où tourne Discord sur le poste de développement, dans `%TEMP%\strata-shots\<nom>.png`.

`tools/screenshot/hover-shot.ps1 <nom> "x1,y1;x2,y2"` déplace le curseur par petits pas jusqu'aux points donnés (coordonnées relatives à cet écran), fait la capture, puis remet le curseur où il était. Ça permet de vérifier les états de survol, comme le tiroir ouvert, sans demander à l'utilisateur de bouger la souris.

`tools/screenshot/click-shot.ps1 <nom> "x1,y1;x2,y2"` clique sur chaque point tour à tour, fait la capture, puis remet le curseur. Il sert à parcourir la fenêtre de réglages. Avant de cliquer, vérifier que Discord est au premier plan et que l'utilisateur ne travaille pas sur cet écran : un clic peut sinon atterrir dans une autre fenêtre.

`tools/screenshot/scroll-shot.ps1 <nom> "x,y" -Notches -5` tourne la molette au point donné (négatif : vers le bas), puis capture : pour voir le bas d'une section de la fenêtre.

Les quatre scripts prennent `-Screen left` quand Discord est sur l'écran le plus à gauche. Les positions des boutons bougent avec les réglages (une police plus large décale la fenêtre, masquer l'aide décale le bouton Strata) : refaire une capture avant chaque série de clics.
