/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from "@plugins/strata/settings";

export type SettingKey = Extract<keyof typeof settings.def, string>;
export type SectionId = "colors" | "text" | "layout" | "effects" | "drawer" | "clean" | "parts" | "themes" | "share";

// Réglages de chaque section : sert à réinitialiser et à compter ce qui a changé
export const SECTION_KEYS: Record<SectionId, SettingKey[]> = {
    colors: [
        "accent", "accentGradient", "accentTo", "background", "backgroundMode", "gradientFrom", "gradientTo", "gradientAngle",
        "glassOpacity", "imageBlur", "imageBrightness", "statusOnline", "statusIdle", "statusDnd", "statusOffline",
    ],
    text: ["fontFamily", "fontCustom", "chatFontSize", "messageSpacing", "avatarSize", "avatarShape", "guildShape"],
    effects: ["borderWidth", "panelShadow", "accentGlow", "animations"],
    clean: [
        "hideNitro", "hideShop", "hideQuests", "hideGift", "hideGif", "hideStickers",
        "hideApps", "hideActiveNow", "hideClanTags", "hideHelp", "hideGuildActions",
    ],
    themes: [],
    layout: ["gap", "radius"],
    drawer: ["drawer", "drawerOpenDelay", "drawerCloseDelay"],
    parts: ["panels", "chat", "drawer", "discordSettings", "voice", "userPanel", "windowButtons", "titlebarButton"],
    share: [],
};

// Réglages visibles : les réglages masqués (bienvenue vue, teinte de l'image…) ne sont
// ni réinitialisés ni exportés
export const ALL_KEYS = (Object.keys(settings.def) as SettingKey[]).filter(key => !(settings.def[key] as { hidden?: boolean; }).hidden);

const store = () => settings.store as unknown as Record<SettingKey, unknown>;

interface SettingDef {
    default?: unknown;
    options?: { value: unknown; default?: boolean; }[];
}

// Les listes (SELECT) n'ont pas de default : c'est l'option marquée default
export function defaultOf(key: SettingKey) {
    const def = settings.def[key] as SettingDef;
    return def.options ? def.options.find(o => o.default)?.value : def.default;
}

export const getValue = <T>(key: SettingKey) => store()[key] as T;

export function setValue(key: SettingKey, value: unknown) {
    store()[key] = value;
}

export const modifiedKeys = (keys: SettingKey[]) => keys.filter(key => store()[key] !== defaultOf(key));

export function resetKeys(keys: SettingKey[]) {
    for (const key of keys) store()[key] = defaultOf(key);
}
