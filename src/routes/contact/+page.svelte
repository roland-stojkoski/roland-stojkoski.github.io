<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
	import { site } from '$lib/config';

	const contactFormUrl =
		'https://us13.list-manage.com/contact-form?u=9686f238f91d4f6de32382fe3&form_id=c320ff8e1d9e488ffacec0a4404b6ee7';
	const subscribeUrl =
		'https://github.us13.list-manage.com/subscribe/post?u=9686f238f91d4f6de32382fe3&id=cf994d4ec5&f_id=002cdbe2f0';
</script>

<svelte:head>
	<title>{site.title} · Contact</title>
	<meta name="description" content="Get in touch with Roland Stojkoski or subscribe for updates." />
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
</div>
