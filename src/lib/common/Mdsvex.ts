export interface MFile {
	default: import('svelte/internal').SvelteComponent;
	metadata: Record<string, string>;
}

export type MPromise = Promise<MFile>;

export type MResolver = () => Promise<MFile>;
