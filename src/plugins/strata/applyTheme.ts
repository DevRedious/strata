/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { disableStyle, enableStyle, managedStyleRootNode } from "@api/Styles";
import { createAndAppendStyle } from "@utils/css";

import { contrastFor, gradientBase, gradientCss, hslTriplet, rgbTriplet, surfacesFor, textColorsFor } from "./colors";
import { backgroundImageUrl, loadBackgroundImage, unloadBackgroundImage } from "./image";
import { isFontName, settings } from "./settings";
import baseSettings from "./styles/10-settings.css?managed";
import discordTokens from "./styles/20-discord-tokens.css?managed";
import accentStyles from "./styles/25-accent.css?managed";
import layout from "./styles/30-layout.css?managed";
import glass from "./styles/35-glass.css?managed";
import chat from "./styles/40-chat.css?managed";
import textStyles from "./styles/45-text.css?managed";
import discordSettings from "./styles/50-settings.css?managed";
import voice from "./styles/60-voice.css?managed";
import drawer from "./styles/70-drawer.css?managed";
import userPanel from "./styles/80-panel.css?managed";
import effects from "./styles/85-effects.css?managed";
import macButtons from "./styles/90-winbuttons-mac.css?managed";
import strataButtons from "./styles/91-winbuttons-strata.css?managed";
import pillButtons from "./styles/92-winbuttons-pill.css?managed";
import clean from "./styles/95-clean.css?managed";

type PartKey = "panels" | "chat" | "discordSettings" | "voice" | "drawer" | "userPanel";

const part = (key: PartKey) => () => settings.store[key];
const always = () => true;
// Translucide et Image : panneaux translucides, par la mécanique des thèmes Nitro
const isGlass = () => settings.store.backgroundMode === "glass" || settings.store.backgroundMode === "image";
const windowButtons = (style: string) => () => settings.store.windowButtons === style;

// Dans l'ordre des fichiers : on les réinsère dans cet ordre pour garder la cascade du thème
const STYLES: [style: string, enabled: () => boolean][] = [
    [baseSettings, always],
    [discordTokens, always],
    [accentStyles, always],
    [layout, part("panels")],
    [glass, () => isGlass() && settings.store.panels],
    [chat, part("chat")],
    [textStyles, always],
    [discordSettings, part("discordSettings")],
    [voice, part("voice")],
    [drawer, part("drawer")],
    [userPanel, part("userPanel")],
    [effects, always],
    [macButtons, windowButtons("mac")],
    [strataButtons, windowButtons("strata")],
    [pillButtons, windowButtons("pill")],
    [clean, always],
];

// Les valeurs choisies vont dans notre propre <style>, comme ClientTheme : Discord réécrit
// l'attribut style de <html> (à la perte du focus), ce qui effaçait des variables posées dessus
const VARS_STYLE_ID = "vc-strata-vars";
let varsStyle: HTMLStyleElement | null = null;

// Mode translucide : on réutilise la mécanique des thèmes Nitro de Discord. Avec cette classe
// sur <html>, ses composants peignent var(--background-gradient-…) : le dégradé, fixé sur la
// fenêtre, sous un voile plus ou moins opaque. Discord gère lui-même les classes de <html> :
// un observateur remet la nôtre s'il l'enlève, et on ne retire que celle qu'on a posée.
const NITRO_CLASS = "custom-theme-background";
let addedNitroClass = false;
let classObserver: MutationObserver | null = null;

function syncNitroClass() {
    const { classList } = document.documentElement;
    if (active && isGlass()) {
        if (!classList.contains(NITRO_CLASS)) {
            classList.add(NITRO_CLASS);
            addedNitroClass = true;
        }
    } else if (addedNitroClass) {
        classList.remove(NITRO_CLASS);
        addedNitroClass = false;
    }
}

// Les écouteurs onChange des réglages tournent même plugin désactivé
let active = false;

const declarations = (values: Record<string, string>) =>
    Object.entries(values).map(([name, value]) => `${name}: ${value};`).join(" ");

