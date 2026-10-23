/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Chips, Choice, ChoiceRow, cl, Heading, SliderRow } from "@plugins/strata/menu/controls";
import { ChatIcon, LayoutIcon, TextIcon, UserIcon } from "@plugins/strata/menu/icons";
import { getValue, setValue } from "@plugins/strata/menu/state";
import { isFontName } from "@plugins/strata/settings";
import { useEffect, useState } from "@webpack/common";

const FONTS: Choice[] = [["Discord", "discord"], ["Segoe UI", "segoe"], ["Bahnschrift", "bahnschrift"], ["Système", "system"], ["Autre", "custom"]];

// Nom d'une police installée : enregistré dès qu'il est valide
function FontNameInput() {
    const value = getValue<string>("fontCustom");
    const [draft, setDraft] = useState(value);
    useEffect(() => setDraft(value), [value]);
    return (
        <input
            className={cl("text-input", { invalid: !isFontName(draft) })}
            placeholder="Nom exact de la police, par exemple Cascadia Code"
            spellCheck={false}
            maxLength={60}
            value={draft}
            onChange={e => {
                const next = e.currentTarget.value;
                setDraft(next);
                if (isFontName(next)) setValue("fontCustom", next);
            }}
        />
    );
}

export function TextSection() {
    const font = getValue<string>("fontFamily");
    return (
        <>
            <section className={cl("block")}>
                <Heading
                    title="Police"
                    hint="Pour toute l'interface. Seules des polices installées sur cet ordinateur : rien n'est téléchargé."
                    Icon={TextIcon}
                />
                <Chips setting="fontFamily" choices={FONTS} label="Police" />
                {font === "custom" && <FontNameInput />}
                <p className={cl("font-sample")}>Portez ce vieux whisky au juge blond qui fume. 0123456789</p>
            </section>

            <section className={cl("block")}>
                <Heading
                    title="Messages"
                    hint="Aux valeurs « Normal », Discord garde ses propres réglages d'accessibilité."
                    Icon={ChatIcon}
                />
                <div className={cl("card")}>
                    <SliderRow setting="chatFontSize" title="Taille du texte" unit="px" min={12} max={20} presets={[["Petit", 14], ["Normal", 16], ["Grand", 18]]} />
                    <SliderRow setting="messageSpacing" title="Espacement" unit="px" min={0} max={24} presets={[["Serré", 4], ["Normal", 16], ["Aéré", 24]]} />
                    <SliderRow setting="avatarSize" title="Avatars" unit="px" min={24} max={48} presets={[["Petits", 32], ["Normaux", 40], ["Grands", 48]]} />
                </div>
            </section>

            <section className={cl("block")}>
                <Heading title="Formes" hint="Avatars des messages et icônes de la barre des serveurs." Icon={UserIcon} />
                <div className={cl("card", "list")}>
                    <ChoiceRow
                        setting="avatarShape"
                        title="Avatars"
                        description="Dans les messages"
                        Icon={UserIcon}
                        choices={[["Ronds", "round"], ["Arrondis", "rounded"], ["Carrés", "square"]]}
                    />
                    <ChoiceRow
                        setting="guildShape"
                        title="Serveurs"
                        description="Barre des serveurs"
                        Icon={LayoutIcon}
                        choices={[["Discord", "discord"], ["Ronds", "round"], ["Arrondis", "rounded"], ["Carrés", "square"]]}
                    />
                </div>
            </section>
        </>
    );
}
