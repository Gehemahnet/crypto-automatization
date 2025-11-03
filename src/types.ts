import {BrowserContext, Page} from "@playwright/test";
import {chromium} from "playwright";

export type BrowserFingerprint = {
    userAgent: string;
    viewport: { width: number; height: number };
    language: string;
    timezone: string;
    hardwareConcurrency: number;
    deviceMemory: number;
    screen: { width: number; height: number };
    renderer: string;
}

export type ProfileConfig = {
    profileName: string;
    seedPhrase: string;
    proxy?: string;
    delayRange?: { min: number; max: number };
    fingerprint?: BrowserFingerprint;
}

export type GlobalConfig = {
    walletPassword: string;
    headless?: boolean;
    defaultDelayRange?: { min: number; max: number };
    numberOfTrades: number;
}


export type ProxyConfig = {
    server: string;
    username?: string;
    password?: string;
    bypass?: string;
}

export type LaunchProfileReturn = {
    browserContext: BrowserContext;
    page: Page;
    tabsMap: TabsMap;
}

export type ScriptConfig = {
    name: string;
    walletInitializer: (params: SolflareParams) => Promise<void>;
    mainScript?: (runContext: RunContext) => Promise<void>;
}

export type RunContext = {
    page: Page;
    browserContext: BrowserContext;
    profile: ProfileConfig;
    tabsMap?: TabsMap;
}

export type StartRunnerParams = {
    profile: ProfileConfig,
    scriptConfig: ScriptConfig,
    browsers: BrowsersMap,
}

export type StartRunnerForAllProfilesParams = {
    profiles: ProfileConfig[],
    scriptConfig: ScriptConfig,
    browsers: BrowsersMap,
}

export type SolflareParams = {
    profile: ProfileConfig,
    browserContext: BrowserContext,
    tabsMap: TabsMap
}

export type TabsMap = Map<string, Page>
export type BrowsersMap = Map<string, BrowserContext>
export type ResultsMap = Map<string, boolean>

export type LaunchOptions = Parameters<typeof chromium.launchPersistentContext>[1]

export type TokenToTrade = {
    prices: [number, number];
    leverage: [number, number];
    maxSpread: number;
    openPrice: [number, number];
}

export type Config = {
    tokensToTrade: Partial<Record<Tokens, TokenToTrade>>;
    simpleSwap: boolean;
    viewport?: { width: number; height: number };
    slowMo: number;
}

export enum Tokens {
    USDT = 'USDT',
    USDC = 'USDC',
    SOL = 'SOL',
    BTC = 'BTC',
    ETH = 'ETH',
    HYPE = 'HYPE',
}

