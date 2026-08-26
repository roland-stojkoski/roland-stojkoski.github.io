import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import {
	COLORBLIND_CLASS,
	COLORBLIND_KEY,
	DYSLEXIC_CLASS,
	DYSLEXIC_KEY,
	FONT_SIZE_KEY,
	FONT_SIZE_OPTIONS,
	UNDERLINE_CLASS,
	UNDERLINE_KEY,
	type FontSizeOption
} from '$lib/utils/a11y';
import AccessibilityMenu from './AccessibilityMenu.svelte';

type User = ReturnType<typeof userEvent.setup>;

const trigger = () => screen.getByRole('button', { name: 'Accessibility Settings' });
const panel = () => screen.getByRole('group', { name: 'Accessibility settings' });

/** What a speech-input user says, followed by what a screen reader needs. */
const sizeName = (option: FontSizeOption) =>
	option.label === option.glyph ? option.glyph : `${option.glyph} ${option.label}`;

const sizeRadio = (option: FontSizeOption) => screen.getByRole('radio', { name: sizeName(option) });

const option = (size: string) => FONT_SIZE_OPTIONS.find((entry) => entry.size === size)!;

// jsdom implements no `inert`, so svelte sets the DOM property and the
// attribute never appears here; the property is what holds in both.
const panelInert = () => (panel() as HTMLElement & { inert?: boolean }).inert;

/** Speech synthesis plus a page worth reading, so the read-aloud button has
 * something to do. Returns the main element for the caller to remove. */
function stubSpeech() {
	const main = document.createElement('main');
	main.id = 'main-content';
	main.textContent = 'Hello there';
	document.body.appendChild(main);
	vi.stubGlobal('speechSynthesis', { speak: vi.fn(), cancel: vi.fn(), getVoices: () => [] });
	vi.stubGlobal(
		'SpeechSynthesisUtterance',
		class {
			lang = '';
			voice: SpeechSynthesisVoice | null = null;
			onend: (() => void) | null = null;
			onerror: (() => void) | null = null;
			constructor(public text: string) {}
		}
	);
	return main;
}

async function openMenu(user: User) {
	await user.click(trigger());
	await tick();
}

