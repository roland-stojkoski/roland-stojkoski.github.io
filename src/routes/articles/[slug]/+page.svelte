<script lang="ts">
	import { site } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const Article = $derived(data.component);
</script>

<svelte:head>
	<title>{data.frontmatter.title} · {site.title}</title>
	{#if data.frontmatter.tldr}
		<meta name="description" content={data.frontmatter.tldr} />
	{/if}
</svelte:head>

<Article />
