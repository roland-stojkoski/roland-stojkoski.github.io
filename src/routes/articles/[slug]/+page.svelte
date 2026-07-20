<script lang="ts">
	import { site } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const Article = $derived(data.component);
	const imageUrl = $derived(
		data.frontmatter.image
			? data.frontmatter.image.startsWith('http')
				? data.frontmatter.image
				: `${site.url}${data.frontmatter.image}`
			: ''
	);
</script>

<svelte:head>
	<title>{data.frontmatter.title} · {site.title}</title>
	{#if data.frontmatter.tldr}
		<meta name="description" content={data.frontmatter.tldr} />
		<meta property="og:description" content={data.frontmatter.tldr} />
	{/if}
	<meta property="og:title" content={data.frontmatter.title} />
	<meta property="og:type" content="article" />
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		<meta name="twitter:image" content={imageUrl} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Article />
