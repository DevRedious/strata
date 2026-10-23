/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as DataStore from "@api/DataStore";
import { useEffect, useReducer } from "@webpack/common";

import { applyVars } from "./applyTheme";
import { settings } from "./settings";

// Image de fond choisie sur l'ordinateur. Elle va dans le DataStore de Vencord
// (IndexedDB) et non dans les réglages : settings.json resterait lourd, et la
// synchronisation cloud de Vencord l'enverrait. Discord l'affiche par une adresse
// blob:, autorisée par la CSP de Vencord.
const KEY = "Strata_backgroundImage";

// Plus grand côté : assez pour un écran 1440p, sans garder une photo de 20 Mo
const MAX_SIZE = 2560;

// original : l'image enregistrée ; url : celle affichée, floutée ou assombrie au besoin
let original: Blob | null = null;
let url: string | null = null;
let generation = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

export const backgroundImageUrl = () => url;

function setUrl(blob: Blob | null) {
    if (url) URL.revokeObjectURL(url);
    url = blob ? URL.createObjectURL(blob) : null;
    applyVars();
    for (const listener of listeners) listener();
}

// Flou et luminosité calculés une fois sur une copie : un filtre CSS ne peut pas
// s'appliquer à une image de fond, et Discord la repeint sous chaque panneau
async function processed(blob: Blob) {
    const { imageBlur: blur, imageBrightness: brightness } = settings.store;
    if (!blur && brightness === 100) return blob;
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.filter = `blur(${blur}px) brightness(${brightness}%)`;
    // Agrandie d'une marge : sinon le flou fait entrer du transparent par les bords
    const margin = blur * 2;
    ctx.drawImage(bitmap, -margin, -margin, bitmap.width + margin * 2, bitmap.height + margin * 2);
    bitmap.close();
    return await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", 0.9)) ?? blob;
}

async function render() {
    const current = ++generation;
    const blob = original ? await processed(original) : null;
    // Un réglage a encore changé pendant le calcul : ce résultat est déjà périmé
    if (current === generation) setUrl(blob);
}

// Appelé à chaque mouvement des curseurs : on attend une courte pause avant de recalculer
export function refreshBackgroundImage() {
    clearTimeout(timer);
    timer = setTimeout(render, 150);
}

export async function loadBackgroundImage() {
    original = await DataStore.get<Blob>(KEY) ?? null;
    await render();
}

export function unloadBackgroundImage() {
    clearTimeout(timer);
    generation++;
    if (url) URL.revokeObjectURL(url);
    url = null;
    original = null;
}

const toHex = (channels: number[]) => "#" + channels.map(c => Math.round(c).toString(16).padStart(2, "0")).join("");

// Réduit l'image, la réencode en JPEG et calcule sa couleur moyenne, qui teinte
// le voile des panneaux comme la couleur d'un dégradé
async function prepare(file: File) {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", 0.9));
    if (!blob) throw new Error("Image illisible");

    const tiny = document.createElement("canvas");
    tiny.width = tiny.height = 16;
    const tinyCtx = tiny.getContext("2d")!;
    tinyCtx.drawImage(canvas, 0, 0, 16, 16);
    const { data } = tinyCtx.getImageData(0, 0, 16, 16);
    const sum = [0, 0, 0];
    for (let i = 0; i < data.length; i += 4) for (let c = 0; c < 3; c++) sum[c] += data[i + c];
    return { blob, tint: toHex(sum.map(s => s / (data.length / 4))) };
}

export async function saveBackgroundImage(file: File) {
    const { blob, tint } = await prepare(file);
    await DataStore.set(KEY, blob);
    settings.store.imageTint = tint;
    original = blob;
    await render();
}

export async function removeBackgroundImage() {
    await DataStore.del(KEY);
    original = null;
    await render();
}

// Pour la fenêtre de réglages : se redessine quand l'image change
export function useBackgroundImage() {
    const [, rerender] = useReducer((n: number) => n + 1, 0);
    useEffect(() => {
        listeners.add(rerender);
        return () => void listeners.delete(rerender);
    }, []);
    return url;
}
