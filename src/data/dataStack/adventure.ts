/** PM Game — exercices pratiques sur un projet Data/IA (outils au bon moment). */

import type { ProjectPhase, ToolId } from './tools'
import { CODE_FOCUS_TOOLS, isCodeFocusTool, PHASE_LABELS, PHASE_LABELS_EN, STACK_TOOLS } from './tools'
import { PRACTICE_EXERCISES, type PracticeExercise } from './exercises'
import { GAME_DATASETS } from './gameDatasets'
import {
  resolveGovernance,
  type StepGovernance,
} from './governancePacks'
import {
  resolveProjectMgmt,
  type StepProjectMgmt,
} from './pmPacks'
import { dataDoDForStep } from './operationalDoD'
import type { PmGameLocale } from '../../i18n/pmGameLocale'
import type { RoleTrack } from './projectPaths'
import type { MeetingStep } from './pmGovTypes'

export type { StepGovernance } from './governancePacks'
export type { StepProjectMgmt } from './pmPacks'

/** Format attendu dans la zone « Colle ton livrable ». */
export type StepExpect = 'text' | 'python' | 'sql' | 'screenshot'

export function expectForTool(tool: ToolId | undefined): StepExpect {
  if (!tool) return 'text'
  if (
    tool === 'sql' ||
    tool === 'bigquery' ||
    tool === 'dbt' ||
    tool === 'cloudsql'
  ) {
    return 'sql'
  }
  if (
    tool === 'python' ||
    tool === 'airflow' ||
    tool === 'spark' ||
    tool === 'databricks'
  ) {
    return 'python'
  }
  if (tool === 'powerbi' || tool === 'looker') return 'screenshot'
  return 'text'
}

export { CODE_FOCUS_TOOLS, isCodeFocusTool }

export function expectMeta(
  expect: StepExpect,
  locale: PmGameLocale = 'fr',
): { title: string; hint: string } {
  const en = locale === 'en'
  switch (expect) {
    case 'python':
      return {
        title: en ? 'Python script' : 'Script Python',
        hint: en
          ? 'Notebook style: paste your Python code (Tab = indent).'
          : 'Format notebook : colle ton code Python (Tab = indentation).',
      }
    case 'sql':
      return {
        title: en ? 'SQL script' : 'Script SQL',
        hint: en
          ? 'Notebook style: paste your SQL like in a code cell.'
          : 'Format notebook : colle ta requête SQL comme dans une cellule code.',
      }
    case 'screenshot':
      return {
        title: en ? 'Screenshot' : 'Capture d’écran',
        hint: en
          ? 'Attach an image (dashboard, tool screen) and a short comment.'
          : 'Joins une image (dashboard, écran outil) et un court commentaire.',
      }
    default:
      return {
        title: en ? 'Text answer' : 'Réponse texte',
        hint: en
          ? 'Write or paste your free-text deliverable.'
          : 'Rédige ou colle ton livrable en texte libre.',
      }
  }
}

/** Indice piège par défaut (niveaux infinis / fallback). */
export function defaultTrapForTool(tool: ToolId | undefined): string {
  switch (tool) {
    case 'confluence':
      return 'Une décision sans conséquences documentées sera rediscutée à chaque comité — l’ADR doit trancher.'
    case 'jira':
      return 'Une story sans critère d’acceptation chiffré n’est pas testable : « ça marche » ne passe pas en revue.'
    case 'sql':
      return 'Avant de joindre ou compter, normalise les clés (casse, espaces, NULL) — sinon tu sous/surestimes les volumes.'
    case 'python':
      return 'Un script non idempotent (append aveugle, chemins non datés) duplique les données au moindre rejeu.'
    case 'gcs':
      return 'Sans préfixe daté (dt=YYYY-MM-DD), sensors Airflow et rejeu d’un jour deviennent impossibles.'
    case 'cloudsql':
      return 'Sans lookback sur updated_at, les mises à jour tardives (late arriving) disparaîtront du mart.'
    case 'bigquery':
      return 'Un filtre date wrappé (CAST/FORMAT) peut casser le partition pruning → full scan et facture explosive.'
    case 'dbt':
      return 'Des tests unique/not_null sur la mauvaise couche (staging brut SCD) échouent ou laissent passer des KPI faux.'
    case 'spark':
    case 'databricks':
      return 'Une clé « inconnue / 0 » peut concentrer le shuffle : le job timeout alors que le cluster semble idle.'
    case 'airflow':
      return 'Le path du sensor doit coller exactement au fichier landing (dt={{ ds }} inclus) — un typo = DAG stuck.'
    case 'datagalaxy':
      return 'Une définition KPI sans lien technique (table/colonne) reste orpheline : chacun recalcule « à sa façon ».'
    case 'powerbi':
    case 'looker':
      return 'Joindre deux faits au mauvais grain (jour vs créneau, avec/sans magasin) multiplie les lignes et fausse les totaux.'
    default:
      return 'Vérifie le grain, les clés de jointure et les valeurs NULL avant de valider ton livrable.'
  }
}

export interface AdventureDataset {
  href: string
  label: string
  hint?: string
}

/** Briefing type « vrai projet » avant les tâches. */
export interface ProjectBrief {
  context: string
  projectName: string
  problem: string
  objectives: string[]
  consigne: string
}

export interface AdventureStep {
  id: string
  title: string
  say: string
  do: string
  how: string[]
  /** Alerte piège / difficulté à afficher dans la consigne (si présent). */
  trap?: string
  expect: StepExpect
  placeholder?: string
  dataset?: AdventureDataset
  /** Fichiers complémentaires à télécharger pour la même tâche. */
  alsoDownload?: AdventureDataset[]
  validate: {
    minLength?: number
    keywords?: string[]
    keywordMin?: number
    /** Toutes ces sous-chaînes doivent être présentes. */
    mustInclude?: string[]
    /** Regex (flags i) — au moins patternMin doivent matcher. */
    patterns?: string[]
    patternMin?: number
    requireFile?: boolean
  }
  feedbackPass: string
  feedbackFail: string
  correction: string
  tool?: ToolId
  phase?: ProjectPhase
  /** QCM gestion de projet (gestion de projet / Scrum / agile à l’échelle) avant le livrable technique. */
  projectMgmt?: StepProjectMgmt
  /** Lien gouvernance + question à résoudre (toujours enrichi via resolveGovernance). */
  governance?: StepGovernance
  /**
   * Definition of Done data (technico-fonctionnelle) : rappel pendant le livrable
   * technique — KPI, qualité, Owner, RGPD/accès selon l’outil.
   */
  dataDoD?: string[]
  /**
   * Reunion simulee declenchee AVANT le livrable technique de cette etape.
   * Injectee dynamiquement par getMeetingForStep() -- ne pas renseigner manuellement.
   */
  meeting?: MeetingStep
}

export interface AdventureLevel {
  id: number
  title: string
  intro: string
  brief: ProjectBrief
  phase: ProjectPhase
  tools: ToolId[]
  steps: AdventureStep[]
  endless?: boolean
}

