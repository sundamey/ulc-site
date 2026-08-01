const fs = require('fs');
const { JSDOM } = require('jsdom');
const ROOT = __dirname + '/../';

const html = fs.readFileSync(ROOT + 'index.html', 'utf8')
  .replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/, '')
  .replace(/<script src="assets\/js\/tailwind\.config\.js"><\/script>/, '')
  .replace(/<script src="assets\/js\/[a-z.]+\.js"><\/script>/g, '')
  .replace(/<script>\s*ULC\.init[\s\S]*?<\/script>/, '');

const dom = new JSDOM(html, { runScripts: 'dangerously', resources: undefined, url: 'https://ulc.cd/index.html?lang=fr' });
const { window } = dom;

// Manually load the module files (jsdom won't fetch local src without a server)
['core.js','i18n.js','data.projects.js','nav.js','admissions.js','research.js','fundraising.js']
  .forEach(f => window.eval(fs.readFileSync(ROOT + 'assets/js/' + f, 'utf8')));

window.eval('ULC.initI18n(); ULC.initNav(); ULC.initAdmissions(); ULC.initResearch(); ULC.initFundraising();');
const d = window.document;
const U = window.ULC;

const out = [];
const check = (label, cond, extra='') => out.push((cond ? 'PASS  ' : 'FAIL  ') + label + (extra ? ' → ' + extra : ''));

// 1 · default language
check('default language is FR', d.documentElement.lang === 'fr');
check('hero translated in FR', d.querySelector('[data-i18n="hero.ctaApply"]').textContent.includes('candidature'),
      d.querySelector('[data-i18n="hero.ctaApply"]').textContent);

// 2 · research grid
const cards = () => d.querySelectorAll('#researchGrid .project-card');
check('grid renders 8 cards', cards().length === 8, String(cards().length));
check('count line rendered', /8/.test(d.getElementById('researchCount').textContent), d.getElementById('researchCount').textContent);

// 3 · search (accent-insensitive)
const box = d.getElementById('researchSearch');
box.value = 'sante';
box.dispatchEvent(new window.Event('input'));
check('accent-insensitive search "sante" matches', cards().length >= 3, String(cards().length));
box.value = 'zzzz';
box.dispatchEvent(new window.Event('input'));
check('no-match shows empty state', d.getElementById('researchEmpty').hidden === false);
box.value = '';
box.dispatchEvent(new window.Event('input'));

// 4 · tag filter
const chip = d.querySelector('.tag-chip[data-tag="bioprint"]');
chip.dispatchEvent(new window.Event('click'));
check('bioprint filter narrows to 2', cards().length === 2, String(cards().length));
check('chip aria-pressed true', chip.getAttribute('aria-pressed') === 'true');
chip.dispatchEvent(new window.Event('click'));
check('deselect restores 8', cards().length === 8);

// 5 · wizard validation
const next = d.getElementById('btnNext');
next.dispatchEvent(new window.Event('click'));
check('step 1 blocks on empty fields', d.querySelector('[data-panel="1"]').classList.contains('is-active'));
check('name error visible', d.querySelector('[data-error-for="fullName"]').classList.contains('is-visible'));
d.getElementById('fullName').value = 'Espérance Kabila';
d.getElementById('email').value = 'e.kabila@example.cd';
d.getElementById('phone').value = '+243 81 000 0000';
next.dispatchEvent(new window.Event('click'));
check('valid step 1 advances to step 2', d.querySelector('[data-panel="2"]').classList.contains('is-active'));
next.dispatchEvent(new window.Event('click'));
check('step 2 blocks without faculty', d.querySelector('[data-panel="2"]').classList.contains('is-active'));
const radio = d.querySelector('input[name="faculty"][value="Philosophy"]');
radio.checked = true; radio.dispatchEvent(new window.Event('change'));
check('choice-card mirrors :checked', radio.closest('.choice-card').classList.contains('is-selected'));
next.dispatchEvent(new window.Event('click'));
check('advances to documents step', d.querySelector('[data-panel="3"]').classList.contains('is-active'));
check('back button now visible', d.getElementById('btnBack').hidden === false);

// 6 · donation calculator
const cta = d.getElementById('donateCta');
check('default CTA is $250 by card (FR)', /250/.test(cta.textContent) && /[Cc]arte/.test(cta.textContent), cta.textContent);
const tier = d.querySelector('.tier-btn[data-amount="5000"]');
tier.dispatchEvent(new window.Event('click'));
check('tier 5000 updates CTA', /5\s?000/.test(cta.textContent), cta.textContent);
check('impact note updates', d.getElementById('donateNote').textContent.length > 0, d.getElementById('donateNote').textContent);
const mpesa = d.querySelector('input[name="payMethod"][value="M-Pesa"]');
mpesa.checked = true; mpesa.dispatchEvent(new window.Event('change'));
check('method switch reaches CTA', /M-Pesa/.test(cta.textContent), cta.textContent);
const custom = d.getElementById('customAmount');
custom.value = '0';
custom.dispatchEvent(new window.Event('input'));
check('zero amount shows empty-state CTA', /montant/i.test(cta.textContent), cta.textContent);
custom.value = '120'; custom.dispatchEvent(new window.Event('input'));

