/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./menu.css";

import { Button } from "@components/Button";
import ErrorBoundary from "@components/ErrorBoundary";
import { settings } from "@plugins/strata/settings";
import { StrataIcon } from "@plugins/strata/StrataIcon";
import type { RenderModalProps } from "@vencord/discord-types";
import { openModal, useState } from "@webpack/common";
import type { ComponentType } from "react";

import { cl } from "./controls";
import { CloseIcon, DrawerIcon, EyeOffIcon, LayoutIcon, PaletteIcon, PartsIcon, ResetIcon, ShareIcon, SparkIcon, TextIcon, ThemesIcon } from "./icons";
import { CleanSection } from "./sections/CleanSection";
import { ColorsSection } from "./sections/ColorsSection";
import { EffectsSection } from "./sections/EffectsSection";
import { DrawerSection, LayoutSection } from "./sections/LayoutSections";
import { PartsSection } from "./sections/PartsSection";
import { ShareSection } from "./sections/ShareSection";
import { TextSection } from "./sections/TextSection";
import { ThemesSection } from "./sections/ThemesSection";
import { ALL_KEYS, modifiedKeys, resetKeys, SECTION_KEYS, SectionId } from "./state";

const NAV: { id: SectionId; label: string; Icon: ComponentType; }[] = [
    { id: "themes", label: "Thèmes", Icon: ThemesIcon },
    { id: "colors", label: "Couleurs", Icon: PaletteIcon },
    { id: "text", label: "Texte", Icon: TextIcon },
    { id: "layout", label: "Disposition", Icon: LayoutIcon },
    { id: "effects", label: "Effets", Icon: SparkIcon },
    { id: "drawer", label: "Tiroir des salons", Icon: DrawerIcon },
    { id: "clean", label: "Mode épuré", Icon: EyeOffIcon },
    { id: "parts", label: "Parties du thème", Icon: PartsIcon },
    { id: "share", label: "Partager", Icon: ShareIcon },
];

// Texte de la pastille d'état, et si la section s'écarte des valeurs par défaut
function sectionStatus(section: SectionId): [text: string, changed: boolean] {
    const keys = SECTION_KEYS[section];
    if (section === "parts") {
        const off = keys.filter(key => settings.store[key] === false).length;
        return [off ? `${off} partie${off > 1 ? "s" : ""} désactivée${off > 1 ? "s" : ""}` : "Tout est activé", off > 0];
    }
    if (section === "clean") {
        const hidden = keys.filter(key => settings.store[key] === true).length;
        return [hidden ? `${hidden} élément${hidden > 1 ? "s" : ""} masqué${hidden > 1 ? "s" : ""}` : "Rien n'est masqué", hidden > 0];
    }
    const changed = modifiedKeys(keys).length;
    return [changed ? `${changed} réglage${changed > 1 ? "s" : ""} modifié${changed > 1 ? "s" : ""}` : "Valeurs par défaut", changed > 0];
}

function StrataModal({ onClose }: RenderModalProps) {
    const [section, setSection] = useState<SectionId>("colors");
    settings.use(); // redessine la fenêtre à chaque changement de réglage
    const [status, changed] = sectionStatus(section);

    return (
        <div className={cl("modal")} role="dialog" aria-label="Réglages Strata">
            <header className={cl("head")}>
                <div className={cl("logo")}><StrataIcon size={24} /></div>
                <div>
                    <div className={cl("title")}>Strata</div>
                    <div className={cl("subtitle")}>Réglages du thème · s'appliquent en direct</div>
                </div>
                <button className={cl("close")} onClick={onClose} aria-label="Fermer"><CloseIcon /></button>
            </header>

            <nav className={cl("nav")}>
                <div className={cl("nav-label")}>Réglages</div>
                {NAV.map(({ id, label, Icon }) => (
                    <button key={id} className={cl("nav-item", { active: id === section })} onClick={() => setSection(id)}>
                        <Icon />{label}
                    </button>
                ))}
                <div className={cl("nav-spacer")} />
                <button className={cl("nav-item", "nav-reset")} onClick={() => resetKeys(ALL_KEYS)}>
                    <ResetIcon />Tout réinitialiser
                </button>
            </nav>

            <main className={cl("main")}>
                <ErrorBoundary>
                    {section === "themes" && <ThemesSection />}
                    {section === "colors" && <ColorsSection />}
                    {section === "text" && <TextSection />}
                    {section === "layout" && <LayoutSection />}
                    {section === "effects" && <EffectsSection />}
                    {section === "drawer" && <DrawerSection />}
                    {section === "clean" && <CleanSection />}
                    {section === "parts" && <PartsSection />}
                    {section === "share" && <ShareSection />}
                </ErrorBoundary>

                {section !== "share" && section !== "themes" && (
                    <footer className={cl("foot")}>
                        <span className={cl("status", { changed })}>{status}</span>
                        <button className={cl("ghost")} disabled={!changed && section !== "parts"} onClick={() => resetKeys(SECTION_KEYS[section])}>
                            Réinitialiser la section
                        </button>
                    </footer>
                )}
            </main>
        </div>
    );
}

export function openStrataModal() {
    openModal(props => (
        <ErrorBoundary>
            <StrataModal {...props} />
        </ErrorBoundary>
    ));
}

// En tête de la liste standard (Paramètres → Vencord → Plugins → Strata), gardée en secours
export function OpenMenuButton() {
    return (
        <Button variant="primary" size="small" onClick={openStrataModal}>
            Ouvrir la fenêtre Strata
        </Button>
    );
}
