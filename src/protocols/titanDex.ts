import initSolflare from "../solflare";
import useSolflareActions from "../hooks/useSolflareActions";
import config from "../config";
import {useTokenPair} from "../hooks/useTokenPair";
import {Tokens} from "../types";


const {context, tabsMap} = await initSolflare({slowMo: 2000})

const page = await context.newPage()
await page.goto('https://titan.exchange/swap')
await page.waitForTimeout(3000)
let {tokenPair, counter} = useTokenPair()

let {
    handleWalletDialog,
    waitingForConfirmation
} = useSolflareActions(tabsMap);

console.debug('Start connection check')

const connectButton = page.locator('//html/body/div[2]/header/div[2]/*[last()]')
const connectButtonText = await connectButton.textContent()

if (connectButtonText?.toLowerCase() === 'connect wallet') {
    try {
        console.debug('Connect start')
        context.once('page', async (page) => {
            waitingForConfirmation = true;
            await handleWalletDialog(page)
            waitingForConfirmation = false;
        });
        await connectButton.click()
        const popup = page.locator('#headlessui-portal-root')
        await popup.getByText('Solflare').click()
        await waitForConfirmation()
    } catch (error) {
        console.debug('Connected already. Continue')
    } finally {
        console.debug('Connect end')
    }
}

context.on('page', async (page) => {
    waitingForConfirmation = true;
    console.debug('Начало подтверждения транзакции...');
    await handleWalletDialog(page)
    counter++
    waitingForConfirmation = false;
    console.debug('Подтверждение транзакции завершено');
})

console.debug('Устанавливаем пару токенов')

let pairEstablished = false;
// Хуйня полная, нужен нормальный локатор
const firstTokenButton = page.locator('//html/body/div[2]/main/div/div/section/div[3]/div[2]/div[1]/div[1]/div[1]/div[1]/div/button')
const secondTokenButton = page.locator('//html/body/div[2]/main/div/div/section/div[3]/div[2]/div[1]/div[1]/div[3]/div[1]/div/button')
tokenPair.first = await firstTokenButton.textContent() ?? ''
tokenPair.second = await secondTokenButton.textContent() ?? ''

const firstTokenMaxAmountButton = page.locator('//html/body/div[2]/main/div/div/section/div[3]/div[2]/div[1]/div[1]/div[1]/div[2]/div[2]/div[2]/button')
const swapPairButton = page.locator('//html/body/div[2]/main/div/div/section/div[3]/div[2]/div[1]/div[1]/div[2]/button')
const swapConfirmButton = page.locator('//html/body/div[2]/main/div/div/section/div[3]/div[2]/div[1]/button')


await makeSwap()


async function setTokenPair(first: string, second: string) {
    const waitingRequest = page.waitForRequest('https://titan.exchange/api/tokens/search')
    await firstTokenButton.click()
    const tokenSearchLocator = page.locator('#token-search')
    await tokenSearchLocator.fill(first)

    await waitingRequest
    await page.locator('//html/body/div[5]/div[2]/ul/li[1]').click()
    tokenPair.first = await firstTokenButton.textContent() ?? ''

    await secondTokenButton.click()
    await tokenSearchLocator.fill(second)
    await waitingRequest
    await page.locator('//html/body/div[5]/div[2]/ul/li[1]').click()
    tokenPair.second = await secondTokenButton.textContent() ?? ''
}

async function makeSwap() {
    try {
        if (!pairEstablished) {
            if (
                (tokenPair.first === Tokens.SOL && tokenPair.second === Tokens.USDT) ||
                (tokenPair.first !== Tokens.USDT && tokenPair.second !== Tokens.SOL)
            ) {
                console.debug('Ставим USDC -> USDT')
                await setTokenPair(Tokens.USDC, Tokens.USDT)
            } else if (
                (tokenPair.first === Tokens.SOL && tokenPair.second === Tokens.USDC) ||
                (tokenPair.first === Tokens.USDC && tokenPair.second === Tokens.SOL)
            ) {
                console.debug('Ставим USDT -> USDC')
                await setTokenPair(Tokens.USDT, Tokens.USDC)
            } else {
                throw Error('Наебнулась установка пары')
            }
        }

        pairEstablished = true;
        console.debug('Пара установлена?', pairEstablished, `Пара ${tokenPair.first} -> ${tokenPair.second}`);
        console.debug(`${counter} итерация`)

        //Ререндер идет не сразу
        const confirmButtonText = await swapConfirmButton.textContent({timeout:1500})

        const tokensToTrade = page
            .locator('//html/body/div[2]/main/div/div/section/div[3]/div[2]/div[1]/div[1]/div[1]/div[2]/div[2]/div[1]/span[2]')
        const tokensToTradeText = await tokensToTrade.textContent()

        console.debug(confirmButtonText, tokensToTradeText)

        if (confirmButtonText === 'Insufficient Balance' || Number(tokensToTradeText) === 0) {
            console.debug('Нет токенов на продажу. Переворачиваем пару')
            await swapPairButton.click()
        } else {
            console.debug('Идем к свапу')
            await firstTokenMaxAmountButton.click()
            await swapConfirmButton.click({timeout: counter === 1 ? 2000 : 0})

            console.debug('Ожидание подтверждения транзакции...');
            await waitForConfirmation();
            console.debug('Подтверждение получено, продолжаем...');
        }

        if (counter < config.numberOfTrades) {
            await makeSwap()
        } else {
            console.debug(`Выполнено ${counter}`)
        }
    } catch (error) {
        console.error(error)
        if (counter < config.numberOfTrades && page) {
            await makeSwap()
        } else {
            console.debug(`Выполнено ${counter}`)
        }
    } finally {
        await page.close()
        await context.close()
    }

}

async function waitForConfirmation() {
    console.debug('Wait for Confirmation')
    while (!waitingForConfirmation) {
        await page.waitForTimeout(100);
    }

    // Ждем пока подтверждение завершится
    while (waitingForConfirmation) {
        await page.waitForTimeout(100);
    }

    // Дополнительная пауза 1-2 секунды
    await page.waitForTimeout(2000);
}