describe('AccessibilityMenu', () => {
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.className = '';
		document.documentElement.lang = 'en';
		document.cookie = 'googtrans=; path=/; max-age=0';
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

	describe('colorblind theme', () => {
		it('applies the colorblind class and persists when toggled on', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await user.click(screen.getByLabelText('Colorblind Theme'));
			expect(document.documentElement.classList.contains(COLORBLIND_CLASS)).toBe(true);
			expect(localStorage.getItem(COLORBLIND_KEY)).toBe('true');
			await user.click(screen.getByLabelText('Colorblind Theme'));
			expect(document.documentElement.classList.contains(COLORBLIND_CLASS)).toBe(false);
		});

		it('restores the setting from a previous visit on mount', () => {
			localStorage.setItem(COLORBLIND_KEY, 'true');
			render(AccessibilityMenu);
			expect(screen.getByLabelText('Colorblind Theme')).toBeChecked();
			expect(document.documentElement.classList.contains(COLORBLIND_CLASS)).toBe(true);
		});
	});

	describe('other settings', () => {
		it('applies the selected text size', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await user.click(sizeRadio(option('xl')));
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

	describe('translate site', () => {
		it('renders the language picker natively, independent of google', () => {
			render(AccessibilityMenu);
			const picker = screen.getByLabelText('Translate site') as HTMLSelectElement;
			expect(picker.value).toBe('en');
			const labels = Array.from(picker.options).map((entry) => entry.text);
			expect(labels).toContain('Croatian');
			expect(labels).toContain('Macedonian');
		});

		it('restores the selected language from the googtrans cookie', () => {
			document.cookie = 'googtrans=/en/hr; path=/';
			render(AccessibilityMenu);
			const picker = screen.getByLabelText('Translate site') as HTMLSelectElement;
			expect(picker.value).toBe('hr');
		});

		it('sets the googtrans cookie and drives the hidden google widget', async () => {
			const combo = document.createElement('select');
			combo.className = 'goog-te-combo';
			for (const value of ['', 'hr']) {
				const entry = document.createElement('option');
				entry.value = value;
				combo.appendChild(entry);
			}
			document.body.appendChild(combo);

			const user = userEvent.setup();
			render(AccessibilityMenu);
			await user.selectOptions(screen.getByLabelText('Translate site'), 'hr');

			expect(document.cookie).toContain('googtrans=/en/hr');
			expect(combo.value).toBe('hr');
			combo.remove();
		});

		it('announces the outcome, not the value the select already speaks', async () => {
			const combo = document.createElement('select');
			combo.className = 'goog-te-combo';
			for (const value of ['', 'hr']) {
				const entry = document.createElement('option');
				entry.value = value;
				combo.appendChild(entry);
			}
			document.body.appendChild(combo);

			const user = userEvent.setup();
			render(AccessibilityMenu);
			await user.selectOptions(screen.getByLabelText('Translate site'), 'hr');
			await tick();

			const live = screen.getByRole('status');
			expect(live).toHaveTextContent('Page translated to Croatian');
			expect(live.textContent).not.toContain('Language');
			combo.remove();
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
			await user.click(screen.getByRole('button', { name: 'Read Page Aloud Play' }));

			expect(speak).toHaveBeenCalledOnce();
			const utterance = speak.mock.calls[0][0] as FakeUtterance;
			expect(utterance.lang).toBe('hr');
			expect(utterance.voice?.lang).toBe('hr-HR');
			expect(utterance.text).toContain('Pozdrav svijete');
		});

		it('defaults to english on an untranslated page', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await user.click(screen.getByRole('button', { name: 'Read Page Aloud Play' }));

			const utterance = speak.mock.calls[0][0] as FakeUtterance;
			expect(utterance.lang).toBe('en');
			expect(utterance.voice?.lang).toBe('en-US');
		});
	});

	describe('label in name', () => {
		it('keeps the visible glyph inside every text-size name', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			for (const entry of FONT_SIZE_OPTIONS) {
				// Looking the button up by `${glyph} ${label}` is the assertion:
				// speech input matches the name against what is on screen, so the
				// glyph has to open the name rather than be replaced by it.
				const radio = sizeRadio(entry);
				expect(radio).not.toHaveAttribute('aria-label');
				expect(radio.querySelector('[aria-hidden="true"]')?.textContent).toBe(entry.glyph);
			}
		});

		it('keeps the visible play/stop word inside the read-aloud name', async () => {
			const main = stubSpeech();

			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			const play = screen.getByRole('button', { name: 'Read Page Aloud Play' });
			await user.click(play);
			await tick();

			expect(screen.getByRole('button', { name: 'Read Page Aloud Stop' })).toBe(play);

			main.remove();
			vi.unstubAllGlobals();
		});

		it('hides the decorative heading and the duplicated row caption from the reading order', () => {
			render(AccessibilityMenu);
			expect(screen.queryByRole('heading', { name: /accessibility/i })).toBeNull();
			expect(screen.getByText('// accessibility')).toHaveAttribute('aria-hidden', 'true');
			expect(screen.getByText('Read Page Aloud')).toHaveAttribute('aria-hidden', 'true');
		});
	});

	describe('keyboard and assistive technology access', () => {
		it('keeps the closed panel out of the tab order and the a11y tree', () => {
			render(AccessibilityMenu);
			expect(panelInert()).toBe(true);
			expect(trigger()).toHaveAttribute('aria-expanded', 'false');
			expect(trigger().getAttribute('aria-controls')).toBe(panel().id);
		});

		it('is a disclosure, not a modal: no dialog role and no popup promise', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			expect(screen.queryByRole('dialog')).toBeNull();
			expect(trigger()).not.toHaveAttribute('aria-haspopup');
			// The panel follows the trigger, so tab order walks straight in.
			expect(trigger().compareDocumentPosition(panel())).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
		});

		it('opens from the keyboard and leaves focus on the trigger', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			trigger().focus();
			await user.keyboard('{Enter}');
			await tick();

			expect(trigger()).toHaveAttribute('aria-expanded', 'true');
			expect(panelInert()).toBe(false);
			expect(document.activeElement).toBe(trigger());
		});

		it('closes on escape and returns focus to the trigger', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);
			// Opening by click already leaves focus on the trigger, so the
			// restoration only means anything from somewhere else in the panel.
			screen.getByRole('button', { name: 'Close' }).focus();

			await user.keyboard('{Escape}');
			await tick();

			expect(trigger()).toHaveAttribute('aria-expanded', 'false');
			expect(panelInert()).toBe(true);
			expect(document.activeElement).toBe(trigger());
		});

		it('closes on escape pressed from a control inside the panel', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);
			screen.getByLabelText('Dyslexia Font').focus();

			await user.keyboard('{Escape}');
			await tick();

			expect(trigger()).toHaveAttribute('aria-expanded', 'false');
			expect(document.activeElement).toBe(trigger());
		});

		it('leaves the panel open when escape dismisses an open language popup', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			const picker = screen.getByLabelText('Translate site');
			await fireEvent.mouseDown(picker);
			// Firefox reports the select's own escape to the page too.
			await fireEvent.keyDown(picker, { key: 'Escape' });
			await tick();

			expect(trigger()).toHaveAttribute('aria-expanded', 'true');
			expect(panelInert()).toBe(false);
		});

		it('still closes on escape from the language picker with no popup open', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);
			const picker = screen.getByLabelText('Translate site');
			picker.focus();

			await fireEvent.keyDown(picker, { key: 'Escape' });
			await tick();

			expect(trigger()).toHaveAttribute('aria-expanded', 'false');
			expect(panelInert()).toBe(true);
		});

		it('spends the popup guard on one escape, so the next one closes the panel', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			const picker = screen.getByLabelText('Translate site');
			await fireEvent.keyDown(picker, { key: 'ArrowDown', altKey: true });
			await fireEvent.keyDown(picker, { key: 'Escape' });
			await tick();
			expect(trigger()).toHaveAttribute('aria-expanded', 'true');

			await fireEvent.keyDown(picker, { key: 'Escape' });
			await tick();
			expect(trigger()).toHaveAttribute('aria-expanded', 'false');
		});

		it('drops the popup guard once the picker is left or a language chosen', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			const picker = screen.getByLabelText('Translate site');
			await fireEvent.mouseDown(picker);
			await fireEvent.blur(picker);
			await fireEvent.keyDown(picker, { key: 'Escape' });
			await tick();

			expect(trigger()).toHaveAttribute('aria-expanded', 'false');
		});

		it('ignores an escape another handler already consumed', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			window.addEventListener('keydown', (event) => event.preventDefault(), {
				capture: true,
				once: true
			});
			await user.keyboard('{Escape}');
			await tick();

			expect(trigger()).toHaveAttribute('aria-expanded', 'true');
		});

		it('offers a close control as the last stop in the panel', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			const close = screen.getByRole('button', { name: 'Close' });
			expect(panel().contains(close)).toBe(true);

			const stops = Array.from(
				panel().querySelectorAll<HTMLElement>('a[href], button, input, select, textarea')
			).filter((el) => el.tabIndex >= 0 && !el.closest('[aria-hidden="true"]'));
			expect(stops[stops.length - 1]).toBe(close);

			await user.click(close);
			await tick();
			expect(trigger()).toHaveAttribute('aria-expanded', 'false');
			expect(document.activeElement).toBe(trigger());
		});

		it('closes when focus leaves the panel altogether', async () => {
			const outside = document.createElement('button');
			document.body.appendChild(outside);

			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			await fireEvent.focusOut(panel(), { relatedTarget: outside });
			await tick();
			expect(trigger()).toHaveAttribute('aria-expanded', 'false');

			outside.remove();
		});

		it('stays open while focus moves between its own controls', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			await fireEvent.focusOut(panel(), {
				relatedTarget: screen.getByLabelText('Underline Links')
			});
			await tick();
			expect(trigger()).toHaveAttribute('aria-expanded', 'true');

			// A blur with nowhere to go (window switch) is not a departure.
			await fireEvent.focusOut(panel(), { relatedTarget: null });
			await tick();
			expect(trigger()).toHaveAttribute('aria-expanded', 'true');
		});

		it('hands focus back to the trigger after an outside click on plain text', async () => {
			const outside = document.createElement('p');
			outside.textContent = 'somewhere else';
			document.body.appendChild(outside);

			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);
			screen.getByLabelText('Dyslexia Font').focus();

			await user.click(outside);
			await tick();
			// The browser blurs to <body> after the pointerdown listener has run,
			// so a restore that does not outlast it leaves focus nowhere.
			await new Promise((resolve) => setTimeout(resolve));

			expect(trigger()).toHaveAttribute('aria-expanded', 'false');
			expect(document.activeElement).toBe(trigger());

			outside.remove();
		});

		it('leaves focus on whatever the outside click gave it to', async () => {
			const outside = document.createElement('button');
			document.body.appendChild(outside);

			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);
			screen.getByLabelText('Dyslexia Font').focus();

			await user.click(outside);
			await tick();
			await new Promise((resolve) => setTimeout(resolve));

			expect(document.activeElement).toBe(outside);

			outside.remove();
		});

		it('has no backdrop button in the tab order but still closes on an outside click', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			expect(screen.queryByRole('button', { name: /close accessibility settings/i })).toBeNull();

			await user.click(document.body);
			await tick();
			expect(trigger()).toHaveAttribute('aria-expanded', 'false');
		});

		it('exposes the selected text size as a labelled radio group', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			expect(screen.getByRole('radiogroup', { name: 'Text Size' })).toBeInTheDocument();
			const normal = sizeRadio(option('normal'));
			const large = sizeRadio(option('large'));
			expect(normal).toHaveAttribute('aria-checked', 'true');
			expect(large).toHaveAttribute('aria-checked', 'false');

			await user.click(large);
			await tick();

			expect(large).toHaveAttribute('aria-checked', 'true');
			expect(normal).toHaveAttribute('aria-checked', 'false');
			expect(large.tabIndex).toBe(0);
			expect(normal.tabIndex).toBe(-1);
		});

		it('moves through the text size group with arrow keys, wrapping at the ends', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);
			await user.click(sizeRadio(option('normal')));
			await tick();

			await user.keyboard('{ArrowRight}');
			await tick();
			expect(sizeRadio(option('large'))).toHaveAttribute('aria-checked', 'true');
			expect(document.activeElement).toBe(sizeRadio(option('large')));
			expect(document.documentElement.classList.contains('text-lg')).toBe(true);

			await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
			await tick();
			expect(sizeRadio(option('xl'))).toHaveAttribute('aria-checked', 'true');
			expect(document.documentElement.classList.contains('text-xl')).toBe(true);
		});

		it('exposes the read-aloud pressed state', async () => {
			const main = stubSpeech();

			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			const button = screen.getByRole('button', { name: 'Read Page Aloud Play' });
			expect(button).toHaveAttribute('aria-pressed', 'false');

			await user.click(button);
			await tick();
			expect(button).toHaveAttribute('aria-pressed', 'true');
			expect(button).toHaveTextContent('Stop');

			await user.click(button);
			await tick();
			expect(button).toHaveAttribute('aria-pressed', 'false');
			expect(button).toHaveTextContent('Play');

			main.remove();
			vi.unstubAllGlobals();
		});

		it('announces speech only when the button did not take focus', async () => {
			const main = stubSpeech();

			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			const live = screen.getByRole('status');
			expect(live).toHaveAttribute('aria-live', 'polite');

			// Safari does not focus a button on click, and voice control leaves
			// focus wherever it was; nothing then speaks the change but this.
			const play = screen.getByRole('button', { name: 'Read Page Aloud Play' });
			await fireEvent.click(play);
			await tick();
			expect(live).toHaveTextContent('Reading the page aloud');

			await fireEvent.click(screen.getByRole('button', { name: 'Read Page Aloud Stop' }));
			await tick();
			expect(live).toHaveTextContent('Stopped reading the page');

			main.remove();
			vi.unstubAllGlobals();
		});

		it('stays quiet when the pressed button is the one announcing itself', async () => {
			const main = stubSpeech();

			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);
			const live = screen.getByRole('status');

			// A click that focuses the button: aria-pressed and the Play -> Stop
			// name change are both spoken already, so a third utterance is noise.
			await user.click(screen.getByRole('button', { name: 'Read Page Aloud Play' }));
			await tick();
			expect(live.textContent).toBe('');

			await user.click(screen.getByRole('button', { name: 'Read Page Aloud Stop' }));
			await tick();
			expect(live.textContent).toBe('');

			main.remove();
			vi.unstubAllGlobals();
		});

		it('stays quiet for controls that report their own state', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);
			const live = screen.getByRole('status');

			await user.click(screen.getByLabelText('Dyslexia Font'));
			await tick();
			expect(live.textContent).toBe('');

			await user.click(screen.getByLabelText('Colorblind Theme'));
			await tick();
			expect(live.textContent).toBe('');

			await user.click(sizeRadio(option('large')));
			await tick();
			expect(live.textContent).toBe('');
		});

		it('keeps toggle state in sync with the checkbox the user actually flipped', async () => {
			const user = userEvent.setup();
			render(AccessibilityMenu);
			await openMenu(user);

			const toggle = screen.getByLabelText('Underline Links') as HTMLInputElement;
			toggle.checked = true;
			await fireEvent.change(toggle);
			await tick();
			expect(document.documentElement.classList.contains(UNDERLINE_CLASS)).toBe(true);

			// A change event whose checkbox reports no flip: reading the element
			// leaves the setting alone, flipping a local boolean would undo it.
			toggle.checked = true;
			await fireEvent.change(toggle);
			await tick();
			expect(toggle.checked).toBe(true);
			expect(document.documentElement.classList.contains(UNDERLINE_CLASS)).toBe(true);

			toggle.checked = false;
			await fireEvent.change(toggle);
			await tick();
			expect(document.documentElement.classList.contains(UNDERLINE_CLASS)).toBe(false);
		});

		it('gives each instance ids its labels actually resolve to', () => {
			render(AccessibilityMenu);
			render(AccessibilityMenu);

			const toggles = screen.getAllByLabelText('Dyslexia Font') as HTMLInputElement[];
			expect(toggles).toHaveLength(2);
			expect(toggles[0].id).toBeTruthy();
			expect(toggles[0].id).not.toBe(toggles[1].id);

			// Every id in either instance, not just the ones a query happens to
			// reach: a duplicate anywhere sends getElementById to the wrong copy.
			const ids = Array.from(document.querySelectorAll<HTMLElement>('[id]')).map((el) => el.id);
			expect(ids.length).toBeGreaterThan(2);
			expect(new Set(ids).size).toBe(ids.length);
		});
	});
});
