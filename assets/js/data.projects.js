/* ==========================================================================
   ULC — Research dataset
   Single source of truth for the Research Hub grid, the individual abstract
   pages, and the static pre-render tool. Every human-readable field is
   bilingual: { en: '…', fr: '…' }.

   To move to a live backend, replace PROJECTS with a fetch() of the same
   shape — nothing else in the codebase needs to change.
   ========================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.ULC = root.ULC || {}; Object.assign(root.ULC, api); }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TAGS = {
    health:   { en: 'Digital Health & AI',     fr: 'Santé numérique & IA' },
    agri:     { en: 'Sustainable Agriculture', fr: 'Agriculture durable' },
    bioprint: { en: '3D Bioprinting',          fr: 'Bio-impression 3D' },
  };

  var PROJECTS = [
    {
      id: 'ai-triage-clinics',
      tag: 'health',
      status: 'proj.statusActive',
      pi: { name: 'Dr. Astrid Mbala', role: { en: 'Senior Lecturer, Faculty of Science & Technology', fr: 'Maître de conférences, Faculté des Sciences & Technologies' } },
      coInvestigators: ['Dr. Serge Kalonji (ULC)', 'Prof. Anne Devos (KU Leuven)'],
      funder: 'Fondation Pierre Fabre',
      grant: 'FPF-2024-0417',
      duration: '2024 – 2027',
      partners: ['Cliniques Universitaires de Kinshasa', 'Bureau Diocésain des Œuvres Médicales', 'KU Leuven'],
      contact: 'a.mbala@ulc.cd',
      title: {
        en: 'AI Triage for Community Health Clinics',
        fr: 'Triage assisté par IA pour les centres de santé communautaires',
      },
      summary: {
        en: 'Offline-first clinical decision support deployed across fourteen clinics in Kinshasa and Kwilu.',
        fr: 'Aide à la décision clinique fonctionnant hors ligne, déployée dans quatorze centres de santé à Kinshasa et au Kwilu.',
      },
      keywords: {
        en: ['clinical decision support', 'offline inference', 'primary care', 'triage'],
        fr: ['aide à la décision clinique', 'inférence hors ligne', 'soins primaires', 'triage'],
      },
      abstract: {
        en: [
          'Health posts serving the periphery of Kinshasa routinely operate without a physician on site and without a reliable data connection. This project develops a triage assistant that runs entirely on a mid-range Android handset, guiding nurse-practitioners through structured symptom capture and returning a ranked referral recommendation with an explicit confidence band.',
          'The model is trained on de-identified consultation records contributed by fourteen partner clinics and is re-validated locally each quarter to guard against drift. Our central research question is not whether such a system can achieve acceptable accuracy in a laboratory, but whether it changes referral behaviour under real clinical load — so the trial design pairs technical evaluation with observational study of how clinicians accept, override, or ignore the recommendation.',
        ],
        fr: [
          'Les postes de santé desservant la périphérie de Kinshasa fonctionnent le plus souvent sans médecin sur place et sans connexion fiable. Ce projet développe un assistant de triage qui s’exécute intégralement sur un téléphone Android de moyenne gamme, guidant les infirmiers dans une saisie structurée des symptômes et renvoyant une recommandation d’orientation hiérarchisée assortie d’un intervalle de confiance explicite.',
          'Le modèle est entraîné sur des dossiers de consultation anonymisés fournis par quatorze centres partenaires et revalidé localement chaque trimestre afin de prévenir toute dérive. Notre question centrale n’est pas de savoir si un tel système atteint une précision acceptable en laboratoire, mais s’il modifie les comportements d’orientation en conditions réelles de charge clinique : le protocole associe donc l’évaluation technique à une étude observationnelle des cas où le soignant accepte, contredit ou ignore la recommandation.',
        ],
      },
      publications: [
        { title: { en: 'Offline triage support in low-connectivity primary care: a fourteen-site protocol', fr: 'Aide au triage hors ligne en soins primaires à faible connectivité : protocole multisite' }, venue: 'BMJ Global Health', year: 2025 },
        { title: { en: 'Clinician override patterns in algorithmic referral', fr: 'Schémas de contournement clinique dans l’orientation algorithmique' }, venue: 'PLOS Digital Health', year: 2026 },
      ],
    },

    {
      id: 'telemedicine-mesh',
      tag: 'health',
      status: 'proj.statusFieldwork',
      pi: { name: 'Prof. Jonas Lokwa', role: { en: 'Professor of Telecommunications Engineering', fr: 'Professeur de génie des télécommunications' } },
      coInvestigators: ['Dr. Rachel Bosenge (ULC)', 'Ir. Patrick Mwanza (INPP)'],
      funder: 'USAID Development Innovation Ventures',
      grant: 'DIV-2023-CD-118',
      duration: '2023 – 2026',
      partners: ['Hôpital Général de Mbandaka', 'Institut National de Préparation Professionnelle', 'Réseau Fluvial de Santé'],
      contact: 'j.lokwa@ulc.cd',
      title: {
        en: 'Telemedicine Mesh Networks for the Équateur',
        fr: 'Réseaux maillés de télémédecine pour l’Équateur',
      },
      summary: {
        en: 'Low-power radio mesh linking riverside health posts to referral hospitals along the Congo river.',
        fr: 'Maillage radio basse consommation reliant les postes de santé riverains aux hôpitaux de référence le long du fleuve Congo.',
      },
      keywords: {
        en: ['mesh networking', 'LoRa', 'telemedicine', 'rural connectivity'],
        fr: ['réseau maillé', 'LoRa', 'télémédecine', 'connectivité rurale'],
      },
      abstract: {
        en: [
          'Along a six-hundred-kilometre stretch of the Congo river, referral decisions are still carried by boat. This project builds and field-tests a solar-powered LoRa mesh that carries short structured clinical messages — vitals, drug stock levels, and referral requests — between eleven riverside health posts and the general hospital at Mbandaka.',
          'The engineering contribution is a store-and-forward routing scheme tolerant of nodes that sleep for most of the day and of a river channel whose geometry shifts seasonally. The health-systems contribution is a measured account of what changes when a referral request that once took two days arrives in ninety seconds.',
        ],
        fr: [
          'Sur six cents kilomètres du fleuve Congo, les décisions d’orientation voyagent encore en pirogue. Ce projet construit et éprouve sur le terrain un réseau maillé LoRa alimenté par énergie solaire, acheminant de courts messages cliniques structurés — constantes vitales, niveaux de stock de médicaments, demandes d’orientation — entre onze postes de santé riverains et l’hôpital général de Mbandaka.',
          'L’apport en ingénierie est un protocole de routage à stockage-et-retransmission tolérant aux nœuds en veille prolongée et à un chenal fluvial dont la géométrie varie selon les saisons. L’apport en santé publique est une mesure rigoureuse de ce qui change lorsqu’une demande d’orientation, autrefois longue de deux jours, parvient en quatre-vingt-dix secondes.',
        ],
      },
      publications: [
        { title: { en: 'Store-and-forward mesh design for seasonal river corridors', fr: 'Conception d’un maillage à stockage-et-retransmission pour couloirs fluviaux saisonniers' }, venue: 'IEEE Access', year: 2025 },
      ],
    },

    {
      id: 'lingala-speech',
      tag: 'health',
      status: 'proj.statusRecruiting',
      pi: { name: 'Dr. Grace Ndaya', role: { en: 'Lecturer in Computational Linguistics', fr: 'Chargée de cours en linguistique informatique' } },
      coInvestigators: ['Dr. Emmanuel Tshibangu (ULC)', 'Dr. Fatou Diop (UCAD, Dakar)'],
      funder: 'Lacuna Fund',
      grant: 'LF-SPEECH-2025-09',
      duration: '2025 – 2028',
      partners: ['Université Cheikh Anta Diop', 'Masakhane Research Foundation', 'Centre de Santé Saint-Ignace'],
      contact: 'g.ndaya@ulc.cd',
      title: {
        en: 'Lingála-First Speech Models for Patient Intake',
        fr: 'Modèles de parole en lingála pour l’accueil des patients',
      },
      summary: {
        en: 'Open speech corpora and recognition models in Lingála and Kikongo for frontline health workers.',
        fr: 'Corpus et modèles de reconnaissance vocale libres en lingála et kikongo pour les agents de santé de première ligne.',
      },
      keywords: {
        en: ['speech recognition', 'low-resource languages', 'Lingála', 'open data'],
        fr: ['reconnaissance vocale', 'langues peu dotées', 'lingála', 'données ouvertes'],
      },
      abstract: {
        en: [
          'Patient intake in Kinshasa happens in Lingála; the paperwork happens in French. That translation gap is where clinical detail is lost. This project assembles the first openly licensed speech corpus for medical Lingála and Kikongo — three hundred hours, consented and de-identified — and trains recognition models sized to run on clinic hardware.',
          'We treat the corpus itself as the primary output. Models age; a well-documented, ethically sourced corpus in a language with almost no machine-readable record will outlast several generations of architecture. All data is released under a licence that requires derivative works to remain available to Congolese institutions.',
        ],
        fr: [
          'À Kinshasa, l’accueil du patient se fait en lingála ; le dossier, lui, s’écrit en français. C’est dans cet écart de traduction que se perd le détail clinique. Ce projet constitue le premier corpus vocal sous licence libre pour le lingála et le kikongo médicaux — trois cents heures, recueillies avec consentement et anonymisées — et entraîne des modèles de reconnaissance dimensionnés pour le matériel des centres de santé.',
          'Nous considérons le corpus lui-même comme le produit principal. Les modèles vieillissent ; un corpus bien documenté et éthiquement constitué, dans une langue quasi absente des ressources exploitables par la machine, survivra à plusieurs générations d’architectures. Toutes les données sont publiées sous une licence imposant que les travaux dérivés restent accessibles aux institutions congolaises.',
        ],
      },
      publications: [
        { title: { en: 'Building a consented medical speech corpus for Lingála', fr: 'Constitution d’un corpus vocal médical consenti en lingála' }, venue: 'LREC-COLING', year: 2026 },
      ],
    },

    {
      id: 'cassava-resilience',
      tag: 'agri',
      status: 'proj.statusFieldwork',
      pi: { name: 'Prof. Célestin Ilunga', role: { en: 'Professor of Agronomy', fr: 'Professeur d’agronomie' } },
      coInvestigators: ['Dr. Béatrice Muyaya (ULC)', 'Dr. Samuel Ochieng (IITA)'],
      funder: 'FAO / AGRA',
      grant: 'AGRA-CD-2024-33',
      duration: '2024 – 2029',
      partners: ['Institut National pour l’Étude et la Recherche Agronomiques', 'IITA Kinshasa', 'Coopératives agricoles du Kwilu'],
      contact: 'c.ilunga@ulc.cd',
      title: {
        en: 'Drought-Resilient Cassava Systems',
        fr: 'Systèmes de manioc résilients à la sécheresse',
      },
      summary: {
        en: 'Participatory breeding trials with six hundred smallholder farmers across Kwilu province.',
        fr: 'Essais de sélection participative avec six cents petits exploitants de la province du Kwilu.',
      },
      keywords: {
        en: ['cassava', 'participatory breeding', 'drought tolerance', 'food security'],
        fr: ['manioc', 'sélection participative', 'tolérance à la sécheresse', 'sécurité alimentaire'],
      },
      abstract: {
        en: [
          'Cassava supplies more than half the caloric intake of rural Kwilu, and the dry season is lengthening. This project runs participatory varietal selection across sixty village trial plots, with farmers scoring candidate cultivars on the criteria they actually use — cooking quality, storability in the ground, and labour at harvest — alongside the agronomic measures researchers favour.',
          'Where farmer ranking and yield data disagree, we treat the disagreement as the finding rather than the noise. Early results suggest that the highest-yielding drought-tolerant lines are being rejected on processing grounds, which reframes the breeding target for the remainder of the programme.',
        ],
        fr: [
          'Le manioc fournit plus de la moitié de l’apport calorique du Kwilu rural, et la saison sèche s’allonge. Ce projet conduit une sélection variétale participative sur soixante parcelles d’essai villageoises, où les agriculteurs évaluent les cultivars candidats selon les critères qu’ils emploient réellement — qualité culinaire, conservation en terre, pénibilité de la récolte — parallèlement aux mesures agronomiques privilégiées par les chercheurs.',
          'Lorsque le classement paysan et les données de rendement divergent, nous traitons ce désaccord comme un résultat et non comme un bruit. Les premiers constats indiquent que les lignées tolérantes à la sécheresse les plus productives sont rejetées pour des raisons de transformation, ce qui redéfinit l’objectif de sélection pour la suite du programme.',
        ],
      },
      publications: [
        { title: { en: 'When farmers reject the best-yielding line: processing traits in cassava selection', fr: 'Quand les agriculteurs rejettent la lignée la plus productive : critères de transformation dans la sélection du manioc' }, venue: 'Field Crops Research', year: 2026 },
      ],
    },

    {
      id: 'mayombe-carbon',
      tag: 'agri',
      status: 'proj.statusAnalysis',
      pi: { name: 'Dr. Mireille Tshiala', role: { en: 'Lecturer in Environmental Science', fr: 'Chargée de cours en sciences de l’environnement' } },
      coInvestigators: ['Dr. Joseph Nkumu (ULC)', 'Dr. Lena Fischer (ETH Zürich)'],
      funder: 'Rainforest Trust',
      grant: 'RT-CD-2025-07',
      duration: '2025 – 2028',
      partners: ['ETH Zürich', 'WWF République Démocratique du Congo', 'Fédération des Producteurs du Mayombe'],
      contact: 'm.tshiala@ulc.cd',
      title: {
        en: 'Agroforestry Carbon Ledger for the Mayombe',
        fr: 'Registre carbone agroforestier du Mayombe',
      },
      summary: {
        en: 'Satellite-verified smallholder carbon accounting piloted along the Mayombe forest corridor.',
        fr: 'Comptabilité carbone paysanne vérifiée par satellite, expérimentée le long du corridor forestier du Mayombe.',
      },
      keywords: {
        en: ['agroforestry', 'carbon accounting', 'remote sensing', 'benefit sharing'],
        fr: ['agroforesterie', 'comptabilité carbone', 'télédétection', 'partage des bénéfices'],
      },
      abstract: {
        en: [
          'Smallholders in the Mayombe corridor practise agroforestry that demonstrably sequesters carbon, yet they are locked out of carbon markets because verification costs more than their plots are worth. This project pairs freely available Sentinel-2 imagery with a lightweight ground-truthing protocol that a cooperative can execute with a phone and a tape measure.',
          'The ledger is deliberately conservative: it under-claims sequestration to keep verification defensible at audit. Our thesis is that a credible small number, owned by the cooperative and legible to a buyer, is worth more to a Congolese farmer than an optimistic estimate no market will accept.',
        ],
        fr: [
          'Les petits exploitants du corridor du Mayombe pratiquent une agroforesterie qui séquestre manifestement du carbone, sans pouvoir accéder aux marchés : la vérification y coûte plus cher que la valeur des parcelles. Ce projet associe l’imagerie Sentinel-2 librement accessible à un protocole de vérification terrain allégé, exécutable par une coopérative avec un téléphone et un mètre ruban.',
          'Le registre est volontairement prudent : il sous-estime la séquestration afin que la vérification résiste à l’audit. Notre thèse est qu’un chiffre modeste mais crédible, détenu par la coopérative et lisible par un acheteur, vaut davantage pour un agriculteur congolais qu’une estimation optimiste qu’aucun marché n’acceptera.',
        ],
      },
      publications: [
        { title: { en: 'Conservative carbon estimation for smallholder agroforestry', fr: 'Estimation carbone prudente pour l’agroforesterie paysanne' }, venue: 'Environmental Research Letters', year: 2026 },
      ],
    },

    {
      id: 'solar-storage-coops',
      tag: 'agri',
      status: 'proj.statusActive',
      pi: { name: 'Prof. Emmanuel Bofane', role: { en: 'Professor of Agricultural Engineering', fr: 'Professeur de génie agricole' } },
      coInvestigators: ['Dr. Clarisse Ekofo (ULC)', 'Ir. Daniel Mputu (INERA)'],
      funder: 'IFAD',
      grant: 'IFAD-2024-CD-2201',
      duration: '2024 – 2027',
      partners: ['INERA Mvuazi', 'Coopératives du Kongo Central', 'Entrepreneurs du Développement Rural'],
      contact: 'e.bofane@ulc.cd',
      title: {
        en: 'Solar-Dried Post-Harvest Storage Co-operatives',
        fr: 'Coopératives de séchage solaire et de stockage après récolte',
      },
      summary: {
        en: 'Cutting maize and cassava post-harvest losses by forty per cent through co-operative solar drying hubs.',
        fr: 'Réduire de quarante pour cent les pertes après récolte de maïs et de manioc grâce à des centres coopératifs de séchage solaire.',
      },
      keywords: {
        en: ['post-harvest loss', 'solar drying', 'co-operatives', 'value chains'],
        fr: ['pertes après récolte', 'séchage solaire', 'coopératives', 'chaînes de valeur'],
      },
      abstract: {
        en: [
          'Between a third and a half of the maize harvested in Kongo Central is lost before it reaches a buyer, most of it to moisture in the first fortnight. This project designs, builds, and hands over eight co-operatively owned solar drying hubs, each sized to serve roughly ninety households within a two-hour walk.',
          'The technical design is deliberately unremarkable — glazed collector, forced convection, locally weldable frame — because the real research question is institutional: which ownership and scheduling arrangements survive a second harvest season without external supervision.',
        ],
        fr: [
          'Entre un tiers et la moitié du maïs récolté au Kongo Central est perdu avant d’atteindre un acheteur, principalement à cause de l’humidité pendant la première quinzaine. Ce projet conçoit, construit et transfère huit centres de séchage solaire en propriété coopérative, chacun dimensionné pour desservir environ quatre-vingt-dix ménages situés à moins de deux heures de marche.',
          'La conception technique est volontairement banale — capteur vitré, convection forcée, châssis soudable sur place — car la véritable question de recherche est institutionnelle : quels modes de propriété et de planification survivent à une deuxième campagne sans supervision extérieure.',
        ],
      },
      publications: [
        { title: { en: 'Institutional durability of co-operative post-harvest infrastructure', fr: 'Durabilité institutionnelle des infrastructures coopératives après récolte' }, venue: 'Food Security', year: 2026 },
      ],
    },

    {
      id: 'corneal-scaffolds',
      tag: 'bioprint',
      status: 'proj.statusActive',
      pi: { name: 'Dr. Nathanaël Kabongo', role: { en: 'Senior Lecturer in Biomedical Engineering', fr: 'Maître de conférences en génie biomédical' } },
      coInvestigators: ['Dr. Léonie Mabiala (ULC)', 'Prof. Ravi Menon (Univ. of Cape Town)'],
      funder: 'NIH Fogarty International Center',
      grant: 'D43-TW-2025-0148',
      duration: '2025 – 2030',
      partners: ['University of Cape Town', 'Cliniques Universitaires de Kinshasa', 'Institut d’Ophtalmologie de Kinshasa'],
      contact: 'n.kabongo@ulc.cd',
      title: {
        en: 'Bioprinted Corneal Scaffolds',
        fr: 'Matrices cornéennes bio-imprimées',
      },
      summary: {
        en: 'Collagen-based corneal scaffolds printed for low-cost keratoplasty in resource-limited operating theatres.',
        fr: 'Matrices cornéennes collagéniques imprimées pour une kératoplastie à faible coût en blocs opératoires à ressources limitées.',
      },
      keywords: {
        en: ['bioprinting', 'cornea', 'collagen scaffold', 'keratoplasty'],
        fr: ['bio-impression', 'cornée', 'matrice collagénique', 'kératoplastie'],
      },
      abstract: {
        en: [
          'Corneal blindness is treatable and, in much of Central Africa, untreated: donor tissue is scarce and cold-chain logistics defeat most transplant programmes. This project prints acellular collagen scaffolds that can be stored at ambient temperature for ninety days and rehydrated in theatre.',
          'The work is being conducted as a training partnership as much as a research programme. Two Congolese doctoral candidates are being trained in Cape Town on the printing platform and will return to establish the laboratory at ULC, which is the only mechanism by which the capability stays in Kinshasa after the grant ends.',
        ],
        fr: [
          'La cécité cornéenne se traite ; en Afrique centrale, elle ne se traite pas : le tissu de donneur est rare et la logistique du froid met en échec la plupart des programmes de greffe. Ce projet imprime des matrices collagéniques acellulaires conservables quatre-vingt-dix jours à température ambiante et réhydratables au bloc.',
          'Ces travaux constituent autant un partenariat de formation qu’un programme de recherche. Deux doctorants congolais sont formés au Cap sur la plateforme d’impression et reviendront établir le laboratoire à l’ULC — seul mécanisme par lequel la compétence demeurera à Kinshasa après la fin de la subvention.',
        ],
      },
      publications: [
        { title: { en: 'Ambient-stable collagen scaffolds for keratoplasty in low-resource settings', fr: 'Matrices collagéniques stables à température ambiante pour la kératoplastie en milieu à faibles ressources' }, venue: 'Biofabrication', year: 2026 },
      ],
    },

    {
      id: 'patient-tailored-iol',
      tag: 'bioprint',
      status: 'proj.statusAnalysis',
      pi: { name: 'Dr. Pauline Nzuzi', role: { en: 'Lecturer in Applied Physics', fr: 'Chargée de cours en physique appliquée' } },
      coInvestigators: ['Dr. Nathanaël Kabongo (ULC)', 'Dr. Ingrid Haas (Fraunhofer ILT)'],
      funder: 'Wellcome Leap',
      grant: 'WL-VISION-2025-22',
      duration: '2025 – 2028',
      partners: ['Fraunhofer Institute for Laser Technology', 'Institut d’Ophtalmologie de Kinshasa'],
      contact: 'p.nzuzi@ulc.cd',
      title: {
        en: 'Patient-Tailored Intraocular Lens Printing',
        fr: 'Impression de lentilles intraoculaires personnalisées',
      },
      summary: {
        en: 'Two-photon printed intraocular lenses matched to individual corneal topography for cataract surgery.',
        fr: 'Lentilles intraoculaires imprimées par polymérisation à deux photons, ajustées à la topographie cornéenne de chaque patient.',
      },
      keywords: {
        en: ['intraocular lens', 'two-photon polymerisation', 'corneal topography', 'cataract'],
        fr: ['lentille intraoculaire', 'polymérisation à deux photons', 'topographie cornéenne', 'cataracte'],
      },
      abstract: {
        en: [
          'Standard intraocular lenses are manufactured in a small number of dioptric steps, so a patient receives the nearest available correction rather than their own. This project prints lens geometries derived directly from a patient’s corneal topography, using two-photon polymerisation to reach the surface tolerances the optics demand.',
          'The immediate question is whether per-patient printing can be brought inside the cost envelope of a high-volume cataract programme. The current phase reports on optical bench characterisation of forty printed lenses against their design targets; a clinical arm is contingent on those tolerances holding.',
        ],
        fr: [
          'Les lentilles intraoculaires standard sont fabriquées selon un petit nombre de paliers dioptriques : le patient reçoit donc la correction disponible la plus proche, et non la sienne. Ce projet imprime des géométries de lentille dérivées directement de la topographie cornéenne du patient, par polymérisation à deux photons, afin d’atteindre les tolérances de surface qu’exige l’optique.',
          'La question immédiate est de savoir si l’impression individualisée peut tenir dans l’enveloppe budgétaire d’un programme de chirurgie de la cataracte à haut volume. La phase actuelle rend compte de la caractérisation sur banc optique de quarante lentilles imprimées au regard de leurs cibles de conception ; le volet clinique dépendra du maintien de ces tolérances.',
        ],
      },
      publications: [
        { title: { en: 'Bench characterisation of two-photon printed intraocular optics', fr: 'Caractérisation sur banc d’optiques intraoculaires imprimées par deux photons' }, venue: 'Optics Express', year: 2026 },
      ],
    },
  ];

  function byId(id) {
    for (var i = 0; i < PROJECTS.length; i++) { if (PROJECTS[i].id === id) return PROJECTS[i]; }
    return null;
  }

  function related(project, limit) {
    return PROJECTS
      .filter(function (p) { return p.tag === project.tag && p.id !== project.id; })
      .slice(0, limit || 2);
  }

  return { PROJECTS: PROJECTS, TAGS: TAGS, projectById: byId, relatedProjects: related };
});
