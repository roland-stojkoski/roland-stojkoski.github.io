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
