import {setupSolflare} from '../solflare';
import {generateProfiles} from "../profile";
import {startRunnerOnAllProfiles} from "../runner";

const scriptConfig = {
    name: 'Init Wallets',
    walletInitializer: setupSolflare,
};

export const initWallets = async () => {
    const profiles = generateProfiles();
    const results = await startRunnerOnAllProfiles({profiles, scriptConfig, browsers: new Map()});

    console.log('\n📊 Init wallets Results:');
    results.forEach((success, profileName) => {
        console.log(`${profileName}: ${success ? '✅ Success' : '❌ Failed'}`);
    });
};