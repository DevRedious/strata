/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { LocaleStore } from "@webpack/common";

import { settings } from "./settings";

// Langues de la fenêtre Strata. Pour en ajouter une : une ligne ici, puis un
// argument de plus à chaque appel de tr() (dans l'ordre de cette liste).
export const LANGUAGES = [
    { code: "fr", name: "Français" },
    { code: "en", name: "English" },
] as const;

export type Lang = typeof LANGUAGES[number]["code"];

// « auto » suit la langue de Discord, l'anglais si elle n'est pas proposée
export function currentLang(): Lang {
    const chosen = settings.store.language;
    if (LANGUAGES.some(l => l.code === chosen)) return chosen as Lang;
    const discord = LocaleStore?.locale?.toLowerCase().split("-")[0];
    return LANGUAGES.find(l => l.code === discord)?.code ?? "en";
}

/** Le texte dans la langue de la fenêtre : `tr("Couleurs", "Colours")` */
export const tr = (fr: string, en: string) => (currentLang() === "fr" ? fr : en);
