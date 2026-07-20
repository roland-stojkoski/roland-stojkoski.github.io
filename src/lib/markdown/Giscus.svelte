<script lang="ts">
	import { onMount } from 'svelte';
	import { giscus } from '$lib/config';
	import { currentTheme, DARK_THEME, THEME_CHANGE_EVENT, type Theme } from '$lib/utils/theme';

	const configured = Boolean(giscus.repoId && giscus.categoryId);

	let container: HTMLDivElement | undefined = $state();

	const giscusTheme = (theme: Theme) => (theme === DARK_THEME ? 'dark_dimmed' : 'light');

	onMount(() => {
		if (!configured || !container) return;

		const script = document.createElement('script');
		script.src = 'https://giscus.app/client.js';
		script.async = true;
		script.crossOrigin = 'anonymous';
		Object.entries({
			'data-repo': giscus.repo,
			'data-repo-id': giscus.repoId,
			'data-category': giscus.category,
			'data-category-id': giscus.categoryId,
			'data-mapping': 'pathname',
			'data-strict': '0',
			'data-reactions-enabled': '1',
			'data-emit-metadata': '0',
			'data-input-position': 'top',
			'data-theme': giscusTheme(currentTheme()),
			'data-lang': 'en',
			'data-loading': 'lazy'
		}).forEach(([key, value]) => script.setAttribute(key, value));
		// eslint-disable-next-line svelte/no-dom-manipulating -- giscus owns this empty container
		container.appendChild(script);

		const syncTheme = (event: Event) => {
			const theme = (event as CustomEvent<{ theme: Theme }>).detail.theme;
			const frame = container?.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
			frame?.contentWindow?.postMessage(
				{ giscus: { setConfig: { theme: giscusTheme(theme) } } },
				'https://giscus.app'
			);
		};
		window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
		return () => window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
	});
</script>

{#if configured}
	<section class="mt-12" aria-label="Comments">
		<div bind:this={container}></div>
	</section>
{:else if import.meta.env.DEV}
	<div class="mt-12 alert font-mono text-sm alert-info">
		giscus is not configured yet - fill repoId/categoryId in src/lib/config.ts (dev-only notice).
	</div>
{/if}
