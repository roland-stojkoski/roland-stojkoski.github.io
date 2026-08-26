<script lang="ts">
	interface Props {
		/** The video id, e.g. `dQw4w9WgXcQ` from youtube.com/watch?v=dQw4w9WgXcQ */
		id: string;
		title?: string;
	}

	let { id, title = 'YouTube video' }: Props = $props();

	// Lite-embed: show the thumbnail only and load the iframe on demand,
	// so article pages stay fast and cookie-free until the reader opts in.
	let playing = $state(false);

	const thumbnail = $derived(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
	const embedUrl = $derived(`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`);
</script>

<figure class="not-prose my-8 overflow-hidden rounded-box border border-base-300/60 shadow-md">
	<div class="relative aspect-video w-full">
		{#if playing}
			<iframe
				class="absolute inset-0 h-full w-full"
				src={embedUrl}
				{title}
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		{:else}
			<button
				type="button"
				class="group absolute inset-0 h-full w-full cursor-pointer"
				onclick={() => (playing = true)}
				aria-label="Play video: {title}"
			>
				<img src={thumbnail} alt={title} class="h-full w-full object-cover" loading="lazy" />
				<span
					class="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40"
				>
					<span
						class="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg transition-transform group-hover:scale-110"
					>
						<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
							<path d="M8 5.14v13.72L19 12 8 5.14z" />
						</svg>
					</span>
				</span>
			</button>
		{/if}
	</div>
</figure>
