/** Exercices PM Game — format pédagogique évaluatif. */

import type { ToolId } from './tools'

export type ExerciseQuestionKind = 'mcq' | 'short'

export interface ExerciseQuestion {
  id: string
  prompt: string
  kind: ExerciseQuestionKind
  /** Options affichées (MCQ uniquement). */
  options?: string[]
  /** Réponses acceptées (normalisées côté moteur). */
  accept: string[]
  /** Correction expliquée si échec sur cette question. */
  explanation: string
}

export interface GuidedStep {
  title: string
  detail: string
}

export interface PracticeExercise {
  id: string
  tool: ToolId
  /** Bande de difficulté de base (1 = fondations, 5 = avancé). */
  level: number
  title: string
  /** Situation métier / projet. */
  context: string
  /** Ce que tu vas apprendre / produire. */
  description: string
  /** Tâches à réaliser (consigne). */
  tasks: string[]
  /** Guidage pas à pas. */
  steps: GuidedStep[]
  /** Piège / difficulté à signaler dans la consigne (affiché tel quel). */
  trap?: string
  /** Questions d’évaluation (scoring auto). */
  questions: ExerciseQuestion[]
  /** Correction globale expliquée (si échec global). */
  modelSolution: string
}

export const PRACTICE_EXERCISES: PracticeExercise[] = [
  // —— Confluence (cadrage doc) ——
  {
    id: 'conf-charter-1',
    tool: 'confluence',
    level: 1,
    title: 'Charte produit data (Data Product Charter)',
    context:
      'Une banque mutualiste lance un « Client 360 » pour les conseillers. Le sponsor veut tout ; l’équipe data est de 3 personnes.',
    description:
      'Tu structures une page Confluence de cadrage pour aligner métier et data avant tout développement.',
    tasks: [
      'Rédiger le problème métier en 2–3 phrases',
      'Lister max 3 KPI de succès',
      'Définir le hors-scope explicite',
      'Identifier owner produit et steward data',
    ],
    trap:
      'Au-delà de 3 KPI, le MVP se dilue : le sponsor « veut tout » et plus rien n’est Done.',
    steps: [
      {
        title: 'Page & template',
        detail:
          'Crée une page « Client 360 — Charter ». Sections : Problème, Users, KPI, Hors-scope, Risques, Décisions.',
      },
      {
        title: 'Problème',
        detail:
          'Formule : Qui souffre ? De quoi ? Impact mesurable. Ex. : « Les conseillers ouvrent 4 systèmes pour un même client → temps de préparation RDV ×2 ».',
      },
      {
        title: 'KPI (max 3)',
        detail:
          'Choisis des indicateurs actionnables (ex. % fiches complètes, temps moyen préparation RDV, NPS usage outil). Évite les vanity metrics.',
      },
      {
        title: 'Hors-scope',
        detail:
          'Liste ce qui n’est PAS dans le MVP (ex. scoring crédit temps réel, app mobile). Cela protège le délai.',
      },
    ],
    questions: [
      {
        id: 'n1q1',
        prompt: 'Combien de KPI de succès recommandés au maximum dans une charte MVP ?',
        kind: 'mcq',
        options: ['1', '3', '10', 'Autant que le sponsor veut'],
        accept: ['3'],
        explanation:
          '3 KPI max force la priorisation. Au-delà, le MVP se dilue et on ne sait plus ce qui est « Done ».',
      },
      {
        id: 'n1q2',
        prompt: 'Le hors-scope sert principalement à…',
        kind: 'mcq',
        options: [
          'Remplir une case qualité',
          'Protéger le délai et clarifier les attentes',
          'Lister toutes les idées futures',
          'Remplacer le backlog Jira',
        ],
        accept: ['Protéger le délai et clarifier les attentes'],
        explanation:
          'Le hors-scope aligne le sponsor : ce qui n’est pas livré dans le MVP, pour éviter le scope creep.',
      },
      {
        id: 'n1q3',
        prompt: 'Mot-clé d’une bonne formulation de problème (un mot) :',
        kind: 'short',
        accept: ['impact', 'mesurable', 'utilisateur', 'users', 'douleur', 'pain'],
        explanation:
          'Un bon problème cite l’utilisateur et un impact mesurable (temps, coût, risque, qualité).',
      },
    ],
    modelSolution:
      'Charte type : Problème (conseillers multi-systèmes, temps RDV ×2) · Users (conseillers, compliance) · KPI (temps prépa, % fiches complètes, adoption) · Hors-scope (scoring temps réel, mobile) · Owner produit + steward data nommés · Risques (qualité CRM, accès RGPD).',
  },

  // —— Jira (backlog delivery) ——
  {
    id: 'jira-backlog-charter-2',
    tool: 'jira',
    level: 2,
    title: 'Backlog Jira — data product lié à la charte',
    context:
      'Après la charte Client 360, le PO data veut un backlog vivant partagé avec data engineers et analystes.',
    description:
      'Tu structures le backlog Jira (epics / stories) pour suivre les items du produit data.',
    tasks: [
      'Définir les champs essentiels (statut, priorité, KPI, owner)',
      'Proposer 3 vues (board / sprint / roadmap)',
      'Lier chaque item à un KPI de la charte',
    ],
    trap:
      'Un item de backlog sans lien vers un KPI charter est souvent du travail décoratif — hors MVP.',
    steps: [
      {
        title: 'Structure',
        detail:
          'Epic = outcome charter. Stories INVEST. Labels : KPI, phase (ingest/transform/expose), outil.',
      },
      {
        title: 'Vues',
        detail:
          'Board statut (flux), filtre sprint, timeline/roadmap pour le reporting direction.',
      },
      {
        title: 'Règle',
        detail: 'Pas de story sans lien vers un KPI de la charte — sinon hors MVP.',
      },
    ],
    questions: [
      {
        id: 'n2q1',
        prompt: 'Propriété la plus critique pour éviter le travail « décoratif » :',
        kind: 'mcq',
        options: ['Couleur', 'KPI lié', 'Emoji', 'Cover image'],
        accept: ['KPI lié'],
        explanation:
          'Si un item ne contribue à aucun KPI charter, il n’a pas sa place dans le MVP.',
      },
      {
        id: 'n2q2',
        prompt: 'Nomme une vue utile pour le daily data (un mot : board / table / timeline) :',
        kind: 'short',
        accept: ['board', 'kanban', 'table'],
        explanation:
          'Un board (ou table sprint) montre le flux du jour ; la timeline sert plutôt au reporting direction.',
      },
    ],
    modelSolution:
      'Jira : Epics liés KPI charter · Stories avec AC · Labels outil/phase · Board statut + filtre sprint + roadmap. Règle : pas d’item sans KPI charter.',
  },

  // —— Confluence ——
  {
    id: 'conf-adr-1',
    tool: 'confluence',
    level: 1,
    title: 'ADR — BigQuery vs Cloud SQL (mart finance)',
    context:
      'Le mart finance doit servir 40 analystes (lecture lourde) et 2 apps opérationnelles (écriture transactionnelle légère).',
    description:
      'Tu rédiges un Architecture Decision Record (ADR) pour trancher le stockage analytique.',
    tasks: [
      'Rédiger Contexte, Options, Décision, Conséquences',
      'Comparer BigQuery et Cloud SQL sur charge analytique',
      'Documenter les trade-offs (coût, latence, ops)',
    ],
    trap:
      'Choisir Cloud SQL « pour tout » saturera sous 40 analystes en scan large — sépare OLTP et analytique.',
    steps: [
      {
        title: 'Template ADR',
        detail:
          'Titre, Statut (Proposed/Accepted), Contexte, Options (avec critères), Décision, Conséquences (+/−), Liens Jira.',
      },
      {
        title: 'Critères',
        detail:
          'Volume scan, concurrence lecteurs, coût €/TB, besoin transactions ACID, compétences équipe.',
      },
      {
        title: 'Décision typique',
        detail:
          'Analytique large → BigQuery ; OLTP / faible latence transactionnelle → Cloud SQL. Souvent les deux (OLTP → export → BQ).',
      },
    ],
    questions: [
      {
        id: 'c1q1',
        prompt: 'Pour 40 analystes scannant des historiques multi-années, l’option la plus adaptée est :',
        kind: 'mcq',
        options: ['Cloud SQL seul', 'BigQuery (entrepôt)', 'CSV sur laptop', 'Redis'],
        accept: ['BigQuery (entrepôt)'],
        explanation:
          'BigQuery est conçu pour l’analytique à large scan ; Cloud SQL sature vite sous reporting concurrent.',
      },
      {
        id: 'c1q2',
        prompt: 'Les 4 sections minimales d’un ADR (séparées par des virgules) :',
        kind: 'short',
        accept: [
          'contexte, options, décision, conséquences',
          'contexte, options, decision, consequences',
        ],
        explanation:
          'ADR standard : Contexte → Options → Décision → Conséquences (positives et négatives).',
      },
    ],
    modelSolution:
      'Décision type : Cloud SQL = source OLTP ; BigQuery = mart analytique. Conséquences : + perf analytique, + coût scan à maîtriser (partition/cluster) ; − latence near-real-time si batch uniquement.',
  },
  {
    id: 'conf-runbook-2',
    tool: 'confluence',
    level: 2,
    title: 'Runbook incident — pipeline finance en retard',
    context:
      'Le DAG finance a 3 incidents « late » ce mois. Les ops demandent un runbook Confluence actionnable à 3 h du matin.',
    description:
      'Tu rédiges un runbook de diagnostic et remédiation pour un pipeline batch en retard.',
    tasks: [
      'Définir symptômes, checks, actions, escalade',
      'Inclure les liens Airflow / BQ / alerting',
      'Prévoir un critère de fin d’incident',
    ],
    trap:
      'Sans ordre de checks (Airflow → GCS → BQ), l’astreinte refactorise dbt à 3 h du matin au lieu de relancer la bonne tâche.',
    steps: [
      {
        title: 'Structure',
        detail:
          'Symptômes → Vérifications (ordre) → Actions immédiates → Rollback → Escalade → Post-mortem.',
      },
      {
        title: 'Checks',
        detail:
          '1) DAG state Airflow 2) Sensor fichier GCS 3) Slot/erreurs BQ 4) Volume vs J-1 5) Alerte fausse positive.',
      },
      {
        title: 'Done incident',
        detail:
          'Données J disponibles avant SLA métier + alerte résolue + ticket Jira créé pour cause racine.',
      },
    ],
    questions: [
      {
        id: 'c2q1',
        prompt: 'Première vérif utile quand un batch est « late » :',
        kind: 'mcq',
        options: [
          'Réécrire tout le modèle dbt',
          'État du DAG / tâche en échec',
          'Changer le KPI métier',
          'Supprimer le partitionnement',
        ],
        accept: ['État du DAG / tâche en échec'],
        explanation:
          'On commence par localiser où ça bloque (orchestrateur), pas par refactorer le modèle.',
      },
      {
        id: 'c2q2',
        prompt: 'Un runbook doit toujours inclure (un mot) :',
        kind: 'short',
        accept: ['escalade', 'rollback', 'symptômes', 'symptomes', 'checks'],
        explanation:
          'Sans escalade / critères de fin / checks ordonnés, le runbook n’est pas opérable la nuit.',
      },
    ],
    modelSolution:
      'Runbook : Symptômes (SLA manqué) → Checks Airflow/GCS/BQ → Relance ciblée ou skip sensor si fichier OK → Escalade data eng on-call → Ticket RCA. Fin = données OK + alerte clear.',
  },

  // —— Jira ——
  {
    id: 'jira-epic-1',
    tool: 'jira',
    level: 1,
    title: 'Découper l’epic « Mart clients »',
    context:
      'Epic Jira : « Livrer le mart clients pour le dashboard rétention ». L’équipe mélange analyse, dbt et Power BI dans une seule story.',
    description:
      'Tu découpes en stories INVEST avec critères d’acceptation testables et DoD data.',
    tasks: [
      'Proposer 5 stories testables',
      'Ajouter critères d’acceptation par story',
      'Définir une Definition of Done data commune',
    ],
    trap:
      'Une seule story « livrer tout le mart » viole Small/Testable : impossible à demo ni à refuser proprement.',
    steps: [
      {
        title: 'Découpe verticale',
        detail:
          'Ex. : staging CRM → tests DQ → modèle dim_customer → mart rétention → dataset Power BI → UAT métier.',
      },
      {
        title: 'INVEST',
        detail:
          'Independent, Negotiable, Valuable, Estimable, Small, Testable. Une story = une démo possible.',
      },
      {
        title: 'DoD data',
        detail:
          'Code review, tests dbt passent, doc/lineage à jour, données UAT validées, monitoring basique.',
      },
    ],
    questions: [
      {
        id: 'j1q1',
        prompt: 'Une story « Faire tout le mart clients » viole surtout quel critère INVEST ?',
        kind: 'mcq',
        options: ['Valuable', 'Small / Testable', 'Negotiable', 'Independent'],
        accept: ['Small / Testable'],
        explanation:
          'Trop grosse = non Small, difficilement Testable en une itération.',
      },
      {
        id: 'j1q2',
        prompt: 'Sigle des critères de qualité d’une user story :',
        kind: 'short',
        accept: ['invest'],
        explanation: 'INVEST = Independent, Negotiable, Valuable, Estimable, Small, Testable.',
      },
    ],
    modelSolution:
      '5 stories : 1) staging CRM + tests not_null/unique 2) dim_customer 3) fct_retention_daily 4) exposition BI 5) UAT KPI. DoD : tests verts, doc, review, UAT sign-off.',
  },
  {
    id: 'jira-dod-2',
    tool: 'jira',
    level: 2,
    title: 'Definition of Done data & dépendances',
    context:
      'Deux équipes (ingestion et BI) se bloquent mutuellement. Les tickets n’expriment pas les dépendances.',
    description:
      'Tu renforces le DoD et le graphe de dépendances Jira pour fluidifier le flux.',
    tasks: [
      'Écrire un DoD data en 5 bullets',
      'Modéliser les liens « blocks / is blocked by »',
      'Proposer un champ « Data contract » sur les stories d’interface',
    ],
    trap:
      'Sans liens « blocks / is blocked by », la BI démarre avant le mart et tout le monde « attend l’autre » en silence.',
    steps: [
      {
        title: 'DoD',
        detail:
          'Tests auto, qualité (seuils), documentation, droits d’accès, observabilité (alerte volume/nulls).',
      },
      {
        title: 'Dépendances',
        detail:
          'Story BI « is blocked by » mart dbt ; epic ingestion « blocks » exposition. Visible sur le board.',
      },
      {
        title: 'Data contract',
        detail:
          'Schéma colonnes, SLA fraîcheur, owner — attaché au ticket d’interface entre équipes.',
      },
    ],
    questions: [
      {
        id: 'j2q1',
        prompt: 'Sans lien de dépendance Jira, le risque principal est :',
        kind: 'mcq',
        options: [
          'Trop de documentation',
          'Travail parallèle sur une interface non prête',
          'Trop de tests',
          'Trop de KPI',
        ],
        accept: ['Travail parallèle sur une interface non prête'],
        explanation:
          'Les dépendances explicites évitent que la BI construise sur un mart encore instable.',
      },
      {
        id: 'j2q2',
        prompt: 'Élément typique d’un data contract (un mot : schéma / sla / owner) :',
        kind: 'short',
        accept: ['schéma', 'schema', 'sla', 'owner', 'fraîcheur', 'fraicheur'],
        explanation: 'Un contrat data fixe au minimum schéma, fraîcheur (SLA) et ownership.',
      },
    ],
    modelSolution:
      'DoD : tests, seuils DQ, docs, IAM, alerte. Dépendances Jira visibles. Contracts sur tickets d’interface (schéma + SLA + owner).',
  },

  // —— SQL ——
  {
    id: 'sql-dupes-1',
    tool: 'sql',
    level: 1,
    title: 'Détecter les doublons clients',
    context:
      'Le CRM contient des doublons (même email, sociétés orthographiées différemment). Le mart clients surestime le nombre de clients uniques.',
    description:
      'Tu écris une requête SQL de détection de doublons et un taux de duplication.',
    tasks: [
      'Compter les groupes email en doublon',
      'Calculer un taux de duplication',
      'Traiter le cas des email NULL',
    ],
    trap:
      'Les sociétés ne sont pas orthographiées à l’identique (« Acme Retail » vs « ACME Retail », espaces en trop) — normalise avec LOWER/TRIM avant de conclure à un doublon sur le nom seul.',
    steps: [
      {
        title: 'CTE groupes',
        detail:
          'WITH d AS (SELECT lower(trim(email)) AS e, COUNT(*) c FROM clients GROUP BY 1 HAVING COUNT(*) > 1)',
      },
      {
        title: 'Taux',
        detail:
          'Taux ≈ (SUM(c) des doublons) / COUNT(*) total — ou % de lignes appartenant à un groupe > 1.',
      },
      {
        title: 'NULL',
        detail:
          'Exclure email IS NULL du matching, ou les traiter à part (autre règle : SIRET + nom).',
      },
    ],
    questions: [
      {
        id: 's1q1',
        prompt: 'Clause SQL pour ne garder que les groupes avec plus d’une ligne :',
        kind: 'mcq',
        options: ['WHERE COUNT(*) > 1', 'HAVING COUNT(*) > 1', 'LIMIT 2', 'ORDER BY COUNT(*)'],
        accept: ['HAVING COUNT(*) > 1'],
        explanation:
          'HAVING filtre après agrégation ; WHERE ne peut pas utiliser COUNT(*) ainsi.',
      },
      {
        id: 's1q2',
        prompt: 'Mot-clé pour une sous-requête nommée réutilisable :',
        kind: 'short',
        accept: ['with', 'cte'],
        explanation: 'WITH … AS (…) définit une CTE (Common Table Expression).',
      },
      {
        id: 's1q3',
        prompt: 'Avant de matcher sur email, on applique souvent :',
        kind: 'mcq',
        options: ['LOWER + TRIM', 'MAX uniquement', 'DROP TABLE', 'FULL OUTER JOIN systématique'],
        accept: ['LOWER + TRIM'],
        explanation: 'Normaliser (casse, espaces) évite les faux « uniques ».',
      },
    ],
    modelSolution:
      `WITH norm AS (
  SELECT id, NULLIF(LOWER(TRIM(email)), '') AS email_n
  FROM clients
),
dup AS (
  SELECT email_n, COUNT(*) AS c
  FROM norm WHERE email_n IS NOT NULL
  GROUP BY 1 HAVING COUNT(*) > 1
)
SELECT
  (SELECT SUM(c) FROM dup) * 1.0 / (SELECT COUNT(*) FROM norm) AS duplicate_row_rate;`,
  },
  {
    id: 'sql-window-2',
    tool: 'sql',
    level: 2,
    title: 'Window function — dernier statut par contrat',
    context:
      'Table `contract_events(contract_id, event_ts, status)`. Tu dois exposer le statut courant de chaque contrat.',
    description:
      'Tu utilises une fonction de fenêtrage pour dédupliquer sur le dernier événement.',
    tasks: [
      'Écrire une requête avec ROW_NUMBER() PARTITION BY contract_id',
      'Filtrer rn = 1',
      'Expliquer pourquoi ORDER BY event_ts DESC',
    ],
    trap:
      'Sans ORDER BY event_ts DESC dans la fenêtre, ROW_NUMBER() te donne une ligne arbitraire — pas forcément le dernier statut.',
    steps: [
      {
        title: 'Partition',
        detail: 'ROW_NUMBER() OVER (PARTITION BY contract_id ORDER BY event_ts DESC) AS rn',
      },
      {
        title: 'Filtre',
        detail: 'Envelopper en CTE/sous-requête puis WHERE rn = 1.',
      },
      {
        title: 'Égalité de timestamps',
        detail: 'Ajouter une clé de tie-break (event_id) si deux events ont le même ts.',
      },
    ],
    questions: [
      {
        id: 's2q1',
        prompt: 'Pour le « dernier » événement, ORDER BY event_ts doit être :',
        kind: 'mcq',
        options: ['ASC', 'DESC', 'Inutile', 'RANDOM'],
        accept: ['DESC'],
        explanation: 'DESC met le plus récent en rn = 1.',
      },
      {
        id: 's2q2',
        prompt: 'Nom de la fonction qui numérote les lignes dans une partition :',
        kind: 'short',
        accept: ['row_number', 'row_number()', 'row number'],
        explanation: 'ROW_NUMBER() attribue 1..n dans chaque PARTITION.',
      },
    ],
    modelSolution:
      `WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY contract_id ORDER BY event_ts DESC, event_id DESC
  ) AS rn
  FROM contract_events
)
SELECT * FROM ranked WHERE rn = 1;`,
  },

  // —— Python ——
  {
    id: 'py-etl-1',
    tool: 'python',
    level: 1,
    title: 'Script CSV → clean → Parquet',
    context:
      'Fichiers CSV quotidiens « landing » à nettoyer avant chargement BigQuery. Pas encore d’orchestrateur lourd.',
    description:
      'Tu conçois un script Python idempotent : lecture, validation schéma, écriture Parquet, logs d’erreur.',
    tasks: [
      'Valider les colonnes attendues',
      'Logger les lignes invalides sans faire planter tout le run',
      'Écrire un output déterministe (même input → même output)',
    ],
    trap:
      'Un append aveugle sur le même fichier/partition du jour crée des doublons au rejeu — overwrite de la partition, pas append.',
    steps: [
      {
        title: 'Schéma',
        detail:
          'Définis EXPECTED_COLS ; si manquantes → fail fast. Types : parse dates, coerce numériques.',
      },
      {
        title: 'Lignes sales',
        detail:
          'Sépare valid vs reject (fichier _rejects.csv + compteur). Ne silence pas les erreurs.',
      },
      {
        title: 'Idempotence',
        detail:
          'Écris sous un chemin daté/partitionné ; overwrite de la partition du jour, pas append aveugle.',
      },
    ],
    questions: [
      {
        id: 'p1q1',
        prompt: 'Comportement sain si une colonne obligatoire manque :',
        kind: 'mcq',
        options: [
          'Ignorer et continuer',
          'Fail fast avec message clair',
          'Créer la colonne à null sans log',
          'Supprimer le fichier source',
        ],
        accept: ['Fail fast avec message clair'],
        explanation:
          'Un schéma cassé = incident data. Mieux vaut échouer tôt que charger n’importe quoi.',
      },
      {
        id: 'p1q2',
        prompt: 'Mot décrivant « même input ⇒ même output / rejouable » :',
        kind: 'short',
        accept: ['idempotent', 'idempotence', 'déterministe', 'deterministe'],
        explanation:
          'Idempotence / déterminisme : rejouer le job du jour ne duplique pas ni n’altère au hasard.',
      },
    ],
    modelSolution:
      'read_csv → validate columns → type coerce → split rejects → to_parquet(partition date) overwrite → log metrics (rows_in, rows_out, rejects).',
  },
  {
    id: 'py-test-2',
    tool: 'python',
    level: 2,
    title: 'Tests unitaires data (pandas)',
    context:
      'Une fonction `normalize_iban` est utilisée dans 3 pipelines. Un bug silencieux a corrompu des IBAN.',
    description:
      'Tu poses des tests unitaires ciblés sur les cas limites (espaces, casse, longueur).',
    tasks: [
      'Lister 4 cas de test (happy path + edge)',
      'Choisir assert sur sortie attendue',
      'Décider fail vs reject pour entrée irrécupérable',
    ],
    trap:
      'Normaliser un IBAN invalide « pour que ça passe » corrompt 3 pipelines — better reject/raise que inventer.',
    steps: [
      {
        title: 'Cas',
        detail:
          'OK ; espaces internes ; lowercase ; trop court ; None/NaN ; caractères interdits.',
      },
      {
        title: 'Policy',
        detail:
          'Normalisable → clean ; irrécupérable → raise ou flag reject selon contrat (ne pas « inventer »).',
      },
      {
        title: 'CI',
        detail: 'pytest dans le pipeline ; bloquer le merge si tests data red.',
      },
    ],
    questions: [
      {
        id: 'p2q1',
        prompt: 'Un test unitaire data doit surtout vérifier :',
        kind: 'mcq',
        options: [
          'La couleur du dashboard',
          'Des cas limites et la politique d’erreur',
          'Le salaire de l’équipe',
          'Le nom du bucket uniquement',
        ],
        accept: ['Des cas limites et la politique d’erreur'],
        explanation:
          'Les bugs data vivent dans les edge cases et le traitement des entrées invalides.',
      },
      {
        id: 'p2q2',
        prompt: 'Framework de test Python le plus courant ici :',
        kind: 'short',
        accept: ['pytest'],
        explanation: 'pytest est le standard de fait pour les tests unitaires Python.',
      },
    ],
    modelSolution:
      'Tests : IBAN valide ; avec espaces → compacté ; lower → upper ; length != attendu → reject/raise ; None → reject. Branch CI rouge = pas de merge.',
  },

  // —— GCS ——
  {
    id: 'gcs-layout-1',
    tool: 'gcs',
    level: 1,
    title: 'Arborescence landing / raw / curated',
    context:
      'Nouveau projet GCP : fichiers partenaires quotidiens. Personne n’a standardisé les préfixes ni la rétention.',
    description:
      'Tu proposes une organisation de buckets/préfixes et une politique de lifecycle.',
    tasks: [
      'Définir préfixes landing, raw, curated',
      'Proposer rétention par zone',
      'Appliquer le principe du moindre privilège IAM',
    ],
    trap:
      'Mélanger landing et curated dans le même préfixe sans dt= rend les sensors Airflow et la rétention impossibles à industrialiser.',
    steps: [
      {
        title: 'Zones',
        detail:
          'landing/ (drop tel quel) → raw/ (archivage immuable) → curated/ (fichiers prêts modèle).',
      },
      {
        title: 'Préfixe daté',
        detail: '…/dt=YYYY-MM-DD/… pour partitionner et rejouer un jour.',
      },
      {
        title: 'Lifecycle',
        detail:
          'Landing courte (ex. 7–14 j) ; raw longue ; curated selon besoin mart. Nearline/Coldline si besoin.',
      },
    ],
    questions: [
      {
        id: 'g1q1',
        prompt: 'Zone où l’on dépose le fichier partenaire sans transformation :',
        kind: 'mcq',
        options: ['curated', 'landing', 'mart', 'serving'],
        accept: ['landing'],
        explanation: 'Landing = drop zone brute ; raw archive ; curated = prêt conso.',
      },
      {
        id: 'g1q2',
        prompt: 'Pattern de préfixe pour rejouer un jour (mot-clé) :',
        kind: 'short',
        accept: ['dt=', 'partition', 'date', 'dt', 'yyyy-mm-dd'],
        explanation: 'Un préfixe daté (ex. dt=2026-07-22/) permet rejeu et lifecycle ciblés.',
      },
    ],
    modelSolution:
      'gs://proj-landing/partner/dt=… · gs://proj-raw/… rétention longue · gs://proj-curated/… IAM : writers landing ≠ readers BI curated.',
  },

  // —— Cloud SQL ——
  {
    id: 'csql-incr-1',
    tool: 'cloudsql',
    level: 1,
    title: 'Extraction incrémentale (watermark)',
    context:
      'Une table OLTP `orders` (updated_at) doit être extraite chaque nuit vers GCS puis BigQuery, sans full scan quotidien.',
    description:
      'Tu conçois une extraction incrémentale basée sur un watermark, avec fenêtre de rejeu.',
    tasks: [
      'Définir le watermark updated_at',
      'Prévoir une fenêtre de lookback (late arriving)',
      'Estimer l’impact charge sur l’instance',
    ],
    trap:
      'Sans fenêtre de lookback, les updates tardives (updated_at après le watermark) ne remontent jamais dans BigQuery.',
    steps: [
      {
        title: 'Watermark',
        detail:
          'Stocker last_success_ts ; SELECT * WHERE updated_at >= last_success_ts - lookback.',
      },
      {
        title: 'Lookback',
        detail:
          'Ex. 2–3 jours pour rattraper les updates tardives ; fusion (merge) en aval sur clé primaire.',
      },
      {
        title: 'Charge',
        detail:
          'Index sur updated_at ; extractions hors pic ; éviter SELECT * massif sans filtre.',
      },
    ],
    questions: [
      {
        id: 'cs1q1',
        prompt: 'Colonne typique pour l’incrémental :',
        kind: 'mcq',
        options: ['updated_at', 'couleur_ui', 'nom_fichier_pdf', 'random_uuid uniquement'],
        accept: ['updated_at'],
        explanation:
          'updated_at (ou équivalent) permet de ne lire que le delta depuis le dernier succès.',
      },
      {
        id: 'cs1q2',
        prompt: 'Nom de la borne temporelle mémorisée entre deux runs :',
        kind: 'short',
        accept: ['watermark', 'curseur', 'cursor', 'high water mark', 'highwatermark'],
        explanation: 'Le watermark (high-water mark) mémorise jusqu’où l’extraction a progressé.',
      },
    ],
    modelSolution:
      'Watermark last_ts + lookback 48–72h → extract → fichiers dt= → merge BQ sur order_id. Index(updated_at). Monitor rows_extracted vs baseline.',
  },

  // —— BigQuery ——
  {
    id: 'bq-part-1',
    tool: 'bigquery',
    level: 1,
    title: 'Partitionner et clustériser events',
    context:
      'Table `events` (event_date, user_id, event_name) coûte trop cher : les requêtes scannent toute l’historique.',
    description:
      'Tu choisis partitionnement et clustering pour réduire les bytes scannés.',
    tasks: [
      'Choisir la partition (DAY sur event_date)',
      'Choisir le clustering (user_id / event_name)',
      'Estimer l’effet sur le coût d’une requête filtrée sur 7 jours',
    ],
    trap:
      'Un CAST/FORMAT sur la colonne de partition dans le WHERE empêche le pruning → tu rescannes toute l’historique.',
    steps: [
      {
        title: 'Partition',
        detail: 'PARTITION BY DATE(event_date) ou colonne DATE — filtre date = partition prune.',
      },
      {
        title: 'Cluster',
        detail:
          'CLUSTER BY user_id, event_name pour accélérer les filtres/joins fréquents intra-partition.',
      },
      {
        title: 'Coût',
        detail:
          'Requêter 7 jours sur 2 ans ≪ full table si le filtre date est bien poussé (pas de wrap qui empêche le prune).',
      },
    ],
    questions: [
      {
        id: 'b1q1',
        prompt: 'Pour des events temporels, partition typique :',
        kind: 'mcq',
        options: ['DAY sur la date d’événement', 'Par nom de dashboard', 'Par couleur', 'Aucune'],
        accept: ['DAY sur la date d’événement'],
        explanation: 'Partition DAY + filtre date = prune = moins de bytes facturés.',
      },
      {
        id: 'b1q2',
        prompt: 'Mot pour « n’ouvrir que les partitions utiles » :',
        kind: 'short',
        accept: ['prune', 'pruning', 'partition prune', 'partition pruning'],
        explanation: 'Le partition pruning évite de scanner les partitions hors filtre.',
      },
    ],
    modelSolution:
      'CREATE TABLE … PARTITION BY event_date CLUSTER BY user_id, event_name. Toujours filtrer event_date. Vérifier bytes processed dans Job History.',
  },
  {
    id: 'bq-cost-2',
    tool: 'bigquery',
    level: 2,
    title: 'Maîtriser le coût d’une requête',
    context:
      'Un dashboard Looker lance un SELECT * sur 3 ans à chaque ouverture. Facture BQ en hausse.',
    description:
      'Tu proposes 3 leviers concrets pour réduire le coût sans perdre le besoin métier.',
    tasks: [
      'Remplacer SELECT *',
      'Matérialiser un agrégat / table summary',
      'Restreindre la fenêtre temporelle par défaut',
    ],
    trap:
      'Un SELECT * sur 3 ans à chaque ouverture de dashboard Looker fait exploser la facture — filtre date + agrégat d’abord.',
    steps: [
      {
        title: 'Colonnes',
        detail: 'Projeter uniquement les colonnes utiles ; éviter SELECT *.',
      },
      {
        title: 'Pré-agrégation',
        detail: 'Table daily_stats mise à jour par dbt ; le dashboard lit l’agrégat.',
      },
      {
        title: 'Défaut UI',
        detail: 'Filtre date = 30 derniers jours par défaut ; 3 ans en opt-in.',
      },
    ],
    questions: [
      {
        id: 'b2q1',
        prompt: 'Levier n°1 anti-coût sur un dashboard :',
        kind: 'mcq',
        options: [
          'SELECT * sur tout l’historique',
          'Filtre date + colonnes utiles / agrégat',
          'Désactiver le partitionnement',
          'Dupliquer la table 10 fois',
        ],
        accept: ['Filtre date + colonnes utiles / agrégat'],
        explanation:
          'Moins de bytes scannés = moins de coût on-demand (et moins de latence).',
      },
      {
        id: 'b2q2',
        prompt: 'Ce que BigQuery facture principalement en on-demand (idée) :',
        kind: 'short',
        accept: ['bytes', 'données scannées', 'data scanned', 'scan', 'octets', 'tb'],
        explanation: 'Modèle on-demand ≈ volume de données scannées (bytes processed).',
      },
    ],
    modelSolution:
      'Stop SELECT * · partition prune · table agrégée dbt · filtre 30j défaut · monitorer slots/bytes dans INFORMATION_SCHEMA / Job history.',
  },

  // —— dbt ——
  {
    id: 'dbt-layers-1',
    tool: 'dbt',
    level: 1,
    title: 'Staging → intermediate → mart (active_users)',
    context:
      'Besoin d’un mart `active_users` pour la rétention. Aujourd’hui des SQL ad hoc non versionnés.',
    description:
      'Tu poses les couches dbt, naming, tests et documentation minimale.',
    tasks: [
      'Nommer staging / intermediate / mart',
      'Ajouter tests unique / not_null sur la clé',
      'Documenter le modèle mart',
    ],
    trap:
      'Mettre la logique métier directement dans le staging casse la règle 1:1 source et rend les tests/reuse impossibles.',
    steps: [
      {
        title: 'Couches',
        detail:
          'stg_app__users (clean 1:1 source) → int_users_activity → mart_active_users (conso BI).',
      },
      {
        title: 'Tests',
        detail: 'unique + not_null sur user_id dans le mart ; relations si FK.',
      },
      {
        title: 'Docs',
        detail: 'description + columns dans schema.yml ; dbt docs generate.',
      },
    ],
    questions: [
      {
        id: 'd1q1',
        prompt: 'Couche 1:1 avec la source, nettoyage léger :',
        kind: 'mcq',
        options: ['mart', 'staging', 'exposition Power BI', 'landing GCS'],
        accept: ['staging'],
        explanation: 'Staging = miroir propre de la source ; mart = modèle métier conso.',
      },
      {
        id: 'd1q2',
        prompt: 'Deux tests dbt de base sur une clé primaire (séparés par /) :',
        kind: 'short',
        accept: ['unique/not_null', 'not_null/unique', 'unique / not_null'],
        explanation: 'unique et not_null sont le socle de confiance sur une PK.',
      },
    ],
    modelSolution:
      'stg_ → int_ → fct_/dim_ ou mart_ · tests unique/not_null · schema.yml documenté · CI dbt build sur PR.',
  },
  {
    id: 'dbt-tests-2',
    tool: 'dbt',
    level: 2,
    title: 'Tests de qualité et seuils',
    context:
      'Le mart finance a passé un `dbt run` vert mais le KPI CA est faux (doublons de factures).',
    description:
      'Tu renforces les tests au-delà du simple not_null pour capturer les régressions métier.',
    tasks: [
      'Ajouter un test d’unicité composite (invoice_id + line_id)',
      'Proposer un test de volumétrie (row count vs J-1)',
      'Décider warn vs error sur le seuil',
    ],
    trap:
      'Un `dbt run` vert ne garantit rien sur le KPI : sans test d’unicité métier, les doublons de factures passent inaperçus.',
    steps: [
      {
        title: 'Unicité métier',
        detail: 'unique combination of columns — pas seulement une colonne technique.',
      },
      {
        title: 'Volumétrie',
        detail: 'dbt_utils / custom test : |rows_today - rows_yesterday| / rows_yesterday < 20%.',
      },
      {
        title: 'Sévérité',
        detail: 'Error bloque le merge/prod ; warn alerte sans stopper si bruit connu.',
      },
    ],
    questions: [
      {
        id: 'd2q1',
        prompt: 'Un `dbt run` réussi garantit-il la justesse du KPI métier ?',
        kind: 'mcq',
        options: ['Oui toujours', 'Non — il faut des tests/assertions métier', 'Oui si SQL compile', 'Oui si pas de warning'],
        accept: ['Non — il faut des tests/assertions métier'],
        explanation:
          'Run = modèles construits. La justesse KPI demande tests d’unicité, seuils, réconciliations.',
      },
      {
        id: 'd2q2',
        prompt: 'Sévérité qui doit bloquer la prod sur doublons de factures :',
        kind: 'short',
        accept: ['error', 'erreur', 'fail'],
        explanation: 'Doublons finance = error, pas un simple warn cosmétique.',
      },
    ],
    modelSolution:
      'unique(invoice_id, line_id) error · réconciliation CA vs source · volumétrie warn/error selon contrat · CI dbt test obligatoire.',
  },

  // —— Spark ——
  {
    id: 'spark-skew-1',
    tool: 'spark',
    level: 2,
    title: 'Join skew — stratégie de repartition',
    context:
      'Un join clients×transactions timeout : une clé « client_id = 0 / unknown » concentre 40 % des lignes (data skew).',
    description:
      'Tu choisis une stratégie anti-skew (salting ou broadcast) et tu justifie le choix.',
    tasks: [
      'Diagnostiquer le skew (skew hint / Spark UI)',
      'Proposer salting OU broadcast selon tailles',
      'Fixer un nombre de partitions cohérent',
    ],
    trap:
      'La clé « client_id = 0 / unknown » peut concentrer 40 % des lignes — un join naïf timeout alors que le reste du cluster a l’air idle.',
    steps: [
      {
        title: 'Diag',
        detail: 'Spark UI : tâches très longues sur peu de partitions ; compter top clés.',
      },
      {
        title: 'Broadcast',
        detail: 'Si une table est petite → broadcast join (évite shuffle massif).',
      },
      {
        title: 'Salting',
        detail:
          'Sinon : ajouter un sel sur les hot keys pour éclater la partition, puis agrégation finale.',
      },
    ],
    questions: [
      {
        id: 'sp1q1',
        prompt: 'Si la table dimension est petite, stratégie préférée :',
        kind: 'mcq',
        options: ['Broadcast join', 'Cross join cartésien', 'Collect sur le driver de tout', 'Désactiver le parallélisme'],
        accept: ['Broadcast join'],
        explanation:
          'Broadcast évite de shuffler la grande table quand la petite tient en mémoire.',
      },
      {
        id: 'sp1q2',
        prompt: 'Technique pour éclater une clé trop chaude :',
        kind: 'short',
        accept: ['salting', 'salt', 'salage', 'repartition'],
        explanation: 'Le salting (sel) disperse les hot keys sur plusieurs partitions.',
      },
    ],
    modelSolution:
      'Diag UI → si dim petite : broadcast → sinon salt hot keys → repartition(n) raisonnable → re-test runtime + shuffle bytes.',
  },

  // —— Databricks ——
  {
    id: 'dbs-job-1',
    tool: 'databricks',
    level: 2,
    title: 'Job multi-task : ingest → transform → DQ gate',
    context:
      'Passage d’un notebook manuel à un Job Databricks industriel pour le lac transactions.',
    description:
      'Tu conçois un job multi-task avec dépendances, policy cluster et chemin d’échec.',
    tasks: [
      'Enchaîner ingest → transform → DQ',
      'Bloquer l’aval si DQ échoue',
      'Définir cluster policy / retry',
    ],
    trap:
      'Publier en gold alors que la DQ gate a échoué empoisonne tous les dashboards aval — le job doit stopper et alerter.',
    steps: [
      {
        title: 'Tasks',
        detail: 'Task A ingest bronze → B silver transform depends_on A → C DQ gate depends_on B.',
      },
      {
        title: 'DQ gate',
        detail: 'Si checks fail → fail job (pas de publish gold) + alerte.',
      },
      {
        title: 'Ops',
        detail: 'Cluster policy (coût), retries sur A/B, timeout, run_if pour branches.',
      },
    ],
    questions: [
      {
        id: 'db1q1',
        prompt: 'Si le DQ gate échoue, le comportement attendu est :',
        kind: 'mcq',
        options: [
          'Publier quand même en gold',
          'Stopper / ne pas publier et alerter',
          'Ignorer silencieusement',
          'Supprimer le bronze',
        ],
        accept: ['Stopper / ne pas publier et alerter'],
        explanation: 'La gate DQ protège les consommateurs : pas de gold pourri.',
      },
      {
        id: 'db1q2',
        prompt: 'Mot pour la couche « données brutes ingérées » en lakehouse :',
        kind: 'short',
        accept: ['bronze', 'raw'],
        explanation: 'Medallion : Bronze (raw) → Silver → Gold.',
      },
    ],
    modelSolution:
      'Job : Bronze ingest → Silver transform → DQ task (fail = stop) → Gold. Policy cluster, retries, alerte Slack/email sur fail.',
  },

  // —— Airflow ——
  {
    id: 'af-dag-1',
    tool: 'airflow',
    level: 1,
    title: 'DAG quotidien : sensor → dbt → alerte',
    context:
      'Fichier partenaire attendu chaque matin 6h sur GCS ; puis dbt run ; alerte si SLA 8h dépassée.',
    description:
      'Tu conçois le squelette du DAG : schedule, sensor, dbt, retries, SLA.',
    tasks: [
      'Choisir un schedule_interval',
      'Ajouter un FileSensor (ou équivalent)',
      'Configurer retries + alerte on_failure',
    ],
    trap:
      'Lancer dbt sans FileSensor sur le fichier 6h = run à vide ou sur J-1, puis fausse alerte SLA à 8h.',
    steps: [
      {
        title: 'Schedule',
        detail: 'Ex. 0 6 * * * (cron) ou timetable ; timezone explicite.',
      },
      {
        title: 'Sensor',
        detail: 'Sensor GCS avec timeout/poke ; en échec → pas de dbt aval.',
      },
      {
        title: 'Résilience',
        detail: 'retries=2, retry_delay, email/Slack on_failure, sla_miss_callback si besoin.',
      },
    ],
    questions: [
      {
        id: 'a1q1',
        prompt: 'Rôle du FileSensor avant dbt :',
        kind: 'mcq',
        options: [
          'Remplacer dbt',
          'Attendre la disponibilité du fichier source',
          'Créer le dashboard',
          'Gérer DataGalaxy',
        ],
        accept: ['Attendre la disponibilité du fichier source'],
        explanation: 'Le sensor évite de lancer dbt sur une absence de fichier.',
      },
      {
        id: 'a1q2',
        prompt: 'Paramètre Airflow pour rejouer une tâche en échec (nom) :',
        kind: 'short',
        accept: ['retries', 'retry'],
        explanation: 'retries (+ retry_delay) gère les erreurs transitoires.',
      },
    ],
    modelSolution:
      'DAG 06:00 → GCS sensor (timeout) → dbt build → notify success. on_failure alerte. SLA 08:00 métier. Retries sur tâches I/O.',
  },

  // —— DataGalaxy ——
  {
    id: 'col-kpi-1',
    tool: 'datagalaxy',
    level: 1,
    title: 'Fiche asset KPI « churn »',
    context:
      'Deux départements calculent le churn différemment. Le COMEX veut une définition certifiée.',
    description:
      'Tu crées / complètes l’asset DataGalaxy du KPI churn : définition, owner, lien technique.',
    tasks: [
      'Rédiger une définition métier non ambiguë',
      'Nommer owner et steward',
      'Lier l’asset au modèle technique (table/colonne)',
    ],
    trap:
      'Deux churns « certifiés » sans la même fenêtre (30j vs 90j) et sans lien table = COMEX qui compare des choux et des carottes.',
    steps: [
      {
        title: 'Définition',
        detail:
          'Formule, population, fenêtre temporelle, exclusions. Ex. « % clients actifs J-90 sans renouvellement sur 30j ».',
      },
      {
        title: 'Ownership',
        detail: 'Business owner (métier) + technical steward (data).',
      },
      {
        title: 'Lien technique',
        detail: 'Pointer mart + colonne / rapport certifié ; statut « Certified » après validation.',
      },
    ],
    questions: [
      {
        id: 'co1q1',
        prompt: 'Sans lien technique, le risque DataGalaxy est :',
        kind: 'mcq',
        options: [
          'Définition orpheline / non implémentable',
          'Trop de performance SQL',
          'Trop de partitions BQ',
          'Aucun',
        ],
        accept: ['Définition orpheline / non implémentable'],
        explanation:
          'Le glossaire doit pointer vers l’implémentation, sinon chacun recalcule « à sa façon ».',
      },
      {
        id: 'co1q2',
        prompt: 'Rôle métier responsable du sens du KPI (mot) :',
        kind: 'short',
        accept: ['owner', 'business owner', 'propriétaire'],
        explanation: 'Le business owner valide la définition ; le steward gère le cycle de vie data.',
      },
    ],
    modelSolution:
      'Asset KPI churn : définition datée + population + formule · Owner métier · Steward data · Lien mart_churn.churn_rate · Statut Certified après comité.',
  },

  // —— Power BI ——
  {
    id: 'pbi-star-1',
    tool: 'powerbi',
    level: 1,
    title: 'Star schema ventes + mesure Marge %',
    context:
      'Le métier veut un rapport ventes. Aujourd’hui un export plat Excel à 40 colonnes est importé tel quel dans Power BI.',
    description:
      'Tu poses un modèle en étoile (fait + dimensions) et une mesure DAX de marge.',
    tasks: [
      'Identifier table de faits et dimensions',
      'Poser les relations (* → 1)',
      'Écrire la mesure Marge %',
    ],
    trap:
      'Importer l’Excel plat à 40 colonnes tel quel crée des relations many-to-many et des totaux doublés — pose un vrai schéma en étoile.',
    steps: [
      {
        title: 'Faits',
        detail: 'FactVentes : date_key, produit_key, client_key, montant_ht, coût.',
      },
      {
        title: 'Dimensions',
        detail: 'DimDate, DimProduit, DimClient — relations many-to-one vers le fait.',
      },
      {
        title: 'Mesure',
        detail: 'Marge % = DIVIDE( SUM(montant_ht - coût), SUM(montant_ht) ).',
      },
    ],
    questions: [
      {
        id: 'pb1q1',
        prompt: 'Dans un star schema, la table centrale des mesures est :',
        kind: 'mcq',
        options: ['Dimension', 'Fait (fact)', 'Glossaire DataGalaxy', 'Bucket GCS'],
        accept: ['Fait (fact)'],
        explanation: 'La table de faits porte les métriques ; les dimensions contextualisent.',
      },
      {
        id: 'pb1q2',
        prompt: 'Fonction DAX sûre pour une division (évite div/0) :',
        kind: 'short',
        accept: ['divide', 'divide()'],
        explanation: 'DIVIDE(num, den) gère le dénominateur nul proprement.',
      },
    ],
    modelSolution:
      'FactVentes + DimDate/Produit/Client · relations *→1 · Marge% = DIVIDE(SUM(HT-coût), SUM(HT)) · pas de table plate Excel.',
  },

  // —— Looker Studio ——
  {
    id: 'looker-report-1',
    tool: 'looker',
    level: 1,
    title: 'Rapport hebdo ops branché BigQuery',
    context:
      'Les ops veulent chaque lundi un rapport simple : volume pipelines, retard SLA, top erreurs — sans installer Power BI.',
    description:
      'Tu branches Looker Studio sur BigQuery avec filtre date et partage viewer.',
    tasks: [
      'Connecter une table/vue BQ agrégée',
      'Ajouter un filtre période (semaine)',
      'Partager en mode lecteur',
    ],
    trap:
      'Brancher Looker sur la table brute non agrégée rescane BigQuery à chaque ouverture — préfère une vue daily déjà résumée.',
    steps: [
      {
        title: 'Source',
        detail:
          'Préférer une vue/table déjà agrégée (coût) ; connecteur BigQuery dans Looker Studio.',
      },
      {
        title: 'Filtre',
        detail: 'Contrôle date range ; défaut = semaine glissante.',
      },
      {
        title: 'Partage',
        detail: 'Viewer pour ops ; édition limitée aux data owners.',
      },
    ],
    questions: [
      {
        id: 'l1q1',
        prompt: 'Pour limiter le coût BQ depuis Looker Studio :',
        kind: 'mcq',
        options: [
          'Pointer une table/vue agrégée + filtre date',
          'SELECT * sur 5 ans à chaque refresh',
          'Désactiver les filtres',
          'Dupliquer les sources',
        ],
        accept: ['Pointer une table/vue agrégée + filtre date'],
        explanation:
          'Looker Studio déclenche des jobs BQ : agrégats + filtres = moins de scan.',
      },
      {
        id: 'l1q2',
        prompt: 'Mode de partage pour lecture seule ops :',
        kind: 'short',
        accept: ['viewer', 'lecteur', 'reader', 'view'],
        explanation: 'Partage viewer / lecteur = consultation sans modifier le rapport.',
      },
    ],
    modelSolution:
      'Source = vue BQ hebdo agrégée · filtre date défaut 7j · graphiques volume/SLA/erreurs · partage Viewer ops · owner data en Editor.',
  },

  // —— Scripts SQL / Python supplémentaires (priorité jeu) ——
  {
    id: 'sql-cte-3',
    tool: 'sql',
    level: 3,
    title: 'CTE — CA livré puis top magasins',
    context:
      'Mutualis veut un top 3 magasins sur le CA livré (ventes_semaine) sans sous-requête illisible.',
    description: 'Tu écris une CTE qui agrège le CA, puis tu filtres le top.',
    tasks: [
      'WITH ca AS (SUM montant_ht WHERE livree GROUP BY magasin)',
      'SELECT top 3 ORDER BY ca DESC',
      'Commenter le grain',
    ],
    trap: 'ORDER BY sans LIMIT (ou QUALIFY) renvoie tout — le « top » n’est pas garanti côté conso.',
    steps: [
      { title: 'CTE', detail: 'WITH ca AS (SELECT magasin, SUM(montant_ht) AS ca_ht FROM ventes WHERE statut = \'livree\' GROUP BY 1)' },
      { title: 'Top', detail: 'SELECT * FROM ca ORDER BY ca_ht DESC LIMIT 3' },
    ],
    questions: [
      {
        id: 's3q1',
        prompt: 'Mot-clé SQL pour factoriser une sous-requête nommée :',
        kind: 'short',
        accept: ['with', 'cte'],
        explanation: 'WITH … AS (…) = Common Table Expression.',
      },
      {
        id: 's3q2',
        prompt: 'Filtrer statut livree se fait avec :',
        kind: 'mcq',
        options: ['WHERE', 'HAVING uniquement', 'ORDER BY', 'UNION'],
        accept: ['WHERE'],
        explanation: 'WHERE filtre les lignes avant agrégation ; HAVING après.',
      },
    ],
    modelSolution:
      '```sql\nWITH ca AS (\n  SELECT magasin, SUM(montant_ht) AS ca_ht\n  FROM ventes_semaine\n  WHERE statut = \'livree\'\n  GROUP BY magasin\n)\nSELECT * FROM ca ORDER BY ca_ht DESC LIMIT 3;\n```',
  },
  {
    id: 'sql-null-4',
    tool: 'sql',
    level: 2,
    title: 'NULL-safe — COALESCE / NULLIF emails',
    context: 'Le CRM Mutualis mélange NULL, chaînes vides et « unknown ».',
    description: 'Tu normalises les emails en SQL avant dédoublonnage.',
    tasks: [
      'NULLIF(TRIM(email), \'\')',
      'COALESCE / filtre unknown',
      'GROUP BY email normalisé',
    ],
    trap: 'TRIM seul ne transforme pas NULL — et \'\' <> NULL en SQL.',
    steps: [
      { title: 'Normaliser', detail: 'LOWER(TRIM(email)) puis NULLIF(..., \'\')' },
      { title: 'Exclure', detail: 'WHERE email_n IS NOT NULL AND email_n <> \'unknown\'' },
    ],
    questions: [
      {
        id: 's4q1',
        prompt: 'NULLIF(x, \'\') renvoie NULL si x est :',
        kind: 'mcq',
        options: ['chaîne vide', 'toujours NULL', '0', 'unknown'],
        accept: ['chaîne vide'],
        explanation: 'NULLIF(a,b) → NULL quand a = b.',
      },
    ],
    modelSolution:
      '```sql\nSELECT LOWER(TRIM(email)) AS email_n, COUNT(*)\nFROM clients_doublons\nWHERE NULLIF(LOWER(TRIM(email)), \'\') IS NOT NULL\n  AND LOWER(TRIM(email)) <> \'unknown\'\nGROUP BY 1\nHAVING COUNT(*) > 1;\n```',
  },
  {
    id: 'py-groupby-3',
    tool: 'python',
    level: 2,
    title: 'pandas groupby — CA par magasin',
    context: 'Même KPI que le SQL ventes, en pandas pour un notebook d’exploration.',
    description: 'Tu filtres statut livree puis groupby magasin sum montant_ht.',
    tasks: [
      'read_csv ventes_semaine',
      'filtre statut == livree',
      'groupby magasin montant_ht sum',
    ],
    trap: 'groupby sans filtre inclut les annulations et surestime le CA.',
    steps: [
      { title: 'Load', detail: 'pd.read_csv("ventes_semaine.csv")' },
      { title: 'Agg', detail: 'df[df.statut=="livree"].groupby("magasin")["montant_ht"].sum()' },
    ],
    questions: [
      {
        id: 'p3q1',
        prompt: 'Méthode pandas pour agréger après groupby :',
        kind: 'short',
        accept: ['sum', '.sum', 'agg'],
        explanation: 'SeriesGroupBy.sum() ou .agg("sum").',
      },
    ],
    modelSolution:
      '```python\nimport pandas as pd\ndf = pd.read_csv("ventes_semaine.csv")\nprint(df[df["statut"] == "livree"].groupby("magasin")["montant_ht"].sum().sort_values(ascending=False))\n```',
  },
  {
    id: 'py-json-normalize-4',
    tool: 'python',
    level: 3,
    title: 'json + pandas — aplatir une fiche machine',
    context: 'drill_machine.json arrive brut ; le mart attend des colonnes plates.',
    description: 'Tu charges le JSON et produis un DataFrame 1 ligne (machine_id, status, region).',
    tasks: [
      'json.load',
      'Construire un dict plat (location.region)',
      'pd.DataFrame([row])',
    ],
    trap: 'pd.read_json sur un objet unique (pas un array) peut surprendre — json.load + DataFrame est plus sûr ici.',
    steps: [
      { title: 'Parse', detail: 'data = json.load(f)' },
      { title: 'Flat', detail: 'row = {"machine_id": data["machine_id"], "region": data["location"]["region"]}' },
    ],
    questions: [
      {
        id: 'p4q1',
        prompt: 'Accès à la région imbriquée :',
        kind: 'short',
        accept: ['location', '["location"]', "['location']"],
        explanation: 'data["location"]["region"].',
      },
    ],
    modelSolution:
      '```python\nimport json, pandas as pd\nwith open("drill_machine.json", encoding="utf-8") as f:\n    data = json.load(f)\nrow = {\n  "machine_id": data["machine_id"],\n  "status": data["status"],\n  "region": data["location"]["region"],\n}\nprint(pd.DataFrame([row]))\n```',
  },
  {
    id: 'sql-anti-join-5',
    tool: 'sql',
    level: 3,
    title: 'Anti-join — clients sans commande',
    context: 'Le CRM a des clients jamais présents dans ventes_semaine.',
    description: 'Tu listes les client_id du référentiel absents des ventes (LEFT JOIN … IS NULL).',
    tasks: [
      'LEFT JOIN ventes ON client_id',
      'WHERE v.client_id IS NULL',
      'Compter les orphelins',
    ],
    trap: 'NOT IN avec des NULL côté ventes peut tout masquer — préfère LEFT JOIN / NOT EXISTS.',
    steps: [
      { title: 'Join', detail: 'FROM clients_ref c LEFT JOIN ventes_semaine v ON c.client_id = v.client_id' },
      { title: 'Filtre', detail: 'WHERE v.client_id IS NULL' },
    ],
    questions: [
      {
        id: 's5q1',
        prompt: 'Pattern anti-join courant :',
        kind: 'mcq',
        options: ['LEFT JOIN + IS NULL', 'INNER JOIN seul', 'CROSS JOIN', 'UNION ALL'],
        accept: ['LEFT JOIN + IS NULL'],
        explanation: 'LEFT JOIN puis IS NULL sur la clé droite = absents.',
      },
    ],
    modelSolution:
      '```sql\nSELECT c.client_id, c.segment\nFROM clients_ref c\nLEFT JOIN ventes_semaine v ON c.client_id = v.client_id\nWHERE v.client_id IS NULL;\n```',
  },
  {
    id: 'py-assert-5',
    tool: 'python',
    level: 3,
    title: 'Assertions data — garde-fous pandas',
    context: 'Avant to_csv / load mart, tu veux faire échouer le job si la qualité casse.',
    description: 'Tu ajoutes assert / raise sur schéma, nulls email, et effectif min.',
    tasks: [
      'assert set(colonnes attendues) <= set(df.columns)',
      'assert df["email"].isna().mean() < 0.05',
      'raise ValueError si len(actifs) < 100',
    ],
    trap: 'Un assert désactivé avec python -O disparaît — en prod préfère raise ValueError explicite.',
    steps: [
      { title: 'Schéma', detail: 'required = {"email","client_id"}; assert required <= set(df.columns)' },
      { title: 'Volume', detail: 'if len(actifs) < 100: raise ValueError("effectif trop bas")' },
    ],
    questions: [
      {
        id: 'p5q1',
        prompt: 'Pour un contrôle qualité fiable en prod, préférer :',
        kind: 'mcq',
        options: ['raise ValueError', 'print seulement', 'pass', 'input()'],
        accept: ['raise ValueError'],
        explanation: 'raise fait échouer le job ; print est silencieux pour l’orchestrateur.',
      },
    ],
    modelSolution:
      '```python\nimport pandas as pd\ndf = pd.read_csv("clients_doublons.csv")\nrequired = {"email"}\nif not required <= set(df.columns):\n    raise ValueError("colonnes manquantes")\nif df["email"].isna().mean() > 0.2:\n    raise ValueError("trop de NULL email")\n```',
  },

  // —— SQL / Python : parcours inspiré analytics (fondamentaux → avancé) ——
  {
    id: 'sql-basics-filter-0',
    tool: 'sql',
    level: 1,
    title: 'SELECT / WHERE — employés actifs SALES',
    context:
      'Mutualis RH veut l’effectif actif du département SALES à partir de retail_employees (SCD).',
    description:
      'Tu poses une requête de fondation : projection, filtres combinés, DISTINCT, COUNT.',
    tasks: [
      'SELECT des colonnes utiles (pas SELECT *)',
      'WHERE active_record = 1 AND department = …',
      'COUNT + DISTINCT sur une clé métier si besoin',
    ],
    trap:
      'Oublier active_record = 1 mélange historique et actif — les effectifs explosent.',
    steps: [
      {
        title: 'Filtre',
        detail: 'WHERE active_record = 1 AND UPPER(TRIM(department)) = \'SALES\'',
      },
      {
        title: 'Comptage',
        detail: 'COUNT(*) pour l’effectif ; COUNT(DISTINCT employee_id) si doute sur la grain.',
      },
    ],
    questions: [
      {
        id: 'sb0q1',
        prompt: 'Pour filtrer des lignes avant agrégation, on utilise :',
        kind: 'mcq',
        options: ['WHERE', 'HAVING', 'QUALIFY', 'LIMIT'],
        accept: ['WHERE'],
        explanation: 'WHERE filtre les lignes ; HAVING filtre les groupes.',
      },
      {
        id: 'sb0q2',
        prompt: 'Mot-clé pour supprimer les doublons de projection :',
        kind: 'short',
        accept: ['distinct'],
        explanation: 'SELECT DISTINCT … déduplique le résultat projeté.',
      },
    ],
    modelSolution:
      '```sql\nSELECT employee_id, full_name, department\nFROM retail_employees\nWHERE active_record = 1\n  AND UPPER(TRIM(department)) = \'SALES\';\n-- Effectif :\nSELECT COUNT(*) AS effectif_sales\nFROM retail_employees\nWHERE active_record = 1 AND UPPER(TRIM(department)) = \'SALES\';\n```',
  },
  {
    id: 'sql-case-having-1',
    tool: 'sql',
    level: 2,
    title: 'CASE WHEN + HAVING — paniers moyens',
    context:
      'Le COMEX veut classer les magasins : panier moyen HT élevé / moyen / bas sur ventes livrées.',
    description:
      'Tu agrèges, filtres les groupes, et labels avec CASE WHEN.',
    tasks: [
      'AVG(montant_ht) GROUP BY magasin',
      'HAVING AVG(...) >= seuil métier',
      'CASE WHEN pour bucketiser le panier',
    ],
    trap:
      'Mettre le filtre AVG dans WHERE échoue — l’agrégat vit après GROUP BY → HAVING (ou sous-requête).',
    steps: [
      {
        title: 'Agg',
        detail:
          'SELECT magasin, AVG(montant_ht) AS panier FROM ventes WHERE statut=\'livree\' GROUP BY 1',
      },
      {
        title: 'Label',
        detail:
          'CASE WHEN panier >= 80 THEN \'élevé\' WHEN panier >= 40 THEN \'moyen\' ELSE \'bas\' END',
      },
    ],
    questions: [
      {
        id: 'sc1q1',
        prompt: 'Filtrer sur AVG(montant) après GROUP BY :',
        kind: 'mcq',
        options: ['HAVING', 'WHERE AVG', 'ORDER BY seul', 'DISTINCT'],
        accept: ['HAVING'],
        explanation: 'HAVING s’applique aux agrégats / groupes.',
      },
      {
        id: 'sc1q2',
        prompt: 'Expression SQL pour des branches conditionnelles dans le SELECT :',
        kind: 'short',
        accept: ['case', 'case when'],
        explanation: 'CASE WHEN … THEN … ELSE … END.',
      },
    ],
    modelSolution:
      '```sql\nSELECT\n  magasin,\n  AVG(montant_ht) AS panier,\n  CASE\n    WHEN AVG(montant_ht) >= 80 THEN \'eleve\'\n    WHEN AVG(montant_ht) >= 40 THEN \'moyen\'\n    ELSE \'bas\'\n  END AS bucket\nFROM ventes_semaine\nWHERE statut = \'livree\'\nGROUP BY magasin\nHAVING AVG(montant_ht) >= 20;\n```',
  },
  {
    id: 'sql-joins-family-2',
    tool: 'sql',
    level: 2,
    title: 'INNER / LEFT / FULL — ventes × référentiel',
    context:
      'Tu réconcilies ventes_semaine avec un référentiel magasins (certains codes absents d’un côté).',
    description:
      'Tu choisis la bonne jointure selon la question métier (intersection, orphelins, couverture totale).',
    tasks: [
      'INNER JOIN pour le CA des magasins connus',
      'LEFT JOIN pour lister les ventes sans magasin référencé',
      'Expliquer quand un FULL OUTER JOIN aide le DQ',
    ],
    trap:
      'CROSS JOIN sans filtre = produit cartésien explosif — jamais « pour voir ».',
    steps: [
      {
        title: 'INNER',
        detail: 'v INNER JOIN dim_magasin m ON v.magasin = m.code → lignes appariées seulement.',
      },
      {
        title: 'LEFT',
        detail: 'v LEFT JOIN m … WHERE m.code IS NULL → ventes orphelines.',
      },
      {
        title: 'FULL',
        detail: 'FULL OUTER JOIN pour voir les deux côtés non matchés (DQ référentiel).',
      },
    ],
    questions: [
      {
        id: 'sj2q1',
        prompt: 'Jointure qui ne garde que les clés présentes des deux côtés :',
        kind: 'mcq',
        options: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'UNION'],
        accept: ['INNER JOIN'],
        explanation: 'INNER = intersection des clés.',
      },
      {
        id: 'sj2q2',
        prompt: 'Jointure dangereuse sans prédicat (produit cartésien) :',
        kind: 'short',
        accept: ['cross', 'cross join'],
        explanation: 'CROSS JOIN multiplie toutes les lignes.',
      },
    ],
    modelSolution:
      '```sql\n-- CA magasins connus\nSELECT m.code, SUM(v.montant_ht) AS ca\nFROM ventes_semaine v\nINNER JOIN dim_magasin m ON v.magasin = m.code\nWHERE v.statut = \'livree\'\nGROUP BY 1;\n\n-- Ventes orphelines\nSELECT v.*\nFROM ventes_semaine v\nLEFT JOIN dim_magasin m ON v.magasin = m.code\nWHERE m.code IS NULL;\n```',
  },
  {
    id: 'sql-window-lag-rank-3',
    tool: 'sql',
    level: 3,
    title: 'LAG + RANK — évolution trafic capteur',
    context:
      'capteur_a_retail : tu compares le footfall au jour précédent et tu ranks les jours les plus chargés.',
    description:
      'Tu combines LAG et RANK/DENSE_RANK sur une fenêtre temporelle.',
    tasks: [
      'LAG(mesure) OVER (ORDER BY jour)',
      'Écart vs J-1',
      'RANK ou DENSE_RANK des jours par trafic',
    ],
    trap:
      'RANK laisse des trous après égalité ; DENSE_RANK non — choisis selon le reporting COMEX.',
    steps: [
      {
        title: 'LAG',
        detail: 'LAG(footfall) OVER (ORDER BY jour) AS prev_j',
      },
      {
        title: 'Rank',
        detail: 'DENSE_RANK() OVER (ORDER BY footfall DESC) AS rk',
      },
    ],
    questions: [
      {
        id: 'sw3q1',
        prompt: 'Fonction window qui lit la valeur de la ligne précédente :',
        kind: 'short',
        accept: ['lag', 'lag()'],
        explanation: 'LAG(expr) OVER (ORDER BY …).',
      },
      {
        id: 'sw3q2',
        prompt: 'Après deux 1ers ex æquo, RANK place le suivant à :',
        kind: 'mcq',
        options: ['3', '2', '1', '0'],
        accept: ['3'],
        explanation: 'RANK saute : 1,1,3… ; DENSE_RANK ferait 1,1,2.',
      },
    ],
    modelSolution:
      '```sql\nSELECT\n  jour,\n  footfall,\n  LAG(footfall) OVER (ORDER BY jour) AS prev_footfall,\n  footfall - LAG(footfall) OVER (ORDER BY jour) AS delta,\n  DENSE_RANK() OVER (ORDER BY footfall DESC) AS rk\nFROM capteur_a_retail;\n```',
  },
  {
    id: 'sql-rollup-4',
    tool: 'sql',
    level: 4,
    title: 'ROLLUP — sous-totaux magasin / semaine',
    context:
      'Finance veut un extract CA livré avec sous-totaux par magasin et un total général.',
    description:
      'Tu utilises ROLLUP (ou GROUPING SETS) pour éviter plusieurs UNION de totaux.',
    tasks: [
      'SUM(montant_ht) GROUP BY ROLLUP (magasin, semaine)',
      'Interpréter les lignes NULL = sous-total / total',
      'Documenter le grain pour le lecteur BI',
    ],
    trap:
      'Sans expliquer les NULL de ROLLUP, le métier croit à des magasins « vides » — documente GROUPING() / labels.',
    steps: [
      {
        title: 'ROLLUP',
        detail: 'GROUP BY ROLLUP (magasin, semaine) → détail + sous-totaux + total.',
      },
      {
        title: 'Lecture',
        detail: 'semaine NULL + magasin non NULL = total magasin ; les deux NULL = grand total.',
      },
    ],
    questions: [
      {
        id: 'sr4q1',
        prompt: 'ROLLUP sert surtout à produire :',
        kind: 'mcq',
        options: [
          'Des sous-totaux hiérarchiques',
          'Des jointures',
          'Des index',
          'Des triggers',
        ],
        accept: ['Des sous-totaux hiérarchiques'],
        explanation: 'ROLLUP / CUBE / GROUPING SETS = agrégats multi-niveaux.',
      },
    ],
    modelSolution:
      '```sql\nSELECT\n  magasin,\n  semaine,\n  SUM(montant_ht) AS ca_ht\nFROM ventes_semaine\nWHERE statut = \'livree\'\nGROUP BY ROLLUP (magasin, semaine)\nORDER BY magasin NULLS LAST, semaine NULLS LAST;\n```',
  },
  {
    id: 'py-fundamentals-0',
    tool: 'python',
    level: 1,
    title: 'Types & f-strings — log d’un run Mutualis',
    context:
      'Tu journalises un run d’extract : magasin, nb lignes, durée en secondes.',
    description:
      'Tu manipules int/float/str, variables, et un message clair en f-string.',
    tasks: [
      'Typer mentalement nb_lignes (int) vs duree_s (float)',
      'Construire un message f\"…\" lisible ops',
      'Normaliser un libellé magasin (strip / upper)',
    ],
    trap:
      'Concaténer avec + et des types mélangés plante (int+str) — f-strings ou str() explicite.',
    steps: [
      {
        title: 'Vars',
        detail: 'magasin = \" lille \".strip().upper(); n = 1204; duree = 3.5',
      },
      {
        title: 'Log',
        detail: 'print(f\"[{magasin}] rows={n} duration_s={duree:.1f}\")',
      },
    ],
    questions: [
      {
        id: 'pf0q1',
        prompt: 'Syntaxe moderne de formatage de chaînes Python :',
        kind: 'short',
        accept: ['f-string', 'fstring', 'f-strings', 'f\"'],
        explanation: 'Les f-strings (f\"…{var}…\") sont le standard lisible.',
      },
      {
        id: 'pf0q2',
        prompt: 'Type de 3.5 en Python :',
        kind: 'mcq',
        options: ['float', 'int', 'str', 'bool'],
        accept: ['float'],
        explanation: 'Un littéral avec point décimal est un float.',
      },
    ],
    modelSolution:
      '```python\nmagasin = \" lille \".strip().upper()\nnb_lignes = 1204\nduree_s = 3.5\nprint(f\"[{magasin}] rows={nb_lignes} duration_s={duree_s:.1f}\")\n```',
  },
  {
    id: 'py-collections-1',
    tool: 'python',
    level: 1,
    title: 'Listes & dicts — mapping KPI Mutualis',
    context:
      'Le PO te donne une liste de magasins et un dict de objectifs CA.',
    description:
      'Tu structures les données en list/dict (et set pour dédoublonner).',
    tasks: [
      'Liste ordonnée des magasins du lot',
      'Dict magasin → objectif_ca',
      'Set pour détecter un magasin en double dans la liste',
    ],
    trap:
      'Un dict avec clé dupliquée écrase silencieusement — détecte les doublons via set(len) vs len(list).',
    steps: [
      {
        title: 'Structures',
        detail: 'magasins = [\"LILLE\", \"LYON\"]; objectifs = {\"LILLE\": 100_000}',
      },
      {
        title: 'DQ',
        detail: 'if len(magasins) != len(set(magasins)): raise ValueError(\"doublon\")',
      },
    ],
    questions: [
      {
        id: 'pc1q1',
        prompt: 'Structure clé → valeur idéale pour un mapping magasin/objectif :',
        kind: 'mcq',
        options: ['dict', 'tuple seul', 'set ordonné garanti', 'int'],
        accept: ['dict'],
        explanation: 'dict = association clé/valeur.',
      },
      {
        id: 'pc1q2',
        prompt: 'Collection sans doublons (ordre non garanti historiquement) :',
        kind: 'short',
        accept: ['set', 'ensemble'],
        explanation: 'set déduplique les éléments hashables.',
      },
    ],
    modelSolution:
      '```python\nmagasins = [\"LILLE\", \"LYON\", \"LILLE\"]\nif len(magasins) != len(set(magasins)):\n    raise ValueError(\"magasin en double\")\nobjectifs = {\"LILLE\": 100_000, \"LYON\": 80_000}\nprint(objectifs.get(\"LILLE\"))\n```',
  },
  {
    id: 'py-functions-hints-2',
    tool: 'python',
    level: 2,
    title: 'Fonctions + type hints — normalize_email',
    context:
      'Trois notebooks Mutualis recopient la même normalisation d’email. Tu industrialises.',
    description:
      'Tu crées une fonction typée, réutilisable, avec politique NULL / vide.',
    tasks: [
      'def normalize_email(raw: str | None) -> str | None',
      'strip / lower ; \"\" → None',
      'Documenter en une ligne le contrat',
    ],
    trap:
      'Retourner \"\" et None selon l’humeur casse les jointures — un seul sens du manquant (None).',
    steps: [
      {
        title: 'Signature',
        detail: 'Utilise type hints pour clarifier entrée/sortie (str | None).',
      },
      {
        title: 'Corps',
        detail: 'if raw is None: return None; s = raw.strip().lower(); return s or None',
      },
    ],
    questions: [
      {
        id: 'ph2q1',
        prompt: 'Les annotations de types Python s’appellent souvent :',
        kind: 'short',
        accept: ['type hints', 'type hint', 'hints', 'annotations'],
        explanation: 'Type hints = annotations de types (PEP 484).',
      },
      {
        id: 'ph2q2',
        prompt: 'Mot-clé pour définir une fonction :',
        kind: 'mcq',
        options: ['def', 'func', 'lambda uniquement', 'class'],
        accept: ['def'],
        explanation: 'def nom(...): crée une fonction.',
      },
    ],
    modelSolution:
      '```python\ndef normalize_email(raw: str | None) -> str | None:\n    \"\"\"Retourne un email normalisé ou None si manquant/vide.\"\"\"\n    if raw is None:\n        return None\n    s = raw.strip().lower()\n    return s or None\n```',
  },
  {
    id: 'py-control-except-2',
    tool: 'python',
    level: 2,
    title: 'if / for / try — parse montant HT',
    context:
      'Un CSV ventes contient des montants parfois invalides (\"N/A\", None, \"12,5\").',
    description:
      'Tu boucles, branches, et captures les erreurs de conversion sans tuer tout le run.',
    tasks: [
      'for row in rows',
      'try/except ValueError sur float()',
      'isinstance pour écarter les non-str / non-num déjà OK',
    ],
    trap:
      'except Exception trop large masque les bugs — except ValueError (ou TypeError) ciblé.',
    steps: [
      {
        title: 'Boucle',
        detail: 'for raw in montants: …',
      },
      {
        title: 'Parse',
        detail: 'try: float(str(raw).replace(\",\", \".\")) except ValueError: rejects.append(raw)',
      },
    ],
    questions: [
      {
        id: 'pe2q1',
        prompt: 'Bloc pour intercepter une erreur de conversion :',
        kind: 'mcq',
        options: ['try / except', 'if / else seul', 'with / as', 'class / self'],
        accept: ['try / except'],
        explanation: 'try/except gère les exceptions runtime.',
      },
      {
        id: 'pe2q2',
        prompt: 'Fonction pour vérifier le type d’un objet :',
        kind: 'short',
        accept: ['isinstance', 'isinstance()'],
        explanation: 'isinstance(x, typ) → bool.',
      },
    ],
    modelSolution:
      '```python\nparsed, rejects = [], []\nfor raw in montants:\n    if raw is None:\n        rejects.append(raw)\n        continue\n    try:\n        parsed.append(float(str(raw).replace(\",\", \".\")))\n    except ValueError:\n        rejects.append(raw)\n```',
  },
  {
    id: 'py-comprehension-3',
    tool: 'python',
    level: 3,
    title: 'List comprehension — IDs actifs',
    context:
      'À partir d’une liste de dicts employés, tu veux les employee_id actifs (active_record == 1).',
    description:
      'Tu remplaces une boucle verbose par une compréhension lisible.',
    tasks: [
      'Comprehension avec if',
      'Produire une list[int]',
      'Comparer lisibilité vs boucle for',
    ],
    trap:
      'Une compréhension de 4 niveaux est illisible — repars sur une boucle / fonction nommée.',
    steps: [
      {
        title: 'Forme',
        detail: '[e[\"employee_id\"] for e in rows if e.get(\"active_record\") == 1]',
      },
    ],
    questions: [
      {
        id: 'pp3q1',
        prompt: 'Constructeur compact [expr for x in it if cond] :',
        kind: 'short',
        accept: ['comprehension', 'list comprehension', 'listcomp'],
        explanation: 'List comprehension = forme compacte de boucle + filtre.',
      },
    ],
    modelSolution:
      '```python\nactifs = [e[\"employee_id\"] for e in rows if e.get(\"active_record\") == 1]\n```',
  },
  {
    id: 'py-oop-light-3',
    tool: 'python',
    level: 3,
    title: 'Classe légère — CsvCleaner',
    context:
      'Tu veux encapsuler schéma attendu + clean + compteur de rejects pour plusieurs fichiers Mutualis.',
    description:
      'Tu poses une petite classe (état + méthodes) sans sur-ingénierie.',
    tasks: [
      '__init__ avec expected_cols',
      'méthode clean(df) → df_ok',
      'attribut rejects_count',
    ],
    trap:
      'Une hiérarchie ABC à 5 niveaux pour un CSV daily = overkill — classe simple d’abord.',
    steps: [
      {
        title: 'Classe',
        detail: 'class CsvCleaner: def __init__(self, expected: set[str]): …',
      },
      {
        title: 'Méthode',
        detail: 'def clean(self, df): vérifie colonnes, compte nulls, retourne df',
      },
    ],
    questions: [
      {
        id: 'po3q1',
        prompt: 'Mot-clé pour définir une classe :',
        kind: 'short',
        accept: ['class'],
        explanation: 'class Nom: …',
      },
      {
        id: 'po3q2',
        prompt: 'Premier argument conventionnel des méthodes d’instance :',
        kind: 'mcq',
        options: ['self', 'this', 'cls uniquement', 'cls obligatoire partout'],
        accept: ['self'],
        explanation: 'self référence l’instance (cls pour les classmethods).',
      },
    ],
    modelSolution:
      '```python\nclass CsvCleaner:\n    def __init__(self, expected: set[str]):\n        self.expected = expected\n        self.rejects_count = 0\n\n    def clean(self, df):\n        missing = self.expected - set(df.columns)\n        if missing:\n            raise ValueError(f\"missing {missing}\")\n        ok = df.dropna(subset=list(self.expected))\n        self.rejects_count = len(df) - len(ok)\n        return ok\n```',
  },
]

export function exercisesForTool(tool: ToolId): PracticeExercise[] {
  return PRACTICE_EXERCISES.filter((e) => e.tool === tool).sort((a, b) => a.level - b.level)
}
