<script type="ts">
	import { error } from '@sveltejs/kit';
	import { Timeline, TimelineItem } from 'flowbite-svelte';
	import type {
		TimelineItemInterfaceParsed,
		TimelineItemInterfaceRaw
	} from './TimelineItemInterface';

	export let items: TimelineItemInterfaceRaw[];

	const parsedItems: TimelineItemInterfaceParsed[] = [];
	items.forEach((part, index) => {
		const mdPath = part.path
			.split('/')
			?.pop()
			?.replace(/\.[^/.]+$/, '');

		// TODO - Improve this error handling
		if (!mdPath) {
			throw error(
				500,
				`Issues with converting the path - <${part.path}>, to a link ☹️. Please report this to us 🙏`
			);
		}

		parsedItems[index] = {
			...part,
			path: '/articles/'.concat(mdPath),
			date: new Date(part.date)
		};
	});

	parsedItems.sort((a: TimelineItemInterfaceParsed, b: TimelineItemInterfaceParsed): number => {
		return b.date.getTime() - a.date.getTime();
	});
</script>

<Timeline>
	<div class="list-none">
		<TimelineItem date="♾️">
			<p><i>... more to come 😀</i></p>
		</TimelineItem>
		{#each parsedItems as item}
			<TimelineItem title={item.title} date={item.date.toDateString()}>
				<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
					{item.tldr}
				</p>
				<form>
					<div class="btn-group btn-group-vertical">
						<button class="btn btn-primary" formaction={item.path} type="submit"
							>View article</button
						>
						{#if item.githubLink}
							<button class="btn btn-primary" type="submit" formaction={item.githubLink}
								>View on GitHub&nbsp;<i class="fa-brands fa-github" /></button
							>
						{/if}
					</div>
				</form>
			</TimelineItem>
		{/each}
		<TimelineItem date="2022">
			<h3>Promoted to SysDE II @ <i class="fa-brands fa-aws" /></h3>
		</TimelineItem>
		<TimelineItem date="2020">
			<h3>Full time @ <i class="fa-brands fa-aws" /> (SysDE I)</h3>
		</TimelineItem>
		<TimelineItem date="2020">
			<h3>Finished College 🎓 (Griffith College <i class="fi fi-ie" />)</h3>
		</TimelineItem>
		<TimelineItem date="2019">
			<h3>Internship @ Amazon Web Services <i class="fa-brands fa-aws" /></h3>
		</TimelineItem>
		<TimelineItem date="2016">
			<h3>Moved <i class="fi fi-hr" /> ➡️ <i class="fi fi-ie" /></h3>
		</TimelineItem>
		<TimelineItem date="2016">
			<h3>Finished high school 😎 (Gimnazija Pula <i class="fi fi-hr" />)</h3>
		</TimelineItem>
		<TimelineItem date="2012">
			<h3>Finished primary school 🎒 (O.Š. Vidikovac <i class="fi fi-hr" />)</h3>
		</TimelineItem>
		<TimelineItem title="Born 👶" date="1997" />
	</div>
</Timeline>
