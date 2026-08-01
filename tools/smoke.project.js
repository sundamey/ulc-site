const fs = require('fs');
const { JSDOM } = require('jsdom');
const ROOT = __dirname + '/../';

function boot(url) {
  const html = fs.readFileSync(ROOT + 'project.html', 'utf8')
    .replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/, '')
    .replace(/<script src="assets\/js\/[a-z.-]+\.js"><\/script>/g, '')
    .replace(/<script>\s*ULC\.init[\s\S]*?<\/script>/, '');
  const dom = new JSDOM(html, { runScripts: 'dangerously', url });
  const w = dom.window;
  ['core.js','i18n.js','data.projects.js','project-render.js','project-page.js','nav.js']
    .forEach(f => w.eval(fs.readFileSync(ROOT + 'assets/js/' + f, 'utf8')));
  w.eval('ULC.initI18n(); ULC.initNav(); ULC.initProjectPage();');
  return w;
}

const out = [];
const check = (l, c, e='') => out.push((c ? 'PASS  ' : 'FAIL  ') + l + (e ? ' → ' + e : ''));

// French abstract page
let w = boot('https://ulc.cd/project.html?id=corneal-scaffolds&lang=fr');
let d = w.document;
check('renders FR title', /Matrices cornéennes bio-imprimées/.test(d.querySelector('h1').textContent), d.querySelector('h1').textContent);
check('document.title updated', /Matrices cornéennes/.test(d.title));
check('meta description updated', /kératoplastie/.test(d.querySelector('meta[name=description]').content));
check('abstract paragraphs present', d.querySelectorAll('.prose-abstract p').length === 2, String(d.querySelectorAll('.prose-abstract p').length));
check('PI in sidebar', /Nathanaël Kabongo/.test(d.querySelector('aside').textContent));
check('funder in sidebar', /Fogarty/.test(d.querySelector('aside').textContent));
check('grant reference shown', /D43-TW-2025-0148/.test(d.body.textContent));
check('status translated to FR', /En cours/.test(d.body.textContent));
check('keywords rendered', /kératoplastie/.test(d.body.textContent));
check('publications rendered', /Biofabrication/.test(d.body.textContent));
check('mailto contact link', d.querySelector('a[href^="mailto:"]').getAttribute('href') === 'mailto:n.kabongo@ulc.cd');
check('related projects shown', d.querySelectorAll('a.project-card').length === 1, String(d.querySelectorAll('a.project-card').length));
check('related link carries lang', /lang=fr/.test(d.querySelector('a.project-card').getAttribute('href')));
check('back link returns to hub', /index\.html\?lang=fr#research/.test(d.querySelector('#projectMount a[href*="index.html"]').getAttribute('href')), d.querySelector('#projectMount a[href*="index.html"]').getAttribute('href'));
check('header links carry lang', /lang=fr/.test(d.querySelector('header a[data-lang-link]').getAttribute('href')), d.querySelector('header a[data-lang-link]').getAttribute('href'));

// switch to English in place
d.querySelector('[data-lang-btn="en"]').dispatchEvent(new w.Event('click'));
check('EN switch re-renders title', /Bioprinted Corneal Scaffolds/.test(d.querySelector('h1').textContent), d.querySelector('h1').textContent);
check('EN status label', /Active/.test(d.body.textContent));
check('EN sidebar labels', /Principal Investigator/.test(d.querySelector('aside').textContent));
check('EN related link lang', /lang=en/.test(d.querySelector('a.project-card').getAttribute('href')));

// unknown id
w = boot('https://ulc.cd/project.html?id=does-not-exist&lang=en');
d = w.document;
check('unknown id shows not-found', /Project not found/.test(d.body.textContent));
check('not-found offers a way back', !!d.querySelector('a[href*="index.html"]'));

// no id at all
w = boot('https://ulc.cd/project.html');
check('missing id degrades gracefully', /not found|introuvable/i.test(w.document.body.textContent));

console.log(out.join('\n'));
console.log('\n' + out.filter(l=>l.startsWith('PASS')).length + '/' + out.length + ' checks passed');
