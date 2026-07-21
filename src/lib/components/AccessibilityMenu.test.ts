import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import {
	DYSLEXIC_CLASS,
	DYSLEXIC_KEY,
	FONT_SIZE_KEY,
	UNDERLINE_CLASS,
	UNDERLINE_KEY
} from '$lib/utils/a11y';
import AccessibilityMenu from './AccessibilityMenu.svelte';

describe('AccessibilityMenu', () => {
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.className = '';
		document.documentElement.lang = 'en';
		document.getElementById('google-translate-script')?.remove();
	});

	describe('dyslexia font', () => {
		it('applies the font class and persists when toggled on', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await user.click(screen.getByLabelText('Dyslexia Font'));
			expect(document.documentElement.classList.contains(DYSLEXIC_CLASS)).toBe(true);
			expect(localStorage.getItem(DYSLEXIC_KEY)).toBe('true');
		});

		it('removes the font class when toggled back off', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await user.click(screen.getByLabelText('Dyslexia Font'));
			await user.click(screen.getByLabelText('Dyslexia Font'));
			expect(document.documentElement.classList.contains(DYSLEXIC_CLASS)).toBe(false);
			expect(localStorage.getItem(DYSLEXIC_KEY)).toBe('false');
		});

		it('restores the setting from a previous visit on mount', () => {
			localStorage.setItem(DYSLEXIC_KEY, 'true');
			render(AccessibilityMenu);
			expect(screen.getByLabelText('Dyslexia Font')).toBeChecked();
			expect(document.documentElement.classList.contains(DYSLEXIC_CLASS)).toBe(true);
		});
	});

	describe('other settings', () => {
		it('applies the selected text size', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await user.click(screen.getByRole('button', { name: 'A++' }));
			expect(document.documentElement.classList.contains('text-xl')).toBe(true);
			expect(localStorage.getItem(FONT_SIZE_KEY)).toBe('xl');
		});

		it('falls back to normal size on an invalid stored value', () => {
			localStorage.setItem(FONT_SIZE_KEY, 'gigantic');
			render(AccessibilityMenu);
			expect(document.documentElement.classList.contains('text-base')).toBe(true);
		});

		it('toggles link underlining', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await user.click(screen.getByLabelText('Underline Links'));
			expect(document.documentElement.classList.contains(UNDERLINE_CLASS)).toBe(true);
			expect(localStorage.getItem(UNDERLINE_KEY)).toBe('true');
		});
	});

	describe('read page aloud', () => {
		let speak: Mock;
		let mainContent: HTMLElement;

		class FakeUtterance {
			text: string;
			lang = '';
			voice: SpeechSynthesisVoice | null = null;
			onend: (() => void) | null = null;
			onerror: (() => void) | null = null;
			constructor(text: string) {
				this.text = text;
			}
		}

		const voices = [
			{ lang: 'en-US', name: 'English (US)' },
			{ lang: 'hr-HR', name: 'Croatian' }
		] as SpeechSynthesisVoice[];

		beforeEach(() => {
			mainContent = document.createElement('main');
			mainContent.id = 'main-content';
			mainContent.textContent = 'Pozdrav svijete';
			document.body.appendChild(mainContent);

			speak = vi.fn();
			vi.stubGlobal('speechSynthesis', { speak, cancel: vi.fn(), getVoices: () => voices });
			vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
		});

		afterEach(() => {
			mainContent.remove();
			vi.unstubAllGlobals();
		});

		it('speaks with the matching voice when the page is translated', async () => {
			document.documentElement.lang = 'hr';
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await user.click(screen.getByRole('button', { name: 'Read Page Aloud' }));

			expect(speak).toHaveBeenCalledOnce();
			const utterance = speak.mock.calls[0][0] as FakeUtterance;
			expect(utterance.lang).toBe('hr');
			expect(utterance.voice?.lang).toBe('hr-HR');
			expect(utterance.text).toContain('Pozdrav svijete');
		});

		it('defaults to english on an untranslated page', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await user.click(screen.getByRole('button', { name: 'Read Page Aloud' }));

			const utterance = speak.mock.calls[0][0] as FakeUtterance;
			expect(utterance.lang).toBe('en');
			expect(utterance.voice?.lang).toBe('en-US');
		});
	});
});
