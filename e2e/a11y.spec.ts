import { expect, test, type Page } from '@playwright/test';

const TRIGGER = 'Accessibility Settings';
const PANEL = 'Accessibility settings';

const trigger = (page: Page) => page.getByRole('button', { name: TRIGGER });
const panel = (page: Page) => page.getByRole('group', { name: PANEL });

/** Tab until the accessibility trigger has focus — a real keyboard journey,
 * never a click. Playwright's Tab respects the browser's own tab order, so
 * this also proves nothing invisible sits in front of the trigger. */
async function tabToTrigger(page: Page) {
	for (let i = 0; i < 40; i++) {
		const label = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
		if (label === TRIGGER) return;
		await page.keyboard.press('Tab');
	}
	throw new Error('never reached the accessibility trigger by tabbing');
}

/** Accessible name of whatever currently has focus, resolved the way a
 * screen reader would: aria-label, then every id in aria-labelledby, then a
 * native <label>, then the element's own text minus what is hidden from
 * assistive technology. */
async function focusedLabel(page: Page) {
	return page.evaluate(() => {
		const el = document.activeElement as HTMLInputElement | null;
		if (!el) return null;
		const clean = (text: string | null | undefined) => text?.replace(/\s+/g, ' ').trim() ?? null;

		const aria = el.getAttribute('aria-label');
		if (aria) return clean(aria);

		const labelledBy = el.getAttribute('aria-labelledby');
		if (labelledBy) {
			return clean(
				labelledBy
					.split(/\s+/)
					.map((id) => document.getElementById(id)?.textContent ?? '')
					.join(' ')
			);
		}

		const labels = el.labels;
		if (labels && labels.length > 0) return clean(labels[0].textContent);

		const contents = el.cloneNode(true) as HTMLElement;
		for (const hidden of contents.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
		return clean(contents.textContent);
	});
}

/** Is focus currently inside the accessibility panel? */
const focusIsInPanel = (page: Page) =>
	page.evaluate(() => !!document.activeElement?.closest('.a11y-panel'));

test.describe('accessibility menu keyboard access', () => {
	test('opens, operates and closes with the keyboard only', async ({ page }) => {
		await page.goto('/');

		await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
		await expect(panel(page)).toHaveAttribute('inert', '');

		await tabToTrigger(page);
		await page.keyboard.press('Enter');

		await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');
		await expect(panel(page)).not.toHaveAttribute('inert', '');
		// A disclosure leaves focus on its trigger and lets Tab walk in.
		await expect(trigger(page)).toBeFocused();

		// Tab lands on the selected text-size radio, the group's single stop.
		await page.keyboard.press('Tab');
		expect(await focusedLabel(page)).toBe('Normal');

		// Arrow keys pick inside the radio group without leaving it.
		await page.keyboard.press('ArrowRight');
		expect(await focusedLabel(page)).toBe('A+ Large');
		await expect(page.locator('html')).toHaveClass(/text-lg/);
		await expect(page.getByRole('radio', { name: 'A+ Large', exact: true })).toHaveAttribute(
			'aria-checked',
			'true'
		);

		// Tab on to the first toggle and flip it with the space bar.
		await page.keyboard.press('Tab');
		expect(await focusedLabel(page)).toBe('Dyslexia Font');
		await page.keyboard.press('Space');
		await expect(page.locator('html')).toHaveClass(/dyslexic-font/);

		await page.keyboard.press('Escape');
		await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
		await expect(panel(page)).toHaveAttribute('inert', '');
		await expect(trigger(page)).toBeFocused();
	});

	test('opens with the space bar too', async ({ page }) => {
		await page.goto('/');
		await tabToTrigger(page);
		await page.keyboard.press('Space');
		await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');
		await page.keyboard.press('Escape');
		await expect(trigger(page)).toBeFocused();
	});

	test('escape still dismisses the panel from the language picker', async ({ page }) => {
		await page.goto('/');
		await tabToTrigger(page);
		await page.keyboard.press('Enter');

		// No popup is open here, so nothing swallows the escape: the guard for
		// firefox's popup-escape must not cost the dismissal gesture.
		await panel(page).getByLabel('Translate site').focus();
		await page.keyboard.press('Escape');

		await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
		await expect(panel(page)).toHaveAttribute('inert', '');
		await expect(trigger(page)).toBeFocused();
	});

	test('closed menu keeps its controls out of the tab order', async ({ page }) => {
		await page.goto('/');
		await tabToTrigger(page);

		// Twenty stops past the trigger and focus must never fall inside the
		// closed panel; inert is what guarantees that.
		for (let i = 0; i < 20; i++) {
			await page.keyboard.press('Tab');
			expect(await focusIsInPanel(page)).toBe(false);
		}
	});

	test('tab walks through the panel and out the far side', async ({ page }) => {
		await page.goto('/');
		await tabToTrigger(page);
		await page.keyboard.press('Enter');
		await expect(trigger(page)).toBeFocused();

		// No trap: every control is reachable in DOM order and Tab eventually
		// leaves, which is the whole point of a disclosure over a modal.
		const stops: (string | null)[] = [];
		for (let i = 0; i < 12; i++) {
			await page.keyboard.press('Tab');
			if (!(await focusIsInPanel(page))) break;
			stops.push(await focusedLabel(page));
		}

		expect(stops.length).toBeLessThan(12);
		expect(stops[0]).toBe('Normal');
		expect(stops).toContain('Read Page Aloud Play');
		expect(stops).toContain('Translate site');
		// The explicit exit for switch access, and the last stop in the panel.
		expect(stops[stops.length - 1]).toBe('Close');

		// Focus left the panel, so the disclosure folds itself away.
		await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
	});

	test('the close control dismisses the panel and hands focus back', async ({ page }) => {
		await page.goto('/');
		await trigger(page).click();
		await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');

		await panel(page).getByRole('button', { name: 'Close', exact: true }).click();

		await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
		await expect(panel(page)).toHaveAttribute('inert', '');
		await expect(trigger(page)).toBeFocused();
	});

	test('trigger points aria-controls at the real panel', async ({ page }) => {
		await page.goto('/');
		const control = trigger(page);
		const controls = await control.getAttribute('aria-controls');
		expect(controls).toBeTruthy();

		const target = page.locator(`#${controls}`);
		await expect(target).toHaveClass(/a11y-panel/);
		// A labelled container, not a dialog: nothing behind it is inert or
		// aria-hidden, so claiming modality would misdescribe the page.
		await expect(target).toHaveAttribute('role', 'group');
		await expect(target).toHaveAttribute('aria-label', PANEL);
		expect(await control.getAttribute('aria-haspopup')).toBeNull();
	});

	test('read-aloud button keeps its visible word in its name', async ({ page }) => {
		await page.goto('/');
		await trigger(page).click();
		const readAloud = page.getByRole('button', { name: 'Read Page Aloud Play', exact: true });
		await expect(readAloud).toHaveAttribute('aria-pressed', 'false');
		await expect(readAloud).toHaveText('Play');
	});

	test('panel fits the viewport at 200% text zoom', async ({ page }) => {
		await page.goto('/');
		await trigger(page).click();
		await expect(panel(page)).toBeVisible();

		await page.evaluate(() => {
			document.documentElement.style.fontSize = '32px';
		});

		const fits = await page.evaluate(() => {
			const el = document.querySelector('.a11y-panel') as HTMLElement;
			const box = el.getBoundingClientRect();
			return {
				left: box.left,
				right: box.right,
				top: box.top,
				width: box.width,
				height: box.height,
				viewportWidth: document.documentElement.clientWidth,
				viewportHeight: window.innerHeight
			};
		});

		// The panel grows leftwards from a trigger a few rem in from the right
		// edge, so a narrow viewport is where it runs off the left of the page.
		expect(fits.left).toBeGreaterThanOrEqual(-1);
		expect(fits.right).toBeLessThanOrEqual(fits.viewportWidth + 1);
		expect(fits.width).toBeGreaterThan(0);
		// Its own max-height keeps it shorter than the viewport; the top edge
		// has to stay on screen for that to mean anything.
		expect(fits.top).toBeGreaterThanOrEqual(0);
		expect(fits.top).toBeLessThan(fits.viewportHeight);
		expect(fits.height).toBeLessThanOrEqual(fits.viewportHeight);
	});
});
