/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { gradientBase, gradientCss, isHexColor, surfacesFor } from "@plugins/strata/colors";
import { removeBackgroundImage, saveBackgroundImage, useBackgroundImage } from "@plugins/strata/image";
import { ColorPicker } from "@plugins/strata/menu/ColorPicker";
import { cl, Heading, SliderPreset, SliderRow, ToggleRow } from "@plugins/strata/menu/controls";
import { useThrottledSetter } from "@plugins/strata/menu/drag";
import { LayoutIcon, PaletteIcon, UserIcon } from "@plugins/strata/menu/icons";
import { ACCENTS, BACKGROUNDS, GLASS_GRADIENTS, GradientPreset, GRADIENTS, Preset } from "@plugins/strata/menu/presets";
import { getValue, SettingKey, setValue } from "@plugins/strata/menu/state";
import { useEffect, useRef, useState } from "@webpack/common";
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

function GradientOption({ preset, active }: { preset: GradientPreset; active: boolean; }) {
    const { from, to, angle } = preset;
    const [s1, s2] = surfacesFor(gradientBase(from, to));
    return (
        <button className={cl("bg-option", { active })} onClick={() => applyPreset(preset)}>
            <span className={cl("bg-preview")} style={{ background: gradientCss(from, to, angle) }}>
                <b style={{ background: s1 }} />
                <b style={{ background: s2 }} />
            </span>
            <span className={cl("bg-name")}>{preset.name}</span>
        </button>
    );
}

const ANGLES: SliderPreset[] = [["→", 90], ["↘", 135], ["↓", 180], ["↙", 225]];
const OPACITIES: SliderPreset[] = [["Verre", 50], ["Voilé", 70], ["Nitro", 100]];

type Mode = "solid" | "gradient" | "glass" | "image";

const MODES: [label: string, mode: Mode][] = [["Uni", "solid"], ["Dégradé", "gradient"], ["Translucide", "glass"], ["Image", "image"]];

const HINTS: Record<Mode, string> = {
    solid: "Les panneaux sont éclaircis à partir du fond, pour garder le même contraste. Préférer une couleur sombre.",
    gradient: "Le dégradé est peint derrière les panneaux, qui en prennent la teinte. Préférer des couleurs sombres.",
    glass: "Le dégradé se voit à travers les panneaux, comme les thèmes Nitro. Préférer des couleurs vives.",
    image: "Une image de ton choix, visible à travers les panneaux comme les thèmes Nitro. Les panneaux prennent sa teinte.",
};

const presetsFor = (mode: Mode) => mode === "glass" ? GLASS_GRADIENTS : GRADIENTS;

function applyPreset({ from, to, angle }: GradientPreset) {
    setValue("gradientFrom", from);
    setValue("gradientTo", to);
    setValue("gradientAngle", angle);
}

// Un dégradé sombre ne se voit pas à travers les panneaux, un dégradé vif est criard
// derrière eux : en changeant de mode, un dégradé tout fait est remplacé par le
// premier de l'autre liste. Un dégradé personnalisé est gardé tel quel.
function switchMode(mode: Mode) {
    const from = getValue<string>("gradientFrom");
    const to = getValue<string>("gradientTo");
    const wasPreset = [...GRADIENTS, ...GLASS_GRADIENTS].some(p => p.from === from && p.to === to);
    const presets = presetsFor(mode);
    const usesPresets = mode === "gradient" || mode === "glass";
    if (usesPresets && wasPreset && !presets.some(p => p.from === from && p.to === to)) applyPreset(presets[0]);
    setValue("backgroundMode", mode);
}

// Un composant et non une constante JSX : pas de JSX évalué au chargement du module
const OpacityRow = () => <SliderRow setting="glassOpacity" title="Opacité des panneaux" unit=" %" min={30} max={100} presets={OPACITIES} />;

function GradientControls({ mode }: { mode: Mode; }) {
    const from = getValue<string>("gradientFrom");
    const to = getValue<string>("gradientTo");
    const angle = getValue<number>("gradientAngle");
    const presets = presetsFor(mode);
    return (
        <>
            <div className={cl("bg-grid")}>
                {presets.map(p => (
                    <GradientOption key={p.name} preset={p} active={p.from === from && p.to === to && p.angle === angle} />
                ))}
            </div>
            <CustomColor setting="gradientFrom" isPreset={presets.some(p => p.from === from)}>
                <span className={cl("gradient-label")}>Début</span>
            </CustomColor>
            <CustomColor setting="gradientTo" isPreset={presets.some(p => p.to === to)}>
                <span className={cl("gradient-label")}>Fin</span>
            </CustomColor>
            <SliderRow setting="gradientAngle" title="Angle" unit="°" min={0} max={360} presets={ANGLES} />
            {mode === "glass" && <OpacityRow />}
        </>
    );
}