// Textes clairs ou sombres selon les panneaux (fonds clairs : voir textColorsFor)
function textVars(surface: string) {
    const { text, strong, muted, border } = textColorsFor(surface);
    return { "--ui-text": text, "--ui-text-strong": strong, "--ui-text-muted": muted, "--ui-border": border };
}

function accentVars() {
    const { accent, accentGradient, accentTo, statusOnline, statusIdle, statusDnd, statusOffline } = settings.store;
    const soft = (color: string) => `color-mix(in oklab, ${color} 22%, transparent)`;
    return {
        "--ui-accent-image": accentGradient ? `linear-gradient(135deg, ${accent}, ${accentTo})` : "none",
        "--ui-accent-image-soft": accentGradient ? `linear-gradient(90deg, ${soft(accent)}, ${soft(accentTo)})` : "none",
        "--ui-status-online": statusOnline,
        "--ui-status-idle": statusIdle,
        "--ui-status-dnd": statusDnd,
        "--ui-status-offline": statusOffline,
    };
}

const FONTS: Record<string, string> = {
    segoe: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif',
    bahnschrift: 'Bahnschrift, "Segoe UI", sans-serif',
    system: "system-ui, sans-serif",
};

const RADII: Record<string, string> = { round: "50%", rounded: "28%", square: "10%" };

// Les valeurs par défaut ne posent rien : Discord garde alors ses propres réglages
// (taille de police et espacement choisis dans ses paramètres d'accessibilité)
function typographyVars() {
    const { fontFamily, fontCustom, chatFontSize, messageSpacing, avatarSize, avatarShape, guildShape } = settings.store;
    const vars: Record<string, string> = {};
    const font = fontFamily === "custom"
        ? (isFontName(fontCustom) && fontCustom.trim() ? `"${fontCustom.trim()}", "gg sans", sans-serif` : null)
        : FONTS[fontFamily] ?? null;
    if (font) vars["--font-primary"] = font;
    if (chatFontSize !== 16) vars["--ui-chat-font-size"] = `${chatFontSize}px`;
    if (messageSpacing !== 16) vars["--ui-message-spacing"] = `${messageSpacing}px`;
    if (avatarSize !== 40) vars["--chat-avatar-size"] = vars["--custom-message-avatar-size"] = `${avatarSize}px`;
    vars["--ui-avatar-radius"] = RADII[avatarShape] ?? "50%";
    vars["--ui-guild-shape"] = guildShape === "discord" ? "discord" : "custom";
    vars["--ui-guild-radius"] = guildShape === "rounded" ? "12px" : guildShape === "square" ? "6px" : "50%";
    return vars;
}

const SHADOWS: Record<string, string> = {
    none: "0 0 #0000",
    soft: "0 6px 18px rgb(0 0 0 / 28%)",
    strong: "0 14px 36px rgb(0 0 0 / 50%)",
};

function effectVars() {
    const { borderWidth, panelShadow, accentGlow, animations } = settings.store;
    return {
        "--ui-border-width": `${borderWidth}px`,
        "--ui-panel-shadow": SHADOWS[panelShadow] ?? SHADOWS.none,
        // À l'intérieur du chat : son conteneur coupe tout ce qui dépasse de la carte
        "--ui-chat-glow": accentGlow ? "inset 0 0 0 1px var(--ui-accent-soft), inset 0 0 48px var(--ui-accent-faint)" : "0 0 #0000",
        "--ui-glow": accentGlow ? "on" : "off",
        "--ui-anim": animations ? "on" : "off",
        "--ui-anim-duration": animations ? "0.15s" : "0s",
    };
}

// Mode épuré : chaque interrupteur devient --ui-hide-… : on, lu par 95-clean.css
export const HIDE_KEYS = [
    "hideNitro", "hideShop", "hideQuests", "hideGift", "hideGif", "hideStickers",
    "hideApps", "hideActiveNow", "hideClanTags", "hideHelp", "hideGuildActions",
] as const;

