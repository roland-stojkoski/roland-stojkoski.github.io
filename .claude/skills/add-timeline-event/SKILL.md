---
name: add-timeline-event
description: Add a non-article life event (job change, milestone, move, award) to the homepage timeline. Use when asked to add a timeline entry that has no article attached.
---

# Adding a timeline event

Life events live in `src/lib/data/timeline.ts` (`lifeEvents` array), newest
first. They are merged with articles and sorted by `date` at render time.

## Shape

```ts
{
	kind: 'event',
	date: year(2026),        // real Date used ONLY for sort order
	dateLabel: '2026',       // what is displayed
	title: 'Promoted to X @ Y',
	subtitle: 'Optional second line 🇮🇪',   // optional
	icon: 'trending-up'      // must exist in src/lib/components/icons.ts
}
```

- Year-only events use the `year(n)` helper; use a precise `new Date(y, m, d)`
  when ordering against other same-year entries matters.
- Flags/emoji go directly in `title`/`subtitle` text.
- `icon` must be a key of the `icons` map — check
  `src/lib/components/icons.ts`; add a new inline SVG there first if needed
  (24x24 viewBox, stroke style to match the set).

## Checklist

1. Keep the array sorted newest-first (a unit test enforces it)
2. `npm run test:unit -- --run` — icon existence and ordering are covered
3. Preview the homepage in both themes
4. Commit as `feat: add <thing> timeline event`
