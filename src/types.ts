export type TokenToTrade = {
    prices: [number, number];
    leverage: [number, number];
    maxSpread: number;
    openPrice: [number, number];
}

export type Config = {
    tokensToTrade: Partial<Record<Tokens, TokenToTrade>>;
    simpleSwap: boolean;
    slowMo: number;
    numberOfTrades: number;
}

export enum Tokens {
    USDT = 'USDT',
    USDC = 'USDC',
    SOL = 'SOL',
    BTC = 'BTC',
    ETH = 'ETH',
    HYPE = 'HYPE',
}

