import {
    RunContext,
    ResultsMap,
    StartRunnerForAllProfilesParams,
    StartRunnerParams
} from '../types';
import {launchProfile} from '../browser';
import {delay, logProfileInfo} from '../utils';

export const startRunner = async ({profile, scriptConfig, browsers}: StartRunnerParams): Promise<boolean> => {
    logProfileInfo(profile);

    try {
        console.log(`🌐 Launching browser...`);
        const {browserContext, tabsMap, page} = await launchProfile({profile,browsers});

        await scriptConfig.walletInitializer({
            tabsMap,
            profile,
            browserContext
        })

        const runContext: RunContext = {
            page,
            browserContext,
            profile,
            tabsMap
        };

        console.log(`🚀 Starting main script execution...`);
        await tabsMap.get('mainPage')?.bringToFront();
        if (scriptConfig.mainScript) {
            await scriptConfig.mainScript(runContext);
        }

        console.log(`✅ ${scriptConfig.name} completed successfully for ${profile.profileName}`);
        return true;

    } catch (error) {
        console.error(`❌ Error in ${scriptConfig.name} for ${profile.profileName}:`, error);
        return false;
    }
};

export const startRunnerOnAllProfiles = async ({profiles, scriptConfig, browsers}: StartRunnerForAllProfilesParams): Promise<ResultsMap> => {

    console.log(`\n🎯 Starting ${scriptConfig.name} on ${profiles.length} profiles`);
    console.log('═'.repeat(60));

    const results: ResultsMap = new Map();

    for (const profile of profiles) {
        const success = await startRunner({profile, scriptConfig, browsers});
        results.set(profile.profileName, success);

        if (profiles.length > 1) {
            console.log(`\n⏳ Waiting before next profile...`);
            await delay(5000);
        }
    }

    console.log('\n📊 Final Results:');
    console.log('═'.repeat(60));
    results.forEach((success, profileName) => {
        console.log(`${profileName}: ${success ? '✅ Success' : '❌ Failed'}`);
    });

    return results;
};