const DS = GAME_DATASETS

const CURATED: AdventureLevel[] = [
  {
    id: 0,
    title: 'Fondations — SQL & Python sur fichiers',
    intro: 'Premier jour : tu manipules les sources en scripts, pas à la souris.',
    brief: {
      projectName: 'Mutualis Retail — scripts de découverte',
      context:
        'Tu rejoins l’équipe data Mutualis. L’objectif du jeu : maîtriser SQL / Python / Spark (Databricks) et la stack GCP, plus delivery & gouvernance.',
      problem:
        'Sans scripts reproductibles ni orchestration, chaque analyste clique dans son fichier perso — zéro industrialisation.',
      objectives: [
        'Lire un CSV en pandas et inspecter le schéma.',
        'Filtrer les employés actifs en Python (SCD).',
        'Écrire un premier SELECT SQL d’exploration.',
      ],
      consigne:
        'Télécharge le fichier, écris le script notebook, puis réponds aussi à la question de gouvernance data. Une tâche à la fois.',
    },
    phase: 'ingestion',
    tools: ['python', 'sql'],
    steps: [
      {
        id: 'l0-open',
        title: 'Python — inspecter le schéma employés',
        say: 'Télécharge retail_employees.csv. En pandas, charge le fichier et liste les colonnes.',
        do: 'Colle un script Python qui lit le CSV et affiche les colonnes (df.columns / print).',
        how: [
          'import pandas as pd',
          'df = pd.read_csv("retail_employees.csv")',
          'print(list(df.columns)) ou print(df.dtypes)',
        ],
        trap:
          'Ne te contente pas de recopier l’en-tête à la main : le script doit lire le fichier (read_csv). Sinon tu n’as rien automatisé.',
        expect: 'python',
        dataset: DS.retailEmployees,
        validate: {
          minLength: 28,
          mustInclude: ['read'],
          keywords: ['pandas', 'csv', 'columns', 'dtype', 'head', 'import'],
          keywordMin: 2,
        },
        feedbackPass: 'Schéma lu par script — bon réflexe data eng.',
        feedbackFail: 'Il me faut un read_csv (ou équivalent) + inspection des colonnes.',
        correction:
          '```python\nimport pandas as pd\ndf = pd.read_csv("retail_employees.csv")\nprint(list(df.columns))\nprint(df.dtypes)\n```\nColonnes typiques : employee_id, employee_name, department, region, active_record, …',
        tool: 'python',
        phase: 'ingestion',
      },
      {
        id: 'l0-filter',
        title: 'Python — filtre active_record = 1',
        say: 'Le métier ne veut que les fiches actives (SCD). Filtre en pandas et compte les lignes.',
        do: 'Colle un script qui filtre active_record == 1 et affiche len / shape.',
        how: [
          'df[df["active_record"] == 1]',
          'print(len(actifs)) — attendu autour de 500',
          'Option : actifs["department"].value_counts()',
        ],
        trap:
          'active_record = 0 = anciennes versions de fiche, pas « salarié parti ». Ne filtre pas sur department seul.',
        expect: 'python',
        dataset: DS.retailEmployees,
        validate: {
          minLength: 35,
          keywords: ['active_record', 'active', 'pandas', 'loc', 'query', 'len', 'shape', '=='],
          keywordMin: 2,
          patterns: ['active_record', '\\b500\\b', 'len\\(|\\.shape'],
          patternMin: 1,
        },
        feedbackPass: 'Filtre SCD scripté — prêt pour un job quotidien.',
        feedbackFail: 'Montre le filtre active_record et un comptage (len / shape).',
        correction:
          '```python\nimport pandas as pd\ndf = pd.read_csv("retail_employees.csv")\nactifs = df[df["active_record"] == 1]\nprint(len(actifs))  # ≈ 500\nprint(actifs["department"].value_counts())\n```',
        tool: 'python',
        phase: 'ingestion',
      },
      {
        id: 'l0-sql',
        title: 'SQL — premier SELECT sur employés',
        say: 'Même fichier, logique SQL : SELECT des actifs, GROUP BY department.',
        do: 'Colle une requête SQL (SELECT … WHERE active_record = 1 … GROUP BY department).',
        how: [
          'Imagine une table retail_employees chargée depuis le CSV.',
          'COUNT(*) GROUP BY department WHERE active_record = 1.',
        ],
        trap:
          'Oublier le WHERE active_record = 1 mélange historique et actif — les effectifs explosent.',
        expect: 'sql',
        dataset: DS.retailEmployees,
        validate: {
          minLength: 40,
          mustInclude: ['select', 'group by'],
          keywords: ['active_record', 'department', 'where', 'count'],
          keywordMin: 2,
        },
        feedbackPass: 'Même logique métier en SQL — tu compares les deux paradigmes.',
        feedbackFail: 'Il me faut SELECT + WHERE active_record + GROUP BY department.',
        correction:
          '```sql\nSELECT department, COUNT(*) AS n\nFROM retail_employees\nWHERE active_record = 1\nGROUP BY department\nORDER BY n DESC;\n```',
        tool: 'sql',
        phase: 'ingestion',
      },
    ],
  },
  {
    id: 1,
    title: 'Qualité & jointures — SQL / Python',
    intro: 'Avant le mart : qualité CRM et jointures fiables.',
    brief: {
      projectName: 'Mutualis Retail — nettoyage & jointures',
      context:
        'Le CRM sale et les ventes hebdo doivent être fiabilisés en scripts. On pose la logique avant dbt / BI.',
      problem:
        'Des emails en doublon et des jointures mal nettoyées faussent le CA et les effectifs clients.',
      objectives: [
        'Détecter les doublons email en SQL.',
        'Joindre ventes ↔ clients en SQL.',
        'Nettoyer / dédoublonner en Python (pandas).',
      ],
      consigne:
        'Télécharge les CSV indiqués. Colle le SQL/Python et réponds à la question gouvernance (owner, MDM, grain…).',
    },
    phase: 'ingestion',
    tools: ['sql', 'python'],
    steps: [
      {
        id: 'l1-dupes',
        title: 'SQL — doublons email CRM',
        say: 'clients_doublons.csv surestime les clients uniques. Détecte les emails en doublon.',
        do: 'Colle une requête GROUP BY email + HAVING COUNT(*) > 1 (avec LOWER/TRIM).',
        how: [
          'LOWER(TRIM(email))',
          'GROUP BY 1 HAVING COUNT(*) > 1',
          'Ignore email vide / unknown',
        ],
        trap:
          'Les sociétés ne sont pas orthographiées à l’identique — ne te fie pas au nom seul sans LOWER/TRIM sur l’email.',
        expect: 'sql',
        dataset: DS.doublons,
        validate: {
          minLength: 40,
          mustInclude: ['group by'],
          keywords: ['having', 'count', 'email', 'lower', 'trim'],
          keywordMin: 2,
        },
        feedbackPass: 'Qualité CRM traitée comme en projet réel.',
        feedbackFail: 'Il me faut GROUP BY email + HAVING COUNT(*) > 1 (+ LOWER/TRIM idéalement).',
        correction:
          '```sql\nSELECT LOWER(TRIM(email)) AS email_n, COUNT(*) AS c\nFROM clients_doublons\nWHERE NULLIF(LOWER(TRIM(email)), \'\') IS NOT NULL\n  AND LOWER(TRIM(email)) <> \'unknown\'\nGROUP BY 1\nHAVING COUNT(*) > 1;\n```',
        tool: 'sql',
        phase: 'ingestion',
      },
      {
        id: 'l1-join',
        title: 'SQL — CA livré joint au référentiel',
        say: 'Avec ventes_semaine + clients_ref, calcule le CA HT des commandes livrées par segment client.',
        do: 'Colle une requête JOIN + SUM + filtre statut = livree.',
        how: [
          'JOIN clients_ref ON client_id',
          "WHERE statut = 'livree'",
          'GROUP BY segment (ou magasin)',
        ],
        trap:
          'Les commandes « annulee » ne doivent pas entrer dans le CA. Vérifie aussi le type de jointure (INNER vs LEFT).',
        expect: 'sql',
        dataset: DS.ventes,
        alsoDownload: [DS.clients],
        validate: {
          minLength: 50,
          mustInclude: ['join', 'sum'],
          keywords: ['livree', 'client', 'montant', 'group by', 'on '],
          keywordMin: 2,
        },
        feedbackPass: 'Jointure métier + agrégat — cœur du métier data.',
        feedbackFail: 'Il me faut un JOIN, un SUM(montant_ht) et le filtre livree.',
        correction:
          '```sql\nSELECT c.segment, SUM(v.montant_ht) AS ca_ht\nFROM ventes_semaine v\nJOIN clients_ref c ON v.client_id = c.client_id\nWHERE v.statut = \'livree\'\nGROUP BY c.segment\nORDER BY ca_ht DESC;\n```',
        tool: 'sql',
        phase: 'ingestion',
      },
      {
        id: 'l1-py-clean',
        title: 'Python — dédoublonnage pandas',
        say: 'Reproduis le nettoyage CRM en Python : normalise l’email et drop_duplicates.',
        do: 'Colle un script pandas (str.lower/strip + drop_duplicates).',
        how: [
          'df["email_n"] = df["email"].str.lower().str.strip()',
          'df.drop_duplicates(subset=["email_n"])',
          'Compare len avant / après',
        ],
        trap:
          'drop_duplicates sans normalisation laisse passer « A@x.com » et « a@x.com » comme deux clients.',
        expect: 'python',
        dataset: DS.doublons,
        validate: {
          minLength: 40,
          keywords: ['drop_duplicates', 'lower', 'strip', 'email', 'pandas', 'read_csv'],
          keywordMin: 2,
        },
        feedbackPass: 'Même règle métier en Python — tu peux industrialiser les deux.',
        feedbackFail: 'Montre normalisation email + drop_duplicates (ou groupby).',
        correction:
          '```python\nimport pandas as pd\ndf = pd.read_csv("clients_doublons.csv")\ndf["email_n"] = df["email"].astype(str).str.lower().str.strip()\nclean = df.drop_duplicates(subset=["email_n"])\nprint(len(df), "→", len(clean))\n```',
        tool: 'python',
        phase: 'ingestion',
      },
    ],
  },
  {
    id: 2,
    title: 'SQL avancé — agrégats & fenêtres',
    intro: 'Requêtes d’exploration sur les datasets métier du projet.',
    brief: {
      projectName: 'Mutualis — SQL sur datasets projet',
      context:
        'Appartements, capteur retail, football : tu consolides les patterns SQL (GROUP BY, filtres, CASE).',
      problem:
        'Sans requêtes standard, chaque analyste recalcule à sa façon — KPI non auditables.',
      objectives: [
        'Agrégation immobilière par commune.',
        'Jours sous seuil sur le capteur.',
        'CASE / agrégat sportifs (même geste qu’un mart retail).',
      ],
      consigne: 'Télécharge le CSV, écris la requête SQL complète, colle-la dans le notebook.',
    },
    phase: 'ingestion',
    tools: ['sql', 'bigquery'],
    steps: [
      {
        id: 'l2-sql',
        title: 'SQL GROUP BY — appartements',
        say: 'Mutations immobilières : COUNT et AVG(valeur_fonciere) par Commune.',
        do: 'Colle ta requête SQL (GROUP BY Commune).',
        how: [
          'COUNT(*) et AVG(valeur_fonciere) GROUP BY Commune',
          'ORDER BY nb DESC — LIMIT pour tester',
        ],
        trap:
          'Des colonnes ont des espaces (« Date mutation ») : quote-les. La surface Carrez peut utiliser la virgule française.',
        expect: 'sql',
        dataset: DS.appartements,
        validate: {
          minLength: 40,
          mustInclude: ['select', 'group by'],
          keywords: ['commune', 'count', 'avg', 'valeur'],
          keywordMin: 2,
        },
        feedbackPass: 'Agrégation SQL posée sur une vraie base métier.',
        feedbackFail: 'Il me faut SELECT + GROUP BY (Commune) et un agrégat COUNT/AVG.',
        correction:
          '```sql\nSELECT Commune,\n       COUNT(*) AS nb_mutations,\n       AVG(valeur_fonciere) AS vf_moyenne\nFROM appartements_nord_pdc\nGROUP BY Commune\nORDER BY nb_mutations DESC;\n```',
        tool: 'sql',
        phase: 'ingestion',
      },
      {
        id: 'l2-capteur',
        title: 'SQL — jours sous seuil capteur',
        say: 'capteur_a_retail : jours où visiteurs_count < threshold_twenty_pct.',
        do: 'Colle une requête SQL avec le filtre sur threshold_twenty_pct.',
        how: [
          'WHERE visiteurs_count < threshold_twenty_pct',
          'SELECT date, visiteurs_count, threshold_twenty_pct',
        ],
        trap:
          'N’invente pas « 20 % » à la main : utilise la colonne threshold_twenty_pct ligne à ligne.',
        expect: 'sql',
        dataset: DS.capteur,
        validate: {
          minLength: 40,
          mustInclude: ['select', 'where'],
          keywords: ['threshold', 'visiteur', 'select'],
          keywordMin: 2,
          patterns: ['threshold_twenty_pct', '2023-08-1[47]'],
          patternMin: 1,
        },
        feedbackPass: 'Signal ops lu en SQL — prêt pour un alerting.',
        feedbackFail: 'Filtre visiteurs vs threshold_twenty_pct (ou dates 2023-08-14 / 17).',
        correction:
          '```sql\nSELECT date, visiteurs_count, threshold_twenty_pct\nFROM capteur_a_retail\nWHERE visiteurs_count < threshold_twenty_pct;\n```\nJours typiques : 2023-08-14 et 2023-08-17.',
        tool: 'sql',
        phase: 'ingestion',
      },
      {
        id: 'l2-foot',
        title: 'SQL — CASE WHEN / HomeTeam',
        say: 'football_season_1011 : matchs et victoires domicile (FTR = H) par HomeTeam.',
        do: 'Colle une requête avec GROUP BY HomeTeam et CASE WHEN FTR = \'H\'.',
        how: [
          "SUM(CASE WHEN FTR = 'H' THEN 1 ELSE 0 END)",
          "WHERE Div = 'F1' optionnel",
        ],
        trap:
          'Dates au format JJ/MM/AA — ne les parse pas comme MM/JJ/AAAA.',
        expect: 'sql',
        dataset: DS.football,
        alsoDownload: [DS.footballNotes],
        validate: {
          minLength: 50,
          mustInclude: ['group by', 'hometeam'],
          keywords: ['case', 'ftr', 'count', 'when', 'sum'],
          keywordMin: 2,
        },
        feedbackPass: 'CASE + agrégat — pattern de mart KPI.',
        feedbackFail: 'GROUP BY HomeTeam + CASE sur FTR = H.',
        correction:
          '```sql\nSELECT HomeTeam,\n       COUNT(*) AS nb_matchs,\n       SUM(CASE WHEN FTR = \'H\' THEN 1 ELSE 0 END) AS victoires_domicile\nFROM football_season_1011\nWHERE Div = \'F1\'\nGROUP BY HomeTeam\nORDER BY victoires_domicile DESC;\n```',
        tool: 'sql',
        phase: 'ingestion',
      },
      {
        id: 'l2-window',
        title: 'SQL — fenêtre sur le CA retail',
        say: 'Sur weights_turnover_sample : classements / running total par magasin (fenêtre).',
        do: 'Colle une requête avec OVER (PARTITION BY … ORDER BY …) — RANK ou SUM.',
        how: [
          'PARTITION BY store_name',
          'SUM(turnover_weight) OVER (...) ou RANK()',
        ],
        trap:
          'Sans PARTITION BY store_name, tu classes tous les magasins ensemble — le ranking métier n’a plus de sens.',
        expect: 'sql',
        dataset: DS.weightsSample,
        validate: {
          minLength: 45,
          mustInclude: ['over'],
          keywords: ['partition', 'rank', 'sum', 'order by', 'store', 'turnover'],
          keywordMin: 2,
        },
        feedbackPass: 'Window functions — niveau senior SQL data.',
        feedbackFail: 'Il me faut une clause OVER (… PARTITION BY …).',
        correction:
          '```sql\nSELECT store_name, time_slot, turnover_weight,\n       SUM(turnover_weight) OVER (\n         PARTITION BY store_name ORDER BY time_slot\n       ) AS running_weight,\n       RANK() OVER (\n         PARTITION BY store_name ORDER BY turnover_weight DESC\n       ) AS rnk\nFROM weights_turnover_sample;\n```',
        tool: 'bigquery',
        phase: 'ingestion',
      },
    ],
  },
  {
    id: 3,
    title: 'Python ETL & dbt SQL',
    intro: 'Transformer : JSON, pandas, modèles dbt.',
    brief: {
      projectName: 'Mutualis — Python & dbt',
      context:
        'JSON machine, SCD employés, modèles staging→mart : tu industrialises la transformation en code.',
      problem:
        'Sans parsing JSON, filtre SCD ni couches dbt, le mart mélange historique et actif.',
      objectives: [
        'Parser le JSON machine en Python.',
        'Pipeline pandas CSV → clean → export.',
        'Écrire stg_ / mart_ en SQL dbt + tests.',
      ],
      consigne: 'Scripts complets uniquement — pas de résumé texte.',
    },
    phase: 'transformation',
    tools: ['python', 'dbt', 'sql'],
    steps: [
      {
        id: 'l3-json',
        title: 'Python — parser drill_machine.json',
        say: 'Extrais machine_id, status et location.region via json.load.',
        do: 'Colle un script Python complet (open + json.load + print des 3 champs).',
        how: [
          'import json',
          'data["machine_id"], data["status"], data["location"]["region"]',
        ],
        trap:
          'region est imbriquée sous location — data["region"] lève une KeyError.',
        expect: 'python',
        dataset: DS.drillMachine,
        validate: {
          minLength: 40,
          mustInclude: ['json'],
          keywords: ['load', 'machine_id', 'status', 'location', 'region', 'open'],
          keywordMin: 2,
        },
        feedbackPass: 'Parsing JSON OK — geste Python de base en projet.',
        feedbackFail: 'Script avec json.load + accès machine_id / status / location.region.',
        correction:
          '```python\nimport json\nwith open("drill_machine.json", encoding="utf-8") as f:\n    data = json.load(f)\nprint(data["machine_id"], data["status"], data["location"]["region"])\n```\n→ DM-2 · Under Maintenance · San Juan Basin',
        tool: 'python',
        phase: 'transformation',
      },
      {
        id: 'l3-py',
        title: 'Python — ETL employés actifs',
        say: 'Pipeline : read_csv → filtre active_record == 1 → to_csv.',
        do: 'Colle le script pandas complet (lecture, filtre, écriture).',
        how: [
          'actifs = df[df["active_record"] == 1]',
          'actifs.to_csv("employees_actifs.csv", index=False)',
        ],
        trap:
          'Certaines lignes OFFICE ont region vide — un groupby region sans fillna crée un bucket trompeur.',
        expect: 'python',
        dataset: DS.retailEmployees,
        validate: {
          minLength: 50,
          keywords: ['read_csv', 'to_csv', 'active_record', 'pandas'],
          keywordMin: 2,
        },
        feedbackPass: 'ETL pandas industrialisable.',
        feedbackFail: 'Montre read_csv + filtre active_record + to_csv.',
        correction:
          '```python\nimport pandas as pd\ndf = pd.read_csv("retail_employees.csv")\nactifs = df[df["active_record"] == 1]\nactifs.to_csv("employees_actifs.csv", index=False)\n```',
        tool: 'python',
        phase: 'transformation',
      },
      {
        id: 'l3-py-merge',
        title: 'Python — merge ventes × clients',
        say: 'En pandas, joint ventes_semaine et clients_ref, filtre livree, agrège le CA.',
        do: 'Colle un script merge + groupby + sum.',
        how: [
          'pd.merge(..., on="client_id")',
          "query statut == 'livree'",
          'groupby("segment" ou "magasin")["montant_ht"].sum()',
        ],
        trap:
          'Un merge sans valider les clés (dtypes / espaces) produit des NaN silencieux sur le CA.',
        expect: 'python',
        dataset: DS.ventes,
        alsoDownload: [DS.clients],
        validate: {
          minLength: 55,
          keywords: ['merge', 'groupby', 'montant', 'livree', 'sum', 'read_csv'],
          keywordMin: 2,
        },
        feedbackPass: 'Jointure pandas — miroir du SQL JOIN.',
        feedbackFail: 'Il me faut merge + filtre livree + agrégation sum.',
        correction:
          '```python\nimport pandas as pd\nv = pd.read_csv("ventes_semaine.csv")\nc = pd.read_csv("clients_ref.csv")\nm = v.merge(c, on="client_id", how="inner")\nca = (\n    m[m["statut"] == "livree"]\n    .groupby("segment")["montant_ht"]\n    .sum()\n    .sort_values(ascending=False)\n)\nprint(ca)\n```',
        tool: 'python',
        phase: 'transformation',
      },
      {
        id: 'l3-dbt',
        title: 'dbt SQL — staging → mart',
        say: 'Pose stg_ + mart_ employés actifs + un test unique/not_null.',
        do: 'Colle le SQL dbt (stg_… / mart_…) et les tests.',
        how: [
          'stg_spark__retail_employees',
          'mart_employees_actifs WHERE active_record = 1',
          'tests unique + not_null sur employee_id (mart)',
        ],
        trap:
          'unique(employee_id) sur le staging brut échoue (versions SCD). Place le test sur le mart filtré.',
        expect: 'sql',
        dataset: DS.retailEmployees,
        validate: {
          minLength: 40,
          mustInclude: ['stg', 'mart'],
          keywords: ['unique', 'not_null', 'active', 'select', 'where', 'ref'],
          keywordMin: 2,
        },
        feedbackPass: 'Couches dbt posées — transformation versionnée.',
        feedbackFail: 'Cite stg_ + mart_ et un test unique / not_null.',
        correction:
          '```sql\n-- stg_spark__retail_employees.sql\nSELECT * FROM {{ source(\'spark\', \'retail_employees\') }};\n\n-- mart_employees_actifs.sql\nSELECT * FROM {{ ref(\'stg_spark__retail_employees\') }}\nWHERE active_record = 1;\n```\nTests YAML : not_null + unique sur employee_id du mart.',
        tool: 'dbt',
        phase: 'transformation',
      },
    ],
  },
  {
    id: 4,
    title: 'KPI en code — SQL métriques & Python grain',
    intro: 'La gouvernance et la BI commencent par des définitions exécutables.',
    brief: {
      projectName: 'Mutualis — métriques certifiées en scripts',
      context:
        'Avant Power BI / DataGalaxy, tu codes la définition KPI et le croisement de grains.',
      problem:
        'Sans requête de référence, deux dashboards comparent des « intensités CA » incomparables.',
      objectives: [
        'Écrire la requête KPI de référence (SQL).',
        'Croiser fréquentation × intensité en SQL ou Python.',
        'Esquisser une mesure (commentaire SQL/DAX) — capture optionnelle.',
      ],
      consigne:
        'Priorité au code. Une capture BI n’est utile qu’après la requête de vérité.',
    },
    phase: 'gouvernance',
    tools: ['sql', 'python', 'powerbi'],
    steps: [
      {
        id: 'l4-kpi-sql',
        title: 'SQL — requête KPI intensité CA',
        say: 'Définis le KPI « intensité CA » comme une requête : SUM(turnover_weight) par magasin / jour.',
        do: 'Colle la requête SQL de référence (GROUP BY store_name, date éventuelle).',
        how: [
          'SUM(turnover_weight) GROUP BY store_name',
          'Documente le grain en commentaire SQL',
        ],
        trap:
          'Sans préciser le grain (magasin / jour / créneau), deux directions compareront des totaux faux.',
        expect: 'sql',
        dataset: DS.weightsSample,
        alsoDownload: [DS.weightsTurnover],
        validate: {
          minLength: 40,
          mustInclude: ['sum', 'group by'],
          keywords: ['turnover', 'store', 'weight', 'select'],
          keywordMin: 2,
        },
        feedbackPass: 'KPI = requête versionnable — base de gouvernance.',
        feedbackFail: 'Il me faut SUM(turnover_weight) + GROUP BY magasin.',
        correction:
          '```sql\n-- Grain : magasin (échantillon) — documenter owner Retail\nSELECT store_name,\n       SUM(turnover_weight) AS intensite_ca\nFROM weights_turnover_sample\nGROUP BY store_name\nORDER BY intensite_ca DESC;\n```',
        tool: 'sql',
        phase: 'gouvernance',
      },
      {
        id: 'l4-grain',
        title: 'Python — aligner grains capteur × CA',
        say: 'capteur = 1 ligne/jour ; weights = magasin×créneau. Écris un script qui agrège puis (conceptuellement) joint sur la date.',
        do: 'Colle un script Python (groupby date / merge) ou un pseudo-code exécutable clair.',
        how: [
          'weights.groupby("date")["turnover_weight"].sum()',
          'merge avec capteur sur date',
          'ratio intensité / visiteurs',
        ],
        trap:
          'Joindre sans agréger multiplie les lignes (créneaux × jour) et fausse les totaux.',
        expect: 'python',
        dataset: DS.capteur,
        alsoDownload: [DS.weightsSample],
        validate: {
          minLength: 50,
          keywords: ['groupby', 'merge', 'date', 'sum', 'visiteur', 'turnover', 'read_csv'],
          keywordMin: 2,
        },
        feedbackPass: 'Tu raisonnes grain avant dashboard — essentiel.',
        feedbackFail: 'Montre une agrégation puis un merge sur la date.',
        correction:
          '```python\nimport pandas as pd\ncap = pd.read_csv("capteur_a_retail.csv")\nw = pd.read_csv("weights_turnover_sample.csv")\n# adapter le nom de colonne date selon le fichier\ndaily = w.groupby("date", as_index=False)["turnover_weight"].sum()\nout = daily.merge(cap, on="date", how="inner")\nout["ratio"] = out["turnover_weight"] / out["visiteurs_count"]\nprint(out.head())\n```',
        tool: 'python',
        phase: 'exposition',
      },
      {
        id: 'l4-pbi',
        title: 'Mesure BI (après la vérité SQL)',
        say: 'Maintenant seulement : propose la mesure DAX/équivalent alignée sur ta requête KPI, avec capture optionnelle.',
        do: 'Colle la mesure (SUM…) et joins une capture si tu as Power BI / Looker / Sheets.',
        how: [
          'Mesure = SUM(turnover_weight) — même grain que la requête',
          'Capture du visuel par store_name (fichier optionnel)',
        ],
        trap:
          'Une belle carte Power BI qui ne matche pas la requête SQL de référence n’a aucune valeur en comité.',
        expect: 'screenshot',
        dataset: DS.weightsSample,
        validate: {
          requireFile: false,
          minLength: 12,
          keywords: ['sum', 'turnover', 'weight', 'dax', 'mesure', 'store'],
          keywordMin: 1,
        },
        feedbackPass: 'BI branchée sur une définition SQL — bon ordre.',
        feedbackFail: 'Écris au moins la mesure SUM(turnover_weight) (capture bonus).',
        correction:
          'Intensité CA = SUM(weights[turnover_weight]) — doit matcher la requête l4-kpi-sql.',
        tool: 'powerbi',
        phase: 'exposition',
      },
    ],
  },
  {
    id: 5,
    title: 'Ops en code — DAG & jobs',
    intro: 'Le pipeline tourne : Airflow + jobs Python/SQL.',
    brief: {
      projectName: 'Mutualis — orchestration scriptée',
      context:
        'Chaque matin : sensor landing → transform SQL/Python → publication. Tu codes l’ops.',
      problem:
        'Sans sensor ni retries, un CSV en retard fait rater le COMEX.',
      objectives: [
        'Écrire un squelette DAG Airflow en Python.',
        'Esquisser la task de transform (SQL ou pandas).',
        'Documenter le runbook en commentaires de code.',
      ],
      consigne: 'Livrables = scripts. Les outils hors code restent secondaires.',
    },
    phase: 'ops',
    tools: ['airflow', 'python', 'sql'],
    steps: [
      {
        id: 'l5-af',
        title: 'Python — squelette DAG Airflow',
        say: 'Le CSV capteur arrive en landing chaque matin. Esquisse le DAG : sensor → transform → notify.',
        do: 'Colle un squelette Python DAG (with DAG / tasks chaînées).',
        how: [
          'schedule_interval / timetable matin',
          'FileSensor path …/dt={{ ds }}/capteur_a_retail.csv',
          'retries = 2',
        ],
        trap:
          'Le path du FileSensor doit coller au fichier landing (dt={{ ds }}) — un typo = DAG stuck.',
        expect: 'python',
        dataset: DS.capteur,
        validate: {
          minLength: 40,
          keywords: ['dag', 'sensor', 'schedule', 'retry', 'task', 'op_', 'python'],
          keywordMin: 2,
        },
        feedbackPass: 'Ops industrialisée en code.',
        feedbackFail: 'Montre DAG + sensor → traitement (+ schedule / retries).',
        correction:
          '```python\nfrom airflow import DAG\nfrom airflow.sensors.filesystem import FileSensor\nfrom airflow.operators.bash import BashOperator\nwith DAG("mutualis_capteur", schedule="0 6 * * *", catchup=False) as dag:\n    sensor = FileSensor(task_id="wait_landing", filepath="/landing/capteur/dt={{ ds }}/capteur_a_retail.csv", retries=2)\n    transform = BashOperator(task_id="transform", bash_command="python transform_capteur.py {{ ds }}")\n    sensor >> transform\n```',
        tool: 'airflow',
        phase: 'ops',
      },
      {
        id: 'l5-transform',
        title: 'SQL/Python — task de transform',
        say: 'La task appelée par le DAG : filtre jours sous seuil (SQL) OU pandas équivalent.',
        do: 'Colle le script SQL ou Python que la task exécute.',
        how: [
          'SQL : WHERE visiteurs_count < threshold_twenty_pct',
          'ou pandas : df.query(...) puis to_csv / to_gbq',
        ],
        trap:
          'Une task sans argument de date (ds) recharge toujours « aujourd’hui » et casse le rejeu.',
        expect: 'sql',
        dataset: DS.capteur,
        validate: {
          minLength: 35,
          keywords: ['select', 'where', 'threshold', 'visiteur', 'read_csv', 'query', 'to_csv'],
          keywordMin: 2,
        },
        feedbackPass: 'Transform versionnable — le cœur du DAG.',
        feedbackFail: 'Colle le filtre seuil en SQL ou le pipeline pandas.',
        correction:
          '```sql\nSELECT *\nFROM capteur_a_retail\nWHERE visiteurs_count < threshold_twenty_pct\n  AND date = DATE \'{{ ds }}\';\n```\nou équivalent pandas avec sys.argv / ds.',
        tool: 'sql',
        phase: 'ops',
      },
      {
        id: 'l5-cap',
        title: 'Python — runbook pipeline en docstring',
        say: 'Synthèse exécutable : un module Python dont la docstring décrit les 6 étapes du pipeline Mutualis (avec datasets).',
        do: 'Colle un fichier .py avec docstring + éventuellement une fonction main() qui liste les étapes.',
        how: [
          'Docstring : discovery → qualité SQL → ETL Python → dbt → KPI SQL → Airflow',
          'Cite retail_employees, capteur, weights, ventes…',
        ],
        trap:
          'Une liste d’outils sans scripts associés n’est pas un runbook ops.',
        expect: 'python',
        dataset: DS.retailEmployees,
        validate: {
          minLength: 80,
          keywords: ['sql', 'python', 'dbt', 'airflow', 'def', '"""', "'''", 'pipeline', 'landing'],
          keywordMin: 3,
        },
        feedbackPass: 'Vision bout-en-bout ancrée dans le code.',
        feedbackFail: 'Docstring / script citant au moins SQL, Python, dbt ou Airflow.',
        correction:
          '```python\n"""Pipeline Mutualis\n1. Discovery pandas retail_employees\n2. Qualité SQL doublons CRM\n3. ETL Python ventes×clients\n4. dbt stg→mart\n5. KPI SQL intensité CA\n6. Airflow sensor capteur\n"""\ndef main():\n    steps = ["sql", "python", "dbt", "airflow"]\n    print(" → ".join(steps))\n\nif __name__ == "__main__":\n    main()\n```',
        tool: 'python',
        phase: 'ops',
      },
    ],
  },
]

