# Feuille de route

## Fait

- [x] Thème complet, vérifié visuellement sur les salons textuels, les forums, les fils, la page Amis, les paramètres, les salons vocaux et leur chat, les profils, le tiroir ouvert et fermé, et le panneau utilisateur.
- [x] Outils : vérification des classes, recherche dans le CSS de Discord, assemblage et installation du thème, captures d'écran.
- [x] Dépôt public `DevRedious/strata`, indépendant (pas un fork GitHub) mais avec tout l'historique de Vencord, déclaré comme `upstream`.
- [x] Architecture choisie et documentée ([ARCHITECTURE.md](ARCHITECTURE.md)).

## Phase 1 : le plugin et le menu, testés en local

- [x] Étudier le fonctionnement interne de Vencord : `definePlugin` et `definePluginSettings`, types d'options, injection de CSS (`?managed`), ouverture de la fenêtre de réglages d'un plugin, et la façon dont VencordToolbox ajoute son bouton dans la barre du haut.
- [x] Créer `src/plugins/strata/` : plugin activé par défaut, thème déplacé dans `styles/` (un style `?managed` par fichier), réglages posés en variables CSS sur `<html>`. Rendu vérifié sur capture le 2026-10-22.
- [ ] Fenêtre de réglages sur mesure (centrée) : pastilles d'accent et sélecteur libre, couleur de fond (surfaces dérivées), réinitialisation, export / import. Les options existent déjà dans `settings.ts` ; reste la fenêtre. Options : couleur d'accent (et couleur du texte posé dessus), tiroir activé ou non, délais d'ouverture et de fermeture, espacement, arrondis, et un interrupteur par partie du thème (panneaux, tiroir, panneau compact, pastilles de fenêtre…).
- [x] Bouton dans la barre de titre (logo Strata) qui ouvre les réglages. Vérifié sur capture : icône, infobulle, clic. Reste à le vérifier avec VencordToolbox activé (les deux patches ont été testés sur le code de Discord, dans les deux ordres).
- [x] Adapter `check-selectors.mjs` au nouvel emplacement du CSS.
- [x] Compiler (`pnpm install`, `pnpm build`) puis injecter (`pnpm inject`) chez l'utilisateur. **Demander son accord avant** : l'injection remplace son Vencord officiel, et Discord doit redémarrer, ce qui coupe un appel en cours.
- [x] Désactiver l'ancien thème `nocturne.theme.css`, ainsi que l'entrée `midnight.theme.css`, dont le fichier n'existait plus.
- [ ] Supprimer le fichier `nocturne.theme.css` de `%APPDATA%\Vencord\themes`, puis `strata/tools/build-theme.mjs`, devenu inutile.
- [ ] Vérifier sur capture que chaque option s'applique en direct (accent, espacement, arrondis, délais, interrupteurs).

## Phase 2 : releases automatiques

- [ ] Vérifier comment `gitRemote` et `gitHash` sont calculés, ainsi que le format attendu pour les releases (voir [ARCHITECTURE.md](ARCHITECTURE.md)).
- [ ] Workflow de compilation et de publication des releases, sur le modèle de celui de Vencord, avec le bon nom de release et les bons fichiers.
- [ ] Workflow planifié qui fusionne `upstream/main`, compile, et ne publie que si la compilation réussit.
- [ ] Rebaptiser l'outil de mise à jour (nom affiché, lien vers le dépôt) si nécessaire.

## Phase 3 : installation par les collègues

- [ ] Installeur Windows (fork de Vencord/Installer, ou script PowerShell).
- [ ] Vérifier qu'une installation par-dessus un Vencord existant reprend les réglages.
- [ ] Guide d'installation pour les collègues, mentionnant les conditions d'utilisation de Discord.
- [x] README de Strata à la racine du dépôt, au format des projets ark-management (2026-10-22). À compléter avec le guide d'installation.

## Idées en attente

- Masquer d'autres éléments de la barre de titre (flèches précédent et suivant, bouton d'aide), proposé mais pas demandé.
- Page de configuration web qui génère un QuickCSS, inutile une fois le menu en place.
