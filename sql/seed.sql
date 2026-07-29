-- Sack Me! — données de référence (MVP)
-- Chargé automatiquement au premier démarrage Docker.

-- ─── Filiales Mutualis ────────────────────────────────────────

INSERT INTO entities (id, name, domain_fr, domain_en, blurb_fr, blurb_en) VALUES
  ('assurance', 'Mutualis Assurance', 'Assurance / sinistres', 'Insurance / claims',
   'Contrats, sinistres, fraude, parcours digital assuré.',
   'Policies, claims, fraud, digital policyholder journeys.'),
  ('bank', 'Mutualis Bank', 'Banque / finance', 'Banking / finance',
   'Compte, crédit, KYC, conformité et parcours client digital.',
   'Accounts, credit, KYC, compliance and digital banking.'),
  ('retail', 'Mutualis Retail', 'Retail / distribution', 'Retail / distribution',
   'Magasins, e-commerce, caisse, assortiment et fidélité.',
   'Stores, e-commerce, checkout, assortment and loyalty.'),
  ('transport', 'Mutualis Transport', 'Transport / logistique', 'Transport / logistics',
   'Flotte, tournées, tracking, entrepôts et délais de livraison.',
   'Fleet, routes, tracking, warehouses and delivery SLAs.'),
  ('energy', 'Mutualis Energy', 'Énergie / utilities', 'Energy / utilities',
   'Compteurs, consommation, facturation et réseau.',
   'Meters, consumption, billing and grid ops.'),
  ('media', 'Mutualis Media', 'Média / audience', 'Media / audience',
   'Contenus, audience, pub programmatique et mesures d''impact.',
   'Content, audience, programmatic ads and impact measurement.'),
  ('agro', 'Mutualis Agro', 'Agro / filière', 'Agri / supply chain',
   'Filière agricole, traçabilité, stocks et coopératives.',
   'Agri supply chain, traceability, stock and co-ops.')
ON CONFLICT (id) DO NOTHING;

-- ─── Types de projet ──────────────────────────────────────────

INSERT INTO project_kinds (id, label_fr, label_en, hint_fr, hint_en) VALUES
  ('it', 'Projet IT', 'IT project',
   'SI, CRM, ERP, infra, architecture, intégrations — problématiques Mutualis.',
   'Systems, CRM, ERP, infra, architecture, integrations — Mutualis business cases.'),
  ('data-ai', 'Projet Data/IA', 'Data/AI project',
   'Analytics, BI, ML, automatisation, deep learning, gouvernance data — Mutualis.',
   'Analytics, BI, ML, automation, deep learning, data governance — Mutualis.')
ON CONFLICT (id) DO NOTHING;

-- ─── Rôles (project_kind = rattachement principal) ────────────

INSERT INTO roles (id, label_fr, label_en, track, project_kind) VALUES
  ('business-analyst', 'Business Analyst', 'Business Analyst', 'pm', 'it'),
  ('chef-de-projet', 'Chef de projet', 'Project Manager', 'pm', 'it'),
  ('product-owner', 'Product Owner', 'Product Owner', 'pm', 'it'),
  ('scrum-master', 'Scrum Master', 'Scrum Master', 'pm', 'it'),
  ('technico-fonctionnel', 'Technico-fonctionnel', 'Techno-functional', 'pm', 'it'),
  ('data-manager', 'Data Manager', 'Data Manager', 'governance', 'data-ai'),
  ('data-steward', 'Data Steward', 'Data Steward', 'governance', 'data-ai'),
  ('data-governance-manager', 'Data Governance Manager', 'Data Governance Manager', 'governance', 'data-ai'),
  ('ai-governance-manager', 'AI Governance Manager', 'AI Governance Manager', 'governance', 'data-ai')
ON CONFLICT (id) DO NOTHING;

-- ─── Grades carrière ──────────────────────────────────────────

INSERT INTO career_titles (id, label_fr, label_en, min_score, blurb_fr, blurb_en) VALUES
  ('junior', 'Junior', 'Junior', 0,
   'Tu intègres la squad Mutualis. On te regarde.',
   'You join the Mutualis squad. Eyes are on you.'),
  ('pm', 'Confirmé', 'Mid-level', 40,
   'Tu portes backlog, livrables et arbitrages métier.',
   'You own backlog, deliverables and business trade-offs.'),
  ('senior', 'Senior', 'Senior', 100,
   'Tu sécurises les Increments sous pression COMEX.',
   'You secure Increments under executive pressure.'),
  ('lead', 'Lead', 'Lead', 180,
   'Tu fais grandir l''équipe et le système de delivery.',
   'You grow the team and the delivery system.'),
  ('head', 'Head', 'Head', 280,
   'Tu incarnes la trajectoire Mutualis data & IA.',
   'You embody Mutualis data & AI delivery.')
