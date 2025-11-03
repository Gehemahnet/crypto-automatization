import {setupSolflare} from '../solflare';
import {logProfileInfo, shortenUserAgent} from "../utils";
import {BrowsersMap, ProfileConfig, RunContext, ScriptConfig} from "../types";
import {GLOBAL_CONFIG} from "../constants";
import {startRunner} from "../runner";
import {generateProfiles} from "../profile";

const debugSingleProfile = async (profile: ProfileConfig) => {
    const browsers: BrowsersMap = new Map()
    console.log(`\n🔧 Debugging profile: ${profile.profileName}`);
    console.log(`🔑 Seed: ${profile.seedPhrase}`);
    console.log(`🌐 Proxy: ${profile.proxy || 'NO PROXY'}`);

    const scriptConfig: ScriptConfig = {
        name: 'Debug',
        walletInitializer: setupSolflare,
        mainScript: async (runContext: RunContext) => {
            const {tabsMap, browserContext, profile: currentProfile} = runContext;

            console.log(`🚀 Debug script started for ${currentProfile.profileName}`);
            console.log(`📊 tabsMap size: ${tabsMap?.size || 0}`);

            console.log('🌐 Navigating to test page...');
            const page = await browserContext.newPage()
            await page.goto('https://2ip.ru');

            const title = await page.title();
            console.log(`📄 Page title: ${title}`);

            console.log(`\n🎯 Profile ${currentProfile.profileName} is ready for debugging`);
            console.log('💡 You can now inspect the browser manually.');
            console.log('⏳ Press Ctrl+C in terminal to close all profiles.');
            },
    };

    try {
        await startRunner({profile, scriptConfig, browsers});
        return true;
    } catch (error) {
        console.error(`❌ Debug session failed for ${profile.profileName}:`, error);
        return false;
    }
};

export const debugAllProfiles = async () => {
    console.log('🐛 Debug Mode - Opening ALL Profiles');

    const profiles = generateProfiles();
    if (profiles.length === 0) {
        console.log('❌ No profiles found');
        return;
    }

    console.log(`📊 Found ${profiles.length} profiles to debug`);

    const results: { profile: string, success: boolean }[] = [];

    // Запускаем все профили параллельно
    const debugPromises = profiles.map(async (profile) => {
        const success = await debugSingleProfile(profile);
        results.push({profile: profile.profileName, success});
        return {profile: profile.profileName, success};
    });

    console.log('\n🚀 Starting all debug sessions...');

    // Запускаем все профили и ждем пока они откроются
    await Promise.all(debugPromises);

    console.log('\n📊 All debug sessions started:');
    results.forEach(result => {
        console.log(`${result.profile}: ${result.success ? '✅ Debugging' : '❌ Failed'}`);
    });

    console.log('\n🎯 All profiles are now open in separate browser windows');
    console.log('💡 You can inspect each profile manually');
    console.log('⏳ Press Ctrl+C to close ALL browser windows');

    // Держим процесс активным
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

export const debugSingleProfileMode = async () => {
    console.log('🐛 Debug Mode - Single Profile');

    const profiles = generateProfiles();
    if (profiles.length === 0) {
        console.log('❌ No profiles found');
        return;
    }

    console.log('\n📋 Available profiles:');
    profiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.profileName} (${profile.proxy ? 'with proxy' : 'NO PROXY'})`);
    });


    const selectedProfile = profiles[0];
    console.log(`\n🎯 Selected profile: ${selectedProfile.profileName}`);

    await debugSingleProfile(selectedProfile);
};

export const debugScript = async () => {
    const args = process.argv.slice(2);
    const isAllProfiles = args.includes('--all') || args.includes('-a');

    if (isAllProfiles) {
        await debugAllProfiles();
    } else {
        await debugSingleProfileMode();
    }
};





export const debugLogs = async () => {
    console.log('📊 Debug Logs - Profile Information');
    console.log('════════════════════════════════════════════════════════════════');

    const profiles = generateProfiles();

    if (profiles.length === 0) {
        console.log('❌ No profiles found');
        return;
    }

    console.log(`📈 Found ${profiles.length} profiles`);
    console.log(`🔐 Wallet Password: ${GLOBAL_CONFIG.walletPassword}`);
    console.log('════════════════════════════════════════════════════════════════\n');

    // Логируем детали каждого профиля
    profiles.forEach(logProfileInfo);

    // Статистика по прокси
    const withProxy = profiles.filter(p => p.proxy).length;
    const withoutProxy = profiles.length - withProxy;

    console.log('\n📊 Profile Statistics:');
    console.log('════════════════════════════════════════════════════════════════');
    console.log(`👥 Total Profiles: ${profiles.length}`);
    console.log(`🔐 With Proxy: ${withProxy}`);
    console.log(`🔓 Without Proxy: ${withoutProxy}`);
    console.log(`📱 User Agents: ${new Set(profiles.map(p => p.fingerprint?.userAgent)).size} unique`);
    console.log(`🌍 Timezones: ${new Set(profiles.map(p => p.fingerprint?.timezone)).size} unique`);
    console.log('════════════════════════════════════════════════════════════════\n');

    // Показываем примеры User-Agent
    console.log('🖥️  Sample User Agents:');
    console.log('────────────────────────────────────────────────────────────────');
    const uniqueUserAgents = [...new Set(profiles.map(p => p.fingerprint?.userAgent))].slice(0, 3);
    uniqueUserAgents.forEach((userAgent, index) => {
        console.log(`${index + 1}. ${userAgent ?shortenUserAgent(userAgent): 'No user Agent'}`);
    });

    console.log('\n💡 This is a preview of what will be executed.');
    console.log('   No browsers will be opened in this mode.');
    console.log('   Use this to verify your configuration before running actual scripts.');
};
