<script type="ts">
	import Hero from '$lib/home/Hero.svelte';
	import DevTimeline from '$lib/home/DevTimeline.svelte';
	import Container from '$lib/common/Container.svelte';
	import type { TimelineItemInterfaceRaw } from '$lib/home/TimelineItemInterface';

	/** @type {import('./$types').PageData} */
	export let data: { mdFiles: TimelineItemInterfaceRaw[] };
</script>

<svelte:head>
	<title>RS - Home</title>
</svelte:head>

<Hero />
<Container>
	<DevTimeline items={data.mdFiles} />
</Container>
