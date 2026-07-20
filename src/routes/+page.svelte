<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import { mergeTimeline } from '$lib/data/timeline';
	import { site } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const entries = $derived(mergeTimeline(data.articles));
</script>

<svelte:head>
	<title>{site.title} · Home</title>
	<meta name="description" content={site.description} />
</svelte:head>

<Hero />
<Timeline {entries} />
