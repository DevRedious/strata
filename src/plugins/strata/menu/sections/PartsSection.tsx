/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { tr } from "@plugins/strata/i18n";
import { ChoiceRow, cl, Heading, ToggleRow } from "@plugins/strata/menu/controls";
import { ButtonIcon, ChatIcon, DotsIcon, DrawerIcon, PanelsIcon, PartsIcon, SettingsIcon, UserIcon, VoiceIcon } from "@plugins/strata/menu/icons";

export function PartsSection() {
    return (
        <>
            <section className={cl("block")}>
                <Heading title={tr("Parties du thème", "Theme parts")} hint={tr("Chaque partie s'active séparément, sans redémarrer Discord.", "Each part turns on separately, without restarting Discord.")} Icon={PartsIcon} />
                <div className={cl("card", "list")}>
                    <ToggleRow setting="panels" title={tr("Panneaux flottants", "Floating panels")} description={tr("Salons, en-tête, chat et membres en cartes séparées", "Channels, header, chat and members as separate cards")} Icon={PanelsIcon} />
                    <ToggleRow setting="chat" title="Chat" description={tr("Messages et barre de saisie", "Messages and chat bar")} Icon={ChatIcon} />
                    <ToggleRow setting="drawer" title={tr("Tiroir des salons", "Channel drawer")} description={tr("Liste repliée, ouverte au survol des serveurs", "Folded list, opened when hovering the servers")} Icon={DrawerIcon} />
                    <ToggleRow setting="discordSettings" title={tr("Paramètres de Discord", "Discord settings")} description={tr("Onglet sélectionné à la couleur d'accent", "Selected tab in the accent colour")} Icon={SettingsIcon} />
                    <ToggleRow setting="voice" title={tr("Vocal", "Voice")} description={tr("Zone d'appel en carte, aux couleurs du thème", "Call area as a card, in the theme colours")} Icon={VoiceIcon} />
                    <ToggleRow setting="userPanel" title={tr("Panneau utilisateur", "User panel")} description={tr("Survol à l'accent, nom lisible sur une nameplate", "Accent hover, readable name over a nameplate")} Icon={UserIcon} />
                    <ChoiceRow
                        setting="windowButtons"
                        title={tr("Boutons de fenêtre", "Window buttons")}
                        description={tr("Réduire, agrandir et fermer", "Minimise, maximise and close")}
                        Icon={DotsIcon}
                        choices={[["Strata", "strata"], [tr("Pilule", "Pill"), "pill"], ["macOS", "mac"], ["Discord", "discord"]]}
                    />
                </div>
            </section>

            <section className={cl("block")}>
                <Heading title="Strata" Icon={ButtonIcon} />
                <div className={cl("card", "list")}>
                    <ToggleRow
                        setting="titlebarButton"
                        title={tr("Bouton dans la barre de titre", "Title bar button")}
                        description={tr("Masqué, ces réglages restent dans Paramètres → Vencord → Plugins → Strata", "When hidden, these settings stay in Settings → Vencord → Plugins → Strata")}
                        Icon={ButtonIcon}
                    />
                </div>
            </section>
        </>
    );
}
