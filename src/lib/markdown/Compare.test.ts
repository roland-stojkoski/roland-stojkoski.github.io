import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Compare from './Compare.svelte';

describe('Compare', () => {
	const props = {
		before: '/before.png',
		after: '/after.png',
		beforeAlt: 'Old',
		afterAlt: 'New'
	};

	it('renders both images and their badges', () => {
		render(Compare, props);
		expect(screen.getByAltText('Old')).toHaveAttribute('src', '/before.png');
		expect(screen.getByAltText('New')).toHaveAttribute('src', '/after.png');
		expect(screen.getByText('Old')).toBeInTheDocument();
		expect(screen.getByText('New')).toBeInTheDocument();
	});

	it('moves the divider with the slider', async () => {
		const { container } = render(Compare, props);
		const slider = screen.getByRole('slider');
		await fireEvent.input(slider, { target: { value: '25' } });
		const clipped = container.querySelector('[style*="clip-path"]') as HTMLElement;
		expect(clipped.getAttribute('style')).toContain('75%');
	});

	it('renders an optional caption', () => {
		render(Compare, { ...props, caption: 'Before vs after' });
		expect(screen.getByText('Before vs after')).toBeInTheDocument();
	});
});
