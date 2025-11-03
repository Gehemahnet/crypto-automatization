import {BrowserFingerprint} from '../types';
import {COUNTRY_TIMEZONES, RENDERERS, SCREENS, USER_AGENTS, VIEWPORTS} from '../constants';

const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

const detectTimezoneFromProxy = (proxy: string): string => {
    try {
        const ipMatch = proxy.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (!ipMatch) return 'America/New_York';

        const ip = ipMatch[1];
        const firstOctet = parseInt(ip.split('.')[0]);
        let country = 'us';

        if (firstOctet >= 46 && firstOctet <= 47) country = 'ru';
        else if (firstOctet >= 49 && firstOctet <= 49) country = 'au';
        else if (firstOctet >= 78 && firstOctet <= 78) country = 'de';
        else if (firstOctet >= 85 && firstOctet <= 85) country = 'gb';
        else if (firstOctet >= 91 && firstOctet <= 91) country = 'fr';
        else if (firstOctet >= 101 && firstOctet <= 101) country = 'jp';

        const timezones = COUNTRY_TIMEZONES[country] || ['America/New_York'];
        return timezones[hashString(ip) % timezones.length];

    } catch {
        return 'America/New_York';
    }
};

export const generateFingerprint = (proxy?: string): BrowserFingerprint => {
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const viewport = VIEWPORTS[Math.floor(Math.random() * VIEWPORTS.length)];
    const language = 'en-US';
    const timezone = proxy ? detectTimezoneFromProxy(proxy) : 'America/New_York';
    const hardwareConcurrency = [4, 6, 8][Math.floor(Math.random() * 3)];
    const deviceMemory = [8, 16][Math.floor(Math.random() * 2)];
    const screen = SCREENS[Math.floor(Math.random() * SCREENS.length)];
    const renderer = RENDERERS[Math.floor(Math.random() * RENDERERS.length)];

    return {
        userAgent,
        viewport,
        language,
        timezone,
        hardwareConcurrency,
        deviceMemory,
        screen,
        renderer
    };
};
