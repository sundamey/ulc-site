/* ==========================================================================
   ULC — Core helpers
   Tiny shared utilities. Loaded before every other module.
   ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.ULC = root.ULC || {}; Object.assign(root.ULC, api); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function $(sel, scope) { return (scope || document).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }

  var ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  /** Escape any value before it enters an HTML template string. */
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ESCAPES[c]; });
  }

  /** Show or hide the error message bound to a field, and mark the input. */
  function setError(key, show) {
    var msg = document.querySelector('[data-error-for="' + key + '"]');
    if (msg) msg.classList.toggle('is-visible', !!show);
    var field = document.getElementById(key);
    if (field) field.classList.toggle('is-invalid', !!show);
  }

  /** Mirror :checked onto a class so browsers without :has() still style cards. */
  function syncChoiceCards(scope) {
    $$('.choice-card', scope).forEach(function (card) {
      var input = card.querySelector('input');
      card.classList.toggle('is-selected', !!(input && input.checked));
    });
  }

  function prefersReducedMotion() {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  return { $: $, $$: $$, esc: esc, setError: setError, syncChoiceCards: syncChoiceCards, prefersReducedMotion: prefersReducedMotion };
});
