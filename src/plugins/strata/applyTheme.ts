/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { disableStyle, enableStyle } from "@api/Styles";

import { contrastFor, surfacesFor } from "./colors";
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

const VARS = [
    "--ui-accent", "--ui-accent-contrast", "--ui-bg", "--ui-surface-1", "--ui-surface-2", "--ui-surface-3",
    "--ui-gap", "--ui-radius", "--ui-radius-sm", "--ui-drawer-open-delay", "--ui-drawer-close-delay",
];

// Les écouteurs onChange des réglages tournent même plugin désactivé
let active = false;

export function applyVars() {
    if (!active) return;
    const { accent, background, gap, radius, drawerOpenDelay, drawerCloseDelay } = settings.store;
    const [surface1, surface2, surface3] = surfacesFor(background);
    const values: Record<string, string> = {
        "--ui-accent": accent,
        "--ui-accent-contrast": contrastFor(accent),
        "--ui-bg": background,
        "--ui-surface-1": surface1,
        "--ui-surface-2": surface2,
        "--ui-surface-3": surface3,
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
