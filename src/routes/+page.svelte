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
	<meta property="og:title" content="{site.title} · Systems Development Engineer" />
	<meta property="og:description" content={site.description} />
	<meta property="og:url" content={site.url} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{site.url}/rs-high-res-current-photo-cropped.jpg" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="{site.title} · Systems Development Engineer" />
	<meta name="twitter:description" content={site.description} />
	<meta name="twitter:image" content="{site.url}/rs-high-res-current-photo-cropped.jpg" />
	<style>
		/* Inject viewport scroll-snapping style dynamically on home page mount */
		html {
			scroll-snap-type: y proximity;
			scroll-behavior: smooth;
		}
	</style>
</svelte:head>

<div class="homepage-hero-snap">
	<Hero />
</div>
<Timeline {entries} />

<style>
	.homepage-hero-snap {
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}
</style>
