<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let selectedTags = $state<string[]>([]);

	// Extract all unique tags across all articles
	const allTags = $derived.by(() => {
		const tagsSet = new SvelteSet<string>();
		for (const article of data.articles) {
			if (article.tags) {
				for (const tag of article.tags) {
					tagsSet.add(tag);
				}
			}
		}
		return Array.from(tagsSet).sort();
	});

	// Filter articles based on search query and selected tags
	const filteredArticles = $derived.by(() => {
		return data.articles.filter((article) => {
			const matchesSearch =
				article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				article.tldr.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesTags =
				selectedTags.length === 0 ||
				(article.tags && selectedTags.every((t) => article.tags!.includes(t)));

			return matchesSearch && matchesTags;
		});
	});

	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	function formatDate(date: Date): string {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{site.title} · Articles</title>
	<meta
		name="description"
		content="Technical articles, developer timeline, and writings by Roland Stojkoski."
	/>
	<meta property="og:title" content="Articles · {site.title}" />
	<meta
		property="og:description"
		content="Technical articles, developer timeline, and writings by Roland Stojkoski."
	/>
	{#if data.articles && data.articles[0] && data.articles[0].image}
		<meta property="og:image" content={`${site.url}${data.articles[0].image}`} />
		<meta name="twitter:image" content={`${site.url}${data.articles[0].image}`} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="mx-auto max-w-3xl space-y-8 px-4 py-12">
	<div class="prose prose-lg">
		<h1 class="font-mono">Articles</h1>
		<p class="text-base-content/80">
			Writings on cloud engineering, Svelte, automation, and tech philosophy.
		</p>
	</div>

	<!-- Search & Filters -->
	<div class="card space-y-4 rounded-xl border border-base-300/60 bg-base-200 p-6 shadow-sm">
		<div class="form-control">
			<label class="input-bordered input flex w-full items-center gap-2 rounded-lg">
				<Icon name="search" size={18} class="opacity-60" />
				<input
					type="text"
					class="grow border-none text-sm focus:outline-none"
					placeholder="Search articles by title or content..."
					bind:value={searchQuery}
				/>
				{#if searchQuery}
					<button
						class="btn btn-square rounded-md btn-ghost btn-xs"
						onclick={() => (searchQuery = '')}
						aria-label="Clear search"
					>
						✕
					</button>
				{/if}
			</label>
		</div>

		{#if allTags.length > 0}
			<div class="space-y-2">
				<span class="text-xs font-bold tracking-wider uppercase opacity-60">Filter by Tag</span>
				<div class="flex flex-wrap gap-2">
					{#each allTags as tag (tag)}
						{@const active = selectedTags.includes(tag)}
						<button
							class="btn rounded-md font-mono btn-xs {active ? 'btn-primary' : 'btn-outline'}"
							onclick={() => toggleTag(tag)}
						>
							#{tag}
						</button>
					{/each}
					{#if selectedTags.length > 0}
						<button
							class="btn rounded-md btn-ghost font-mono text-error btn-xs"
							onclick={() => (selectedTags = [])}
						>
							Clear Filters
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Articles List -->
	<div class="space-y-6">
		{#if filteredArticles.length === 0}
			<div class="py-12 text-center text-base-content/60">
				<p>No articles match your search or filters.</p>
			</div>
		{:else}
			{#each filteredArticles as article (article.slug)}
				<article
					class="card rounded-xl border border-base-300/60 bg-base-100 p-6 shadow-sm transition-all hover:border-primary/50"
				>
					<div class="flex flex-col gap-6 md:flex-row md:items-start">
						{#if article.image}
							<div class="shrink-0">
								<img
									src={article.image}
									alt={article.title}
									class="h-36 w-full rounded-lg border border-base-300 object-cover object-top shadow-inner md:h-24 md:w-40"
								/>
							</div>
						{/if}
						<div class="flex-1 space-y-3">
							<div class="flex flex-wrap items-center justify-between gap-2">
								<time
									class="font-mono text-xs text-base-content/60"
									datetime={article.date.toISOString()}
								>
									{formatDate(article.date)}
								</time>
								{#if article.tags && article.tags.length > 0}
									<div class="flex flex-wrap gap-1.5">
										{#each article.tags as tag (tag)}
											<span class="badge rounded-md badge-outline font-mono badge-sm text-[10px]"
												>#{tag}</span
											>
										{/each}
									</div>
								{/if}
							</div>

							<h2 class="font-mono text-xl font-bold">
								<a href={article.href} class="link link-hover hover:text-primary">{article.title}</a
								>
							</h2>

							<p class="text-sm leading-relaxed text-base-content/85">{article.tldr}</p>

							<div class="card-actions items-center justify-end gap-4 pt-2">
								{#if article.githubLink}
									<a
										href={article.githubLink}
										target="_blank"
										rel="noreferrer"
										class="btn gap-1.5 rounded-md btn-ghost font-mono text-xs opacity-75 btn-xs hover:opacity-100"
										aria-label="GitHub Repository"
									>
										<Icon name="github" size={14} />
										Repo
									</a>
								{/if}
								<a href={article.href} class="btn rounded-lg font-mono text-xs btn-primary btn-sm">
									Read Article
									<Icon name="arrow-right" size={14} />
								</a>
							</div>
						</div>
					</div>
				</article>
			{/each}
		{/if}
	</div>
</div>
