#!/usr/bin/env node
/* ==========================================================================
   ULC — Production build
   Compiles Tailwind down to only the classes this site uses, rewrites every
   page head to drop the CDN, and assembles a deployable dist/ folder.

   Usage:  node tools/build.js
   Output: dist/  — upload the contents of this folder to your web host.
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const CDN_TAG = '<script src="https://cdn.tailwindcss.com"></script>';
const CFG_RE = /<script src="(?:\.\.\/)?assets\/js\/tailwind\.config\.js"><\/script>\s*/;

function rm(p) { fs.rmSync(p, { recursive: true, force: true }); }
function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}
function kb(p) { return (fs.statSync(p).size / 1024).toFixed(1) + ' KB'; }

/* 1 · Regenerate the static project pages so dist is never stale ---------- */
execFileSync(process.execPath, [path.join(ROOT, 'tools/prerender.js')], { stdio: 'inherit' });

/* 2 · Compile Tailwind ---------------------------------------------------- */
rm(DIST);
fs.mkdirSync(DIST, { recursive: true });

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
execFileSync(npx, [
  'tailwindcss',
  '-c', path.join(ROOT, 'tailwind.config.js'),
  '-i', path.join(ROOT, 'assets/css/tailwind-entry.css'),
  '-o', path.join(DIST, 'assets/css/tailwind.min.css'),
  '--minify',
], { cwd: ROOT, stdio: 'inherit' });

/* 3 · Copy the runtime assets -------------------------------------------- */
copy(path.join(ROOT, 'assets/css/ulc.css'), path.join(DIST, 'assets/css/ulc.css'));

fs.readdirSync(path.join(ROOT, 'assets/js'))
  .filter((f) => f.endsWith('.js') && f !== 'tailwind.config.js') // CDN-only file
  .forEach((f) => copy(path.join(ROOT, 'assets/js', f), path.join(DIST, 'assets/js', f)));

fs.readdirSync(path.join(ROOT, 'assets/img'))
  .forEach((f) => copy(path.join(ROOT, 'assets/img', f), path.join(DIST, 'assets/img', f)));

for (const f of ['_headers', '_redirects']) {
  copy(path.join(ROOT, 'netlify', f), path.join(DIST, f));
}

if (fs.existsSync(path.join(ROOT, 'sitemap.xml'))) {
  copy(path.join(ROOT, 'sitemap.xml'), path.join(DIST, 'sitemap.xml'));
}


/* 3b · Fingerprint assets ---------------------------------------------------
   Netlify serves /assets/* with a one-year immutable cache header (see
   netlify.toml). That is only safe if the filename changes when the content
   does, so every asset gets an 8-char content hash and each page reference is
   rewritten to match. Without this, a returning visitor would keep a stale
   stylesheet for a year. */
const assetMap = new Map();

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

for (const file of walk(path.join(DIST, 'assets'))) {
  const hash = crypto.createHash('sha256')
    .update(fs.readFileSync(file)).digest('hex').slice(0, 8);
  const ext = path.extname(file);
  const hashed = file.slice(0, -ext.length) + '.' + hash + ext;
  fs.renameSync(file, hashed);
  assetMap.set(
    path.relative(DIST, file).split(path.sep).join('/'),
    path.relative(DIST, hashed).split(path.sep).join('/')
  );
}

// Longest paths first so no path is a prefix of another during replacement.
const assetPairs = [...assetMap.entries()].sort((a, b) => b[0].length - a[0].length);

function rewriteAssets(html) {
  for (const [from, to] of assetPairs) {
    html = html.split(from).join(to);
  }
  return html;
}

/* 4 · Rewrite each page head --------------------------------------------- */
function processPage(srcRel, depth) {
  const prefix = depth ? '../'.repeat(depth) : '';
  let html = fs.readFileSync(path.join(ROOT, srcRel), 'utf8');

  // Utilities load after the component stylesheet so a utility in the markup
  // still wins over a component class — the same order the CDN produced.
  html = html
    .replace(CDN_TAG, '')
    .replace(CFG_RE, '')
    .replace(
      new RegExp(`<link rel="stylesheet" href="${prefix.replace(/\./g, '\\.')}assets/css/ulc\\.css" />`),
      `<link rel="stylesheet" href="${prefix}assets/css/ulc.css" />\n` +
      `<link rel="stylesheet" href="${prefix}assets/css/tailwind.min.css" />`
    );

  html = rewriteAssets(html);

  const out = path.join(DIST, srcRel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, 'utf8');
  return out;
}

const pages = ['index.html', 'project.html', '404.html'];
fs.readdirSync(path.join(ROOT, 'projects'))
  .filter((f) => f.endsWith('.html'))
  .forEach((f) => pages.push(path.join('projects', f)));

pages.forEach((p) => processPage(p, p.startsWith('projects') ? 1 : 0));

/* 5 · Verify the build satisfies what netlify.toml promises ---------------- */
const problems = [];
for (const rel of pages) {
  const html = fs.readFileSync(path.join(DIST, rel), 'utf8');
  if (html.includes('cdn.tailwindcss.com')) problems.push(`${rel}: CDN tag survived`);
  if (/<script(?![^>]*\ssrc=)[^>]*>/.test(html)) problems.push(`${rel}: inline <script> breaks the CSP`);
  if (/\sstyle="/.test(html)) problems.push(`${rel}: inline style attribute breaks the CSP`);
  const unhashed = (html.match(/assets\/[a-z]+\/[A-Za-z0-9._@-]+/g) || [])
    .filter((u) => !/\.[a-f0-9]{8}\./.test(u));
  if (unhashed.length) problems.push(`${rel}: unhashed asset ref ${unhashed[0]} — immutable caching would serve it stale`);
}
if (problems.length) {
  console.error('\nBuild failed:');
  problems.forEach((m) => console.error('  - ' + m));
  process.exit(1);
}

/* 6 · Report --------------------------------------------------------------- */
const dist = (rel) => path.join(DIST, assetMap.get(rel) || rel);
const imgDir = path.join(DIST, 'assets/img');
const imgBytes = fs.readdirSync(imgDir)
  .reduce((n, f) => n + fs.statSync(path.join(imgDir, f)).size, 0);

console.log('\nBuild complete -> dist/');
console.log('  pages            ' + pages.length);
console.log('  tailwind.min.css ' + kb(dist('assets/css/tailwind.min.css')));
console.log('  ulc.css          ' + kb(dist('assets/css/ulc.css')));
console.log('  images           ' + (imgBytes / 1024).toFixed(1) + ' KB (' +
            fs.readdirSync(imgDir).length + ' files)');
console.log('  assets hashed    ' + assetMap.size);
console.log('\nUpload the contents of dist/ to your web host.');