function toolName(id: ToolId): string {
  return STACK_TOOLS.find((t) => t.id === id)?.name ?? id
}

function phaseOfTool(id: ToolId): ProjectPhase {
  return STACK_TOOLS.find((t) => t.id === id)?.phase ?? 'cadrage'
}

function datasetForTool(tool: ToolId): AdventureDataset | undefined {
  if (tool === 'python') return DS.drillMachine
  if (tool === 'spark' || tool === 'databricks') return DS.retailEmployees
  if (tool === 'sql') return DS.doublons
  if (tool === 'bigquery' || tool === 'dbt') return DS.appartements
  if (tool === 'powerbi' || tool === 'looker') return DS.weightsSample
  if (tool === 'datagalaxy') return DS.weightsTurnover
  if (tool === 'airflow' || tool === 'gcs' || tool === 'cloudsql') return DS.capteur
  return DS.retailEmployees
}

/** Endless : 1 étape = mise en situation + livrable à manipuler (décision PM/gov ajoutée à l’enrichissement). */
function exerciseToSteps(ex: PracticeExercise, intensity: number): AdventureStep[] {
  const prefix = `e${intensity}-${ex.id}`
  const expect = expectForTool(ex.tool)
  const situation = `Situation Mutualis — ${ex.context}`
  const practiceLead = `Manipulation pratique (${toolName(ex.tool)}) : ${ex.description}`
  return [
    {
      id: `${prefix}-work`,
      title: `${toolName(ex.tool)} — ${ex.title}`,
      say: `${situation}\n\n${practiceLead}${
        intensity > 5 ? `\n\nNiveau M${intensity} : sois plus précis, comme en revue de code.` : ''
      }`,
      do: `Manipule l’outil et produis le livrable demandé.\nÀ faire : ${ex.tasks.join(' · ')}`,
      how: ex.steps.map((s) => `${s.title} — ${s.detail}`),
      trap:
        ex.trap ??
        (intensity > 6
          ? `${defaultTrapForTool(ex.tool)} Niveau M${intensity} : documente aussi comment tu détectes l’erreur.`
          : defaultTrapForTool(ex.tool)),
      expect,
      dataset: datasetForTool(ex.tool),
      placeholder:
        expect === 'sql'
          ? '-- Ta requête SQL…'
          : expect === 'python'
            ? '# Ton script Python…'
            : expect === 'screenshot'
              ? 'Décris ce que montre ta capture…'
              : 'Colle ton livrable…',
      validate:
        expect === 'screenshot'
          ? { requireFile: true, minLength: 12, keywordMin: 1, keywords: ['mesure', 'filtre', 'sum', 'visual', 'dashboard', 'kpi'] }
          : expect === 'sql'
            ? {
                minLength: 28 + Math.min(20, intensity),
                keywords: ['select', 'from', 'where', 'group', 'join', 'with'],
                keywordMin: 2,
              }
            : expect === 'python'
              ? {
                  minLength: 28 + Math.min(20, intensity),
                  keywords: ['import', 'def', 'read', 'pandas', 'json', 'dag', 'for', 'if'],
                  keywordMin: 2,
                }
              : {
                  minLength: 40 + Math.min(30, intensity),
                  keywords: ['kpi', 'owner', 'risque', 'sla', 'test', 'mart', 'landing', 'pipeline'],
                  keywordMin: 1,
                },
      feedbackPass: 'Manipulation validée — on avance.',
      feedbackFail:
        expect === 'screenshot'
          ? 'Joins une capture d’écran et un court commentaire sur ce que tu as manipulé.'
          : 'Enrichis le livrable : montre concrètement ce que tu as manipulé dans l’outil.',
      correction: ex.modelSolution,
      tool: ex.tool,
      phase: phaseOfTool(ex.tool),
      // Placeholders : enrichStep injecte les vrais packs PM + gouvernance
      projectMgmt: undefined,
      governance: undefined,
    },
  ]
}

