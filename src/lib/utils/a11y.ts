export const FONT_SIZE_KEY = 'a11y-font-size';
export const DYSLEXIC_KEY = 'a11y-dyslexic';
export const UNDERLINE_KEY = 'a11y-underline';
export const COLORBLIND_KEY = 'a11y-colorblind';

export const DYSLEXIC_CLASS = 'dyslexic-font';
export const UNDERLINE_CLASS = 'force-underline';
export const COLORBLIND_CLASS = 'colorblind';

export type FontSize = 'small' | 'normal' | 'large' | 'xl';

export const FONT_SIZE_CLASSES: Record<FontSize, string> = {
	small: 'text-sm',
	normal: 'text-base',
	large: 'text-lg',
	xl: 'text-xl'
};

export function isFontSize(value: unknown): value is FontSize {
	return typeof value === 'string' && value in FONT_SIZE_CLASSES;
}

export interface FontSizeOption {
	size: FontSize;
	/** Compact caption shown on the button. */
	glyph: string;
	/** Spoken name — "A++" is read out as letters and punctuation. */
	label: string;
}

/** Text-size choices in the order they appear, which is also the order
 * arrow keys walk through the radio group. */
export const FONT_SIZE_OPTIONS: readonly FontSizeOption[] = [
	{ size: 'small', glyph: 'A-', label: 'Small' },
	{ size: 'normal', glyph: 'Normal', label: 'Normal' },
	{ size: 'large', glyph: 'A+', label: 'Large' },
	{ size: 'xl', glyph: 'A++', label: 'Extra large' }
];

/** Index an arrow/Home/End key moves to inside a radio group of `length`
 * items, wrapping at both ends; null when the key is not a navigation key. */
export function rovingIndex(key: string, current: number, length: number): number | null {
	if (length <= 0) return null;
	switch (key) {
		case 'ArrowRight':
		case 'ArrowDown':
			return (current + 1) % length;
		case 'ArrowLeft':
		case 'ArrowUp':
			return (current - 1 + length) % length;
		case 'Home':
			return 0;
		case 'End':
			return length - 1;
		default:
			return null;
	}
}

/** Next text for a polite live region. A zero-width marker alternates on and
 * off the end so that repeating the same message still changes the node's
 * text, which is what makes a screen reader speak it again. */
export function announceText(previous: string, message: string): string {
	const mark = '\u200b';
	return previous.endsWith(mark) ? message : message + mark;
}

export interface TranslateLanguage {
	code: string;
	label: string;
}

/** Languages offered by the site translator (Google Translate target codes). */
export const TRANSLATE_LANGUAGES: TranslateLanguage[] = [
	{ code: 'en', label: 'English (original)' },
	{ code: 'hr', label: 'Croatian' },
	{ code: 'mk', label: 'Macedonian' },
	{ code: 'ga', label: 'Irish' },
	{ code: 'de', label: 'German' },
	{ code: 'es', label: 'Spanish' },
	{ code: 'fr', label: 'French' },
	{ code: 'it', label: 'Italian' },
	{ code: 'pt', label: 'Portuguese' },
	{ code: 'nl', label: 'Dutch' },
	{ code: 'pl', label: 'Polish' },
	{ code: 'uk', label: 'Ukrainian' },
	{ code: 'tr', label: 'Turkish' },
	{ code: 'ar', label: 'Arabic' },
	{ code: 'hi', label: 'Hindi' },
	{ code: 'zh-CN', label: 'Chinese (Simplified)' },
	{ code: 'ja', label: 'Japanese' },
	{ code: 'ko', label: 'Korean' }
];

/** Target language from Google Translate's googtrans cookie ('' if unset). */
export function googtransTarget(cookies: string): string {
	const match = cookies.match(/(?:^|;\s*)googtrans=([^;]*)/);
	return match ? (decodeURIComponent(match[1]).split('/')[2] ?? '') : '';
}

/** Language the page is displayed in: the html lang attribute (rewritten by
 * Google Translate once a translation applies), falling back to the
 * googtrans cookie so a just-selected language is honored too. */
export function pageLanguage(doc: Document): string {
	const lang = doc.documentElement.lang;
	if (lang && lang.toLowerCase() !== 'en') return lang;
	return googtransTarget(doc.cookie) || lang || 'en';
}

/** Best available speech-synthesis voice for a language: exact BCP-47 match
 * first, then any regional variant of the same base language. */
export function pickVoice(
	voices: readonly SpeechSynthesisVoice[],
	lang: string
): SpeechSynthesisVoice | null {
	const target = lang.toLowerCase();
	const base = target.split('-')[0];
	return (
		voices.find((v) => v.lang.toLowerCase() === target) ??
		voices.find((v) => v.lang.toLowerCase().split('-')[0] === base) ??
		null
	);
}

/** Accessible name of a text-size button: the visible glyph first so speech
 * input can match what is on screen (WCAG 2.5.3), then the spoken word for
 * anyone who would otherwise hear "A plus plus". */
export function spokenName(option: FontSizeOption): string {
	return option.label === option.glyph ? option.glyph : `${option.glyph} ${option.label}`;
}

/** Does this keydown open a native `<select>` popup? Alt+Arrow and F4 do
 * wherever a popup exists; Enter and Space only on some platforms, and they
 * count here because guessing "open" wrongly costs one Escape keystroke while
 * missing a real open costs the user the whole panel. */
export function opensSelectPopup(event: Pick<KeyboardEvent, 'key' | 'altKey'>): boolean {
	if (event.key === 'F4') return true;
	if (event.altKey) return event.key === 'ArrowDown' || event.key === 'ArrowUp';
	return event.key === 'Enter' || event.key === ' ';
}
