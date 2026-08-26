<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import {
		COLORBLIND_CLASS,
		COLORBLIND_KEY,
		DYSLEXIC_CLASS,
		DYSLEXIC_KEY,
		FONT_SIZE_CLASSES,
		FONT_SIZE_KEY,
		FONT_SIZE_OPTIONS,
		TRANSLATE_LANGUAGES,
		UNDERLINE_CLASS,
		UNDERLINE_KEY,
		announceText,
		googtransTarget,
		isFontSize,
		opensSelectPopup,
		pageLanguage,
		pickVoice,
		rovingIndex,
		spokenName,
		type FontSize
	} from '$lib/utils/a11y';

	const uid = $props.id();
	const panelId = `a11y-panel-${uid}`;
	const sizeLabelId = `a11y-size-label-${uid}`;
	const ttsLabelId = `a11y-tts-label-${uid}`;
	const ttsButtonId = `a11y-tts-button-${uid}`;
	const dyslexicId = `a11y-dyslexic-${uid}`;
	const underlineId = `a11y-underline-${uid}`;
	const colorblindId = `a11y-colorblind-${uid}`;
	const translateId = `a11y-translate-${uid}`;
	const translateWidgetId = `google-translate-element-${uid}`;

	let isOpen = $state(false);
	let fontSize = $state<FontSize>('normal');
	let dyslexicFont = $state(false);
	let underlineLinks = $state(false);
	let colorblindMode = $state(false);
	let isSpeaking = $state(false);
	let translateLang = $state('en');
	let status = $state('');

	let triggerEl = $state<HTMLButtonElement | null>(null);
	let panelEl = $state<HTMLDivElement | null>(null);
	let ttsButtonEl = $state<HTMLButtonElement | null>(null);
	let selectPopupOpen = false;

	onMount(() => {
		const stored = localStorage.getItem(FONT_SIZE_KEY);
		fontSize = isFontSize(stored) ? stored : 'normal';
		dyslexicFont = localStorage.getItem(DYSLEXIC_KEY) === 'true';
		underlineLinks = localStorage.getItem(UNDERLINE_KEY) === 'true';
		colorblindMode = localStorage.getItem(COLORBLIND_KEY) === 'true';
		translateLang = googtransTarget(document.cookie) || 'en';
		applySettings();

		// Chrome populates the voice list lazily; requesting it early makes
		// voices available by the time the user hits play.
		window.speechSynthesis?.getVoices();

		setupTranslate();

		return () => {
			window.speechSynthesis?.cancel();
		};
	});

	function setupTranslate() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const win = window as any;

		// element.js defines a TranslateElement stub before the engine has
		// fully loaded; InlineLayout appearing is the reliable ready signal.
		const ready = () => !!win.google?.translate?.TranslateElement?.InlineLayout;
		const init = (): boolean => {
			if (!ready()) return false;
			const container = document.getElementById(translateWidgetId);
			if (!container) return false;
			container.innerHTML = '';
			new win.google.translate.TranslateElement(
				{ pageLanguage: 'en', autoDisplay: false },
				translateWidgetId
			);
			return true;
		};

		win.googleTranslateElementInit = init;

		const scriptId = 'google-translate-script';
		if (!document.getElementById(scriptId)) {
			const script = document.createElement('script');
			script.id = scriptId;
			script.src =
				'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
			script.async = true;
			document.body.appendChild(script);
		}

		// Polling fallback: covers remounts after client-side navigation,
		// where the cb= callback never fires again.
		if (!init()) {
			let attempts = 0;
			const interval = setInterval(() => {
				if (init() || ++attempts > 50) clearInterval(interval);
			}, 100);
		}
	}

	function setGoogtransCookie(lang: string) {
		const clear = lang === 'en';
		const value = clear ? '' : `/en/${lang}`;
		const expiry = clear ? '; max-age=0' : '';
		document.cookie = `googtrans=${value}; path=/${expiry}`;
		document.cookie = `googtrans=${value}; domain=${location.hostname}; path=/${expiry}`;
	}

	function changeTranslation(event: Event) {
		const lang = (event.currentTarget as HTMLSelectElement).value;
		selectPopupOpen = false;
		translateLang = lang;
		setGoogtransCookie(lang);

		// Drive the hidden widget's combo directly when it is up; otherwise
		// (engine still loading, or back to english) reload — the engine
		// applies the googtrans cookie on init.
		const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
		if (combo && lang !== 'en') {
			combo.value = lang;
			combo.dispatchEvent(new Event('change'));
			// The select speaks its own new value; what nothing reports is that
			// the page text underneath has been swapped out.
			announce(
				`Page translated to ${TRANSLATE_LANGUAGES.find((entry) => entry.code === lang)?.label ?? lang}`
			);
		} else {
			location.reload();
		}
	}

	function applySettings() {
		const html = document.documentElement;

		html.classList.remove(...Object.values(FONT_SIZE_CLASSES));
		html.classList.add(FONT_SIZE_CLASSES[fontSize]);
		html.classList.toggle(DYSLEXIC_CLASS, dyslexicFont);
		html.classList.toggle(UNDERLINE_CLASS, underlineLinks);
		html.classList.toggle(COLORBLIND_CLASS, colorblindMode);

		localStorage.setItem(FONT_SIZE_KEY, fontSize);
		localStorage.setItem(DYSLEXIC_KEY, String(dyslexicFont));
		localStorage.setItem(UNDERLINE_KEY, String(underlineLinks));
		localStorage.setItem(COLORBLIND_KEY, String(colorblindMode));
	}

	/** Speaks a change that no focused control reports by itself. A checkbox
	 * or radio already announces its own new state, and repeating it here is
	 * heard twice by exactly the people this panel is for. */
	function announce(message: string) {
		status = announceText(status, message);
	}

	/** Speaks a read-aloud change only on activation paths that leave focus
	 * elsewhere — Safari's click, Voice Control, Dragon. With focus on the
	 * button, aria-pressed and the Play/Stop name change are both announced
	 * already, and a third utterance is the double-speak this panel avoids. */
	function announceUnfocused(message: string) {
		if (document.activeElement !== ttsButtonEl) announce(message);
	}

	function changeFontSize(size: FontSize) {
		fontSize = size;
		applySettings();
	}

	function handleSizeKeydown(event: KeyboardEvent, index: number) {
		const next = rovingIndex(event.key, index, FONT_SIZE_OPTIONS.length);
		if (next === null) return;
		event.preventDefault();
		changeFontSize(FONT_SIZE_OPTIONS[next].size);
		const group = (event.currentTarget as HTMLElement).parentElement;
		group?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
	}

	function toggleDyslexic(event: Event) {
		dyslexicFont = (event.currentTarget as HTMLInputElement).checked;
		applySettings();
	}

	function toggleUnderline(event: Event) {
		underlineLinks = (event.currentTarget as HTMLInputElement).checked;
		applySettings();
	}

	function toggleColorblind(event: Event) {
		colorblindMode = (event.currentTarget as HTMLInputElement).checked;
		applySettings();
	}

	function toggleSpeech() {
		if (typeof window === 'undefined' || !window.speechSynthesis) return;

		if (isSpeaking) {
			window.speechSynthesis.cancel();
			isSpeaking = false;
			announceUnfocused('Stopped reading the page');
			return;
		}

		const mainContent = document.getElementById('main-content');
		if (!mainContent) return;

		const text = mainContent.innerText || mainContent.textContent || '';
		const utterance = new SpeechSynthesisUtterance(text);

		// Follow the page language so a translated page is read with a
		// matching voice instead of the English default.
		const lang = pageLanguage(document);
		utterance.lang = lang;
		const voice = pickVoice(window.speechSynthesis.getVoices(), lang);
		if (voice) utterance.voice = voice;

		utterance.onend = () => {
			isSpeaking = false;
		};
		utterance.onerror = () => {
			isSpeaking = false;
		};

		isSpeaking = true;
		announceUnfocused('Reading the page aloud');
		window.speechSynthesis.speak(utterance);
	}

	function toggleMenu() {
		if (isOpen) closeMenu();
		else isOpen = true;
	}

	function closeMenu(restoreFocus = true) {
		if (!isOpen) return;
		isOpen = false;
		if (restoreFocus) triggerEl?.focus();
	}

	function focusIsInside() {
		const active = document.activeElement;
		return !!active && (!!triggerEl?.contains(active) || !!panelEl?.contains(active));
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (!isOpen || event.key !== 'Escape' || event.defaultPrevented) return;

		// Firefox delivers the Escape that dismisses an open <select> popup to
		// the page as well, so an unguarded handler tears the panel down while
		// the user is only backing out of the language list. The guard is
		// therefore narrowed to a popup we saw being opened — the alternative,
		// swallowing every Escape aimed at the select, kills the dismissal
		// gesture for anyone who merely tabbed onto the language picker.
		//
		// No browser reports a popup closing, so the flag is cleared as it is
		// spent: where the popup's own Escape never reaches us (Chrome, Safari)
		// the flag is stale and costs one extra keypress, never the gesture.
		if (selectPopupOpen && (event.target as HTMLElement | null)?.tagName === 'SELECT') {
			selectPopupOpen = false;
			return;
		}

		closeMenu(focusIsInside());
	}

	function handleWindowPointerdown(event: Event) {
		if (!isOpen) return;
		const target = event.target as Node | null;
		if (!target) return;
		if (triggerEl?.contains(target) || panelEl?.contains(target)) return;

		// A pointer dismissal should not yank focus away from wherever the
		// user just clicked; only reclaim it if it was inside the panel, which
		// is about to go inert underneath it.
		const active = document.activeElement;
		const wasInside = !!active && !!panelEl?.contains(active);
		closeMenu(false);
		if (!wasInside) return;

		// The browser's own mousedown focus handling runs after this listener
		// and drops focus on <body> when the click lands on non-focusable text,
		// so the restore has to outlast it — and then stand down if the click
		// gave focus to something of its own.
		setTimeout(() => {
			const settled = document.activeElement;
			if (!settled || settled === document.body) triggerEl?.focus();
		});
	}

	function handleTranslateKeydown(event: KeyboardEvent) {
		if (opensSelectPopup(event)) selectPopupOpen = true;
	}

	function handleFocusout(event: FocusEvent) {
		const next = event.relatedTarget as Node | null;

		// A null relatedTarget is a blur with nowhere to go (window switch, a
		// click on non-focusable chrome); the panel should survive those.
		if (!next) return;
		if (triggerEl?.contains(next) || panelEl?.contains(next)) return;
		closeMenu(false);
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} onpointerdown={handleWindowPointerdown} />

