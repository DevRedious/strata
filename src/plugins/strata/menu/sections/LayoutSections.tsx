/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { tr } from "@plugins/strata/i18n";
import { cl, Heading, SliderRow, ToggleRow } from "@plugins/strata/menu/controls";
import { DrawerIcon, LayoutIcon } from "@plugins/strata/menu/icons";
import { LayoutPreview } from "@plugins/strata/menu/LayoutPreview";
import { getValue } from "@plugins/strata/menu/state";

// Bornes identiques aux marqueurs de settings.ts (vérifiées à l'import)
export function LayoutSection() {
    return (
        <section className={cl("block")}>
            <Heading title={tr("Disposition", "Layout")} hint={tr("Taille des espaces entre les panneaux et arrondi de leurs coins.", "Size of the gaps between panels and roundness of their corners.")} Icon={LayoutIcon} />
            <LayoutPreview />
            <div className={cl("card")}>
                <SliderRow
                    setting="gap"
                    title={tr("Espacement", "Spacing")}
                    unit="px"
                    min={0}
                    max={16}
                    presets={[["Compact", 4], ["Normal", 8], [tr("Aéré", "Airy"), 14]]}
                />
                <SliderRow
                    setting="radius"
                    title={tr("Arrondis", "Corners")}
                    unit="px"
                    min={0}
                    max={24}
                    presets={[[tr("Net", "Sharp"), 4], [tr("Doux", "Soft"), 14], [tr("Rond", "Round"), 22]]}
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
                title={tr("Tiroir des salons", "Channel drawer")}
                hint={tr("Repliée, la liste des salons laisse la place au chat ; elle s'ouvre au survol de la barre des serveurs.", "Folded away, the channel list leaves room for the chat; it opens when you hover the server bar.")}
                Icon={DrawerIcon}
            />
            <LayoutPreview drawerMode />
            <div className={cl("card", "list")}>
                <ToggleRow setting="drawer" title={tr("Activer le tiroir", "Turn on the drawer")} description={tr("Sinon, la liste des salons reste toujours ouverte", "Otherwise, the channel list always stays open")} Icon={DrawerIcon} />
            </div>
            <div className={cl("card")}>
                <SliderRow
                    setting="drawerOpenDelay"
                    title={tr("Délai d'ouverture", "Opening delay")}
                    unit="ms"
                    min={0}
                    max={500}
                    presets={[[tr("Rapide", "Fast"), 0], ["Normal", 120], [tr("Lent", "Slow"), 300]]}
                    disabled={!enabled}
                />
                <SliderRow
                    setting="drawerCloseDelay"
                    title={tr("Délai de fermeture", "Closing delay")}
                    unit="ms"
                    min={0}
                    max={500}
                    presets={[[tr("Rapide", "Fast"), 100], ["Normal", 250], [tr("Lent", "Slow"), 500]]}
                    disabled={!enabled}
                />
            </div>
        </section>
    );
}
