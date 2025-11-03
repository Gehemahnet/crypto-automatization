import fs from "fs";
import {SolflareParams} from "../types";
import {EXTENSION_DIR, GLOBAL_CONFIG, SOLFLARE_EXTENSION_URL, USER_DATA_DIR} from "../constants";
import path from "path";

export const setupSolflare = async ({profile, tabsMap, browserContext}: SolflareParams): Promise<void> => {
    console.log(`👛 Setting up Solflare wallet for ${profile.profileName}...`);

    if (!fs.existsSync(EXTENSION_DIR) || !fs.existsSync(path.join(EXTENSION_DIR, 'manifest.json'))) {
        throw new Error(
            `Папка ${EXTENSION_DIR} не найдена или не содержит manifest.json. ` +
            `Скачайте и распакуйте расширение Solflare вручную в ${EXTENSION_DIR}.`
        );
    }

    const userDataDir = path.join(USER_DATA_DIR, profile.profileName);
    if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, {recursive: true});
    }

    console.log(`📁 Profile directory: ${userDataDir}`);
    console.log(`🔧 Launching browser with Solflare extension...`);


    await new Promise(resolve => setTimeout(resolve, 3000));

    const pages = browserContext.pages();
    let extensionPage = pages.find(page =>
        page.url().startsWith('chrome-extension://') && page.url().includes('/wallet.html')
    );


    if (!extensionPage) {
        extensionPage = await browserContext.newPage();
        await extensionPage.goto(SOLFLARE_EXTENSION_URL);
    }

    await extensionPage.goForward();

    await extensionPage.waitForTimeout(2000);
    const currentUrl = extensionPage.url();


    if (currentUrl.includes('#/onboard')) {
        console.log(`📝 Setting up new wallet...`);

        await extensionPage.getByText('I already have a wallet').click();
        await extensionPage.waitForTimeout(1000);

        const seedPhrase = profile.seedPhrase.split(' ');

        for (let i = 0; i < seedPhrase.length; i++) {
            const input = extensionPage.getByTestId(`input-recovery-phrase-${i + 1}`);
            await input.fill(seedPhrase[i]);
            await extensionPage.waitForTimeout(200);
        }

        await extensionPage.getByTestId('btn-continue').click();
        await extensionPage.waitForTimeout(1000);

        await extensionPage.getByTestId('input-new-password').fill(GLOBAL_CONFIG.walletPassword);
        await extensionPage.getByTestId('input-repeat-password').fill(GLOBAL_CONFIG.walletPassword);
        await extensionPage.getByTestId('btn-continue').click();

        await extensionPage.waitForLoadState('networkidle');
        await extensionPage.waitForTimeout(2000);

        await extensionPage.getByTestId('btn-quick-setup').click();
        await extensionPage.waitForTimeout(1000);
        await extensionPage.getByTestId('btn-explore').click();

    } else if (currentUrl.includes('#/portfolio')) {

        const unlockButton = extensionPage.locator('button').getByText('Unlock');
        if (await unlockButton.isVisible()) {
            await extensionPage.getByTestId('input-password').fill(GLOBAL_CONFIG.walletPassword);
            await unlockButton.click();
            await extensionPage.waitForTimeout(2000);
        } else {
            console.log(`✅ Wallet already unlocked`);
        }
    } else {
        throw Error(`Неизвестное состояние расширения Solflare: ${currentUrl}`);
    }

    tabsMap.set('solflare', extensionPage);

    console.log(`✅ Solflare setup completed for ${profile.profileName}`);
    console.log('═'.repeat(50));

};