/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./menu.css";
import "./dialogs.css";

import ErrorBoundary from "@components/ErrorBoundary";
import { currentLang, tr } from "@plugins/strata/i18n";
import { settings } from "@plugins/strata/settings";
import { StrataIcon } from "@plugins/strata/StrataIcon";
import type { RenderModalProps } from "@vencord/discord-types";
import { openModal } from "@webpack/common";
import type { ReactNode } from "react";

import type { ChangelogEntry } from "./changelog";
import { cl } from "./controls";
import { CloseIcon } from "./icons";
import { LanguagePicker } from "./LanguagePicker";
import { ThemeCard } from "./sections/ThemesSection";
import { openStrataModal } from "./StrataModal";
import { BUILTIN_THEMES } from "./themes";

interface DialogProps {
    title: string;
    subtitle: string;
    onClose(): void;
    children: ReactNode;
    footer: ReactNode;
}

// Petite fenêtre aux couleurs de Strata : en-tête, contenu qui défile, pied
function Dialog({ title, subtitle, onClose, children, footer }: DialogProps) {
    return (
        <div className={cl("modal", "dialog")} role="dialog" aria-label={title}>
            <header className={cl("head")}>
                <div className={cl("logo")}><StrataIcon size={24} /></div>
                <div>
                    <div className={cl("title")}>{title}</div>
                    <div className={cl("subtitle")}>{subtitle}</div>
                </div>
                <LanguagePicker />
                <button className={cl("close")} onClick={onClose} aria-label={tr("Fermer", "Close")}><CloseIcon /></button>
            </header>
            <div className={cl("dialog-body")}>{children}</div>
            <footer className={cl("dialog-foot")}>{footer}</footer>
        </div>
    );
}

function WelcomeDialog({ onClose }: RenderModalProps) {
    settings.use(); // redessine les cartes : le thème actif est encadré
    const openSettings = () => {
        onClose();
        openStrataModal("colors");
    };
    return (
        <Dialog
            title={tr("Bienvenue dans Strata", "Welcome to Strata")}
            subtitle={tr("Choisis ton style, tu pourras tout changer ensuite", "Pick your style, you can change everything later")}
            onClose={onClose}
            footer={<>
                <span className={cl("dialog-hint")}>{tr("Les réglages s'ouvrent aussi depuis le bouton Strata, en haut à droite de Discord.", "Settings also open from the Strata button, at the top right of Discord.")}</span>
                <button className={cl("ghost")} onClick={onClose}>{tr("Plus tard", "Later")}</button>
                <button className={cl("primary")} onClick={openSettings}>{tr("Tous les réglages", "All settings")}</button>
            </>}
        >
            <p className={cl("hint")}>{tr("Un clic sur un thème l'applique tout de suite : couleurs, fond, texte et effets. Tes autres réglages ne changent pas.", "One click on a theme applies it right away: colours, background, text and effects. Your other settings don't change.")}</p>
            <div className={cl("theme-grid")}>
                {BUILTIN_THEMES.map(theme => <ThemeCard key={theme.name} theme={theme} />)}
            </div>
        </Dialog>
    );
}

function ChangelogDialog({ onClose, entries }: RenderModalProps & { entries: ChangelogEntry[]; }) {
    settings.use(); // la liste de langue redessine la fenêtre
    const open = (entry: ChangelogEntry) => {
        onClose();
        openStrataModal(entry.section);
    };
    return (
        <Dialog
            title={tr("Nouveautés de Strata", "What's new in Strata")}
            subtitle={tr("Strata vient de se mettre à jour", "Strata has just been updated")}
            onClose={onClose}
            footer={<>
                <span className={cl("dialog-hint")}>{tr("Ce message ne s'affiche qu'une fois par nouveauté.", "This message only shows once per update.")}</span>
                <button className={cl("primary")} onClick={onClose}>{tr("Compris", "Got it")}</button>
            </>}
        >
            {entries.map(entry => (
                <section key={entry.id} className={cl("block", "changelog-entry")}>
                    <div className={cl("changelog-head")}>
                        <h2 className={cl("heading")}>{tr(entry.title, entry.en.title)}</h2>
                        {entry.section && <button className={cl("ghost")} onClick={() => open(entry)}>{tr("Voir", "Show")}</button>}
                    </div>
                    <ul className={cl("changelog-list")}>
                        {currentLang() === "fr"
                            ? entry.items.map(item => <li key={item}>{item}</li>)
                            : entry.en.items.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </section>
            ))}
        </Dialog>
    );
}

export function openWelcome() {
    openModal(props => <ErrorBoundary><WelcomeDialog {...props} /></ErrorBoundary>);
}

export function openChangelog(entries: ChangelogEntry[]) {
    openModal(props => <ErrorBoundary><ChangelogDialog {...props} entries={entries} /></ErrorBoundary>);
}
