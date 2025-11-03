import useSolflareActions from '../hooks/useSolflareActions';
import { useTokenPair } from '../hooks/useTokenPair';
import {RunContext, Tokens} from '../types';
import config from '../config';
import {Page} from "@playwright/test";
import {GLOBAL_CONFIG} from "../constants";

export const rangerFinanceRunner = async (context: RunContext): Promise<void> => {
    const { browserContext, tabsMap, profile } = context;

    console.log(`🚀 Starting Ranger Protocol for ${profile.profileName}`);
    console.log(`📊 tabsMap available: ${tabsMap ? 'YES' : 'NO'}`);

    if (tabsMap) {
        console.log(`✅ Using pre-configured wallet context`);
        const solflarePage = tabsMap.get('solflare');
        if (solflarePage) {
            console.log(`🔗 Solflare extension ready: ${solflarePage.url()}`);
        }
    }

    let { tokenPair, counter, pairEstablished } = useTokenPair();
    let waitingForConfirmation = false;

    // Используем tabsMap из контекста
    const { handleWalletDialog } = useSolflareActions();
    const page = await browserContext.newPage()
    await page.goto('https://www.app.ranger.finance/spot');
    await page.waitForTimeout(3000);

    browserContext.on('page', async (dialogPage: Page) => {
        waitingForConfirmation = true;
        await handleWalletDialog(dialogPage);
        waitingForConfirmation = false;
    });

    const connectWalletByXpathButton = page.locator('//html/body/div[2]/header/div[2]/div[1]/*[last()]');
    const connectWalletButtonText = await connectWalletByXpathButton.innerText({ timeout: 1000 });

    if (connectWalletButtonText.toLowerCase() === 'connect wallet') {
        console.debug("Start connecting");
        const popup = page.locator('#headlessui-portal-root');
        const continueWithWalletButton = popup.getByRole('button').getByText('Continue with a wallet');
        await continueWithWalletButton.click();

        const searchWalletInput = popup.locator('input[placeholder="Search wallets"]');
        await searchWalletInput.fill('Solflare');

        const solflareWalletButton = popup.locator('button').getByText('Solflare');
        await solflareWalletButton.click();

        await waitForConfirmation(page);
        const acceptTerms = popup.locator('button').getByText('Accept');
        await acceptTerms.click();
    }

    console.debug("Start setting pair");

    const firstTokenButton = page.locator('button#spot-market-sell-token--button');
    const secondTokenButton = page.locator('button#spot-market-buy-token--button');
    const maxAmountButton = page.locator('button').getByText('Max');
    const swapConfirmButton = page.locator('button').getByText('Initiate');
    const swapPairButton = page.locator('//html/body/div[2]/main/div/div/div[3]/section/div[3]/div/div/form/div[2]/button');

    tokenPair.first = await firstTokenButton.textContent() ?? '';
    tokenPair.second = await secondTokenButton.textContent() ?? '';

    await makeSwap();

    async function setTokenPair(first: string, second: string) {
        await firstTokenButton.click();
        const firstTokenSearchLocator = page.locator('#spot-market-sell-token--input');
        await firstTokenSearchLocator.fill(first);
        await page.waitForTimeout(1500);

        const elementSellToken = await page.locator('ul#spot-market-sell-token--listbox li')
            .filter({ hasText: first }).first().elementHandle();
        elementSellToken?.evaluate((element: HTMLElement) => {element.click()}, elementSellToken);

        tokenPair.first = await firstTokenButton.textContent() ?? '';

        await secondTokenButton.click();
        const secondTokenSearchLocator = page.locator('#spot-market-buy-token--input');
        await secondTokenSearchLocator.fill(second);
        await page.waitForTimeout(1500);

        const elementBuyToken = await page.locator('ul#spot-market-buy-token--listbox li')
            .filter({ hasText: second }).first().elementHandle();
        elementBuyToken?.evaluate((element:HTMLElement) => {element.click()}, elementBuyToken);

        tokenPair.second = await secondTokenButton.textContent() ?? '';
    }

    async function makeSwap() {
        try {
            if (!pairEstablished) {
                if (
                    (tokenPair.first === Tokens.SOL && tokenPair.second === Tokens.USDT) ||
                    (tokenPair.first === Tokens.USDT && tokenPair.second === Tokens.SOL)
                ) {
                    console.debug('Ставим USDC -> USDT');
                    await setTokenPair(Tokens.USDC, Tokens.USDT);
                } else if (
                    (tokenPair.first === Tokens.SOL && tokenPair.second === Tokens.USDC) ||
                    (tokenPair.first === Tokens.USDC && tokenPair.second === Tokens.SOL)
                ) {
                    console.debug('Ставим USDT -> USDC');
                    await setTokenPair(Tokens.USDT, Tokens.USDC);
                } else if (
                    (tokenPair.first === Tokens.USDC && tokenPair.second === Tokens.USDT) ||
                    (tokenPair.first === Tokens.USDT && tokenPair.second === Tokens.USDC)
                ) {
                    console.debug('Все ок. Замена не нужна');
                } else {
                    throw Error('Наебнулась установка пары');
                }
            }

            pairEstablished = true;
            console.debug(`${counter} итерация`);

            const tokensToTrade = page.locator('#spot-selling-label .transition-all');
            const tokensToTradeText = await tokensToTrade.textContent();

            await page.waitForTimeout(2000);

            if (Number(tokensToTradeText) === 0 && await swapConfirmButton.isDisabled()) {
                console.debug('Нет токенов на продажу. Переворачиваем пару');
                await swapPairButton.click();
                await maxAmountButton.click();
            } else {
                console.debug('Идем к свапу');
                await maxAmountButton.click();
                await swapConfirmButton.click({ timeout: counter === 1 ? 2000 : 0 });

                console.debug('Ожидание подтверждения транзакции...');
                await waitForConfirmation(page);
                counter++;
                await swapPairButton.click();
                console.debug('Подтверждение получено, продолжаем...');
            }

            if (counter < GLOBAL_CONFIG.numberOfTrades) {
                await makeSwap();
            } else {
                console.debug(`Выполнено ${counter}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function waitForConfirmation(page: any) {
        console.debug('Ждем подтверждения');
        while (!waitingForConfirmation) {
            await page.waitForTimeout(100);
        }

        while (waitingForConfirmation) {
            await page.waitForTimeout(100);
        }

        await page.waitForTimeout(2000);
    }
};