const PHASE_CYCLE: ProjectPhase[] = [
  'cadrage',
  'ingestion',
  'transformation',
  'gouvernance',
  'exposition',
  'ops',
]

function exercisesForPhase(phase: ProjectPhase): PracticeExercise[] {
  const toolIds = new Set(STACK_TOOLS.filter((t) => t.phase === phase).map((t) => t.id))
  const list = PRACTICE_EXERCISES.filter((e) => toolIds.has(e.tool))
  return list.length > 0 ? list : PRACTICE_EXERCISES
}

function codePracticePool(): PracticeExercise[] {
  return PRACTICE_EXERCISES.filter((e) => isCodeFocusTool(e.tool))
}

function rankExercises(
  pool: PracticeExercise[],
  preferTools: ToolId[],
): PracticeExercise[] {
  const prefer = new Set(preferTools)
  return [...pool].sort((a, b) => {
    const ac = isCodeFocusTool(a.tool) ? 0 : 1
    const bc = isCodeFocusTool(b.tool) ? 0 : 1
    if (ac !== bc) return ac - bc
    const aw = prefer.has(a.tool) ? 0 : 1
    const bw = prefer.has(b.tool) ? 0 : 1
    if (aw !== bw) return aw - bw
    return a.id.localeCompare(b.id)
  })
}

