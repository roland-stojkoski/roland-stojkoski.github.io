<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		caption?: string;
	}

	let { src, alt, caption }: Props = $props();
</script>

<figure class="not-prose my-8">
	<img
		{src}
		{alt}
		loading="lazy"
		class="mx-auto max-h-[36rem] w-auto max-w-full rounded-box border border-base-300/60 shadow-md"
	/>
	{#if caption}
		<figcaption class="mt-3 text-center font-mono text-sm text-base-content/60">
			{caption}
		</figcaption>
	{/if}
</figure>
