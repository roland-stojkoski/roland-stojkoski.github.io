import type { Article } from '$lib/utils/articles';
import type { IconName } from '$lib/components/icons';

export interface LifeEvent {
	kind: 'event';
	date: Date;
	dateLabel: string;
	title: string;
	subtitle?: string;
	icon: IconName;
}

export type TimelineEntry = Article | LifeEvent;

// HACK: year-only events get a mid-year date so they sort sensibly
// between fully-dated article entries.
const year = (y: number): Date => new Date(y, 5, 30);

export const lifeEvents: LifeEvent[] = [
	{
		kind: 'event',
		date: year(2022),
		dateLabel: '2022',
		title: 'Promoted to SysDE II @ AWS',
		icon: 'trending-up'
	},
	{
		kind: 'event',
		date: year(2020),
		dateLabel: '2020',
		title: 'Full time @ AWS (SysDE I)',
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
		title: 'Internship @ Amazon Web Services',
		icon: 'cloud'
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
