/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Switch } from "@components/Switch";
import { classNameFactory } from "@utils/css";
import type { ComponentType, ReactNode } from "react";

import { useThrottledSetter } from "./drag";
import { Slider } from "./Slider";
import { getValue, SettingKey, setValue } from "./state";

export const cl = classNameFactory("vc-strata-");

interface HeadingProps {
    title: string;
    hint?: ReactNode;
    Icon?: ComponentType;
}

export function Heading({ title, hint, Icon }: HeadingProps) {
    return (
        <div className={cl("heading-row")}>
            {Icon && <div className={cl("heading-icon")}><Icon /></div>}
            <div>
                <h2 className={cl("heading")}>{title}</h2>
                {hint && <p className={cl("hint")}>{hint}</p>}
            </div>
        </div>
    );
}

interface ToggleRowProps {
    setting: SettingKey;
    title: string;
    description: string;
    Icon: ComponentType;
}

export function ToggleRow({ setting, title, description, Icon }: ToggleRowProps) {
    const checked = getValue<boolean>(setting);
    return (
        <div className={cl("row", { off: !checked })}>
            <div className={cl("row-icon")}><Icon /></div>
            <div className={cl("row-text")}>
                <div className={cl("row-title")}>{title}</div>
                <div className={cl("row-desc")}>{description}</div>
            </div>
            <Switch checked={checked} onChange={value => setValue(setting, value)} />
        </div>
    );
}

export type SliderPreset = [label: string, value: number];

interface SliderRowProps {
    setting: SettingKey;
    title: string;
    unit: string;
    min: number;
    max: number;
    presets: SliderPreset[];
    disabled?: boolean;
}

export function SliderRow({ setting, title, unit, min, max, presets, disabled }: SliderRowProps) {
    const value = getValue<number>(setting);
    const setThrottled = useThrottledSetter<number>(setting);
    return (
        <div className={cl("slider", { disabled })}>
            <div className={cl("slider-head")}>
                <span className={cl("row-title")}>{title}</span>
                <div className={cl("chips")} role="group" aria-label={`Présélections : ${title}`}>
                    {presets.map(([label, preset]) => (
                        <button
                            key={label}
                            className={cl("chip", { active: preset === value })}
                            disabled={disabled}
                            onClick={() => setValue(setting, preset)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
            <Slider label={title} value={value} min={min} max={max} unit={unit} disabled={disabled} onChange={setThrottled} />
        </div>
    );
}
