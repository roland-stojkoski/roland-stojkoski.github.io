import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import type { TimelineEntry } from '$lib/data/timeline';
import Timeline from './Timeline.svelte';

const entries: TimelineEntry[] = [
	{
		kind: 'article',
		slug: 'demo',
		href: '/articles/demo',
		title: 'Demo article',
		date: new Date(2024, 5, 1),
		tldr: 'Just a demo.',
		githubLink: 'https://github.com/example/demo'
	},
	{
		kind: 'event',
		date: new Date(2020, 0, 1),
		dateLabel: '2020',
		title: 'Something happened',
		subtitle: 'Somewhere',
		icon: 'star'
	}
];

describe('Timeline', () => {
	it('renders article cards with read and github actions', () => {
		render(Timeline, { entries });
		expect(screen.getByText('Demo article')).toBeInTheDocument();
		expect(screen.getByText('Just a demo.')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /read article/i })).toHaveAttribute(
			'href',
			'/articles/demo'
		);
		expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
			'href',
			'https://github.com/example/demo'
		);
	});

	it('renders life events with their year label and subtitle', () => {
		render(Timeline, { entries });
		expect(screen.getByText('Something happened')).toBeInTheDocument();
		expect(screen.getByText('2020')).toBeInTheDocument();
		expect(screen.getByText('Somewhere')).toBeInTheDocument();
	});

	it('always shows the "more to come" teaser', () => {
		render(Timeline, { entries: [] });
		expect(screen.getByText(/more to come/i)).toBeInTheDocument();
	});
});
