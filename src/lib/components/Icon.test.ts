import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Icon from './Icon.svelte';
import { iconNames, icons } from './icons';

describe('Icon', () => {
	it.each(iconNames)('renders the %s icon as inline svg', (name) => {
		const { container } = render(Icon, { name });
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svg?.innerHTML.length).toBeGreaterThan(0);
	});

	it('renders stroke icons without fill', () => {
		const { container } = render(Icon, { name: 'sun' });
		expect(container.querySelector('svg')).toHaveAttribute('fill', 'none');
	});

	it('renders fill icons with currentColor', () => {
		const { container } = render(Icon, { name: 'github' });
		expect(container.querySelector('svg')).toHaveAttribute('fill', 'currentColor');
	});

	it('is aria-hidden unless labelled', () => {
		const { container } = render(Icon, { name: 'sun' });
		expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
	});

	it('exposes a label as an accessible image', () => {
		const { container } = render(Icon, { name: 'sun', label: 'Sunny' });
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('role', 'img');
		expect(svg).toHaveAttribute('aria-label', 'Sunny');
	});

	it('defines every icon with non-empty markup', () => {
		for (const definition of Object.values(icons)) {
			expect(definition.svg.trim()).not.toBe('');
		}
	});
});
