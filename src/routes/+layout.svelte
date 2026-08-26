<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/jetbrains-mono';
	import '@fontsource/opendyslexic';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import { THEME_CHANGE_EVENT } from '$lib/utils/theme';

	let { children }: { children: Snippet } = $props();

	// Dynamic coordinates, sizing, and colors for bubble 1
	const bubble1Class = $derived.by(() => {
		const path = page.url.pathname;
		if (path === '/') {
			return 'top-[-10%] left-[-10%] w-[30rem] h-[30rem] from-primary/24';
		} else if (path.startsWith('/about')) {
			return 'top-[15%] left-[5%] w-[40rem] h-[40rem] from-accent/22';
		} else if (path.startsWith('/articles')) {
			return 'top-[60%] left-[2%] w-[45rem] h-[45rem] from-primary/20';
		} else if (path.startsWith('/contact')) {
			return 'top-[35%] left-[10%] w-[35rem] h-[35rem] from-secondary/26';
		} else {
			return 'top-[15%] left-[20%] w-[35rem] h-[35rem] from-primary/20';
		}
	});

	// Dynamic coordinates, sizing, and colors for bubble 2
	const bubble2Class = $derived.by(() => {
		const path = page.url.pathname;
		if (path === '/') {
			return 'top-[10%] left-[70%] w-[28rem] h-[28rem] from-accent/20';
		} else if (path.startsWith('/about')) {
			return 'top-[65%] left-[60%] w-[35rem] h-[35rem] from-secondary/22';
		} else if (path.startsWith('/articles')) {
			return 'top-[5%] left-[75%] w-[30rem] h-[30rem] from-accent/22';
		} else if (path.startsWith('/contact')) {
			return 'top-[60%] left-[65%] w-[38rem] h-[38rem] from-accent/20';
		} else {
			return 'top-[50%] left-[55%] w-[25rem] h-[25rem] from-secondary/20';
		}
	});

	// Dynamic coordinates, sizing, and colors for bubble 3
	const bubble3Class = $derived.by(() => {
		const path = page.url.pathname;
		if (path === '/') {
			return 'top-[45%] left-[25%] w-[32rem] h-[32rem] from-secondary/20';
		} else if (path.startsWith('/about')) {
			return 'top-[5%] left-[75%] w-[25rem] h-[25rem] from-primary/22';
		} else if (path.startsWith('/articles')) {
			return 'top-[35%] left-[55%] w-[38rem] h-[38rem] from-secondary/20';
		} else if (path.startsWith('/contact')) {
			return 'top-[5%] left-[55%] w-[30rem] h-[30rem] from-primary/24';
		} else {
			return 'top-[40%] left-[30%] w-[28rem] h-[28rem] from-accent/18';
		}
	});

	// Dynamic coordinates, sizing, and colors for bubble 4
	const bubble4Class = $derived.by(() => {
		const path = page.url.pathname;
		if (path === '/') {
			return 'top-[75%] left-[55%] w-[35rem] h-[35rem] from-primary/22';
		} else if (path.startsWith('/about')) {
			return 'top-[40%] left-[35%] w-[30rem] h-[30rem] from-accent/20';
		} else if (path.startsWith('/articles')) {
			return 'top-[80%] left-[75%] w-[32rem] h-[32rem] from-primary/22';
		} else if (path.startsWith('/contact')) {
			return 'top-[75%] left-[25%] w-[32rem] h-[32rem] from-secondary/22';
		} else {
			return 'top-[70%] left-[65%] w-[30rem] h-[30rem] from-primary/20';
		}
	});

	let isAnimating = $state(false);
	let targetTheme = $state('');
	let animationTimeout: ReturnType<typeof setTimeout> | undefined;

	// WCAG 2.3.3: the overlay is three 1.2s full-viewport animations, so it is
	// never mounted for a reader who asked for reduced motion.
	const prefersReducedMotion = () =>
		typeof window !== 'undefined' &&
		typeof window.matchMedia === 'function' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function handleThemeChange(e: Event) {
		if (prefersReducedMotion()) return;

		const customEvent = e as CustomEvent<{ theme: string }>;
		targetTheme = customEvent.detail.theme;
		isAnimating = false;
		// Small tick to re-trigger DOM mounting for animation
		setTimeout(() => {
			isAnimating = true;
			clearTimeout(animationTimeout);
			animationTimeout = setTimeout(() => {
				isAnimating = false;
			}, 1200);
		}, 50);
	}

	onMount(() => {
		window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
		return () => {
			window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
			clearTimeout(animationTimeout);
		};
	});
</script>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-content"
>
	Skip to main content
</a>

<!-- overflow-clip (not hidden): hidden would make this a scroll container and
     silently disable position:sticky for the nav and timeline scrubber -->
