# Third-party notices

Scope: the SVG icon path data embedded in `src/lib/components/icons.ts`. That
data is copied from upstream icon sets, so the sets' copyright and permission
notices are reproduced verbatim below. Everything else the site credits —
fonts, photos, 3D models, tooling — is listed on
[/attributions](https://roland-stojkoski.github.io/attributions).

The bundled path data is served from the site, so the notices have to travel
with it: `static/THIRD-PARTY-NOTICES.md` is a byte-for-byte copy of this file
that the static adapter publishes at
<https://roland-stojkoski.github.io/THIRD-PARTY-NOTICES.md>. This file stays
the one that is edited.

## Where each glyph came from

Every entry below was checked by fetching the upstream SVG and comparing the
path data character by character (2026-08-26). "Verbatim" means the shapes and
their coordinates are identical; attribute or element order may differ, since
`Icon.svelte` owns the wrapper. Lucide is a fork of Feather, so several glyphs
reach this repo through Lucide while remaining under Feather's MIT licence —
Lucide's own `LICENSE` names them, and that list is what the "Feather-derived"
column below follows.

| Glyph            | Upstream                                               | Relationship                                                                                                                                                                                                            | Licence          |
| ---------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `accessibility`  | none found                                             | matches nothing in the sets listed below; origin unverified                                                                                                                                                             | —                |
| `arrow-down`     | Lucide `arrow-down` (Feather-derived)                  | verbatim                                                                                                                                                                                                                | MIT (Cole Bemis) |
| `arrow-right`    | Lucide `arrow-right` (Feather-derived)                 | Lucide's two paths merged into one, same geometry                                                                                                                                                                       | MIT (Cole Bemis) |
| `arrow-up-right` | Lucide `arrow-up-right` (Feather-derived)              | verbatim                                                                                                                                                                                                                | MIT (Cole Bemis) |
| `award`          | Lucide `award`, pre-0.400.0 drawing                    | coordinates rounded to two decimals                                                                                                                                                                                     | ISC (Lucide)     |
| `briefcase`      | Feather `briefcase`                                    | `ry="2"` dropped from the rect; Lucide carried the same drawing before its 0.4x redraw                                                                                                                                  | MIT (Cole Bemis) |
| `check`          | Feather `check`                                        | verbatim; Lucide has since replaced the polyline with a path                                                                                                                                                            | MIT (Cole Bemis) |
| `chevron-down`   | Lucide `chevron-down` (Feather-derived)                | verbatim                                                                                                                                                                                                                | MIT (Cole Bemis) |
| `chevron-left`   | Lucide `chevron-left` (Feather-derived)                | verbatim                                                                                                                                                                                                                | MIT (Cole Bemis) |
| `chevron-right`  | Lucide `chevron-right` (Feather-derived)               | verbatim                                                                                                                                                                                                                | MIT (Cole Bemis) |
| `chevron-up`     | Lucide `chevron-up` (Feather-derived)                  | verbatim                                                                                                                                                                                                                | MIT (Cole Bemis) |
| `clipboard`      | Lucide `clipboard` (Feather-derived)                   | verbatim                                                                                                                                                                                                                | MIT (Cole Bemis) |
| `cloud`          | Lucide `cloud`                                         | verbatim                                                                                                                                                                                                                | ISC (Lucide)     |
| `copy`           | Feather `copy`                                         | verbatim; Lucide has since redrawn its own `copy`                                                                                                                                                                       | MIT (Cole Bemis) |
| `external-link`  | Lucide `external-link` (Feather-derived)               | verbatim                                                                                                                                                                                                                | MIT (Cole Bemis) |
| `file-text`      | Feather `file-text`                                    | `<polyline>`/`<line>` rewritten as paths, same geometry                                                                                                                                                                 | MIT (Cole Bemis) |
| `github`         | Simple Icons `github`                                  | verbatim                                                                                                                                                                                                                | CC0 1.0          |
| `graduation-cap` | Lucide `graduation-cap`, 0.400.0 onwards               | coordinates rounded to two decimals                                                                                                                                                                                     | ISC (Lucide)     |
| `home`           | none found                                             | matches neither Feather's `home` nor any other set listed below; origin unverified                                                                                                                                      | —                |
| `infinity`       | Lucide `infinity`, pre-redraw                          | verbatim                                                                                                                                                                                                                | ISC (Lucide)     |
| `instagram`      | Feather `instagram`                                    | verbatim; Lucide carried the identical drawing until it dropped brand icons                                                                                                                                             | MIT (Cole Bemis) |
| `linkedin`       | Simple Icons `linkedin`, last shipped in 13.21.0       | verbatim                                                                                                                                                                                                                | CC0 1.0          |
| `mail`           | Lucide `mail`, pre-redraw (0.300.0 through 0.475.0)    | verbatim; current `main` renumbered the fold to `8.991`/`2`/`-2.009`                                                                                                                                                    | ISC (Lucide)     |
| `map-pin`        | none found                                             | same silhouette as Feather/Lucide `map-pin` but on different coordinates, and no other set listed below matches; origin unverified                                                                                      | —                |
| `menu`           | Lucide `menu`, pre-redraw (bars at y = 6/12/18)        | `<line>` rewritten as paths                                                                                                                                                                                             | ISC (Lucide)     |
| `moon`           | Lucide `moon`, pre-redraw (Feather-derived)            | verbatim                                                                                                                                                                                                                | MIT (Cole Bemis) |
| `rss`            | Lucide `rss` (Feather-derived; identical in both sets) | verbatim                                                                                                                                                                                                                | MIT (Cole Bemis) |
| `school`         | none found                                             | matches nothing in the sets listed below; origin unverified                                                                                                                                                             | —                |
| `search`         | Lucide `search`, pre-redraw (Feather-derived)          | verbatim                                                                                                                                                                                                                | MIT (Cole Bemis) |
| `sparkles`       | Lucide `sparkles`, 0.400.0 and 0.475.0                 | coordinates rounded to two decimals, absolute arcs rewritten as relative, Lucide's small second sparkle (`M4 17v2`/`M5 18H3`) dropped; 0.300.0 drew a different four-point star and current `main` has redrawn it again | ISC (Lucide)     |
| `star`           | none found                                             | five-point star in the Feather/Lucide idiom, but the coordinates match nothing in the sets listed below; origin unverified                                                                                              | —                |
| `sun`            | Lucide `sun`                                           | verbatim                                                                                                                                                                                                                | ISC (Lucide)     |
| `trending-up`    | Lucide `trending-up`                                   | verbatim against current `main`, which ships the same two paths in the opposite order; releases through 0.475.0 drew them as `<polyline>`s                                                                              | ISC (Lucide)     |
| `user`           | none found                                             | matches nothing in the sets listed below; origin unverified                                                                                                                                                             | —                |

Sets compared: Lucide at current `main`, 0.475.0, 0.400.0 and 0.300.0; Feather
at current `main`; Simple Icons at current `develop` plus 13.21.0 for
`linkedin`; and, for the rows marked _origin unverified_ only, Tabler outline
at current `main` and Heroicons 24/outline at current `master`. Tabler and
Heroicons ship no glyph of that name for `accessibility`, and Heroicons none
for `school`. "Origin unverified" is the whole claim those rows make: not
finding a match in these sets is not evidence that the glyph was drawn here.

### `linkedin`, specifically

Simple Icons shipped a LinkedIn mark up to and including 13.21.0 and removed it
in 14.0.0; it is absent from the current icon directory and from `slugs.md`.
The mark used here is byte-identical to the 13.21.0 file, so the CC0 waiver
below covers the copyright in that drawing. For the trademark position see
"Brand marks" immediately below.

### Brand marks

Three glyphs reproduce marks their owners hold trademarks in: `github` and
`linkedin` (Simple Icons, CC0 1.0) and `instagram` (Feather, MIT). Both
licences deal in copyright only — CC0 expressly leaves trademark rights
untouched (clause 4a), and MIT grants rights in the software, not in a mark —
so GitHub, LinkedIn and Instagram, and their logos, remain the trademarks of
GitHub, Inc., LinkedIn Corporation and Meta Platforms, Inc. respectively. Each
is used here solely to label a link to the owner's own profile or repository.

## Lucide

<https://lucide.dev> · retrieved from
<https://github.com/lucide-icons/lucide/blob/main/LICENSE>

```
ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Feather

<https://feathericons.com> · retrieved from
<https://github.com/feathericons/feather/blob/main/LICENSE>

```
The MIT License (MIT)

Copyright (c) 2013-2023 Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Simple Icons

<https://simpleicons.org> · retrieved from
<https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md>

```
# CC0 1.0 Universal

## Statement of Purpose

The laws of most jurisdictions throughout the world automatically confer exclusive Copyright and Related Rights (defined below) upon the creator and subsequent owner(s) (each and all, an “owner”) of an original work of authorship and/or a database (each, a “Work”).

Certain owners wish to permanently relinquish those rights to a Work for the purpose of contributing to a commons of creative, cultural and scientific works (“Commons”) that the public can reliably and without fear of later claims of infringement build upon, modify, incorporate in other works, reuse and redistribute as freely as possible in any form whatsoever and for any purposes, including without limitation commercial purposes. These owners may contribute to the Commons to promote the ideal of a free culture and the further production of creative, cultural and scientific works, or to gain reputation or greater distribution for their Work in part through the use and efforts of others.

For these and/or other purposes and motivations, and without any expectation of additional consideration or compensation, the person associating CC0 with a Work (the “Affirmer”), to the extent that he or she is an owner of Copyright and Related Rights in the Work, voluntarily elects to apply CC0 to the Work and publicly distribute the Work under its terms, with knowledge of his or her Copyright and Related Rights in the Work and the meaning and intended legal effect of CC0 on those rights.

1. Copyright and Related Rights. A Work made available under CC0 may be protected by copyright and related or neighboring rights (“Copyright and Related Rights”). Copyright and Related Rights include, but are not limited to, the following:
    1. the right to reproduce, adapt, distribute, perform, display, communicate, and translate a Work;
    2. moral rights retained by the original author(s) and/or performer(s);
    3. publicity and privacy rights pertaining to a person’s image or likeness depicted in a Work;
    4. rights protecting against unfair competition in regards to a Work, subject to the limitations in paragraph 4(i), below;
    5. rights protecting the extraction, dissemination, use and reuse of data in a Work;
    6. database rights (such as those arising under Directive 96/9/EC of the European Parliament and of the Council of 11 March 1996 on the legal protection of databases, and under any national implementation thereof, including any amended or successor version of such directive); and
    7. other similar, equivalent or corresponding rights throughout the world based on applicable law or treaty, and any national implementations thereof.

2. Waiver. To the greatest extent permitted by, but not in contravention of, applicable law, Affirmer hereby overtly, fully, permanently, irrevocably and unconditionally waives, abandons, and surrenders all of Affirmer’s Copyright and Related Rights and associated claims and causes of action, whether now known or unknown (including existing as well as future claims and causes of action), in the Work (i) in all territories worldwide, (ii) for the maximum duration provided by applicable law or treaty (including future time extensions), (iii) in any current or future medium and for any number of copies, and (iv) for any purpose whatsoever, including without limitation commercial, advertising or promotional purposes (the “Waiver”). Affirmer makes the Waiver for the benefit of each member of the public at large and to the detriment of Affirmer’s heirs and successors, fully intending that such Waiver shall not be subject to revocation, rescission, cancellation, termination, or any other legal or equitable action to disrupt the quiet enjoyment of the Work by the public as contemplated by Affirmer’s express Statement of Purpose.

3. Public License Fallback. Should any part of the Waiver for any reason be judged legally invalid or ineffective under applicable law, then the Waiver shall be preserved to the maximum extent permitted taking into account Affirmer’s express Statement of Purpose. In addition, to the extent the Waiver is so judged Affirmer hereby grants to each affected person a royalty-free, non transferable, non sublicensable, non exclusive, irrevocable and unconditional license to exercise Affirmer’s Copyright and Related Rights in the Work (i) in all territories worldwide, (ii) for the maximum duration provided by applicable law or treaty (including future time extensions), (iii) in any current or future medium and for any number of copies, and (iv) for any purpose whatsoever, including without limitation commercial, advertising or promotional purposes (the “License”). The License shall be deemed effective as of the date CC0 was applied by Affirmer to the Work. Should any part of the License for any reason be judged legally invalid or ineffective under applicable law, such partial invalidity or ineffectiveness shall not invalidate the remainder of the License, and in such case Affirmer hereby affirms that he or she will not (i) exercise any of his or her remaining Copyright and Related Rights in the Work or (ii) assert any associated claims and causes of action with respect to the Work, in either case contrary to Affirmer’s express Statement of Purpose.

4. Limitations and Disclaimers.
    1. No trademark or patent rights held by Affirmer are waived, abandoned, surrendered, licensed or otherwise affected by this document.
    2. Affirmer offers the Work as-is and makes no representations or warranties of any kind concerning the Work, express, implied, statutory or otherwise, including without limitation warranties of title, merchantability, fitness for a particular purpose, non infringement, or the absence of latent or other defects, accuracy, or the present or absence of errors, whether or not discoverable, all to the greatest extent permissible under applicable law.
    3. Affirmer disclaims responsibility for clearing rights of other persons that may apply to the Work or any use thereof, including without limitation any person’s Copyright and Related Rights in the Work. Further, Affirmer disclaims responsibility for obtaining any necessary consents, permissions or other rights required for any use of the Work.
    4. Affirmer understands and acknowledges that Creative Commons is not a party to this document and has no duty or obligation with respect to this CC0 or use of the Work.

For more information, please see <https://creativecommons.org/publicdomain/zero/1.0>.
```
