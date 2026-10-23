/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { SectionId } from "./state";

// Nouveautés présentées après une mise à jour, la plus récente en premier.
// Ajouter une entrée (identifiant = date, unique et croissant) pour chaque
// nouveauté visible : elle s'affiche une fois, au démarrage suivant de Discord.
export interface ChangelogEntry {
    id: string;
    title: string;
    items: string[];
    /** La même nouveauté en anglais */
    en: { title: string; items: string[]; };
    section?: SectionId;
}

export const CHANGELOG: ChangelogEntry[] = [
    {
        id: "2026-10-23",
        title: "Thèmes, texte, effets et mode épuré",
        section: "themes",
        items: [
            "Une galerie de thèmes tout faits, et tes propres thèmes enregistrés pour y revenir en un clic.",
            "Nouveaux fonds : dégradé, translucide façon Nitro, ou une image de ton ordinateur (avec flou et luminosité).",
            "Texte : police, taille des messages, espacement, taille et forme des avatars et des icônes de serveur.",
            "Effets : bordures, ombres, lueur d'accent, animations. Accent en dégradé et couleurs des statuts.",
            "Mode épuré : masque Nitro, Boutique, Quêtes, les boutons cadeau, GIF, autocollants… à la carte.",
            "Boutons de fenêtre au choix : Strata, pilule, pastilles macOS ou ceux de Discord.",
            "Strata parle aussi anglais : la langue se choisit en haut de sa fenêtre.",
        ],
        en: {
            title: "Themes, text, effects and clean mode",
            items: [
                "A gallery of ready-made themes, and your own saved themes to come back to in one click.",
                "New backgrounds: gradient, translucent like Nitro, or a picture from your computer (with blur and brightness).",
                "Text: font, message size, spacing, size and shape of avatars and server icons.",
                "Effects: borders, shadows, accent glow, animations. Gradient accent and status colours.",
                "Clean mode: hides Nitro, Shop, Quests, the gift, GIF and sticker buttons… one by one.",
                "Window buttons of your choice: Strata, pill, macOS dots or Discord's own.",
                "Strata now speaks English: choose the language at the top of its window.",
            ],
        },
    },
];

export const LATEST_CHANGELOG = CHANGELOG[0].id;

// Entrées plus récentes que la dernière vue (les identifiants sont des dates ISO)
export const unseenEntries = (seen: string) => CHANGELOG.filter(entry => entry.id > seen);
