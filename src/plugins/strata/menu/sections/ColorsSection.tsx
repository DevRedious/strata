/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { isHexColor, surfacesFor } from "@plugins/strata/colors";
import { ColorPicker } from "@plugins/strata/menu/ColorPicker";
import { cl, Heading } from "@plugins/strata/menu/controls";
import { useThrottledSetter } from "@plugins/strata/menu/drag";
import { LayoutIcon, PaletteIcon } from "@plugins/strata/menu/icons";
import { ACCENTS, BACKGROUNDS, Preset } from "@plugins/strata/menu/presets";
import { getValue, SettingKey, setValue } from "@plugins/strata/menu/state";
import { useEffect, useState } from "@webpack/common";
import type { ReactNode } from "react";

// Champ #rrggbb : la saisie n'est enregistrée qu'une fois valide
function HexInput({ setting }: { setting: SettingKey; }) {
    const value = getValue<string>(setting);
    const [draft, setDraft] = useState(value);
    useEffect(() => setDraft(value), [value]);

    return (
        <label className={cl("hex", { invalid: !isHexColor(draft) })}>
            <i style={{ background: value }} />
            <input
                value={draft}
                spellCheck={false}
                maxLength={7}
                onChange={e => {
                    const next = e.currentTarget.value.trim().toLowerCase();
                    setDraft(next);
                    if (isHexColor(next)) setValue(setting, next);
                }}
            />
        </label>
    );
}

interface CustomColorProps {
    setting: SettingKey;
    isPreset: boolean;
    children?: ReactNode;
}

// Pastilles éventuelles, pastille arc-en-ciel et champ #rrggbb ; l'arc-en-ciel déplie
// le sélecteur sous la rangée, dans le contenu de la fenêtre (rien n'est coupé au bord)
function CustomColor({ setting, isPreset, children }: CustomColorProps) {
    const [open, setOpen] = useState(false);
    const setThrottled = useThrottledSetter<string>(setting);
    return (
        <>
            <div className={cl("swatches")}>
                {children}
                <button
                    className={cl("swatch", "swatch-custom", { active: !isPreset || open })}
                    title="Couleur personnalisée"
                    aria-label="Couleur personnalisée"
                    aria-expanded={open}
                    onClick={() => setOpen(o => !o)}
                >
                    <span />
                </button>
                <HexInput setting={setting} />
            </div>
            {open && <ColorPicker value={getValue<string>(setting)} onChange={setThrottled} />}
        </>
    );
}

function BackgroundOption({ preset, active }: { preset: Preset; active: boolean; }) {
    const [s1, s2] = surfacesFor(preset.hex);
    return (
        <button className={cl("bg-option", { active })} onClick={() => setValue("background", preset.hex)}>
            <span className={cl("bg-preview")} style={{ background: preset.hex }}>
                <b style={{ background: s1 }} />
                <b style={{ background: s2 }} />
            </span>
            <span className={cl("bg-name")}>{preset.name}</span>
        </button>
    );
}

export function ColorsSection() {
    const accent = getValue<string>("accent");
    const background = getValue<string>("background");
    return (
        <>
            <section className={cl("block")}>
                <Heading title="Couleur d'accent" hint="Sélection, boutons, mentions, salon actif. Le texte posé dessus s'adapte tout seul." Icon={PaletteIcon} />
                <CustomColor setting="accent" isPreset={ACCENTS.some(p => p.hex === accent)}>
                    {ACCENTS.map(({ name, hex }) => (
                        <button
                            key={hex}
                            className={cl("swatch", { active: hex === accent })}
                            style={{ background: hex }}
                            title={name}
                            aria-label={name}
                            onClick={() => setValue("accent", hex)}
                        />
                    ))}
                </CustomColor>
                <div className={cl("preview")}>
                    <span className={cl("preview-button")}>Bouton</span>
                    <span className={cl("preview-mention")}>@Strata</span>
                    <span className={cl("preview-channel")}># général</span>
                    <span className={cl("preview-link")}>un lien</span>
                </div>
            </section>

            <section className={cl("block")}>
                <Heading title="Fond" hint="Les panneaux sont éclaircis à partir du fond, pour garder le même contraste. Préférer une couleur sombre." Icon={LayoutIcon} />
                <div className={cl("bg-grid")}>
                    {BACKGROUNDS.map(p => <BackgroundOption key={p.hex} preset={p} active={p.hex === background} />)}
                </div>
                <CustomColor setting="background" isPreset={BACKGROUNDS.some(p => p.hex === background)} />
            </section>
        </>
    );
}
