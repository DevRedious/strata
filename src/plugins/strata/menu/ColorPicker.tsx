/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ColorPicker.css";

import { hexToHsv, Hsv, hsvToHex } from "@plugins/strata/colors";
import { tr } from "@plugins/strata/i18n";
import { useEffect, useRef, useState } from "@webpack/common";
import type { KeyboardEvent, PointerEvent } from "react";

import { cl } from "./controls";
import { startDrag } from "./drag";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

interface ColorPickerProps {
    value: string;
    onChange(hex: string): void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
    const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(value));
    // Toujours la couleur la plus récente, même entre deux rendus pendant un glisser
    const current = useRef(hsv);
    const dragging = useRef(false);
    // Dernière couleur émise : une valeur venue d'ailleurs (pastille, champ, import) resynchronise,
    // sauf pendant un glisser, où la valeur enregistrée a toujours un temps de retard
    const emitted = useRef(value);
    useEffect(() => {
        if (dragging.current || value === emitted.current) return;
        emitted.current = value;
        current.current = hexToHsv(value);
        setHsv(current.current);
    }, [value]);

    const update = (patch: Partial<Hsv>) => {
        current.current = { ...current.current, ...patch };
        setHsv(current.current);
        emitted.current = hsvToHex(current.current);
        onChange(emitted.current);
    };

    const drag = (onMove: (x: number, y: number) => void) => (e: PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        dragging.current = true;
        startDrag(e, onMove, () => { dragging.current = false; });
    };

    const areaKeys = (e: KeyboardEvent) => {
        const step = e.shiftKey ? 0.1 : 0.02;
        const moves: Record<string, Partial<Hsv>> = {
            ArrowLeft: { s: clamp(hsv.s - step) },
            ArrowRight: { s: clamp(hsv.s + step) },
            ArrowUp: { v: clamp(hsv.v + step) },
            ArrowDown: { v: clamp(hsv.v - step) },
        };
        if (!moves[e.key]) return;
        e.preventDefault();
        update(moves[e.key]);
    };

    const hueKeys = (e: KeyboardEvent) => {
        const step = e.shiftKey ? 30 : 5;
        const delta = e.key === "ArrowLeft" || e.key === "ArrowDown" ? -step : e.key === "ArrowRight" || e.key === "ArrowUp" ? step : 0;
        if (!delta) return;
        e.preventDefault();
        update({ h: (hsv.h + delta + 360) % 360 });
    };

    return (
        <div className={cl("picker")}>
            <div
                className={cl("picker-area")}
                style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)` }}
                role="slider"
                aria-label={tr("Saturation et luminosité", "Saturation and brightness")}
                aria-valuetext={emitted.current}
                tabIndex={0}
                onKeyDown={areaKeys}
                onPointerDown={drag((x, y) => update({ s: x, v: 1 - y }))}
            >
                <span
                    className={cl("picker-handle")}
                    style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hsvToHex(hsv) }}
                />
            </div>
            <div
                className={cl("picker-hue")}
                role="slider"
                aria-label={tr("Teinte", "Hue")}
                aria-valuemin={0}
                aria-valuemax={360}
                aria-valuenow={Math.round(hsv.h)}
                tabIndex={0}
                onKeyDown={hueKeys}
                onPointerDown={drag(x => update({ h: x * 360 }))}
            >
                <span
                    className={cl("picker-handle")}
                    style={{ left: `${(hsv.h / 360) * 100}%`, top: "50%", background: `hsl(${hsv.h} 100% 50%)` }}
                />
            </div>
        </div>
    );
}
