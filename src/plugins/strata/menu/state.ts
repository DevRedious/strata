/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from "@plugins/strata/settings";

export type SettingKey = Extract<keyof typeof settings.def, string>;
export type SectionId = "colors" | "layout" | "drawer" | "parts" | "share";

// Réglages de chaque section : sert à réinitialiser et à compter ce qui a changé
export const SECTION_KEYS: Record<SectionId, SettingKey[]> = {
    colors: ["accent", "background"],
    layout: ["gap", "radius"],
    drawer: ["drawer", "drawerOpenDelay", "drawerCloseDelay"],
    parts: ["panels", "chat", "drawer", "discordSettings", "voice", "userPanel", "windowDots", "titlebarButton"],
    share: [],
};

export const ALL_KEYS = Object.keys(settings.def) as SettingKey[];

const store = () => settings.store as unknown as Record<SettingKey, unknown>;

export const defaultOf = (key: SettingKey) => (settings.def[key] as { default: unknown; }).default;

export const getValue = <T>(key: SettingKey) => store()[key] as T;

export function setValue(key: SettingKey, value: unknown) {
    store()[key] = value;
}

export const modifiedKeys = (keys: SettingKey[]) => keys.filter(key => store()[key] !== defaultOf(key));

export function resetKeys(keys: SettingKey[]) {
    for (const key of keys) store()[key] = defaultOf(key);
}
