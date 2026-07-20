import { error } from '@sveltejs/kit';
import { slugFromPath } from '$lib/utils/articles';
import type { Component } from 'svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob('$lib/assets/articles/*.md');

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === params.slug) {
			const post = (await resolver()) as {
				default: Component;
				metadata: Record<string, string>;
			};
			return {
				component: post.default,
				frontmatter: post.metadata
			};
		}
	}

	error(404, 'Could not find the article you requested ☹️');
};