ON CONFLICT (id) DO NOTHING;

-- ─── Niveaux d'aventure (MVP) ─────────────────────────────────

INSERT INTO adventure_levels (id, title_fr, title_en, intro_fr, intro_en) VALUES
  (0, 'Onboarding Mutualis', 'Mutualis onboarding',
   'Bienvenue. Premier Increment : cadrer le besoin et poser un livrable propre.',
   'Welcome. First Increment: frame the need and ship a clean deliverable.'),
  (1, 'Qualité & risque', 'Quality & risk',
   'Le COMEX regarde. Qualité des données, risques et arbitrages sous pression.',
   'The exec committee is watching. Data quality, risks and trade-offs under pressure.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO adventure_steps (
  id, level_id, sort_order, title_fr, title_en, say_fr, say_en, do_fr, do_en,
  expect_type, correction_fr, correction_en, keywords
) VALUES
  ('L0-S0', 0, 0,
   'Cadrage du besoin', 'Frame the need',
   'Le métier veut « tout » pour hier. Il faut cadrer.',
   'Business wants everything yesterday. You need to frame it.',
   'Rédige 3 critères d''acceptation testables pour la story prioritaire.',
   'Write 3 testable acceptance criteria for the top story.',
   'text',
   'Des critères chiffrés et testables (Given/When/Then ou checklist mesurable).',
   'Measurable, testable criteria (Given/When/Then or a measurable checklist).',
   ARRAY['critere', 'acceptation', 'testable', 'given', 'when', 'then', 'mesure']),
  ('L0-S1', 0, 1,
   'Premier script SQL', 'First SQL script',
   'Les volumes bruts sont sales. On te demande un SELECT de contrôle.',
   'Raw volumes are messy. You need a control SELECT.',
   'Écris une requête SQL qui compte les lignes et filtre les NULL sur la clé métier.',
   'Write a SQL query that counts rows and filters NULLs on the business key.',
   'sql',
   'Un SELECT avec COUNT et un filtre IS NOT NULL (ou équivalent) sur la clé.',
   'A SELECT with COUNT and an IS NOT NULL filter (or equivalent) on the key.',
   ARRAY['select', 'count', 'null', 'where']),
  ('L1-S0', 1, 0,
   'Risque de livraison', 'Delivery risk',
   'Le jalon glisse. Le sponsor pousse le scope.',
   'The milestone is slipping. The sponsor pushes scope.',
   'Propose un arbitrage scope / délai / risque en 4–6 lignes.',
   'Propose a scope / schedule / risk trade-off in 4–6 lines.',
   'text',
   'Un arbitrage explicite : ce qui sort du scope, impact délai, risque résiduel.',
   'An explicit trade-off: what drops from scope, schedule impact, residual risk.',
   ARRAY['scope', 'delai', 'risque', 'jalon', 'arbitrage']),
  ('L1-S1', 1, 1,
   'Contrôle qualité Python', 'Python quality check',
   'Un CSV retail arrive avec des doublons. On attend un script de contrôle.',
   'A retail CSV arrives with duplicates. A control script is expected.',
   'Écris un extrait Python (pandas) qui détecte les doublons sur une clé.',
   'Write a Python (pandas) snippet that detects duplicates on a key.',
   'python',
   'import/pandas + duplicated() ou drop_duplicates / value_counts sur la clé.',
   'import/pandas + duplicated() or drop_duplicates / value_counts on the key.',
   ARRAY['import', 'pandas', 'duplicat', 'drop_duplicates', 'read_csv'])
ON CONFLICT (id) DO NOTHING;

-- QCM PM / gouvernance par étape

