/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { gradientBase, gradientCss, surfacesFor } from "@plugins/strata/colors";
import { cl, Heading } from "@plugins/strata/menu/controls";
import { SaveIcon, ThemesIcon, TrashIcon } from "@plugins/strata/menu/icons";
import { applyTheme, BUILTIN_THEMES, deleteTheme, isCurrentTheme, loadSavedThemes, saveTheme, Theme, themeValue } from "@plugins/strata/menu/themes";
import { showToast, useEffect, useState } from "@webpack/common";

// Miniature : fond (uni ou dégradé), deux panneaux et l'accent
function ThemePreview({ theme }: { theme: Theme; }) {
    const value = <T,>(key: Parameters<typeof themeValue>[1]) => themeValue<T>(theme, key);
    const mode = value<string>("backgroundMode");
    const from = value<string>("gradientFrom");
    const to = value<string>("gradientTo");
    const base = mode === "solid" ? value<string>("background") : gradientBase(from, to);
    const [s1, s2] = surfacesFor(base);
    const glass = mode === "glass" || mode === "image";
    const accent = value<string>("accent");
    const accentFill = value<boolean>("accentGradient") ? `linear-gradient(135deg, ${accent}, ${value<string>("accentTo")})` : accent;
    return (
        <span className={cl("theme-preview")} style={{ background: mode === "solid" ? base : gradientCss(from, to, value<number>("gradientAngle")) }}>
            <b style={{ background: glass ? "rgb(0 0 0 / 45%)" : s1 }} />
            <b style={{ background: glass ? "rgb(0 0 0 / 35%)" : s2 }}>
                <i style={{ background: accentFill }} />
            </b>
        </span>
    );
}

function ThemeCard({ theme, onDelete }: { theme: Theme; onDelete?: () => void; }) {
    const active = isCurrentTheme(theme);
    return (
        <div className={cl("theme-card", { active })}>
            <button className={cl("theme-apply")} onClick={() => applyTheme(theme)} title={`Appliquer « ${theme.name} »`}>
                <ThemePreview theme={theme} />
                <span className={cl("theme-name")}>{theme.name}</span>
            </button>
            {onDelete && (
                <button className={cl("theme-delete")} onClick={onDelete} aria-label={`Supprimer « ${theme.name} »`} title="Supprimer">
                    <TrashIcon />
                </button>
            )}
        </div>
    );
}

export function ThemesSection() {
    const [saved, setSaved] = useState<Theme[]>([]);
    const [name, setName] = useState("");
    useEffect(() => {
        loadSavedThemes().then(setSaved);
    }, []);

    async function save() {
        const trimmed = name.trim();
        setSaved(await saveTheme(trimmed));
        setName("");
        showToast({ text: `Thème « ${trimmed} » enregistré`, variant: "success" });
    }

    return (
        <>
            <section className={cl("block")}>
                <Heading
                    title="Galerie"
                    hint="Des thèmes tout faits : couleurs, texte, disposition et effets. Les parties, le tiroir et le mode épuré ne changent pas."
                    Icon={ThemesIcon}
                />
                <div className={cl("theme-grid")}>
                    {BUILTIN_THEMES.map(theme => <ThemeCard key={theme.name} theme={theme} />)}
                </div>
            </section>

            <section className={cl("block")}>
                <Heading
                    title="Mes thèmes"
                    hint="Enregistre tes réglages actuels pour y revenir en un clic. L'image de fond n'est pas incluse."
                    Icon={SaveIcon}
                />
                <div className={cl("theme-save")}>
                    <input
                        className={cl("text-input")}
                        placeholder="Nom du thème"
                        maxLength={40}
                        value={name}
                        onChange={e => setName(e.currentTarget.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter" && name.trim()) save();
                        }}
                    />
                    <button className={cl("ghost")} disabled={!name.trim()} onClick={save}>Enregistrer</button>
                </div>
                {saved.length
                    ? (
                        <div className={cl("theme-grid")}>
                            {saved.map(theme => (
                                <ThemeCard key={theme.name} theme={theme} onDelete={async () => setSaved(await deleteTheme(theme.name))} />
                            ))}
                        </div>
                    )
                    : <p className={cl("hint")}>Aucun thème enregistré pour l'instant.</p>}
            </section>
        </>
    );
}
