import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { DARK_THEME, LIGHT_THEME, THEME_STORAGE_KEY } from '$lib/utils/theme';
import ThemeToggle from './ThemeToggle.svelte';

describe('ThemeToggle', () => {
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.setAttribute('data-theme', LIGHT_THEME);
	});

	it('switches to the dark theme and persists it', async () => {
		const user = userEvent.setup();
		render(ThemeToggle);
		await user.click(screen.getByRole('button', { name: /switch to dark theme/i }));
		expect(document.documentElement.getAttribute('data-theme')).toBe(DARK_THEME);
		expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(DARK_THEME);
	});

	it('switches back to light on a second toggle', async () => {
		const user = userEvent.setup();
		render(ThemeToggle);
		await user.click(screen.getByRole('button'));
		await user.click(screen.getByRole('button'));
		expect(document.documentElement.getAttribute('data-theme')).toBe(LIGHT_THEME);
		expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(LIGHT_THEME);
	});
});
