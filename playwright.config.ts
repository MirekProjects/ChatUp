import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    workers: 1,

    use: {
        browserName: 'chromium',
        headless: true,
        baseURL: 'http://localhost:3000',
    },

    webServer: [
        {
            command: 'node src/server/server.js',
            port: 8080,
            reuseExistingServer: !process.env.CI
        },
        {
            command: 'npx serve src/client -l 3000',
            port: 3000,
            reuseExistingServer: !process.env.CI
        },
    ],
});
