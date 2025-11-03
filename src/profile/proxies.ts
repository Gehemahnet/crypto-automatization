import {ProfileConfig, ProxyConfig} from "../types";
import {BYPASS, PROXY_REGEX} from "../constants";
import {LaunchOptions} from "@playwright/test";

export const parseProxyString = (proxyString?: string): ProxyConfig | undefined => {
    if (!proxyString) return undefined;

    try {
        const cleanProxy = proxyString.trim();
        const match = cleanProxy.match(PROXY_REGEX);

        if (match) {
            const [, protocol, username, password, host, port] = match;

            return {
                server: `${protocol}://${host}:${port}`,
                username: username || undefined,
                password: password || undefined,
                bypass: BYPASS
            };
        }

        return {
            server: cleanProxy,
            bypass: BYPASS
        };

    } catch (error) {
        console.error(`❌ Failed to parse proxy: ${proxyString}`, error);
        return undefined;
    }
};

export const formatProxyForLog = (proxyConfig?: ProxyConfig): string => {
    if (!proxyConfig) return '🔓 NO PROXY';

    try {
        const {server, username} = proxyConfig;

        if (username) {
            const maskedServer = server.replace(/(\/\/)([^:]+):([^@]+)(@)/, '$1$2:****$4');
            return `🔐 ${maskedServer}`;
        } else {
            return `🔐 ${server}`;
        }
    } catch {
        return `🔐 ${proxyConfig.server}`;
    }
};

export const modifyLaunchOptionsWithProxy = ({profile, launchOptions}: {
    profile: ProfileConfig,
    launchOptions: LaunchOptions
}) => {
    if (profile.proxy) {
        const proxyConfig = parseProxyString(profile.proxy);
        if (proxyConfig) {
            launchOptions.proxy = proxyConfig;
            console.log(`   🔧 Proxy configured: ${proxyConfig.server}`);
            if (proxyConfig.username) {
                console.log(`   👤 Proxy auth: ${proxyConfig.username}:****`);
            }
        } else {
            console.log(`   ⚠️  Failed to parse proxy: ${profile.proxy}`);
        }
    }
}