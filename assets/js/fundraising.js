/* ==========================================================================
   ULC — Fundraising portal
   Campaign progress tracker + donation calculator. Currency formatting
   follows the active locale ($2,500,000 / 2 500 000 $US).
   ========================================================================== */
(function () {
  'use strict';
  var U = window.ULC;

  // Campaign figures — replace with a fetch() from the Foundation's ledger.
  var CAMPAIGN = { raised: 1634500, target: 2500000, donors: 1284 };

  U.initFundraising = function () {
    var form = U.$('#donateForm');
    if (!form) return;

    /* ---- Progress tracker --------------------------------------------- */
    var bar = U.$('#fundBar');
    var track = U.$('#fundTrack');
    var raisedLabel = U.$('#fundRaisedLabel');
    var targetLabel = U.$('#fundTargetLabel');
    var pctLabel = U.$('#fundPct');
    var donorsLabel = U.$('#fundDonors');
    var pct = Math.min(100, (CAMPAIGN.raised / CAMPAIGN.target) * 100);
    var hasAnimated = false;

    function paintTotals(raisedValue, pctValue) {
      raisedLabel.textContent = U.money(raisedValue);
      pctLabel.textContent = Math.round(pctValue) + '%';
      targetLabel.textContent = U.money(CAMPAIGN.target);
      donorsLabel.textContent = U.num(CAMPAIGN.donors);
    }

    function animate() {
      hasAnimated = true;
      bar.style.width = pct.toFixed(1) + '%';
      track.setAttribute('aria-valuenow', String(Math.round(pct)));

      // Old Android WebViews ship without rAF; fall back to a timer.
      var raf = window.requestAnimationFrame ||
        function (cb) { return setTimeout(function () { cb(Date.now()); }, 16); };

      if (U.prefersReducedMotion() || typeof performance === 'undefined') {
        paintTotals(CAMPAIGN.raised, pct);
        return;
      }

      var start = performance.now(), dur = 1400;
      (function tick(now) {
        var k = Math.min(1, (now - start) / dur);
        var ease = 1 - Math.pow(1 - k, 3);
        paintTotals(CAMPAIGN.raised * ease, pct * ease);
        if (k < 1) raf(tick);
      })(start);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { animate(); obs.disconnect(); }
      }, { threshold: 0.4 });
      io.observe(track);
    } else {
      animate();
    }

    /* ---- Donation calculator ------------------------------------------ */
    var tierBtns = U.$$('.tier-btn', form);
    var customAmount = U.$('#customAmount');
    var ctaLabel = U.$('#donateCta');
    var note = U.$('#donateNote');
    var amount = 250;

    function methodName() {
      var checked = form.querySelector('input[name="payMethod"]:checked');
      if (!checked) return U.t('give.card');
      return checked.value === 'card' ? U.t('give.card') : checked.value;
    }

    function impact(a) {
      if (a >= 5000) return U.t('give.impactRoom',    { n: Math.floor(a / 5000) });
      if (a >= 1000) return U.t('give.impactTuition', { n: Math.floor(a / 1000) });
      if (a >= 250)  return U.t('give.impactBursary', { n: Math.floor(a / 250) });
      return U.t('give.impactLibrary', { n: Math.floor(a / 12) });
    }

    function paintTiers() {
      tierBtns.forEach(function (b) { b.textContent = U.money(Number(b.getAttribute('data-amount'))); });
    }

    function update() {
      if (amount >= 1) {
        ctaLabel.textContent = U.t('give.cta', { amount: U.money(amount), method: methodName() });
        note.textContent = impact(amount);
      } else {
        ctaLabel.textContent = U.t('give.ctaEmpty');
        note.textContent = '';
      }
    }

    tierBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tierBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        amount = Number(btn.getAttribute('data-amount'));
        customAmount.value = '';
        U.setError('donation', false);
        update();
      });
    });

    customAmount.addEventListener('input', function () {
      tierBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      amount = Math.max(0, Math.floor(Number(customAmount.value) || 0));
      U.setError('donation', false);
      update();
    });

    U.$$('input[name="payMethod"]', form).forEach(function (radio) {
      radio.addEventListener('change', function () { U.syncChoiceCards(form); update(); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (amount < 1) { U.setError('donation', true); customAmount.focus(); return; }
      var method = methodName();
      // Checkout hand-off: route { amount, method } to the PSP or the mobile
      // money aggregator here, then redirect to its hosted confirmation page.
      ctaLabel.textContent = U.t('give.redirect', { method: method });
      setTimeout(function () {
        ctaLabel.textContent = U.t('give.thanks');
        note.textContent = U.t('give.recorded', { amount: U.money(amount), method: method });
      }, 900);
    });

    U.onChange(function () {
      paintTiers();
      paintTotals(CAMPAIGN.raised, hasAnimated ? pct : 0);
      update();
    });

    paintTiers();
    paintTotals(0, 0);
    U.syncChoiceCards(form);
    update();
  };
})();
