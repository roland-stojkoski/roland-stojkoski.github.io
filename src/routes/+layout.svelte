<script>
	import '../app.postcss';
	import '/node_modules/flag-icons/css/flag-icons.min.css';
	import Nav from '$lib/Nav.svelte';
	import Footer from '$lib/Footer.svelte';
</script>

<Nav />
<slot />
<Footer />
