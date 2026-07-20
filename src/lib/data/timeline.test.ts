import { describe, expect, it } from 'vitest';
import { icons } from '$lib/components/icons';
import type { Article } from '$lib/utils/articles';
import { lifeEvents, mergeTimeline } from './timeline';

const article = (slug: string, date: Date): Article => ({
	kind: 'article',
	slug,
	href: `/articles/${slug}`,
	title: slug,
	date,
	tldr: ''
});

describe('lifeEvents', () => {
	it('only references icons that exist', () => {
		for (const event of lifeEvents) {
			expect(icons[event.icon], `icon "${event.icon}" for "${event.title}"`).toBeDefined();
		}
	});

	it('is sorted newest first', () => {
		const times = lifeEvents.map((event) => event.date.getTime());
		expect(times).toEqual([...times].sort((a, b) => b - a));
	});
});

describe('mergeTimeline', () => {
	it('interleaves articles and events by date, newest first', () => {
		const merged = mergeTimeline(
			[article('recent', new Date(2024, 0, 1)), article('ancient', new Date(1990, 0, 1))],
			lifeEvents
		);
		expect(merged[0]).toMatchObject({ slug: 'recent' });
		expect(merged.at(-1)).toMatchObject({ slug: 'ancient' });
		const times = merged.map((entry) => entry.date.getTime());
		expect(times).toEqual([...times].sort((a, b) => b - a));
	});

	it('defaults to the built-in life events', () => {
		expect(mergeTimeline([])).toHaveLength(lifeEvents.length);
	});
});
