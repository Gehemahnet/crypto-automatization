import path from 'path';
import {GlobalConfig} from "./types";

export const SOLFLARE_EXTENSION_URL = 'chrome-extension://bhhhlbepdkbapadjdnnojkbgioiodbic/wallet.html#';

export const EXTENSION_DIR = path.join(process.cwd(), 'solflare_extension');
export const USER_DATA_DIR = path.join(process.cwd(), 'browser_profile');


export const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

export const VIEWPORTS = [
    {width: 1920, height: 1080},
    {width: 1366, height: 768},
    {width: 1536, height: 864},
];

export const SCREENS = [
    {width: 1920, height: 1080},
    {width: 2560, height: 1440},
    {width: 1366, height: 768},
];

export const RENDERERS = [
    'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)',
    'ANGLE (AMD, AMD Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0)',
];

export const COUNTRY_TIMEZONES: { [country: string]: string[] } = {
    'us': ['America/New_York', 'America/Chicago', 'America/Los_Angeles'],
    'gb': ['Europe/London'],
    'de': ['Europe/Berlin'],
    'fr': ['Europe/Paris'],
    'jp': ['Asia/Tokyo'],
    'kr': ['Asia/Seoul'],
};

export const PROXY_REGEX = /^(\w+):\/\/(?:([^:]+):([^@]+)@)?([^:@]+):(\d+)$/;

export const BYPASS = ".com, .org, localhost, 127.0.0.1"

export const GLOBAL_CONFIG: GlobalConfig = {
    walletPassword: 'SecureReally14281375_!',
    headless: false,
    defaultDelayRange: {min: 1000, max: 5000},
    numberOfTrades: 10,
};