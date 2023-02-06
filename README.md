# Roland Stojkoski's portfolio website

Simple website that lists all my projects, articles and notable events.
Powered by SvelteKit, Tailwind, DaisyUI, FlowBite, FontAwesome, Mailchimp, etc.

Features:
- Markdown - just add an `.md` file and new article page will be added
- Plug and play UI components with Tailwind and DaisyUI - super easy for someone that's not proficient in frontend dev
- Email subscription - using Mailchimp
- Dark mode 😀

---

## Adding articles

Add a Markdown `.md` file to - `src/lib/assets/articles/`.

Add the following to the beggining file and fill out the `<>` values:

```
---
title: '<title>'
date: '<m/d/yyyy>'
tldr: '<timeline-summary>'
githubLink: '<link-to-github-repo>' # not required
---

```

The article will show up in the timeline and will be added as a page automatically.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Deploying 

To deploy the production version to Github:

```bash
npm run deploy
```

Go to - `https://github.com/<username>/<username>.github.io/deployments` and check if the deployment succeeded.

Open `https://<username>.github.io`.

## Formatting

To run the formatter:

```bash
npm run format
```

Then check with the linter:
```bash
npm run lint
```

# TODOs

- Make the repo more generic so others can use it
- Improve responsiveness
- Add tests