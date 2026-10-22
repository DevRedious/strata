<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="strata/assets/logo-blanc.svg" />
    <img src="strata/assets/logo-noir.svg" alt="Logo Strata" width="120" />
  </picture>

  <p align="center">
    <img src="https://img.shields.io/badge/Discord-Desktop-5865F2?logo=discord&amp;logoColor=white" alt="Discord Desktop">
    <img src="https://img.shields.io/badge/Vencord-1.15.12-D3869B" alt="Vencord 1.15.12">
    <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&amp;logoColor=white" alt="TypeScript 6.0">
    <img src="https://img.shields.io/badge/Node.js-22%2B-5FA04E?logo=nodedotjs&amp;logoColor=white" alt="Node.js 22+">
    <img src="https://img.shields.io/badge/esbuild-0.28-FFCF00?logo=esbuild&amp;logoColor=black" alt="esbuild 0.28">
    <img src="https://img.shields.io/badge/pnpm-11.9-F69220?logo=pnpm&amp;logoColor=white" alt="pnpm 11.9">
    <img src="https://img.shields.io/badge/ESLint-10.6-4B32C3?logo=eslint&amp;logoColor=white" alt="ESLint 10.6">
    <img src="https://img.shields.io/badge/Stylelint-17.14-263238?logo=stylelint&amp;logoColor=white" alt="Stylelint 17.14">
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Accent-%237C6CFF-7C6CFF" alt="Accent #7C6CFF">
    <img src="https://img.shields.io/badge/Fond-%230A0B0F-0A0B0F" alt="Fond #0A0B0F">
    <img src="https://img.shields.io/badge/Surface-%23111318-111318" alt="Surface #111318">
    <img src="https://img.shields.io/badge/Licence-GPL--3.0-A42E2B?logo=gnu&amp;logoColor=white" alt="Licence GPL-3.0">
  </p>

  <p align="center">
    <i>Une distribution de Vencord pour Discord, avec un thème et un menu de réglages intégrés.</i><br>
    Dépôt  <a href="https://github.com/DevRedious/strata">DevRedious/strata</a>
  </p>
</div>

---

> **État : en développement.** Le plugin applique le thème et ajoute son bouton dans la barre de
> titre. La fenêtre de réglages sur mesure, les releases automatiques et l'installeur sont à
> venir : voir la [feuille de route](strata/docs/ROADMAP.md).

## Présentation

Strata, c'est [Vencord](https://github.com/Vendicated/Vencord) plus un plugin maison, compilés et
publiés depuis ce dépôt. Le plugin habille Discord et s'ouvre depuis un bouton de la barre de titre.
Une fois Strata installé, l'outil de mise à jour de Vencord récupère les nouvelles versions dans les
releases de `DevRedious/strata`, et non plus dans celles de Vencord.

Les plugins de Vencord restent tous disponibles.

## Le thème

- **Couleurs.** Fond très sombre et une seule couleur d'accent (violet `#7c6cff` par défaut),
  appliquée via les variables de Discord.
- **Panneaux flottants.** La liste des salons, l'en-tête, le chat, la liste des membres et la zone
  d'appel deviennent des cartes arrondies séparées par un espace.
- **Liste des salons en tiroir.** Repliée, elle laisse seulement la barre des serveurs ; elle
  s'ouvre par-dessus le chat au survol. Le panneau utilisateur reste visible en version compacte.
- **Panneau utilisateur.** Survol des boutons à l'accent, nom et statut lisibles sur une
  nameplate, compteur d'appel en police normale.
- **Barre de titre.** Boutons de fenêtre en pastilles façon macOS, et bouton des réglages Strata.

Chaque partie s'active ou se désactive séparément. L'accent, l'espacement, les arrondis et les
délais du tiroir se règlent sans redémarrer Discord.

## Installation

Pas encore disponible : l'installeur pour Windows fait partie de la phase 3 de la
[feuille de route](strata/docs/ROADMAP.md).

## Développement

Tout ce qui est propre à Strata vit dans [`strata/`](strata/) (outils, documentation, logo) et dans
[`src/plugins/strata/`](src/plugins/strata/) (le plugin et son CSS). Le reste du dépôt est Vencord,
modifié le moins possible pour suivre ses mises à jour sans conflit.

- [strata/README.md](strata/README.md) : structure, commandes, travail sur le thème.
- [strata/docs/ARCHITECTURE.md](strata/docs/ARCHITECTURE.md) : pourquoi une distribution de
  Vencord, mises à jour, organisation du dépôt.
- [strata/docs/THEME-NOTES.md](strata/docs/THEME-NOTES.md) : ce qu'on a appris du CSS de Discord.

## Basé sur Vencord

Strata est un projet indépendant, ni affilié à Vencord ni soutenu par ses auteurs. Tout le code
hors `strata/` et `src/plugins/strata/` vient de [Vencord](https://github.com/Vendicated/Vencord),
par Vendicated et ses contributeurs, dont l'historique est conservé dans ce dépôt.

Comme Vencord, Strata est distribué sous licence [GPL-3.0-or-later](LICENSE).

## Avertissement

Discord est une marque de Discord Inc., citée ici à titre descriptif ; Strata n'a aucun lien avec
Discord Inc.

Comme tout client modifié, Strata est contraire aux conditions d'utilisation de Discord. Aucun
bannissement pour l'usage d'un client modifié n'est connu à ce jour, mais chacun l'installe en
connaissance de cause. Pour un compte dont la perte serait grave, mieux vaut ne pas utiliser de
client modifié.
