# Codespace walkthrough — from here to a live website

Written for someone who hasn't done this before. Every command is meant to be
copied and pasted exactly. Nothing here can break your computer, and nothing is
irreversible — the worst case is an error message you paste back to me.

**Two things to know before you start:**

A *terminal* is the black panel where you type commands. In your Codespace it's
at the bottom of the screen. If you don't see it, press <kbd>Ctrl</kbd> +
<kbd>`</kbd> (the backtick key, above Tab on most keyboards), or use the menu:
**Terminal → New Terminal**.

After typing a command, press <kbd>Enter</kbd> to run it. Some commands print a
lot of text. That's normal — you only need the last few lines.

---

## Step 1 — Find out how your files are arranged

In the terminal, type this and press Enter:

```bash
ls
```

`ls` means "list" — it shows what's in the current folder.

Look at what it prints, and match it to one of these two:

### Result A — you see many items, including `package.json`

Something like:

```
404.html   README.md   assets   index.html   netlify.toml   package.json   ...
```

**Your files are in the right place.** Skip to Step 3.

### Result B — you see one folder name, and nothing else

Something like:

```
ulc
```

**Your files are one level too deep.** This is the most common outcome when you
upload a folder to GitHub, and it's exactly what caused your build to fail.
Go to Step 2.

*(If you see something different from both — for example several folders, or
nothing at all — stop and paste the output to me rather than guessing.)*

---

## Step 2 — Move the files up one level (only if you got Result B)

Copy and paste these three lines **one at a time**, pressing Enter after each:

```bash
git mv ulc/* ulc/.[!.]* .
```

```bash
rmdir ulc
```

```bash
git commit -m "Move site to repository root"
```

Then check it worked:

```bash
ls
```

You should now see the long list from Result A, including `package.json`.

<details>
<summary>What those commands did</summary>

`git mv` moves files while telling Git about the move. The odd-looking
`ulc/.[!.]*` is a second pattern that catches files whose names begin with a
dot — `.gitignore` and `.nvmrc`. Those are invisible to `ulc/*`, and leaving
them behind causes a different problem later.

`rmdir` deletes the now-empty folder. `git commit` saves the change.
</details>

If you see `fatal: not under version control` or a similar error, paste it to me
— don't improvise.

---

## Step 3 — Install the tools

```bash
npm install
```

This downloads the two build tools the site needs. It takes about 30 seconds and
prints a wall of text. You're looking for a final line like `added 133 packages`.

Warnings that say `deprecated` are normal and safe to ignore.

---

## Step 4 — Run the check

```bash
npm run preflight
```

This is a script I wrote to check that Netlify will find everything it needs.

**If it says `PASS`** — go to Step 5.

**If it lists problems** — each one includes the exact commands to fix it. Run
them, then run `npm run preflight` again until it passes. If a fix doesn't work,
paste the whole output to me.

---

## Step 5 — Confirm the site itself is healthy

```bash
npm test
```

You want to see:

```
51/51 checks passed
22/22 checks passed
All text pairs pass AA.
```

Then build it:

```bash
npm run build
```

You want a final block like:

```
Build complete -> dist/
  pages            19
  assets hashed    22
```

If both of those worked, **Netlify's build will work too** — it runs these same
commands on the same kind of machine.

---

## Step 6 — See the site before anyone else does

```bash
npm run serve
```

The terminal will print `http://localhost:8080` and appear to hang. That's
correct — it's running.

A small popup should appear in the bottom-right corner offering to **Open in
Browser**. Click it. If no popup appears, look for a **PORTS** tab next to the
TERMINAL tab, find port 8080, and click the small globe icon.

Your site opens in a new browser tab. Click around: the FR/EN switch, the
Rector's welcome, a research project.

When you're finished looking, click back into the terminal and press
<kbd>Ctrl</kbd> + <kbd>C</kbd> to stop the server.

---

## Step 7 — Save your changes back to GitHub

If Step 2 changed anything, send it to GitHub now:

```bash
git push
```

If it asks you to sign in, follow the prompts — Codespaces usually handles this
automatically.

<details>
<summary>If it says "no upstream branch"</summary>

Run this instead:

```bash
git push -u origin main
```

If that complains about `main`, try `master` in its place — older repositories
use that name.
</details>

Now go to `https://github.com/sundamey/ULC-Website` in your browser and confirm
you can see `package.json` in the file list on the front page. **This is the
thing that was missing.** If it's there, Netlify will find it.

---

## Step 8 — Connect Netlify

This part happens in your browser, not the terminal.

1. Go to <https://app.netlify.com> and sign in (signing in with GitHub is
   easiest).
2. Click **Add new site** → **Import an existing project**.
3. Choose **GitHub**. Authorise it if asked.
4. Find and click **ULC-Website** in the list. If it isn't there, click
   **Configure the Netlify app on GitHub** and grant access to that repository.
5. Netlify shows a settings screen. Because your repo contains `netlify.toml`,
   these should already be filled in:

   | Field | Should say |
   |---|---|
   | Build command | `npm run build` |
   | Publish directory | `dist` |

   If either is empty, type it in by hand.
6. Click **Deploy**.

The build takes about a minute. Green **Published** means it worked, and there's
a link to your live site — a random name like `sparkly-tiramisu-8fa21c.netlify.app`
for now.

**If it fails**, click into the log, scroll to the bottom, and paste the last
20 lines to me. The final lines are the ones that matter.

---

## Step 9 — Your own domain (whenever you're ready)

In Netlify: **Domain management** → **Add a domain** → type `ulc.cd`.

Netlify will give you either nameservers or a DNS record to enter wherever
`ulc.cd` is registered. HTTPS (the padlock) is switched on automatically once
that takes effect — there's no certificate to buy.

---

## From now on, updating the site

Open the Codespace, edit a file, then:

```bash
npm test
git add -A
git commit -m "Describe what you changed"
git push
```

Netlify notices the push and rebuilds within a minute. That's the whole loop.

---

## If something goes wrong

| What you see | What to do |
|---|---|
| `command not found: npm` | You're not in the Codespace terminal. Open a new one: **Terminal → New Terminal**. |
| `ENOENT: no such file or directory, open 'package.json'` | You're in the wrong folder. Run `ls`, and if you see a single folder name, `cd` into it — e.g. `cd ulc`. |
| `npm run preflight` lists problems | Run the fix commands it prints, then run it again. |
| The Netlify build fails | Open the log, copy the last 20 lines, paste them to me. |
| Anything you don't recognise | Paste the full output. Guessing at commands is how small problems become big ones. |

---

## Two things still outstanding before the site goes public

Not urgent for getting it deployed, but important before you share the address:

1. **The Rector's welcome message is my draft, not Fr. Lentiampa's words.** It
   needs his own text, or his written approval. It's in
   `assets/js/i18n.js` under the keys beginning `rector.`
2. **The research projects are invented placeholders** — the investigators,
   grant numbers, and especially the funders (Wellcome Leap, Fogarty, IFAD,
   AGRA). Those organisations shouldn't appear on a real ULC site without their
   agreement. They're in `assets/js/data.projects.js`

Deploy first, replace the content second, then share the link. A private
Netlify URL that nobody has yet is a perfectly good place to test.
