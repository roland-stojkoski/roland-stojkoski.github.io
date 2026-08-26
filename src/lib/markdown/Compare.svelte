<script lang="ts">
	interface Props {
		before: string;
		after: string;
		beforeAlt?: string;
		afterAlt?: string;
		caption?: string;
	}

	let { before, after, beforeAlt = 'Before', afterAlt = 'After', caption }: Props = $props();

	let position = $state(50);
</script>

<figure class="not-prose my-8">
	<div
		class="relative w-full overflow-hidden rounded-box border border-base-300/60 shadow-md select-none"
	>
		<img src={after} alt={afterAlt} class="block w-full" draggable="false" />
		<div class="absolute inset-0 overflow-hidden" style="clip-path: inset(0 {100 - position}% 0 0)">
			<img src={before} alt={beforeAlt} class="block w-full" draggable="false" />
		</div>
		<div
			class="pointer-events-none absolute inset-y-0 w-0.5 bg-primary"
			style="left: {position}%"
		></div>
		<span class="pointer-events-none absolute top-3 left-3 badge badge-neutral">{beforeAlt}</span>
		<span class="pointer-events-none absolute top-3 right-3 badge badge-primary">{afterAlt}</span>
		<input
			type="range"
			min="0"
			max="100"
			bind:value={position}
			class="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
			aria-label="Drag to compare {beforeAlt} and {afterAlt}"
		/>
	</div>
	{#if caption}
		<figcaption class="mt-3 text-center font-mono text-sm text-base-content/60">
			{caption}
		</figcaption>
	{/if}
</figure>
