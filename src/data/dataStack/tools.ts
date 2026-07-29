/** PM Game — stack adoptée (8 briques / 13 compétences). */

export type ToolId =
  | 'jira'
  | 'confluence'
  | 'sql'
  | 'python'
  | 'spark'
  | 'databricks'
  | 'gcs'
  | 'cloudsql'
  | 'bigquery'
  | 'looker'
  | 'dbt'
  | 'airflow'
  | 'datagalaxy'
  | 'powerbi'

export type ProjectPhase =
  | 'cadrage'
  | 'ingestion'
  | 'transformation'
  | 'gouvernance'
  | 'exposition'
  | 'ops'

export interface StackTool {
  id: ToolId
  name: string
  /** Brique plateforme (vue 8) ou catégorie. */
  category: string
  phase: ProjectPhase
  order: number
  blurb: string
  practiceFocus: string[]
  unlockAfter?: ToolId[]
}

/**
 * Stack cible PM Game :
 * Jira · Confluence · Databricks (SQL/Python/Spark) · GCP (GCS/Cloud SQL/BQ/Looker) ·
 * dbt · Airflow · DataGalaxy · Power BI
 */
export const STACK_TOOLS: StackTool[] = [
  {
    id: 'jira',
    name: 'Jira',
    category: 'Delivery',
    phase: 'cadrage',
    order: 0,
    blurb: 'Tickets, sprints, traçabilité delivery data.',
    practiceFocus: ['Epics/Stories', 'Board', 'Definition of Done'],
  },
  {
    id: 'confluence',
    name: 'Confluence',
    category: 'Cadrage & collab',
    phase: 'cadrage',
    order: 1,
    blurb: 'Documentation structurée, ADR, runbooks.',
    practiceFocus: ['Espaces', 'Templates', 'Lien Jira'],
    unlockAfter: ['jira'],
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'Databricks',
    phase: 'ingestion',
    order: 2,
    blurb: 'Exploration, jointures, qualité, agrégats (notebooks Databricks / entrepôts).',
    practiceFocus: ['SELECT avancé', 'Window functions', 'Contrôles DQ'],
    unlockAfter: ['jira'],
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Databricks',
    phase: 'transformation',
    order: 3,
    blurb: 'Scripts ETL, analyse, proto ML dans notebooks Databricks.',
    practiceFocus: ['Pandas / PySpark', 'APIs', 'Tests unitaires data'],
    unlockAfter: ['sql'],
  },
  {
    id: 'spark',
    name: 'Spark',
    category: 'Databricks',
    phase: 'transformation',
    order: 4,
    blurb: 'Traitement distribué batch / volume (moteur sous Databricks).',
    practiceFocus: ['DataFrame', 'Partitions', 'Jobs'],
    unlockAfter: ['python'],
  },
  {
    id: 'databricks',
    name: 'Databricks',
    category: 'Databricks',
    phase: 'transformation',
    order: 5,
    blurb: 'Lakehouse : notebooks SQL/Python/Spark, jobs, Delta Lake.',
    practiceFocus: ['Workspaces', 'Jobs', 'Delta Lake', 'Unity Catalog'],
    unlockAfter: ['spark'],
  },
  {
    id: 'gcs',
    name: 'Cloud Storage',
    category: 'GCP',
    phase: 'ingestion',
    order: 6,
    blurb: 'Landing zone fichiers, partitions, cycle de vie.',
    practiceFocus: ['Buckets', 'Préfixes', 'IAM basique'],
    unlockAfter: ['sql'],
  },
  {
    id: 'cloudsql',
    name: 'Cloud SQL',
    category: 'GCP',
    phase: 'ingestion',
    order: 7,
    blurb: 'OLTP managé, sources applicatives.',
    practiceFocus: ['Instances', 'Connexions', 'Backups'],
    unlockAfter: ['gcs'],
  },
  {
    id: 'bigquery',
    name: 'BigQuery',
    category: 'GCP',
    phase: 'transformation',
    order: 8,
    blurb: 'Entrepôt analytique, datasets, coûts requêtes.',
    practiceFocus: ['Datasets/tables', 'SQL BQ', 'Slots/coûts'],
    unlockAfter: ['gcs', 'sql'],
  },
  {
    id: 'looker',
    name: 'Looker Studio',
    category: 'GCP',
    phase: 'exposition',
    order: 9,
    blurb: 'Reporting GCP rapide, partage stakeholders.',
    practiceFocus: ['Sources BQ', 'Charts', 'Partage'],
    unlockAfter: ['bigquery'],
  },
  {
    id: 'dbt',
    name: 'dbt',
    category: 'Transformation',
    phase: 'transformation',
    order: 10,
    blurb: 'Modèles versionnés, tests, documentation.',
    practiceFocus: ['Models', 'Tests', 'Docs & lineage'],
    unlockAfter: ['bigquery'],
  },
  {
    id: 'airflow',
    name: 'Airflow',
    category: 'Orchestration',
    phase: 'ops',
    order: 11,
    blurb: 'DAGs, dépendances, SLA pipelines.',
    practiceFocus: ['DAGs', 'Sensors', 'Retries/alerting'],
    unlockAfter: ['dbt'],
  },
  {
    id: 'datagalaxy',
    name: 'DataGalaxy',
    category: 'Gouvernance',
    phase: 'gouvernance',
    order: 12,
    blurb: 'Catalogue, glossaire, stewardship, lineage et gouvernance data.',
    practiceFocus: ['Catalogue', 'Glossaire', 'Ownership / stewardship'],
    unlockAfter: ['dbt', 'confluence'],
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    category: 'Exposition',
    phase: 'exposition',
    order: 13,
    blurb: 'Dashboards métier, modèle sémantique certifié.',
    practiceFocus: ['Modèle', 'DAX simple', 'Publication'],
    unlockAfter: ['sql', 'bigquery'],
  },
]

