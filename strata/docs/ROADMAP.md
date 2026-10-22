# Feuille de route

## Fait

- [x] Thème complet, vérifié visuellement sur les salons textuels, les forums, les fils, la page Amis, les paramètres, les salons vocaux et leur chat, les profils, le tiroir ouvert et fermé, et le panneau utilisateur.
- [x] Outils : vérification des classes, recherche dans le CSS de Discord, assemblage et installation du thème, captures d'écran.
- [x] Fork public `DevRedious/strata`, avec Vencord déclaré comme `upstream`.
- [x] Architecture choisie et documentée ([ARCHITECTURE.md](ARCHITECTURE.md)).

## Phase 1 : le plugin et le menu, testés en local

- [ ] Étudier le fonctionnement interne de Vencord : `definePlugin` et `definePluginSettings`, types d'options, injection de CSS (`?managed`), ouverture de la fenêtre de réglages d'un plugin, et la façon dont VencordToolbox ajoute son bouton dans la barre du haut.
- [ ] Créer `src/plugins/strata/` : un plugin activé par défaut, qui injecte le thème (déplacer `strata/theme/` dedans, ou l'importer) et applique les réglages en posant des variables CSS sur `:root`.
- [ ] Options du menu, construites à partir de `theme/10-settings.css` : couleur d'accent (et couleur du texte posé dessus), tiroir activé ou non, délais d'ouverture et de fermeture, espacement, arrondis, et un interrupteur par partie du thème (panneaux, tiroir, panneau compact, pastilles de fenêtre…).
- [ ] Bouton dans la barre de titre qui ouvre le menu.
- [ ] Adapter `check-selectors.mjs` au nouvel emplacement du CSS.
- [ ] Compiler (`pnpm install`, `pnpm build`) puis injecter (`pnpm inject`) chez l'utilisateur. **Demander son accord avant** : l'injection remplace son Vencord officiel, et Discord doit redémarrer, ce qui coupe un appel en cours.
- [ ] Une fois le plugin en place, désactiver puis supprimer l'ancien thème `nocturne.theme.css` de `%APPDATA%\Vencord\themes`, pour ne pas appliquer le thème deux fois.

## Phase 2 : releases automatiques

- [ ] Vérifier comment `gitRemote` et `gitHash` sont calculés, ainsi que le format attendu pour les releases (voir [ARCHITECTURE.md](ARCHITECTURE.md)).
- [ ] Workflow de compilation et de publication des releases, sur le modèle de celui de Vencord, avec le bon nom de release et les bons fichiers.
- [ ] Workflow planifié qui fusionne `upstream/main`, compile, et ne publie que si la compilation réussit.
- [ ] Activer GitHub Actions sur le fork : c'est désactivé par défaut sur un fork.
- [ ] Rebaptiser l'outil de mise à jour (nom affiché, lien vers le dépôt) si nécessaire.

## Phase 3 : installation par les collègues

- [ ] Installeur Windows (fork de Vencord/Installer, ou script PowerShell).
- [ ] Vérifier qu'une installation par-dessus un Vencord existant reprend les réglages.
- [ ] Guide d'installation pour les collègues, mentionnant les conditions d'utilisation de Discord.
- [ ] README de Strata à la racine du dépôt (celui de Vencord y est encore).

## Idées en attente

- Masquer d'autres éléments de la barre de titre (flèches précédent et suivant, bouton d'aide), proposé mais pas demandé.
- Page de configuration web qui génère un QuickCSS, inutile une fois le menu en place.
