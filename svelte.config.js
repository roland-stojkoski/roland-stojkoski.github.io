import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { readdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

const articleFolder = './src/lib/assets/articles/';
const articleEntries = readdirSync(articleFolder)
	.filter((file) => file.endsWith('.md'))
	.map((file) => `/articles/${file.slice(0, -3)}`);

// macros.ts re-exports .svelte components, so this config cannot import it to
// learn the macro names; they are parsed out of its source instead, which
// keeps macros.ts the single place a macro is registered. Prose about the
// export form must not be harvested as a macro or the injected import goes
// unresolvable, so block and whole-line comments are stripped and the match
// is anchored to the start of a line. A trailing `//` comment on a real export
// line needs no handling: the match ends at the closing brace, before the
// comment begins.
// Read once at config load: adding a macro needs a dev-server restart.
const macrosPath = join(projectRoot, 'src/lib/markdown/macros.ts');
const macroNames = [
	...readFileSync(macrosPath, 'utf8')
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/(^|\n)[^\S\n]*\/\/[^\n]*/g, '$1')
		.matchAll(/^[^\S\n]*export\s*\{\s*default\s+as\s+(\w+)\s*\}/gm)
].map(([, name]) => name);

if (macroNames.length === 0) {
	throw new Error(
		`No macros found in ${macrosPath} — each must be exported as \`export { default as Name } from './Name.svelte';\`.`
	);
}

// Make the article macros usable in markdown without explicit imports by
// prepending an instance script to every compiled .md component.
const injectArticleMacros = {
	name: 'inject-article-macros',
	markup({ content, filename }) {
		if (!filename?.endsWith('.md')) return;
		const imports = `import { ${macroNames.join(', ')} } from '$lib/markdown/macros';`;
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
