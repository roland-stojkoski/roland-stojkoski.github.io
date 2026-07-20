import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Figure from './Figure.svelte';

describe('Figure', () => {
	it('renders the image lazily with alt text', () => {
		render(Figure, { src: '/img.png', alt: 'An image' });
		const img = screen.getByAltText('An image');
		expect(img).toHaveAttribute('src', '/img.png');
		expect(img).toHaveAttribute('loading', 'lazy');
	});

	it('renders a caption when given', () => {
		render(Figure, { src: '/img.png', alt: 'An image', caption: 'The caption' });
		expect(screen.getByText('The caption')).toBeInTheDocument();
	});

	it('omits the caption element otherwise', () => {
		const { container } = render(Figure, { src: '/img.png', alt: 'An image' });
		expect(container.querySelector('figcaption')).not.toBeInTheDocument();
	});
});
