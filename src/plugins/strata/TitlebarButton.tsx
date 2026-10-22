/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./titlebar.css";

import { useSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { findComponentByCodeLazy } from "@webpack";

import { openStrataModal } from "./menu/StrataModal";
import { settings } from "./settings";
import { StrataIcon } from "./StrataIcon";

// Même composant que les icônes de Discord dans la barre (boîte de réception, aide)
const HeaderBarIcon = findComponentByCodeLazy(".HEADER_BAR_BADGE_BOTTOM,", 'position:"bottom"');

function StrataButton() {
    // enabled : le patch reste en place jusqu'au redémarrage, le bouton suit l'état du plugin
    const { enabled } = useSettings(["plugins.Strata.enabled"]).plugins.Strata;
    const { titlebarButton } = settings.use(["titlebarButton"]);
    if (!enabled || !titlebarButton) return null;

    return (
        <HeaderBarIcon
            className="vc-strata-titlebar-btn"
            onClick={openStrataModal}
            tooltip="Réglages Strata"
            icon={() => <StrataIcon />}
        />
    );
}

// Appelé par le patch de la barre de titre, en tête de la zone de droite
export function renderTitlebarButton() {
    return (
        <ErrorBoundary key="vc-strata-titlebar" noop>
            <StrataButton />
        </ErrorBoundary>
    );
}
