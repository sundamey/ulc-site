# Deploying the ULC site to Netlify

## Fixing the build you just saw

```
npm error path /opt/build/repo/package.json
npm error enoent Could not read package.json
```

Netlify cloned your repository, looked in the top level for `package.json`, and
didn't find one. `package.json` **is** in the project folder and is **not**
excluded by `.gitignore` — I checked both. So the file is fine; it's just not
where Netlify is looking.

Run this from inside the project folder in your repo:

```bash
npm run preflight
```

It reports which of the two causes below applies, with the exact commands to
fix it.

---

### Cause 1 — the site is in a subfolder (most likely)

This happens when you create a repository and drop the whole `ulc` folder into
it:

```
your-repo/
  ulc/                <- everything is one level down
    package.json
    index.html
```

Netlify only looks at `/opt/build/repo/` — the top level — so it sees a folder
named `ulc` and no `package.json`.

**Fix A — move the files up (simplest, recommended).** From the repository root:

```bash
git mv ulc/* ulc/.[!.]* .
rmdir ulc
git commit -am "Move site to repository root"
git push
```

The `.[!.]*` part matters — it catches `.gitignore` and `.nvmrc`, which a plain
`ulc/*` would leave behind.

**Fix B — tell Netlify where to look.** Keep the subfolder and copy
`netlify.subfolder.toml` to the **repository root**, renamed to `netlify.toml`:

```bash
cp ulc/netlify.subfolder.toml ./netlify.toml
git add netlify.toml && git commit -m "Set Netlify base directory"
git push
```

It sets `base = "ulc/"`, which makes Netlify `cd` into that folder before
installing and building. Note that `publish = "dist"` is then resolved relative
to `base`, so it means `ulc/dist`. Edit the folder name if yours isn't `ulc`.

---

### Cause 2 — `package.json` was never committed

Less likely, but worth ruling out. Netlify only ever sees committed files, so a
file present on your disk but absent from the commit is invisible to it.

```bash
git ls-files | grep package.json     # no output = not committed
git add -A
git commit -m "Add missing project files"
git push
```

---

### If you'd rather not fight the build at all

Netlify's build step is optional. You can build locally and deploy the finished
folder — no Node on Netlify, nothing to go wrong:

```bash
npm run build
```

Then drag the **`dist` folder** onto <https://app.netlify.com/drop>.

This works fully because `_headers` and `_redirects` live inside `dist/`. The
trade-off is that every future update needs another manual build and upload,
whereas the Git route republishes on `git push`. For a site that a
communications officer will update, Git is worth the twenty minutes.

---

## Full deployment, from scratch

### 1. Git

From inside the project folder:

```bash
git init
git add .
git commit -m "ULC web platform"
npm run preflight          # confirms Netlify will find everything
```

Create an empty repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR-ORG/ulc-web.git
git branch -M main
git push -u origin main
```

`.gitignore` excludes `node_modules/` and `dist/` — Netlify builds `dist/`
itself, so it shouldn't be committed.

### 2. Connect

<https://app.netlify.com> → **Add new site** → **Import an existing project** →
your Git provider → the repository.

Netlify reads `netlify.toml` and pre-fills:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 20 (from `netlify.toml` and `.nvmrc`) |

Deploy. First build takes about a minute.

### 3. Updating afterwards

```bash
# edit assets/js/data.projects.js, i18n.js, whatever
npm test
git commit -am "Add three new research projects"
git push          # Netlify rebuilds and publishes
```

Pull requests get their own preview URL — a good way to show Fr. Lentiampa his
welcome text before it reaches the live site.

### 4. Domain

Site settings → **Domain management** → **Add a domain** → `ulc.cd`. Netlify
offers either nameservers or an A/CNAME record. HTTPS via Let's Encrypt is
automatic once DNS resolves.

Then set your real domain in two places and redeploy:

- `sitemap.xml`
- the `<link rel="canonical">` line in `tools/prerender.js`

Both currently say `www.ulc.cd`.

---

## What the configuration does

### Caching, and why assets are fingerprinted

Netlify's default is `max-age=0, must-revalidate` — safe, but it costs a
revalidation round trip for every file on every visit, which is the wrong trade
on a slow connection.

`tools/build.js` gives every file under `/assets/` an 8-character content hash:

```
assets/css/ulc.css   →   assets/css/ulc.97180661.css
assets/js/i18n.js    →   assets/js/i18n.4b2c81de.js
```

A changed file always gets a new URL, which is what makes the one-year
immutable cache in `_headers` safe. Returning visitors download the HTML and
nothing else. HTML is never fingerprinted and always revalidates, so edits
appear immediately.

Immutable caching on *unhashed* filenames is a common and painful mistake —
visitors hold a stale site for a year with no way to clear it.

### Security headers

`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, and a strict CSP with no `'unsafe-inline'`.

