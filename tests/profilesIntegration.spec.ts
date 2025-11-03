import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { generateProfiles } from '../src/browser';

const readSeedsFromFile = (): string[] => {
    const seedsFile = join(process.cwd(), 'user-data', 'seed.txt');

    if (!existsSync(seedsFile)) {
        console.warn('⚠️  seed.txt not found');
        return [];
    }

    const content = readFileSync(seedsFile, 'utf-8');
    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'));
};

const readProxiesFromFile = (): string[] => {
    const proxiesFile = join(process.cwd(), 'user-data', 'proxies.txt');

    if (!existsSync(proxiesFile)) {
        console.warn('⚠️  proxies.txt not found');
        return [];
    }

    const content = readFileSync(proxiesFile, 'utf-8');
    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'));
};

test.describe('Profiles Integration', () => {

    test('should generate correct number of profiles', () => {
        const seeds = readSeedsFromFile();
        const proxies = readProxiesFromFile();

        test.skip(seeds.length === 0, 'seed.txt file not found or empty');

        const profiles = generateProfiles();

        console.log(`\n📊 Files Analysis:`);
        console.log(`   🔑 Seeds: ${seeds.length}`);
        console.log(`   🌐 Proxies: ${proxies.length}`);
        console.log(`   👥 Generated profiles: ${profiles.length}`);

        // Количество профилей должно соответствовать количеству сид фраз
        expect(profiles.length).toBe(seeds.length);

        // Проверяем распределение прокси
        const profilesWithProxy = profiles.filter(p => p.proxy).length;
        const profilesWithoutProxy = profiles.length - profilesWithProxy;

        console.log(`\n🔍 Proxy Distribution:`);
        console.log(`   🔐 With proxy: ${profilesWithProxy}`);
        console.log(`   🔓 Without proxy: ${profilesWithoutProxy}`);

        if (proxies.length < seeds.length) {
            console.log(`   ⚠️  ${profilesWithoutProxy} profiles will work without proxy`);
        }
    });

    test('should assign proxies.txt correctly to profiles', () => {
        const seeds = readSeedsFromFile();
        const proxies = readProxiesFromFile();

        test.skip(seeds.length === 0 || proxies.length === 0, 'Required files not found');

        const profiles = generateProfiles();

        // Проверяем что прокси назначены в правильном порядке
        profiles.forEach((profile, index) => {
            const expectedProxy = index < proxies.length ? proxies[index] : undefined;

            if (expectedProxy) {
                expect(profile.proxy).toBe(expectedProxy);
            }
        });

        console.log(`\n✅ Proxies assigned correctly to ${Math.min(seeds.length, proxies.length)} profiles`);
    });

    test('should have valid profile configurations', () => {
        const seeds = readSeedsFromFile();

        test.skip(seeds.length === 0, 'seed.txt file not found or empty');

        const profiles = generateProfiles();

        profiles.forEach(profile => {
            // Проверяем обязательные поля
            expect(profile.profileName).toMatch(/^profile_\d+$/);
            expect(profile.seedPhrase).toBeDefined();
            expect(profile.seedPhrase.split(' ').length).toBeGreaterThanOrEqual(12);

            // Проверяем fingerprint
            expect(profile.fingerprint).toBeDefined();
            expect(profile.fingerprint?.userAgent).toBeDefined();
            expect(profile.fingerprint?.viewport).toBeDefined();
            expect(profile.fingerprint?.viewport.width).toBeGreaterThan(0);
            expect(profile.fingerprint?.viewport.height).toBeGreaterThan(0);
            expect(profile.fingerprint?.timezone).toBeDefined();

            // Проверяем delays
            expect(profile.delayRange).toBeDefined();
            expect(profile.delayRange!.min).toBeGreaterThan(0);
            expect(profile.delayRange!.max).toBeGreaterThan(profile.delayRange!.min);
        });

        console.log(`\n✅ All ${profiles.length} profiles have valid configuration`);
    });
});