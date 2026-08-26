/**
 * Every icon the site renders, stored as the inner shapes of a 24x24 SVG.
 *
 * Provenance — this path data is copied from upstream sets, not generated:
 *  - Feather (MIT, (c) 2013-2023 Cole Bemis, https://feathericons.com) —
 *    directly for 'copy', 'check', 'instagram', 'briefcase' and 'file-text',
 *    and indirectly for the glyphs Lucide's own LICENSE lists as
 *    Feather-derived (the chevrons, the arrows, 'clipboard', 'external-link',
 *    'moon', 'rss', 'search'), which keep Feather's MIT terms.
 *  - Lucide (ISC, (c) Lucide Icons and Contributors, https://lucide.dev) —
 *    the rest of the stroke glyphs.
 *  - Simple Icons (CC0-1.0, https://simpleicons.org) — 'github', and
 *    'linkedin' as it stood in Simple Icons 13.21.0; 14.0.0 dropped the
 *    LinkedIn mark and the current set has no replacement.
 *  - No upstream match — 'accessibility', 'home', 'user', 'school', 'map-pin'
 *    and 'star' match nothing in the sets checked; their origin is unverified,
 *    which is not the same as knowing they were drawn here.
 * Several entries are reordered, rounded or simplified rather than copied
 * whole. THIRD-PARTY-NOTICES.md records the per-glyph comparison and carries
 * the verbatim ISC/MIT/CC0 texts those licences require; this comment is a
 * pointer, not the notice — the bundler strips it. The notice that ships with
 * the site is static/THIRD-PARTY-NOTICES.md, served at
 * /THIRD-PARTY-NOTICES.md.
 *
 * Contract for every entry:
 *  - inner shapes only, laid out on a 24x24 grid — iconMarkup() owns the <svg>
 *    wrapper, the viewBox, the size and the stroke width
 *  - no fill/stroke/colour attributes; colour arrives via currentColor
 *  - type 'stroke' for outlined glyphs, 'fill' for solid brand marks
 * To add one: take the shapes out of the upstream 24x24 SVG, drop its wrapper,
 * and record the comparison in THIRD-PARTY-NOTICES.md.
 */
export interface IconDefinition {
	/** 'stroke' icons render outlined, 'fill' icons render solid (brand marks). */
	type: 'stroke' | 'fill';
	/** Inner SVG markup for a 24x24 viewBox. Static, trusted content only. */
	svg: string;
}

export const icons = {
	github: {
		type: 'fill',
		svg: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>'
	},
	linkedin: {
		type: 'fill',
		svg: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>'
	},
	instagram: {
		type: 'stroke',
		svg: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>'
	},
	sun: {
		type: 'stroke',
		svg: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'
	},
	moon: {
		type: 'stroke',
		svg: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'
	},
	menu: {
		type: 'stroke',
		svg: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>'
	},
	accessibility: {
		type: 'stroke',
		svg: '<circle cx="12" cy="12" r="10"/><path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2v6M9 12h6M10 20h4"/>'
	},
	mail: {
		type: 'stroke',
		svg: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'
	},
	search: {
		type: 'stroke',
		svg: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'
	},
	copy: {
		type: 'stroke',
		svg: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'
	},
	clipboard: {
		type: 'stroke',
		svg: '<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>'
	},
	check: {
		type: 'stroke',
		svg: '<polyline points="20 6 9 17 4 12"/>'
	},
	'arrow-down': {
		type: 'stroke',
		svg: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>'
	},
	'arrow-right': {
		type: 'stroke',
		svg: '<path d="M5 12h14m-7-7 7 7-7 7"/>'
	},
	'arrow-up-right': {
		type: 'stroke',
		svg: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>'
	},
	'external-link': {
		type: 'stroke',
		svg: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>'
	},
	'graduation-cap': {
		type: 'stroke',
		svg: '<path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>'
	},
	school: {
		type: 'stroke',
		svg: '<path d="M4 22h16"/><path d="M6 22V9l6-4 6 4v13"/><path d="M10 22v-4a2 2 0 0 1 4 0v4"/>'
	},
	star: {
		type: 'stroke',
		svg: '<path d="m12 2 2.9 6.26 6.6.57-5 4.37 1.5 6.43L12 16.2 5.99 19.63l1.5-6.43-5-4.37 6.6-.57L12 2z"/>'
	},
	'trending-up': {
		type: 'stroke',
		svg: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>'
	},
	briefcase: {
		type: 'stroke',
		svg: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'
	},
	cloud: {
		type: 'stroke',
		svg: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>'
	},
	'map-pin': {
		type: 'stroke',
		svg: '<path d="M12 21.7s-7.5-5.3-7.5-11.2a7.5 7.5 0 0 1 15 0c0 5.9-7.5 11.2-7.5 11.2z"/><circle cx="12" cy="10.3" r="2.6"/>'
	},
	infinity: {
		type: 'stroke',
		svg: '<path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>'
	},
	'file-text': {
		type: 'stroke',
		svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>'
	},
	sparkles: {
		type: 'stroke',
		svg: '<path d="M9.94 15.5a2 2 0 0 0-1.44-1.44l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94a2 2 0 0 0 1.44-1.44l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>'
	},
	home: {
		type: 'stroke',
		svg: '<path d="m3 10.5 9-7.5 9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>'
	},
	user: {
		type: 'stroke',
		svg: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>'
	},
	award: {
		type: 'stroke',
		svg: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>'
	},
	rss: {
		type: 'stroke',
		svg: '<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>'
	},
	'chevron-left': {
		type: 'stroke',
		svg: '<path d="m15 18-6-6 6-6"/>'
	},
	'chevron-right': {
		type: 'stroke',
		svg: '<path d="m9 18 6-6-6-6"/>'
	},
	'chevron-up': {
		type: 'stroke',
		svg: '<path d="m18 15-6-6-6 6"/>'
	},
	'chevron-down': {
		type: 'stroke',
		svg: '<path d="m6 9 6 6 6-6"/>'
	}
} as const satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof icons;

export interface IconMarkupOptions {
	size?: number;
	/** Heavier than the default 2 keeps small or spotlit glyphs legible. */
	strokeWidth?: number;
	class?: string;
	label?: string;
}

const escapeAttribute = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Serialises an icon into a standalone `<svg>` string. This is the only place
 * the wrapper is defined: Icon.svelte renders it, and callers that must inject
 * raw markup into nodes Svelte does not own call it directly.
 */
export function iconMarkup(name: IconName, options: IconMarkupOptions = {}): string {
	const { size = 20, strokeWidth = 2, class: className = '', label } = options;
	const icon: IconDefinition = icons[name];
	const outlined = icon.type === 'stroke';
	const a11y = label
		? `role="img" aria-label="${escapeAttribute(label)}"`
		: 'role="presentation" aria-hidden="true"';

	return (
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' +
		`width="${size}" height="${size}" ` +
		`fill="${outlined ? 'none' : 'currentColor'}" ` +
		`stroke="${outlined ? 'currentColor' : 'none'}" ` +
		`stroke-width="${outlined ? strokeWidth : 0}" ` +
		'stroke-linecap="round" stroke-linejoin="round" ' +
		`class="${escapeAttribute(className)}" ${a11y}>${icon.svg}</svg>`
	);
}

export const iconNames = Object.keys(icons) as IconName[];
