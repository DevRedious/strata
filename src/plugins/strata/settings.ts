/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

import { applyParts, applyVars } from "./applyTheme";
import { isHexColor } from "./colors";
import { refreshBackgroundImage } from "./image";

const validColor = (value: string) => isHexColor(value) || "Couleur au format #rrggbb attendue";

// Nom de police libre : il est mis entre guillemets dans le CSS, il ne doit rien pouvoir y casser
export const isFontName = (value: unknown): value is string => typeof value === "string" && /^[\p{L}\p{N} _-]{0,60}$/u.test(value);

const statusColor = (label: string, color: string) => ({
    type: OptionType.STRING as const,
    displayName: `Statut ${label}`,
    description: "Pastille de statut, au format #rrggbb",
    default: color,
    isValid: validColor,
    onChange: () => applyVars(),
});

// Mode épuré : un élément de Discord masqué par interrupteur
const hide = (displayName: string, description: string) => ({
    type: OptionType.BOOLEAN as const,
    displayName: `Masquer : ${displayName}`,
    description,
    default: false,
    onChange: () => applyVars(),
});

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
    backgroundMode: {
        type: OptionType.SELECT,
        displayName: "Type de fond",
        description: "Uni, dégradé derrière les panneaux, ou dégradé ou image visible à travers les panneaux (façon thèmes Nitro)",
        options: [
            { label: "Uni", value: "solid", default: true },
            { label: "Dégradé derrière les panneaux", value: "gradient" },
            { label: "Translucide", value: "glass" },
            { label: "Image", value: "image" },
        ],
        onChange: () => {
            applyVars();
            applyParts();
        },
    },
    gradientFrom: {
        type: OptionType.STRING,
        displayName: "Début du dégradé",
        description: "Au format #rrggbb",
        default: "#2a1b5e",
        isValid: validColor,
        onChange: () => applyVars(),
    },
    gradientTo: {
        type: OptionType.STRING,
        displayName: "Fin du dégradé",
        description: "Au format #rrggbb",
        default: "#0f3a4a",
        isValid: validColor,
        onChange: () => applyVars(),
    },
    gradientAngle: {
        type: OptionType.SLIDER,
        displayName: "Angle du dégradé",
        description: "En degrés, 90 pour gauche → droite, 180 pour haut → bas",
        markers: [0, 90, 180, 270, 360],
        stickToMarkers: false,
        default: 135,
        onChange: () => applyVars(),
    },
    imageTint: {
        type: OptionType.STRING,
        displayName: "Teinte de l'image",
        description: "Couleur moyenne de l'image de fond, calculée à son import",
        default: "#0a0b0f",
        isValid: validColor,
        hidden: true,
        onChange: () => applyVars(),
    },
    glassOpacity: {
        type: OptionType.SLIDER,
        displayName: "Opacité des panneaux",
        description: "En mode translucide, en pourcentage : plus bas, le dégradé se voit davantage à travers",
        markers: [30, 50, 70, 85, 100],
        stickToMarkers: false,
        default: 85,
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
    windowButtons: {
        type: OptionType.SELECT,
        displayName: "Boutons de fenêtre",
        description: "Style des boutons réduire, agrandir et fermer",
        options: [
            { label: "Boutons Strata", value: "strata", default: true },
            { label: "Pilule", value: "pill" },
            { label: "Pastilles macOS", value: "mac" },
            { label: "Ceux de Discord", value: "discord" },
        ],
        onChange: () => applyParts(),
    },
    accentGradient: {
        type: OptionType.BOOLEAN,
        displayName: "Accent en dégradé",
        description: "Boutons, serveur sélectionné et pastilles en dégradé de l'accent vers une seconde couleur",
        default: false,
        onChange: () => applyVars(),
    },
    accentTo: {
        type: OptionType.STRING,
        displayName: "Fin du dégradé d'accent",
        description: "Au format #rrggbb",
        default: "#e879f9",
        isValid: validColor,
        onChange: () => applyVars(),
    },
    statusOnline: statusColor("En ligne", "#45a366"),
    statusIdle: statusColor("Absent", "#ffc04e"),
    statusDnd: statusColor("Ne pas déranger", "#da3e44"),
    statusOffline: statusColor("Hors ligne", "#84858d"),
    fontFamily: {
        type: OptionType.SELECT,
        displayName: "Police",
        description: "Police de toute l'interface. Seules des polices installées sur l'ordinateur : rien n'est téléchargé.",
        options: [
            { label: "Celle de Discord (gg sans)", value: "discord", default: true },
            { label: "Segoe UI", value: "segoe" },
            { label: "Bahnschrift", value: "bahnschrift" },
            { label: "Police du système", value: "system" },
            { label: "Autre police installée", value: "custom" },
        ],
        onChange: () => applyVars(),
    },
    fontCustom: {
        type: OptionType.STRING,
        displayName: "Nom de la police",
        description: "Nom exact d'une police installée, utilisée avec « Autre police installée »",
        default: "",
        isValid: (value: string) => isFontName(value) || "Lettres, chiffres, espaces et tirets seulement",
        onChange: () => applyVars(),
    },
    chatFontSize: {
        type: OptionType.SLIDER,
        displayName: "Taille du texte des messages",
        description: "En pixels",
        markers: [12, 14, 16, 18, 20],
        stickToMarkers: false,
        default: 16,
        onChange: () => applyVars(),
    },
    messageSpacing: {
        type: OptionType.SLIDER,
        displayName: "Espacement des messages",
        description: "Entre deux groupes de messages, en pixels",
        markers: [0, 4, 8, 16, 24],
        stickToMarkers: false,
        default: 16,
        onChange: () => applyVars(),
    },
    avatarSize: {
        type: OptionType.SLIDER,
        displayName: "Taille des avatars",
        description: "Dans les messages, en pixels",
        markers: [24, 32, 40, 48],
        stickToMarkers: false,
        default: 40,
        onChange: () => applyVars(),
    },
    avatarShape: {
        type: OptionType.SELECT,
        displayName: "Forme des avatars",
        description: "Dans les messages",
        options: [
            { label: "Ronds", value: "round", default: true },
            { label: "Carrés arrondis", value: "rounded" },
            { label: "Carrés", value: "square" },
        ],
        onChange: () => applyVars(),
    },
    guildShape: {
        type: OptionType.SELECT,
        displayName: "Forme des icônes de serveur",
        description: "Dans la barre des serveurs",
        options: [
            { label: "Celle de Discord", value: "discord", default: true },
            { label: "Rondes", value: "round" },
            { label: "Carrés arrondis", value: "rounded" },
            { label: "Carrées", value: "square" },
        ],
        onChange: () => applyVars(),
    },
    imageBlur: {
        type: OptionType.SLIDER,
        displayName: "Flou de l'image",
        description: "En pixels",
        markers: [0, 10, 20, 30],
        stickToMarkers: false,
        default: 0,
        onChange: () => refreshBackgroundImage(),
    },
    imageBrightness: {
        type: OptionType.SLIDER,
        displayName: "Luminosité de l'image",
        description: "En pourcentage",
        markers: [40, 60, 80, 100, 120],
        stickToMarkers: false,
        default: 100,
        onChange: () => refreshBackgroundImage(),
    },
    borderWidth: {
        type: OptionType.SLIDER,
        displayName: "Bordures des panneaux",
        description: "Épaisseur, en pixels",
        markers: [0, 1, 2],
        stickToMarkers: true,
        default: 1,
        onChange: () => applyVars(),
    },
    panelShadow: {
        type: OptionType.SELECT,
        displayName: "Ombre des panneaux",
        description: "Sous les panneaux flottants",
        options: [
            { label: "Aucune", value: "none", default: true },
            { label: "Douce", value: "soft" },
            { label: "Marquée", value: "strong" },
        ],
        onChange: () => applyVars(),
    },
    accentGlow: {
        type: OptionType.BOOLEAN,
        displayName: "Lueur d'accent",
        description: "Halo à la couleur d'accent autour du chat et du champ de saisie actif",
        default: false,
        onChange: () => applyVars(),
    },
    animations: {
        type: OptionType.BOOLEAN,
        displayName: "Animations",
        description: "Survols et transitions en douceur. Désactivées, le tiroir s'ouvre aussi sans animation.",
        default: true,
        onChange: () => applyVars(),
    },
    hideNitro: hide("Nitro", "Lien Nitro de la liste des messages privés"),
    hideShop: hide("Boutique", "Lien Boutique de la liste des messages privés"),
    hideQuests: hide("Quêtes", "Lien Quêtes de la liste des messages privés"),
    hideGift: hide("Bouton cadeau", "Dans la barre de saisie"),
    hideGif: hide("Bouton GIF", "Dans la barre de saisie"),
    hideStickers: hide("Bouton autocollants", "Dans la barre de saisie"),
    hideApps: hide("Bouton Applications", "Dans la barre de saisie"),
    hideActiveNow: hide("« En ligne maintenant »", "Colonne d'activité de la page Amis"),
    hideClanTags: hide("Tags de serveur", "Petites étiquettes à côté des pseudos"),
    hideHelp: hide("Bouton d'aide", "Dans la barre de titre"),
    hideGuildActions: hide("Ajouter et Découvrir", "Boutons en bas de la barre des serveurs"),
    titlebarButton: {
        type: OptionType.BOOLEAN,
        displayName: "Bouton dans la barre de titre",
        description: "Ouvre ces réglages depuis le haut de la fenêtre",
        default: true,
    },
}, {
    background: { disabled() { return this.store.backgroundMode !== "solid"; } },
    gradientFrom: { disabled() { return this.store.backgroundMode === "solid" || this.store.backgroundMode === "image"; } },
    gradientTo: { disabled() { return this.store.backgroundMode === "solid" || this.store.backgroundMode === "image"; } },
    gradientAngle: { disabled() { return this.store.backgroundMode === "solid" || this.store.backgroundMode === "image"; } },
    glassOpacity: { disabled() { return this.store.backgroundMode !== "glass" && this.store.backgroundMode !== "image"; } },
    accentTo: { disabled() { return !this.store.accentGradient; } },
    fontCustom: { disabled() { return this.store.fontFamily !== "custom"; } },
    imageBlur: { disabled() { return this.store.backgroundMode !== "image"; } },
    imageBrightness: { disabled() { return this.store.backgroundMode !== "image"; } },
    drawerOpenDelay: { disabled() { return !this.store.drawer; } },
    drawerCloseDelay: { disabled() { return !this.store.drawer; } },
});
