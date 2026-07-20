import { expect, test } from '@playwright/test';

test.describe('home page', () => {
	test('renders the hero and timeline', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: /hi, i'm roland/i })).toBeVisible();
		await expect(page.locator('#timeline')).toBeVisible();
		await expect(page.getByText('Promoted to SysDE II @ AWS')).toBeVisible();
	});

	test('navigates to an article from the timeline', async ({ page }) => {
		await page.goto('/');
		await page
			.getByRole('link', { name: /read article/i })
			.first()
			.click();
		await expect(page).toHaveURL(/\/articles\//);
		await expect(page.getByRole('link', { name: /back to \/dev\/timeline/i })).toBeVisible();
	});
});

test.describe('theme', () => {
	test('defaults to the dark theme for dark-scheme users', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.goto('/');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'espresso');
	});

	test('toggle switches theme and survives reload', async ({ page }) => {
		await page.emulateMedia({ colorScheme: 'light' });
		await page.goto('/');
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'latte');
		await page.getByRole('button', { name: /switch to dark theme/i }).click();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'espresso');
		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-theme', 'espresso');
	});
});

test.describe('static pages', () => {
	for (const path of ['/about', '/attributions', '/contact']) {
		test(`renders ${path}`, async ({ page }) => {
			await page.goto(path);
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		});
	}

	test('footer has the new instagram and no twitter', async ({ page }) => {
		await page.goto('/');
		const footer = page.locator('footer');
		await expect(footer.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
			'href',
			'https://www.instagram.com/theonlyroly/'
		);
		await expect(footer.getByRole('link', { name: /twitter/i })).toHaveCount(0);
	});

	test('serves the rss feed', async ({ request }) => {
		const response = await request.get('/rss.xml');
		expect(response.status()).toBe(200);
		expect(await response.text()).toContain('<rss version="2.0">');
	});
});
