import initSolflare from "../solflare";
import {connectWallet} from "../solflare/connectWallet";


const context = await initSolflare()

const page = await context.newPage()
await page.goto('https://titan.exchange/swap')
const connectButton = page.locator('main').getByText('Connect wallet')
if (connectButton) {
    await connectButton.click()
    const popup = page.locator('#headlessui-portal-root')
    await popup.getByText('Solflare').click()

    context.on('page', async (page) => {
        await connectWallet(page)
    })
}