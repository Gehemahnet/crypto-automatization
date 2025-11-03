import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ProfileConfig } from '../types';
import { generateFingerprint } from './fingerprint';

const readLinesFromFile = (filename: string): string[] => {
    if (!existsSync(filename)) return [];

    const content = readFileSync(filename, 'utf-8');
    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'));
};

export const generateProfiles = (): ProfileConfig[] => {
    const seeds = readLinesFromFile(join(process.cwd(), 'user-data', 'seed.txt'));
    const proxies = readLinesFromFile(join(process.cwd(), 'user-data', 'proxies.txt'));

    if (seeds.length === 0) {
        throw new Error('❌ No seed phrases found in user-data/seed.txt');
    }

    return seeds.map((seedPhrase, index) => {
        const profileName = `profile_${index + 1}`;
        const proxy = proxies[index];

        if (!proxy && index < proxies.length) {
            console.log(`⚠️  ${profileName} will work without proxy`);
        }

        return {
            profileName,
            seedPhrase,
            proxy,
            delayRange: { min: 2000, max: 8000 },
            fingerprint: generateFingerprint(proxy)
        };
    });
};