export const FONT_SIZE_KEY = 'a11y-font-size';
export const DYSLEXIC_KEY = 'a11y-dyslexic';
export const UNDERLINE_KEY = 'a11y-underline';

export const DYSLEXIC_CLASS = 'dyslexic-font';
export const UNDERLINE_CLASS = 'force-underline';

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

/** Language the page is currently displayed in (Google Translate rewrites
 * the html lang attribute when it translates the page). */
export function pageLanguage(doc: Document): string {
	return doc.documentElement.lang || 'en';
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
