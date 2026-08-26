// Components available in every article without imports. svelte.config.js
// parses the export names below to build the import it injects into every
// .md, so keep the `export { default as Name }` form — it sees nothing else.
export { default as YouTube } from './YouTube.svelte';
export { default as StlViewer } from './StlViewer.svelte';
export { default as Figure } from './Figure.svelte';
export { default as Compare } from './Compare.svelte';