/** Cœur technique prioritaire : SQL + Python (renforcement compétences). */
const CORE_CODE_TOOLS: ToolId[] = ['sql', 'python', 'bigquery', 'dbt', 'spark', 'databricks']

function coreCodePool(): PracticeExercise[] {
  return PRACTICE_EXERCISES.filter((e) => CORE_CODE_TOOLS.includes(e.tool))
}

function exercisePoolForRole(
  phase: ProjectPhase,
  preferTools: ToolId[],
  projectKind: ProjectKind,
): PracticeExercise[] {
  const preferSet = new Set(preferTools)
  const roleScoped = (pool: PracticeExercise[]) => {
    const hit = pool.filter((ex) => preferSet.has(ex.tool))
    return hit.length > 0 ? hit : pool
  }

  const corePool = coreCodePool()
  const codePool = codePracticePool()
  const phasePool = exercisesForPhase(phase)

  if (projectKind === 'data-ai') {
    const dataPool = roleScoped(
      corePool.filter((ex) => preferSet.has(ex.tool)).length > 0
        ? corePool.filter((ex) => preferSet.has(ex.tool))
        : corePool.length > 0
          ? corePool
          : codePool,
    )
    const ranked = rankExercises(
      dataPool.length > 0 ? dataPool : PRACTICE_EXERCISES.filter((e) => preferSet.has(e.tool)),
      preferTools,
    )
    return ranked.length > 0 ? ranked : rankExercises(PRACTICE_EXERCISES, preferTools)
  }

  const platformPool = roleScoped(phasePool.filter((ex) => !isCodeFocusTool(ex.tool)))
  const codeRolePool = roleScoped(codePool.filter((ex) => preferSet.has(ex.tool)))
  const combined = [
    ...rankExercises(platformPool, preferTools),
    ...rankExercises(codeRolePool, preferTools),
  ]
  const uniq: PracticeExercise[] = []
  const seen = new Set<string>()
  for (const ex of combined) {
    if (seen.has(ex.id)) continue
    seen.add(ex.id)
    uniq.push(ex)
  }
  if (uniq.length > 0) return uniq
  return rankExercises(
    roleScoped(PRACTICE_EXERCISES.filter((e) => preferSet.has(e.tool))),
    preferTools,
  )
}

