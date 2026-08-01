# ULC portal — setup guide

Everything below has been run and verified in this build. Commands are
copy-paste ready.

---

## Step 0 — Look at it right now (30 seconds, no installation)

Unzip the `ulc` folder anywhere and **double-click `index.html`**.

Everything works: the crest and favicon, the Rector's welcome, the application
wizard, the research search and filters, the FR/EN toggle, the donation
calculator. There is no build step, no framework, and no server requirement.

Click **EN** at the top right to switch languages. Click **Lire le résumé** on
any research card to open that project's abstract page.

**One caveat:** on `file://`, Chrome gives the page an opaque origin, so your
language choice won't persist between page loads. It persists normally once the
site is served over `http://` (Step 2 onward). The code already handles this —
it falls back to in-memory storage rather than throwing.

---

## Step 1 — Install the toolchain (one time, ~2 minutes)

Needed only for the tests and the production build. Editing content never
requires it.

**Install Node.js** — version 18 or newer, from <https://nodejs.org> (take the
LTS build). Verify:

```bash
node --version        # expect v18.0.0 or higher
npm --version
```

Then, from inside the `ulc` folder:

```bash
cd path/to/ulc
npm install
```

This installs two development-only packages — `tailwindcss` (compiles the CSS)
and `jsdom` (runs the tests). Neither ships to visitors.

---

## Step 2 — Run it locally

```bash
npm run serve
```

Open <http://localhost:8080>. `Ctrl+C` stops it.

| URL | Shows |
|---|---|
| `localhost:8080` | Main page |
| `localhost:8080/?lang=en` | Main page, forced English |
| `localhost:8080/#rector` | The Rector's welcome |
| `localhost:8080/project.html?id=corneal-scaffolds` | One abstract page |
| `localhost:8080/projects/corneal-scaffolds.fr.html` | Its pre-rendered static twin |

---

## Step 3 — Confirm nothing is broken

```bash
npm test
```

Expected:

```
51/51 checks passed
22/22 checks passed
All text pairs pass AA.
```

Run this after any edit. It covers wizard validation, search and filtering, the
donation calculator, the language switch, the abstract pages, the brand assets,
the Rector section — and finishes with a WCAG contrast audit of every colour
pair the site uses.

To check colours alone after a palette tweak:

```bash
npm run contrast
```

---

## Step 4 — Put in your real content

### 4a · The Rector's welcome — do this first

`index.html`, section `#rector`, with the text in `assets/js/i18n.js` under the
`rector.*` keys (both `fr` and `en` blocks).

> **The first-person message is draft copy I wrote, not Fr. Lentiampa's words.**
> A comment in the source says so. Replace it with his own address, or obtain his
> written approval, before this page is published. Publishing invented words
> under a Rector's name and photograph is the kind of thing that is very hard to
> walk back.

The announcement ribbon at the top of the page is `ribbon.rector` and
`ribbon.link` in the same file.

### 4b · Research projects → `assets/js/data.projects.js`

Copy an existing block and edit. Every human-readable field takes both
languages:

```js
{
  id: 'my-project-slug',        // becomes the URL — lowercase, hyphens only
  tag: 'health',                // health | agri | bioprint
  status: 'proj.statusActive',  // Active | Fieldwork | Recruiting | Analysis
  pi: { name: 'Prof. …', role: { en: '…', fr: '…' } },
  coInvestigators: ['…'],
  funder: '…',
  grant: '…',
  duration: '2026 – 2029',
  partners: ['…'],
  contact: 'name@ulc.cd',
  title:    { en: '…', fr: '…' },
  summary:  { en: '…', fr: '…' },   // one sentence, shown on the card
  keywords: { en: ['…'], fr: ['…'] },
  abstract: { en: ['para 1', 'para 2'], fr: ['para 1', 'para 2'] },
  publications: [{ title: { en: '…', fr: '…' }, venue: '…', year: 2026 }],
}
```

Then `npm run prerender`. The grid, search index, filter counts, related-project
links and both static pages all follow.

> Every investigator name, grant number, funder and abstract currently in this
> file is placeholder material. The funder names especially — Wellcome Leap,
> Fogarty, IFAD, AGRA — must not appear on a live ULC site without those
> organisations' agreement.

### 4c · Interface text → `assets/js/i18n.js`

Every visible string. Change the text, not the key. The `en` and `fr` blocks
must stay symmetric — `npm test` reports any key present in one and missing in
the other.

### 4d · Campaign figures → `assets/js/fundraising.js`, line 12

```js
var CAMPAIGN = { raised: 1634500, target: 2500000, donors: 1284 };
```

Donation tiers are the four `data-amount` values in `index.html`.

---

## Step 5 — Brand assets

All in `assets/img/`, generated from your three uploads:

| File | Source | Notes |
|---|---|---|
| `ulc-logo.png` | your crest | White background removed by flood fill from the edges, so the interior white detail survives. 15 KB. |
| `favicon-32x32.png`, `-16x16`, `favicon.ico` | your favicon | Full set for all browsers. |
| `apple-touch-icon.png` | crest on `#8B0000` | iOS ignores transparency, so the crest sits on brand maroon. |
| `rector-320/480/640.webp`, `rector-480.jpg` | the portrait | 1.9 MB PNG → 19 KB WebP at display size, lazy-loaded, with a JPEG fallback. |

