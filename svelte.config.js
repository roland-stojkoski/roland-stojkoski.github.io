import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

const articleFolder = './src/lib/assets/articles/';
const articleEntries = readdirSync(articleFolder)
	.filter((file) => file.endsWith('.md'))
	.map((file) => `/articles/${file.slice(0, -3)}`);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			layout: join(projectRoot, 'src/lib/markdown/ArticleLayout.svelte')
		})
	],
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			entries: ['*', ...articleEntries]
		}
	}
};

export default config;
