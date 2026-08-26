<script lang="ts">
	import type { TimelineYear } from '$lib/data/timeline';

	interface Props {
		years: TimelineYear[];
		activeYear?: number;
	}

	let { years, activeYear }: Props = $props();

	let strip = $state<HTMLDivElement | null>(null);

	function jump(year: number) {
		document.getElementById(`year-${year}`)?.scrollIntoView({ block: 'start' });
	}

	// Keep the active year's chip centered as the page scrolls past entries.
	// jsdom (unit tests) has no Element.scrollTo.
	$effect(() => {
		if (activeYear === undefined || !strip || typeof strip.scrollTo !== 'function') return;
		const chip = strip.querySelector<HTMLElement>(`[data-year="${activeYear}"]`);
		if (!chip) return;
		strip.scrollTo({
			left: chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2,
			behavior: 'smooth'
		});
	});

	const label = (count: number) => `${count} ${count === 1 ? 'entry' : 'entries'}`;
</script>

{#if years.length > 0}
	<div
		bind:this={strip}
		class="scrubber relative flex items-end gap-0.5 overflow-x-auto px-8 py-2.5"
		role="group"
		aria-label="Timeline years"
	>
		{#each years as { year, count, hasArticle, weight } (year)}
			{@const active = year === activeYear}
			<button
				type="button"
				data-year={year}
				class="group flex shrink-0 flex-col items-center gap-1 rounded-md px-1.5 pt-1 pb-0.5 transition-colors hover:bg-base-200/60"
				disabled={count === 0}
				onclick={() => jump(year)}
				aria-label={count === 0 ? `${year} — no entries` : `Jump to ${year} (${label(count)})`}
				aria-current={active ? 'true' : undefined}
				title={count === 0 ? undefined : `${year} · ${label(count)}`}
			>
				<span
					class="w-1.5 rounded-full transition-all duration-300 {active
						? 'bg-primary'
						: hasArticle
							? 'bg-primary/45 group-hover:bg-primary/70'
							: count > 0
								? 'bg-base-content/30 group-hover:bg-base-content/55'
								: 'bg-base-content/10'}"
					style="height: {4 + Math.round(weight * 28)}px"
				></span>
				<span
					class="font-mono text-[9px] leading-none {active
						? 'font-bold text-primary'
						: count > 0
							? 'text-base-content/60'
							: 'text-base-content/25'}"
				>
					'{String(year).slice(-2)}
				</span>
			</button>
		{/each}
	</div>
{/if}

<style>
	.scrubber {
		scrollbar-width: none;
		mask-image: linear-gradient(
			to right,
			transparent,
			black 2rem,
			black calc(100% - 2rem),
			transparent
		);
	}

	.scrubber::-webkit-scrollbar {
		display: none;
	}

	/* Centers the chips when they fit, degrades to normal scrolling when they
	   overflow (justify-center would clip the leading edge instead). */
	.scrubber > :first-child {
		margin-left: auto;
	}

	.scrubber > :last-child {
		margin-right: auto;
	}

	.scrubber button:disabled {
		pointer-events: none;
	}
</style>
