/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as DataStore from "@api/DataStore";

import { defaultOf, getValue, resetKeys, SECTION_KEYS, SettingKey, setValue } from "./state";
import { isValid } from "./transfer";

// Un thème regroupe l'apparence : couleurs, texte, disposition et effets. Les parties
// du thème, le tiroir et le mode épuré sont des préférences d'usage : ils ne changent pas.
// L'image de fond reste celle de l'ordinateur (DataStore), seule sa teinte suit.
export const THEME_KEYS: SettingKey[] = [
    ...SECTION_KEYS.colors, ...SECTION_KEYS.text, ...SECTION_KEYS.layout, ...SECTION_KEYS.effects, "imageTint",
];

export type ThemeValues = Partial<Record<SettingKey, unknown>>;

export interface Theme {
    name: string;
    values: ThemeValues;
}

// Galerie : seules les valeurs qui s'écartent des défauts
export const BUILTIN_THEMES: Theme[] = [
    { name: "Strata", values: {} },
    { name: "Encre", values: { background: "#0b0f1a", accent: "#5b8cff" } },
    { name: "Émeraude", values: { background: "#0e0e10", accent: "#34d399", panelShadow: "soft" } },
    {
        name: "Braise",
        values: { backgroundMode: "gradient", gradientFrom: "#4a1420", gradientTo: "#3a2208", accent: "#f43f5e", panelShadow: "soft" },
    },
    {
        name: "Crépuscule",
        values: {
            backgroundMode: "glass", gradientFrom: "#ff7a45", gradientTo: "#7b2ff7", accent: "#fb923c",
            accentGradient: true, accentTo: "#a855f7",
        },
    },
    {
        name: "Boréal",
        values: { backgroundMode: "glass", gradientFrom: "#00c9a7", gradientTo: "#4f46e5", gradientAngle: 160, accent: "#2dd4bf", accentGlow: true },
    },
    {
        name: "Sakura",
        values: {
            backgroundMode: "glass", gradientFrom: "#f472b6", gradientTo: "#6d28d9", accent: "#e879f9",
            avatarShape: "rounded", guildShape: "round", radius: 20,
        },
    },
    {
        name: "Compact",
        values: { gap: 4, radius: 8, chatFontSize: 14, messageSpacing: 4, avatarSize: 32, borderWidth: 0 },
    },
];

// Valeur effective d'un réglage dans un thème (sa valeur, sinon le défaut)
export const themeValue = <T>(theme: Theme, key: SettingKey) => (key in theme.values ? theme.values[key] : defaultOf(key)) as T;

export function applyTheme(theme: Theme) {
    resetKeys(THEME_KEYS);
    for (const [key, value] of Object.entries(theme.values)) {
        if (THEME_KEYS.includes(key as SettingKey) && isValid(key as SettingKey, value)) setValue(key as SettingKey, value);
    }
}

// Le thème correspond-il aux réglages actuels ?
export const isCurrentTheme = (theme: Theme) => THEME_KEYS.every(key => getValue(key) === themeValue(theme, key));

export function currentValues(): ThemeValues {
    return Object.fromEntries(THEME_KEYS.filter(key => getValue(key) !== defaultOf(key)).map(key => [key, getValue(key)]));
}

const KEY = "Strata_themes";

export async function loadSavedThemes() {
    return await DataStore.get<Theme[]>(KEY) ?? [];
}

// Un nom déjà pris remplace l'ancien thème
export async function saveTheme(name: string) {
    const themes = (await loadSavedThemes()).filter(t => t.name !== name);
    themes.push({ name, values: currentValues() });
    await DataStore.set(KEY, themes);
    return themes;
}

export async function deleteTheme(name: string) {
    const themes = (await loadSavedThemes()).filter(t => t.name !== name);
    await DataStore.set(KEY, themes);
    return themes;
}
