/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { ReactNode } from "react";

// Icônes au trait, 24 × 24, à la couleur du texte. Le contenu est une fonction :
// créer du JSX au chargement du module plante Vencord (React n'existe pas encore).
const icon = (paths: () => ReactNode, filled = false) => () => (
    <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {paths()}
    </svg>
);

export const PaletteIcon = icon(() => <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="8.5" cy="10" r="1.2" fill="currentColor" />
    <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
    <circle cx="15.5" cy="10" r="1.2" fill="currentColor" />
</>);
export const LayoutIcon = icon(() => <>
    <rect x="3" y="3" width="7" height="18" rx="2" />
    <rect x="13" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="14" width="8" height="7" rx="2" />
</>);
export const DrawerIcon = icon(() => <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></>);
export const PartsIcon = icon(() => <><rect x="3" y="6" width="18" height="12" rx="6" /><circle cx="15" cy="12" r="3" /></>);
export const ShareIcon = icon(() => <><path d="M12 3v12M7 8l5-5 5 5" /><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" /></>);
export const ResetIcon = icon(() => <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>);
export const CloseIcon = icon(() => <path d="M6 6l12 12M18 6L6 18" />);
export const PanelsIcon = icon(() => <><rect x="3" y="3" width="7" height="18" rx="2" /><rect x="13" y="3" width="8" height="18" rx="2" /></>);
export const ChatIcon = icon(() => <path d="M4 5h16v11H8l-4 4z" />);
export const SettingsIcon = icon(() => <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></>);
export const VoiceIcon = icon(() => <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>);
export const UserIcon = icon(() => <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>);
export const DotsIcon = icon(() => <><circle cx="6" cy="12" r="2.5" /><circle cx="12" cy="12" r="2.5" /><circle cx="18" cy="12" r="2.5" /></>, true);
export const ButtonIcon = icon(() => <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M15 6.5h2" /></>);
export const CopyIcon = icon(() => <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>);
export const ImportIcon = icon(() => <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" /></>);
