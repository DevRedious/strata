/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { tr } from "@plugins/strata/i18n";
import { cl, Heading, ToggleRow } from "@plugins/strata/menu/controls";
import { ChatIcon, EyeOffIcon, UserIcon } from "@plugins/strata/menu/icons";
import type { SettingKey } from "@plugins/strata/menu/state";
import type { ComponentType } from "react";

const groups = (): { title: string; Icon: ComponentType; items: [setting: SettingKey, title: string, description: string][]; }[] => [
    {
        title: tr("Messages privés", "Direct messages"),
        Icon: UserIcon,
        items: [
            ["hideNitro", "Nitro", tr("Lien en haut de la liste des messages privés", "Link at the top of the direct messages list")],
            ["hideShop", tr("Boutique", "Shop"), tr("Lien en haut de la liste des messages privés", "Link at the top of the direct messages list")],
            ["hideQuests", tr("Quêtes", "Quests"), tr("Lien en haut de la liste des messages privés", "Link at the top of the direct messages list")],
        ],
    },
    {
        title: tr("Barre de saisie", "Chat bar"),
        Icon: ChatIcon,
        items: [
            ["hideGift", tr("Cadeau", "Gift"), tr("Offrir Nitro", "Gift Nitro")],
            ["hideGif", "GIF", tr("Sélecteur de GIF", "GIF picker")],
            ["hideStickers", tr("Autocollants", "Stickers"), tr("Sélecteur d'autocollants", "Sticker picker")],
            ["hideApps", tr("Applications", "Apps"), tr("Lanceur d'applications et d'activités", "App and activity launcher")],
        ],
    },
    {
        title: tr("Ailleurs", "Elsewhere"),
        Icon: EyeOffIcon,
        items: [
            ["hideActiveNow", tr("« En ligne maintenant »", "“Active Now”"), tr("Colonne d'activité de la page Amis", "Activity column of the Friends page")],
            ["hideClanTags", tr("Tags de serveur", "Server tags"), tr("Étiquettes à côté des pseudos", "Labels next to usernames")],
            ["hideHelp", tr("Aide", "Help"), tr("Bouton d'aide de la barre de titre", "Help button in the title bar")],
            ["hideGuildActions", tr("Ajouter et Découvrir", "Add and Discover"), tr("Boutons en bas de la barre des serveurs", "Buttons at the bottom of the server bar")],
        ],
    },
];

export function CleanSection() {
    return (
        <>
            <section className={cl("block")}>
                <Heading
                    title={tr("Mode épuré", "Clean mode")}
                    hint={tr("Masque des éléments de Discord dont tu ne te sers pas. Rien n'est supprimé : il suffit de rallumer.", "Hides Discord elements you don't use. Nothing is deleted: just turn them back on.")}
                    Icon={EyeOffIcon}
                />
            </section>
            {groups().map(({ title, Icon, items }) => (
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
