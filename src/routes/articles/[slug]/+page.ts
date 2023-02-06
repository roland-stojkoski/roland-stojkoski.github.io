import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { MResolver } from '$lib/common/Mdsvex';

const slugFromPath = (path: string) => path.match(/([\w-]+)\.md/i)?.[1] ?? null;

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob(`$lib/assets/articles/*.md`);

	let match: { path?: string; resolver?: MResolver } = {};
	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as unknown as MResolver };
			break;
		}
	}

	const post = await match?.resolver?.();

	if (!post) {
		throw error(404, 'Could not find the page you requested ☹️');
	}

	return {
		component: post.default,
		frontmatter: post.metadata
	};
};
