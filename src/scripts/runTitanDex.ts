import {titanDexRunner} from '../protocols/titanDex';
import {setupSolflare} from "../solflare";
import {generateProfiles} from "../profile";
import {startRunnerOnAllProfiles} from "../runner";

const scriptConfig = {
    name: 'Titan Dex',
    walletInitializer: setupSolflare,
    mainScript: titanDexRunner,
};
export const runTitanDex = async () => {
    console.log('🎯 Starting Titan Dex on all profiles');

    const profiles = generateProfiles();
    const results = await startRunnerOnAllProfiles({profiles, scriptConfig, browsers: new Map()});

    console.log('\n📊 Titan Dex Results:');
    results.forEach((success, profileName) => {
        console.log(`${profileName}: ${success ? '✅ Success' : '❌ Failed'}`);
    });
};
