/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

import { applyParts, applyVars } from "./applyTheme";
import { isHexColor } from "./colors";

const validColor = (value: string) => isHexColor(value) || "Couleur au format #rrggbb attendue";

// Un interrupteur par fichier de styles/ (hors 10 et 20, toujours actifs)
const part = (displayName: string, description: string) => ({
    type: OptionType.BOOLEAN as const,
    displayName,
    description,
    default: true,
    onChange: () => applyParts(),
});

export const settings = definePluginSettings({
    accent: {
        type: OptionType.STRING,
        displayName: "Couleur d'accent",
        description: "Au format #rrggbb",
        default: "#7c6cff",
        isValid: validColor,
        onChange: () => applyVars(),
    },
    background: {
        type: OptionType.STRING,
        displayName: "Fond",
        description: "Au format #rrggbb, de préférence sombre. Les panneaux en sont dérivés.",
        default: "#0a0b0f",
        isValid: validColor,
        onChange: () => applyVars(),
    },
    gap: {
        type: OptionType.SLIDER,
        displayName: "Espacement",
        description: "Entre les panneaux, en pixels",
        markers: [0, 4, 8, 12, 16],
        stickToMarkers: false,
        default: 8,
        onChange: () => applyVars(),
    },
    radius: {
        type: OptionType.SLIDER,
        displayName: "Arrondis",
        description: "Coins des panneaux, en pixels",
        markers: [0, 6, 10, 14, 18, 24],
        stickToMarkers: false,
        default: 14,
        onChange: () => applyVars(),
    },
    panels: part("Panneaux flottants", "Salons, en-tête, chat et membres en cartes séparées"),
    chat: part("Chat", "Messages et barre de saisie"),
    discordSettings: part("Paramètres de Discord", "Onglet sélectionné à la couleur d'accent"),
    voice: part("Vocal", "Zone d'appel en carte, aux couleurs du thème"),
    drawer: part("Tiroir des salons", "Liste des salons repliée, ouverte au survol des serveurs"),
    drawerOpenDelay: {
        type: OptionType.SLIDER,
        displayName: "Ouverture du tiroir",
        description: "Délai au survol, en millisecondes",
        markers: [0, 100, 200, 300, 400, 500],
        stickToMarkers: false,
        default: 120,
        onChange: () => applyVars(),
    },
    drawerCloseDelay: {
        type: OptionType.SLIDER,
        displayName: "Fermeture du tiroir",
        description: "Délai après le départ de la souris, en millisecondes",
        markers: [0, 100, 200, 300, 400, 500],
        stickToMarkers: false,
        default: 250,
        onChange: () => applyVars(),
    },
    userPanel: part("Panneau utilisateur", "Survol à la couleur d'accent, nom lisible sur une nameplate"),
    windowDots: part("Pastilles de fenêtre", "Boutons réduire, agrandir et fermer façon macOS"),
    titlebarButton: {
        type: OptionType.BOOLEAN,
        displayName: "Bouton dans la barre de titre",
        description: "Ouvre ces réglages depuis le haut de la fenêtre",
        default: true,
    },
}, {
    drawerOpenDelay: { disabled() { return !this.store.drawer; } },
    drawerCloseDelay: { disabled() { return !this.store.drawer; } },
});
