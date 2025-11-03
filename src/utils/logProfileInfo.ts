import {shortenUserAgent} from "./shortenUserAgent";
import {formatProxyForLog, parseProxyString} from "../profile";
import {ProfileConfig} from "../types";

export const logProfileInfo = (profile: ProfileConfig) => {
    const proxyConfig = parseProxyString(profile.proxy);
    const userAgent = profile.fingerprint?.userAgent || 'Default';

    console.log('═'.repeat(60));
    console.log(`👤 Profile: ${profile.profileName}`);
    console.log(`🌐 Proxy: ${formatProxyForLog(proxyConfig)}`);
    console.log(`🖥️  User-Agent: ${shortenUserAgent(userAgent)}`);
    console.log(`📍 Timezone: ${profile.fingerprint?.timezone || 'Auto-detected'}`);
    console.log(`📏 Viewport: ${profile.fingerprint?.viewport.width}x${profile.fingerprint?.viewport.height}`);
    console.log(`⚙️  Hardware: ${profile.fingerprint?.hardwareConcurrency} cores, ${profile.fingerprint?.deviceMemory}GB RAM`);
    console.log(`⏱️  Delays: ${profile.delayRange?.min}-${profile.delayRange?.max}ms`);
    console.log('═'.repeat(60));
};