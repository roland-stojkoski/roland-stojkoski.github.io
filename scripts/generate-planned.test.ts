import { describe, expect, it } from 'vitest';
import {
	CODETAGS,
	END_MARKER,
	START_MARKER,
	extractCodetags,
	renderSection
} from './generate-planned.mjs';

describe('extractCodetags', () => {
	it('finds tags in js, html and svelte comment styles', () => {
		const content = [
			'const a = 1; // TODO: do the thing',
			'/* FIXME: fragile parser */',
			'<!-- HACK: layout workaround -->',
			'# XXX: danger zone',
			'\t// NOTE(roland): non-obvious fact'
		].join('\n');
		const entries = extractCodetags(content, 'file.ts');
		expect(entries.map((entry) => entry.tag)).toEqual(CODETAGS);
		expect(entries[0]).toMatchObject({ file: 'file.ts', line: 1, text: 'do the thing' });
		expect(entries[4].owner).toBe('roland');
	});

	it('strips comment terminators from the captured text', () => {
		const [entry] = extractCodetags('<!-- TODO: tidy this -->', 'file.html');
		expect(entry.text).toBe('tidy this');
	});

	it('ignores plain words and untagged lines', () => {
		const content = ['const todoList = [];', '// this notes something', 'no tags here'].join('\n');
		expect(extractCodetags(content, 'file.ts')).toEqual([]);
	});

	it('requires the colon', () => {
		expect(extractCodetags('// TODO later maybe', 'file.ts')).toEqual([]);
	});
});

describe('renderSection', () => {
	it('groups entries by tag inside the markers', () => {
		const section = renderSection([
			{ tag: 'TODO', text: 'one', file: 'a.ts', line: 1 },
			{ tag: 'HACK', text: 'two', file: 'b.ts', line: 2 },
			{ tag: 'TODO', text: 'three', file: 'c.ts', line: 3 }
		]);
		expect(section.startsWith(START_MARKER)).toBe(true);
		expect(section.endsWith(END_MARKER)).toBe(true);
		expect(section.indexOf('### TODO')).toBeLessThan(section.indexOf('### HACK'));
		expect(section).toContain('- `a.ts:1` — one');
		expect(section).toContain('- `b.ts:2` — two');
	});

	it('celebrates an empty codebase', () => {
		expect(renderSection([])).toContain('No codetags found');
	});
});
