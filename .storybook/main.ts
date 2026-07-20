import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|ts|svelte)'],
	staticDirs: ['../static'],
	addons: ['@storybook/addon-svelte-csf'],
	framework: {
		name: '@storybook/sveltekit',
		options: {}
	}
};

export default config;
