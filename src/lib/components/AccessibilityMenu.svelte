<script lang="ts">
	import { onMount } from 'svelte';

	let isOpen = $state(false);
	let fontSize = $state('normal'); // 'small', 'normal', 'large', 'xl'
	let dyslexicFont = $state(false);
	let underlineLinks = $state(false);
	let isSpeaking = $state(false);

	// Load settings from localStorage on mount
	onMount(() => {
		fontSize = localStorage.getItem('a11y-font-size') || 'normal';
		dyslexicFont = localStorage.getItem('a11y-dyslexic') === 'true';
		underlineLinks = localStorage.getItem('a11y-underline') === 'true';
		applySettings();

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const win = window as any;

		const initTranslate = () => {
			console.log(
				'initTranslate triggered. win.google exists:',
				!!win.google,
				'win.google.translate exists:',
				!!(win.google && win.google.translate)
			);
			if (
				win.google &&
				win.google.translate &&
				win.google.translate.TranslateElement &&
				win.google.translate.TranslateElement.InlineLayout &&
				win.google.translate.TranslateElement.InlineLayout.SIMPLE
			) {
				console.log('Google Translate requirements met. Instantiating TranslateElement.');
				// Clear any previous Translate dropdown to avoid duplicate renders
				const container = document.getElementById('google_translate_element');
				if (container) {
					container.innerHTML = '';
				}
				new win.google.translate.TranslateElement(
					{
						pageLanguage: 'en',
						layout: win.google.translate.TranslateElement.InlineLayout.SIMPLE,
						autoDisplay: false
					},
					'google_translate_element'
				);
			} else {
				console.log('Google Translate not fully loaded yet. Starting/continuing polling...');
				// If global Translate namespace exists but InlineLayout is not yet ready, poll for it
				let attempts = 0;
				const interval = setInterval(() => {
					attempts++;
					if (
						win.google &&
						win.google.translate &&
						win.google.translate.TranslateElement &&
						win.google.translate.TranslateElement.InlineLayout &&
						win.google.translate.TranslateElement.InlineLayout.SIMPLE
					) {
						console.log('Google Translate loaded during polling after', attempts, 'attempts.');
						clearInterval(interval);
						initTranslate();
					} else if (attempts > 50) {
						console.log('Google Translate polling timed out after 5 seconds.');
						clearInterval(interval);
					}
				}, 100);
			}
		};

		// Define the global callback for Google Translate
		win.googleTranslateElementInit = initTranslate;

		const scriptId = 'google-translate-script';
		const script = document.getElementById(scriptId) as HTMLScriptElement | null;

		if (!script) {
			const newScript = document.createElement('script');
			newScript.id = scriptId;
			newScript.src =
				'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
			newScript.async = true;
			document.body.appendChild(newScript);
		} else {
			if (
				win.google &&
				win.google.translate &&
				win.google.translate.TranslateElement &&
				win.google.translate.TranslateElement.InlineLayout &&
				win.google.translate.TranslateElement.InlineLayout.SIMPLE
			) {
				initTranslate();
			} else {
				// Script exists in DOM but might still be downloading/loading, monitor it
				script.addEventListener('load', () => {
					setTimeout(initTranslate, 100);
				});
				// Polling fallback to guarantee it triggers
				let attempts = 0;
				const interval = setInterval(() => {
					attempts++;
					if (
						win.google &&
						win.google.translate &&
						win.google.translate.TranslateElement &&
						win.google.translate.TranslateElement.InlineLayout &&
						win.google.translate.TranslateElement.InlineLayout.SIMPLE
					) {
						initTranslate();
						clearInterval(interval);
					} else if (attempts > 50) {
						clearInterval(interval);
					}
				}, 100);
			}
		}
	});

	$effect(() => {
		// Stop speaking if the user navigates away or component unmounts
		return () => {
			if (typeof window !== 'undefined' && window.speechSynthesis) {
				window.speechSynthesis.cancel();
			}
		};
	});

	function applySettings() {
		const html = document.documentElement;

		// 1. Font Size
		html.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
		if (fontSize === 'small') html.classList.add('text-sm');
		else if (fontSize === 'normal') html.classList.add('text-base');
		else if (fontSize === 'large') html.classList.add('text-lg');
		else if (fontSize === 'xl') html.classList.add('text-xl');

		// 2. Dyslexic Font
		if (dyslexicFont) {
			html.style.setProperty('--font-sans', '"Comic Sans MS", "Comic Sans", cursive, sans-serif');
		} else {
			html.style.removeProperty('--font-sans');
		}

		// 3. Underline Links
		if (underlineLinks) {
			html.classList.add('force-underline');
		} else {
			html.classList.remove('force-underline');
		}

		// Save settings to localStorage
		localStorage.setItem('a11y-font-size', fontSize);
		localStorage.setItem('a11y-dyslexic', String(dyslexicFont));
		localStorage.setItem('a11y-underline', String(underlineLinks));
	}

	function changeFontSize(size: string) {
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

		<!-- Text-to-Speech Toggle -->
		<div class="flex items-center justify-between border-t border-base-300 py-2.5">
			<label for="tts-button" class="cursor-pointer text-xs font-semibold opacity-70"
				>Read Page Aloud</label
			>
			<button id="tts-button" class="btn btn-outline btn-primary btn-xs" onclick={toggleSpeech}>
				{isSpeaking ? 'Stop' : 'Play'}
			</button>
		</div>

		<!-- Google Translate integration -->
		<div class="border-t border-base-300 pt-3">
			<span class="mb-2 block text-[11px] font-bold tracking-wider uppercase opacity-60"
				>Translate Site</span
			>
			<div id="google_translate_element" class="w-full"></div>
		</div>
	</div>
</div>
