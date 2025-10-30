import {Page, BrowserContext} from "@playwright/test";
import {Tokens} from "../types";


export default (tabsMap: Map<string, Page>) => {
    let waitingForConfirmation = false;
    const userTokensData: Partial<Record<Tokens, number>> = {};

    const handleWalletDialog = async (page: Page) => {
        try {
            console.debug('Approve or confirm')
            const confirmButton = page.locator('button').filter({ hasText: new RegExp('Approve|Confirm|Connect') })
            if (confirmButton) {
                await confirmButton.click();
            }

        } catch (e) {
            console.error(e)
        }
    }
    //TODO 
    const getUserTokensData = async (
        currentPage: Page,
        context: BrowserContext
    ) => {
        const solflarePage = tabsMap.get('solflare');
        const tokensTable = solflarePage?.getByTestId('virtuoso-item-list')

    }


    return {
        userTokensData,
        waitingForConfirmation,
        handleWalletDialog,
        getUserTokensData,
    }
}