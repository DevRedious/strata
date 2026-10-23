/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./LanguagePicker.css";

import { LANGUAGES, tr } from "@plugins/strata/i18n";
import { settings } from "@plugins/strata/settings";
import { useEffect, useRef, useState } from "@webpack/common";
import type { ReactNode } from "react";

import { cl } from "./controls";

// Drapeaux en SVG : Windows n'affiche pas les émojis de drapeaux (il écrit « FR »).
// Des fonctions, pas des constantes JSX : rien n'est créé au chargement du module.
const FLAGS: Record<string, () => ReactNode> = {
    fr: () => (
        <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice">
            <path fill="#0055a4" d="M0 0h1v2H0z" />
            <path fill="#fff" d="M1 0h1v2H1z" />
            <path fill="#ef4135" d="M2 0h1v2H2z" />
        </svg>
    ),
    en: () => (
        <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice">
            <clipPath id="vc-strata-gb"><path d="M30 15h30v15zv15H0zH0V0zV0h30z" /></clipPath>
            <path fill="#012169" d="M0 0h60v30H0z" />
            <path stroke="#fff" strokeWidth="6" d="m0 0 60 30m0-30L0 30" />
            <path stroke="#c8102e" strokeWidth="4" d="m0 0 60 30m0-30L0 30" clipPath="url(#vc-strata-gb)" />
            <path stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60" />
            <path stroke="#c8102e" strokeWidth="6" d="M30 0v30M0 15h60" />
        </svg>
    ),
    // Automatique : un globe, à la couleur du texte
    auto: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
        </svg>
    ),
};

const options = () => [
    { value: "auto", name: tr("Automatique", "Automatic"), hint: tr("Langue de Discord", "Discord's language") },
    ...LANGUAGES.map(l => ({ value: l.code as string, name: l.name, hint: "" })),
];

// Liste déroulante de la langue de la fenêtre Strata (réglage « language »)
export function LanguagePicker() {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const current = settings.store.language;
    const list = options();
    const selected = list.find(o => o.value === current) ?? list[0];

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => {
            if (!root.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    const choose = (value: string) => {
        setOpen(false);
        settings.store.language = value;
    };

    return (
        <div ref={root} className={cl("lang", { open })}>
            <button
                className={cl("lang-button")}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`${tr("Langue", "Language")} : ${selected.name}`}
                onClick={() => setOpen(o => !o)}
                onKeyDown={e => {
                    if (e.key === "Escape") setOpen(false);
                }}
            >
                <span className={cl("lang-flag", { globe: selected.value === "auto" })}>{FLAGS[selected.value]()}</span>
                <span className={cl("lang-name")}>{selected.name}</span>
                <span className={cl("lang-caret")} aria-hidden="true" />
            </button>
            {open && (
                <ul className={cl("lang-list")} role="listbox">
                    {list.map(o => (
                        <li key={o.value} role="option" aria-selected={o.value === selected.value}>
                            <button className={cl("lang-option")} onClick={() => choose(o.value)}>
                                <span className={cl("lang-flag", { globe: o.value === "auto" })}>{FLAGS[o.value]()}</span>
                                <span className={cl("lang-option-text")}>
                                    {o.name}
                                    {o.hint && <small>{o.hint}</small>}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
