import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Icon from './Icon.svelte';
import { iconMarkup, iconNames, icons } from './icons';

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

	it('hides an unlabelled icon from assistive tech', () => {
		const { container } = render(Icon, { name: 'sun' });
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('aria-hidden', 'true');
		expect(svg).not.toHaveAttribute('aria-label');
		expect(svg).not.toHaveAttribute('role', 'img');
	});

	it('exposes a label as an accessible image', () => {
		const { container } = render(Icon, { name: 'sun', label: 'Sunny' });
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('role', 'img');
		expect(svg).toHaveAttribute('aria-label', 'Sunny');
		expect(svg).not.toHaveAttribute('aria-hidden');
	});

	it('renders the accessibility trigger as a circled figure', () => {
		const { container } = render(Icon, { name: 'accessibility' });
		expect(container.querySelector('circle')).toHaveAttribute('r', '10');
		expect(container.querySelector('path')).toHaveAttribute(
			'd',
			'M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2v6M9 12h6M10 20h4'
		);
	});

	it('renders arrow-right as the shaft-and-head path', () => {
		const { container } = render(Icon, { name: 'arrow-right' });
		expect(container.querySelector('path')).toHaveAttribute('d', 'M5 12h14m-7-7 7 7-7 7');
	});

	it('honours size and class overrides', () => {
		const { container } = render(Icon, { name: 'check', size: 12, class: 'text-success' });
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('width', '12');
		expect(svg).toHaveAttribute('height', '12');
		expect(svg).toHaveClass('text-success');
	});

	it('defines every icon as bare shapes on the shared 24x24 grid', () => {
		for (const [name, definition] of Object.entries(icons)) {
			expect(definition.svg.trim(), name).not.toBe('');
			// Icon.svelte owns the wrapper, viewBox and colour; entries carrying
			// their own would silently escape theming and sizing.
			expect(definition.svg, name).not.toMatch(/<svg|viewBox|\sfill="|\sstroke="/);
		}
	});

	it('strokes at width 2 unless asked otherwise', () => {
		const { container } = render(Icon, { name: 'check' });
		expect(container.querySelector('svg')).toHaveAttribute('stroke-width', '2');
	});

	it('honours a heavier strokeWidth', () => {
		const { container } = render(Icon, { name: 'check', size: 12, strokeWidth: 3 });
		expect(container.querySelector('svg')).toHaveAttribute('stroke-width', '3');
	});

	it('ignores strokeWidth on solid brand marks', () => {
		const { container } = render(Icon, { name: 'github', strokeWidth: 3 });
		expect(container.querySelector('svg')).toHaveAttribute('stroke-width', '0');
	});

	it('renders exactly what iconMarkup produces', () => {
		const { container } = render(Icon, {
			name: 'copy',
			size: 12,
			strokeWidth: 2.5,
			class: 'text-success'
		});
		const rendered = document.createElement('div');
		rendered.innerHTML = iconMarkup('copy', { size: 12, strokeWidth: 2.5, class: 'text-success' });
		expect(container.querySelector('svg')?.outerHTML).toBe(rendered.innerHTML);
	});

	it('escapes quotes in a label rather than breaking out of the attribute', () => {
		const { container } = render(Icon, { name: 'sun', label: 'a "sunny" day' });
		expect(container.querySelectorAll('svg')).toHaveLength(1);
		expect(container.querySelector('svg')).toHaveAttribute('aria-label', 'a "sunny" day');
	});

	it('is the only place icon path data appears in a component', () => {
		const sources = import.meta.glob('/src/**/*.svelte', { eager: true, query: '?raw' }) as Record<
			string,
			{ default: string }
		>;
		const paths = Object.entries(icons).flatMap(([name, definition]) =>
			[...definition.svg.matchAll(/ d="([^"]+)"/g)].map((match) => ({ name, d: match[1] }))
		);
		const offenders = Object.entries(sources).flatMap(([file, module]) =>
			paths
				.filter(({ d }) => module.default.includes(`d="${d}"`))
				.map(({ name }) => `${file}: ${name}`)
		);
		// A glyph hand-inlined next to <Icon> drifts out of sync on size, stroke
		// width and aria wiring — the Articles caret did exactly that.
		expect(offenders).toEqual([]);
	});

	it('never repeats the same path data under two names', () => {
		const seen = new Map<string, string>();
		for (const [name, definition] of Object.entries(icons)) {
			expect(seen.get(definition.svg), `${name} duplicates ${seen.get(definition.svg)}`).toBe(
				undefined
			);
			seen.set(definition.svg, name);
		}
	});
});
