import fs from 'fs';
import path from 'path';
import { USER_DATA_DIR } from '../constants';
import {BrowsersMap} from "../types";

export const cleanProfiles = async () => {
    const browsers: BrowsersMap = new Map()
    console.log('🧹 Cleaning all profile data...');

    if (!fs.existsSync(USER_DATA_DIR)) {
        console.log('✅ No profile data found - nothing to clean');
        return;
    }

    try {
        const items = fs.readdirSync(USER_DATA_DIR);
        const profileDirs = items.filter(item => {
            const itemPath = path.join(USER_DATA_DIR, item);
            return fs.statSync(itemPath).isDirectory() && item.startsWith('profile_');
        });

        if (profileDirs.length === 0) {
            console.log('✅ No profile directories found');
            return;
        }

        console.log(`📁 Found ${profileDirs.length} profile directories to clean:`);
        profileDirs.forEach(profile => console.log(`   - ${profile}`));

        let cleanedCount = 0;
        let errorCount = 0;

        for (const profileDir of profileDirs) {
            try {
                const profilePath = path.join(USER_DATA_DIR, profileDir);

                // Рекурсивно удаляем папку профиля
                fs.rmSync(profilePath, { recursive: true, force: true });
                console.log(`✅ Cleaned: ${profileDir}`);
                cleanedCount++;
            } catch (error) {
                console.log(`❌ Failed to clean: ${profileDir}`, error);
                errorCount++;
            }
        }

        console.log(`\n📊 Cleanup results:`);
        console.log(`   ✅ Successfully cleaned: ${cleanedCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log(`   📁 Total profiles: ${profileDirs.length}`);

        const remainingItems = fs.readdirSync(USER_DATA_DIR);
        if (remainingItems.length === 0) {
            console.log('🗑️  Removing empty profiles directory...');
            fs.rmdirSync(USER_DATA_DIR);
            console.log('✅ Profiles directory removed');
        }

    } catch (error) {
        console.error('💥 Error during cleanup:', error);
    }
};

export const cleanSingleProfile = async (profileName: string) => {
    console.log(`🧹 Cleaning profile: ${profileName}`);

    const profilePath = path.join(USER_DATA_DIR, profileName);

    if (!fs.existsSync(profilePath)) {
        console.log(`✅ Profile ${profileName} not found - nothing to clean`);
        return false;
    }

    try {
        fs.rmSync(profilePath, { recursive: true, force: true });
        console.log(`✅ Successfully cleaned profile: ${profileName}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to clean profile ${profileName}:`, error);
        return false;
    }
};

export const listProfiles = async () => {
    console.log('📋 Listing all profiles:');

    if (!fs.existsSync(USER_DATA_DIR)) {
        console.log('   No profiles found');
        return [];
    }

    const items = fs.readdirSync(USER_DATA_DIR);
    const profileDirs = items.filter(item => {
        const itemPath = path.join(USER_DATA_DIR, item);
        return fs.statSync(itemPath).isDirectory() && item.startsWith('profile_');
    });

    if (profileDirs.length === 0) {
        console.log('   No profiles found');
        return [];
    }

    profileDirs.forEach((profile, index) => {
        const profilePath = path.join(USER_DATA_DIR, profile);
        const stats = fs.statSync(profilePath);
        const size = formatBytes(stats.size);
        console.log(`   ${index + 1}. ${profile} (${size})`);
    });

    return profileDirs;
};

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};