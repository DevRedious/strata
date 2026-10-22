/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

import { startTheme, stopTheme } from "./applyTheme";
import { settings } from "./settings";
import { renderTitlebarButton } from "./TitlebarButton";

export default definePlugin({
    name: "Strata",
    description: "Thème Strata : fond sombre, un accent couleur, panneaux flottants et liste des salons en tiroir.",
    authors: [Devs.DevRedious],
    enabledByDefault: true,
    // Le thème s'active et se retire à chaud ; seul le bouton attend un redémarrage
    requiresRestart: false,
    settings,

    patches: [
        {
            // Zone de droite de la barre de titre. On insère en tête de children
            // au lieu de remplacer le Fragment comme VencordToolbox : les deux
            // patches s'appliquent alors dans n'importe quel ordre.
            find: '?"BACK_FORWARD_NAVIGATION":',
            replacement: {
                match: /(trailing:.{0,80}?\{children:\[)/,
                replace: "$1$self.renderTitlebarButton(),"
            }
        }
    ],

    renderTitlebarButton,

    start: startTheme,
    stop: stopTheme,
});
