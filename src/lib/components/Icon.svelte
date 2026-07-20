<script lang="ts">
	import { icons, type IconName } from './icons';

	interface Props {
		name: IconName;
		size?: number;
		class?: string;
		label?: string;
	}

	let { name, size = 20, class: className = '', label }: Props = $props();

	const icon = $derived(icons[name]);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill={icon.type === 'fill' ? 'currentColor' : 'none'}
	stroke={icon.type === 'stroke' ? 'currentColor' : 'none'}
	stroke-width={icon.type === 'stroke' ? 2 : 0}
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
	role={label ? 'img' : 'presentation'}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static icon markup from icons.ts -->
	{@html icon.svg}
</svg>
