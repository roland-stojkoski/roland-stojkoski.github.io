---
name: add-macro
description: Add a new article macro - a Svelte component every article can use in markdown without importing it. Use when asked for a new embed, viewer, gallery or any custom element articles should be able to drop into their text, or when changing the props of an existing macro.
---

# Adding an article macro

Macros are ordinary Svelte components that articles may use without an
import. Four exist today — `YouTube`, `StlViewer`, `Figure` and `Compare` —
and they all live in `src/lib/markdown/`.

## How the auto-import works

`src/lib/markdown/macros.ts` re-exports every macro. At config load
`svelte.config.js` reads that file, pulls the names out of its
`export { default as Name }` lines, and the `injectArticleMacros`
preprocessor prepends `import { ... } from '$lib/markdown/macros';` to every
compiled `.md` — into the article's own instance `<script>` when it has one,
otherwise in a fresh one. Consequences:

- exporting from `macros.ts` is the whole registration; the list is not
  repeated anywhere else in the build
- names must be PascalCase — mdsvex renders lowercase tags as plain HTML
- the config reads `macros.ts` once at startup, so restart `npm run dev`
  after adding a macro

## 1. Write the component

`src/lib/markdown/<Name>.svelte`, Svelte 5 runes, props typed:

```svelte
<script lang="ts">
	interface Props {
		/** Path to the asset, e.g. `/my-article/photo.png` */
		src: string;
		caption?: string;
	}

	let { src, caption }: Props = $props();
</script>

<figure class="not-prose my-8">
	<!-- your markup -->
	{#if caption}
		<figcaption class="mt-3 text-center font-mono text-sm text-base-content/60">
			{caption}
		</figcaption>
	{/if}
</figure>
```

Match what the existing macros do:

- wrap the output in `<figure class="not-prose my-8">` so the typography
  plugin keeps its hands off and block spacing stays uniform
- offer an optional `caption` rendered with the `figcaption` classes above
- frame media with `rounded-box border border-base-300/60 shadow-md`
- daisyUI semantic colours only (`bg-base-200`, `text-primary`,
  `border-base-300`); palette utilities like `bg-zinc-800` do not follow the
  `latte`/`espresso` themes
- images get `loading="lazy"` and a required `alt` prop
- every interactive element needs an accessible name — see the
  `aria-label="Play video: {title}"` button in `YouTube.svelte` and the
  labelled range input in `Compare.svelte`

## 2. Client-only work (the SSR pitfall)

Every page is prerendered in Node, so component setup runs with no DOM:
`window`, `document`, observers, canvas and WebGL do not exist, and a
top-level `import` of a library that touches them breaks `npm run build`.

Do browser work in `onMount` and import such libraries dynamically inside it.
`StlViewer.svelte` is the worked example — three.js is heavy and
WebGL-only:

```svelte
onMount(() => {
	let disposed = false;
	let cleanup = () => {};

	(async () => {
		const THREE = await import('three');
		if (disposed) return;
		// build, then assign cleanup
	})();

	return () => {
		disposed = true;
		cleanup();
	};
});
```

- `onMount` never runs during prerender, which keeps the library out of the
  server bundle and off the critical path
- the `disposed` flag matters: the component can be destroyed while the
  dynamic import is still in flight
- return a cleanup that removes listeners, stops animation loops and
  disposes GPU resources
- render `loading` and `error` states, so the prerendered HTML is not an
  empty box and a failure still gives the reader something (`StlViewer`
  falls back to a download link)
- if the library must own a DOM node, `bind:this` a container and disable
  `svelte/no-dom-manipulating` on that single line with a trailing
  justification, as `StlViewer` does for the three.js canvas

## 3. Export it

```ts
// src/lib/markdown/macros.ts
export { default as MyMacro } from './MyMacro.svelte';
```

Keep exactly that shape — the parser in `svelte.config.js` recognises
`export { default as Name }` and nothing else, and the build fails loudly
only when the file has no macros at all.

## 4. Add a Storybook story

`src/lib/markdown/Macros.stories.svelte` has no auto-import — add the
component to its `<script module>` block, then a story:

```svelte
<Story name="MyMacro" asChild>
	<MyMacro src="/modernize-2026/before.png" caption="Demo" />
</Story>
```

Point it at assets that already exist under `static/`. Check it in both
themes with `npm run storybook`.

## 5. Add a unit test

`src/lib/markdown/<Name>.test.ts`, Vitest + Testing Library on jsdom, named
after the component. The existing tests show the three shapes worth copying:

- `Figure.test.ts` — required output, and that an optional part is absent
  when its prop is not given
- `YouTube.test.ts` — behaviour after `userEvent.click` (nothing embedded
  until the reader asks)
- `Compare.test.ts` — state driven by `fireEvent.input` on a control

jsdom has no WebGL or layout, so a viewer like `StlViewer` cannot be
exercised end to end — it has no test. Keep the DOM-observable parts
(states, fallbacks, labels) testable and cover those instead; if a macro
genuinely cannot be tested, say so in the PR description.

## 6. Document it

- `.claude/skills/write-article/SKILL.md` — add the macro to the snippet and
  the bullet list of what each one does
- `AGENTS.md` — the `src/lib/markdown/` line in the architecture map
- `README.md` — the "Article macros" feature bullet
- run `node scripts/sync-agents.mjs` so `.agents/` mirrors the skill edit

## Checklist

1. `npm run check` — the props interface typechecks
2. `npm run test:unit -- --run`
3. `npm run lint`
4. `npm run build` — prerender is what proves the macro is SSR-safe and that
   the injected import resolves
5. Use it in a real article, `npm run preview`, and look at it in both
   themes on desktop and mobile widths
6. `npm run build-storybook` when the story changed
7. Commit as `feat: add <name> macro`
