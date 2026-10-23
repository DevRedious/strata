/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { tr } from "@plugins/strata/i18n";

// name : français, en : anglais (nameOf choisit selon la langue de la fenêtre)
export interface Preset {
    name: string;
    en: string;
    hex: string;
}

export const nameOf = (preset: { name: string; en: string; }) => tr(preset.name, preset.en);

export const ACCENTS: Preset[] = [
    { name: "Violet", en: "Purple", hex: "#7c6cff" },
    { name: "Bleu", en: "Blue", hex: "#5b8cff" },
    { name: "Turquoise", en: "Teal", hex: "#2dd4bf" },
    { name: "Vert", en: "Green", hex: "#34d399" },
    { name: "Jaune", en: "Yellow", hex: "#facc15" },
    { name: "Orange", en: "Orange", hex: "#fb923c" },
    { name: "Rouge", en: "Red", hex: "#f43f5e" },
    { name: "Rose", en: "Pink", hex: "#e879f9" },
];

// Fonds sombres : les panneaux en sont dérivés (voir surfacesFor)
export const BACKGROUNDS: Preset[] = [
    { name: "Nuit", en: "Night", hex: "#0a0b0f" },
    { name: "Encre", en: "Ink", hex: "#0b0f1a" },
    { name: "Graphite", en: "Graphite", hex: "#0e0e10" },
    { name: "Prune", en: "Plum", hex: "#0d0a12" },
];

export interface GradientPreset {
    name: string;
    en: string;
    from: string;
    to: string;
    angle: number;
}

// Dégradés derrière les panneaux : assez sombres pour que le texte de la barre
// de titre et les icônes des serveurs restent lisibles
export const GRADIENTS: GradientPreset[] = [
    { name: "Aurore", en: "Dawn", from: "#2a1b5e", to: "#0f3a4a", angle: 135 },
    { name: "Océan", en: "Ocean", from: "#0f2a5c", to: "#062a2e", angle: 160 },
    { name: "Braise", en: "Ember", from: "#4a1420", to: "#3a2208", angle: 135 },
    { name: "Améthyste", en: "Amethyst", from: "#3a1450", to: "#12183f", angle: 135 },
];

// Mode translucide : couleurs vives, comme les thèmes Nitro. Les panneaux les voilent
// déjà de 60 à 85 % : un dégradé sombre ne se verrait plus à travers.
export const GLASS_GRADIENTS: GradientPreset[] = [
    { name: "Crépuscule", en: "Dusk", from: "#ff7a45", to: "#7b2ff7", angle: 135 },
    { name: "Boréal", en: "Boreal", from: "#00c9a7", to: "#4f46e5", angle: 160 },
    { name: "Lagon", en: "Lagoon", from: "#06b6d4", to: "#1e3a8a", angle: 180 },
    { name: "Sakura", en: "Sakura", from: "#f472b6", to: "#6d28d9", angle: 135 },
];
