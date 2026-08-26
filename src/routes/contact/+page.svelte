<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import { site } from '$lib/config';
	import { onMount } from 'svelte';

	const contactFormUrl =
		'https://us13.list-manage.com/contact-form?u=9686f238f91d4f6de32382fe3&form_id=c320ff8e1d9e488ffacec0a4404b6ee7';
	const subscribeUrl =
		'https://github.us13.list-manage.com/subscribe/post?u=9686f238f91d4f6de32382fe3&id=cf994d4ec5&f_id=002cdbe2f0';

	let rssUrl = $state('https://rolandstojkoski.github.io/rss.xml');
	let rssCopied = $state(false);

	onMount(() => {
		rssUrl = `${window.location.origin}/rss.xml`;
	});

	async function copyRssUrl() {
		try {
			await navigator.clipboard.writeText(rssUrl);
			rssCopied = true;
			setTimeout(() => {
				rssCopied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy RSS URL:', err);
		}
	}
</script>

<svelte:head>
	<title>{site.title} · Contact</title>
	<meta name="description" content="Get in touch with Roland Stojkoski or subscribe for updates." />
	<meta property="og:title" content="Contact Roland Stojkoski · Systems Development Engineer" />
	<meta
		property="og:description"
		content="Get in touch with Roland Stojkoski. Submit a message, find social profiles, or subscribe to the RSS feed."
	/>
	<meta property="og:url" content="{site.url}/contact" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{site.url}/rs-high-res-current-photo-cropped.jpg" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Contact Roland Stojkoski · Systems Development Engineer" />
	<meta
		name="twitter:description"
		content="Get in touch with Roland Stojkoski. Submit a message, find social profiles, or subscribe to the RSS feed."
	/>
	<meta name="twitter:image" content="{site.url}/rs-high-res-current-photo-cropped.jpg" />
</svelte:head>

<div class="mx-auto max-w-3xl space-y-8 px-4 py-12">
	<div class="prose prose-lg max-w-none">
		<h1 class="font-mono">Contact</h1>
		<p>
			If you are interested in collaborating, found something wrong with the website, would just
			like to chat or anything else — reach out. I look forward to hearing from you 😀
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2">
		<div class="card border border-base-300/60 bg-base-200 shadow-sm">
			<div class="card-body">
				<h2 class="card-title font-mono"><Icon name="mail" size={18} /> Say hello</h2>
				<p class="text-sm text-base-content/70">
					Use the contact form, or ping me on any of my socials.
				</p>
				<div class="mt-2 card-actions items-center justify-between">
					<a href={contactFormUrl} target="_blank" rel="noreferrer" class="btn btn-primary">
						Open contact form <Icon name="arrow-up-right" size={14} />
					</a>
				</div>
				<SocialLinks class="-ml-2" size={18} />
			</div>
		</div>

		<div class="card border border-base-300/60 bg-base-200 shadow-sm">
			<div class="card-body">
				<h2 class="card-title font-mono"><Icon name="sparkles" size={18} /> Subscribe</h2>
				<p class="text-sm text-base-content/70">
					Receive emails about the latest articles, events &amp; projects. No spam.
				</p>
				<form action={subscribeUrl} method="post" target="_self" class="mt-2">
					<div class="join w-full">
						<label class="input join-item w-full">
							<Icon name="mail" size={16} class="opacity-50" />
							<input
								type="email"
								name="EMAIL"
								placeholder="you@example.com"
								required
								autocomplete="email"
							/>
						</label>
						<button type="submit" class="btn join-item btn-primary">Subscribe</button>
					</div>
					<!-- Mailchimp bot honeypot; must stay present and empty -->
					<div style="position: absolute; left: -5000px" aria-hidden="true">
						<input
							type="text"
							name="b_9686f238f91d4f6de32382fe3_cf994d4ec5"
							tabindex="-1"
							value=""
						/>
					</div>
				</form>
			</div>
		</div>
	</div>

	<!-- RSS Feed Access -->
	<div class="card w-full border border-base-300/60 bg-base-200 shadow-sm">
		<div class="card-body">
			<h2 class="card-title font-mono">
				<Icon name="rss" size={18} class="text-primary" /> RSS Feed
			</h2>
			<div class="mt-2 grid items-start gap-6 md:grid-cols-3">
				<div class="space-y-3 text-sm text-base-content/70 md:col-span-2">
					<p>
						Prefer not to share your email? Subscribe directly using the **RSS Feed**. RSS allows
						you to read updates in a feed reader app without any tracking, algorithms, or email
						subscription spam.
					</p>
					<div class="flex flex-wrap items-center gap-2 pt-1">
						<span
							class="block max-w-full truncate rounded-lg border border-base-300/30 bg-base-300/50 px-3 py-1.5 font-mono text-xs select-all"
						>
							{rssUrl}
						</span>
						<button
							class="btn flex items-center gap-1.5 rounded-lg btn-outline btn-sm"
							onclick={copyRssUrl}
						>
							{#if rssCopied}
								<Icon name="check" size={12} strokeWidth={3} class="text-success" />
								Copied!
							{:else}
								<Icon name="clipboard" size={12} strokeWidth={2.5} />
								Copy URL
							{/if}
						</button>
					</div>
				</div>
				<div class="space-y-2 rounded-xl border border-base-300/30 bg-base-300/20 p-4">
					<span class="block font-mono text-[10px] font-bold tracking-wider uppercase opacity-60"
						>// quick links</span
					>
					<div class="flex flex-col gap-2 text-xs">
						<a
							href="/rss.xml"
							target="_blank"
							class="flex link items-center gap-1.5 text-base-content/85 link-hover hover:text-primary"
						>
							<Icon name="file-text" size={13} /> Open Raw XML Feed
						</a>
						<a
							href="https://feedly.com"
							target="_blank"
							rel="noreferrer"
							class="flex link items-center gap-1.5 text-base-content/85 link-hover hover:text-primary"
						>
							<Icon name="arrow-up-right" size={13} /> Feedly (Web/Mobile)
						</a>
						<a
							href="https://netnewswire.com"
							target="_blank"
							rel="noreferrer"
							class="flex link items-center gap-1.5 text-base-content/85 link-hover hover:text-primary"
						>
							<Icon name="arrow-up-right" size={13} /> NetNewsWire (Mac/iOS)
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
