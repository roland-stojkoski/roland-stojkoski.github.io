import type { MPromise } from '$lib/common/Mdsvex';
import type { TimelineItemInterfaceRaw } from '$lib/home/TimelineItemInterface';
import type { PageLoad } from './$types';

const remapPath = async (promisePath: {
	path: string;
	mdsvexPromise: MPromise;
}): Promise<TimelineItemInterfaceRaw> => {
	return promisePath.mdsvexPromise.then((mdsvexPromiseResult) => {
		return {
			path: promisePath.path,
			...mdsvexPromiseResult.metadata
		} as TimelineItemInterfaceRaw;
	});
};

export const load: PageLoad = async () => {
	const modules = import.meta.glob(`$lib/assets/articles/*.md`);

	const mdsvexPromisePath: { path: string; mdsvexPromise: MPromise }[] = [];
	for (const [k, v] of Object.entries(modules)) {
		mdsvexPromisePath.push({
			path: k,
			mdsvexPromise: v() as MPromise
		});
	}

	const results = await Promise.allSettled(mdsvexPromisePath.map((pP) => remapPath(pP))).then(
		(results) => {
			return results.map((result) => {
				if (result.status === 'fulfilled') {
					return result.value;
				}
			});
		}
	);

	return {
		mdFiles: results
	};
};
