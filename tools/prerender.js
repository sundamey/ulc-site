#!/usr/bin/env node
/* ==========================================================================
   ULC — Static pre-render
   Writes projects/<id>.<lang>.html for every project in both languages, using
   the same renderer the browser uses. These files carry the full abstract in
   the initial HTML, so they are indexable and readable with JavaScript off —
   which matters on the connections our applicants actually have.

   Usage:  node tools/prerender.js
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const core = require(path.join(ROOT, 'assets/js/core.js'));
const i18n = require(path.join(ROOT, 'assets/js/i18n.js'));
const data = require(path.join(ROOT, 'assets/js/data.projects.js'));
const renderer = require(path.join(ROOT, 'assets/js/project-render.js'));

const LANGS = ['fr', 'en'];
const OUT_DIR = path.join(ROOT, 'projects');

const CREST = '<img src="../assets/img/ulc-logo.png" alt="" class="brand-mark" width="40" height="40" />';

const FAVICONS = `<link rel="icon" type="image/png" sizes="32x32" href="../assets/img/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="../assets/img/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="../assets/img/apple-touch-icon.png" />
<link rel="icon" href="../assets/img/favicon.ico" sizes="any" />
<meta name="theme-color" content="#8B0000" />`;

function shell(project, lang, rendered) {
  const t = (k) => i18n.t(k, null, lang);
  const other = lang === 'fr' ? 'en' : 'fr';
  const title = `${rendered.title} · Université Loyola du Congo`;

  // Rewrite the renderer's root-relative links for a page one level down.
  const body = rendered.html
    .replace(/href="index\.html/g, 'href="../index.html')
    .replace(/href="project\.html\?id=([\w-]+)&amp;lang=(\w+)"/g, 'href="$1.$2.html"');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${core.esc(title)}</title>
<meta name="description" content="${core.esc(rendered.description)}" />
${FAVICONS}
<link rel="canonical" href="https://www.ulc.cd/projects/${project.id}.${lang}.html" />
<link rel="alternate" hreflang="${other}" href="${project.id}.${other}.html" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${core.esc(rendered.title)}" />
<meta property="og:description" content="${core.esc(rendered.description)}" />
<meta name="citation_title" content="${core.esc(rendered.title)}" />
<meta name="citation_author" content="${core.esc(project.pi.name)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap" rel="stylesheet" />
<script src="https://cdn.tailwindcss.com"></script>
<script src="../assets/js/tailwind.config.js"></script>
<link rel="stylesheet" href="../assets/css/ulc.css" />
</head>
<body>
<header class="sticky top-0 z-40 border-b border-line bg-black/90 backdrop-blur">
  <nav class="mx-auto flex max-w-content items-center justify-between px-5 py-4" aria-label="Primary">
    <a href="../index.html?lang=${lang}" class="flex items-center gap-3">
      ${CREST}
      <span class="leading-tight">
        <span class="block text-sm font-extrabold text-white">${core.esc(t('brand.line1'))}</span>
        <span class="block text-[11px] uppercase tracking-eyebrow text-muted">${core.esc(t('brand.line2'))}</span>
      </span>
    </a>
    <div class="lang-switch" role="group" aria-label="${core.esc(t('nav.langLabel'))}">
      <a href="${project.id}.fr.html" ${lang === 'fr' ? 'aria-current="page"' : ''}
         class="rounded-full px-2.5 py-1 text-xs font-semibold ${lang === 'fr' ? 'bg-gold text-black' : 'text-muted'}">FR</a>
      <a href="${project.id}.en.html" ${lang === 'en' ? 'aria-current="page"' : ''}
         class="rounded-full px-2.5 py-1 text-xs font-semibold ${lang === 'en' ? 'bg-gold text-black' : 'text-muted'}">EN</a>
    </div>
  </nav>
</header>

<main class="mx-auto max-w-content px-5 py-12 md:py-16">${body}</main>

<footer class="border-t border-line">
  <div class="mx-auto flex max-w-content flex-col items-start justify-between gap-6 px-5 py-10 md:flex-row md:items-center">
    <div>
      <p class="font-extrabold text-white">${core.esc(t('foot.name'))}</p>
      <p class="mt-1 text-sm text-muted">${core.esc(t('foot.address'))}</p>
    </div>
    <p class="text-sm text-muted">${core.esc(t('foot.rights'))}</p>
  </div>
</footer>
</body>
</html>
`;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let count = 0;

  for (const project of data.PROJECTS) {
    for (const lang of LANGS) {
      const ctx = {
        t: i18n.t,
        pick: i18n.pick,
        esc: core.esc,
        tags: data.TAGS,
        lang,
        relatedProjects: data.relatedProjects(project, 2),
      };
      const rendered = renderer.renderProject(project, ctx);
      const file = path.join(OUT_DIR, `${project.id}.${lang}.html`);
      fs.writeFileSync(file, shell(project, lang, rendered), 'utf8');
      count++;
    }
  }

  // A sitemap makes the abstracts discoverable to funders searching the web.
  const urls = data.PROJECTS.flatMap((p) =>
    LANGS.map((l) => `  <url><loc>https://www.ulc.cd/projects/${p.id}.${l}.html</loc></url>`)
  ).join('\n');
  fs.writeFileSync(
    path.join(ROOT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    'utf8'
  );

  console.log(`Pre-rendered ${count} project pages into projects/ and wrote sitemap.xml`);
}

main();
