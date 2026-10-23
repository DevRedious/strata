/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { tr } from "@plugins/strata/i18n";
import { Chips, Choice, ChoiceRow, cl, Heading, SliderRow } from "@plugins/strata/menu/controls";
import { ChatIcon, LayoutIcon, TextIcon, UserIcon } from "@plugins/strata/menu/icons";
import { getValue, setValue } from "@plugins/strata/menu/state";
import { isFontName } from "@plugins/strata/settings";
import { useEffect, useState } from "@webpack/common";

const fonts = (): Choice[] => [["Discord", "discord"], ["Segoe UI", "segoe"], ["Bahnschrift", "bahnschrift"], [tr("Système", "System"), "system"], [tr("Autre", "Other"), "custom"]];

// Nom d'une police installée : enregistré dès qu'il est valide
function FontNameInput() {
    const value = getValue<string>("fontCustom");
    const [draft, setDraft] = useState(value);
    useEffect(() => setDraft(value), [value]);
    return (
        <input
            className={cl("text-input", { invalid: !isFontName(draft) })}
            placeholder={tr("Nom exact de la police, par exemple Cascadia Code", "Exact font name, for example Cascadia Code")}
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
                    title={tr("Police", "Font")}
                    hint={tr("Pour toute l'interface. Seules des polices installées sur cet ordinateur : rien n'est téléchargé.", "For the whole interface. Only fonts installed on this computer: nothing is downloaded.")}
                    Icon={TextIcon}
                />
                <Chips setting="fontFamily" choices={fonts()} label={tr("Police", "Font")} />
                {font === "custom" && <FontNameInput />}
                <p className={cl("font-sample")}>{tr("Portez ce vieux whisky au juge blond qui fume. 0123456789", "The quick brown fox jumps over the lazy dog. 0123456789")}</p>
            </section>

            <section className={cl("block")}>
                <Heading
                    title={tr("Messages", "Messages")}
                    hint={tr("Aux valeurs « Normal », Discord garde ses propres réglages d'accessibilité.", "At “Normal”, Discord keeps its own accessibility settings.")}
                    Icon={ChatIcon}
                />
                <div className={cl("card")}>
                    <SliderRow setting="chatFontSize" title={tr("Taille du texte", "Text size")} unit="px" min={12} max={20} presets={[[tr("Petit", "Small"), 14], ["Normal", 16], [tr("Grand", "Large"), 18]]} />
                    <SliderRow setting="messageSpacing" title={tr("Espacement", "Spacing")} unit="px" min={0} max={24} presets={[[tr("Serré", "Tight"), 4], ["Normal", 16], [tr("Aéré", "Airy"), 24]]} />
                    <SliderRow setting="avatarSize" title="Avatars" unit="px" min={24} max={48} presets={[[tr("Petits", "Small"), 32], [tr("Normaux", "Normal"), 40], [tr("Grands", "Large"), 48]]} />
                </div>
            </section>

            <section className={cl("block")}>
                <Heading title={tr("Formes", "Shapes")} hint={tr("Avatars des messages et icônes de la barre des serveurs.", "Message avatars and server bar icons.")} Icon={UserIcon} />
                <div className={cl("card", "list")}>
                    <ChoiceRow
                        setting="avatarShape"
                        title="Avatars"
                        description={tr("Dans les messages", "In messages")}
                        Icon={UserIcon}
                        choices={[[tr("Ronds", "Round"), "round"], [tr("Arrondis", "Rounded"), "rounded"], [tr("Carrés", "Square"), "square"]]}
                    />
                    <ChoiceRow
                        setting="guildShape"
                        title={tr("Serveurs", "Servers")}
                        description={tr("Barre des serveurs", "Server bar")}
                        Icon={LayoutIcon}
                        choices={[["Discord", "discord"], [tr("Ronds", "Round"), "round"], [tr("Arrondis", "Rounded"), "rounded"], [tr("Carrés", "Square"), "square"]]}
                    />
                </div>
            </section>
        </>
    );
}
