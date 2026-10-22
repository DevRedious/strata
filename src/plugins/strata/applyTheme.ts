/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { disableStyle, enableStyle } from "@api/Styles";

import { settings } from "./settings";
import baseSettings from "./styles/10-settings.css?managed";
import discordTokens from "./styles/20-discord-tokens.css?managed";
import layout from "./styles/30-layout.css?managed";
import chat from "./styles/40-chat.css?managed";
import discordSettings from "./styles/50-settings.css?managed";
import voice from "./styles/60-voice.css?managed";
import drawer from "./styles/70-drawer.css?managed";
import userPanel from "./styles/80-panel.css?managed";
import windowDots from "./styles/90-titlebar.css?managed";

type PartKey = "panels" | "chat" | "discordSettings" | "voice" | "drawer" | "userPanel" | "windowDots";

// Dans l'ordre des fichiers : on les réinsère dans cet ordre pour garder la cascade du thème
const STYLES: [style: string, part: PartKey | null][] = [
    [baseSettings, null],
    [discordTokens, null],
    [layout, "panels"],
    [chat, "chat"],
    [discordSettings, "discordSettings"],
    [voice, "voice"],
    [drawer, "drawer"],
    [userPanel, "userPanel"],
    [windowDots, "windowDots"],
];

const VARS = ["--ui-accent", "--ui-accent-contrast", "--ui-gap", "--ui-radius", "--ui-radius-sm", "--ui-drawer-open-delay", "--ui-drawer-close-delay"];

// Les écouteurs onChange des réglages tournent même plugin désactivé
let active = false;

function channel(value: number) {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

// Texte posé sur l'accent : blanc, sauf sur un accent clair (jaune, turquoise…)
function contrastFor(hex: string) {
    const [r, g, b] = [1, 3, 5].map(i => channel(parseInt(hex.slice(i, i + 2), 16)));
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 0.4 ? `color-mix(in oklab, ${hex} 15%, black)` : "#fff";
}

export function applyVars() {
    if (!active) return;
    const { accent, gap, radius, drawerOpenDelay, drawerCloseDelay } = settings.store;
    const values: Record<string, string> = {
        "--ui-accent": accent,
        "--ui-accent-contrast": contrastFor(accent),
        "--ui-gap": `${gap}px`,
        "--ui-radius": `${radius}px`,
        "--ui-radius-sm": `${Math.min(radius, 8)}px`,
        "--ui-drawer-open-delay": `${drawerOpenDelay}ms`,
        "--ui-drawer-close-delay": `${drawerCloseDelay}ms`,
    };
    const root = document.documentElement.style;
    for (const [name, value] of Object.entries(values)) root.setProperty(name, value);
}

export function applyParts() {
    if (!active) return;
    for (const [style] of STYLES) disableStyle(style);
    for (const [style, part] of STYLES) {
        if (part === null || settings.store[part]) enableStyle(style);
    }
}

export function startTheme() {
    active = true;
    applyVars();
    applyParts();
}

export function stopTheme() {
    active = false;
    for (const [style] of STYLES) disableStyle(style);
    const root = document.documentElement.style;
    for (const name of VARS) root.removeProperty(name);
}
