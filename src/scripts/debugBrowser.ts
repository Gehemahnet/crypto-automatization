import {chromium} from "@playwright/test";
import config from "../config";
import path from "path";
import {EXTENSION_DIR, USER_DATA_DIR} from "../constants";


await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    slowMo: config.slowMo,
    args: [
        `--load-extension=${path.resolve(EXTENSION_DIR)}`,
        `--disable-extensions-except=${path.resolve(EXTENSION_DIR)}`,
        '--no-sandbox',
        '--disable-dev-shm-usage',
    ],
});
