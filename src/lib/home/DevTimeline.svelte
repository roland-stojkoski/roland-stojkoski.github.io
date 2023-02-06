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
		<TimelineItem>
			<h3><i class="fa-solid fa-infinity" /></h3>
			<p>... more to come <i class="fa-solid fa-face-laugh" /></p>
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
			<h3>Finished College 🎓</h3>
			<p>(Griffith College <i class="fi fi-ie" />)</p>
		</TimelineItem>
		<TimelineItem date="2019">
			<h3>Internship @ Amazon Web Services <i class="fa-brands fa-aws" /></h3>
		</TimelineItem>
		<TimelineItem date="2016">
			<h3>
				Moved <i class="fi fi-hr" /> <i class="fa-solid fa-right-long" /> <i class="fi fi-ie" />
			</h3>
		</TimelineItem>
		<TimelineItem date="2016">
			<h3>
				Finished high school <i class="fa-solid fa-graduation-cap" />
			</h3>
			<p>
				(Gimnazija Pula
				<i class="fi fi-hr" />)
			</p>
		</TimelineItem>
		<TimelineItem date="2012">
			<h3>
				Finished primary school <i class="fa-solid fa-school" />
			</h3>
			<p>
				(O.Š. Vidikovac Pula
				<i class="fi fi-hr" />)
			</p>
		</TimelineItem>
		<TimelineItem date="1997">
			<h3>Born <i class="fa-solid fa-baby" /></h3>
		</TimelineItem>
	</div>
</Timeline>
