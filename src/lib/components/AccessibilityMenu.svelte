<script lang="ts">
	import { onMount } from 'svelte';
	import {
		COLORBLIND_CLASS,
		COLORBLIND_KEY,
		DYSLEXIC_CLASS,
		DYSLEXIC_KEY,
		FONT_SIZE_CLASSES,
		FONT_SIZE_KEY,
		TRANSLATE_LANGUAGES,
		UNDERLINE_CLASS,
		UNDERLINE_KEY,
		googtransTarget,
		isFontSize,
		pageLanguage,
		pickVoice,
		type FontSize
	} from '$lib/utils/a11y';

	let isOpen = $state(false);
	let fontSize = $state<FontSize>('normal');
	let dyslexicFont = $state(false);
	let underlineLinks = $state(false);
	let colorblindMode = $state(false);
	let isSpeaking = $state(false);
	let translateLang = $state('en');

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
			const container = document.getElementById('google_translate_element');
			if (container) container.innerHTML = '';
			new win.google.translate.TranslateElement(
				{ pageLanguage: 'en', autoDisplay: false },
				'google_translate_element'
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
		translateLang = lang;
		setGoogtransCookie(lang);

		// Drive the hidden widget's combo directly when it is up; otherwise
		// (engine still loading, or back to english) reload — the engine
		// applies the googtrans cookie on init.
		const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
		if (combo && lang !== 'en') {
			combo.value = lang;
			combo.dispatchEvent(new Event('change'));
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

	function changeFontSize(size: FontSize) {
		fontSize = size;
		applySettings();
	}

	function toggleDyslexic() {
		dyslexicFont = !dyslexicFont;
		applySettings();
	}

	function toggleUnderline() {
		underlineLinks = !underlineLinks;
		applySettings();
	}

	function toggleColorblind() {
		colorblindMode = !colorblindMode;
		applySettings();
	}

	function toggleSpeech() {
		if (typeof window === 'undefined' || !window.speechSynthesis) return;

		if (isSpeaking) {
			window.speechSynthesis.cancel();
			isSpeaking = false;
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
		window.speechSynthesis.speak(utterance);
	}
</script>

<div class="relative inline-block text-left">
	<button
		class="btn btn-square rounded-lg btn-ghost"
		onclick={() => (isOpen = !isOpen)}
		aria-expanded={isOpen}
		aria-haspopup="true"
		aria-label="Accessibility Settings"
		title="Accessibility Settings"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="20"
			height="20"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2v6M9 12h6M10 20h4" />
		</svg>
	</button>

	{#if isOpen}
		<!-- Click outside backdrop to close dropdown -->
		<button
			class="fixed inset-0 z-40 h-full w-full cursor-default bg-transparent"
			onclick={() => (isOpen = false)}
			aria-label="Close accessibility settings"
		></button>
	{/if}

	<div
		class="absolute right-0 z-50 mt-2 w-64 origin-top-right transform rounded-box border border-base-300 bg-base-200 p-4 shadow-xl transition-all duration-200"
		class:opacity-0={!isOpen}
		class:pointer-events-none={!isOpen}
		class:scale-95={!isOpen}
		class:translate-y-[-8px]={!isOpen}
	>
		<h3 class="mb-3 font-mono text-xs font-bold opacity-80">// accessibility</h3>

		<!-- Font Size Controls -->
		<div class="mb-4 space-y-2">
			<span class="text-[11px] font-bold tracking-wider uppercase opacity-60">Text Size</span>
			<div class="join grid w-full grid-cols-4">
				<button
					class="btn join-item btn-xs {fontSize === 'small' ? 'btn-primary' : 'btn-outline'}"
					onclick={() => changeFontSize('small')}>A-</button
				>
				<button
					class="btn join-item btn-xs {fontSize === 'normal' ? 'btn-primary' : 'btn-outline'}"
					onclick={() => changeFontSize('normal')}>Normal</button
				>
				<button
					class="btn join-item btn-xs {fontSize === 'large' ? 'btn-primary' : 'btn-outline'}"
					onclick={() => changeFontSize('large')}>A+</button
				>
				<button
					class="btn join-item btn-xs {fontSize === 'xl' ? 'btn-primary' : 'btn-outline'}"
					onclick={() => changeFontSize('xl')}>A++</button
				>
			</div>
		</div>

		<!-- Dyslexic Font Toggle -->
		<div class="flex items-center justify-between border-t border-base-300 py-2.5">
			<label for="dyslexic-toggle" class="cursor-pointer text-xs font-semibold opacity-70"
				>Dyslexia Font</label
			>
			<input
				id="dyslexic-toggle"
				type="checkbox"
				class="toggle toggle-primary toggle-sm"
				checked={dyslexicFont}
				onchange={toggleDyslexic}
			/>
		</div>

		<!-- Underline Links Toggle -->
		<div class="flex items-center justify-between border-t border-base-300 py-2.5">
			<label for="underline-toggle" class="cursor-pointer text-xs font-semibold opacity-70"
				>Underline Links</label
			>
			<input
				id="underline-toggle"
				type="checkbox"
				class="toggle toggle-primary toggle-sm"
				checked={underlineLinks}
				onchange={toggleUnderline}
			/>
		</div>

		<!-- Colorblind Theme Toggle -->
		<div class="flex items-center justify-between border-t border-base-300 py-2.5">
			<label for="colorblind-toggle" class="cursor-pointer text-xs font-semibold opacity-70"
				>Colorblind Theme</label
			>
			<input
				id="colorblind-toggle"
				type="checkbox"
				class="toggle toggle-primary toggle-sm"
				checked={colorblindMode}
				onchange={toggleColorblind}
			/>
		</div>

		<!-- Text-to-Speech Toggle -->
		<div class="flex items-center justify-between border-t border-base-300 py-2.5">
			<label for="tts-button" class="cursor-pointer text-xs font-semibold opacity-70"
				>Read Page Aloud</label
			>
			<button id="tts-button" class="btn btn-outline btn-primary btn-xs" onclick={toggleSpeech}>
				{isSpeaking ? 'Stop' : 'Play'}
			</button>
		</div>

		<!-- Site translation: our own picker drives the hidden Google widget -->
		<div class="border-t border-base-300 pt-3">
			<span class="mb-2 block text-[11px] font-bold tracking-wider uppercase opacity-60"
				>Translate Site</span
			>
			<select
				id="site-translate"
				class="select w-full select-sm"
				aria-label="Translate site"
				value={translateLang}
				onchange={changeTranslation}
			>
				{#each TRANSLATE_LANGUAGES as language (language.code)}
					<option value={language.code}>{language.label}</option>
				{/each}
			</select>
			<div id="google_translate_element" class="hidden" aria-hidden="true"></div>
		</div>
	</div>
</div>
