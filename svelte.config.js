import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { readdirSync } from 'fs';

const articleFolder = './src/lib/assets/articles/';
const articlePaths = readdirSync(articleFolder).map(
	(file) => `/articles/${file.substr(0, file.length - 3)}`
);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md']
		}),
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
		paths: {
			base: ''
		},
		prerender: {
			entries: articlePaths
		}
	}
};

export default config;
