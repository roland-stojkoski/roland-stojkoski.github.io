export const site = {
	title: 'Roland Stojkoski',
	tagline: 'Systems Development Engineer',
	description:
		'Portfolio and blog of Roland Stojkoski - a timeline of projects, articles and notable events.',
	url: 'https://roland-stojkoski.github.io',
	repo: 'https://github.com/roland-stojkoski/roland-stojkoski.github.io'
};

export const socials = [
	{ name: 'GitHub', icon: 'github', href: 'https://github.com/roland-stojkoski' },
	{
		name: 'LinkedIn',
		icon: 'linkedin',
		href: 'https://www.linkedin.com/in/roland-stojkoski-307782140/'
	},
	{ name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/theonlyroly/' }
] as const;

/**
 * giscus comment widget configuration (https://giscus.app).
 *
 * TODO: enable GitHub Discussions on the repo, install the giscus app, then
 * paste the repoId/categoryId from giscus.app here. Comments stay hidden
 * until both IDs are set.
 */
export const giscus = {
	repo: 'roland-stojkoski/roland-stojkoski.github.io',
	repoId: '',
	category: 'Articles',
	categoryId: ''
};
