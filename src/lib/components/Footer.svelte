<script lang="ts">
	import SocialLinks from './SocialLinks.svelte';
	import { site } from '$lib/config';

	const year = new Date().getFullYear();
</script>

<footer class="border-t border-base-300/60 bg-base-200">
	<div
		class="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-10 text-center md:flex-row md:justify-between md:text-left"
	>
		<div>
			<p class="font-mono font-semibold">{site.title}</p>
			<p class="text-sm text-base-content/60">
				© {year} · Built with <a class="link link-hover" href="https://svelte.dev">SvelteKit</a>
				· <a class="link link-hover" href={site.repo} target="_blank" rel="noreferrer">Source</a>
				· <a class="link link-hover" href="/rss.xml">RSS</a>
			</p>
		</div>
		<SocialLinks />
	</div>
</footer>
