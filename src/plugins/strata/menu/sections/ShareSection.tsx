/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 DevRedious
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button } from "@components/Button";
import { cl, Heading } from "@plugins/strata/menu/controls";
import { CopyIcon, ImportIcon, ShareIcon } from "@plugins/strata/menu/icons";
import { exportSettings, importSettings } from "@plugins/strata/menu/transfer";
import { copyToClipboard } from "@utils/clipboard";
import { showToast, useState } from "@webpack/common";

export function ShareSection() {
    const [text, setText] = useState("");

    async function copy() {
        await copyToClipboard(exportSettings());
        showToast({ text: "Réglages Strata copiés", variant: "success" });
    }

    function apply() {
        const result = importSettings(text);
        if (!result.ok) {
            showToast({ text: result.error, variant: "critical" });
            return;
        }
        setText("");
        showToast({ text: `${result.count} réglages importés`, variant: "success" });
    }

    return (
        <>
            <section className={cl("block")}>
                <Heading title="Exporter" hint="Copie tous tes réglages Strata sous forme de texte, à envoyer à un collègue." Icon={ShareIcon} />
                <div>
                    <Button variant="primary" size="small" className={cl("action")} onClick={copy}>
                        <CopyIcon />Copier mes réglages
                    </Button>
                </div>
            </section>

            <section className={cl("block")}>
                <Heading title="Importer" hint="Colle le texte reçu. Les réglages sont vérifiés avant d'être appliqués." Icon={ImportIcon} />
                <textarea
                    className={cl("import")}
                    placeholder='{"strata":1,"settings":{…}}'
                    spellCheck={false}
                    value={text}
                    onChange={e => setText(e.currentTarget.value)}
                />
                <div>
                    <Button variant="secondary" size="small" className={cl("action")} disabled={!text.trim()} onClick={apply}>
                        <ImportIcon />Appliquer
                    </Button>
                </div>
            </section>
        </>
    );
}
