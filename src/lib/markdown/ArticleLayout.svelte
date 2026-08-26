<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { iconMarkup } from '$lib/components/icons';
	import Giscus from './Giscus.svelte';
	import { onMount } from 'svelte';

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

	// The copy button lives on <pre> nodes mdsvex rendered outside Svelte's
	// control, so these go in as markup rather than as <Icon>. Heavier strokes
	// than the default 2: they render at 12px on a blurred code-block backdrop.
	const copyIcon = iconMarkup('copy', { size: 12, strokeWidth: 2.5 });
	const checkIcon = iconMarkup('check', { size: 12, strokeWidth: 3, class: 'text-success' });

	onMount(() => {
		const preElements = document.querySelectorAll('.prose pre');
		preElements.forEach((pre) => {
			const preHtml = pre as HTMLPreElement;
			preHtml.style.position = 'relative';
			preHtml.classList.add('group');

			// Add language syntax badge in the corner
			let lang = '';
			const codeElement = preHtml.querySelector('code');
			if (codeElement) {
				codeElement.classList.forEach((cls) => {
					if (cls.startsWith('language-')) {
						lang = cls.replace('language-', '');
					}
				});
			}

			// If we found a language, add a badge
			if (lang) {
				const badge = document.createElement('span');
				// Capitalize common abbreviations
				let displayName = lang.toUpperCase();
				if (displayName === 'JS') displayName = 'JavaScript';
				if (displayName === 'TS') displayName = 'TypeScript';
				if (displayName === 'HTML') displayName = 'HTML';
				if (displayName === 'CSS') displayName = 'CSS';
				if (displayName === 'BASH') displayName = 'Terminal';

				badge.className =
					'absolute top-2.5 left-4 text-[9px] font-mono font-bold tracking-wider uppercase text-base-content/40 pointer-events-none select-none';
				badge.textContent = displayName;
				preHtml.appendChild(badge);

				// Push down code contents so they do not overlap badge
				preHtml.style.paddingTop = '2rem';
			}

			// Create Copy Button
			const button = document.createElement('button');
			button.className =
				'absolute top-2 right-2 h-6.5 w-6.5 flex items-center justify-center rounded-md bg-base-100/60 hover:bg-base-100/90 border border-base-300/40 text-base-content/60 hover:text-base-content transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm backdrop-blur-sm cursor-pointer';
			button.type = 'button';
			button.setAttribute('aria-label', 'Copy code');

			button.innerHTML = copyIcon;

			button.addEventListener('click', async () => {
				const codeText = codeElement?.innerText || '';
				try {
					await navigator.clipboard.writeText(codeText);
					button.innerHTML = checkIcon;
					button.classList.add('border-success/30');
					setTimeout(() => {
						button.innerHTML = copyIcon;
						button.classList.remove('border-success/30');
					}, 2000);
				} catch (err) {
					console.error('Failed to copy: ', err);
				}
			});

			preHtml.appendChild(button);
		});
	});
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
