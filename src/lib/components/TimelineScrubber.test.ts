import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import type { TimelineYear } from '$lib/data/timeline';
import TimelineScrubber from './TimelineScrubber.svelte';

const years: TimelineYear[] = [
	{ year: 2024, count: 2, hasArticle: true, weight: 1 },
	{ year: 2023, count: 0, hasArticle: false, weight: 0 },
	{ year: 2022, count: 1, hasArticle: false, weight: 0.5 }
];

describe('TimelineScrubber', () => {
	it('renders a chip per year with jump labels', () => {
		render(TimelineScrubber, { years });
		expect(screen.getByRole('button', { name: 'Jump to 2024 (2 entries)' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Jump to 2022 (1 entry)' })).toBeInTheDocument();
	});

	it('disables years without entries', () => {
		render(TimelineScrubber, { years });
		expect(screen.getByRole('button', { name: '2023 — no entries' })).toBeDisabled();
	});

	it('marks the active year', () => {
		render(TimelineScrubber, { years, activeYear: 2022 });
		expect(screen.getByRole('button', { name: /jump to 2022/i })).toHaveAttribute(
			'aria-current',
			'true'
		);
	});

	it('renders nothing without years', () => {
		const { container } = render(TimelineScrubber, { years: [] });
		expect(container.querySelector('button')).toBeNull();
	});
});
