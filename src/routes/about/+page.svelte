<script lang="ts">
	import { site } from '$lib/config';
	import SocialLinks from '$lib/components/SocialLinks.svelte';
</script>

<svelte:head>
	<title>{site.title} · About</title>
	<meta name="description" content="About Roland Stojkoski, Systems Development Engineer." />
	<meta property="og:title" content="About Roland Stojkoski · Systems Development Engineer" />
	<meta
		property="og:description"
		content="About Roland Stojkoski (Roly), Systems Development Engineer II at AWS. Career milestones, education, tech philosophy on AI and open source."
	/>
	<meta property="og:url" content="{site.url}/about" />
	<meta property="og:type" content="profile" />
	<meta property="og:image" content="{site.url}/rs-high-res-current-photo-cropped.jpg" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="About Roland Stojkoski · Systems Development Engineer" />
	<meta
		name="twitter:description"
		content="About Roland Stojkoski (Roly), Systems Development Engineer II at AWS. Career milestones, education, tech philosophy on AI and open source."
	/>
	<meta name="twitter:image" content="{site.url}/rs-high-res-current-photo-cropped.jpg" />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12">
	<div class="flex flex-col items-center gap-8 md:flex-row md:items-start">
		<div class="avatar">
			<div class="w-36 rounded-2xl ring-4 ring-primary/60 ring-offset-4 ring-offset-transparent">
				<img src="/rs-high-res-current-photo-cropped.jpg" alt={site.title} />
			</div>
		</div>
		<div class="prose prose-lg">
			<h1 class="font-mono">About me</h1>

			<p>
				Hello! I'm Roland Stojkoski (commonly known as Roly). I'm a Systems Development Engineer at
				Amazon Web Services (AWS). My career is driven by a deep curiosity about how systems
				function, from high-level abstractions down to the hardware layers.
			</p>

			<h2>My Journey</h2>
			<p>
				I was born in 1997 and spent my early life and high school years in the coastal city of
				Pula, Croatia. In 2016, seeking new learning opportunities, I moved to Dublin, Ireland,
				where I attended Griffith College and graduated with a degree in software development.
			</p>
			<p>
				During college, I landed an internship at AWS in 2019, which solidified my interest in cloud
				computing, automation, and large-scale infrastructure. After graduation in 2020, I joined
				AWS full-time as a Systems Development Engineer I, and was promoted to Systems Development
				Engineer II in 2022. In 2025, my cloud engineering journey led me to move from Ireland to
				the United States, where I currently live and work.
			</p>

			<h2>Down to the Hardware Layer</h2>
			<p>
				We live in a fascinating era of engineering. Modern AI systems have become incredible force
				multipliers, automating code generation and solving complex problems in seconds. I fully
				embrace AI tools in my daily workflow, but I believe that tools should never replace
				fundamental understanding.
			</p>
			<p>
				Abstractions are useful, but they leak. To build truly resilient, performant systems, we
				must understand what happens underneath: how high-level code compiles into machine
				instructions, how network packets route across routing tables, and how data writes to
				physical silicon. My passion lies in digging as deep as possible down to the hardware layer
				to demystify complex systems.
			</p>

			<h2>Open Source & Pragmatism</h2>
			<p>
				I believe that open-source software is a phenomenal benefit for humanity. It democratizes
				access to knowledge, speeds up innovation, and allows engineers worldwide to learn from
				real-world implementations.
			</p>
			<p>
				However, I also maintain a pragmatic view of software development. While open source is
				ideal where possible, keeping certain systems closed-source—such as core security layers,
				compliance-sensitive architectures, or proprietary engines—is sometimes necessary and
				reasonable. A hybrid approach allows businesses to maintain safety and fund ongoing research
				while still contributing value back to the open community.
			</p>

			<h2>Sustainability & Free Software</h2>
			<p>
				Education and technology should be accessible. I believe it is critical to keep the barrier
				of entry extremely low, providing free access to core platforms, basic features, and
				learning resources so that anyone—regardless of background—can begin building.
			</p>
			<p>
				At the same time, developing software, managing databases, and keeping server infrastructure
				alive is expensive. To keep projects sustainable, it is completely reasonable to require
				payment for advanced, enterprise, or resource-heavy features. This ensures that the
				developers and builders who keep the infrastructure running are fairly compensated for their
				labor, creating a sustainable software cycle.
			</p>

			<p>
				Take a look at <a href="/#timeline">my timeline</a> to see what I can bring to the table. Let's
				change the world, by committing to the code!
			</p>
		</div>
	</div>
	<div class="mt-8 flex justify-center md:justify-end">
		<SocialLinks />
	</div>
</div>