/** Curated/endless levels: pick hands-on steps from the role playable stack. */
export function buildRoleScopedSteps(
  levelId: number,
  phase: ProjectPhase,
  preferTools: ToolId[],
  projectKind: ProjectKind,
  locale: PmGameLocale = 'fr',
): AdventureStep[] {
  const pool = exercisePoolForRole(phase, preferTools, projectKind)
  if (pool.length === 0) return []

  const codePlayable = preferTools.filter((id) => isCodeFocusTool(id)).length
  const stepCount =
    projectKind === 'data-ai'
      ? Math.min(3, pool.length)
      : codePlayable >= 2
        ? Math.min(3, pool.length)
        : Math.min(2, pool.length)

  const offset =
    (levelId * 7 + (projectKind === 'data-ai' ? 3 : 0) + preferTools.length) %
    Math.max(1, pool.length)
  const picked: PracticeExercise[] = []
  const used = new Set<string>()
  for (let i = 0; i < stepCount; i++) {
    let ex = pool[(offset + i) % pool.length]!
    if (used.has(ex.id)) {
      ex = pool.find((e) => !used.has(e.id)) ?? ex
    }
    used.add(ex.id)
    picked.push(ex)
  }

  const intensity = levelId
  return picked
    .flatMap((ex) => exerciseToSteps(ex, intensity))
    .map((s) => enrichStep(s, intensity, locale))
}

