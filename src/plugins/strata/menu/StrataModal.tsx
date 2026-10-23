/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./menu.css";

import { Button } from "@components/Button";
import ErrorBoundary from "@components/ErrorBoundary";
import { tr } from "@plugins/strata/i18n";
import { settings } from "@plugins/strata/settings";
import { StrataIcon } from "@plugins/strata/StrataIcon";
import type { RenderModalProps } from "@vencord/discord-types";
import { openModal, useState } from "@webpack/common";
import type { ComponentType } from "react";

import { cl } from "./controls";
import { CloseIcon, DrawerIcon, EyeOffIcon, LayoutIcon, PaletteIcon, PartsIcon, ResetIcon, ShareIcon, SparkIcon, TextIcon, ThemesIcon } from "./icons";
import { LanguagePicker } from "./LanguagePicker";
import { CleanSection } from "./sections/CleanSection";
import { ColorsSection } from "./sections/ColorsSection";
import { EffectsSection } from "./sections/EffectsSection";
import { DrawerSection, LayoutSection } from "./sections/LayoutSections";
import { PartsSection } from "./sections/PartsSection";
import { ShareSection } from "./sections/ShareSection";
import { TextSection } from "./sections/TextSection";
import { ThemesSection } from "./sections/ThemesSection";
import { ALL_KEYS, modifiedKeys, resetKeys, SECTION_KEYS, SectionId } from "./state";

// Une fonction : les libellés suivent la langue choisie au moment du rendu
const nav = (): { id: SectionId; label: string; Icon: ComponentType; }[] => [
    { id: "themes", label: tr("Thèmes", "Themes"), Icon: ThemesIcon },
    { id: "colors", label: tr("Couleurs", "Colours"), Icon: PaletteIcon },
    { id: "text", label: tr("Texte", "Text"), Icon: TextIcon },
    { id: "layout", label: tr("Disposition", "Layout"), Icon: LayoutIcon },
    { id: "effects", label: tr("Effets", "Effects"), Icon: SparkIcon },
    { id: "drawer", label: tr("Tiroir des salons", "Channel drawer"), Icon: DrawerIcon },
    { id: "clean", label: tr("Mode épuré", "Clean mode"), Icon: EyeOffIcon },
    { id: "parts", label: tr("Parties du thème", "Theme parts"), Icon: PartsIcon },
    { id: "share", label: tr("Partager", "Share"), Icon: ShareIcon },
];

// « 3 settings » : le pluriel anglais, le français s'écrit à part
const s = (n: number) => (n > 1 ? "s" : "");

// Texte de la pastille d'état, et si la section s'écarte des valeurs par défaut
function sectionStatus(section: SectionId): [text: string, changed: boolean] {
    const keys = SECTION_KEYS[section];
    if (section === "parts") {
        const off = keys.filter(key => settings.store[key] === false).length;
        const text = off
            ? tr(`${off} partie${s(off)} désactivée${s(off)}`, `${off} part${s(off)} turned off`)
            : tr("Tout est activé", "Everything is on");
        return [text, off > 0];
    }
    if (section === "clean") {
        const hidden = keys.filter(key => settings.store[key] === true).length;
        const text = hidden
            ? tr(`${hidden} élément${s(hidden)} masqué${s(hidden)}`, `${hidden} item${s(hidden)} hidden`)
            : tr("Rien n'est masqué", "Nothing is hidden");
        return [text, hidden > 0];
    }
    const changed = modifiedKeys(keys).length;
    const text = changed
        ? tr(`${changed} réglage${s(changed)} modifié${s(changed)}`, `${changed} setting${s(changed)} changed`)
        : tr("Valeurs par défaut", "Default values");
    return [text, changed > 0];
}

function StrataModal({ onClose, initialSection }: RenderModalProps & { initialSection: SectionId; }) {
    const [section, setSection] = useState<SectionId>(initialSection);
    settings.use(); // redessine la fenêtre à chaque changement de réglage
    const [status, changed] = sectionStatus(section);

    return (
        <div className={cl("modal")} role="dialog" aria-label={tr("Réglages Strata", "Strata settings")}>
            <header className={cl("head")}>
                <div className={cl("logo")}><StrataIcon size={24} /></div>
                <div>
                    <div className={cl("title")}>Strata</div>
                    <div className={cl("subtitle")}>{tr("Réglages du thème · s'appliquent en direct", "Theme settings · applied live")}</div>
                </div>
                <LanguagePicker />
                <button className={cl("close")} onClick={onClose} aria-label={tr("Fermer", "Close")}><CloseIcon /></button>
            </header>

            <nav className={cl("nav")}>
                <div className={cl("nav-label")}>{tr("Réglages", "Settings")}</div>
                {nav().map(({ id, label, Icon }) => (
                    <button key={id} className={cl("nav-item", { active: id === section })} onClick={() => setSection(id)}>
                        <Icon />{label}
                    </button>
                ))}
                <div className={cl("nav-spacer")} />
                <button className={cl("nav-item", "nav-reset")} onClick={() => resetKeys(ALL_KEYS)}>
                    <ResetIcon />{tr("Tout réinitialiser", "Reset everything")}
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
                            {tr("Réinitialiser la section", "Reset this section")}
                        </button>
                    </footer>
                )}
            </main>
        </div>
    );
}

export function openStrataModal(initialSection: SectionId = "colors") {
    openModal(props => (
        <ErrorBoundary>
            <StrataModal {...props} initialSection={initialSection} />
        </ErrorBoundary>
    ));
}

// En tête de la liste standard (Paramètres → Vencord → Plugins → Strata), gardée en secours
export function OpenMenuButton() {
    return (
        <Button variant="primary" size="small" onClick={() => openStrataModal()}>
            {tr("Ouvrir la fenêtre Strata", "Open the Strata window")}
        </Button>
    );
}