INSERT INTO step_questions (
  step_id, kind, question_fr, question_en,
  option_a_fr, option_a_en, option_b_fr, option_b_en, option_c_fr, option_c_en,
  correct_index, correction_fr, correction_en, framework_ref
) VALUES
  ('L0-S0', 'pm',
   'Avant de coder, que fais-tu en priorité ?',
   'Before coding, what do you do first?',
   'Lancer le développement pour montrer de la vélocité',
   'Start development to show velocity',
   'Clarifier critères d''acceptation et impacts avec le métier',
   'Clarify acceptance criteria and impacts with business',
   'Ajouter 10 stories pour couvrir tous les cas',
   'Add 10 stories to cover every case',
   1,
   'Sans critères testables, la recette échoue et le fireRisk monte.',
   'Without testable criteria, UAT fails and fireRisk rises.',
   'DoR'),
  ('L0-S0', 'gov',
   'Qui valide la définition du KPI « sinistre ouvert » ?',
   'Who validates the definition of the "open claim" KPI?',
   'Le développeur qui connaît la table',
   'The developer who knows the table',
   'Le data steward / métier propriétaire de la donnée',
   'The data steward / business data owner',
   'N''importe qui du COMEX',
   'Anyone from the exec committee',
   1,
   'La définition métier appartient au steward / owner, pas au codeur seul.',
   'The business definition belongs to the steward/owner, not the coder alone.',
   'DAMA'),
  ('L0-S1', 'pm',
   'Le SELECT de contrôle échoue en revue. Que fais-tu ?',
   'The control SELECT fails review. What do you do?',
   'Dire que « ça marche chez moi » et passer à autre chose',
   'Say "works on my machine" and move on',
   'Documenter l''écart, corriger la requête, rejouer la revue',
   'Document the gap, fix the query, re-run the review',
   'Masquer le problème jusqu''au COPIL',
   'Hide the issue until the steering committee',
   1,
   'Transparence + correction + revalidation : posture PM saine.',
   'Transparency + fix + revalidation: healthy PM posture.',
   'DoD'),
  ('L0-S1', 'gov',
   'Pourquoi filtrer les NULL sur la clé métier ?',
   'Why filter NULLs on the business key?',
   'Pour que la requête soit plus courte',
   'So the query is shorter',
   'Pour éviter de sous/surestimer les volumes et fausser les KPI',
   'To avoid under/over-counting volumes and skewing KPIs',
   'Parce que PostgreSQL l''impose toujours',
   'Because PostgreSQL always requires it',
   1,
   'Les NULL cassent jointures et agrégats → KPI faux.',
   'NULLs break joins and aggregates → wrong KPIs.',
   'Data quality'),
  ('L1-S0', 'pm',
   'Le sponsor ajoute du scope sans bouger la date. Meilleure réaction ?',
   'Sponsor adds scope without moving the date. Best reaction?',
   'Accepter tout pour « faire plaisir »',
   'Accept everything to please them',
   'Arbitrer : ce qui entre, ce qui sort, risque résiduel écrit',
   'Trade off: what comes in, what drops, residual risk written down',
   'Ignorer le sponsor',
   'Ignore the sponsor',
   1,
   'Un arbitrage explicite protège le jalon et la confiance COMEX.',
   'An explicit trade-off protects the milestone and exec trust.',
   'Risks'),
  ('L1-S0', 'gov',
   'Où enregistrer la décision d''arbitrage scope ?',
   'Where should the scope trade-off decision be recorded?',
   'Uniquement à l''oral en daily',
   'Only verbally in the daily',
   'Dans un ADR / compte-rendu accessible aux parties prenantes',
   'In an ADR / minutes accessible to stakeholders',
   'Dans un Slack privé',
   'In a private Slack thread',
   1,
   'Décision sans trace = rediscutée à chaque comité.',
   'Undocumented decisions get rediscussed in every meeting.',
   'ADR'),
  ('L1-S1', 'pm',
   'Les doublons bloquent le KPI. Priorité ?',
   'Duplicates block the KPI. Priority?',
   'Livrer le dashboard quand même',
   'Ship the dashboard anyway',
   'Corriger la qualité (clé, dédoublonnage) avant publication',
   'Fix quality (key, dedupe) before publishing',
   'Changer le KPI pour cacher le problème',
   'Change the KPI to hide the problem',
   1,
   'Publier un KPI faux détruit la confiance plus qu''un retard.',
   'Publishing a wrong KPI destroys trust more than a delay.',
   'DoD'),
  ('L1-S1', 'gov',
   'Qui doit être alerté si la règle de dédoublonnage change ?',
   'Who must be notified if the dedupe rule changes?',
   'Personne : c''est technique',
   'Nobody: it is technical',
   'Steward + consommateurs du KPI (métier / BI)',
   'Steward + KPI consumers (business / BI)',
   'Uniquement le stagiaire data',
   'Only the data intern',
   1,
   'Changement de règle = impact définition et usage : notifier les consommateurs.',
   'Rule change impacts definition and usage: notify consumers.',
   'Data lineage');

-- ─── Réunion COMEX (licenciement) ─────────────────────────────

INSERT INTO meetings (id, kind, title_fr, title_en, opening_fr, opening_en, closing_fr, closing_en) VALUES
  ('comex-fired', 'comex-fired',
   'COMEX — Fin de mission', 'Exec — End of assignment',
   'Le risque RH a atteint le seuil. Le COMEX clôt ta mission Mutualis.',
   'HR risk hit the threshold. The exec committee ends your Mutualis assignment.',
   'Tu es sacké. Relance une partie pour retenter.',
   'You are sacked. Start a new game to try again.')
ON CONFLICT (id) DO NOTHING;
