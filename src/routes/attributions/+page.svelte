<script lang="ts">
	import { site } from '$lib/config';

	const attributions = [
		{
			what: 'Favicon',
			credit: 'Ide icons created by Flat Icons - Flaticon',
			href: 'https://www.flaticon.com/free-icons/ide'
		},
		{
			what: 'Markdown processing (inspired by)',
			credit: 'mvasigh/sveltekit-mdsvex-blog',
			href: 'https://github.com/mvasigh/sveltekit-mdsvex-blog'
		},
		{
			what: 'Icons',
			credit: 'Hand-drawn in the style of Lucide (ISC) and Simple Icons (CC0)',
			href: 'https://lucide.dev'
		},
		{
			what: 'Original home page photo (coffee cup, pre-2026 design)',
			credit: 'Jakub Dziubak on Unsplash',
			href: 'https://unsplash.com/photos/XtUd5SiX464'
		},
		{
			what: 'Mushroom 3D Model (STL)',
			credit: 'BSGMatt/python-renderer-BSGMatt (MIT)',
			href: 'https://github.com/BSGMatt/python-renderer-BSGMatt'
		},
		{
			what: 'Translation & Accessibility Widget',
			credit: 'Google Translate Web Element',
			href: 'https://translate.google.com'
		},
		{
			what: 'Brand Fonts (Space Grotesk, Plus Jakarta Sans)',
			credit: 'Florian Karsten & Tokotype (OFL)',
			href: 'https://fonts.google.com'
		}
	];
</script>

<svelte:head>
	<title>{site.title} · Attributions</title>
	<meta name="description" content="Credits for assets and inspiration used on this website." />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12">
	<div class="prose prose-lg max-w-none">
		<h1 class="font-mono">Attributions</h1>
		<p>Credit where credit is due 🙏</p>
		<ul>
			{#each attributions as item (item.what)}
				<li>
					{item.what} — <a href={item.href} target="_blank" rel="noreferrer">{item.credit}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
