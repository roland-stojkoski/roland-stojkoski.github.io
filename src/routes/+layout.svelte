<script>
	import '../app.postcss';
	import '/node_modules/flag-icons/css/flag-icons.min.css';
	import Nav from '$lib/common/Nav.svelte';
	import Footer from '$lib/common/Footer.svelte';
</script>

<Nav />
<slot />
<Footer />
