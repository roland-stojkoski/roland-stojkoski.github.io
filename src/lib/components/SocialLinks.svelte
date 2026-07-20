<script lang="ts">
	import Icon from './Icon.svelte';
	import { socials } from '$lib/config';

	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 22, class: className = '' }: Props = $props();
</script>

<div class="flex items-center gap-1 {className}">
	{#each socials as social (social.name)}
		<a
			class="btn btn-circle btn-ghost"
			href={social.href}
			target="_blank"
			rel="noreferrer"
			aria-label={social.name}
			title={social.name}
		>
			<Icon name={social.icon} {size} />
		</a>
	{/each}
</div>
