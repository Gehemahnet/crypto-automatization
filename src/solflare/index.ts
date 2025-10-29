import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import {chromium} from "@playwright/test";
import {SOLFLARE_EXTENSION_URL} from "../constants";
import useTabs from "../hooks/useTabs";
import config from "../config";

const EXTENSION_DIR = './solflare_extension';
const USER_DATA_DIR = './browser_profile';

const ADD_EXISTING_WALLET = 'I already have a wallet';


export default async () => {
    if (!fs.existsSync(EXTENSION_DIR) || !fs.existsSync(path.join(EXTENSION_DIR, 'manifest.json'))) {
        throw new Error(
            `Папка ${EXTENSION_DIR} не найдена или не содержит manifest.json. ` +
            `Скачайте и распакуйте расширение Solflare вручную в ${EXTENSION_DIR}.`
        );
    }

    const {tabsMap} = useTabs()

    dotenv.config();
    const seed = process.env.SOLANA_SEED;
    const pass = process.env.SOLANA_PASS;

    if (!seed || !pass) {
        throw new Error('Не хватает данных в .env')
    }

    const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
        headless: false,
        slowMo: config.slowMo,
        args: [
            `--load-extension=${path.resolve(EXTENSION_DIR)}`,
            `--disable-extensions-except=${path.resolve(EXTENSION_DIR)}`,
            '--no-sandbox',
            '--disable-dev-shm-usage',
        ],
    });
    await context.waitForEvent('page')
    const page = context.pages().find(page =>
        page.url().includes(SOLFLARE_EXTENSION_URL)
    )


    if (page) {
        await page?.waitForLoadState('networkidle');
        const currentUrl = page.url()
        if (currentUrl.includes('#/onboard')) {
            await page.getByText(ADD_EXISTING_WALLET).click();
            const seedPhrase = seed.split(' ')

            for (let i = 0; i < seedPhrase.length; i++) {
                await page.getByTestId(`input-recovery-phrase-${i + 1}`).fill(seedPhrase[i]);
            }

            await page.getByTestId('btn-continue').click()
            await page.getByTestId('input-new-password').fill(pass)
            await page.getByTestId('input-repeat-password').fill(pass)

            await page.getByTestId('btn-continue').click()
            await page.waitForLoadState('networkidle');
            await page.getByTestId('btn-quick-setup').click()
            await page.getByTestId('btn-explore').click()

            tabsMap.set('solflare', page)
            return {tabsMap, context}
        }

        if (currentUrl.includes('#/portfolio') && Boolean(page.getByText('Unlock your wallet'))) {
            await page.getByTestId('input-password').fill(pass)
            await page.locator('button').getByText('Unlock').click()
        } else {
            throw Error('Неизвестное состояние')
        }

    } else {
        throw Error('Проблемы со страницей расширения')
    }

    tabsMap.set('solflare', page)
    return {tabsMap, context}
}