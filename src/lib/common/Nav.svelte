<script>
	import { base } from '$app/paths';
	import { Avatar } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<div class="dropdown">
			<label tabindex="0" class="btn btn-ghost btn-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					/>
				</svg>
			</label>
			<ul
				tabindex="0"
				class="menu menu-normal dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box"
			>
				<li><a href="{base}/"><i class="fa-solid fa-house" /> Homepage</a></li>
				<li><a href="{base}/about"><i class="fa-solid fa-book" /> About</a></li>
				<li><a href="{base}/attributions"><i class="fa-solid fa-medal" /> Attributions</a></li>
				<li><a href="{base}/contact"><i class="fa-solid fa-envelope" /> Contact</a></li>
			</ul>
		</div>
	</div>
	<div class="navbar-center">
		<Avatar class="mr-3" src="/rs-high-res-current-photo-cropped.jpg" rounded />
		<span
			class="hidden self-center whitespace-nowrap text-xl font-semibold dark:text-white md:block"
		>
			Roland Stojkoski 👷‍♂️
		</span>
	</div>
	<div class="navbar-end">
		<input
			type="checkbox"
			class="toggle"
			data-toggle-theme="coffee,retro"
			data-act-class="ACTIVECLASS"
			checked
		/>
	</div>
</div>
