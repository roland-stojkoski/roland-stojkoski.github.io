import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	use: {
		baseURL: 'http://localhost:4173',
		// Sandboxed environments can point at a system chromium instead of
		// downloading browsers (e.g. CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium).
		...(process.env.CHROMIUM_EXECUTABLE_PATH
			? { launchOptions: { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } }
			: {})
	}
});
