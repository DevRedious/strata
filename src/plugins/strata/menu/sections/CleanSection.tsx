/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { cl, Heading, ToggleRow } from "@plugins/strata/menu/controls";
import { ChatIcon, EyeOffIcon, UserIcon } from "@plugins/strata/menu/icons";
import type { SettingKey } from "@plugins/strata/menu/state";
import type { ComponentType } from "react";

const GROUPS: { title: string; Icon: ComponentType; items: [setting: SettingKey, title: string, description: string][]; }[] = [
    {
        title: "Messages privés",
        Icon: UserIcon,
        items: [
            ["hideNitro", "Nitro", "Lien en haut de la liste des messages privés"],
            ["hideShop", "Boutique", "Lien en haut de la liste des messages privés"],
            ["hideQuests", "Quêtes", "Lien en haut de la liste des messages privés"],
        ],
    },
    {
        title: "Barre de saisie",
        Icon: ChatIcon,
        items: [
            ["hideGift", "Cadeau", "Offrir Nitro"],
            ["hideGif", "GIF", "Sélecteur de GIF"],
            ["hideStickers", "Autocollants", "Sélecteur d'autocollants"],
            ["hideApps", "Applications", "Lanceur d'applications et d'activités"],
        ],
    },
    {
        title: "Ailleurs",
        Icon: EyeOffIcon,
        items: [
            ["hideActiveNow", "« En ligne maintenant »", "Colonne d'activité de la page Amis"],
            ["hideClanTags", "Tags de serveur", "Étiquettes à côté des pseudos"],
            ["hideHelp", "Aide", "Bouton d'aide de la barre de titre"],
            ["hideGuildActions", "Ajouter et Découvrir", "Boutons en bas de la barre des serveurs"],
        ],
    },
];

export function CleanSection() {
    return (
        <>
            <section className={cl("block")}>
                <Heading title="Mode épuré" hint="Masque des éléments de Discord dont tu ne te sers pas. Rien n'est supprimé : il suffit de rallumer." Icon={EyeOffIcon} />
            </section>
            {GROUPS.map(({ title, Icon, items }) => (
                <section key={title} className={cl("block")}>
                    <h3 className={cl("subheading")}>{title}</h3>
                    <div className={cl("card", "list")}>
                        {items.map(([setting, itemTitle, description]) => (
                            <ToggleRow key={setting} setting={setting} title={itemTitle} description={description} Icon={Icon} />
                        ))}
                    </div>
                </section>
            ))}
        </>
    );
}
