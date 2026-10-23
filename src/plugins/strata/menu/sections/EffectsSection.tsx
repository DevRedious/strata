/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { tr } from "@plugins/strata/i18n";
import { ChoiceRow, cl, Heading, SliderRow, ToggleRow } from "@plugins/strata/menu/controls";
import { PanelsIcon, SparkIcon } from "@plugins/strata/menu/icons";

export function EffectsSection() {
    return (
        <section className={cl("block")}>
            <Heading title={tr("Effets", "Effects")} hint={tr("Bordures, ombres et lueurs des panneaux flottants, et animations.", "Borders, shadows and glows of the floating panels, and animations.")} Icon={SparkIcon} />
            <div className={cl("card")}>
                <SliderRow setting="borderWidth" title={tr("Bordures", "Borders")} unit="px" min={0} max={2} presets={[[tr("Aucune", "None"), 0], [tr("Fine", "Thin"), 1], [tr("Épaisse", "Thick"), 2]]} />
            </div>
            <div className={cl("card", "list")}>
                <ChoiceRow
                    setting="panelShadow"
                    title={tr("Ombre", "Shadow")}
                    description={tr("Sous les panneaux", "Under the panels")}
                    Icon={PanelsIcon}
                    choices={[[tr("Aucune", "None"), "none"], [tr("Douce", "Soft"), "soft"], [tr("Marquée", "Strong"), "strong"]]}
                />
                <ToggleRow setting="accentGlow" title={tr("Lueur d'accent", "Accent glow")} description={tr("Halo autour du chat et du champ de saisie actif", "Halo around the chat and the active text box")} Icon={SparkIcon} />
                <ToggleRow
                    setting="animations"
                    title="Animations"
                    description={tr("Survols et menus en douceur. Coupées, le tiroir s'ouvre aussi sans animation.", "Smooth hovers and menus. When off, the drawer also opens without animation.")}
                    Icon={SparkIcon}
                />
            </div>
        </section>
    );
}
