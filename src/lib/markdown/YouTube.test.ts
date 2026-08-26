import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import YouTube from './YouTube.svelte';

describe('YouTube', () => {
	it('shows only the thumbnail before interaction', () => {
		render(YouTube, { id: 'abc123', title: 'Demo video' });
		expect(screen.getByRole('button', { name: /play video: demo video/i })).toBeInTheDocument();
		expect(document.querySelector('iframe')).not.toBeInTheDocument();
		expect(screen.getByAltText('Demo video')).toHaveAttribute(
			'src',
			'https://i.ytimg.com/vi/abc123/hqdefault.jpg'
		);
	});

	it('swaps in a privacy-enhanced iframe on click', async () => {
		const user = userEvent.setup();
		render(YouTube, { id: 'abc123', title: 'Demo video' });
		await user.click(screen.getByRole('button', { name: /play video/i }));
		const iframe = document.querySelector('iframe');
		expect(iframe).toBeInTheDocument();
		expect(iframe?.src).toContain('https://www.youtube-nocookie.com/embed/abc123');
	});
});