// Image de l'ordinateur : bouton ou glisser-déposer sur l'aperçu
function ImageControls() {
    const url = useBackgroundImage();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const input = useRef<HTMLInputElement>(null);

    const pick = async (file: File | undefined) => {
        if (!file) return;
        setBusy(true);
        setError(null);
        try {
            await saveBackgroundImage(file);
        } catch {
            setError("Cette image n'a pas pu être lue. Essaie un fichier JPEG, PNG ou WebP.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <div className={cl("image-row")}>
                <div
                    className={cl("image-preview", { empty: !url })}
                    style={url ? { backgroundImage: `url("${url}")` } : undefined}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                        e.preventDefault();
                        pick(e.dataTransfer.files[0]);
                    }}
                >
                    {!url && <span>Glisse une image ici</span>}
                </div>
                <div className={cl("image-actions")}>
                    <div className={cl("image-buttons")}>
                        <button className={cl("ghost")} disabled={busy} onClick={() => input.current?.click()}>
                            {busy ? "Préparation…" : url ? "Changer d'image…" : "Choisir une image…"}
                        </button>
                        {url && <button className={cl("ghost")} disabled={busy} onClick={() => removeBackgroundImage()}>Retirer</button>}
                    </div>
                    <p className={cl("hint")}>L'image reste sur cet ordinateur : l'export des réglages ne la contient pas.</p>
                    {error && <p className={cl("image-error")}>{error}</p>}
                </div>
                <input
                    ref={input}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => {
                        pick(e.currentTarget.files?.[0]);
                        e.currentTarget.value = "";
                    }}
                />
            </div>
            <OpacityRow />
            {url && (
                <>
                    <SliderRow setting="imageBlur" title="Flou" unit="px" min={0} max={30} presets={[["Net", 0], ["Doux", 8], ["Fort", 20]]} />
                    <SliderRow setting="imageBrightness" title="Luminosité" unit=" %" min={40} max={120} presets={[["Sombre", 60], ["Normale", 100], ["Claire", 115]]} />
                </>
            )}
        </>
    );
}

const STATUSES: [setting: SettingKey, label: string][] = [
    ["statusOnline", "En ligne"],
    ["statusIdle", "Absent"],
    ["statusDnd", "Occupé"],
    ["statusOffline", "Hors ligne"],
];

// Jeux de couleurs tout faits, dans l'ordre de STATUSES
const STATUS_PALETTES: [name: string, colors: string[]][] = [
    ["Discord", ["#45a366", "#ffc04e", "#da3e44", "#84858d"]],
    ["Vives", ["#22c55e", "#facc15", "#ef4444", "#71717a"]],
    ["Douces", ["#86efac", "#fde68a", "#fca5a5", "#a1a1aa"]],
];

function StatusColors() {
    const current = STATUSES.map(([setting]) => getValue<string>(setting));
    return (
        <section className={cl("block")}>
            <div className={cl("heading-split")}>
                <Heading title="Statuts" hint="Pastilles de statut des avatars et textes de statut." Icon={UserIcon} />
                <div className={cl("chips")} role="group" aria-label="Couleurs des statuts">
                    {STATUS_PALETTES.map(([name, colors]) => (
                        <button
                            key={name}
                            className={cl("chip", { active: colors.every((c, i) => c === current[i]) })}
                            onClick={() => STATUSES.forEach(([setting], i) => setValue(setting, colors[i]))}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>
            {STATUSES.map(([setting, label]) => (
                <CustomColor key={setting} setting={setting} isPreset={STATUS_PALETTES.some(([, colors]) => colors.includes(getValue<string>(setting)))}>
                    <span className={cl("gradient-label", "status-label")}>
                        <i style={{ background: getValue<string>(setting) }} />{label}
                    </span>
                </CustomColor>
            ))}
        </section>
    );
}

export function ColorsSection() {
    const accent = getValue<string>("accent");
    const background = getValue<string>("background");
    const mode = getValue<Mode>("backgroundMode");
    const accentGradient = getValue<boolean>("accentGradient");
    const accentTo = getValue<string>("accentTo");
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
                <div className={cl("card", "list")}>
                    <ToggleRow
                        setting="accentGradient"
                        title="Accent en dégradé"
                        description="Boutons, serveur survolé, salon actif et mentions en dégradé"
                        Icon={PaletteIcon}
                    />
                </div>
                {accentGradient && <span className={cl("subheading")}>Seconde couleur du dégradé</span>}
                {accentGradient && (
                    <CustomColor setting="accentTo" isPreset={ACCENTS.some(p => p.hex === accentTo)}>
                        {ACCENTS.map(({ name, hex }) => (
                            <button
                                key={hex}
                                className={cl("swatch", { active: hex === accentTo })}
                                style={{ background: hex }}
                                title={name}
                                aria-label={name}
                                onClick={() => setValue("accentTo", hex)}
                            />
                        ))}
                    </CustomColor>
                )}
                <div className={cl("preview")}>
                    <span className={cl("preview-button")}>Bouton</span>
                    <span className={cl("preview-mention")}>@Strata</span>
                    <span className={cl("preview-channel")}># général</span>
                    <span className={cl("preview-link")}>un lien</span>
                </div>
            </section>

            <section className={cl("block")}>
                <div className={cl("heading-split")}>
                    <Heading title="Fond" hint={HINTS[mode]} Icon={LayoutIcon} />
                    <div className={cl("chips")} role="group" aria-label="Type de fond">
                        {MODES.map(([label, value]) => (
                            <button key={value} className={cl("chip", { active: mode === value })} onClick={() => switchMode(value)}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                {mode === "image" && <ImageControls />}
                {(mode === "gradient" || mode === "glass") && <GradientControls mode={mode} />}
                {mode === "solid" && (
                        <>
                            <div className={cl("bg-grid")}>
                                {BACKGROUNDS.map(p => <BackgroundOption key={p.hex} preset={p} active={p.hex === background} />)}
                            </div>
                            <CustomColor setting="background" isPreset={BACKGROUNDS.some(p => p.hex === background)} />
                        </>
                    )}
            </section>

            <StatusColors />
        </>
    );
}
