/* ==========================================================================
   ULC — Navigation
   Mobile overlay menu. Used on every page, so it guards against a missing
   toggle rather than assuming the markup is present.
   ========================================================================== */
(function () {
  'use strict';
  var U = window.ULC;

  U.initNav = function () {
    var toggle = U.$('#navToggle');
    var menu = U.$('#mobileMenu');
    if (!toggle || !menu) return;

    var iconOpen = U.$('#iconOpen');
    var iconClose = U.$('#iconClose');

    function setMenu(open) {
      menu.hidden = !open;
      if (iconOpen) iconOpen.hidden = open;
      if (iconClose) iconClose.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', U.t(open ? 'nav.close' : 'nav.open'));
      document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', function () { setMenu(menu.hidden); });
    U.$$('[data-nav]', menu).forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });

    // Keep the toggle's accessible name correct after a language switch.
    U.onChange(function () {
      toggle.setAttribute('aria-label', U.t(menu.hidden ? 'nav.open' : 'nav.close'));
    });

    setMenu(false);
  };
})();
