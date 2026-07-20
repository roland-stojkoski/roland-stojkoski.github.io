export const LIGHT_THEME = 'latte';
export const DARK_THEME = 'espresso';
export const THEME_STORAGE_KEY = 'theme';
export const THEME_CHANGE_EVENT = 'rs:themechange';

export type Theme = typeof LIGHT_THEME | typeof DARK_THEME;

export function isTheme(value: unknown): value is Theme {
	return value === LIGHT_THEME || value === DARK_THEME;
}

export function resolveTheme(stored: unknown, prefersDark: boolean): Theme {
	if (isTheme(stored)) return stored;
	return prefersDark ? DARK_THEME : LIGHT_THEME;
}

export function nextTheme(current: Theme): Theme {
	return current === DARK_THEME ? LIGHT_THEME : DARK_THEME;
}

export function applyTheme(theme: Theme): void {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem(THEME_STORAGE_KEY, theme);
	window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));
}

export function currentTheme(): Theme {
	return resolveTheme(
		document.documentElement.getAttribute('data-theme'),
		window.matchMedia('(prefers-color-scheme: dark)').matches
	);
}
