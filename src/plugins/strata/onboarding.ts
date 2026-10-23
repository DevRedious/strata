/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { UserStore } from "@webpack/common";

import { LATEST_CHANGELOG, unseenEntries } from "./menu/changelog";
import { openChangelog, openWelcome } from "./menu/Dialogs";
import { settings } from "./settings";

// Au démarrage de Discord : la bienvenue au tout premier lancement de Strata,
// sinon les nouveautés pas encore vues. Une seule fenêtre à la fois, et une
// seule fois : ce qui a été montré est noté dans des réglages masqués.
let timer: ReturnType<typeof setTimeout> | undefined;

function showPending() {
    const { welcomed, seenChangelog } = settings.store;
    if (!welcomed) {
        openWelcome();
    } else {
        const entries = unseenEntries(seenChangelog);
        if (entries.length) openChangelog(entries);
    }
    // La bienvenue vaut présentation : les nouveautés du jour ne s'y ajoutent pas
    settings.store.welcomed = true;
    settings.store.seenChangelog = LATEST_CHANGELOG;
}

// Attend que Discord soit connecté et affiché, puis laisse passer ses propres fenêtres
export function startOnboarding() {
    const tick = () => {
        timer = UserStore?.getCurrentUser() ? setTimeout(showPending, 2500) : setTimeout(tick, 1000);
    };
    tick();
}

export function stopOnboarding() {
    clearTimeout(timer);
}
