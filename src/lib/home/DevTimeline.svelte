<script>
	import { Timeline, TimelineItem } from 'flowbite-svelte';
</script>

<Timeline>
	<div class="list-none">
		<TimelineItem title="Sample project #2" date="February 2023">
			<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
				This is a sample project an it will include a TLDR
			</p>
			<button class="btn btn-primary" type="button">View article</button>
			<button class="btn btn-primary" type="button"
				>View on GitHub&nbsp;<i class="fa-brands fa-github" /></button
			>
		</TimelineItem>
		<TimelineItem title="Sample project" date="January 2023">
			<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
				This is a sample project an it will include a TLDR
			</p>
			<button class="btn btn-primary" type="button">View article</button>
			<button class="btn btn-primary" type="button"
				>View on GitHub&nbsp;<i class="fa-brands fa-github" /></button
			>
		</TimelineItem>
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
		<TimelineItem title="Born 👶" date="September 1997" />
	</div>
</Timeline>
