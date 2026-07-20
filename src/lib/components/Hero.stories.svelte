<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Hero from './Hero.svelte';

	const { Story } = defineMeta({
		title: 'Components/Hero',
		component: Hero,
		parameters: { layout: 'fullscreen' }
	});
</script>

<Story name="Default" />
