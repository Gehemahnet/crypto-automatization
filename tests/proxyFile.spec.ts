import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parseProxyString } from '../src/browser';

const readProxiesFromFile = (): string[] => {
    const proxiesFile = join(process.cwd(), 'user-data', 'proxies.txt');

    if (!existsSync(proxiesFile)) {
        console.warn('⚠️  proxies.txt not found, skipping file-based tests');
        return [];
    }

    const content = readFileSync(proxiesFile, 'utf-8');
    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'));
};

test.describe('Proxy File Validation', () => {

    test('should parse all proxies.txt from proxies.txt file', () => {
        const proxies = readProxiesFromFile();

        // Если файла нет, пропускаем тест
        test.skip(proxies.length === 0, 'proxies.txt file not found or empty');

        console.log(`\n📁 Found ${proxies.length} proxies in file:`);

        proxies.forEach((proxy, index) => {
            console.log(`   ${index + 1}. ${proxy}`);
        });

        // Проверяем что все прокси парсятся корректно
        const parsingResults = proxies.map(proxy => ({
            proxy,
            result: parseProxyString(proxy)
        }));

        const successfulParses = parsingResults.filter(r => r.result !== undefined);
        const failedParses = parsingResults.filter(r => r.result === undefined);

        console.log(`\n📊 Parsing Results:`);
        console.log(`   ✅ Successfully parsed: ${successfulParses.length}`);
        console.log(`   ❌ Failed to parse: ${failedParses.length}`);

        // Логируем неудачные парсинги
        if (failedParses.length > 0) {
            console.log('\n🔍 Failed proxies.txt:');
            failedParses.forEach(({ proxy }) => {
                console.log(`   ❌ ${proxy}`);
            });
        }

        // Все прокси должны парситься успешно
        expect(failedParses.length).toBe(0);

        // Проверяем структуру успешно распарсенных прокси
        successfulParses.forEach(({ proxy, result }) => {
            expect(result).toBeDefined();
            expect(result!.server).toBeDefined();
            expect(result!.server).toMatch(/^https?:\/\/.+/);
            expect(result!.bypass).toBeDefined();
        });
    });

    test('should have valid proxy formats in file', () => {
        const proxies = readProxiesFromFile();

        test.skip(proxies.length === 0, 'proxies.txt file not found or empty');

        const invalidProxies: string[] = [];

        proxies.forEach(proxy => {
            // Проверяем базовый формат прокси
            const isValidFormat = /^(\w+):\/\/(?:([^:]+):([^@]+)@)?([^:@]+):(\d+)$/.test(proxy);

            if (!isValidFormat) {
                invalidProxies.push(proxy);
            }
        });

        console.log(`\n🔍 Format Validation:`);
        console.log(`   ✅ Valid format: ${proxies.length - invalidProxies.length}`);
        console.log(`   ❌ Invalid format: ${invalidProxies.length}`);

        if (invalidProxies.length > 0) {
            console.log('\n⚠️  Invalid proxy formats:');
            invalidProxies.forEach(proxy => {
                console.log(`   ❌ ${proxy}`);
            });
        }

        expect(invalidProxies.length).toBe(0);
    });

    test('should have unique proxies.txt in file', () => {
        const proxies = readProxiesFromFile();

        test.skip(proxies.length === 0, 'proxies.txt file not found or empty');

        const uniqueProxies = new Set(proxies);
        const duplicates = proxies.length - uniqueProxies.size;

        console.log(`\n🔍 Uniqueness Check:`);
        console.log(`   📊 Total proxies: ${proxies.length}`);
        console.log(`   🔄 Duplicates: ${duplicates}`);

        if (duplicates > 0) {
            console.log('⚠️  Duplicate proxies.txt found in file');
        }

        expect(duplicates).toBe(0);
    });
});