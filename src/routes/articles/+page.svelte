<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="18"
					height="18"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="opacity-60"
				>
					<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
				</svg>
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
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											width="14"
											height="14"
											fill="currentColor"
											stroke="none"
										>
											<path
												d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
											/>
										</svg>
										Repo
									</a>
								{/if}
								<a href={article.href} class="btn rounded-lg font-mono text-xs btn-primary btn-sm">
									Read Article
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										width="14"
										height="14"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M5 12h14m-7-7 7 7-7 7" />
									</svg>
								</a>
							</div>
						</div>
					</div>
				</article>
			{/each}
		{/if}
	</div>
</div>
