/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { cl, Heading, ToggleRow } from "@plugins/strata/menu/controls";
import { ButtonIcon, ChatIcon, DotsIcon, DrawerIcon, PanelsIcon, PartsIcon, SettingsIcon, UserIcon, VoiceIcon } from "@plugins/strata/menu/icons";

export function PartsSection() {
    return (
        <>
            <section className={cl("block")}>
                <Heading title="Parties du thème" hint="Chaque partie s'active séparément, sans redémarrer Discord." Icon={PartsIcon} />
                <div className={cl("card", "list")}>
                    <ToggleRow setting="panels" title="Panneaux flottants" description="Salons, en-tête, chat et membres en cartes séparées" Icon={PanelsIcon} />
                    <ToggleRow setting="chat" title="Chat" description="Messages et barre de saisie" Icon={ChatIcon} />
                    <ToggleRow setting="drawer" title="Tiroir des salons" description="Liste repliée, ouverte au survol des serveurs" Icon={DrawerIcon} />
                    <ToggleRow setting="discordSettings" title="Paramètres de Discord" description="Onglet sélectionné à la couleur d'accent" Icon={SettingsIcon} />
                    <ToggleRow setting="voice" title="Vocal" description="Zone d'appel en carte, aux couleurs du thème" Icon={VoiceIcon} />
                    <ToggleRow setting="userPanel" title="Panneau utilisateur" description="Survol à l'accent, nom lisible sur une nameplate" Icon={UserIcon} />
                    <ToggleRow setting="windowDots" title="Pastilles de fenêtre" description="Boutons réduire, agrandir et fermer façon macOS" Icon={DotsIcon} />
                </div>
            </section>

            <section className={cl("block")}>
                <Heading title="Strata" Icon={ButtonIcon} />
                <div className={cl("card", "list")}>
                    <ToggleRow
                        setting="titlebarButton"
                        title="Bouton dans la barre de titre"
                        description="Masqué, ces réglages restent dans Paramètres → Vencord → Plugins → Strata"
                        Icon={ButtonIcon}
                    />
                </div>
            </section>
        </>
    );
}
