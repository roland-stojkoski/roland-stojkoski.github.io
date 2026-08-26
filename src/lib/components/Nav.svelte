<script lang="ts">
	import Icon from './Icon.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import AccessibilityMenu from './AccessibilityMenu.svelte';
	import { allArticles } from '$lib/utils/articles';

	// Load articles dynamically for the submenu
	const modules = import.meta.glob('$lib/assets/articles/*.md', { eager: true }) as Record<
		string,
		{ metadata?: unknown }
	>;
	const navArticles = allArticles(modules);

	const formatDate = (date: Date) =>
		date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
</script>

<header class="sticky top-0 z-50 border-b border-base-300/40 bg-base-100/75 backdrop-blur-md">
	<nav
		class="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5"
		aria-label="Main navigation"
	>
		<!-- Left side: Mobile Menu + Brand Logo -->
		<div class="flex min-w-0 items-center gap-3">
			<div class="dropdown md:hidden">
				<button tabindex="0" class="btn btn-square rounded-lg btn-ghost" aria-label="Open menu">
					<Icon name="menu" />
				</button>
				<ul
					class="dropdown-content menu z-50 mt-3 w-52 gap-1 rounded-box bg-base-200 p-2 shadow-lg"
				>
					<li>
						<a href="/"><Icon name="home" size={16} /> Home</a>
					</li>
					<li>
						<a href="/articles"><Icon name="file-text" size={16} /> Articles</a>
					</li>
					<li>
						<a href="/about"><Icon name="user" size={16} /> About</a>
					</li>
					<li>
						<a href="/attributions"><Icon name="award" size={16} /> Attributions</a>
					</li>
					<li>
						<a href="/contact"><Icon name="mail" size={16} /> Contact</a>
					</li>
				</ul>
			</div>

			<!-- Desktop Logo -->
			<a href="/" class="group hidden items-center gap-2.5 md:flex">
				<div class="avatar">
					<div
						class="w-8 rounded-lg ring-1 ring-base-content/10 ring-offset-1 ring-offset-transparent transition-all duration-300 group-hover:scale-105 group-hover:ring-primary"
					>
						<img
							src="/rs-high-res-current-photo-cropped.jpg"
							alt="Roly"
							class="rounded-lg object-cover"
						/>
					</div>
				</div>
				<div class="flex flex-col items-start gap-0">
					<span
						class="font-title text-sm leading-none font-extrabold tracking-wide text-base-content/90 transition-colors group-hover:text-primary"
					>
						roland stojkoski
					</span>
					<span class="mt-0.5 font-mono text-[9px] leading-none tracking-wider opacity-50">
						/sys/dev
					</span>
				</div>
			</a>

			<!-- Mobile Logo -->
			<a href="/" class="flex min-w-0 items-center gap-2 text-left md:hidden">
				<div class="avatar shrink-0">
					<div class="w-7 rounded-lg ring-1 ring-base-content/10">
						<img
							src="/rs-high-res-current-photo-cropped.jpg"
							alt="Roly"
							class="rounded-lg object-cover"
						/>
					</div>
				</div>
				<div class="flex min-w-0 flex-col items-start gap-0">
					<span class="font-title truncate text-xs leading-none font-extrabold tracking-wide">
						roland stojkoski
					</span>
					<span class="mt-0.5 font-mono text-[8px] leading-none opacity-50"> /sys/dev </span>
				</div>
			</a>
		</div>

		<!-- Right side: Menu Links + Toggles -->
		<div class="flex shrink-0 items-center gap-1.5">
			<ul class="menu menu-horizontal hidden flex-nowrap gap-1.5 px-1 font-mono text-sm md:flex">
				<!-- Desktop Dropdown Submenu for Articles -->
				<li class="dropdown-hover dropdown dropdown-end">
					<a
						href="/articles"
						class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all hover:bg-base-200/60 active:bg-base-300/60"
					>
						<Icon name="file-text" size={14} class="opacity-70" />
						Articles
						<Icon name="chevron-down" size={12} strokeWidth={2.5} class="opacity-60" />
					</a>
					<ul
						class="dropdown-content menu z-50 mt-1 w-80 gap-0.5 rounded-xl border border-base-300/40 bg-base-100/95 p-1.5 shadow-xl backdrop-blur-md before:absolute before:-top-3 before:right-0 before:left-0 before:h-3 before:content-['']"
					>
						<span
							class="block px-3 py-1.5 text-left text-[10px] font-bold tracking-wider uppercase opacity-50"
							>Recent Articles</span
						>
						{#each navArticles.slice(0, 5) as article (article.slug)}
							<li>
								<a
									href={article.href}
									class="flex w-full min-w-0 flex-col items-start gap-0.5 rounded-lg px-3 py-1.5 text-left transition-all hover:bg-primary/10 hover:text-primary"
								>
									<span
										class="block max-w-[210px] truncate text-xs leading-tight font-semibold text-base-content/90"
									>
										{article.title}
									</span>
									<span class="font-mono text-[9px] opacity-60">
										{formatDate(article.date)}
									</span>
								</a>
							</li>
						{/each}
						{#if navArticles.length > 5}
							<li class="divider my-1 opacity-40"></li>
						{/if}
						<li>
							<a
								href="/articles"
								class="justify-center rounded-lg px-3 py-2 text-center text-xs font-bold text-primary transition-all hover:bg-primary/15 active:bg-primary/20"
							>
								View All Articles ({navArticles.length})
							</a>
						</li>
					</ul>
				</li>
				<li>
					<a
						href="/about"
						class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all hover:bg-base-200/60 active:bg-base-300/60"
					>
						<Icon name="user" size={14} class="opacity-70" />
						About
					</a>
				</li>
				<li>
					<a
						href="/attributions"
						class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all hover:bg-base-200/60 active:bg-base-300/60"
					>
						<Icon name="award" size={14} class="opacity-70" />
						Attributions
					</a>
				</li>
				<li>
					<a
						href="/contact"
						class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all hover:bg-base-200/60 active:bg-base-300/60"
					>
						<Icon name="mail" size={14} class="opacity-70" />
						Contact
					</a>
				</li>
			</ul>
			<AccessibilityMenu />
			<ThemeToggle />
		</div>
	</nav>
</header>
