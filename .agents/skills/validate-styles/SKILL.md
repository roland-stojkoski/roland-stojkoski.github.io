---
name: validate-styles
description: Validate stylesheet, theme, and layout changes across latte (light) and espresso (dark) modes. Use whenever styles, CSS variables, daisyUI themes, or tailwind configurations are edited.
---

# Validating Styles and Stylesheet Changes

This project uses a combination of Svelte variables, vanilla CSS custom variables in `src/app.css`, and Tailwind CSS 4 configurations. To check for styling regressions, follow this validation checklist.

## Core Design Principles

1. **Latte Theme (Light Mode)**: Ensure that headers, borders, text contrast, and color bubbles have strong readability. Avoid styling elements with pure white backgrounds (`bg-white`) if they overlay base colors. Use system CSS base colors (`var(--color-base-100)`, `var(--color-base-content)`, etc.).
2. **Espresso Theme (Dark Mode)**: Ensure contrast remains high. Embedded widgets (like Google Translate or Giscus) must follow theme attributes correctly.
3. **No Hardcoded Tailwind Colors**: Prefer daisyUI semantic color utilities (`text-primary`, `bg-secondary`, `border-base-300`, `text-base-content`) over hardcoded color utilities (like `bg-zinc-800` or `text-sky-500`) to guarantee that both latte and espresso themes dynamically theme elements correctly.

---

## Validation Flow

When you make styling, layout, or stylesheet modifications:

### 1. Execute Lint and Formatting Check

Confirm that class additions or custom CSS properties satisfy style rules:

```bash
npm run format
npm run lint
```

### 2. Generate and Inspect Visual Screenshots

Run the verification sequence to generate full-page visual tests of all main pages in both light and dark themes:

```bash
npm run verify
```

This runs the full test suite and outputs PNG screenshots to:

- `screenshots/latte/` (Light mode rendering)
- `screenshots/espresso/` (Dark mode rendering)

### 3. Check Specific Snapshots

View the screenshots to verify the layout:

- `home.png` – Check the ambient bubble positions, text contrast, name glitch animation, and hero card layout.
- `about.png` – Confirm that biography paragraphs flow properly and avatar shapes maintain rounded corners.
- `articles.png` – Validate cards layout, tag buttons contrast, and search fields.
- `article-detail.png` – Inspect code syntax highlighting tokens and copy buttons positioning.
- `contact.png` – Confirm that grid elements remain aligned and the RSS card details are visible.

### 4. Verify Storybook Components

If UI components were edited, compile Storybook to ensure no static build errors:

```bash
npm run build-storybook
```
