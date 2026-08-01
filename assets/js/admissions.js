/* ==========================================================================
   ULC — Admissions wizard
   Three validated steps plus a confirmation panel. All copy comes from i18n,
   so switching language mid-application keeps the wizard state intact.
   ========================================================================== */
(function () {
  'use strict';
  var U = window.ULC;

  U.initAdmissions = function () {
    var form = U.$('#appForm');
    if (!form) return;

    var panels = U.$$('.step-panel', form);
    var dots = U.$$('.step-dot');
    var btnBack = U.$('#btnBack');
    var btnNext = U.$('#btnNext');
    var controls = U.$('#wizardControls');
    var step = 1;                // 1–3 = steps, 4 = confirmation
    var SUBMITTED = 4;

    // Explicit lookups rather than form.fieldName — the implicit named getter
    // collides with HTMLFormElement's own properties (action, method, submit…)
    // and silently returns the wrong node.
    function field(name) { return form.elements.namedItem(name); }
    var fullName = field('fullName');
    var email = field('email');
    var phone = field('phone');
    var filePhoto = field('filePhoto');
    var fileDiplome = field('fileDiplome');

    /* ---- Validation ------------------------------------------------- */
    function validFile(input, types, maxMB) {
      var f = input.files && input.files[0];
      return !!f && types.indexOf(f.type) !== -1 && f.size <= maxMB * 1024 * 1024;
    }

    var validators = {
      1: function () {
        var ok = true;
        var name = fullName.value.trim();
        var nameOk = name.split(/\s+/).filter(Boolean).length >= 2;
        U.setError('fullName', !nameOk); ok = ok && nameOk;

        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
        U.setError('email', !emailOk); ok = ok && emailOk;

        var digits = phone.value.replace(/\D/g, '');
        var phoneOk = digits.length >= 9 && digits.length <= 15;
        U.setError('phone', !phoneOk); ok = ok && phoneOk;
        return ok;
      },
      2: function () {
        var chosen = !!form.querySelector('input[name="faculty"]:checked');
        U.setError('faculty', !chosen);
        return chosen;
      },
      3: function () {
        var photoOk = validFile(filePhoto, ['image/jpeg', 'image/png'], 5);
        U.setError('filePhoto', !photoOk);
        var dipOk = validFile(fileDiplome, ['application/pdf', 'image/jpeg', 'image/png'], 10);
        U.setError('fileDiplome', !dipOk);
        return photoOk && dipOk;
      },
    };

    /* ---- Rendering --------------------------------------------------- */
    function renderSuccessCopy() {
      var target = U.$('#successBody');
      if (!target) return;
      var first = fullName.value.trim().split(/\s+/)[0] || '';
      target.textContent = U.t('adm.successBody', { name: first });
    }

    function render() {
      panels.forEach(function (p) {
        p.classList.toggle('is-active', Number(p.dataset.panel) === step);
      });
      dots.forEach(function (d) {
        d.classList.toggle('is-done', Number(d.dataset.step) <= Math.min(step, 3));
      });
      btnBack.hidden = (step === 1 || step === SUBMITTED);
      btnNext.textContent = U.t(step === 3 ? 'adm.submit' : 'adm.continue');
      controls.hidden = (step === SUBMITTED);
      if (step === SUBMITTED) renderSuccessCopy();
    }

    btnNext.addEventListener('click', function () {
      if (!validators[step]()) return;
      step = (step === 3) ? SUBMITTED : step + 1;
      render();
      // Hand-off point: POST the FormData to the admissions endpoint here.
    });

    btnBack.addEventListener('click', function () {
      if (step > 1) { step -= 1; render(); }
    });

    /* ---- Faculty cards ----------------------------------------------- */
    U.$$('input[name="faculty"]', form).forEach(function (input) {
      input.addEventListener('change', function () {
        U.syncChoiceCards(form);
        U.setError('faculty', false);
      });
    });

    /* ---- Drop-zones --------------------------------------------------- */
    U.$$('.dropzone', form).forEach(function (zone) {
      var input = zone.querySelector('input[type="file"]');
      var nameEl = zone.querySelector('.dz-filename');

      function showFile() {
        var f = input.files && input.files[0];
        nameEl.textContent = f ? '✓ ' + f.name + ' (' + (f.size / 1048576).toFixed(1) + ' MB)' : '';
        if (f) U.setError(input.id, false);
      }
      input.addEventListener('change', showFile);

      ['dragenter', 'dragover'].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('is-dragover'); });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('is-dragover'); });
      });
      zone.addEventListener('drop', function (e) {
        if (e.dataTransfer && e.dataTransfer.files.length) {
          input.files = e.dataTransfer.files;
          showFile();
        }
      });
    });

    /* ---- Language changes -------------------------------------------- */
    U.onChange(function () {
      btnNext.textContent = U.t(step === 3 ? 'adm.submit' : 'adm.continue');
      if (step === SUBMITTED) renderSuccessCopy();
    });

    U.syncChoiceCards(form);
    render();
  };
})();
