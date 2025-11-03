import {defineConfig, devices} from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    retries: 0,
    reporter: 'html',
    use: {
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
})