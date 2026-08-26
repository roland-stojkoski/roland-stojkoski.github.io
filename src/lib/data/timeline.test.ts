import { describe, expect, it } from 'vitest';
import { icons } from '$lib/components/icons';
import type { Article } from '$lib/utils/articles';
import { lifeEvents, mergeTimeline, timelineYears } from './timeline';

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
			[
				{
					kind: 'event',
					date: new Date(2020, 0, 1),
					dateLabel: '2020',
					title: 'event',
					icon: 'star'
				}
			]
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

describe('timelineYears', () => {
	const event = (date: Date): (typeof lifeEvents)[number] => ({
		kind: 'event',
		date,
		dateLabel: String(date.getFullYear()),
		title: 'event',
		icon: 'star'
	});

	it('returns an empty list for no entries', () => {
		expect(timelineYears([])).toEqual([]);
	});

	it('spans every year between newest and oldest, newest first', () => {
		const years = timelineYears([event(new Date(2024, 0, 1)), event(new Date(2020, 0, 1))]);
		expect(years.map((y) => y.year)).toEqual([2024, 2023, 2022, 2021, 2020]);
		expect(years.map((y) => y.count)).toEqual([1, 0, 0, 0, 1]);
	});

	it('weights years relative to the busiest year', () => {
		const years = timelineYears([
			event(new Date(2024, 0, 1)),
			event(new Date(2024, 5, 1)),
			event(new Date(2023, 0, 1))
		]);
		expect(years.find((y) => y.year === 2024)).toMatchObject({ count: 2, weight: 1 });
		expect(years.find((y) => y.year === 2023)).toMatchObject({ count: 1, weight: 0.5 });
	});

	it('flags years that contain an article', () => {
		const years = timelineYears([
			article('demo', new Date(2024, 0, 1)),
			event(new Date(2023, 0, 1))
		]);
		expect(years.find((y) => y.year === 2024)?.hasArticle).toBe(true);
		expect(years.find((y) => y.year === 2023)?.hasArticle).toBe(false);
	});
});
