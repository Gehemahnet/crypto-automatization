import {MetaMask} from '@synthetixio/synpress/playwright'
import {createMetamaskTestInstance} from "../src/setup/metamaskTestFactory";

const testInstanceData = createMetamaskTestInstance();

if (testInstanceData) {
    const {test, password} = testInstanceData;
    const {expect} = test;

    test(
        'should connect wallet to the MetaMask Test Dapp', async (
            {
                context,
                page,
                metamaskPage,
                extensionId,
            }) => {

            try {

                // Create a new MetaMask instance
                const metamask = new MetaMask(
                    context,
                    metamaskPage,
                    password,
                    extensionId
                )

                // Navigate to the homepage
                await page.goto('/')

                // Click the connect button
                await page.locator('#connectButton').click()

                // Connect MetaMask to the dapp
                await metamask.connectToDapp()

                // Verify the connected account address
                await expect(page.locator('#accounts')).toHaveText(
                    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
                )

                // Additional test steps can be added here, such as:
                // - Sending transactions
                // - Interacting with smart contracts
                // - Testing dapp-specific functionality
            }
            catch (error) {
                console.error(error)
            }
        })
}
