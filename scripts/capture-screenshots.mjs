import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import fs from 'fs';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
	console.log('Cleaning any existing process on port 4173...');
	const killProc = spawn('npx', ['kill-port', '4173'], { shell: true });
	await new Promise((resolve) => killProc.on('exit', resolve));

	console.log('Starting preview server...');
	const previewProc = spawn('npm', ['run', 'preview'], { shell: true });

	// Wait for preview server to be ready
	await sleep(3000);

	console.log('Ensuring screenshot directories exist...');
	fs.mkdirSync('screenshots/latte', { recursive: true });
	fs.mkdirSync('screenshots/espresso', { recursive: true });

	const browser = await chromium.launch({ headless: true });

	const pages = [
		{ name: 'home', path: '/' },
		{ name: 'about', path: '/about' },
		{ name: 'articles', path: '/articles' },
		{ name: 'contact', path: '/contact' },
		{ name: 'attributions', path: '/attributions' },
		{ name: 'article-detail', path: '/articles/modernize-2026' }
	];

	try {
		for (const theme of ['latte', 'espresso']) {
			console.log(`Capturing screenshots for theme: ${theme}`);
			const context = await browser.newContext({
				viewport: { width: 1280, height: 800 }
			});
			const page = await context.newPage();

			// Navigate to home first to set the localStorage theme
			await page.goto('http://localhost:4173/');
			await page.evaluate((t) => localStorage.setItem('theme', t), theme);

			for (const p of pages) {
				console.log(`  - Navigating to ${p.path}`);
				await page.goto(`http://localhost:4173${p.path}`);
				// Wait for transitions and layouts to settle
				await sleep(1200);
				await page.screenshot({
					path: `screenshots/${theme}/${p.name}.png`,
					fullPage: true
				});
			}
			await context.close();
		}
		console.log('Screenshots captured successfully!');
	} catch (err) {
		console.error('Error capturing screenshots:', err);
		process.exit(1);
	} finally {
		await browser.close();
		previewProc.kill();
	}
	process.exit(0);
}

run();
