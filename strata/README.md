# Strata

Strata est une distribution de [Vencord](https://github.com/Vendicated/Vencord) : Vencord, plus un plugin maison qui habille Discord et ajoute un menu de réglages. Elle est compilée et publiée depuis ce dépôt. Une fois Strata installé, l'outil de mise à jour intégré à Vencord récupère ses mises à jour dans les releases de `DevRedious/strata`, et non plus dans celles de Vencord.

Ce dossier `strata/` contient tout ce qui est propre au projet. Le reste du dépôt est Vencord, à modifier le moins possible pour que les mises à jour de Vencord s'intègrent sans conflit. Le choix de cette architecture est expliqué dans [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), et les étapes à venir sont listées dans [docs/ROADMAP.md](docs/ROADMAP.md).

## État actuel

Le thème est terminé et vérifié visuellement dans Discord, mais il fonctionne encore comme un thème Vencord classique (un fichier CSS). Le plugin, le menu de réglages, les releases et l'installeur ne sont pas encore faits.

Ce que fait le thème :

- **Couleurs.** Fond très sombre, une seule couleur d'accent (violet `#7c6cff` par défaut), appliquée via les variables de Discord.
- **Panneaux flottants.** La liste des salons, l'en-tête, le chat, la liste des membres et la zone d'appel deviennent des cartes arrondies séparées par un espace.
- **Liste des salons en tiroir.** Repliée, elle laisse seulement la barre des serveurs ; elle s'ouvre par-dessus le chat au survol. Le panneau utilisateur reste visible en version compacte.
- **Panneau utilisateur.** Survol des boutons à l'accent, nom et statut plus lisibles sur une bannière (nameplate), compteur d'appel en police normale.
- **Barre de titre.** Boutons de fenêtre en pastilles façon macOS.

## Structure

| Chemin | Rôle |
|---|---|
| `theme/10-settings.css` | Réglages : couleurs, espacements, arrondis, tiroir. Ce sont eux qui deviendront les options du menu. |
| `theme/20-discord-tokens.css` | Branche les réglages sur les variables de couleur de Discord. |
| `theme/30-layout.css` | Disposition en panneaux flottants. |
| `theme/40-chat.css` | Messages et barre de saisie. |
| `theme/50-settings.css` | Paramètres utilisateur de Discord. |
| `theme/60-voice.css` | Salons vocaux et appels. |
| `theme/70-drawer.css` | Liste des salons en tiroir et panneau utilisateur compact. |
| `theme/80-panel.css` | Panneau utilisateur et bloc « Voix connectée ». |
| `theme/90-titlebar.css` | Barre de titre. |
| `tools/discord-css.mjs` | Télécharge le CSS servi par Discord et le met en cache. |
| `tools/check-selectors.mjs` | Vérifie que les classes du thème existent encore chez Discord. |
| `tools/css-query.mjs` | Cherche des classes et des règles dans le CSS de Discord. |
| `tools/build-theme.mjs` | Assemble le thème en un fichier et l'installe dans Vencord. |
| `tools/screenshot/` | Captures de l'écran où tourne Discord, pour vérifier un rendu. |
| `docs/` | Architecture, feuille de route, notes sur le CSS de Discord. |

## Travailler sur le thème

Toutes les commandes se lancent depuis la racine du dépôt.

```bash
node strata/tools/build-theme.mjs --install --watch
```

Cette commande reconstruit `strata.theme.css` à chaque modification de `strata/theme/` et le copie dans `%APPDATA%\Vencord\themes`. Vencord recharge un thème installé dès que le fichier change ; il faut seulement l'activer une fois dans Paramètres → Vencord → Thèmes.

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
