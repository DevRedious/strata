/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ChoiceRow, cl, Heading, SliderRow, ToggleRow } from "@plugins/strata/menu/controls";
import { PanelsIcon, SparkIcon } from "@plugins/strata/menu/icons";

export function EffectsSection() {
    return (
        <section className={cl("block")}>
            <Heading title="Effets" hint="Bordures, ombres et lueurs des panneaux flottants, et animations." Icon={SparkIcon} />
            <div className={cl("card")}>
                <SliderRow setting="borderWidth" title="Bordures" unit="px" min={0} max={2} presets={[["Aucune", 0], ["Fine", 1], ["Épaisse", 2]]} />
            </div>
            <div className={cl("card", "list")}>
                <ChoiceRow
                    setting="panelShadow"
                    title="Ombre"
                    description="Sous les panneaux"
                    Icon={PanelsIcon}
                    choices={[["Aucune", "none"], ["Douce", "soft"], ["Marquée", "strong"]]}
                />
                <ToggleRow setting="accentGlow" title="Lueur d'accent" description="Halo autour du chat et du champ de saisie actif" Icon={SparkIcon} />
                <ToggleRow
                    setting="animations"
                    title="Animations"
                    description="Survols et menus en douceur. Coupées, le tiroir s'ouvre aussi sans animation."
                    Icon={SparkIcon}
                />
            </div>
        </section>
    );
}
