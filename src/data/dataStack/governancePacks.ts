/** Packs gouvernance data — QCM (3 propositions) + correction Référentiel gouvernance. */

import type { ProjectPhase, ToolId } from './tools'
import type { StepGovernance } from './pmGovTypes'
import { resolveGovernanceEn } from './governancePacks.en'
import { HUMAN_BANK_FR } from './pmHumanBank'

export type { StepGovernance } from './pmGovTypes'

function gov(
  partial: Omit<StepGovernance, 'damaRef'> & { damaRef?: string },
): StepGovernance {
  return {
    damaRef: 'Référentiel gouvernance',
    ...partial,
  }
}

/** Gouvernance QCM par id d’étape curated. */
export const CURATED_GOVERNANCE: Record<string, StepGovernance> = {
  'l0-open': gov({
    link: 'Inspecter le schéma, c’est poser le catalogue technique : sans colonnes documentées, pas de steward ni de glossaire fiables.',
    question:
      'Après discovery de retail_employees, quel couple Owner / artefact est le plus aligné avec la gouvernance data ?',
    options: [
      'IT Support = Owner ; aucun artefact (le CSV suffit)',
      'DRH / Ops RH = Data Owner ; mise à jour catalogue + glossaire « salarié actif »',
      'Le stagiaire data = Owner unique ; fiche Excel personnelle non partagée',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.3 Data Governance · Ch.12 Metadata',
    correction:
      'En gouvernance data, le Data Owner est accountable métier (ici RH/ops retail), pas « celui qui a le fichier ». Le Steward opérationnalise qualité/métadonnées. Après discovery, on enrichit métadonnées business + techniques (catalogue/glossaire) — Ch.12 Metadata Management.',
  }),
  'l0-filter': gov({
    link: 'Le filtre active_record = 1 matérialise une règle métier de qualité : la gouvernance doit la figer comme définition d’« effectif actif ».',
    question: 'Où doit vivre en priorité la règle « employé actif = active_record = 1 » ?',
    options: [
      'Uniquement dans la tête de l’analyste qui filtre Excel',
      'Comme règle de qualité / définition gouvernée, testée (script ou dbt) sur le mart',
      'Uniquement dans un slide PowerPoint du dernier COMEX',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.13 Data Quality · Ch.3 Data Governance',
    correction:
      'gouvernance data (Data Quality) : les règles de qualité sont définies, mesurées et contrôlées — pas improvisées. Lier la règle à une définition métier gouvernée (DG) et la faire exécuter (tests) évite les KPI divergents.',
  }),
  'l0-sql': gov({
    link: 'La même définition métier doit produire le même résultat en SQL et en Python — cohérence sémantique des définitions.',
    question: 'Comment la gouvernance data recommande-t-elle de garantir SQL COUNT ≈ pandas value_counts ?',
    options: [
      'Faire confiance au feeling si les ordres de grandeur se ressemblent',
      'Réconciliation / contrôle qualité documenté (gold set, assert, test CI) sur la même définition',
      'Changer la définition SQL jusqu’à ce que le dashboard soit « joli »',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.13 Data Quality · Ch.12 Metadata',
    correction:
      'La qualité « fitness for purpose » implique des contrôles de cohérence entre pipelines. Une réconciliation chiffrée + métadonnée de définition partagée (glossaire/KPI) est le bon réflexe de gouvernance ; l’écart devient un incident qualité, pas un ajustement cosmétique.',
  }),
  'l1-dupes': gov({
    link: 'Les doublons email sont un défaut d’unicité master data : matching, survivorship et stewardship.',
    question: 'Quelle approche MDM est la plus correcte en gouvernance data pour les emails en doublon ?',
    options: [
      'Supprimer aléatoirement une ligne sur deux sans règle de survie',
      'Clé normalisée (email) + règle de survivorship + Owner/Steward CRM documentés',
      'Ignorer les doublons tant que le CA « a l’air bon »',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.10 Reference & Master Data',
    correction:
      'Ch.10 MDM : matching (exact/fuzzy), golden record / trusted version, règles de survivorship, stewardship dédié. Sans politique, le hub ou le script ne « gouverne » rien.',
  }),
  'l1-join': gov({
    link: 'Une jointure CA × clients engage grain et linéage du KPI finance.',
    question: 'Quel énoncé décrit le mieux grain + linéage pour « CA livré par segment » ?',
    options: [
      'Grain = une ligne Excel quelconque ; linéage inutile si le JOIN « marche »',
      'Grain = segment × période ; linéage ventes + clients_ref → mart documenté au catalogue',
      'Grain = pixel du dashboard ; linéage = nom du fichier Power BI seulement',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.12 Metadata (lineage) · Ch.11 DW/BI (grain)',
    correction:
      'Le grain (Kimball/gouvernance data DW-BI) doit être explicite. Le linéage (Metadata) trace sources → transformations → produit data. Sans les deux, pas de « single version of truth » gouvernée.',
  }),
  'l1-py-clean': gov({
    link: 'Industrialiser le nettoyage = politique de qualité versionnée, pas un one-shot.',
    question: 'Où versionner et qui valide un changement de règle de normalisation email ?',
    options: [
      'Uniquement en local sur le laptop, sans revue',
      'Dans le repo (code + doc) avec PR revue Steward/Owner métier',
      'Uniquement oralement en daily Scrum',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.13 Data Quality · Ch.3 Data Governance',
    correction:
      'Les règles de qualité sont des actifs gouvernés : traçabilité du changement (qui a décidé quoi) fait partie de la DG. Code + documentation + accountability Owner/Steward = pratique de gouvernance data.',
  }),
  'l2-sql': gov({
    link: 'Un agrégat publié exige classification, Owner et droits d’usage.',
    question: 'Pour l’agrégat immobilier par commune, quelle posture gouvernance data est correcte ?',
    options: [
      'Données publiques par défaut ; tout le monde exporte sans contrôle',
      'Classification (ex. interne) + Owner nommé + accès self-service sous garde-fous',
      'Pas de classification : seul le CTO décide au cas par cas par Slack',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.3 Data Governance · Ch.7 Data Security',
    correction:
      'DG + Security : classifier, assigner la responsabilité, contrôler l’accès selon le risque. L’agrégat réduit le risque PII mais ne dispense pas de gouvernance d’usage.',
  }),
  'l2-capteur': gov({
    link: 'Un seuil ops est un contrôle de qualité / fraîcheur opérationnelle.',
    question: 'Que doit définir la gouvernance quand visiteurs < threshold ?',
    options: [
      'Rien : le fichier CSV « parlera de lui-même »',
      'Alerte + responsable + SLA / runbook (timeliness & issue management)',
      'Uniquement un emoji dans le canal #random',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.13 Data Quality · Ch.3 Data Governance',
    correction:
      'La qualité inclut la fraîcheur (timeliness) et le traitement des anomalies. Un contrôle sans propriétaire ni escalade n’est pas gouverné — la gouvernance data insiste sur rôles et processus, pas seulement sur la métrique.',
  }),
  'l2-foot': gov({
    link: 'CASE/agrégats formalisent des règles métier testables — comme toute définition gouvernée.',
    question: 'Comment formaliser « victoire à domicile » selon les règles de gouvernance data ?',
    options: [
      'Laisser chaque analyste interpréter FTR à sa guise',
      'Définition explicite (FTR = H) + test d’acceptation chiffré',
      'Remplacer la définition par le storytelling du dashboard',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.12 Metadata · Ch.13 Data Quality',
    correction:
      'Les définitions business metadata doivent être non ambiguës ; les contrôles prouvent le respect de la règle. Sinon : défaut sémantique (même nom, sens différents).',
  }),
  'l2-window': gov({
    link: 'Window functions sur CA : le grain temporel du KPI doit être tranché.',
    question: 'Si métier veut ranking créneau ET jour, que fait la gouvernance ?',
    options: [
      'Un seul KPI ambigu qui mélange les deux grains',
      'Deux définitions/KPI distincts, Owner Retail tranche, Steward publie',
      'Cacher le grain pour « simplifier » le COMEX',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.11 DW & BI · Ch.3 Data Governance',
    correction:
      'Le grain est un concept fondateur du décisionnel. Deux besoins = deux produits/définitions gouvernés, pas un indicateur fourre-tout. L’Owner arbitre ; le Steward documente.',
  }),
  'l3-json': gov({
    link: 'Intégrer un JSON machine = contrat de schéma, rétention, ownership.',
    question: 'Quel mini data contract est le plus compatible avec la gouvernance data ?',
    options: [
      'Aucun champ obligatoire ; rétention infinie ; Owner inconnu',
      'Champs obligatoires typés + rétention définie + Owner du schéma nommé',
      'Contracter uniquement le logo du fournisseur IoT',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.5 Data Modeling · Ch.8 Data Integration · Ch.3 DG',
    correction:
      'Contrats / standards de données (modélisation + intégration) et accountability DG. Un breaking change de schéma sans Owner = dette et risque ops.',
  }),
  'l3-py': gov({
    link: 'L’ETL SCD vers actifs RH engage finalité et rétention (privacy / DG).',
    question: 'Quelle affirmation est la plus alignée gouvernance data / privacy pour employees_actifs ?',
    options: [
      'Conserver le landing brut indéfiniment « au cas où » sans finalité',
      'Finalité métier explicite + rétention différenciée landing vs mart',
      'Publier les noms sur un dashboard public pour « transparence »',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.2 Ethics · Ch.7 Security/Privacy · Ch.3 DG',
    correction:
      'Finalité, minimisation et rétention sont au cœur privacy/éthique gouvernance data. Landing ≠ mart : politiques de cycle de vie distinctes sous gouvernance.',
  }),
  'l3-py-merge': gov({
    link: 'Merge CA×clients = produit data partagé Finance/CRM — stewardship clair.',
    question: 'Si Finance et CRM divergent sur « livree », que faire (gouvernance data) ?',
    options: [
      'Laisser deux définitions homonymes en production',
      'Arbitrage Owner accountable + une définition publiée (comité / ADR)',
      'Prendre la définition du dernier qui a parlé en réunion',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.3 Data Governance · Ch.10 MDM',
    correction:
      'La DG tranche les conflits de définition ; l’Accountable Owner assume. Deux « vérités » = échec de gouvernance sémantique (et de confiance BI).',
  }),
  'l3-dbt': gov({
    link: 'dbt encode la gouvernance opérationnelle : tests = politique qualité exécutable.',
    question: 'Pourquoi unique(employee_id) sur le mart (pas le staging SCD) ?',
    options: [
      'Parce que dbt refuse les tests sur le staging par principe technique',
      'Le staging SCD a plusieurs versions ; le mart actifs est le golden record à contrôler',
      'Les tests unique sont décoratifs et n’ont pas d’impact gouvernance',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.10 MDM · Ch.13 Data Quality',
    correction:
      'Le golden / trusted record se contrôle où la règle métier est appliquée. Sur SCD brut, l’unicité de la clé métier échoue légitimement — mauvais contrôle = faux négatifs et confusion.',
  }),
  'l4-kpi-sql': gov({
    link: 'La requête KPI est la définition exécutable : elle prime sur le storytelling BI.',
    question: 'Que doit contenir une fiche KPI « Intensité CA » selon la gouvernance data ?',
    options: [
      'Uniquement une capture d’écran Power BI sans Owner',
      'Nom, définition (ex. SUM weight), Owner, classification / lien technique',
      'Seulement le nom marketing du dashboard',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.12 Metadata · Ch.11 DW/BI · Ch.3 DG',
    correction:
      'Métadonnées business (définition, Owner) + lien technique. Sans accountability ni classification, le KPI n’est pas gouverné — la viz seule ne suffit pas.',
  }),
  'l4-grain': gov({
    link: 'Joindre sans aligner les grains = défaut sémantique / qualité majeur.',
    question: 'Jointure capteur × weights sans agrégation : quelle réaction gouvernance ?',
    options: [
      'Ignorer : « les totaux finiront par se stabiliser »',
      'Incident qualité (sévérité haute) : retirer/corriger le produit, documenter le grain',
      'Doubler les chiffres volontairement pour « être prudent »',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.13 Data Quality · Ch.11 DW/BI',
    correction:
      'Un mauvais grain produit des faits non fitness-for-purpose. La gouvernance data traite cela comme un enjeu qualité + définition dimensionnelle — escalade et correction, pas silence.',
  }),
  'l4-pbi': gov({
    link: 'Exposition BI : traçabilité mesure ↔ SQL de référence.',
    question: 'Comment prouver en comité que la mesure BI = la requête de référence ?',
    options: [
      'Affirmer que Power BI « calcule toujours juste »',
      'Réconciliation chiffrée sur échantillon (SQL vs BI) sous Owner',
      'Changer la requête SQL pour coller au dashboard',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.11 DW/BI · Ch.13 Data Quality',
    correction:
      'Self-service / BI sous garde-fous : contenu certifié et contrôles. La réconciliation prouve la confiance ; inverser la vérité technique pour « coller » à la viz casse la gouvernance.',
  }),
  'l5-af': gov({
    link: 'DAG Airflow = contrôle ops de fraîcheur (timeliness).',
    question: 'Que doit fixer la gouvernance autour du sensor capteur ?',
    options: [
      'Aucun SLA : on regarde le DAG quand on y pense',
      'SLA de fraîcheur + retries + escalade runbook si timeout',
      'Uniquement une belle capture Grafana sans propriétaire',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.13 Data Quality (timeliness) · Ch.3 DG',
    correction:
      'Timeliness est une dimension de qualité. Processus, rôles et escalade relèvent de la DG opérationnelle — le sensor technique sans SLA n’est pas une gouvernance.',
  }),
  'l5-transform': gov({
    link: 'Transform paramétrée par date = idempotence et auditabilité.',
    question: 'Pourquoi {{ ds }} est-il un prérequis gouvernance ?',
    options: [
      'Pour faire joli dans les logs Airflow',
      'Permettre rejeu, audit et partitions datées (preuve / idempotence)',
      'Pour éviter d’écrire des tests de qualité',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.8 Data Integration & Interoperability · Ch.12 Metadata',
    correction:
      'Intégration gouvernée : traçabilité par lot/période, rejouabilité, métadonnées opérationnelles. Sans clé de run (ds), pas d’audit fiable du « quelle donnée pour quelle date ».',
  }),
  'l5-cap': gov({
    link: 'Runbook pipeline = RACI / accountability de bout en bout.',
    question: 'Pour la qualité du mart employés actifs, quel RACI est le plus gouvernance data ?',
    options: [
      'Personne accountable ; tout le monde « co-owner » sans décision',
      'Responsible = data engineer ; Accountable = Data Owner RH',
      'Accountable = l’outil dbt lui-même',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.3 Data Governance (roles)',
    correction:
      'La gouvernance data sépare accountability (Owner) et responsabilité opérationnelle (Steward / ingénierie). Un outil ne peut pas être Accountable. RACI clair = décision et escalade possibles.',
  }),
}

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pickGov(arr: readonly StepGovernance[], seed: number): StepGovernance {
  return arr[seed % arr.length]!
}

/** Banque opérationnelle — cas concrets (DQ, catalogue, RGPD, lineage, KPI). */
const OPERATIONAL_BANK: readonly StepGovernance[] = [
  gov({
    link: 'Avant go-live : une règle de qualité doit être écrite, testable et Owner-isée.',
    question: 'Tu viens de livrer un mart. Quel geste DQ est le plus opérationnel ?',
    options: [
      'Dire « la data a l’air bonne » en Slack',
      'Écrire une règle (ex. unicité email) + test automatisé + Owner qui arbitre les échecs',
      'Changer le KPI jusqu’à ce que le COMEX sourie',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.13 Data Quality · Ch.3 DG',
    correction:
      'La qualité opérationnelle = règle + mesure + accountability. Sans Owner sur les échecs, le test est cosmétique.',
  }),
  gov({
    link: 'Catalogue / glossaire : le livrable technique n’existe pour l’entreprise que s’il est trouvable.',
    question: 'Que publies-tu a minima dans le catalogue après ton script ?',
    options: [
      'Uniquement le nom du fichier sur ton Desktop',
      'Terme métier, définition, Owner, lien table/colonne ou dataset',
      'Uniquement le logo DataGalaxy / Purview',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.12 Metadata · Ch.3 DG',
    correction:
      'Métadonnées business + techniques + accountability. Sinon personne ne réutilise ton SQL/Python.',
  }),
  gov({
    link: 'RGPD / privacy : finalité et rétention avant d’exposer ou d’entraîner.',
    question: 'Le dataset contient un email client. Décision gouvernance ?',
    options: [
      'Tout pousser en mart « pour plus tard » sans finalité',
      'Documenter finalité + base légale + rétention ; minimiser / masquer si hors scope',
      'Laisser l’accès ouvert à toute la boîte « pour aller plus vite »',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.7 Data Security · RGPD',
    correction:
      'Privacy by design : finalité, minimisation, rétention. La vitesse n’excuse pas l’exposition.',
  }),
  gov({
    link: 'Décision COMEX : un KPI divergent entre SQL et le dashboard.',
    question: 'Quelle décision prends-tu avant la réunion ?',
    options: [
      'Masquer l’écart pour éviter le conflit',
      'Bloquer la certification, réconcilier SQL vs viz, faire trancher l’Owner',
      'Dupliquer deux KPI sous le même libellé',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.13 DQ · Ch.11 DW/BI · Ch.3 DG',
    correction:
      'La confiance = une définition, une source de vérité, un Accountable. Pas de cosmétique politique.',
  }),
  gov({
    link: 'Lineage : savoir d’où vient le chiffre avant d’arbitrer un bug métier.',
    question: 'Un chiffre « faux » remonte. Premier geste gouverné ?',
    options: [
      'Recoder le dashboard en urgence sans tracer la source',
      'Remonter le lineage (source → landing → mart → viz) et isoler l’étape en défaut',
      'Accuser le métier sans preuve',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.12 Metadata · Ch.8 Integration',
    correction:
      'Le lineage transforme un débat d’opinion en diagnostic technique — puis décision Owner.',
  }),
  gov({
    link: 'RACI Owner / Steward : qui décide vs qui exécute la remédiation.',
    question: 'Tests DQ rouges sur le golden record. Qui fait quoi ?',
    options: [
      'Personne : on ignore jusqu’au prochain COMEX',
      'Steward / engineer remédie ; Owner arbitre si on ship ou on bloque',
      'L’outil dbt est Accountable à la place des humains',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.3 DG · Ch.10 MDM · Ch.13 DQ',
    correction:
      'Responsible opérationnel ≠ Accountable métier. L’outil exécute ; les humains décident.',
  }),
  gov({
    link: 'Accès / classification : le script ne doit pas ouvrir la data à tout le monde.',
    question: 'Après publication d’un mart RH, quelle décision d’accès ?',
    options: [
      'Everyone / AllUsers « temporairement »',
      'Classifier (interne / confidentiel) + habilitations par rôle + revue périodique',
      'Partager le dump sur un Drive personnel',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.7 Data Security',
    correction:
      'Sécurité = classification + least privilege + revue. Les dumps personnels sont un incident en puissance.',
  }),
  gov({
    link: 'DoD data : le livrable technique n’est fini que si la décision métier est possible.',
    question: 'Ton SQL passe. Que manque-t-il pour une Definition of Done data ?',
    options: [
      'Rien : le code vert suffit toujours',
      'KPI/AC validés + Owner + au moins un contrôle qualité documenté',
      'Uniquement une capture d’écran Instagram',
    ],
    correctIndex: 1,
    damaRef: 'Référentiel gouvernance · Ch.3 DG · Ch.13 DQ',
    correction:
      'DoD data = aptitude à décider. Code vert sans Owner ni contrôle = dette opérationnelle.',
  }),
]

/** Soft skills projet (conflit, personnes, décision, communication…) — format gouvernance. */
const HUMAN_GOV_BANK: readonly StepGovernance[] = HUMAN_BANK_FR.map((h) =>
  gov({
    link: h.link,
    question: h.question,
    options: h.options,
    correctIndex: h.correctIndex,
    correction: h.correction,
    damaRef: `Soft skills · ${h.frameworkRef}`,
  }),
)

export function defaultGovernanceForTool(
  tool: ToolId | undefined,
  phase?: ProjectPhase,
  stepId = 'anon',
  intensity = 0,
): StepGovernance {
  const seed = hashSeed(`${stepId}|gov|${tool ?? ''}|${phase ?? ''}|${intensity}`)
  // ~40 % soft skills / conflit / personnes / communication (transverse projet)
  if (seed % 5 < 2) {
    return pickGov(HUMAN_GOV_BANK, seed)
  }
  // Alternance : banque opérationnelle (marché) ↔ défaut outil (stack technique)
  if (seed % 3 !== 0) {
    return pickGov(OPERATIONAL_BANK, seed)
  }
  const phaseBit = phase ? ` (phase ${phase})` : ''
  switch (tool) {
    case 'sql':
    case 'bigquery':
    case 'cloudsql':
      return gov({
        link: `Une requête SQL publie une vérité métier${phaseBit} : Owner, grain et contrôles doivent être explicites.`,
        question: 'Quel trio est indispensable pour gouverner cet indicateur/table ?',
        options: [
          'Couleur du dashboard, police du titre, animation',
          'Data Owner nommé + grain documenté + au moins un contrôle qualité',
          'Uniquement le dialecte SQL (BigQuery vs Postgres)',
        ],
        correctIndex: 1,
        damaRef: 'Référentiel gouvernance · Ch.3 DG · Ch.13 Data Quality · Ch.12 Metadata',
        correction:
          'Sans Owner (accountability), grain (sémantique) et contrôle (qualité), la requête reste un script local — pas un actif data réellement gouverné.',
      })
    case 'python':
    case 'spark':
    case 'databricks':
    case 'airflow':
      return gov({
        link: `Un script / job industrialise des règles${phaseBit} : versionnement, idempotence, responsabilités.`,
        question: 'Quelle pratique est la plus compatible avec la gouvernance data pour ce job ?',
        options: [
          'Modifier la règle en prod sans ticket ni revue',
          'Règle versionnée (repo) + job idempotent + validation Owner/Steward',
          'Tout hardcoder sans date de partition « pour aller plus vite »',
        ],
        correctIndex: 1,
        damaRef: 'Référentiel gouvernance · Ch.3 DG · Ch.8 Integration · Ch.13 DQ',
        correction:
          'Changement gouverné + exécution rejouable/auditable. La gouvernance data valorise processus et rôles autant que le code.',
      })
    case 'dbt':
      return gov({
        link: 'dbt matérialise des contrats entre couches : tests = politique qualité.',
        question: 'Où placer de préférence les tests d’intégrité du golden record ?',
        options: [
          'Uniquement sur des slides de gouvernance',
          'Sur le mart (où la règle métier est appliquée), documentés + Owner',
          'Nulle part : dbt « suffit » comme gouvernance',
        ],
        correctIndex: 1,
        damaRef: 'Référentiel gouvernance · Ch.13 Data Quality · Ch.10 MDM',
        correction:
          'Les contrôles doivent cibler l’actif de confiance. L’outil dbt exécute la politique ; il ne remplace pas Owner ni définitions.',
      })
    case 'datagalaxy':
      return gov({
        link: 'DataGalaxy formalise glossaire, ownership et politiques — cœur DG.',
        question: 'Que doit contenir a minima une fiche terme / KPI ?',
        options: [
          'Uniquement un emoji et un lien Slack',
          'Terme, définition, Owner, lien technique (table/colonne)',
          'Uniquement le logo de l’outil de catalogue',
        ],
        correctIndex: 1,
        damaRef: 'Référentiel gouvernance · Ch.3 DG · Ch.12 Metadata',
        correction:
          'Glossaire + accountability + lien technique : sinon le catalogue est cosmétique (piège classique : catalogue cosmétique sans accountability).',
      })
    case 'powerbi':
    case 'looker':
      return gov({
        link: 'Exposition BI : mesure ↔ définition SQL certifiée.',
        question: 'Que exige la gouvernance avant de certifier une carte BI ?',
        options: [
          'Que le visuel soit esthétique',
          'Alignement sur mart/SQL de référence + Owner qui certifie le chiffre',
          'Désactiver tous les filtres date pour « voir plus de data »',
        ],
        correctIndex: 1,
        damaRef: 'Référentiel gouvernance · Ch.11 DW/BI · Ch.3 DG',
        correction:
          'Self-service sous garde-fous : contenu certifié, définitions conformes. Esthétique ≠ confiance.',
      })
    case 'gcs':
      return gov({
        link: 'Landing GCS : classification, rétention, chemins datés (audit).',
        question: 'Pourquoi dt=YYYY-MM-DD dans le path landing ?',
        options: [
          'Pour décorer l’URL',
          'Rejeu, audit et sensors — traçabilité du lot par date',
          'Parce que GCS refuse les fichiers sans date dans le nom marketing',
        ],
        correctIndex: 1,
        damaRef: 'Référentiel gouvernance · Ch.8 Integration · Ch.12 Metadata · Ch.7 Security',
        correction:
          'Partitions datées servent intégration rejouable + métadonnées ops + contrôles d’accès par lot. Classification/rétention restent obligatoires.',
      })
    default:
      return gov({
        link: `Chaque livrable projet${phaseBit} rattache Owner, qualité et usage.`,
        question: 'Quel minimum de gouvernance data appliques-tu à ce livrable ?',
        options: [
          'Aucun rôle, aucun risque documenté',
          'Owner nommé + risque qualité identifié + mitigation (contrôle/revue)',
          'Uniquement le choix de la stack cloud du moment',
        ],
        correctIndex: 1,
        damaRef: 'Référentiel gouvernance · Ch.3 Data Governance',
        correction:
          'La DG pose autorités, décisions et responsabilités. Owner + risque + mitigation est le socle ; l’outil vient après.',
      })
  }
}

export function resolveGovernance(
  stepId: string,
  tool?: ToolId,
  phase?: ProjectPhase,
  override?: StepGovernance,
  intensity = 0,
  locale: 'fr' | 'en' = 'fr',
): StepGovernance {
  if (locale === 'en') {
    return resolveGovernanceEn(stepId, tool, phase, override, intensity)
  }
  return (
    override ??
    CURATED_GOVERNANCE[stepId] ??
    defaultGovernanceForTool(tool, phase, stepId, intensity)
  )
}
