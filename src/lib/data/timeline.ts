import type { Article } from '$lib/utils/articles';
import type { IconName } from '$lib/components/icons';

export interface LifeEvent {
	kind: 'event';
	date: Date;
	dateLabel: string;
	title: string;
	subtitle?: string;
	icon: IconName;
	image?: string;
}

export type TimelineEntry = Article | LifeEvent;

// HACK: year-only events get a mid-year date so they sort sensibly
// between fully-dated article entries.
const year = (y: number): Date => new Date(y, 5, 30);

export const lifeEvents: LifeEvent[] = [
	{
		kind: 'event',
		date: year(2025),
		dateLabel: '2025',
		title: 'Moved 🇮🇪 → 🇺🇸',
		subtitle: 'Moved from Ireland to the USA',
		icon: 'map-pin'
	},
	{
		kind: 'event',
		date: year(2024),
		dateLabel: '2024',
		title: 'Adopted my son Milo 🐶',
		icon: 'star',
		image:
			'https://lh3.googleusercontent.com/pw/AP1GczOMpE87C2dZOEKHZ27RGZ9KOBEpIpqG9eTM5GC5MyhmhBJOZ5iP22ySmd7nk4kKmK78M9pTiyKhwpugHHoRugL3WQbykMBuqniyBLDkJAkEPR1wH8AfK6c3lw5gaVuY-ft8fEPUfWGA21bs3D934OS32Q=w1360-h1814-s-no-gm?authuser=0'
	},
	{
		kind: 'event',
		date: year(2023),
		dateLabel: '2023',
		title: 'Got my (first) house',
		icon: 'home'
	},
	{
		kind: 'event',
		date: new Date(2022, 11, 17),
		dateLabel: '2022',
		title: 'Croatia third place in World Cup',
		icon: 'award'
	},
	{
		kind: 'event',
		date: year(2022),
		dateLabel: '2022',
		title: 'Promoted to SysDE II @ AWS ☁️',
		icon: 'trending-up'
	},
	{
		kind: 'event',
		date: year(2020),
		dateLabel: '2020',
		title: 'Full time @ AWS (SysDE I) ☁️',
		icon: 'briefcase'
	},
	{
		kind: 'event',
		date: new Date(2020, 1, 1),
		dateLabel: '2020',
		title: 'Finished College',
		subtitle: 'Griffith College 🇮🇪',
		icon: 'graduation-cap'
	},
	{
		kind: 'event',
		date: year(2019),
		dateLabel: '2019',
		title: 'Internship @ Amazon Web Services ☁️',
		icon: 'cloud'
	},
	{
		kind: 'event',
		date: new Date(2018, 6, 15),
		dateLabel: '2018',
		title: 'Croatia second place in World Cup',
		icon: 'award'
	},
	{
		kind: 'event',
		date: new Date(2016, 8, 1),
		dateLabel: '2016',
		title: 'Moved 🇭🇷 → 🇮🇪',
		icon: 'map-pin'
	},
	{
		kind: 'event',
		date: year(2016),
		dateLabel: '2016',
		title: 'Finished high school',
		subtitle: 'Gimnazija Pula 🇭🇷',
		icon: 'graduation-cap'
	},
	{
		kind: 'event',
		date: year(2012),
		dateLabel: '2012',
		title: 'Finished primary school',
		subtitle: 'O.Š. Vidikovac Pula 🇭🇷',
		icon: 'school'
	},
	{
		kind: 'event',
		date: year(2007),
		dateLabel: '2007',
		title: 'Existential crisis',
		subtitle:
			'At age 10, realized we are all just confused animals on a floating rock. At least we have Wi-Fi.',
		icon: 'infinity'
	},
	{
		kind: 'event',
		date: year(1997),
		dateLabel: '1997',
		title: 'Born',
		icon: 'star'
	}
];

export function mergeTimeline(
	articles: Article[],
	events: LifeEvent[] = lifeEvents
): TimelineEntry[] {
	return [...articles, ...events].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export interface TimelineYear {
	year: number;
	count: number;
	hasArticle: boolean;
	/** 0..1, relative to the busiest year. */
	weight: number;
}

/**
 * Buckets timeline entries into consecutive years, newest first, with a
 * relative weight per year. Years without entries are kept so the scrubber
 * renders a true time axis instead of collapsing quiet stretches.
 */
export function timelineYears(entries: TimelineEntry[]): TimelineYear[] {
	if (entries.length === 0) return [];

	const buckets = new Map<number, { count: number; hasArticle: boolean }>();
	for (const entry of entries) {
		const year = entry.date.getFullYear();
		const bucket = buckets.get(year) ?? { count: 0, hasArticle: false };
		bucket.count += 1;
		bucket.hasArticle ||= entry.kind === 'article';
		buckets.set(year, bucket);
	}

	const allYears = [...buckets.keys()];
	const newest = Math.max(...allYears);
	const oldest = Math.min(...allYears);
	const busiest = Math.max(...[...buckets.values()].map((bucket) => bucket.count));

	const years: TimelineYear[] = [];
	for (let year = newest; year >= oldest; year--) {
		const bucket = buckets.get(year);
		years.push({
			year,
			count: bucket?.count ?? 0,
			hasArticle: bucket?.hasArticle ?? false,
			weight: (bucket?.count ?? 0) / busiest
		});
	}
	return years;
}
