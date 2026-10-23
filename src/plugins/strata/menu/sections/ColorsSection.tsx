/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { gradientBase, gradientCss, isHexColor, surfacesFor } from "@plugins/strata/colors";
import { tr } from "@plugins/strata/i18n";
import { removeBackgroundImage, saveBackgroundImage, useBackgroundImage } from "@plugins/strata/image";
import { ColorPicker } from "@plugins/strata/menu/ColorPicker";
import { cl, Heading, SliderPreset, SliderRow, ToggleRow } from "@plugins/strata/menu/controls";
import { useThrottledSetter } from "@plugins/strata/menu/drag";
import { LayoutIcon, PaletteIcon, UserIcon } from "@plugins/strata/menu/icons";
import { ACCENTS, BACKGROUNDS, GLASS_GRADIENTS, GradientPreset, GRADIENTS, nameOf, Preset } from "@plugins/strata/menu/presets";
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
                    title={tr("Couleur personnalisée", "Custom colour")}
                    aria-label={tr("Couleur personnalisée", "Custom colour")}
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
            <span className={cl("bg-name")}>{nameOf(preset)}</span>
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
            <span className={cl("bg-name")}>{nameOf(preset)}</span>
        </button>
    );
}

const ANGLES: SliderPreset[] = [["→", 90], ["↘", 135], ["↓", 180], ["↙", 225]];
const opacities = (): SliderPreset[] => [[tr("Verre", "Glass"), 50], [tr("Voilé", "Veiled"), 70], ["Nitro", 100]];

type Mode = "solid" | "gradient" | "glass" | "image";

const modes = (): [label: string, mode: Mode][] => [
    [tr("Uni", "Solid"), "solid"], [tr("Dégradé", "Gradient"), "gradient"], [tr("Translucide", "Translucent"), "glass"], ["Image", "image"],
];

const hints = (): Record<Mode, string> => ({
    solid: tr("Les panneaux sont éclaircis à partir du fond, pour garder le même contraste. Préférer une couleur sombre.",
        "Panels are lightened from the background, to keep the same contrast. A dark colour works best."),
    gradient: tr("Le dégradé est peint derrière les panneaux, qui en prennent la teinte. Préférer des couleurs sombres.",
        "The gradient is painted behind the panels, which take on its tint. Dark colours work best."),
    glass: tr("Le dégradé se voit à travers les panneaux, comme les thèmes Nitro. Préférer des couleurs vives.",
        "The gradient shows through the panels, like Nitro themes. Bright colours work best."),
    image: tr("Une image de ton choix, visible à travers les panneaux comme les thèmes Nitro. Les panneaux prennent sa teinte.",
        "A picture of your choice, showing through the panels like Nitro themes. Panels take on its tint."),
});

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
const OpacityRow = () => <SliderRow setting="glassOpacity" title={tr("Opacité des panneaux", "Panel opacity")} unit=" %" min={30} max={100} presets={opacities()} />;

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
                <span className={cl("gradient-label")}>{tr("Début", "Start")}</span>
            </CustomColor>
            <CustomColor setting="gradientTo" isPreset={presets.some(p => p.to === to)}>
                <span className={cl("gradient-label")}>{tr("Fin", "End")}</span>
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
            setError(tr("Cette image n'a pas pu être lue. Essaie un fichier JPEG, PNG ou WebP.", "This picture could not be read. Try a JPEG, PNG or WebP file."));
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
                    {!url && <span>{tr("Glisse une image ici", "Drop a picture here")}</span>}
                </div>
                <div className={cl("image-actions")}>
                    <div className={cl("image-buttons")}>
                        <button className={cl("ghost")} disabled={busy} onClick={() => input.current?.click()}>
                            {busy ? tr("Préparation…", "Preparing…") : url ? tr("Changer d'image…", "Change picture…") : tr("Choisir une image…", "Choose a picture…")}
                        </button>
                        {url && <button className={cl("ghost")} disabled={busy} onClick={() => removeBackgroundImage()}>{tr("Retirer", "Remove")}</button>}
                    </div>
                    <p className={cl("hint")}>{tr("L'image reste sur cet ordinateur : l'export des réglages ne la contient pas.", "The picture stays on this computer: exported settings do not include it.")}</p>
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
                    <SliderRow setting="imageBlur" title={tr("Flou", "Blur")} unit="px" min={0} max={30} presets={[[tr("Net", "Sharp"), 0], [tr("Doux", "Soft"), 8], [tr("Fort", "Strong"), 20]]} />
                    <SliderRow setting="imageBrightness" title={tr("Luminosité", "Brightness")} unit=" %" min={40} max={120} presets={[[tr("Sombre", "Dark"), 60], [tr("Normale", "Normal"), 100], [tr("Claire", "Bright"), 115]]} />
                </>
            )}
        </>
    );
}