export function buildEndlessLevel(
  levelId: number,
  preferTools: ToolId[] = [],
  locale: PmGameLocale = 'fr',
  track: RoleTrack = 'pm',
): AdventureLevel {
  const intensity = levelId
  const phase = PHASE_CYCLE[(levelId - CURATED.length) % PHASE_CYCLE.length]!
  const phaseLabels = locale === 'en' ? PHASE_LABELS_EN : PHASE_LABELS
  const en = locale === 'en'
  const preferSet = new Set(preferTools)

  const corePool = coreCodePool()
  const codePool = codePracticePool()
  const phasePool = exercisesForPhase(phase)

  // Priorité exercices dont l’outil est dans la stack jouable du rôle
  const roleScoped = (pool: PracticeExercise[]) => {
    const hit = pool.filter((ex) => preferSet.has(ex.tool))
    return hit.length > 0 ? hit : pool
  }

  const primaryPool = roleScoped(
    corePool.filter((ex) => preferSet.has(ex.tool)).length > 0
      ? corePool.filter((ex) => preferSet.has(ex.tool))
      : corePool.length > 0
        ? corePool
        : codePool.length > 0
          ? codePool
          : phasePool,
  )
  const ranked = rankExercises(primaryPool, preferTools)
  const offset = (levelId * 5) % Math.max(1, ranked.length)
  const a =
    ranked[offset] ??
    ranked[0] ??
    primaryPool[(levelId * 3) % primaryPool.length]!

  const roleHasLittleCode =
    preferTools.filter((id) => isCodeFocusTool(id)).length <= 1
  const injectPlatform =
    roleHasLittleCode || (levelId - CURATED.length) % 3 === 0

  let b: PracticeExercise
  if (injectPlatform) {
    const platformPool = roleScoped(
      phasePool.filter((ex) => !isCodeFocusTool(ex.tool) && ex.id !== a.id),
    )
    const side =
      rankExercises(platformPool.length > 0 ? platformPool : phasePool, preferTools).find(
        (ex) => ex.id !== a.id,
      ) ?? phasePool.find((ex) => ex.id !== a.id)
    b =
      side ??
      rankExercises(codePool, preferTools).find((ex) => ex.id !== a.id) ??
      a
  } else {
    const otherCode = rankExercises(
      roleScoped(codePool.filter((ex) => ex.id !== a.id && ex.tool !== a.tool)),
      preferTools,
    )
    b =
      otherCode[0] ??
      codePool.find((ex) => ex.id !== a.id) ??
      primaryPool[(levelId * 3 + 1) % primaryPool.length]!
  }

  const steps = [...exerciseToSteps(a, intensity), ...exerciseToSteps(b, intensity)]
  const toolNames = [...new Set(steps.map((s) => s.tool).filter(Boolean) as ToolId[])].map(
    toolName,
  )
  const reinforce = preferTools.length
    ? en
      ? ` · stack focus: ${preferTools.slice(0, 4).map((id) => toolName(id)).join(', ')}`
      : ` · focus stack : ${preferTools.slice(0, 4).map((id) => toolName(id)).join(', ')}`
    : ''

  const decisionLabel =
    track === 'governance'
      ? en
        ? 'governance decision'
        : 'décision gouvernance'
      : en
        ? 'project-management decision'
        : 'décision gestion de projet'

  return {
    id: levelId,
    title: en
      ? `${phaseLabels[phase]} · batch M${intensity}`
      : `${phaseLabels[phase]} · lot M${intensity}`,
    intro: en
      ? `Mutualis follow-up — ${decisionLabel} then technical deliverable on your role stack. Phase ${phaseLabels[phase]}, intensity M${intensity}${reinforce}.`
      : `Suite Mutualis — ${decisionLabel} puis livrable technique sur ta stack de rôle. Phase ${phaseLabels[phase]}, intensité M${intensity}${reinforce}.`,
    brief: {
      projectName: en
        ? `Mutualis Retail — role batch M${intensity}`
        : `Mutualis Retail — lot rôle M${intensity}`,
      context: en
        ? `${a.context}\n\nYou practice ${toolNames.join(' · ')} through a ${decisionLabel}, then a technical deliverable.`
        : `${a.context}\n\nTu travailles ${toolNames.join(' · ')} via une ${decisionLabel}, puis un livrable technique.`,
      problem: a.description,
      objectives: [...a.tasks.slice(0, 3), ...b.tasks.slice(0, 2)].slice(0, 4),
      consigne: en
        ? `${track === 'governance' ? 'Governance question' : 'PM question'} first → then situational hands-on practice (role stack) + data DoD.`
        : `${track === 'governance' ? 'Question gouvernance' : 'Question gestion de projet'} d’abord → puis mise en situation et manipulation pratique (stack rôle) + DoD data.`,
    },
    phase,
    tools: [...new Set(steps.map((s) => s.tool).filter(Boolean) as ToolId[])],
    steps,
    endless: true,
  }
}

