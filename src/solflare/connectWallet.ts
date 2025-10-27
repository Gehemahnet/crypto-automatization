import {Page} from "@playwright/test";

export const connectWallet = async (page: Page) => {
    await page.getByText('Connect').click()
}