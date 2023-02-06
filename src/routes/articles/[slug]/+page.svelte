<script lang="ts">
	import Container from '$lib/common/Container.svelte';

	export let data: {
		component: string;
		frontmatter: string;
	};
</script>

<svelte:head>
	<title>{data.frontmatter.title}</title>
</svelte:head>

<Container>
	<svelte:component this={data.component} />
</Container>
