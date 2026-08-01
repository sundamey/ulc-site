# Université Loyola du Congo — web platform

Dark-themed academic portal for ULC Kinshasa. Bilingual (FR/EN), mobile-first,
built for low-bandwidth connections: no images, no framework, no runtime
dependencies. All artwork is inline SVG.

## Layout

```
index.html                  Single-page shell: hero, admissions, research, giving
project.html                Abstract page template — project.html?id=<slug>&lang=fr
projects/                   Pre-rendered static abstracts (generated, 2 per project)
sitemap.xml                 Generated alongside the static abstracts
assets/
  img/                      Crest, favicon set, Rector portrait (responsive)
  css/ulc.css               Design tokens (CSS variables) + component classes
  js/
    tailwind.config.js      Tailwind theme mirroring the CSS tokens
    core.js                 DOM helpers, HTML escaping, field-error handling
    i18n.js                 Translation engine + the complete FR/EN dictionary
    data.projects.js        Bilingual research dataset (single source of truth)
    nav.js                  Mobile overlay menu
    admissions.js           Three-step application wizard
    research.js             Search + theme filtering over the dataset
    fundraising.js          Progress tracker + donation calculator
    project-render.js       Pure renderer, shared by browser and pre-render tool
    project-page.js         Browser controller for project.html
netlify.toml                Netlify build settings (Node version, publish dir)
netlify/_headers            Security + caching headers, copied into dist/
netlify/_redirects          Friendly paths, copied into dist/
404.html                    Bilingual not-found page, no JS required
tools/
  build.js                  One-command production build → dist/
  serve.js                  Zero-dependency local preview server
  contrast.js               WCAG audit of every colour pair in use
  prerender.js              Emits projects/*.html + sitemap.xml
  smoke.index.js            33 behavioural checks on the main page
  smoke.project.js          22 behavioural checks on the abstract pages
tailwind.config.js          Build config for the Tailwind CLI
package.json                Dev dependencies and the npm scripts
```

Scripts are classic (non-module) and attach to a single `ULC` namespace, so the
site runs from `file://` with no server and no build step.

## Commands

```bash
npm install               # one time — installs tailwindcss and jsdom (dev only)
npm run serve             # preview at http://localhost:8080
npm test                  # 73 behavioural checks + the WCAG contrast audit
npm run prerender         # regenerate projects/*.html + sitemap.xml
npm run build             # compile everything into a deployable dist/
npm run serve -- --dist   # preview the production build
```

The site also opens straight from the filesystem with no server at all —
double-click `index.html`. Scripts are classic (non-module), so nothing is
blocked by the browser's file:// restrictions.

## Brand palette

Tokens live in `assets/css/ulc.css` as CSS custom properties and are mirrored
into both Tailwind configs.

| Token | Hex | Role |
|---|---|---|
| `--ulc-black` | `#000000` | Page background |
| `--ulc-maroon` | `#8B0000` | Crest field — **surface only** |
| `--ulc-gold` | `#FFD700` | Primary accent: links, buttons, focus rings |
| `--ulc-brown` | `#8B4513` | Giraffe — **borders and fills only** |
| `--ulc-brown-soft` | `#CD8B4C` | Text-safe brown for research tags (7.4:1) |
| `--ulc-white` | `#FFFFFF` | Headings |
| `--ulc-body` | `#ECE3E1` | Body text — warm off-white, 16.6:1 |

Maroon and brown measure 2.1:1 and 3.0:1 against black, so neither can carry
text on a dark background. They are used as surfaces, with white or gold on top.
`npm run contrast` re-checks every pair the site actually uses; it exits non-zero
if any drops below AA.

## Rector welcome

The section markup and the bilingual copy live in `index.html` (`#rector`) and
`i18n.js` (`rector.*`). **The first-person text is draft copy, not Fr.
Lentiampa's words** — a comment in the source says so. Replace it with his own
address, or get his written approval, before publishing.

The portrait is served as WebP at three widths with a JPEG fallback, lazy-loaded
below the fold. The 1.9 MB source PNG became a 19 KB WebP.

## Language handling

Resolution order: `?lang=` in the URL → stored choice → browser language →
French. French is the fallback because it is the language of instruction.

Copy lives in `i18n.js`, never in the markup. Mark elements with `data-i18n`
(text), `data-i18n-placeholder`, `data-i18n-aria-label`, or `data-i18n-title`.
Switching language re-translates in place: form input, wizard step, active
filters, and scroll position all survive.

`data-lang-link` on an internal anchor keeps the active language in its query
string, so a shared URL opens in the language the sender was reading.

Currency follows the locale via `Intl.NumberFormat` — `$2,500,000` in English,
`2 500 000 $US` in French.

To add a language: add a block to `STRINGS`, add the code to `SUPPORTED`, add a
`data-lang-btn` control, and add the `en`/`fr` sibling to each bilingual field
in `data.projects.js`. `node tools/smoke.index.js` will report any key you miss.

## Adding a research project

Append an entry to `PROJECTS` in `assets/js/data.projects.js`, then run
`node tools/prerender.js`. The hub grid, filters, search index, related-project
links, and both static pages all follow from that one entry.

To move to a live backend, replace `PROJECTS` with a `fetch()` returning the
same shape. Nothing else changes.

## Production build

`npm run build` regenerates the static abstracts, compiles Tailwind down to only
the classes this site actually uses, strips the CDN from every page head, and
writes a deployable `dist/`. Measured output: **12.2 KB** of utilities (3.4 KB
gzipped) plus 10 KB of components, replacing roughly 400 KB of Play CDN.

Upload the contents of `dist/` to any static host. No server-side runtime is
required.

Google Fonts is the one remaining external request. If it is unreachable the
pages still render correctly — the stack falls back to system-ui, Segoe UI and
Roboto. To remove the dependency, download the Inter woff2 files into
`assets/fonts/` and replace the three font `<link>` tags with an `@font-face`
block in `ulc.css`.

## Hand-off points

Both are marked with comments in the source:

- `admissions.js` — POST the `FormData` to the admissions endpoint after the
  final step validates.
- `fundraising.js` — route `{ amount, method }` to the payment service provider
  or mobile-money aggregator, then redirect to its hosted confirmation page.

Campaign figures in `fundraising.js` are hard-coded; point `CAMPAIGN` at the
Foundation's ledger when one is available.

## Accessibility

Semantic landmarks, gold focus rings on every interactive element, `aria-pressed`
on filter chips and donation tiers, a real `role="progressbar"`, live regions on
the result count and donation note, Escape closes the mobile menu, and
`prefers-reduced-motion` disables all animation.

The static pages in `projects/` carry the full abstract in the initial HTML, so
they remain readable with JavaScript disabled and are indexable by search
engines and funders.
