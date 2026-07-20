<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import SocialLinks from './SocialLinks.svelte';

	let displayName = $state('Roland');
	let isGlitching = $state(false);

	// Typing console states
	let terminalLines = $state<Array<{ prefix: string; text: string; colorClass?: string }>>([]);
	let showCursor = $state(true);

	type ConsoleStep =
		| { type: 'cmd'; text: string }
		| { type: 'output'; text: string; colorClass?: string }
		| { type: 'output-type'; text: string }
		| { type: 'delay'; ms: number }
		| { type: 'backspace'; chars: number };

	// Animated typing script actions
	const script: ConsoleStep[] = [
		// Step 0: connecting
		{ type: 'output', text: 'connecting to the cloud ☁️', colorClass: 'text-info' },
		{ type: 'delay', ms: 400 },

		// Step 1: whoami
		{ type: 'cmd', text: 'whoami' },
		{ type: 'output', text: 'roland — sysde @ aws ☁️', colorClass: 'text-primary' },
		{ type: 'delay', ms: 500 },

		// Step 2: interests
		{ type: 'cmd', text: 'cat interests.txt' },
		{ type: 'output', text: 'automation · big data · networking', colorClass: 'text-accent' },
		{ type: 'delay', ms: 500 },

		// Step 3: systems_stack.txt
		{ type: 'cmd', text: 'cat systems_stack.txt' },
		{ type: 'output', text: 'L7: Application UI (Svelte, HTML, CSS)', colorClass: 'text-accent' },
		{
			type: 'output',
			text: 'L6: Cloud Orchestration (Distributed Systems, APIs)',
			colorClass: 'text-accent'
		},
		{
			type: 'output',
			text: 'L5: Operating Systems (Linux Kernel, Processes)',
			colorClass: 'text-accent'
		},
		{
			type: 'output',
			text: 'L4: Network Protocols (Sockets, TCP/IP, Routing)',
			colorClass: 'text-accent'
		},
		{
			type: 'output',
			text: 'L3: Firmware (Device Drivers, Microcontrollers)',
			colorClass: 'text-accent'
		},
		{
			type: 'output',
			text: 'L2: CPU Architecture (Instruction Sets, Assembly)',
			colorClass: 'text-accent'
		},
		{
			type: 'output',
			text: 'L1: Physics & Silicon (Logic Gates, Transistors)',
			colorClass: 'text-accent'
		},
		{ type: 'delay', ms: 500 },

		// Step 4: uptime
		{ type: 'cmd', text: 'uptime' },
		{ type: 'delay', ms: 300 },
		// NOTE: keep this output line uncolored — theme text classes are unreadable on the always-dark console in the light theme
		{ type: 'output', text: '' },
		{ type: 'output-type', text: 'shitting' },
		{ type: 'delay', ms: 700 }, // pause for realization
		{ type: 'backspace', chars: 5 }, // deletes "tting" -> leaves "shi"
		{ type: 'delay', ms: 350 },
		{ type: 'output-type', text: 'pping production code since 1997' },
		{ type: 'delay', ms: 900 },

		// Step 5: spread the love
		{ type: 'cmd', text: './spread_love.sh' },
		{ type: 'delay', ms: 400 },
		{
			type: 'output',
			text: '[DEBUG] [2026-07-20T00:00:13-07:00] calling rm -rf /',
			colorClass: 'text-warning'
		},
		{ type: 'delay', ms: 800 },
		{
			type: 'output',
			text: 'kernel panic ❤️ (go talk to people 😘)',
			colorClass: 'text-error'
		},
		{ type: 'delay', ms: 200 },
		{
			type: 'output',
			text: '01011001 01101111 01110101 00100000 01100010 01110010 01101111 01101011 01100101 00100000 01101001 01110100',
			colorClass: 'text-error'
		},
		{
			type: 'output',
			text: '0x0000000000000000 0x0000000000000000 0x0000000000000000 0x0000000000000000',
			colorClass: 'text-error'
		},
		{
			type: 'output',
			text: '0x0000000000000000 0x0000000000000000 0x0000000000000000 0x0000000000000000',
			colorClass: 'text-error'
		},
		{ type: 'delay', ms: 600 },
		{
			type: 'output',
			text: 'unexpectedly disconnected from the cloud ☁️',
			colorClass: 'text-warning'
		}
	];

	onMount(() => {
		// Name glitch timer
		const glitchInterval = setInterval(() => {
			isGlitching = true;
			setTimeout(() => {
				displayName = displayName === 'Roland' ? 'Roly' : 'Roland';
			}, 150);
			setTimeout(() => {
				isGlitching = false;
			}, 300);
		}, 4000);

		// Cursor blink timer
		const cursorInterval = setInterval(() => {
			showCursor = !showCursor;
		}, 500);

		// Typing scheduler loop; charIdx tracks per-step progress
		// (characters typed for cmd/output-type, characters deleted for backspace)
		let stepIdx = 0;
		let charIdx = 0;

		function executeStep() {
			if (stepIdx >= script.length) return;

			const step = script[stepIdx];

			if (step.type === 'cmd') {
				if (charIdx === 0) {
					terminalLines.push({ prefix: '$', text: '' });
				}

				if (charIdx < step.text.length) {
					const lastIdx = terminalLines.length - 1;
					terminalLines[lastIdx] = {
						...terminalLines[lastIdx],
						text: terminalLines[lastIdx].text + step.text[charIdx]
					};
					charIdx++;
					setTimeout(executeStep, 40 + Math.random() * 25);
				} else {
					stepIdx++;
					charIdx = 0;
					setTimeout(executeStep, 350);
				}
			} else if (step.type === 'output') {
				terminalLines.push({
					prefix: '>',
					text: step.text,
					colorClass: step.colorClass
				});
				stepIdx++;
				setTimeout(executeStep, 100);
			} else if (step.type === 'delay') {
				stepIdx++;
				setTimeout(executeStep, step.ms);
			} else if (step.type === 'output-type') {
				if (charIdx < step.text.length) {
					const lastIdx = terminalLines.length - 1;
					terminalLines[lastIdx] = {
						...terminalLines[lastIdx],
						text: terminalLines[lastIdx].text + step.text[charIdx]
					};
					charIdx++;
					setTimeout(executeStep, 45 + Math.random() * 25);
				} else {
					stepIdx++;
					charIdx = 0;
					setTimeout(executeStep, 150);
				}
			} else if (step.type === 'backspace') {
				if (charIdx < step.chars) {
					const lastIdx = terminalLines.length - 1;
					terminalLines[lastIdx] = {
						...terminalLines[lastIdx],
						text: terminalLines[lastIdx].text.slice(0, -1)
					};
					charIdx++;
					setTimeout(executeStep, 110);
				} else {
					stepIdx++;
					charIdx = 0;
					setTimeout(executeStep, 150);
				}
			}
		}

		const startDelay = setTimeout(executeStep, 600);

		return () => {
			clearInterval(glitchInterval);
			clearInterval(cursorInterval);
			clearTimeout(startDelay);
		};
	});
