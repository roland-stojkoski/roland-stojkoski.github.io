<script lang="ts">
	import Icon from './Icon.svelte';
	import type { TimelineEntry } from '$lib/data/timeline';

	interface Props {
		entries: TimelineEntry[];
	}

	let { entries }: Props = $props();

	const formatDate = (date: Date) =>
		date.toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' });
</script>

<section id="timeline" class="mx-auto max-w-5xl scroll-mt-24 px-4 pb-24">
	<h2 class="mb-10 text-center text-3xl font-bold">
		<span class="text-gradient">/dev/timeline</span>
	</h2>

	<ul class="timeline timeline-vertical timeline-snap-icon max-md:timeline-compact">
		<li>
			<div class="timeline-middle">
				<span
					class="flex h-9 w-9 items-center justify-center rounded-full bg-base-300 text-base-content/70"
				>
					<Icon name="infinity" size={18} label="More to come" />
				</span>
			</div>
			<div class="timeline-start mb-10 md:text-end">
				<p class="flex items-center gap-2 font-mono text-sm text-base-content/60 md:justify-end">
					more to come <Icon name="sparkles" size={16} />
				</p>
			</div>
			<hr />
		</li>
		{#each entries as entry, i (entry.kind === 'article' ? entry.slug : entry.title + entry.dateLabel)}
			{@const side = i % 2 === 0 ? 'timeline-end' : 'timeline-start md:text-end'}
			<li>
				<hr />
				<div class="timeline-middle">
					<span
						class="{entry.kind === 'article'
							? 'bg-primary text-primary-content'
							: 'bg-base-300 text-base-content/70'} flex h-9 w-9 items-center justify-center rounded-full"
					>
						<Icon name={entry.kind === 'article' ? 'file-text' : entry.icon} size={18} />
					</span>
				</div>
				<div class="{side} mb-10">
					{#if entry.kind === 'article'}
						<time class="font-mono text-sm italic opacity-60">{formatDate(entry.date)}</time>
						<div
							class="card mt-2 border border-base-300/60 bg-base-200 text-left shadow-sm transition-shadow hover:shadow-md"
						>
							<div class="card-body p-5">
								<h3 class="card-title text-lg">
									<a href={entry.href} class="link-hover">{entry.title}</a>
								</h3>
								<p class="text-sm text-base-content/70">{entry.tldr}</p>
								<div class="mt-2 card-actions">
									<a href={entry.href} class="btn btn-primary btn-sm">
										Read article <Icon name="arrow-up-right" size={14} />
									</a>
									{#if entry.githubLink}
										<a
											href={entry.githubLink}
											target="_blank"
											rel="noreferrer"
											class="btn btn-ghost btn-sm"
										>
											<Icon name="github" size={14} /> GitHub
										</a>
									{/if}
								</div>
							</div>
						</div>
					{:else}
						<time class="font-mono text-sm italic opacity-60">{entry.dateLabel}</time>
						<h3 class="mt-1 font-mono text-base font-semibold">{entry.title}</h3>
						{#if entry.subtitle}
							<p class="text-sm text-base-content/60">{entry.subtitle}</p>
						{/if}
					{/if}
				</div>
				{#if i < entries.length - 1}
					<hr />
				{/if}
			</li>
		{/each}
	</ul>
</section>
