/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./LayoutPreview.css";

import { tr } from "@plugins/strata/i18n";
import type { CSSProperties } from "react";

import { cl } from "./controls";
import { getValue } from "./state";

// Le schéma est environ aux trois quarts de la taille réelle : on réduit d'autant
const SCALE = 0.75;

function Lines({ count, accent }: { count: number; accent?: number; }) {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <span key={i} className={cl("pv-line", { accent: i === accent })} style={{ width: `${55 + ((i * 37) % 40)}%` }} />
            ))}
        </>
    );
}

// Schéma de Discord qui suit les réglages : espacement, arrondis et, en mode
// « drawer », tiroir des salons qui s'ouvre au survol avec les délais choisis
export function LayoutPreview({ drawerMode = false }: { drawerMode?: boolean; }) {
    const gap = getValue<number>("gap");
    const radius = getValue<number>("radius");
    const drawer = drawerMode && getValue<boolean>("drawer");

    const style = {
        "--pv-gap": `${Math.round(gap * SCALE)}px`,
        "--pv-radius": `${Math.round(radius * SCALE)}px`,
        "--pv-open": `${getValue<number>("drawerOpenDelay")}ms`,
        "--pv-close": `${getValue<number>("drawerCloseDelay")}ms`,
    } as CSSProperties;

    return (
        <div className={cl("pv", { drawer })} style={style} aria-hidden="true">
            <div className={cl("pv-guilds")}>
                {Array.from({ length: 5 }, (_, i) => <span key={i} className={cl("pv-guild", { active: i === 1 })} />)}
            </div>
            <div className={cl("pv-channels")}>
                <span className={cl("pv-title")} />
                <Lines count={6} accent={2} />
            </div>
            <div className={cl("pv-main")}>
                <div className={cl("pv-header")}><span className={cl("pv-title")} /></div>
                <div className={cl("pv-body")}>
                    <div className={cl("pv-chat")}>
                        <Lines count={5} />
                        <span className={cl("pv-input")} />
                    </div>
                    <div className={cl("pv-members")}>
                        {Array.from({ length: 4 }, (_, i) => <span key={i} className={cl("pv-member")} />)}
                    </div>
                </div>
            </div>
            {drawer && <span className={cl("pv-hint")}>{tr("Survole pour ouvrir le tiroir", "Hover to open the drawer")}</span>}
        </div>
    );
}
