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

export interface GradientPreset {
    name: string;
    from: string;
    to: string;
    angle: number;
}

// Dégradés derrière les panneaux : assez sombres pour que le texte de la barre
// de titre et les icônes des serveurs restent lisibles
export const GRADIENTS: GradientPreset[] = [
    { name: "Aurore", from: "#2a1b5e", to: "#0f3a4a", angle: 135 },
    { name: "Océan", from: "#0f2a5c", to: "#062a2e", angle: 160 },
    { name: "Braise", from: "#4a1420", to: "#3a2208", angle: 135 },
    { name: "Améthyste", from: "#3a1450", to: "#12183f", angle: 135 },
];

// Mode translucide : couleurs vives, comme les thèmes Nitro. Les panneaux les voilent
// déjà de 60 à 85 % : un dégradé sombre ne se verrait plus à travers.
export const GLASS_GRADIENTS: GradientPreset[] = [
    { name: "Crépuscule", from: "#ff7a45", to: "#7b2ff7", angle: 135 },
    { name: "Boréal", from: "#00c9a7", to: "#4f46e5", angle: 160 },
    { name: "Lagon", from: "#06b6d4", to: "#1e3a8a", angle: 180 },
    { name: "Sakura", from: "#f472b6", to: "#6d28d9", angle: 135 },
];
