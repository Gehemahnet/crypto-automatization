import {Page} from "@playwright/test";
import {Tokens} from "../types";


export default () => {
    let waitingForConfirmation = false;
    const userTokensData: Partial<Record<Tokens, number>> = {};

    const handleWalletDialog = async (page: Page) => {
        try {
            console.debug('Approve or confirm')
            const confirmButton = page.locator('button').filter({hasText: new RegExp('Approve|Confirm|Connect')})
            if (confirmButton) {
                await confirmButton.click();
            }

        } catch (e) {
            console.error(e)
        }
    }


    return {
        userTokensData,
        waitingForConfirmation,
        handleWalletDialog,
    }
}