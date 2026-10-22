# Architecture de Strata

## L'objectif

Proposer à l'utilisateur et à ses collègues un Discord personnalisé, avec un menu de réglages intégré (couleurs, tiroir activé ou non, espacements, activation de chaque partie) et des mises à jour automatiques qui ne dépendent que de nous.

## Pourquoi une distribution de Vencord

Plusieurs approches ont été comparées le 2026-10-22.

| Option | Verdict |
|---|---|
| Thème CSS seul, diffusé par lien (« Thèmes en ligne » de Vencord) | Installation très simple, mais pas de menu de réglages : le CSS ne sait ni réagir à un clic ni garder un état. Écarté, le menu étant un objectif. |
| Plugin dans un Vencord officiel | Impossible : Vencord ne charge pas de plugins externes, un plugin doit être compilé avec Vencord. |
| Plugin BetterDiscord qui se met à jour seul | Faisable, mais il faudrait abandonner Vencord et ses plugins (BetterFolders, GameActivityToggle… sont utilisés). |
| Autres clients modifiés (moonlight, shelter) | Écosystèmes plus petits ; cohabitation avec Vencord non confirmée. |
| Notre propre injecteur | Revient à réécrire Vencord. |
| **Distribution de Vencord (modèle Equicord)** | **Retenue.** Vencord plus notre plugin, compilés et publiés par nous. |

## Comment les mises à jour arrivent chez les utilisateurs

L'outil de mise à jour de Vencord (`src/main/updater/http.ts`) interroge `https://api.github.com/repos/${gitRemote}/releases/latest` :

- **Le dépôt interrogé.** `gitRemote` est fixé au moment de la compilation. Une version compilée depuis ce dépôt interroge donc `DevRedious/strata`.
- **La version.** Le hash de commit est lu dans le **dernier mot du nom de la release**, puis comparé au hash compilé.
- **Les fichiers.** Les fichiers de la release dont le nom commence par une entrée de `VENCORD_FILES` sont téléchargés, puis écrits à la place des fichiers en cours d'utilisation.

À vérifier avant de mettre en place les releases : la manière exacte dont `scripts/build/common.mjs` calcule `gitRemote` (remote `origin` ou `package.json`), le format exact du nom des releases, et les fichiers attendus. Le workflow GitHub Actions de Vencord qui publie ses « devbuild » dans `.github/workflows/` sert de modèle.

## Pourquoi un dépôt public

- **Les mises à jour l'exigent.** L'outil de mise à jour interroge l'API GitHub sans s'authentifier : les releases d'un dépôt privé lui seraient invisibles.
- **GitHub Actions est gratuit et illimité sur un dépôt public** (runners standards), selon l'annonce des tarifs 2026 de GitHub.
- **Vencord est sous licence GPL v3.** Distribuer une version modifiée oblige à fournir le code source à ceux qui la reçoivent.

Conséquence : aucun secret ne doit être versionné ici. Les workflows de publication utilisent le `GITHUB_TOKEN` fourni automatiquement par GitHub.

## Organisation du dépôt

- **Remotes.** `origin` pointe sur `DevRedious/strata`, `upstream` sur `Vendicated/Vencord`.
- **Dépôt indépendant, pas un fork GitHub.** Le fork d'origine a été remplacé le 2026-10-22 par un dépôt ordinaire qui contient tout l'historique de Vencord. Les fusions avec `upstream` fonctionnent pareil, puisque Git ne dépend que de l'historique commun. On y gagne : plus de PR proposées par défaut vers Vendicated/Vencord, GitHub Actions actif d'office, et un dépôt présenté comme un produit à part entière.
- **Workflows de Vencord.** Les cinq workflows de `.github/workflows/` publient uniquement si `github.repository == 'Vendicated/Vencord'`. Chez nous, `build.yml` et `test.yml` se contentent de compiler et de tester, et les autres ne font rien : aucun n'a besoin d'être modifié.
- **Ce qui nous appartient.** Notre code vit dans `strata/` (thème, outils, documentation). Le plugin ira dans `src/plugins/strata/`, puisque Vencord ne compile comme plugins que les dossiers de `src/plugins/` et `src/userplugins/`, et que ce dernier est ignoré par Git. Un dossier entièrement nouveau ne crée pas de conflit lors des fusions avec Vencord.
- **Attention.** Un dossier dans `src/plugins/` sans fichier `index` casse la compilation : le plugin ne doit y être créé qu'avec son code.
- **Fichiers de Vencord.** On ne les modifie que lorsque c'est indispensable (par exemple pour rebaptiser la distribution ou l'outil de mise à jour), et chaque modification est notée ici. Lors d'une fusion avec `upstream`, on garde notre version de ces fichiers.

  | Fichier | Modification | Depuis |
  |---|---|---|
  | `README.md` | Remplacé par le README de Strata, qui crédite Vencord et rappelle la licence. | 2026-10-22 |
  | `src/utils/constants.ts` | Entrée `DevRedious` dans `Devs`, juste après `Ven`. `scripts/generatePluginList.ts` (lancé par `pnpm test` et par le workflow de build) n'accepte que des auteurs de la forme `Devs.Nom`. | 2026-10-22 |
- **Mises à jour de Vencord.** On les récupère avec `git fetch upstream && git merge upstream/main` ; une tâche planifiée GitHub Actions le fera automatiquement.

## Installation chez un collègue (à construire)

Le principe est celui de l'installeur officiel de Vencord :

1. télécharger les fichiers de la dernière release de Strata dans un dossier de l'utilisateur ;
2. modifier le `app.asar` de Discord pour qu'il charge ces fichiers ;
3. réinstaller après une mise à jour majeure de Discord, comme pour Vencord.

L'installeur de Vencord ([Vencord/Installer](https://github.com/Vencord/Installer), en Go) lit l'adresse de ses releases dans des constantes (`ReleaseUrl`). Les deux pistes sont de forker cet installeur, comme Equicord l'a fait avec Equilotl, ou d'écrire un script PowerShell pour Windows.

Strata remplace le Vencord officiel sur le poste. Les réglages de Vencord sont stockés dans `%APPDATA%\Vencord\settings\settings.json` ; il reste à vérifier qu'une installation de Strata par-dessus un Vencord existant les reprend bien.

## Conditions d'utilisation de Discord

Comme tout client modifié, Vencord, et donc Strata, est contraire aux conditions d'utilisation de Discord. Les bannissements pour un simple thème sont quasi inexistants, mais chaque utilisateur installe en connaissance de cause. Il faut le dire clairement dans la documentation destinée aux collègues.
