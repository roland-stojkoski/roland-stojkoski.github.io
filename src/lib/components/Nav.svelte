<script lang="ts">
	import Icon from './Icon.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { site } from '$lib/config';

	const links = [
		{ href: '/', label: 'Home', icon: 'home' },
		{ href: '/about', label: 'About', icon: 'user' },
		{ href: '/attributions', label: 'Attributions', icon: 'award' },
		{ href: '/contact', label: 'Contact', icon: 'mail' }
	] as const;
</script>

<header
	class="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/80 backdrop-blur-lg supports-[backdrop-filter]:backdrop-blur-lg"
>
	<nav class="navbar mx-auto max-w-5xl px-4" aria-label="Main navigation">
		<div class="navbar-start">
			<div class="dropdown md:hidden">
				<button tabindex="0" class="btn btn-circle btn-ghost" aria-label="Open menu">
					<Icon name="menu" />
				</button>
				<ul
					class="dropdown-content menu z-50 mt-3 w-52 gap-1 rounded-box bg-base-200 p-2 shadow-lg"
				>
					{#each links as link (link.href)}
						<li>
							<a href={link.href}><Icon name={link.icon} size={16} /> {link.label}</a>
						</li>
					{/each}
				</ul>
			</div>
			<a href="/" class="group hidden items-center gap-3 md:flex">
				<div class="avatar">
					<div
						class="w-9 rounded-full ring-2 ring-primary/60 ring-offset-2 ring-offset-transparent transition-all group-hover:ring-primary"
					>
						<img src="/rs-high-res-current-photo-cropped.jpg" alt={site.title} />
					</div>
				</div>
				<span class="font-mono text-lg font-semibold tracking-tight">{site.title}</span>
			</a>
		</div>
		<div class="navbar-center md:hidden">
			<a href="/" class="flex items-center gap-2">
				<div class="avatar">
					<div class="w-8 rounded-full ring-2 ring-primary/60">
						<img src="/rs-high-res-current-photo-cropped.jpg" alt={site.title} />
					</div>
				</div>
				<span class="font-mono font-semibold">{site.title}</span>
			</a>
		</div>
		<div class="navbar-end gap-1">
			<ul class="menu menu-horizontal hidden gap-1 px-1 md:flex">
				{#each links.slice(1) as link (link.href)}
					<li><a href={link.href} class="rounded-field">{link.label}</a></li>
				{/each}
			</ul>
			<ThemeToggle />
		</div>
	</nav>
</header>
