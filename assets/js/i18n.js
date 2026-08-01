/* ==========================================================================
   ULC — i18n
   Attribute-driven translation. Mark any element with:
     data-i18n="key"                  → sets textContent
     data-i18n-html="key"             → sets innerHTML (only for trusted strings)
     data-i18n-placeholder="key"      → sets the placeholder attribute
     data-i18n-aria-label="key"       → sets aria-label
     data-i18n-title="key"            → sets title
   Interpolation: t('res.count', { shown: 3, total: 8 })
   Works in the browser and under Node (for tools/prerender.js).
   ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.ULC = root.ULC || {}; Object.assign(root.ULC, api); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STRINGS = {
    en: {
      /* --- Navigation & shell --- */
      'nav.admissions': 'Admissions',
      'nav.research': 'Research Hub',
      'nav.give': 'Give',
      'nav.apply': 'Apply now',
      'nav.open': 'Open menu',
      'nav.close': 'Close menu',
      'nav.langLabel': 'Choose language',
      'brand.line1': 'Université Loyola',
      'brand.line2': 'du Congo · Kinshasa',

      /* --- Hero --- */
      'hero.eyebrow': 'Ad Majorem Dei Gloriam · Kinshasa, DR Congo',
      'hero.title': 'Forming minds that will',
      'hero.titleAccent': 'rebuild a continent.',
      'hero.lead': 'The Université Loyola du Congo unites the Jesuit tradition of rigorous inquiry with the urgent work of Congolese development — in philosophy, science & technology, and business.',
      'hero.ctaApply': 'Begin your application',
      'hero.ctaResearch': 'Explore research',
      'hero.statFaculties': 'Faculties',
      'hero.statProjects': 'Active research projects',
      'hero.statPartners': 'Partner institutions',

      /* --- Rector --- */
      'ribbon.rector': 'Fr. Adrien Lentiampa Shenge, S.J. has been appointed Rector of the Université Loyola du Congo.',
      'ribbon.link': 'Read his welcome',
      'rector.eyebrow': 'A word from the Rector',
      'rector.title': 'Welcome to the Université Loyola du Congo',
      'rector.p1': 'To our students, to their families, and to every friend of the Université Loyola du Congo — it is with joy, and with a keen sense of responsibility, that I take up the office of Rector today.',
      'rector.p2': 'This university was founded on a simple conviction: that intelligence, when it is rigorously formed and guided by conscience, remains one of the surest resources our country has. We do not simply produce graduates. We form women and men able to think freely, to serve competently, and to give themselves to something larger than themselves.',
      'rector.p3': 'To those knocking at our door today: you are expected. Come with your questions, your doubts and your ambition — we will take all three seriously.',
      'rector.name': 'Fr. Adrien Lentiampa Shenge, S.J.',
      'rector.role': 'Rector of the Université Loyola du Congo',
      'rector.portraitAlt': 'Portrait of Fr. Adrien Lentiampa Shenge, S.J., Rector of the Université Loyola du Congo',
      'rector.cta': 'Explore our faculties',

      /* --- Admissions --- */
      'adm.eyebrow': 'Admissions · Intake 2026–27',
      'adm.title': 'Apply in three steps',
      'adm.lead': 'Your progress is kept on this page. Documents can be added from any phone — photographs of your Diplôme d’État are accepted.',
      'adm.progress': 'Application progress',
      'adm.step1': '1 · Identity',
      'adm.step2': '2 · Faculty',
      'adm.step3': '3 · Documents',
      'adm.name': 'Full name',
      'adm.namePh': 'e.g. Espérance Kabila Mwamba',
      'adm.nameErr': 'Enter your full legal name (at least two words).',
      'adm.email': 'Email address',
      'adm.emailPh': 'you@example.cd',
      'adm.emailErr': 'Enter a valid email address.',
      'adm.phone': 'Phone (WhatsApp preferred)',
      'adm.phonePh': '+243 81 000 0000',
      'adm.phoneErr': 'Enter a valid phone number, e.g. +243 81 000 0000.',
      'adm.facultyLegend': 'Choose your faculty',
      'adm.facultyErr': 'Select one faculty to continue.',
      'adm.philTitle': 'Faculté de Philosophie',
      'adm.philDesc': 'Ethics, logic, and the intellectual tradition of the Society of Jesus.',
      'adm.sciTitle': 'Faculté des Sciences & Technologies',
      'adm.sciDesc': 'Computing, engineering, and the applied sciences for Congolese industry.',
      'adm.bizTitle': 'Faculté de Gestion & Commerce',
      'adm.bizDesc': 'Management, finance, and entrepreneurship across Central Africa.',
      'adm.photo': 'Passport photo',
      'adm.photoHint': '(JPG or PNG, max 5 MB)',
      'adm.photoCta': 'Tap to add photo',
      'adm.photoErr': 'Add a JPG or PNG photo under 5 MB.',
      'adm.diploma': 'Diplôme d’État',
      'adm.diplomaHint': '(PDF or photo, max 10 MB)',
      'adm.diplomaCta': 'Tap to add document',
      'adm.diplomaErr': 'Add your Diplôme d’État as a PDF or photo, under 10 MB.',
      'adm.dropHint': 'or drag & drop',
      'adm.back': 'Back',
      'adm.continue': 'Continue',
      'adm.submit': 'Submit application',
      'adm.successTitle': 'Application received',
      'adm.successBody': 'Thank you, {name}. Our admissions office will contact you within five working days at the details you provided.',

      /* --- Research --- */
      'res.eyebrow': 'Research Hub · Faculty & International Partners',
      'res.title': 'Research for the Congo, from the Congo',
      'res.searchPh': 'Search projects, investigators, funders…',
      'res.searchLabel': 'Search research projects',
      'res.filterLabel': 'Filter by research theme',
      'res.count': '{shown} of {total} projects shown',
      'res.emptyTitle': 'No projects match that search.',
      'res.emptyBody': 'Clear the search box or deselect a theme to see more results.',
      'res.pi': 'Principal Investigator',
      'res.funder': 'Funding body',
      'res.readAbstract': 'Read abstract',

      /* --- Project page --- */
      'proj.back': 'Back to the Research Hub',
      'proj.eyebrow': 'Research project',
      'proj.abstract': 'Abstract',
      'proj.details': 'Project details',
      'proj.pi': 'Principal Investigator',
      'proj.coInvestigators': 'Co-investigators',
      'proj.funder': 'Funding body',
      'proj.grant': 'Grant reference',
      'proj.duration': 'Duration',
      'proj.status': 'Status',
      'proj.partners': 'Partner institutions',
      'proj.keywords': 'Keywords',
      'proj.publications': 'Selected publications',
      'proj.contact': 'Contact',
      'proj.contactCta': 'Contact the investigator',
      'proj.related': 'Related projects',
      'proj.notFoundTitle': 'Project not found',
      'proj.notFoundBody': 'That project reference does not exist. Return to the Research Hub to browse all active projects.',
      'proj.statusActive': 'Active',
      'proj.statusFieldwork': 'In fieldwork',
      'proj.statusRecruiting': 'Recruiting participants',
      'proj.statusAnalysis': 'In analysis',

      /* --- Fundraising --- */
      'give.eyebrow': 'Campaign · Global & Jesuit Funders',
      'give.title': 'Faculty of Philosophy',
      'give.titleAccent': 'New Building Fund',
      'give.lead': 'A permanent home for philosophical formation in Kinshasa: lecture halls, a research library, and seminar rooms open to the city. Every contribution — from Kinshasa or from abroad — is acknowledged in the building’s Book of Benefactors.',
      'give.raised': 'Raised so far',
      'give.of': 'of',
      'give.progressLabel': 'Campaign progress',
      'give.funded': 'funded',
      'give.benefactors': 'benefactors across 23 countries',
      'give.bullet1': 'Groundbreaking planned for the 2027 academic year.',
      'give.bullet2': 'Naming opportunities available for halls and the reading room.',
      'give.bullet3': 'Gifts are received by the ULC Foundation; receipts issued for tax purposes.',
      'give.formTitle': 'Make a gift',
      'give.amountLegend': 'Donation amount',
      'give.customLabel': 'Or enter another amount (USD)',
      'give.customPh': 'e.g. 120',
      'give.methodLegend': 'Payment method',
      'give.card': 'Credit / Debit Card',
      'give.cta': 'Give {amount} via {method}',
      'give.ctaEmpty': 'Enter a gift amount',
      'give.amountErr': 'Enter a gift amount of at least $1.',
      'give.redirect': 'Redirecting to {method}…',
      'give.thanks': 'Thank you for your gift',
      'give.recorded': 'A {amount} pledge via {method} has been recorded for this demo.',
      'give.impactLibrary': 'Your gift adds {n} volumes to the new research library.',
      'give.impactBursary': 'Your gift covers ≈ {n} month(s) of a student bursary.',
      'give.impactTuition': 'Your gift covers ≈ {n} semester(s) of full tuition support.',
      'give.impactRoom': 'Your gift funds ≈ {n} fully equipped seminar room(s).',

      /* --- Footer --- */
      'foot.name': 'Université Loyola du Congo',
      'foot.address': 'Avenue Père Boka, Kinshasa-Gombe · Democratic Republic of the Congo',
      'foot.rights': 'A.M.D.G. · © 2026 ULC. All rights reserved.',
    },

    fr: {
      /* --- Navigation & shell --- */
      'nav.admissions': 'Admissions',
      'nav.research': 'Pôle Recherche',
      'nav.give': 'Faire un don',
      'nav.apply': 'Postuler',
      'nav.open': 'Ouvrir le menu',
      'nav.close': 'Fermer le menu',
      'nav.langLabel': 'Choisir la langue',
      'brand.line1': 'Université Loyola',
      'brand.line2': 'du Congo · Kinshasa',

      /* --- Hero --- */
      'hero.eyebrow': 'Ad Majorem Dei Gloriam · Kinshasa, RD Congo',
      'hero.title': 'Former les esprits qui vont',
      'hero.titleAccent': 'rebâtir un continent.',
      'hero.lead': 'L’Université Loyola du Congo allie la tradition jésuite de la rigueur intellectuelle aux exigences du développement congolais — en philosophie, en sciences et technologies, et en gestion.',
      'hero.ctaApply': 'Déposer ma candidature',
      'hero.ctaResearch': 'Découvrir la recherche',
      'hero.statFaculties': 'Facultés',
      'hero.statProjects': 'Projets de recherche en cours',
      'hero.statPartners': 'Institutions partenaires',

      /* --- Rector --- */
      'ribbon.rector': 'Le Père Adrien Lentiampa Shenge, S.J. a été nommé Recteur de l’Université Loyola du Congo.',
      'ribbon.link': 'Lire son mot d’accueil',
      'rector.eyebrow': 'Mot du Recteur',
      'rector.title': 'Bienvenue à l’Université Loyola du Congo',
      'rector.p1': 'Chers étudiants, chers parents, chers amis de l’Université Loyola du Congo — c’est avec joie, et avec un vif sens de la responsabilité, que je prends aujourd’hui mes fonctions de Recteur.',
      'rector.p2': 'Cette université est née d’une conviction simple : l’intelligence, lorsqu’elle est formée avec rigueur et guidée par la conscience, demeure l’une des forces les plus sûres dont dispose notre pays. Nous ne formons pas seulement des diplômés. Nous formons des femmes et des hommes capables de penser librement, de servir avec compétence, et de se donner à plus grand qu’eux-mêmes.',
      'rector.p3': 'À celles et ceux qui frappent aujourd’hui à notre porte : vous êtes attendus. Venez avec vos questions, vos doutes et votre ambition — nous les prendrons au sérieux.',
      'rector.name': 'Père Adrien Lentiampa Shenge, S.J.',
      'rector.role': 'Recteur de l’Université Loyola du Congo',
      'rector.portraitAlt': 'Portrait du Père Adrien Lentiampa Shenge, S.J., Recteur de l’Université Loyola du Congo',
      'rector.cta': 'Découvrir nos facultés',

      /* --- Admissions --- */
      'adm.eyebrow': 'Admissions · Rentrée 2026–27',
      'adm.title': 'Postulez en trois étapes',
      'adm.lead': 'Votre progression est conservée sur cette page. Les pièces peuvent être ajoutées depuis n’importe quel téléphone — les photographies du Diplôme d’État sont acceptées.',
      'adm.progress': 'Progression de la candidature',
      'adm.step1': '1 · Identité',
      'adm.step2': '2 · Faculté',
      'adm.step3': '3 · Pièces',
      'adm.name': 'Nom complet',
      'adm.namePh': 'ex. Espérance Kabila Mwamba',
      'adm.nameErr': 'Indiquez votre nom complet (au moins deux mots).',
      'adm.email': 'Adresse électronique',
      'adm.emailPh': 'vous@exemple.cd',
      'adm.emailErr': 'Indiquez une adresse électronique valide.',
      'adm.phone': 'Téléphone (WhatsApp de préférence)',
      'adm.phonePh': '+243 81 000 0000',
      'adm.phoneErr': 'Indiquez un numéro valide, ex. +243 81 000 0000.',
      'adm.facultyLegend': 'Choisissez votre faculté',
      'adm.facultyErr': 'Sélectionnez une faculté pour continuer.',
      'adm.philTitle': 'Faculté de Philosophie',
      'adm.philDesc': 'Éthique, logique et tradition intellectuelle de la Compagnie de Jésus.',
      'adm.sciTitle': 'Faculté des Sciences & Technologies',
      'adm.sciDesc': 'Informatique, ingénierie et sciences appliquées au service de l’industrie congolaise.',
      'adm.bizTitle': 'Faculté de Gestion & Commerce',
      'adm.bizDesc': 'Management, finance et entrepreneuriat en Afrique centrale.',
      'adm.photo': 'Photo d’identité',
      'adm.photoHint': '(JPG ou PNG, 5 Mo maximum)',
      'adm.photoCta': 'Appuyez pour ajouter la photo',
      'adm.photoErr': 'Ajoutez une photo JPG ou PNG de moins de 5 Mo.',
      'adm.diploma': 'Diplôme d’État',
      'adm.diplomaHint': '(PDF ou photo, 10 Mo maximum)',
      'adm.diplomaCta': 'Appuyez pour ajouter le document',
      'adm.diplomaErr': 'Ajoutez votre Diplôme d’État en PDF ou en photo, moins de 10 Mo.',
      'adm.dropHint': 'ou déposez le fichier',
      'adm.back': 'Retour',
      'adm.continue': 'Continuer',
      'adm.submit': 'Envoyer ma candidature',
      'adm.successTitle': 'Candidature reçue',
      'adm.successBody': 'Merci, {name}. Le service des admissions vous contactera sous cinq jours ouvrables aux coordonnées indiquées.',

      /* --- Research --- */
      'res.eyebrow': 'Pôle Recherche · Corps académique & partenaires internationaux',
      'res.title': 'Une recherche pour le Congo, depuis le Congo',
      'res.searchPh': 'Rechercher un projet, un chercheur, un bailleur…',
      'res.searchLabel': 'Rechercher parmi les projets de recherche',
      'res.filterLabel': 'Filtrer par thématique de recherche',
      'res.count': '{shown} projets sur {total} affichés',
      'res.emptyTitle': 'Aucun projet ne correspond à cette recherche.',
      'res.emptyBody': 'Videz le champ de recherche ou désélectionnez une thématique pour élargir les résultats.',
      'res.pi': 'Chercheur principal',
      'res.funder': 'Bailleur de fonds',
      'res.readAbstract': 'Lire le résumé',

      /* --- Project page --- */
      'proj.back': 'Retour au Pôle Recherche',
      'proj.eyebrow': 'Projet de recherche',
      'proj.abstract': 'Résumé',
      'proj.details': 'Fiche du projet',
      'proj.pi': 'Chercheur principal',
      'proj.coInvestigators': 'Co-chercheurs',
      'proj.funder': 'Bailleur de fonds',
      'proj.grant': 'Référence de la subvention',
      'proj.duration': 'Durée',
      'proj.status': 'État d’avancement',
      'proj.partners': 'Institutions partenaires',
      'proj.keywords': 'Mots-clés',
      'proj.publications': 'Publications choisies',
      'proj.contact': 'Contact',
      'proj.contactCta': 'Contacter le chercheur',
      'proj.related': 'Projets apparentés',
      'proj.notFoundTitle': 'Projet introuvable',
      'proj.notFoundBody': 'Cette référence de projet n’existe pas. Retournez au Pôle Recherche pour parcourir tous les projets en cours.',
      'proj.statusActive': 'En cours',
      'proj.statusFieldwork': 'Travaux de terrain',
      'proj.statusRecruiting': 'Recrutement des participants',
      'proj.statusAnalysis': 'Phase d’analyse',

      /* --- Fundraising --- */
      'give.eyebrow': 'Campagne · Bailleurs internationaux & jésuites',
      'give.title': 'Faculté de Philosophie',
      'give.titleAccent': 'Fonds du nouveau bâtiment',
      'give.lead': 'Une maison durable pour la formation philosophique à Kinshasa : amphithéâtres, bibliothèque de recherche et salles de séminaire ouvertes sur la ville. Chaque contribution — de Kinshasa ou de l’étranger — est inscrite au Livre des bienfaiteurs.',
      'give.raised': 'Montant collecté',
      'give.of': 'sur',
      'give.progressLabel': 'Avancement de la campagne',
      'give.funded': 'financé',
      'give.benefactors': 'bienfaiteurs dans 23 pays',
      'give.bullet1': 'Pose de la première pierre prévue pour l’année académique 2027.',
      'give.bullet2': 'Possibilités de parrainage nominatif des salles et de la bibliothèque.',
      'give.bullet3': 'Les dons sont reçus par la Fondation ULC ; reçus fiscaux délivrés.',
      'give.formTitle': 'Faire un don',
      'give.amountLegend': 'Montant du don',
      'give.customLabel': 'Ou saisissez un autre montant (USD)',
      'give.customPh': 'ex. 120',
      'give.methodLegend': 'Moyen de paiement',
      'give.card': 'Carte bancaire',
      'give.cta': 'Donner {amount} par {method}',
      'give.ctaEmpty': 'Saisissez un montant',
      'give.amountErr': 'Saisissez un montant d’au moins 1 $.',
      'give.redirect': 'Redirection vers {method}…',
      'give.thanks': 'Merci pour votre don',
      'give.recorded': 'Une promesse de {amount} par {method} a été enregistrée pour cette démonstration.',
      'give.impactLibrary': 'Votre don ajoute {n} ouvrages à la nouvelle bibliothèque de recherche.',
      'give.impactBursary': 'Votre don couvre ≈ {n} mois de bourse étudiante.',
      'give.impactTuition': 'Votre don couvre ≈ {n} semestre(s) de frais de scolarité.',
      'give.impactRoom': 'Votre don finance ≈ {n} salle(s) de séminaire entièrement équipée(s).',

      /* --- Footer --- */
      'foot.name': 'Université Loyola du Congo',
      'foot.address': 'Avenue Père Boka, Kinshasa-Gombe · République Démocratique du Congo',
      'foot.rights': 'A.M.D.G. · © 2026 ULC. Tous droits réservés.',
    },
  };

  var SUPPORTED = ['fr', 'en'];
  var DEFAULT = 'fr'; // Kinshasa first — French is the language of instruction
  var current = DEFAULT;
  var listeners = [];

  /* --- Storage with a graceful fallback (private mode, file://) --- */
  var memoryStore = null;
  function readStored() {
    try { return window.localStorage.getItem('ulc.lang'); } catch (e) { return memoryStore; }
  }
  function writeStored(v) {
    try { window.localStorage.setItem('ulc.lang', v); } catch (e) { memoryStore = v; }
  }

  function detect() {
    var fromQuery = null;
    if (typeof location !== 'undefined') {
      fromQuery = new URLSearchParams(location.search).get('lang');
    }
    var candidate = fromQuery || readStored() ||
      (typeof navigator !== 'undefined' && navigator.language ? navigator.language.slice(0, 2) : DEFAULT);
    return SUPPORTED.indexOf(candidate) !== -1 ? candidate : DEFAULT;
  }

  /** Translate a key, with optional {placeholder} interpolation. */
  function t(key, vars, lang) {
    var dict = STRINGS[lang || current] || STRINGS[DEFAULT];
    var str = dict[key];
    if (str === undefined) { str = (STRINGS.en[key] !== undefined) ? STRINGS.en[key] : key; }
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, function (m, name) {
      return Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : m;
    });
  }

  /** Pick the right side of a bilingual { en, fr } value. */
  function pick(value, lang) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value[lang || current] || value[DEFAULT] || value.en || '';
  }

  var ATTRS = [
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-aria-label', 'aria-label'],
    ['data-i18n-title', 'title'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-value', 'value'],
  ];

  /** Apply all translations inside a root element (defaults to document). */
  function apply(scope) {
    var el = scope || document;
    el.querySelectorAll('[data-i18n]').forEach(function (n) {
      n.textContent = t(n.getAttribute('data-i18n'));
    });
    el.querySelectorAll('[data-i18n-html]').forEach(function (n) {
      n.innerHTML = t(n.getAttribute('data-i18n-html'));
    });
    ATTRS.forEach(function (pair) {
      el.querySelectorAll('[' + pair[0] + ']').forEach(function (n) {
        n.setAttribute(pair[1], t(n.getAttribute(pair[0])));
      });
    });
  }

  /**
   * Keep marked internal links carrying the active language, so a shared URL
   * opens in the language the sender was reading. Operates on the href
   * attribute rather than the .href property, which would absolutise the path.
   */
  function applyLangToLinks(scope) {
    (scope || document).querySelectorAll('a[data-lang-link]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var hash = '';
      var hashAt = href.indexOf('#');
      if (hashAt !== -1) { hash = href.slice(hashAt); href = href.slice(0, hashAt); }
      href = href.replace(/[?&]lang=(fr|en)/, '');
      href += (href.indexOf('?') === -1 ? '?' : '&') + 'lang=' + current;
      a.setAttribute('href', href + hash);
    });
  }

  /** Switch language, update <html lang>, re-translate, notify modules. */
  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    current = lang;
    writeStored(lang);
    document.documentElement.setAttribute('lang', lang);
    apply(document);
    applyLangToLinks(document);
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang-btn') === lang));
    });
    listeners.forEach(function (fn) { fn(lang); });
  }

  function onChange(fn) { listeners.push(fn); }
  function getLang() { return current; }

  /** Number/currency formatting that follows the active locale. */
  function money(n, lang) {
    var l = (lang || current) === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.NumberFormat(l, {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    }).format(Math.round(n));
  }
  function num(n, lang) {
    var l = (lang || current) === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.NumberFormat(l).format(n);
  }

  /** Wire up any [data-lang-btn] controls and run the first translation pass. */
  function init() {
    setLang(detect());
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang-btn')); });
    });
  }

  return { STRINGS: STRINGS, t: t, pick: pick, apply: apply, applyLangToLinks: applyLangToLinks, setLang: setLang, getLang: getLang, onChange: onChange, money: money, num: num, initI18n: init };
});
