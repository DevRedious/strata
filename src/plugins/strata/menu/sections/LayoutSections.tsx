/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { cl, Heading, SliderRow, ToggleRow } from "@plugins/strata/menu/controls";
import { DrawerIcon, LayoutIcon } from "@plugins/strata/menu/icons";
import { LayoutPreview } from "@plugins/strata/menu/LayoutPreview";
import { getValue } from "@plugins/strata/menu/state";

// Bornes identiques aux marqueurs de settings.ts (vérifiées à l'import)
export function LayoutSection() {
    return (
        <section className={cl("block")}>
            <Heading title="Disposition" hint="Taille des espaces entre les panneaux et arrondi de leurs coins." Icon={LayoutIcon} />
            <LayoutPreview />
            <div className={cl("card")}>
                <SliderRow
                    setting="gap"
                    title="Espacement"
                    unit="px"
                    min={0}
                    max={16}
                    presets={[["Compact", 4], ["Normal", 8], ["Aéré", 14]]}
                />
                <SliderRow
                    setting="radius"
                    title="Arrondis"
                    unit="px"
                    min={0}
                    max={24}
                    presets={[["Net", 4], ["Doux", 14], ["Rond", 22]]}
                />
            </div>
        </section>
    );
}

export function DrawerSection() {
    const enabled = getValue<boolean>("drawer");
    return (
        <section className={cl("block")}>
            <Heading
                title="Tiroir des salons"
                hint="Repliée, la liste des salons laisse la place au chat ; elle s'ouvre au survol de la barre des serveurs."
                Icon={DrawerIcon}
            />
            <LayoutPreview drawerMode />
            <div className={cl("card", "list")}>
                <ToggleRow setting="drawer" title="Activer le tiroir" description="Sinon, la liste des salons reste toujours ouverte" Icon={DrawerIcon} />
            </div>
            <div className={cl("card")}>
                <SliderRow
                    setting="drawerOpenDelay"
                    title="Délai d'ouverture"
                    unit="ms"
                    min={0}
                    max={500}
                    presets={[["Rapide", 0], ["Normal", 120], ["Lent", 300]]}
                    disabled={!enabled}
                />
                <SliderRow
                    setting="drawerCloseDelay"
                    title="Délai de fermeture"
                    unit="ms"
                    min={0}
                    max={500}
                    presets={[["Rapide", 100], ["Normal", 250], ["Lent", 500]]}
                    disabled={!enabled}
                />
            </div>
        </section>
    );
}
