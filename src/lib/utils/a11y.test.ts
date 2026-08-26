import { beforeEach, describe, expect, it } from 'vitest';
import {
	FONT_SIZE_CLASSES,
	FONT_SIZE_OPTIONS,
	announceText,
	googtransTarget,
	isFontSize,
	opensSelectPopup,
	pageLanguage,
	pickVoice,
	rovingIndex,
	spokenName
} from './a11y';

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

describe('googtransTarget', () => {
	it('extracts the target language', () => {
		expect(googtransTarget('googtrans=/en/hr')).toBe('hr');
		expect(googtransTarget('a=b; googtrans=%2Fen%2Fde; c=d')).toBe('de');
	});

	it('returns empty when unset or malformed', () => {
		expect(googtransTarget('')).toBe('');
		expect(googtransTarget('googtrans=nonsense')).toBe('');
	});
});

describe('pageLanguage', () => {
	beforeEach(() => {
		document.cookie = 'googtrans=; path=/; max-age=0';
	});

	it('reads the html lang attribute', () => {
		document.documentElement.lang = 'hr';
		expect(pageLanguage(document)).toBe('hr');
	});

	it('falls back to the googtrans cookie before the page re-renders', () => {
		document.documentElement.lang = 'en';
		document.cookie = 'googtrans=/en/hr; path=/';
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

describe('FONT_SIZE_OPTIONS', () => {
	it('covers every font size exactly once', () => {
		const sizes = FONT_SIZE_OPTIONS.map((option) => option.size);
		expect(sizes).toEqual(Object.keys(FONT_SIZE_CLASSES));
	});

	it('gives every option a pronounceable label, unambiguous across the group', () => {
		for (const option of FONT_SIZE_OPTIONS) {
			expect(option.label).toMatch(/^[A-Za-z ]+$/);
		}
		const labels = FONT_SIZE_OPTIONS.map((option) => option.label);
		expect(new Set(labels).size).toBe(labels.length);
	});
});

describe('spokenName', () => {
	it('keeps the visible glyph inside every accessible name (WCAG 2.5.3)', () => {
		for (const option of FONT_SIZE_OPTIONS) {
			expect(spokenName(option)).toContain(option.glyph);
		}
	});

	it('appends the spoken word only when it adds something', () => {
		expect(spokenName({ size: 'large', glyph: 'A+', label: 'Large' })).toBe('A+ Large');
		expect(spokenName({ size: 'normal', glyph: 'Normal', label: 'Normal' })).toBe('Normal');
	});
});

describe('opensSelectPopup', () => {
	it('recognises the keys that drop a native select open', () => {
		expect(opensSelectPopup({ key: 'ArrowDown', altKey: true })).toBe(true);
		expect(opensSelectPopup({ key: 'ArrowUp', altKey: true })).toBe(true);
		expect(opensSelectPopup({ key: 'F4', altKey: false })).toBe(true);
		// Platform-dependent, counted in: a wrong guess costs one Escape.
		expect(opensSelectPopup({ key: 'Enter', altKey: false })).toBe(true);
		expect(opensSelectPopup({ key: ' ', altKey: false })).toBe(true);
	});

	it('leaves plain navigation and escape alone', () => {
		expect(opensSelectPopup({ key: 'ArrowDown', altKey: false })).toBe(false);
		expect(opensSelectPopup({ key: 'Escape', altKey: false })).toBe(false);
		expect(opensSelectPopup({ key: 'Tab', altKey: false })).toBe(false);
		expect(opensSelectPopup({ key: 'Enter', altKey: true })).toBe(false);
	});
});

describe('announceText', () => {
	it('changes the text when the same message repeats, so it is spoken again', () => {
		const first = announceText('', 'Reading the page aloud');
		const second = announceText(first, 'Reading the page aloud');
		const third = announceText(second, 'Reading the page aloud');

		expect(second).not.toBe(first);
		expect(third).not.toBe(second);
		for (const text of [first, second, third]) {
			expect(text.replace(/\u200b/g, '')).toBe('Reading the page aloud');
		}
	});

	it('carries nothing but the message and its marker', () => {
		expect(announceText('', 'Stopped reading the page').replace(/\u200b/g, '')).toBe(
			'Stopped reading the page'
		);
		expect(announceText('Reading the page aloud\u200b', 'Stopped reading the page')).toBe(
			'Stopped reading the page'
		);
	});
});

describe('rovingIndex', () => {
	it('steps forward and wraps past the end', () => {
		expect(rovingIndex('ArrowRight', 0, 4)).toBe(1);
		expect(rovingIndex('ArrowDown', 1, 4)).toBe(2);
		expect(rovingIndex('ArrowRight', 3, 4)).toBe(0);
	});

	it('steps back and wraps past the start', () => {
		expect(rovingIndex('ArrowLeft', 2, 4)).toBe(1);
		expect(rovingIndex('ArrowUp', 1, 4)).toBe(0);
		expect(rovingIndex('ArrowLeft', 0, 4)).toBe(3);
	});

	it('jumps to the ends with home and end', () => {
		expect(rovingIndex('Home', 2, 4)).toBe(0);
		expect(rovingIndex('End', 2, 4)).toBe(3);
	});

	it('ignores keys that are not group navigation', () => {
		expect(rovingIndex('Tab', 1, 4)).toBeNull();
		expect(rovingIndex('Enter', 1, 4)).toBeNull();
		expect(rovingIndex(' ', 1, 4)).toBeNull();
		expect(rovingIndex('Escape', 1, 4)).toBeNull();
	});

	it('returns null for an empty group', () => {
		expect(rovingIndex('ArrowRight', 0, 0)).toBeNull();
	});
});
