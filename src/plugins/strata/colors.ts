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

// Fond uni sous un dégradé : la moyenne des deux couleurs, assombrie et désaturée
// comme le fond par défaut (#0a0b0f), pour que les panneaux en gardent la teinte
export function gradientBase(from: string, to: string) {
    const [a, b] = [rgb(from), rgb(to)];
    const { h, s, v } = hexToHsv(toHex(a.map((c, i) => Math.round((c + b[i]) / 2))));
    return hsvToHex({ h, s: Math.min(s, 0.5), v: Math.min(v, 0.07) });
}

// Formats attendus par les variables des thèmes Nitro de Discord : « r g b » et « h s% l% »
export const rgbTriplet = (hex: string) => rgb(hex).join(" ");

export function hslTriplet(hex: string) {
    const [r, g, b] = rgb(hex).map(c => c / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    let h = 0;
    if (d) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
    }
    const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
    const round = (n: number) => Math.round(n * 10) / 10;
    return `${round((h * 60 + 360) % 360)} ${round(s * 100)}% ${round(l * 100)}%`;
}

export const gradientCss =(from: string, to: string, angle: number) => `linear-gradient(${angle}deg, ${from}, ${to})`;

function channel(value: number) {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
    const [r, g, b] = rgb(hex).map(channel);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Rapport de contraste WCAG entre deux couleurs (1 à 21)
export function contrastRatio(a: string, b: string) {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (light + 0.05) / (dark + 0.05);
}

// Mélange de deux couleurs, weight étant la part de a (0 à 1)
export const mixHex = (a: string, b: string, weight: number) =>
    toHex(rgb(a).map((c, i) => Math.round(c * weight + rgb(b)[i] * (1 - weight))));

// Texte posé sur l'accent : blanc, sauf sur un accent clair (jaune, turquoise…)
export function contrastFor(hex: string) {
    return luminance(hex) > 0.4 ? `color-mix(in oklab, ${hex} 15%, black)` : "#fff";
}

const LIGHT_TEXT = { text: "#e4e6ec", strong: "#ffffff", muted: "#8a90a0", border: "rgb(255 255 255 / 6%)" };
const DARK_TEXT = { text: "#1f2128", strong: "#000000", muted: "#555a66", border: "rgb(0 0 0 / 12%)" };

// Textes lisibles sur les panneaux : clairs ou sombres selon ce qui contraste le plus,
// et un texte secondaire rapproché du texte principal jusqu'à 4,5:1 si besoin.
// Sur les fonds sombres du thème, les couleurs d'origine sont gardées telles quelles.
export function textColorsFor(surface: string) {
    const palette = contrastRatio(LIGHT_TEXT.strong, surface) >= contrastRatio(DARK_TEXT.strong, surface) ? LIGHT_TEXT : DARK_TEXT;
    let { muted } = palette;
    for (let step = 1; step <= 10 && contrastRatio(muted, surface) < 4.5; step++) {
        muted = mixHex(palette.text, palette.muted, step / 10);
    }
    return { ...palette, muted };
}
