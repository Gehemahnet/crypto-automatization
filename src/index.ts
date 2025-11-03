import {startRunnerOnAllProfiles} from './runner';
import {rangerFinanceRunner} from './protocols/rangerFinance';
import {setupSolflare} from './solflare';
import {generateProfiles} from "./profile";

const main = async () => {
    const browsers = new Map()
    const profiles = generateProfiles();

    const scriptConfig = {
        name: 'Main System',
        walletInitializer: setupSolflare,
        mainScript: rangerFinanceRunner,
    };

    const results = await startRunnerOnAllProfiles({profiles, scriptConfig, browsers});

    console.log('\n📊 Final Results:');
    results.forEach((success: boolean, profileName: string) => {
        console.log(`${profileName}: ${success ? '✅ Running' : '❌ Stopped'}`);
    });
};