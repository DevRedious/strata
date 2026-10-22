# Notes sur le CSS de Discord

Ce document rassemble ce qui a été appris en construisant le thème : pièges, classes trouvées et méthodes qui marchent. Ce sont des observations faites sur Discord en octobre 2026 ; les noms de classes changent avec les mises à jour (`check-selectors.mjs` les vérifie).

## Méthode

1. **Chercher dans le CSS servi.** `css-query.mjs` interroge les quelque 1 270 feuilles de Discord, y compris celles chargées à la demande. C'est le plus rapide pour trouver une classe à partir de son nom (`find`), de son module (`mod`) ou de son contenu (`grep`).
2. **Sinon, utiliser l'inspecteur.** Il faut l'inspecteur de Discord (`Ctrl+Shift+I`, puis l'outil de sélection) quand un élément n'a pas de classe à lui (style inline), ou qu'on ne sait pas quel élément d'une pile est visible. Une capture des outils de développement suffit à lire les classes. Le mode sélection bloque le survol : pour inspecter quelque chose dans le tiroir, il faut d'abord passer `--ui-drawer: off`.
3. **Toujours vérifier sur capture.** Une règle peut viser une classe qui existe sans viser l'élément affiché (c'est arrivé pour l'onglet des paramètres et pour le fond des appels).

## Pièges

- **Ordre de chargement.** Les feuilles chargées à la demande par Discord arrivent **après** le thème : à spécificité égale, Discord gagne. On passe devant avec `:not(#_)`, qui ajoute la spécificité d'un ID sans rien cibler.
- **Variables de couleur.** Elles sont définies sur `.theme-dark` (et des classes `.theme-midnight` / `.theme-darker` apparaissent sur certains sous-arbres, comme la zone d'appel). Elles sont surchargées sur `:is(.theme-dark, .theme-darker, .theme-midnight):not(#_)`. La gamme `--brand-*` (blurple) est définie sur `:root` et `.visual-refresh`.
- **Styles inline.** Le compteur d'appel reçoit `font-family: var(--font-code)` directement sur l'élément. Il faut le viser avec `[style*="--font-code"]` et `!important`.
- **`overflow: hidden` sur un élément flex** autorise le navigateur à le rétrécir sous la largeur de son contenu. La liste des membres s'est retrouvée écrasée dans les forums ; `flex-shrink: 0` règle le problème.
- **Une adresse d'asset inconnue** renvoie la page HTML de Discord avec un statut 200, pas une erreur 404 : il faut vérifier le `content-type`.
- **Adresses des feuilles chargées à la demande.** Dans la table webpack de `web.*.js`, elles s'écrivent `<hash>.css`, sans l'id ; les entrées écrites en dur sont, elles, de la forme `<id>.<hash>.css`.

## Structure de la page (classes vérifiées)

- **Grille principale.** `.base__5e434`, avec les zones `titleBar`, `guildsList`, `channelsList` et `page`. La colonne de gauche `.sidebar__5e434` (sous-grille) contient `.guilds__5e434` (barre des serveurs), `.sidebarList__5e434` (salons) et `.panels__5e434` (panneau utilisateur, positionné en absolu en bas). Le contenu principal est `.page__5e434`.
- **Colonne repliée par Discord.** Discord sait replier la colonne lui-même (`.sidebar__5e434[data-collapsed="true"]`, en tirant la poignée `.sidebarResizeHandle__5e434`). Le tiroir se met alors en retrait.
- **Largeurs.** `--custom-guild-sidebar-width` est posé en ligne sur `<body>` quand on redimensionne ; `--custom-guild-list-width` est la largeur de la barre des serveurs.
- **Hauteur du panneau utilisateur.** Discord mesure le panneau et pose `--custom-app-panels-height` sur `<body>`. La barre des serveurs (`.wrapper_ef3116`) réserve cette hauteur en bas, ce qui permet au panneau compact de fonctionner sans rien calculer.
- **Chat.** `.chat_f75fb0` contient l'en-tête et `.content_f75fb0`, qui contient lui-même `.chatContent_f75fb0` (messages) et `.container_c8ffbb` (membres). L'en-tête porte `.container__9293f`, ainsi que `.title_f75fb0` dans les salons textuels seulement. Le chat d'un salon vocal n'a pas `.title_f75fb0`.
- **Messages et saisie.** Messages : module `_5126c` (`message`, `mentioned`, `messageListItem`…). Barre de saisie : `.channelTextArea__74017`. Barre « nouveaux messages » : `.newMessagesBar__0f481`, qui utilise `--brand-500`.
- **Liste des salons et des membres.** Elles utilisent un composant générique de liste piloté par des variables (`--interactive-background-selected`, `--channels-default`…). L'ancienne classe `containerDefault` n'existe plus.
- **Paramètres.** Onglets : `.item_caf372`, onglet sélectionné : `.active_caf372`.
- **Appels.** `.wrapper_cb9592` (états `fullScreen`, `sidebarOpen`, `noChat`, `video`) contient `.callContainer_cb9592`, qui est entièrement recouvert par `.root_bfe55a` ; les deux ont un fond noir. Le salon vocal de serveur utilise `.callContainer__722ff`. L'en-tête de l'appel est une surcouche qui se masque quand la souris est immobile.
- **Panneau utilisateur.** Compte : module `_37e49` (`container`, `avatar`, `accountPopoutButtonWrapper`, `nameTag`, `buttons`, `plated` quand une nameplate est présente). Discord masque `.nameTag__37e49` sous 100 px de large (requête de conteneur). Bloc « Voix connectée » : module `e131a9` (`container`, `channel`, `button`, `buttonColor`, `buttonActive`). Micro et casque : `.audioButtonParent__5e764`, `.audioButtonWithMenu__5e764` et la flèche `.buttonChevron__5e764`.
- **Barre de titre.** Module `c38106` (`bar`, `leading`, `trailing`, `title`, `winButtons`, `winButtonsWithDivider`, `winButton`, `winButtonMinMax`, `winButtonClose`). Dans `winButtons`, l'ordre est réduire, agrandir, fermer ; le séparateur est le `::before` du conteneur.

## Environnement de l'utilisateur

- **Écrans.** Trois écrans. Discord tourne sur celui de droite (DISPLAY2, 1920×1080, à droite de l'écran principal de 2560×1440).
- **Plugins Vencord.** Entre autres BetterFolders (ajoute une colonne de dossiers entre la barre des serveurs et les salons ; classe `.vc-betterFolders-sidebar`, grille modifiée par `.vc-betterFolders-sidebar-grid`), GameActivityToggle (manette dans le panneau), ReadAllNotificationsButton (« Read All » en haut de la barre) et un plugin qui affiche le nombre de membres en haut de la liste.
- **Ancien QuickCSS.** Le QuickCSS de l'utilisateur contient un vieux thème « BlackWhite » qui vise des classes de 2023, presque toutes mortes. On ne l'a pas touché.
