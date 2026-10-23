/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { settings } from "@plugins/strata/settings";

import { ALL_KEYS, defaultOf, getValue, SettingKey, setValue } from "./state";

const FORMAT = 1;

export function exportSettings() {
    const values = Object.fromEntries(ALL_KEYS.map(key => [key, getValue(key)]));
    return JSON.stringify({ strata: FORMAT, settings: values });
}

// Une valeur reçue d'un collègue n'est acceptée que si elle a le type et la plage attendus
export function isValid(key: SettingKey, value: unknown) {
    const def = settings.def[key] as { options?: { value: unknown; }[]; markers?: number[]; isValid?: (value: unknown) => unknown; };
    if (def.options) return def.options.some(o => o.value === value);
    const fallback = defaultOf(key);
    if (typeof value !== typeof fallback) return false;
    // Chaînes : la validation du réglage lui-même (couleur #rrggbb, nom de police…)
    if (typeof value === "string") return def.isValid ? def.isValid(value) === true : false;
    if (typeof value === "number") {
        const { markers } = def;
        return !markers || (value >= markers[0] && value <= markers[markers.length - 1]);
    }
    return true;
}

export type ImportResult = { ok: true; count: number; } | { ok: false; error: string; };

export function importSettings(text: string): ImportResult {
    let data: unknown;
    try {
        data = JSON.parse(text.trim());
    } catch {
        return { ok: false, error: "Ce texte n'est pas un export Strata." };
    }

    const { strata, settings: values } = (data ?? {}) as { strata?: unknown; settings?: unknown; };
    if (strata !== FORMAT || typeof values !== "object" || values === null)
        return { ok: false, error: "Ce texte n'est pas un export Strata." };

    const entries = Object.entries(values).filter(([key, value]) =>
        (ALL_KEYS as string[]).includes(key) && isValid(key as SettingKey, value));
    if (!entries.length) return { ok: false, error: "Aucun réglage valide dans ce texte." };

    for (const [key, value] of entries) setValue(key as SettingKey, value);
    return { ok: true, count: entries.length };
}