function enrichStep(
  step: AdventureStep,
  intensity: number,
  locale: PmGameLocale = 'fr',
): AdventureStep {
  return {
    ...step,
    projectMgmt: resolveProjectMgmt(
      step.id,
      step.phase,
      step.tool,
      step.projectMgmt,
      intensity,
      locale,
    ),
    governance: resolveGovernance(
      step.id,
      step.tool,
      step.phase,
      step.governance,
      intensity,
      locale,
    ),
    dataDoD: step.dataDoD?.length
      ? step.dataDoD
      : dataDoDForStep(step.tool, step.phase, locale),
  }
}

function enrichLevel(level: AdventureLevel, locale: PmGameLocale = 'fr'): AdventureLevel {
  const phaseLabels = locale === 'en' ? PHASE_LABELS_EN : PHASE_LABELS
  return {
    ...level,
    // Keep phase label consistent when endless title already baked in FR — rebuild title if endless
    title:
      level.endless && locale === 'en'
        ? `${phaseLabels[level.phase]} · batch M${level.id}`
        : level.title,
    steps: level.steps.map((s) => enrichStep(s, level.id, locale)),
  }
}

export function getLevel(
  levelId: number,
  preferTools: ToolId[] = [],
  locale: PmGameLocale = 'fr',
  track: RoleTrack = 'pm',
): AdventureLevel {
  const curated = CURATED.find((l) => l.id === levelId)
  if (curated) return enrichLevel(curated, locale)
  if (levelId < 0) return enrichLevel(CURATED[0]!, locale)
  return enrichLevel(buildEndlessLevel(levelId, preferTools, locale, track), locale)
}

export function curatedCount(): number {
  return CURATED.length
}

export function maxCuratedId(): number {
  return CURATED[CURATED.length - 1]!.id
}

export function maxLevelId(): number {
  return Number.POSITIVE_INFINITY
}

export const ADVENTURE_LEVELS = CURATED

