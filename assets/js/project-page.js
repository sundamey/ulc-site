/* ==========================================================================
   ULC — Project page controller
   Reads ?id= from the URL, renders the abstract page, and re-renders on a
   language switch. Every project has its own shareable URL:
     project.html?id=corneal-scaffolds&lang=fr
   ========================================================================== */
(function () {
  'use strict';
  var U = window.ULC;

  U.initProjectPage = function () {
    var mount = U.$('#projectMount');
    if (!mount) return;

    var id = new URLSearchParams(location.search).get('id');

    function ctx() {
      var project = U.projectById(id);
      return {
        t: U.t,
        pick: U.pick,
        esc: U.esc,
        tags: U.TAGS,
        lang: U.getLang(),
        relatedProjects: project ? U.relatedProjects(project, 2) : [],
      };
    }

    function draw() {
      var project = U.projectById(id);
      var c = ctx();
      var out = project ? U.renderProject(project, c) : U.renderNotFound(c);

      mount.innerHTML = out.html;
      document.title = out.title + ' · Université Loyola du Congo';

      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', out.description);
      // Links already carry c.lang — the renderer builds them from ctx.lang
      // and draw() re-runs on every language change.
    }

    U.onChange(draw);
    draw();
  };
})();
