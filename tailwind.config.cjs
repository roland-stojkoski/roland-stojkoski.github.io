const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			height: (theme) => ({
				'screen/2': '50vh'
			})
		}
	},
	plugins: [
		require('@tailwindcss/typography'), // Has to go first
		// require('flowbite/plugin'), // Doesn't work with daisyui, but we can borrow JS classes and use style
		require('daisyui')
	],
	// daisyUI config (optional)
	daisyui: {
		darkTheme: 'coffee',
		themes: ['retro', 'coffee']
	},
	darkMode: 'class'
};

module.exports = config;
