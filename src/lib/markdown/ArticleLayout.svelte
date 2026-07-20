<script module lang="ts">
	// Re-exported components are injected into every article's scope by
	// mdsvex, so markdown can use <YouTube/>, <StlViewer/>, <Figure/> and
	// <Compare/> without import statements.
	export { default as YouTube } from './YouTube.svelte';
	export { default as StlViewer } from './StlViewer.svelte';
	export { default as Figure } from './Figure.svelte';
	export { default as Compare } from './Compare.svelte';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Giscus from './Giscus.svelte';

	interface Props {
		title: string;
		date: string;
		tldr?: string;
		githubLink?: string;
		children?: Snippet;
	}

	let { title, date, tldr, githubLink, children }: Props = $props();

	const formattedDate = $derived(
		new Date(date).toLocaleDateString('en-IE', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
</script>

<article class="mx-auto max-w-3xl px-4 py-12">
	<header class="mb-10">
		<a href="/#timeline" class="link font-mono text-sm text-base-content/60 link-hover">
			← back to /dev/timeline
		</a>
		<h1 class="mt-4 text-3xl leading-tight font-bold md:text-4xl">{title}</h1>
		{#if tldr}
			<p class="mt-3 text-lg text-base-content/70">{tldr}</p>
		{/if}
		<div class="mt-4 flex flex-wrap items-center gap-4 font-mono text-sm text-base-content/60">
			<time datetime={new Date(date).toISOString()}>{formattedDate}</time>
			{#if githubLink}
				<a
					href={githubLink}
					target="_blank"
					rel="noreferrer"
					class="flex link items-center gap-1 link-hover"
				>
					<Icon name="github" size={14} /> source
				</a>
			{/if}
		</div>
		<div class="divider mb-0"></div>
	</header>

	<div class="prose prose-lg max-w-none">
		{@render children?.()}
	</div>

	<Giscus />
</article>
