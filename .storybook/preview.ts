import type { Preview } from '@storybook/sveltekit';
import '../src/app.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';

const preview: Preview = {
	globalTypes: {
		theme: {
			description: 'daisyUI theme',
			toolbar: {
				title: 'Theme',
				icon: 'paintbrush',
				items: ['latte', 'espresso'],
				dynamicTitle: true
			}
		}
	},
	initialGlobals: {
		theme: 'latte'
	},
	decorators: [
		(story, context) => {
			document.documentElement.setAttribute('data-theme', context.globals.theme);
			document.body.style.backgroundColor = 'var(--color-base-100)';
			return story();
		}
	]
};

export default preview;
