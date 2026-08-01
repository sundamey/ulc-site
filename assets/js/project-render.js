/* ==========================================================================
   ULC — Project page renderer
   A pure function: (project, ctx) → { title, description, html }.
   No DOM access, so the same code renders in the browser (project-page.js)
   and under Node (tools/prerender.js) for the static SEO build.

   ctx = { t, pick, esc, tags, lang, relatedProjects }
   ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.ULC = root.ULC || {}; Object.assign(root.ULC, api); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function renderProject(p, ctx) {
    var t = function (k, v) { return ctx.t(k, v, ctx.lang); };
    var pick = function (v) { return ctx.pick(v, ctx.lang); };
    var esc = ctx.esc;
    var lang = ctx.lang;
    var q = '?lang=' + lang;

    var title = pick(p.title);
    var description = pick(p.summary);

    function metaRow(labelKey, value) {
      if (!value) return '';
      return '<div class="flex flex-col gap-0.5 border-b border-line py-3 sm:flex-row sm:justify-between sm:gap-6">' +
        '<dt class="text-sm text-muted">' + esc(t(labelKey)) + '</dt>' +
        '<dd class="text-sm font-medium text-body sm:max-w-[60%] sm:text-right">' + value + '</dd>' +
      '</div>';
    }

    var paragraphs = (pick(p.abstract) || []).map(function (para) {
      return '<p>' + esc(para) + '</p>';
    }).join('');

    var keywords = (pick(p.keywords) || []).map(function (k) {
      return '<span class="rounded-full border border-line px-3 py-1 text-xs text-body/80">' + esc(k) + '</span>';
    }).join('');

    var coInvestigators = p.coInvestigators.map(esc).join('<br>');
    var partners = p.partners.map(esc).join('<br>');

    var publications = p.publications.map(function (pub) {
      return '<li class="border-b border-line py-3 last:border-0">' +
        '<p class="text-sm font-medium text-body">' + esc(pick(pub.title)) + '</p>' +
        '<p class="mt-0.5 text-sm text-muted">' + esc(pub.venue) + ' · ' + esc(pub.year) + '</p>' +
      '</li>';
    }).join('');

    var relatedCards = (ctx.relatedProjects || []).map(function (r) {
      return '<a class="project-card" href="project.html?id=' + esc(r.id) + '&amp;lang=' + esc(lang) + '">' +
        '<span class="tag-pill mb-3">' + esc(pick(ctx.tags[r.tag])) + '</span>' +
        '<h3 class="text-base font-extrabold leading-snug text-white">' + esc(pick(r.title)) + '</h3>' +
        '<p class="mt-2 text-sm text-body/70">' + esc(pick(r.summary)) + '</p>' +
      '</a>';
    }).join('');

    var html = '' +
    '<article>' +
      '<a class="link-accent mb-8" href="index.html' + q + '#research">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path d="M19 12H5M11 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        esc(t('proj.back')) +
      '</a>' +

      '<header class="mt-6 border-b border-line pb-8">' +
        '<p class="eyebrow eyebrow--brown mb-3">' + esc(t('proj.eyebrow')) + ' · ' + esc(p.grant) + '</p>' +
        '<h1 class="max-w-3xl text-3xl font-extrabold leading-tight text-white md:text-4xl">' + esc(title) + '</h1>' +
        '<div class="mt-5 flex flex-wrap items-center gap-3">' +
          '<span class="tag-pill">' + esc(pick(ctx.tags[p.tag])) + '</span>' +
          '<span class="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">' + esc(t(p.status)) + '</span>' +
          '<span class="text-xs text-muted">' + esc(p.duration) + '</span>' +
        '</div>' +
      '</header>' +

      '<div class="mt-10 grid gap-12 lg:grid-cols-3">' +
        '<div class="lg:col-span-2">' +
          '<h2 class="text-lg font-extrabold text-white">' + esc(t('proj.abstract')) + '</h2>' +
          '<div class="prose-abstract mt-4 text-body/85">' + paragraphs + '</div>' +

          (keywords ?
            '<h2 class="mt-10 text-lg font-extrabold text-white">' + esc(t('proj.keywords')) + '</h2>' +
            '<div class="mt-4 flex flex-wrap gap-2">' + keywords + '</div>' : '') +

          (publications ?
            '<h2 class="mt-10 text-lg font-extrabold text-white">' + esc(t('proj.publications')) + '</h2>' +
            '<ul class="mt-2">' + publications + '</ul>' : '') +
        '</div>' +

        '<aside class="lg:col-span-1">' +
          '<div class="rounded-xl border border-line bg-obsidian p-6">' +
            '<h2 class="text-sm font-extrabold uppercase tracking-eyebrow text-gold">' + esc(t('proj.details')) + '</h2>' +
            '<dl class="mt-4">' +
              metaRow('proj.pi', esc(p.pi.name) + '<br><span class="text-muted">' + esc(pick(p.pi.role)) + '</span>') +
              metaRow('proj.coInvestigators', coInvestigators) +
              metaRow('proj.funder', esc(p.funder)) +
              metaRow('proj.grant', esc(p.grant)) +
              metaRow('proj.duration', esc(p.duration)) +
              metaRow('proj.status', esc(t(p.status))) +
              metaRow('proj.partners', partners) +
            '</dl>' +
            '<a class="btn-gold mt-6 w-full" href="mailto:' + esc(p.contact) + '">' + esc(t('proj.contactCta')) + '</a>' +
          '</div>' +
        '</aside>' +
      '</div>' +

      (relatedCards ?
        '<section class="mt-16 border-t border-line pt-10">' +
          '<h2 class="text-lg font-extrabold text-white">' + esc(t('proj.related')) + '</h2>' +
          '<div class="mt-5 grid gap-5 sm:grid-cols-2">' + relatedCards + '</div>' +
        '</section>' : '') +
    '</article>';

    return { title: title, description: description, html: html };
  }

  function renderNotFound(ctx) {
    var esc = ctx.esc;
    var t = function (k) { return ctx.t(k, null, ctx.lang); };
    return {
      title: t('proj.notFoundTitle'),
      description: t('proj.notFoundBody'),
      html: '<div class="mx-auto max-w-lg py-20 text-center">' +
        '<h1 class="text-2xl font-extrabold text-white">' + esc(t('proj.notFoundTitle')) + '</h1>' +
        '<p class="mt-3 text-body/80">' + esc(t('proj.notFoundBody')) + '</p>' +
        '<a class="btn-ghost mt-8" href="index.html?lang=' + esc(ctx.lang) + '#research">' + esc(t('proj.back')) + '</a>' +
      '</div>',
    };
  }

  return { renderProject: renderProject, renderNotFound: renderNotFound };
});
