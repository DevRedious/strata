/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface Preset {
    name: string;
    hex: string;
}

export const ACCENTS: Preset[] = [
    { name: "Violet", hex: "#7c6cff" },
    { name: "Bleu", hex: "#5b8cff" },
    { name: "Turquoise", hex: "#2dd4bf" },
    { name: "Vert", hex: "#34d399" },
    { name: "Jaune", hex: "#facc15" },
    { name: "Orange", hex: "#fb923c" },
    { name: "Rouge", hex: "#f43f5e" },
    { name: "Rose", hex: "#e879f9" },
];

// Fonds sombres : les panneaux en sont dérivés (voir surfacesFor)
export const BACKGROUNDS: Preset[] = [
    { name: "Nuit", hex: "#0a0b0f" },
    { name: "Encre", hex: "#0b0f1a" },
    { name: "Graphite", hex: "#0e0e10" },
    { name: "Prune", hex: "#0d0a12" },
];
