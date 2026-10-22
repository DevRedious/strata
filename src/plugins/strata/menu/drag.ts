/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useEffect, useRef } from "@webpack/common";
import type { PointerEvent } from "react";

import { SettingKey, setValue } from "./state";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

// Glisser : le geste commence sur l'élément, puis on suit le pointeur sur toute la page
// (écouteurs sur window) par rapport au rectangle mémorisé au départ. Pas de capture
// du pointeur, que les calques de Discord gèrent à leur façon. x et y vont de 0 à 1.
export function startDrag(e: PointerEvent<HTMLElement>, onMove: (x: number, y: number) => void, onEnd?: () => void) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const move = (ev: { clientX: number; clientY: number; }) =>
        onMove(clamp((ev.clientX - rect.left) / rect.width), clamp((ev.clientY - rect.top) / rect.height));
    const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
        window.removeEventListener("pointercancel", stop);
        onEnd?.();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    move(e);
}

// Vencord écrit ses réglages sur le disque à chaque changement : pendant un glisser,
// on n'enregistre qu'une valeur toutes les 60 ms, et toujours la dernière
export function useThrottledSetter<T>(setting: SettingKey) {
    const pending = useRef<{ value: T; } | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const flush = () => {
        timer.current = null;
        if (pending.current) setValue(setting, pending.current.value);
        pending.current = null;
    };

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
        flush();
    }, [setting]);

    return (value: T) => {
        pending.current = { value };
        if (!timer.current) timer.current = setTimeout(flush, 60);
    };
}