That's only possible because the pages have no inline scripts — the boot calls
live in `assets/js/boot.home.js` and `boot.project.js` for exactly this reason.
`npm run build` fails if an inline `<script>` or `style=""` creeps back in, so
the policy can't quietly rot.

Verify after deploying:

```bash
curl -sI https://ulc.cd | grep -i -E 'content-security|x-frame|cache-control'
```

### Why headers live in `dist/`, not `netlify.toml`

A root `netlify.toml` is ignored by drag-and-drop deploys. `_headers` and
`_redirects` are copied into the publish directory instead, so both deploy
methods get the same security and caching rules.

### Redirects

`/admissions`, `/recherche`, `/don`, `/recteur` → the matching section, so print
material can carry a clean URL.

There is deliberately **no** `/* → /index.html 200` catch-all. That's a
single-page-app rule; here it would swallow real 404s and hide broken project
links. Netlify serves the bilingual `404.html` automatically.

---

## Netlify Forms and the application pipeline

Netlify Forms looks like the obvious way to receive applications without a
backend. For this form it isn't the right fit:

**The 8 MB request cap.** Netlify Forms limits a request to 8 MB total, times
out uploads after 30 seconds, and supports one file per field. Your form takes a
5 MB passport photo plus a 10 MB diploma — up to 15 MB. Submissions would fail,
and a phone photograph of a diploma will often exceed the cap on that field
alone. Thirty seconds is also short for 10 MB over a Kinshasa mobile connection.

**It's PII.** Netlify's own documentation says forms accepting file uploads
containing personally identifiable information need additional security
configuration. Passport photos and state diplomas are squarely that.

**Automatic billing.** The free tier covers 100 submissions per month; past
that, Netlify upgrades the site automatically and charges at cycle end without
asking. An admissions season would pass 100 in days.

**Use instead:** a Netlify Function issuing presigned uploads to S3-compatible
storage, or Supabase, Firebase, or an endpoint at ULC. The hand-off point is
marked in `assets/js/admissions.js`.

Netlify Forms is genuinely good for a short contact form with no attachments —
worth adding for that.

Whatever you use: show the confirmation panel only after the upload succeeds. A
student who sees "candidature reçue" after a silent failure has lost their
application without either of you knowing.

---

## Payments

Nothing changes on Netlify — the page redirects to a hosted checkout, so no card
data touches your site. Add your aggregator's domain to `connect-src` in
`netlify/_headers` if their SDK calls out, and to `form-action` if the checkout
POSTs from your page.

---

## Checklist

```
[ ] npm run preflight passes
[ ] npm test passes
[ ] Rector's welcome replaced with his own words, or approved by him
[ ] Placeholder research projects replaced (funder names especially)
[ ] Campaign figures updated in assets/js/fundraising.js
[ ] sitemap.xml and prerender.js canonical set to the real domain
[ ] npm run build succeeds
[ ] npm run serve -- --dist looks right
[ ] deployed, domain connected, HTTPS green
[ ] curl -sI confirms CSP and cache headers are live
[ ] admissions endpoint wired and tested with a real 10 MB file
```
