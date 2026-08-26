import { allArticles } from '$lib/utils/articles';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const modules = import.meta.glob('$lib/assets/articles/*.md', { eager: true }) as Record<
		string,
		{ metadata?: unknown }
	>;

	return {
		articles: allArticles(modules)
	};
};