/** Les 8 briques plateforme (vue synthétique). */
export const STACK_PLATFORMS = [
  'Jira',
  'Confluence',
  'Databricks',
  'GCP',
  'dbt',
  'Airflow',
  'DataGalaxy',
  'Power BI',
] as const

export const PHASE_LABELS: Record<ProjectPhase, string> = {
  cadrage: '1 · Cadrage',
  ingestion: '2 · Ingestion',
  transformation: '3 · Transformation',
  gouvernance: '4 · Gouvernance',
  exposition: '5 · Exposition',
  ops: '6 · Ops / Run',
}

export const PHASE_LABELS_EN: Record<ProjectPhase, string> = {
  cadrage: '1 · Framing',
  ingestion: '2 · Ingestion',
  transformation: '3 · Transformation',
  gouvernance: '4 · Governance',
  exposition: '5 · Exposure',
  ops: '6 · Ops / Run',
}

export function phaseLabel(
  phase: ProjectPhase,
  locale: 'fr' | 'en' = 'fr',
): string {
  return locale === 'en' ? PHASE_LABELS_EN[phase] : PHASE_LABELS[phase]
}

export const PHASE_ORDER: ProjectPhase[] = [
  'cadrage',
  'ingestion',
  'transformation',
  'gouvernance',
  'exposition',
  'ops',
]

export function toolById(id: ToolId): StackTool {
  const t = STACK_TOOLS.find((x) => x.id === id)
  if (!t) throw new Error(`Unknown tool ${id}`)
  return t
}

/** Priorité pédagogique : compute Databricks + SQL analytique / orchestration. */
export const CODE_FOCUS_TOOLS: ToolId[] = [
  'sql',
  'python',
  'spark',
  'databricks',
  'bigquery',
  'dbt',
  'cloudsql',
  'airflow',
]

export function isCodeFocusTool(tool: ToolId | undefined): boolean {
  return !!tool && CODE_FOCUS_TOOLS.includes(tool)
}
