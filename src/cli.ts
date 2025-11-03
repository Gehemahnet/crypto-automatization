#!/usr/bin/env tsx

import inquirer from 'inquirer';
import {
    runRangerFinance,
    runTitanDex,
    cleanProfiles,
    cleanSingleProfile,
    listProfiles,
    debugAllProfiles,
    debugScript,
    initWallets,
    debugLogs,
} from './scripts';

const mainMenu = async () => {
    const {category} = await inquirer.prompt([
        {
            type: 'list',
            name: 'category',
            message: 'Select category:',
            choices: [
                {name: '🚀 Protocols', value: 'protocols'},
                {name: '👛 Profiles', value: 'profiles'},
                {name: '🐛 Debug', value: 'debug'},
                new inquirer.Separator(),
                {name: '❌ Exit', value: 'exit'}
            ]
        }
    ]);

    switch (category) {
        case 'protocols':
            await protocolsMenu();
            break;
        case 'profiles':
            await profilesMenu();
            break;
        case 'debug':
            await debugMenu();
            break;
        case 'exit':
            console.log('👋 Goodbye!');
            process.exit(0);
    }

    await askToReturnToMain();
};

const protocolsMenu = async () => {
    console.log('\n🚀 Protocols');
    console.log('============\n');

    const {protocol} = await inquirer.prompt([
        {
            type: 'list',
            name: 'protocol',
            message: 'Select protocol to run:',
            choices: [
                {name: '🎯 Ranger Finance', value: 'ranger'},
                {name: '⚡ Titan Dex', value: 'titan'},
                {name: '🔧 Custom Protocol', value: 'custom'},
                new inquirer.Separator(),
                {name: '↩️  Back to Main Menu', value: 'back'}
            ]
        }
    ]);

    switch (protocol) {
        case 'ranger':
            await runRangerFinance();
            break;
        case 'titan':
            await runTitanDex();
            break;
        case 'back':
            return;
    }

    await askToContinueInCategory('protocols');
};

const profilesMenu = async () => {
    console.log('\n👛 Profiles Management');
    console.log('=====================\n');

    const {action} = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Select action:',
            choices: [
                {name: '💰 Initialize Wallets', value: 'init-wallets'},
                {name: '📋 List Profiles', value: 'list-profiles'},
                {name: '🧹 Clean Single Profile', value: 'clean-single'},
                {name: '💥 Clean ALL Profiles', value: 'clean-all'},
                new inquirer.Separator(),
                {name: '↩️  Back to Main Menu', value: 'back'}
            ]
        }
    ]);

    switch (action) {
        case 'init-wallets':
            await initWallets();
            break;
        case 'list-profiles':
            await listProfiles();
            break;
        case 'clean-single':
            await handleCleanSingle();
            break;
        case 'clean-all':
            await handleCleanAll();
            break;
        case 'back':
            return;
    }

    await askToContinueInCategory('profiles');
};

const debugMenu = async () => {
    console.log('\n🐛 Debug Tools');
    console.log('=============\n');

    const {debugAction} = await inquirer.prompt([
        {
            type: 'list',
            name: 'debugAction',
            message: 'Select debug mode:',
            choices: [
                {name: '🔍 Debug Single Profile', value: 'debug-single'},
                {name: '👥 Debug All Profiles', value: 'debug-all'},
                {name: '📊 View Profile Logs', value: 'debug-logs'},

                new inquirer.Separator(),
                {name: '↩️  Back to Main Menu', value: 'back'},
            ]
        }
    ]);

    switch (debugAction) {
        case 'debug-single':
            await debugScript();
            break;
        case 'debug-all':
            await debugAllProfiles();
            break;
        case 'debug-logs':
            await debugLogs();
            break;
        case 'back':
            return;
    }

    await askToContinueInCategory('debug');
};

const handleCleanSingle = async () => {
    const profiles = await listProfiles();

    if (profiles.length === 0) {
        console.log('❌ No profiles found to clean');
        return;
    }

    const {profileName} = await inquirer.prompt([
        {
            type: 'list',
            name: 'profileName',
            message: 'Select profile to clean:',
            choices: profiles
        }
    ]);

    const {confirm} = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to clean profile "${profileName}"? This will delete all browser data and cannot be undone!`,
            default: false
        }
    ]);

    if (confirm) {
        await cleanSingleProfile(profileName);
    } else {
        console.log('❌ Cleanup cancelled');
    }
};

const handleCleanAll = async () => {
    const {confirm} = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: '⚠️  ARE YOU SURE? This will delete ALL profile data including browser cache, cookies, and wallet data! This cannot be undone!',
            default: false
        }
    ]);

    if (confirm) {
        await cleanProfiles();
    } else {
        console.log('❌ Cleanup cancelled');
    }
};

const askToContinueInCategory = async (category: string) => {
    const {continueAction} = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'continueAction',
            message: `Do you want to perform another ${category} action?`,
            default: true
        }
    ]);

    if (continueAction) {
        switch (category) {
            case 'protocols':
                await protocolsMenu();
                break;
            case 'profiles':
                await profilesMenu();
                break;
            case 'debug':
                await debugMenu();
                break;
        }
    }
};

const askToReturnToMain = async () => {
    const {returnToMain} = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'returnToMain',
            message: 'Return to main menu?',
            default: true
        }
    ]);

    if (returnToMain) {
        await mainMenu();
    } else {
        console.log('👋 Goodbye!');
    }
};

// Обработка Ctrl+C
process.on('SIGINT', () => {
    console.log('\n👋 Goodbye!');
    process.exit(0);
});

// Запуск CLI
mainMenu().catch(console.error);