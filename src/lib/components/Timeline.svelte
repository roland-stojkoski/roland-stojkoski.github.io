<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import TimelineScrubber from './TimelineScrubber.svelte';
	import { timelineYears, type TimelineEntry } from '$lib/data/timeline';

	interface Props {
		entries: TimelineEntry[];
	}

	let { entries }: Props = $props();

	const years = $derived(timelineYears(entries));
	let activeYear = $state<number | undefined>(undefined);

	onMount(() => {
		// jsdom (unit tests) has no IntersectionObserver
		if (typeof IntersectionObserver === 'undefined') return;
		const observer = new IntersectionObserver(
			(hits) => {
				for (const hit of hits) {
					if (hit.isIntersecting) {
						activeYear = Number((hit.target as HTMLElement).dataset.year);
					}
				}
			},
			// Fires when an entry crosses the middle band of the viewport.
			{ rootMargin: '-40% 0px -40% 0px' }
		);
		document
			.querySelectorAll('#timeline [data-year]')
			.forEach((section) => observer.observe(section));
		return () => observer.disconnect();
	});

	const formatDate = (date: Date) =>
		date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

	let showBackToTop = $state(false);

	function handleScroll() {
		if (typeof window === 'undefined') return;
		// Show button when scrolled past the top of the timeline
		const timelineEl = document.getElementById('timeline');
		if (timelineEl) {
			const rect = timelineEl.getBoundingClientRect();
			showBackToTop = rect.top < 0;
		}
	}
</script>

<svelte:window onscroll={handleScroll} />

<section id="timeline" class="w-full">
	<div
		class="timeline-snap-section mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 px-4 pt-16 pb-8 sm:flex-row"
	>
		<div>
			<h2 class="text-3xl font-bold">
				<span class="text-gradient">/dev/timeline</span>
			</h2>
			<p class="text-sm text-base-content/60">Milestones, articles, and key life events</p>
		</div>
	</div>

	<!-- Weighted year scrubber, sticks below the nav while the timeline scrolls -->
	<div class="sticky top-[68px] z-30 border-y border-base-300/40 bg-base-100/85 backdrop-blur-md">
		<div class="mx-auto max-w-5xl">
			<TimelineScrubber {years} {activeYear} />
		</div>
	</div>

	<!-- Snap sections -->
	<div class="flex w-full flex-col">
		{#each entries as entry, i (entry.kind === 'article' ? entry.slug : entry.title + entry.dateLabel)}
			{@const entryYear = entry.date.getFullYear()}
			{@const firstOfYear = i === 0 || entries[i - 1].date.getFullYear() !== entryYear}
			<div
				id={firstOfYear ? `year-${entryYear}` : undefined}
				data-year={entryYear}
				class="timeline-snap-section flex w-full scroll-mt-32 items-center justify-center border-b border-base-300/40 py-16"
			>
				<div class="w-full max-w-3xl px-4">
					<div
						class="card flex w-full flex-col overflow-hidden border border-base-300/60 bg-base-200 shadow-sm transition-all duration-300 hover:border-primary/45 hover:shadow-md md:flex-row"
					>
						{#if entry.kind === 'article'}
							<!-- Article cover image on the left -->
							{#if entry.image}
								<div
									class="relative h-48 w-full shrink-0 overflow-hidden border-b border-base-300 md:h-auto md:w-44 md:border-r md:border-b-0"
								>
									<img
										src={entry.image}
										alt={entry.title}
										class="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
									/>
									<div
										class="absolute inset-0 bg-linear-to-t from-transparent to-black/20 md:bg-linear-to-r"
									></div>
								</div>
							{/if}

							<!-- Content on the right -->
							<div class="flex flex-1 flex-col justify-between space-y-4 p-6">
								<div class="space-y-2">
									<div class="flex items-center justify-between font-mono text-xs opacity-60">
										<span
											class="badge rounded-md border-none badge-sm text-[8px] font-bold tracking-wider uppercase shadow-sm badge-primary"
										>
											Article
										</span>
										<time>{formatDate(entry.date)}</time>
									</div>
									<h3 class="font-mono text-lg leading-snug font-bold md:text-xl">
										<a href={entry.href} class="link-hover hover:text-primary">{entry.title}</a>
									</h3>
									<p class="text-sm leading-relaxed text-base-content/80">
										{entry.tldr}
									</p>
								</div>

								<div
									class="card-actions items-center justify-end gap-2 border-t border-base-300/40 pt-2"
								>
									{#if entry.githubLink}
										<a
											href={entry.githubLink}
											target="_blank"
											rel="noreferrer"
											class="btn rounded-md btn-ghost font-mono text-[10px] opacity-75 btn-xs hover:opacity-100"
										>
											<Icon name="github" size={12} /> Repo
										</a>
									{/if}
									<a
										href={entry.href}
										aria-label="Read Article"
										class="btn rounded-lg font-mono text-xs btn-primary btn-sm"
									>
										Read <Icon name="arrow-up-right" size={12} />
									</a>
								</div>
							</div>
						{:else}
							<!-- Milestone / life event card with sidebar icon -->
							<div
								class="flex w-full shrink-0 items-center justify-center border-b border-base-300/50 bg-base-300/10 p-4 md:w-20 md:flex-col md:border-r md:border-b-0 md:p-0"
							>
								<span
									class="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/15 text-accent shadow-inner"
								>
									<Icon name={entry.icon} size={20} />
								</span>
							</div>

							<div class="flex flex-1 flex-col justify-between space-y-3 p-6">
								<div class="space-y-2">
									<div class="flex items-center gap-2">
										<span
											class="badge rounded-md badge-outline font-mono badge-sm text-[8px] tracking-wider uppercase opacity-70"
										>
											Milestone
										</span>
										<time class="font-mono text-xs italic opacity-60">{entry.dateLabel}</time>
									</div>
									<h3 class="font-mono text-lg leading-snug font-bold text-base-content md:text-xl">
										{entry.title}
									</h3>
									{#if entry.subtitle}
										<p class="text-sm leading-relaxed text-base-content/85">
											{entry.subtitle}
										</p>
									{/if}
									{#if 'image' in entry && entry.image}
										<div
											class="mt-4 max-w-sm overflow-hidden rounded-xl border border-base-300/60 shadow-sm"
										>
											<img src={entry.image} alt={entry.title} class="h-auto w-full object-cover" />
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/each}

		<!-- Final CTA slide -->
		<div class="timeline-snap-section flex w-full scroll-mt-32 items-center justify-center py-16">
			<div class="w-full max-w-3xl px-4">
				<div
					class="card flex w-full flex-col items-center justify-center space-y-4 border border-dashed border-base-300/80 bg-base-100/30 p-8 text-center"
				>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
					>
						<Icon name="sparkles" size={24} />
					</div>
					<div>
						<h3 class="font-mono text-lg font-bold">More to come</h3>
						<p class="mt-1 text-sm text-base-content/60">Shipping ideas day by day.</p>
					</div>
					<a href="/contact" class="btn rounded-lg btn-outline btn-sm">Get in touch</a>
				</div>
			</div>
		</div>
	</div>

	{#if showBackToTop}
		<div class="fixed right-6 bottom-6 z-50">
			<button
				onclick={() => {
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}}
				class="btn btn-circle shadow-lg btn-primary"
				aria-label="Back to top"
			>
				<Icon name="chevron-up" size={24} />
			</button>
		</div>
	{/if}
</section>

<style>
	.timeline-snap-section {
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}
</style>
