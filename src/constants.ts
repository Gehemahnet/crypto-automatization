export enum TARGETS {
    HYPERSWAP = 'HYPERSWAP',
    TITAN_DEX = 'TITAN_DEX',
}

export const TARGET_MAP = {
    [TARGETS.HYPERSWAP]: 'https://app.hyperswap.exchange/',
    [TARGETS.TITAN_DEX]: 'https://app.titan.exchange/swap'
}

export const SOLFLARE_EXTENSION_URL = 'chrome-extension://geibgbakpihplbiajenmpagdhigfeemp/wallet.html#'