<div class="relative inline-block text-left">
	<button
		bind:this={triggerEl}
		type="button"
		class="btn btn-square rounded-lg btn-ghost"
		onclick={toggleMenu}
		aria-expanded={isOpen}
		aria-controls={panelId}
		aria-label="Accessibility Settings"
		title="Accessibility Settings"
	>
		<Icon name="accessibility" />
	</button>

	<!-- NOTE: the panel stays mounted so its open/close transition can run;
	     `inert` is what keeps the closed panel out of the tab order and the
	     accessibility tree. Dropping `inert` would let keyboard and screen
	     reader users land inside an invisible menu.

	     It is a disclosure, not a modal: the page behind it stays readable and
	     operable, so Tab walks out of the panel into the rest of the nav
	     instead of being trapped, and the last control is an explicit Close
	     for anyone whose switch interface emits no Escape. -->
	<div
		bind:this={panelEl}
		id={panelId}
		role="group"
		aria-label="Accessibility settings"
		inert={!isOpen}
		onfocusout={handleFocusout}
		class="a11y-panel absolute right-0 z-50 mt-2 max-h-[calc(100vh-5rem)] w-64 origin-top-right transform overflow-y-auto rounded-box border border-base-300 bg-base-200 p-4 shadow-xl transition-all duration-200"
		class:opacity-0={!isOpen}
		class:pointer-events-none={!isOpen}
		class:scale-95={!isOpen}
		class:translate-y-[-8px]={!isOpen}
	>
		<!-- Decorative caption, not a heading: it would otherwise be read as
		     "slash slash accessibility" and land in the page's heading list
		     under no h1 or h2, while the panel already carries the same name. -->
		<p aria-hidden="true" class="mb-3 font-mono text-xs font-bold opacity-80">// accessibility</p>

		<!-- Font Size Controls -->
		<div class="mb-4 space-y-2">
			<span id={sizeLabelId} class="text-[11px] font-bold tracking-wider uppercase opacity-60"
				>Text Size</span
			>
			<div class="join grid w-full grid-cols-4" role="radiogroup" aria-labelledby={sizeLabelId}>
				<!-- The glyph is repeated inside the hidden node: building the whole
				     name in one text node keeps its spacing ours rather than each
				     engine's name-from-content concatenation. -->
				{#each FONT_SIZE_OPTIONS as option, index (option.size)}
					<button
						type="button"
						role="radio"
						aria-checked={fontSize === option.size}
						tabindex={fontSize === option.size ? 0 : -1}
						class="btn join-item btn-xs {fontSize === option.size ? 'btn-primary' : 'btn-outline'}"
						onclick={() => changeFontSize(option.size)}
						onkeydown={(event) => handleSizeKeydown(event, index)}
						><span aria-hidden="true">{option.glyph}</span><span class="sr-only"
							>{spokenName(option)}</span
						></button
					>
				{/each}
			</div>
		</div>

		<!-- Dyslexic Font Toggle -->
		<div class="flex items-center justify-between border-t border-base-300 py-2.5">
			<label for={dyslexicId} class="cursor-pointer text-xs font-semibold opacity-70"
				>Dyslexia Font</label
			>
			<input
				id={dyslexicId}
				type="checkbox"
				class="toggle toggle-primary toggle-sm"
				checked={dyslexicFont}
				onchange={toggleDyslexic}
			/>
		</div>

		<!-- Underline Links Toggle -->
		<div class="flex items-center justify-between border-t border-base-300 py-2.5">
			<label for={underlineId} class="cursor-pointer text-xs font-semibold opacity-70"
				>Underline Links</label
			>
			<input
				id={underlineId}
				type="checkbox"
				class="toggle toggle-primary toggle-sm"
				checked={underlineLinks}
				onchange={toggleUnderline}
			/>
		</div>

		<!-- Colorblind Theme Toggle -->
		<div class="flex items-center justify-between border-t border-base-300 py-2.5">
			<label for={colorblindId} class="cursor-pointer text-xs font-semibold opacity-70"
				>Colorblind Theme</label
			>
			<input
				id={colorblindId}
				type="checkbox"
				class="toggle toggle-primary toggle-sm"
				checked={colorblindMode}
				onchange={toggleColorblind}
			/>
		</div>

		<!-- Text-to-Speech Toggle -->
		<div class="flex items-center justify-between border-t border-base-300 py-2.5">
			<!-- The row caption is the button's own label, so it is hidden from
			     the reading order to keep browse mode from saying it twice. -->
			<span id={ttsLabelId} aria-hidden="true" class="text-xs font-semibold opacity-70"
				>Read Page Aloud</span
			>
			<!-- Naming the button after the row *and* itself keeps the visible
			     Play/Stop word inside the accessible name (WCAG 2.5.3) while
			     aria-pressed still carries the state. -->
			<button
				bind:this={ttsButtonEl}
				id={ttsButtonId}
				type="button"
				class="btn btn-outline btn-primary btn-xs"
				aria-labelledby="{ttsLabelId} {ttsButtonId}"
				aria-pressed={isSpeaking}
				onclick={toggleSpeech}
			>
				{isSpeaking ? 'Stop' : 'Play'}
			</button>
		</div>

		<!-- Site translation: our own picker drives the hidden Google widget -->
		<div class="border-t border-base-300 pt-3">
			<span class="mb-2 block text-[11px] font-bold tracking-wider uppercase opacity-60"
				>Translate Site</span
			>
			<select
				id={translateId}
				class="select w-full select-sm"
				aria-label="Translate site"
				value={translateLang}
				onchange={changeTranslation}
				onmousedown={() => (selectPopupOpen = true)}
				onkeydown={handleTranslateKeydown}
				onblur={() => (selectPopupOpen = false)}
			>
				{#each TRANSLATE_LANGUAGES as language (language.code)}
					<option value={language.code}>{language.label}</option>
				{/each}
			</select>
			<div id={translateWidgetId} class="hidden" aria-hidden="true"></div>
		</div>

		<div class="mt-3 border-t border-base-300 pt-3">
			<button type="button" class="btn w-full btn-ghost btn-xs" onclick={() => closeMenu()}
				>Close</button
			>
		</div>
	</div>

	<div class="sr-only" role="status" aria-live="polite" aria-atomic="true">{status}</div>
</div>
