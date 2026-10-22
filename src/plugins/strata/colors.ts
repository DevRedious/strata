/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export const isHexColor = (value: unknown): value is string => typeof value === "string" && HEX_COLOR.test(value);

function rgb(hex: string) {
    return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
}

const toHex = (channels: number[]) => "#" + channels.map(c => Math.min(255, c).toString(16).padStart(2, "0")).join("");

// Teinte 0–360, saturation et valeur 0–1 : les axes du sélecteur de couleur
export interface Hsv {
    h: number;
    s: number;
    v: number;
}

export function hexToHsv(hex: string): Hsv {
    const [r, g, b] = rgb(hex).map(c => c / 255);
    const max = Math.max(r, g, b);
    const delta = max - Math.min(r, g, b);
    let h = 0;
    if (delta) {
        if (max === r) h = ((g - b) / delta) % 6;
        else if (max === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
    }
    return { h: (h * 60 + 360) % 360, s: max ? delta / max : 0, v: max };
}

export function hsvToHex({ h, s, v }: Hsv) {
    const f = (n: number) => {
        const k = (n + h / 60) % 6;
        return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
    };
    return toHex([f(5), f(3), f(1)]);
}

// Écarts entre le fond et chaque surface dans le thème d'origine (#0a0b0f → #111318,
// #171a21, #1e222b) : le fond par défaut redonne exactement ces couleurs.
const SURFACE_OFFSETS = [[7, 8, 9], [13, 15, 18], [20, 23, 28]];

export function surfacesFor(background: string) {
    const base = rgb(background);
    return SURFACE_OFFSETS.map(offset => toHex(base.map((c, i) => c + offset[i])));
}

function channel(value: number) {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

// Texte posé sur l'accent : blanc, sauf sur un accent clair (jaune, turquoise…)
export function contrastFor(hex: string) {
    const [r, g, b] = rgb(hex).map(channel);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 0.4 ? `color-mix(in oklab, ${hex} 15%, black)` : "#fff";
}
