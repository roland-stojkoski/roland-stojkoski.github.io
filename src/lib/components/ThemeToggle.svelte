<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import { applyTheme, currentTheme, nextTheme, DARK_THEME, type Theme } from '$lib/utils/theme';

	let theme = $state<Theme | undefined>(undefined);

	onMount(() => {
		theme = currentTheme();
	});

	function toggle() {
		if (!theme) return;
		theme = nextTheme(theme);
		applyTheme(theme);
	}
</script>

<button
	type="button"
	class="btn btn-circle btn-ghost"
	onclick={toggle}
	aria-label={theme === DARK_THEME ? 'Switch to light theme' : 'Switch to dark theme'}
	title="Toggle theme"
>
	{#if theme === DARK_THEME}
		<Icon name="sun" />
	{:else}
		<Icon name="moon" />
	{/if}
</button>
