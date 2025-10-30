import {defineConfig, devices} from '@playwright/test'
import config from "./src/config";


export default defineConfig({
    testDir: './src/tests',
    fullyParallel: true,
    retries: 0,
    reporter: 'html',
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: config.viewport
            },
        },
    ],
})