To replace any of them, drop in a file of the same name and rebuild. If you get
a higher-resolution crest, use it — the current one is only 103 px square, which
is fine at the 40 px header size but would soften if enlarged.

### The palette, and one constraint worth knowing

| Token | Hex | Role |
|---|---|---|
| `--ulc-black` | `#000000` | Page background |
| `--ulc-maroon` | `#8B0000` | Crest field — **surface only** |
| `--ulc-gold` | `#FFD700` | Links, buttons, focus rings |
| `--ulc-brown` | `#8B4513` | Giraffe — **borders and fills only** |
| `--ulc-brown-soft` | `#CD8B4C` | Text-safe brown for research tags |
| `--ulc-white` | `#FFFFFF` | Headings |
| `--ulc-body` | `#ECE3E1` | Body text, warm off-white |

Maroon measures 2.1:1 against black and brown 3.0:1 — both well under the 4.5:1
minimum for readable text. They work beautifully as surfaces with white or gold
on top, which is how the crest itself uses them, but neither can be a text
colour on this dark theme. `npm run contrast` enforces that.

Tokens live in `assets/css/ulc.css` and are mirrored into `tailwind.config.js`
and `assets/js/tailwind.config.js`. Change all three together.

---

## Step 6 — Build for production

```bash
npm run build
```

Regenerates the static abstracts, compiles Tailwind down to only the classes in
use, strips the development CDN from all 18 pages, and assembles `dist/`.
Verified output:

```
pages            18
tailwind.min.css 12.5 KB
ulc.css          12.2 KB
images           149.5 KB (9 files)
```

Measured first load, gzipped: **53 KB** for the whole page including the crest
and favicon. The portrait adds 19 KB and loads lazily, below the fold. For
comparison, the development CDN alone is roughly 400 KB.

Preview exactly what you're about to publish:

```bash
npm run serve -- --dist
```

---

## Step 7 — Deploy

Upload **the contents of `dist/`** — not the folder itself.

- **Netlify or Cloudflare Pages (easiest):** drag the `dist` folder onto
  <https://app.netlify.com/drop>. Live HTTPS URL in seconds; then point `ulc.cd`
  at it from the site settings.
- **Shared hosting / cPanel:** upload the contents of `dist/` into `public_html/`.
- **GitHub Pages:** serve from a `gh-pages` branch holding the `dist` contents.
  `.gitignore` currently excludes `dist/` — remove that line if you take this route.
- **Your own server:** any Nginx or Apache document root. Enable gzip or brotli.

Then edit `sitemap.xml` and the `<link rel="canonical">` in `tools/prerender.js`
to your real domain (both say `www.ulc.cd`) and rebuild.

---

## Step 8 — Connect the two live systems

The prototype validates and calculates correctly but transmits nothing. Both
hand-off points are marked in the source.

**Applications** — `assets/js/admissions.js`, in the `btnNext` handler:

```js
// Hand-off point: POST the FormData to the admissions endpoint here.
```

Send `new FormData(form)` — the documents are real `File` objects. Move to the
confirmation panel only after the request succeeds. Over a Kinshasa connection a
9 MB diploma upload will sometimes fail, and a confirmation shown after a silent
failure loses a student their application without either of you knowing.

**Donations** — `assets/js/fundraising.js`, in the submit handler:

```js
// Checkout hand-off: route { amount, method } to the PSP or the mobile
// money aggregator here, then redirect to its hosted confirmation page.
```

For M-Pesa, Orange Money and Airtel Money in the DRC, an aggregator
(Flutterwave, Paystack, MaxiCash) is more practical than three carrier
integrations. Redirect to their hosted checkout — never collect card details on
this page, which would put ULC in PCI-DSS scope for no benefit.

---

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| Page loads unstyled | `assets/` must sit beside `index.html`. Keep the folder structure intact. |
| Logo shows as a white box | You replaced `ulc-logo.png` with a version that still has its white background. It needs transparency. |
| Research grid is empty | A JavaScript error, usually a trailing comma or unbalanced brace in `data.projects.js`. Open the console (F12). |
| A label shows as `rector.p1` | That key is missing from `i18n.js`. The raw key is the intentional fallback so the omission is visible. |
| `npm run contrast` fails | A colour you changed is now unreadable. The output names the pair and the ratio. |
| `npm: command not found` | Node.js isn't installed or isn't on PATH. Reinstall and open a new terminal. |
| Language resets every load | You're on `file://`. Serve over `http://` — Step 2. |
| Fonts differ from the mockup | Google Fonts is unreachable. The page falls back to system fonts by design. |

---

## Command reference

| Command | Effect |
|---|---|
| `npm install` | Installs the dev toolchain. Once, after unzipping. |
| `npm run serve` | Local preview at :8080. |
| `npm test` | 73 behavioural checks plus the contrast audit. |
| `npm run contrast` | Colour audit alone. |
| `npm run prerender` | Rebuilds the static abstract pages and sitemap. |
| `npm run build` | Produces the deployable `dist/`. |
| `npm run serve -- --dist` | Previews the production build. |
