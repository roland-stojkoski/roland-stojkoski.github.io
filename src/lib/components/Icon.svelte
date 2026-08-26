<script lang="ts">
	import { iconMarkup, type IconName } from './icons';

	interface Props {
		name: IconName;
		size?: number;
		/** Heavier than the default 2 keeps small or spotlit glyphs legible. */
		strokeWidth?: number;
		class?: string;
		label?: string;
	}

	let { name, size = 20, strokeWidth = 2, class: className = '', label }: Props = $props();

	const markup = $derived(iconMarkup(name, { size, strokeWidth, class: className, label }));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- static icon markup from icons.ts -->
{@html markup}
