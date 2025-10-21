// Import necessary Synpress modules
import { defineWalletSetup } from '@synthetixio/synpress'
import { MetaMask } from '@synthetixio/synpress/playwright'
import type {BrowserContext, Page} from "playwright-core";





// Define the basic wallet setup
const initMetamaskSetup = (pass: string, seed: string) => defineWalletSetup(
    pass,
    async (context: BrowserContext, walletPage: Page) => {
    // Create a new MetaMask instance
    const metamask = new MetaMask(context, walletPage, pass)

    // Import the wallet using the seed phrase
    await metamask.importWallet(seed)

    // Additional setup steps can be added here, such as:
    // - Adding custom networks
    // - Importing tokens
    // - Setting up specific account states
})

export default initMetamaskSetup;