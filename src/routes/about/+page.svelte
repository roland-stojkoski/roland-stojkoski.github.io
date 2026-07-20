<script lang="ts">
	import { site } from '$lib/config';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
</script>

<svelte:head>
	<title>{site.title} · About</title>
	<meta name="description" content="About Roland Stojkoski, Systems Development Engineer." />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12">
	<div class="flex flex-col items-center gap-8 md:flex-row md:items-start">
		<div class="avatar">
			<div class="w-36 rounded-full ring-4 ring-primary/60 ring-offset-4 ring-offset-transparent">
				<img src="/rs-high-res-current-photo-cropped.jpg" alt={site.title} />
			</div>
		</div>
		<div class="prose prose-lg">
			<h1 class="font-mono">About me</h1>
			<p>
				I'm a Systems Development Engineer who loves all things tech and how it can make a positive
				impact on the world. My passion lies in reducing complexity, automation, big data and
				networking. I've tackled every aspect of software development, from design to testing, and
				have a strong grip on big data, automation and cloud computing.
			</p>
			<p>
				I am always seeking new challenges and opportunities to expand my skillset. I have a
				particular interest in exploring blockchain systems, multi-cloud provider tools and building
				the next generation of the Internet. I believe in using technology for the greater good and
				I am a firm believer that community drives the software.
			</p>
			<p>
				Take a look at <a href="/#timeline">my timeline</a> to see what I can bring to the table. Let's
				change the world, by committing to/the code!
			</p>
		</div>
	</div>
	<div class="mt-8 flex justify-center md:justify-end">
		<SocialLinks />
	</div>
</div>
