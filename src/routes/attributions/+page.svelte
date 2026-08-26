<script lang="ts">
	import { site } from '$lib/config';

	// HACK: the notices are served from static/THIRD-PARTY-NOTICES.md, a
	// hand-kept byte-for-byte copy of the repo-root file — adapter-static
	// publishes only static/, and there is no build step to copy it, so `cmp`
	// the two whenever either changes.
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
			what: 'Icons (outline set)',
			credit:
				'Lucide (ISC) — © Lucide Icons and Contributors. Most stroke glyphs; some copied verbatim, others reordered, rounded or simplified on the same 24×24 grid.',
			href: 'https://lucide.dev'
		},
		{
			what: 'Icons (Feather-lineage glyphs)',
			credit:
				'Feather (MIT) — © 2013-2023 Cole Bemis. Copy, check, instagram, briefcase and file-text come straight from Feather; the chevrons, arrows, clipboard, external-link, moon, rss and search reach the site through Lucide but stay under Feather’s terms. Instagram and its logo are trademarks of Meta Platforms, Inc.',
			href: 'https://feathericons.com'
		},
		{
			what: 'Icons (GitHub mark)',
			credit:
				'Simple Icons (CC0 1.0) — used verbatim. GitHub and its logo are trademarks of GitHub, Inc.',
			href: 'https://simpleicons.org'
		},
		{
			what: 'Icons (LinkedIn mark)',
			credit:
				'Simple Icons (CC0 1.0), from release 13.21.0 — the set dropped its LinkedIn mark in 14.0.0, so there is no current upstream to point at. LinkedIn and its logo are trademarks of LinkedIn Corporation.',
			href: 'https://github.com/simple-icons/simple-icons/blob/13.21.0/icons/linkedin.svg'
		},
		{
			what: 'Icon licence texts (ISC, MIT, CC0) in full',
			credit: 'THIRD-PARTY-NOTICES.md, with a per-glyph provenance table',
			href: '/THIRD-PARTY-NOTICES.md'
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
