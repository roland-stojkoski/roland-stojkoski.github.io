import { allArticles } from '$lib/utils/articles';
import { site } from '$lib/config';

export const prerender = true;

const escapeXml = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
	const modules = import.meta.glob('$lib/assets/articles/*.md', { eager: true }) as Record<
		string,
		{ metadata?: unknown }
	>;
	const articles = allArticles(modules);

	const items = articles
		.map(
			(article) => `		<item>
			<title>${escapeXml(article.title)}</title>
			<link>${site.url}${article.href}</link>
			<guid isPermaLink="true">${site.url}${article.href}</guid>
			<description>${escapeXml(article.tldr)}</description>
			<pubDate>${article.date.toUTCString()}</pubDate>
		</item>`
		)
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>${escapeXml(site.title)}</title>
		<link>${site.url}</link>
		<description>${escapeXml(site.description)}</description>
		<language>en</language>
${items}
	</channel>
</rss>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
}
