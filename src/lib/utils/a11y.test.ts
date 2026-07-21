import { describe, expect, it } from 'vitest';
import { isFontSize, pageLanguage, pickVoice } from './a11y';

function voice(lang: string, name = lang): SpeechSynthesisVoice {
	return { lang, name } as SpeechSynthesisVoice;
}

describe('pickVoice', () => {
	const voices = [voice('en-US'), voice('en-GB'), voice('hr-HR'), voice('de-DE')];

	it('prefers an exact BCP-47 match', () => {
		expect(pickVoice(voices, 'en-GB')?.lang).toBe('en-GB');
	});

	it('falls back to a regional variant of the base language', () => {
		expect(pickVoice(voices, 'hr')?.lang).toBe('hr-HR');
	});

	it('matches case-insensitively', () => {
		expect(pickVoice(voices, 'HR-hr')?.lang).toBe('hr-HR');
	});

	it('does not match a different language sharing a prefix', () => {
		expect(pickVoice([voice('deu-XX'), voice('de-DE')], 'de')?.lang).toBe('de-DE');
	});

	it('returns null when no voice matches', () => {
		expect(pickVoice(voices, 'ja')).toBeNull();
	});
});

describe('pageLanguage', () => {
	it('reads the html lang attribute', () => {
		document.documentElement.lang = 'hr';
		expect(pageLanguage(document)).toBe('hr');
	});

	it('defaults to english when lang is empty', () => {
		document.documentElement.removeAttribute('lang');
		expect(pageLanguage(document)).toBe('en');
	});
});

describe('isFontSize', () => {
	it('accepts known sizes and rejects everything else', () => {
		expect(isFontSize('xl')).toBe(true);
		expect(isFontSize('huge')).toBe(false);
		expect(isFontSize(null)).toBe(false);
	});
});