const kebab = (key: string) => key.replace(/[A-Z]/g, c => "-" + c.toLowerCase());

function hiddenVars() {
    return Object.fromEntries(HIDE_KEYS.map(key => [`--ui-${kebab(key)}`, settings.store[key] ? "on" : "off"]));
}

export function applyVars() {
    if (!active) return;
    const { accent, background: solidBackground, backgroundMode, gradientFrom, gradientTo, gradientAngle, glassOpacity, imageTint, gap, radius, drawerOpenDelay, drawerCloseDelay } = settings.store;
    // Mode Image sans image choisie : on retombe sur le dégradé
    const photo = backgroundMode === "image" ? backgroundImageUrl() : null;
    // En dégradé ou sur une image, le fond uni (et donc les panneaux) en prend la teinte sombre
    const background = backgroundMode === "solid"
        ? solidBackground
        : photo ? gradientBase(imageTint, imageTint) : gradientBase(gradientFrom, gradientTo);
    const image = photo ? `url("${photo}")` : gradientCss(gradientFrom, gradientTo, gradientAngle);
    const [surface1, surface2, surface3] = surfacesFor(background);
    const values: Record<string, string> = {
        "--ui-accent": accent,
        "--ui-accent-contrast": contrastFor(accent),
        "--ui-bg": background,
        "--ui-bg-image": backgroundMode === "solid" ? "none" : image,
        "--ui-surface-1": surface1,
        "--ui-surface-2": surface2,
        "--ui-surface-3": surface3,
        "--ui-gap": `${gap}px`,
        "--ui-radius": `${radius}px`,
        "--ui-radius-sm": `${Math.min(radius, 8)}px`,
        "--ui-drawer-open-delay": `${drawerOpenDelay}ms`,
        "--ui-drawer-close-delay": `${drawerCloseDelay}ms`,
        ...textVars(surface1),
        ...accentVars(),
        ...typographyVars(),
        ...effectVars(),
        ...hiddenVars(),
    };
    // :root:root l'emporte sur le :root de 10-settings.css, réinséré après nous par applyParts
    let css = `:root:root { ${declarations(values)} }`;

    if (isGlass()) {
        // Variables que Discord pose pour un thème Nitro. :root:root:root passe devant ses
        // valeurs par défaut sur .theme-dark.custom-theme-background (voile noir).
        css += ` :root:root:root { ${declarations({
            "--custom-theme-background": image,
            "--custom-theme-primary-color": gradientFrom,
            "--custom-theme-secondary-color": gradientTo,
            "--custom-theme-base-color-dark": background,
            "--custom-theme-base-color-dark-hsl": hslTriplet(background),
            "--custom-background-gradient-color": rgbTriplet(background),
            "--custom-background-gradient-opacity-multiplier": String(glassOpacity / 100),
            // Discord cale l'image en haut à gauche (0 0) : une photo se centre mieux
            "--custom-background-gradient-cover": "fixed 0 0 / cover, var(--custom-theme-background) fixed center / cover",
        })} }`;
    }

    varsStyle ??= createAndAppendStyle(VARS_STYLE_ID, managedStyleRootNode);
    varsStyle.textContent = css;
    syncNitroClass();
}

export function applyParts() {
    if (!active) return;
    for (const [style] of STYLES) disableStyle(style);
    for (const [style, enabled] of STYLES) {
        if (enabled()) enableStyle(style);
    }
}

export function startTheme() {
    active = true;
    applyVars();
    applyParts();
    classObserver = new MutationObserver(syncNitroClass);
    classObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    // Lue de façon asynchrone dans le DataStore : appliquée dès qu'elle est prête
    loadBackgroundImage();
}

export function stopTheme() {
    active = false;
    classObserver?.disconnect();
    classObserver = null;
    syncNitroClass();
    for (const [style] of STYLES) disableStyle(style);
    varsStyle?.remove();
    varsStyle = null;
    unloadBackgroundImage();
}
