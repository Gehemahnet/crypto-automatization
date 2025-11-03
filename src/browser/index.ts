import {generateFingerprint, modifyLaunchOptionsWithProxy} from "../profile";
import path from "path";
import {EXTENSION_DIR, GLOBAL_CONFIG, USER_DATA_DIR} from "../constants";
import fs from "fs";
import {chromium} from "playwright";
import {applyHardwareFingerprint} from "../utils";
import {BrowsersMap,LaunchOptions, LaunchProfileReturn, ProfileConfig, TabsMap} from "../types";

export const launchProfile = async ({profile, browsers}: {
    profile: ProfileConfig,
    browsers: BrowsersMap
}): Promise<LaunchProfileReturn> => {
    const tabsMap: TabsMap = new Map();
    const fingerprint = profile.fingerprint || generateFingerprint(profile.proxy);
    const userDataDir = path.join(USER_DATA_DIR, profile.profileName);

    if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, {recursive: true});
    }

    let launchOptions: LaunchOptions = {
        headless: GLOBAL_CONFIG.headless ?? false,
        viewport: fingerprint.viewport,
        userAgent: fingerprint.userAgent,
        locale: 'en-US',
        timezoneId: fingerprint.timezone,
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            `--disable-extensions-except=${path.resolve(EXTENSION_DIR)}`,
            `--load-extension=${path.resolve(EXTENSION_DIR)}`
        ]
    };

    modifyLaunchOptionsWithProxy({profile, launchOptions})

    const browserContext = await chromium.launchPersistentContext(userDataDir, launchOptions);

    const page = browserContext.pages()[0]

    tabsMap.set('mainPage', page);
    await applyHardwareFingerprint(page, fingerprint);

    browsers.set(profile.profileName, browserContext);

    return {browserContext, page, tabsMap};
};