</script>

<section class="relative">
	<div
		class="relative mx-auto grid max-w-5xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28"
	>
		<div class="space-y-6">
			<p class="font-mono text-sm text-base-content/60">// portfolio &amp; dev timeline</p>
			<h1 class="text-4xl leading-tight font-bold md:text-5xl">
				Hi, I'm <span class="glitch-text text-gradient" class:glitching={isGlitching}
					>{displayName}</span
				>.
			</h1>
			<p class="max-w-md text-lg text-base-content/80">
				Systems Development Engineer @ AWS ☁️. Inquisitive by nature, I keep peeling back the layers
				— there's always one more underneath. I embrace AI but seek to understand how things work at
				their core. Believer in open source, accessible learning, and sustainable software models.
				Below is a timeline of my dev life — milestones, articles, and projects.
			</p>
			<div class="flex flex-wrap gap-3">
				<a href="#timeline" class="btn btn-primary">
					Explore the timeline <Icon name="arrow-down" size={18} />
				</a>
				<a href="/contact" class="btn btn-outline">Get in touch</a>
			</div>
			<SocialLinks class="-ml-2" />
		</div>

		<div
			class="mockup-code flex min-h-[460px] min-w-0 flex-col justify-start border border-base-300/60 font-mono text-xs shadow-xl md:min-h-[490px]"
		>
			{#each terminalLines as line, index (index)}
				<pre
					data-prefix={line.prefix}
					class="max-w-full! whitespace-pre-wrap! {line.colorClass || ''}"><code>{line.text}</code
					></pre>
			{/each}
			{#if showCursor}
				<pre data-prefix="$" class="animate-pulse"><code>█</code></pre>
			{/if}
		</div>
	</div>
</section>

<style>
	@keyframes glitch {
		0% {
			text-shadow:
				0.05em 0 0 rgba(255, 0, 0, 0.75),
				-0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
				0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
			transform: translate(0);
		}
		15% {
			text-shadow:
				-0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
				0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
				-0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
			transform: translate(-2px, 1px);
		}
		45% {
			text-shadow:
				0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
				-0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
				0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
			transform: translate(1px, -2px);
		}
		100% {
			text-shadow:
				-0.025em 0 0 rgba(255, 0, 0, 0.75),
				-0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
				-0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
			transform: translate(0);
		}
	}

	.glitch-text {
		position: relative;
		display: inline-block;
	}

	.glitch-text.glitching {
		animation: glitch 250ms infinite;
	}
</style>
