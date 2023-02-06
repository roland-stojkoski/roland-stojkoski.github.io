export interface TimelineItemInterfaceRaw {
	date: string;
	title: string;
	name: string;
	tldr: string;
	githubLink?: string | undefined;
	path: string;
}

export interface TimelineItemInterfaceParsed {
	date: Date;
	title: string;
	name: string;
	tldr: string;
	githubLink?: string | undefined;
	path: string;
}
