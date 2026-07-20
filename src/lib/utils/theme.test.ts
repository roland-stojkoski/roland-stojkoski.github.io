import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	DARK_THEME,
	LIGHT_THEME,
	THEME_CHANGE_EVENT,
	THEME_STORAGE_KEY,
	applyTheme,
	isTheme,
	nextTheme,
	resolveTheme
} from './theme';

describe('isTheme', () => {
	it('accepts both known themes', () => {
		expect(isTheme(LIGHT_THEME)).toBe(true);
		expect(isTheme(DARK_THEME)).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isTheme('coffee')).toBe(false);
		expect(isTheme(null)).toBe(false);
		expect(isTheme(undefined)).toBe(false);
	});
});

describe('resolveTheme', () => {
	it('prefers a valid stored theme', () => {
		expect(resolveTheme(DARK_THEME, false)).toBe(DARK_THEME);
		expect(resolveTheme(LIGHT_THEME, true)).toBe(LIGHT_THEME);
	});

	it('falls back to the system preference', () => {
		expect(resolveTheme(null, true)).toBe(DARK_THEME);
		expect(resolveTheme('garbage', false)).toBe(LIGHT_THEME);
	});
});

describe('nextTheme', () => {
	it('cycles between the two themes', () => {
		expect(nextTheme(LIGHT_THEME)).toBe(DARK_THEME);
		expect(nextTheme(DARK_THEME)).toBe(LIGHT_THEME);
	});
});

describe('applyTheme', () => {
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	it('sets the data-theme attribute and persists the choice', () => {
		applyTheme(DARK_THEME);
		expect(document.documentElement.getAttribute('data-theme')).toBe(DARK_THEME);
		expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(DARK_THEME);
	});

	it('notifies listeners so embeds can sync', () => {
		const listener = vi.fn();
		window.addEventListener(THEME_CHANGE_EVENT, listener);
		applyTheme(LIGHT_THEME);
		window.removeEventListener(THEME_CHANGE_EVENT, listener);
		expect(listener).toHaveBeenCalledOnce();
		expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ theme: LIGHT_THEME });
	});
});
