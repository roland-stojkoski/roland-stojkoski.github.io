import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import SocialLinks from './SocialLinks.svelte';

describe('SocialLinks', () => {
	it('links to the updated instagram handle', () => {
		render(SocialLinks);
		expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
			'href',
			'https://www.instagram.com/theonlyroly/'
		);
	});

	it('links github and linkedin', () => {
		render(SocialLinks);
		expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
			'href',
			'https://github.com/roland-stojkoski'
		);
		expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
	});

	it('has no twitter link anymore', () => {
		render(SocialLinks);
		expect(screen.queryByRole('link', { name: /twitter/i })).not.toBeInTheDocument();
		expect(screen.getAllByRole('link')).toHaveLength(3);
	});

	it('opens all profiles in a new tab safely', () => {
		render(SocialLinks);
		for (const link of screen.getAllByRole('link')) {
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noreferrer');
		}
	});
});
