import {
    RunContext,
    ResultsMap,
    StartRunnerForAllProfilesParams,
    StartRunnerParams
} from '../types';
import {launchProfile} from '../browser';
import {logProfileInfo} from '../utils';

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

    const promises = profiles.map(async (profile) => {
        const success = await startRunner({profile, scriptConfig, browsers});
        return { profileName: profile.profileName, success };
    });

    const resultsArray = await Promise.allSettled(promises);

    const results: ResultsMap = new Map();

    resultsArray.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            results.set(result.value.profileName, result.value.success);
        } else {
            const profileName = profiles[index].profileName;
            console.error(`❌ Profile ${profileName} failed:`, result.reason);
            results.set(profileName, false);
        }
    });

    return results;
};