<div class="relative flex min-h-screen flex-col overflow-x-clip bg-base-100">
	<!-- Dynamic ambient background color bubbles -->
	<div
		class="pointer-events-none absolute z-0 rounded-full bg-radial to-transparent blur-3xl transition-all duration-1000 ease-in-out {bubble1Class}"
	></div>
	<div
		class="pointer-events-none absolute z-0 rounded-full bg-radial to-transparent blur-3xl transition-all duration-1000 ease-in-out {bubble2Class}"
	></div>
	<div
		class="pointer-events-none absolute z-0 rounded-full bg-radial to-transparent blur-3xl transition-all duration-1000 ease-in-out {bubble3Class}"
	></div>
	<div
		class="pointer-events-none absolute z-0 rounded-full bg-radial to-transparent blur-3xl transition-all duration-1000 ease-in-out {bubble4Class}"
	></div>

	<div class="relative z-10 flex flex-1 flex-col">
		<Nav />
		<main id="main-content" class="page-container-grid flex-1">
			{#key page.url.pathname}
				<div
					in:fade={{
						duration: typeof window !== 'undefined' && window.navigator.webdriver ? 0 : 200,
						delay: typeof window !== 'undefined' && window.navigator.webdriver ? 0 : 100
					}}
					out:fade={{
						duration: typeof window !== 'undefined' && window.navigator.webdriver ? 0 : 150
					}}
				>
					{@render children()}
				</div>
			{/key}
		</main>
		<Footer />
	</div>

	<!-- Theme Transition Animation Overlay -->
	{#if isAnimating}
		<!-- Earth Horizon curvature element -->
		<div class="pointer-events-none fixed inset-0 z-[9997] overflow-hidden">
			<div class="theme-earth-horizon"></div>
		</div>

		<!-- Shade backdrop sweep -->
		<div class="theme-backdrop-sweep pointer-events-none fixed inset-0 z-[9998]"></div>

		<!-- Orbiting Celestial symbol -->
		<div class="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
			<div class="theme-transition-icons absolute flex items-center justify-center">
				{#if targetTheme === 'latte'}
					<div
						class="flex h-24 w-24 items-center justify-center rounded-full border border-amber-400 bg-amber-400/20 text-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.4)] backdrop-blur-sm"
					>
						<Icon name="sun" size={48} />
					</div>
				{:else if targetTheme === 'espresso'}
					<div
						class="flex h-24 w-24 items-center justify-center rounded-full border border-indigo-300 bg-indigo-300/20 text-indigo-300 shadow-[0_0_40px_rgba(165,180,252,0.4)] backdrop-blur-sm"
					>
						<Icon name="moon" size={48} strokeWidth={2.5} />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.page-container-grid {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}

	.page-container-grid > div {
		grid-area: 1 / 1 / 2 / 2;
		/* grid items default to min-width:auto, letting wide content (e.g. pre
		   lines) stretch the whole page beyond the viewport on mobile */
		min-width: 0;
	}

	.theme-earth-horizon {
		position: absolute;
		bottom: -80vh;
		left: -50vw;
		width: 200vw;
		height: 100vh;
		border-radius: 50% 50% 0 0;
		background: radial-gradient(
			circle at top,
			rgba(99, 102, 241, 0.15) 0%,
			var(--color-base-200) 60%,
			transparent 100%
		);
		border-top: 3px solid rgba(99, 102, 241, 0.35);
		box-shadow: 0 0 50px rgba(99, 102, 241, 0.15) inset;
		animation: horizon-rise 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
	}

	:global([data-theme='latte']) .theme-earth-horizon {
		background: radial-gradient(
			circle at top,
			rgba(251, 191, 36, 0.2) 0%,
			var(--color-base-200) 60%,
			transparent 100%
		);
		border-top: 3px solid rgba(251, 191, 36, 0.4);
		box-shadow: 0 0 50px rgba(251, 191, 36, 0.15) inset;
	}

	.theme-backdrop-sweep {
		animation: backdrop-sweep 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
		background: linear-gradient(
			90deg,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 0.55) 50%,
			rgba(0, 0, 0, 0) 100%
		);
	}

	:global([data-theme='latte']) .theme-backdrop-sweep {
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.55) 50%,
			rgba(255, 255, 255, 0) 100%
		);
	}

	.theme-transition-icons {
		animation: theme-pan 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
	}

	@keyframes horizon-rise {
		0% {
			transform: translateY(18vh);
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		50% {
			transform: translateY(0vh);
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: translateY(18vh);
			opacity: 0;
		}
	}

	@keyframes backdrop-sweep {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	@keyframes theme-pan {
		0% {
			transform: translate(-30vw, 85vh) scale(0.6) rotate(0deg);
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		50% {
			transform: translate(45vw, 15vh) scale(1.15) rotate(180deg);
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			transform: translate(120vw, 85vh) scale(0.6) rotate(360deg);
			opacity: 0;
		}
	}
</style>
