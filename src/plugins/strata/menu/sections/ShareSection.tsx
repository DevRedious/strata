/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button } from "@components/Button";
import { tr } from "@plugins/strata/i18n";
import { cl, Heading } from "@plugins/strata/menu/controls";
import { CopyIcon, ImportIcon, ShareIcon } from "@plugins/strata/menu/icons";
import { exportSettings, importSettings } from "@plugins/strata/menu/transfer";
import { copyToClipboard } from "@utils/clipboard";
import { showToast, useState } from "@webpack/common";

export function ShareSection() {
    const [text, setText] = useState("");

    async function copy() {
        await copyToClipboard(exportSettings());
        showToast({ text: tr("Réglages Strata copiés", "Strata settings copied"), variant: "success" });
    }

    function apply() {
        const result = importSettings(text);
        if (!result.ok) {
            showToast({ text: result.error, variant: "critical" });
            return;
        }
        setText("");
        showToast({ text: tr(`${result.count} réglages importés`, `${result.count} settings imported`), variant: "success" });
    }

    return (
        <>
            <section className={cl("block")}>
                <Heading title={tr("Exporter", "Export")} hint={tr("Copie tous tes réglages Strata sous forme de texte, à envoyer à un collègue.", "Copies all your Strata settings as text, to send to a colleague.")} Icon={ShareIcon} />
                <div>
                    <Button variant="primary" size="small" className={cl("action")} onClick={copy}>
                        <CopyIcon />{tr("Copier mes réglages", "Copy my settings")}
                    </Button>
                </div>
            </section>

            <section className={cl("block")}>
                <Heading title={tr("Importer", "Import")} hint={tr("Colle le texte reçu. Les réglages sont vérifiés avant d'être appliqués.", "Paste the text you received. Settings are checked before being applied.")} Icon={ImportIcon} />
                <textarea
                    className={cl("import")}
                    placeholder='{"strata":1,"settings":{…}}'
                    spellCheck={false}
                    value={text}
                    onChange={e => setText(e.currentTarget.value)}
                />
                <div>
                    <Button variant="secondary" size="small" className={cl("action")} disabled={!text.trim()} onClick={apply}>
                        <ImportIcon />{tr("Appliquer", "Apply")}
                    </Button>
                </div>
            </section>
        </>
    );
}
