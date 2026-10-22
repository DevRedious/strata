/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./Slider.css";

import { useState } from "@webpack/common";
import type { KeyboardEvent, PointerEvent } from "react";

import { cl } from "./controls";
import { startDrag } from "./drag";

interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    unit: string;
    disabled?: boolean;
    // Appelé à chaque mouvement : l'appelant espace les écritures
    onChange(value: number): void;
}

export function Slider({ label, value, min, max, unit, disabled, onChange }: SliderProps) {
    // Valeur affichée pendant un glisser, en avance sur la valeur enregistrée
    const [dragValue, setDragValue] = useState<number | null>(null);
    const shown = dragValue ?? value;
    const percent = ((shown - min) / (max - min)) * 100;

    const set = (next: number) => {
        const clamped = Math.min(max, Math.max(min, Math.round(next)));
        if (dragValue !== null) setDragValue(clamped);
        onChange(clamped);
    };

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (disabled || e.button !== 0) return;
        e.currentTarget.focus();
        setDragValue(shown);
        startDrag(e, x => {
            const next = Math.round(min + x * (max - min));
            setDragValue(next);
            onChange(next);
        }, () => setDragValue(null));
    };

    const onKeyDown = (e: KeyboardEvent) => {
        const big = Math.max(1, Math.round((max - min) / 10));
        const moves: Record<string, number> = {
            ArrowLeft: shown - (e.shiftKey ? big : 1),
            ArrowDown: shown - (e.shiftKey ? big : 1),
            ArrowRight: shown + (e.shiftKey ? big : 1),
            ArrowUp: shown + (e.shiftKey ? big : 1),
            Home: min,
            End: max,
        };
        if (!(e.key in moves)) return;
        e.preventDefault();
        set(moves[e.key]);
    };

    return (
        <div
            className={cl("range", { disabled, dragging: dragValue !== null })}
            role="slider"
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={shown}
            aria-valuetext={`${shown} ${unit}`}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onPointerDown={onPointerDown}
            onKeyDown={disabled ? undefined : onKeyDown}
        >
            <div className={cl("range-track")}>
                <div className={cl("range-fill")} style={{ width: `${percent}%` }} />
            </div>
            <div className={cl("range-thumb")} style={{ left: `${percent}%` }}>
                <span className={cl("range-bubble")}>{shown} {unit}</span>
            </div>
            <div className={cl("range-scale")}>
                <span>{min}</span>
                <span>{max} {unit}</span>
            </div>
        </div>
    );
}
