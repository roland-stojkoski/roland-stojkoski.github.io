import { describe, expect, it } from 'vitest';
import { allArticles, articleFromModule, slugFromPath } from './articles';

describe('slugFromPath', () => {
	it('extracts the slug from a markdown path', () => {
		expect(slugFromPath('/src/lib/assets/articles/this-blog.md')).toBe('this-blog');
	});

	it('supports underscores and digits', () => {
		expect(slugFromPath('articles/my_post-2.md')).toBe('my_post-2');
	});

	it('returns null for non-markdown paths', () => {
		expect(slugFromPath('articles/readme.txt')).toBeNull();
	});

	it('returns null for empty input', () => {
		expect(slugFromPath('')).toBeNull();
	});
});

describe('articleFromModule', () => {
	const metadata = {
		title: 'A title',
		date: '2/6/2023',
		tldr: 'A summary',
		githubLink: 'https://github.com/example/repo'
	};

	it('maps metadata onto an article entry', () => {
		const article = articleFromModule('/articles/example.md', metadata);
		expect(article).toMatchObject({
			kind: 'article',
			slug: 'example',
			href: '/articles/example',
			title: 'A title',
			tldr: 'A summary',
			githubLink: 'https://github.com/example/repo'
		});
		expect(article.date.getFullYear()).toBe(2023);
	});

	it('throws on paths without a derivable slug', () => {
		expect(() => articleFromModule('nope', metadata)).toThrow(/slug/);
	});

	it('throws on invalid frontmatter dates', () => {
		expect(() =>
			articleFromModule('/articles/example.md', { ...metadata, date: 'not-a-date' })
		).toThrow(/invalid frontmatter date/);
	});
});

describe('allArticles', () => {
	it('sorts newest first', () => {
		const modules = {
			'/articles/old.md': { metadata: { title: 'Old', date: '1/1/2020', tldr: '' } },
			'/articles/new.md': { metadata: { title: 'New', date: '1/1/2024', tldr: '' } },
			'/articles/middle.md': { metadata: { title: 'Middle', date: '1/1/2022', tldr: '' } }
		};
		expect(allArticles(modules).map((a) => a.slug)).toEqual(['new', 'middle', 'old']);
	});

	it('returns an empty list for no modules', () => {
		expect(allArticles({})).toEqual([]);
	});
});
