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

// Make the article macros usable in markdown without explicit imports by
// prepending an instance script to every compiled .md component.
const injectArticleMacros = {
	name: 'inject-article-macros',
	markup({ content, filename }) {
		if (!filename?.endsWith('.md')) return;
		const imports = `import { YouTube, StlViewer, Figure, Compare } from '$lib/markdown/macros';`;
		const instanceScript = /<script(?![^>]*(?:\smodule[\s>]|context=))[^>]*>/;
		const match = content.match(instanceScript);
		const code = match
			? content.replace(match[0], `${match[0]}\n${imports}`)
			: `<script>${imports}</script>\n${content}`;
		return { code };
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			layout: join(projectRoot, 'src/lib/markdown/ArticleLayout.svelte')
		}),
		injectArticleMacros
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