const STATUS_KEYS: SettingKey[] = ["statusOnline", "statusIdle", "statusDnd", "statusOffline"];

const statuses = (): [setting: SettingKey, label: string][] => [
    ["statusOnline", tr("En ligne", "Online")],
    ["statusIdle", tr("Absent", "Idle")],
    ["statusDnd", tr("Occupé", "Do not disturb")],
    ["statusOffline", tr("Hors ligne", "Offline")],
];

// Jeux de couleurs tout faits, dans l'ordre de STATUSES
const STATUS_PALETTES: [name: string, en: string, colors: string[]][] = [
    ["Discord", "Discord", ["#45a366", "#ffc04e", "#da3e44", "#84858d"]],
    ["Vives", "Vivid", ["#22c55e", "#facc15", "#ef4444", "#71717a"]],
    ["Douces", "Soft", ["#86efac", "#fde68a", "#fca5a5", "#a1a1aa"]],
];

function StatusColors() {
    const current = STATUS_KEYS.map(setting => getValue<string>(setting));
    return (
        <section className={cl("block")}>
            <div className={cl("heading-split")}>
                <Heading title={tr("Statuts", "Statuses")} hint={tr("Pastilles de statut des avatars et textes de statut.", "Status dots on avatars and status texts.")} Icon={UserIcon} />
                <div className={cl("chips")} role="group" aria-label={tr("Couleurs des statuts", "Status colours")}>
                    {STATUS_PALETTES.map(([name, en, colors]) => (
                        <button
                            key={name}
                            className={cl("chip", { active: colors.every((c, i) => c === current[i]) })}
                            onClick={() => STATUS_KEYS.forEach((setting, i) => setValue(setting, colors[i]))}
                        >
                            {tr(name, en)}
                        </button>
                    ))}
                </div>
            </div>
            {statuses().map(([setting, label]) => (
                <CustomColor key={setting} setting={setting} isPreset={STATUS_PALETTES.some(([, , colors]) => colors.includes(getValue<string>(setting)))}>
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
                <Heading
                    title={tr("Couleur d'accent", "Accent colour")}
                    hint={tr("Sélection, boutons, mentions, salon actif. Le texte posé dessus s'adapte tout seul.", "Selection, buttons, mentions, active channel. Text on top of it adapts on its own.")}
                    Icon={PaletteIcon}
                />
                <CustomColor setting="accent" isPreset={ACCENTS.some(p => p.hex === accent)}>
                    {ACCENTS.map(preset => ({ ...preset, name: nameOf(preset) })).map(({ name, hex }) => (
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
                        title={tr("Accent en dégradé", "Gradient accent")}
                        description={tr("Boutons, serveur survolé, salon actif et mentions en dégradé", "Buttons, hovered server, active channel and mentions as a gradient")}
                        Icon={PaletteIcon}
                    />
                </div>
                {accentGradient && <span className={cl("subheading")}>{tr("Seconde couleur du dégradé", "Second gradient colour")}</span>}
                {accentGradient && (
                    <CustomColor setting="accentTo" isPreset={ACCENTS.some(p => p.hex === accentTo)}>
                        {ACCENTS.map(preset => ({ ...preset, name: nameOf(preset) })).map(({ name, hex }) => (
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
                    <span className={cl("preview-button")}>{tr("Bouton", "Button")}</span>
                    <span className={cl("preview-mention")}>@Strata</span>
                    <span className={cl("preview-channel")}>{tr("# général", "# general")}</span>
                    <span className={cl("preview-link")}>{tr("un lien", "a link")}</span>
                </div>
            </section>

            <section className={cl("block")}>
                <div className={cl("heading-split")}>
                    <Heading title={tr("Fond", "Background")} hint={hints()[mode]} Icon={LayoutIcon} />
                    <div className={cl("chips")} role="group" aria-label={tr("Type de fond", "Background type")}>
                        {modes().map(([label, value]) => (
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
