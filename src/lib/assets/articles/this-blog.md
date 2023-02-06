---
title: 'Today on "How it is made"... this website?'
date: '2/6/2023'
tldr: 'Process and design decisions behind this very website.'
githubLink: 'https://github.com/roland-stojkoski/roland-stojkoski.github.io'
---

# How does this website you are reading this heading from - work?

_Note: I am only a SysDE, so forgive me if some of the frontend lingo is incorrect 😋_

Have you ever wanted to set up a portfolio site, but soon gave up? If you ever found yourself giving up after trying different frontend frameworks, realising there is a learning curve to all of them and if you're not a web designer (like me) you would end up with a website that looks unappealing. Also, hosting it meant adding even more complexity and is just another reason to give up.

You are in the right place!

The goal of this project was to develop a functional and visually appealing web application using a combination of modern tools and software while keeping the complexity low. The very website you are reading this blog post on was created using the following tools: [SvelteKit](https://kit.svelte.dev/), [Tailwind CSS](https://tailwindcss.com/), [daisyUI](https://daisyui.com/), [Flowbite](https://flowbite-svelte.com/), [Markdown](https://www.markdownguide.org/), and [Mailchimp](https://mailchimp.com/).

The chosen option for hosting is - [GitHub Pages](https://pages.github.com/), for its ease of use, affordability and the fact that the same service is used for both hosting the code base and the website itself.

I will be covering how to set up the project by yourself from scratch (high-level), but soon I'll turn this into a template/library, so stay tuned - [subscribe](/contact).

![svelte-hero-image](/this-blog/svelte-kit-horizontal-hero.svg)

SvelteKit was selected as the primary framework for its ease of use and effective (and opinionated) routing system ([Routing - SvelteKit](https://kit.svelte.dev/docs/routing)). This relatively new framework provides the ability to create fast and responsive web applications, making it a perfect fit for this project.

![tailwind-hero-image](/this-blog/tailwind-css-logo-vector.svg)

Tailwind CSS was used for its simplicity and consistency in design. With pre-defined CSS classes, I was able to quickly create custom styles without writing complex CSS code. This resulted in a clean and consistent look throughout the website.

![flowbite-hero-image](/this-blog/flowbite-logo-hero.svg) ![daisy-ui-logo](/this-blog/daisy-ui-logo.svg)

To enhance the design, I utilized DaisyUI and Flowbite. These pre-built components were helpful in adding design elements to the website without spending excessive time on it. DaisyUI also has support for theming, allowing me to customize the look and feel of the website with ease.

![daisy-ui-logo](/this-blog/markdown-logo.svg)

Markdown was chosen for its ease of writing and readability. This lightweight markup language made it simple to write articles and blog posts for the website.

![mailchimp-logo](/this-blog/mailchimp-vector-logo.svg)

Finally, I selected Mailchimp for the email newsletter due to its affordability and user-friendly setup process. Mailchimp is a well-known email marketing service that offers a straightforward way to manage email campaigns. With its drag-and-drop builder, I was able to create professional-looking emails efficiently.

This website is hosted on Github Pages, a platform that provides a simple and affordable solution for hosting websites.

## Some practical pointers

Starting the project (from - [SvelteKit](https://kit.svelte.dev/)):

```bash
npm create svelte@latest my-app # replace my-app with your own name
cd my-app
npm install
npm run dev -- --open # Opens the barebones app in your default web browser
```

Adding Tailwind CSS:

```bash
npx svelte-add@latest tailwindcss
```

Adding Flowbite and daisyUI:

```bash
npm i -D flowbite-svelte
npm i -D daisyui
```

Add the following to your `tailwind.config.cjs`:

```javascript
...
	plugins: [
		require('@tailwindcss/typography'), // Has to go first
		// require('flowbite/plugin'), // Doesn't work with daisyui, but we can borrow JS classes and use style
		require('daisyui')
	],
	daisyui: { // Choose themes - https://daisyui.com/docs/themes/
		darkTheme: 'coffee',
		themes: ['retro', 'coffee']
	},
	darkMode: 'class'
...
```

Add [mdsvex](https://mdsvex.pngwn.io/) for Markdown to Svelte components preprocessing:

```bash
npm i -D mdsvex
```

Then add the following to your `svelte.config.js`:

```javascript
import { mdsvex } from 'mdsvex';
...
	extensions: ['.svelte', '.md'], # Add .md
...
	preprocess: [
		mdsvex({
			extensions: ['.md']
		}),
...
```

... now any new `*.md` file that you add to your project will be automatically preprocessed to a Svelte component.
This will make it easier for us to create new articles and update the old ones in the future.

_There is some extra work needed to make it easy to update the links, tab names, etc. from the Markdown files as well, which is out of the scope of this article. You can look into that given logic - [here](https://github.com/roland-stojkoski/roland-stojkoski.github.io/blob/d5b5209797e34a08723256b1b74dfbbda25975ea/src/routes/+page.ts), [here](https://github.com/roland-stojkoski/roland-stojkoski.github.io/blob/d5b5209797e34a08723256b1b74dfbbda25975ea/svelte.config.js#L9), [here](https://github.com/roland-stojkoski/roland-stojkoski.github.io/blob/d5b5209797e34a08723256b1b74dfbbda25975ea/src/routes/articles/%5Bslug%5D/+page.ts) and [here](https://github.com/roland-stojkoski/roland-stojkoski.github.io/blob/main/src/lib/home/DevTimeline.svelte)._

Finally, one crucial thing to look into is - [Routing - SvelteKit](https://kit.svelte.dev/docs/routing), this will give you an intro to how SvelteKit handles page routing and server-side rendering (which will be disabled in order to be able to host on Github pages).

### How to deploy to Github Pages

Follow - [GitHub Pages docs](https://pages.github.com/) on how to set things up on Github.

Add the following to your top-level `+layout.ts` in `src/routes`:

```javascript
export const prerender = true;
```

Install - [gh-pages](https://www.npmjs.com/package/gh-pages):

```bash
npm i -D gh-pages
```

Add the following to your `package.json`:

```json
...
		"deploy": "touch build/.nojekyll && gh-pages -d build -t true",
...
```

To deploy:

```bash
npm run dev -- --open # Validate the changes and kill the server when done
npm run build # Prerenders the artifacts and creates a build/ directory
npm run deploy # Deploys to Github repo on a separate branch (make sure in the settings you switch to that branch [default is - gh-pages])
```

Go to - `https://github.com/<username>/<username>.github.io/deployments` (replace `<username>` with your own) and check if the deployment succeeded.

Open `https://<username>.github.io` and enjoy your shiny new website 😀.

### Other

[Font Awesome](https://fontawesome.com/) is another framework used throughout the project, but it is just nice to have (IMHO).

I also haven't covered how to set up Mailchimp as it depends on how you have set up your own project and there is an online guide on how to create embeddable form - [Use Code Content Blocks in the Classic Builder | Mailchimp](https://mailchimp.com/en-gb/help/use-code-content-blocks/).

### Stay tuned

I will be turning this website into a template. If you want me to notify you when this generic template will be available, or for any new articles and/or projects - [subscribe here](/contact).

Thank you for reading! Happy coding and hopefully see you soon! 😀

---

Links:

- Repo - [roland-stojkoski/roland-stojkoski.github.io](https://github.com/roland-stojkoski/roland-stojkoski.github.io)
- This blog in markdown - [roland-stojkoski.github.io/this-blog.md at main](https://github.com/roland-stojkoski/roland-stojkoski.github.io/blob/main/src/lib/assets/articles/this-blog.md)
