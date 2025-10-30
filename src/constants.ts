export enum TARGETS {
    HYPERSWAP = 'HYPERSWAP',
    TITAN_DEX = 'TITAN_DEX',
}

export const TARGET_MAP = {
    [TARGETS.HYPERSWAP]: 'https://app.hyperswap.exchange/',
    [TARGETS.TITAN_DEX]: 'https://app.titan.exchange/swap'
}

export const SOLFLARE_EXTENSION_URL = 'chrome-extension://bhhhlbepdkbapadjdnnojkbgioiodbic/wallet.html#';

export const EXTENSION_DIR = './solflare_extension';
export const USER_DATA_DIR = './browser_profile';