// 7 · language switch
d.querySelector('[data-lang-btn="en"]').dispatchEvent(new window.Event('click'));
check('html lang flips to en', d.documentElement.lang === 'en');
check('hero re-translated', /application/i.test(d.querySelector('[data-i18n="hero.ctaApply"]').textContent),
      d.querySelector('[data-i18n="hero.ctaApply"]').textContent);
check('grid re-rendered in EN', /Cassava|Bioprinted|Triage/.test(d.getElementById('researchGrid').textContent));
check('tag chips re-labelled', d.querySelector('.tag-chip[data-tag="agri"]').textContent === 'Sustainable Agriculture',
      d.querySelector('.tag-chip[data-tag="agri"]').textContent);
check('CTA re-translated + currency reformatted', /Give \$120 via M-Pesa/.test(cta.textContent), cta.textContent);
check('wizard state survives language switch', d.querySelector('[data-panel="3"]').classList.contains('is-active'));
check('wizard button relabelled', d.getElementById('btnNext').textContent === 'Submit application', d.getElementById('btnNext').textContent);
check('card links carry lang', /lang=en/.test(d.querySelector('#researchGrid a').getAttribute('href')),
      d.querySelector('#researchGrid a').getAttribute('href'));

// 8 · mobile nav
const toggle = d.getElementById('navToggle');
toggle.dispatchEvent(new window.Event('click'));
check('menu opens', d.getElementById('mobileMenu').hidden === false);
check('aria-expanded true', toggle.getAttribute('aria-expanded') === 'true');
check('aria-label follows language', toggle.getAttribute('aria-label') === 'Close menu', toggle.getAttribute('aria-label'));
toggle.dispatchEvent(new window.Event('click'));
check('menu closes', d.getElementById('mobileMenu').hidden === true);


// 9 · brand assets
check('logo <img> in header', d.querySelector('header img.brand-mark') &&
      /ulc-logo\.png/.test(d.querySelector('header img.brand-mark').getAttribute('src')));
check('logo is decorative (empty alt)', d.querySelector('header img.brand-mark').getAttribute('alt') === '');
check('favicon 32 linked', !!d.querySelector('link[href*="favicon-32x32.png"]'));
check('apple touch icon linked', !!d.querySelector('link[rel="apple-touch-icon"]'));
check('theme-color is brand maroon', d.querySelector('meta[name="theme-color"]').content === '#8B0000',
      d.querySelector('meta[name="theme-color"]').content);

// 10 · rector welcome
const ribbon = d.querySelector('.rector-ribbon');
check('announcement ribbon present', !!ribbon);
check('ribbon links to the section', ribbon.querySelector('a').getAttribute('href') === '#rector');
const rector = d.getElementById('rector');
check('rector section present', !!rector);
check('rector has three paragraphs', rector.querySelectorAll('.rector-quote p').length === 3,
      String(rector.querySelectorAll('.rector-quote p').length));
check('portrait uses webp srcset', /rector-640\.webp/.test(rector.querySelector('source').getAttribute('srcset')));
check('portrait has jpeg fallback', /rector-480\.jpg/.test(rector.querySelector('img').getAttribute('src')));
check('portrait is lazy + sized', rector.querySelector('img').getAttribute('loading') === 'lazy' &&
      !!rector.querySelector('img').getAttribute('width'));
check('portrait alt is translated, not empty', rector.querySelector('img').getAttribute('alt').length > 20,
      rector.querySelector('img').getAttribute('alt').slice(0, 40) + '…');
check('signature name (EN)', /Fr\. Adrien Lentiampa Shenge/.test(rector.textContent));
d.querySelector('[data-lang-btn="fr"]').dispatchEvent(new window.Event('click'));
check('rector text switches to FR', /Mot du Recteur/.test(rector.textContent));
check('signature name (FR)', /Père Adrien Lentiampa Shenge/.test(rector.textContent));
check('ribbon switches to FR', /nommé Recteur/.test(ribbon.textContent));
check('portrait alt re-translated', /Portrait du Père/.test(rector.querySelector('img').getAttribute('alt')));

console.log(out.join('\n'));
console.log('\n' + out.filter(l=>l.startsWith('PASS')).length + '/' + out.length + ' checks passed');
