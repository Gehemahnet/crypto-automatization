import {rangerFinanceRunner} from '../protocols/rangerFinance';
import {setupSolflare} from '../solflare';
import {startRunnerOnAllProfiles} from "../runner";
import {generateProfiles} from "../profile";

const scriptConfig = {
    name: 'Ranger Finance',
    walletInitializer: setupSolflare,
    mainScript: rangerFinanceRunner,
};

export const runRangerFinance = async () => {
    const profiles = generateProfiles();
    const results = await startRunnerOnAllProfiles({profiles, scriptConfig, browsers: new Map()});

    console.log('\n📊 Ranger Finance Results:');
    results.forEach((success, profileName) => {
        console.log(`${profileName}: ${success ? '✅ Success' : '❌ Failed'}`);
    });
};