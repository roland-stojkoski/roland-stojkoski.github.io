export interface ArticleMetadata {
	title: string;
	date: string;
	tldr: string;
	githubLink?: string;
}

export interface Article {
	kind: 'article';
	slug: string;
	href: string;
	title: string;
	date: Date;
	tldr: string;
	githubLink?: string;
}

export function slugFromPath(path: string): string | null {
	return path.match(/([\w-]+)\.md$/i)?.[1] ?? null;
}

export function articleFromModule(path: string, metadata: ArticleMetadata): Article {
	const slug = slugFromPath(path);
	if (!slug) {
		throw new Error(`Cannot derive an article slug from path: ${path}`);
	}
	const date = new Date(metadata.date);
	if (isNaN(date.getTime())) {
		throw new Error(`Article ${path} has an invalid frontmatter date: ${metadata.date}`);
	}
	return {
		kind: 'article',
		slug,
		href: `/articles/${slug}`,
		title: metadata.title,
		date,
		tldr: metadata.tldr,
		githubLink: metadata.githubLink
	};
}

export function allArticles(modules: Record<string, { metadata?: unknown }>): Article[] {
	return Object.entries(modules)
		.map(([path, mod]) => articleFromModule(path, mod.metadata as ArticleMetadata))
		.sort((a, b) => b.date.getTime() - a.date.getTime());
}
