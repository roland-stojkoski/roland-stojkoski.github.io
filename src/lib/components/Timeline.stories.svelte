<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Timeline from './Timeline.svelte';
	import { lifeEvents } from '$lib/data/timeline';

	const { Story } = defineMeta({
		title: 'Components/Timeline',
		component: Timeline,
		parameters: { layout: 'fullscreen' }
	});

	const article = {
		kind: 'article' as const,
		slug: 'demo',
		href: '/articles/demo',
		title: 'A demo article on the timeline',
		date: new Date(2024, 5, 1),
		tldr: 'Short summary of what the article covers.',
		githubLink: 'https://github.com/roland-stojkoski'
	};
</script>

<Story name="Articles and events" args={{ entries: [article, ...lifeEvents] }} />
<Story name="Events only" args={{ entries: lifeEvents }} />
<Story name="Empty" args={{ entries: [] }} />
