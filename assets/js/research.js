/* ==========================================================================
   ULC — Research Hub
   Client-side search + theme filtering over the shared project dataset.
   Re-renders on language change so titles, abstracts and labels all follow.
   ========================================================================== */
(function () {
  'use strict';
  var U = window.ULC;

  U.initResearch = function () {
    var grid = U.$('#researchGrid');
    if (!grid) return;

    var searchBox = U.$('#researchSearch');
    var emptyState = U.$('#researchEmpty');
    var countEl = U.$('#researchCount');
    var tagBtns = U.$$('.tag-chip');
    var activeTags = [];

    var ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" ' +
      'stroke-linejoin="round"/></svg>';

    function card(p) {
      var lang = U.getLang();
      var href = 'project.html?id=' + encodeURIComponent(p.id) + '&lang=' + lang;
      return '' +
        '<article class="project-card">' +
          '<span class="tag-pill mb-3">' + U.esc(U.pick(U.TAGS[p.tag])) + '</span>' +
          '<h3 class="text-base font-extrabold leading-snug text-white">' + U.esc(U.pick(p.title)) + '</h3>' +
          '<p class="mt-2 flex-1 text-sm text-body/75">' + U.esc(U.pick(p.summary)) + '</p>' +
          '<dl class="mt-4 space-y-1 border-t border-line pt-3">' +
            '<div class="meta-row"><dt>' + U.esc(U.t('res.pi')) + '</dt><dd>' + U.esc(p.pi.name) + '</dd></div>' +
            '<div class="meta-row"><dt>' + U.esc(U.t('res.funder')) + '</dt><dd>' + U.esc(p.funder) + '</dd></div>' +
          '</dl>' +
          '<a class="link-accent mt-4" href="' + href + '">' + U.esc(U.t('res.readAbstract')) + ARROW + '</a>' +
        '</article>';
    }

    function haystack(p) {
      return [
        U.pick(p.title, 'en'), U.pick(p.title, 'fr'),
        U.pick(p.summary, 'en'), U.pick(p.summary, 'fr'),
        p.pi.name, p.funder, p.grant,
        U.pick(U.TAGS[p.tag], 'en'), U.pick(U.TAGS[p.tag], 'fr'),
        (p.keywords.en || []).join(' '), (p.keywords.fr || []).join(' '),
        p.partners.join(' '),
      ].join(' ').toLowerCase();
    }

    // Accent-insensitive matching: "sante" finds "santé".
    function fold(s) {
      return s.normalize ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s;
    }

    function render() {
      var q = fold(searchBox.value.trim().toLowerCase());
      var results = U.PROJECTS.filter(function (p) {
        var tagOk = activeTags.length === 0 || activeTags.indexOf(p.tag) !== -1;
        return tagOk && (!q || fold(haystack(p)).indexOf(q) !== -1);
      });

      grid.innerHTML = results.map(card).join('');
      emptyState.hidden = results.length > 0;
      countEl.textContent = U.t('res.count', { shown: results.length, total: U.PROJECTS.length });
    }

    tagBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tag = btn.getAttribute('data-tag');
        var i = activeTags.indexOf(tag);
        if (i === -1) { activeTags.push(tag); } else { activeTags.splice(i, 1); }
        btn.setAttribute('aria-pressed', String(i === -1));
        render();
      });
      // Chip labels are data-driven, not hard-coded in the markup.
      btn.textContent = U.pick(U.TAGS[btn.getAttribute('data-tag')]);
    });

    searchBox.addEventListener('input', render);

    U.onChange(function () {
      tagBtns.forEach(function (btn) {
        btn.textContent = U.pick(U.TAGS[btn.getAttribute('data-tag')]);
      });
      render();
    });

    render();
  };
})();
