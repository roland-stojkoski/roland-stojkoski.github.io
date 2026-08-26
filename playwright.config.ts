import { defineConfig, devices } from '@playwright/test';

// Sandboxed environments can point at a system chromium instead of
// downloading browsers (e.g. CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium).
const launchOptions = process.env.CHROMIUM_EXECUTABLE_PATH
	? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH }
	: {};

export default defineConfig({
	testDir: 'e2e',
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	use: {
		baseURL: 'http://localhost:4173',
		launchOptions
	},
	projects: [
		{
			name: 'desktop',
			use: { ...devices['Desktop Chrome'], launchOptions }
		},
		{
			name: 'mobile',
			use: { ...devices['Pixel 7'], launchOptions }
		}
	]
});
