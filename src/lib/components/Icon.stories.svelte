<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Icon from './Icon.svelte';
	import { iconNames } from './icons';

	const { Story } = defineMeta({
		title: 'Components/Icon',
		component: Icon,
		argTypes: {
			name: { control: 'select', options: iconNames },
			size: { control: { type: 'range', min: 12, max: 96 } }
		}
	});
</script>

<Story name="Single" args={{ name: 'github', size: 32 }} />

<Story name="All icons" asChild>
	<div class="grid grid-cols-4 gap-6 p-6 text-base-content md:grid-cols-8">
		{#each iconNames as name (name)}
			<div class="flex flex-col items-center gap-2">
				<Icon {name} size={28} />
				<span class="font-mono text-xs opacity-60">{name}</span>
			</div>
		{/each}
	</div>
</Story>
