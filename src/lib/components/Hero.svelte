<script lang="ts">
	import Icon from './Icon.svelte';
	import SocialLinks from './SocialLinks.svelte';
</script>

<section class="relative overflow-hidden">
	<div
		class="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-radial from-primary/15 to-transparent blur-2xl"
	></div>
	<div
		class="pointer-events-none absolute top-24 -right-24 h-80 w-80 rounded-full bg-radial from-accent/10 to-transparent blur-2xl"
	></div>

	<div
		class="relative mx-auto grid max-w-5xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28"
	>
		<div class="space-y-6">
			<p class="font-mono text-sm text-base-content/60">// portfolio &amp; dev timeline</p>
			<h1 class="text-4xl leading-tight font-bold md:text-5xl">
				Hi, I'm <span class="text-gradient">Roland</span>.
			</h1>
			<p class="max-w-md text-lg text-base-content/80">
				Systems Development Engineer @ AWS. I automate, break, fix and occasionally write about it.
				Below is a timeline of my dev life — notable projects, articles and events.
			</p>
			<div class="flex flex-wrap gap-3">
				<a href="#timeline" class="btn btn-primary">
					Explore the timeline <Icon name="arrow-down" size={18} />
				</a>
				<a href="/contact" class="btn btn-outline">Get in touch</a>
			</div>
			<SocialLinks class="-ml-2" />
		</div>

		<div class="mockup-code border border-base-300/60 shadow-xl">
			<pre data-prefix="$"><code>whoami</code></pre>
			<pre data-prefix=">" class="text-primary"><code>roland — sysde @ aws</code></pre>
			<pre data-prefix="$"><code>cat interests.txt</code></pre>
			<pre data-prefix=">" class="text-accent"><code>automation · big data · networking</code></pre>
			<pre data-prefix="$"><code>uptime</code></pre>
			<pre data-prefix=">" class="text-base-content/60"><code>shipping since 1997</code></pre>
			<pre data-prefix="$" class="animate-pulse"><code>█</code></pre>
		</div>
	</div>
</section>
