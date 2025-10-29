import {Page, BrowserContext} from "@playwright/test";
import {Tokens} from "../types";


export default (tabsMap: Map<string, Page>) => {
    let connected = false;
    const userTokensData: Partial<Record<Tokens, number>> = {};

    const connectWallet = async (page: Page) => {
        try {
            console.debug("Connecting wallet");
            await page.getByRole('button').getByText('Connect').click()
            connected = true;
        } catch (e) {
            console.error(e)
            connected = false;
        }

    }

    const approveOrConfirmTransaction = async (page: Page) => {
        try {
            console.debug('Approve or confirm')
            const confirmButton = page.getByRole('button').getByText('Approve') || page.getByRole('button').getByText('Confirm')

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
        connected,
        userTokensData,
        connectWallet,
        approveOrConfirmTransaction,
        getUserTokensData,
    }
}