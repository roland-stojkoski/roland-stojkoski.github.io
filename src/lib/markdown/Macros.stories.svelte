<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import YouTube from './YouTube.svelte';
	import Figure from './Figure.svelte';
	import Compare from './Compare.svelte';
	import StlViewer from './StlViewer.svelte';

	const { Story } = defineMeta({
		title: 'Markdown macros',
		parameters: { layout: 'padded' }
	});
</script>

<Story name="YouTube" asChild>
	<YouTube id="dQw4w9WgXcQ" title="Demo video" />
</Story>

<Story name="Figure" asChild>
	<Figure
		src="/modernize-2026/before.png"
		alt="Screenshot of the old site"
		caption="The 2023 design"
	/>
</Story>

<Story name="Compare" asChild>
	<Compare
		before="/modernize-2026/before.png"
		after="/modernize-2026/before-dark.png"
		beforeAlt="2023"
		afterAlt="2026"
		caption="Drag the slider"
	/>
</Story>

<Story name="StlViewer" asChild>
	<StlViewer src="/modernize-2026/torus-knot.stl" caption="Torus knot demo" height={360} />
</Story>
