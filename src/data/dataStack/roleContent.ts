import type { PmGameLocale } from '../../i18n/pmGameLocale'
import type { PlayerRoleId, ProjectKind, RoleTrack } from './projectPaths'
import { trackForRole } from './projectPaths'
import { toolsForRole } from './roleToolStacks'
import { STACK_TOOLS, type ToolId } from './tools'

/** Ids marché → outils jouables dans PM Game. */
const MARKET_TO_PLAYABLE: Record<string, ToolId> = {
  jira: 'jira',
  confluence: 'confluence',
  sql: 'sql',
  python: 'python',
  spark: 'spark',
  databricks: 'databricks',
  gcs: 'gcs',
  cloudsql: 'cloudsql',
  bigquery: 'bigquery',
  looker: 'looker',
  dbt: 'dbt',
  airflow: 'airflow',
  datagalaxy: 'datagalaxy',
  powerbi: 'powerbi',
}

const PLAYABLE_SET = new Set(STACK_TOOLS.map((t) => t.id))

/** Outils de la stack rôle qui existent vraiment dans le moteur de jeu. */
export function playableToolsForRole(
  kind: ProjectKind,
  role: PlayerRoleId,
): ToolId[] {
  const out: ToolId[] = []
  const seen = new Set<ToolId>()
  for (const t of toolsForRole(kind, role)) {
    const id = MARKET_TO_PLAYABLE[t.id]
    if (!id || !PLAYABLE_SET.has(id) || seen.has(id)) continue
    seen.add(id)
    out.push(id)
  }
  return out
}

export interface RoleContentProfile {
  track: RoleTrack
  /** Titre court de la posture décisionnelle. */
  decisionTitleFr: string
  decisionTitleEn: string
  decisionLeadFr: string
  decisionLeadEn: string
  briefHookFr: string
  briefHookEn: string
  focusMissionsFr: string[]
  focusMissionsEn: string[]
}

const PROFILES: Record<PlayerRoleId, RoleContentProfile> = {
  'business-analyst': {
    track: 'pm',
    decisionTitleFr: 'Business Analyst',
    decisionTitleEn: 'Business Analyst',
    decisionLeadFr:
      'Avant la manipulation pratique, cadre le besoin : critères d’acceptation, impacts SI, arbitrage métier/IT.',
    decisionLeadEn:
      'Before hands-on practice, frame the need: acceptance criteria, system impact, business/IT trade-offs.',
    briefHookFr:
      'Tu es BA : tu traduis le métier en exigences testables et tu sécurises la recette.',
    briefHookEn:
      'You are the BA: you turn business needs into testable requirements and secure UAT.',
    focusMissionsFr: [
      'Ateliers & expression de besoin',
      'Specs / user stories',
      'Recette & critères d’acceptation',
    ],
    focusMissionsEn: [
      'Workshops & requirements',
      'Specs / user stories',
      'UAT & acceptance criteria',
    ],
  },
  'chef-de-projet': {
    track: 'pm',
    decisionTitleFr: 'Chef de projet',
    decisionTitleEn: 'Project Manager',
    decisionLeadFr:
      'Avant la manipulation pratique, arbitre planning, risques, budget et parties prenantes (gestion de projet / hybride).',
    decisionLeadEn:
      'Before hands-on practice, trade off schedule, risk, budget and stakeholders (project management / hybrid).',
    briefHookFr:
      'Tu es chef de projet : tu pilotes jalons, risques et COMEX — le livrable sert la décision.',
    briefHookEn:
      'You are the PM: you drive milestones, risks and the exec committee — the deliverable serves the decision.',
    focusMissionsFr: ['Pilotage & planning', 'Risques & dépendances', 'Reporting COMEX'],
    focusMissionsEn: ['Delivery & planning', 'Risks & dependencies', 'Exec reporting'],
  },
  'product-owner': {
    track: 'pm',
    decisionTitleFr: 'Product Owner',
    decisionTitleEn: 'Product Owner',
    decisionLeadFr:
      'Avant la manipulation pratique, priorise la valeur : backlog, DoR/DoD, arbitrage scope vs délai.',
    decisionLeadEn:
      'Before hands-on practice, prioritize value: backlog, DoR/DoD, scope vs date trade-offs.',
    briefHookFr:
      'Tu es PO : tu maximises la valeur du backlog et tu assumes les arbitrages produit.',
    briefHookEn:
      'You are the PO: you maximize backlog value and own product trade-offs.',
    focusMissionsFr: ['Backlog & priorisation', 'Valeur / MVP', 'Alignement stakeholders'],
    focusMissionsEn: ['Backlog & prioritization', 'Value / MVP', 'Stakeholder alignment'],
  },
  'scrum-master': {
    track: 'pm',
    decisionTitleFr: 'Scrum Master',
    decisionTitleEn: 'Scrum Master',
    decisionLeadFr:
      'Avant la manipulation pratique, sécurise le flux agile : impediments, capacité, cérémonies, amélioration continue.',
    decisionLeadEn:
      'Before hands-on practice, protect agile flow: impediments, capacity, ceremonies, continuous improvement.',
    briefHookFr:
      'Tu es Scrum Master : tu retires les freins et tu gardes l’équipe dans un rythme sain.',
    briefHookEn:
      'You are the Scrum Master: you remove blockers and keep a healthy team cadence.',
    focusMissionsFr: ['Facilitation', 'Impediments', 'Flux & vélocité'],
    focusMissionsEn: ['Facilitation', 'Impediments', 'Flow & velocity'],
  },
  'technico-fonctionnel': {
    track: 'pm',
    decisionTitleFr: 'Technico-fonctionnel',
    decisionTitleEn: 'Techno-functional',
    decisionLeadFr:
      'Avant la manipulation pratique, tranche le bon niveau de détail : spec vs proto, impact technique, faisabilité.',
    decisionLeadEn:
      'Before hands-on practice, pick the right depth: spec vs proto, technical impact, feasibility.',
    briefHookFr:
      'Tu es technico-fonctionnel : tu relies le métier aux contraintes SI et tu valides la faisabilité.',
    briefHookEn:
      'You are techno-functional: you bridge business and system constraints and prove feasibility.',
    focusMissionsFr: ['Specs détaillées', 'Interfaces / API', 'Recette technique'],
    focusMissionsEn: ['Detailed specs', 'Interfaces / APIs', 'Technical UAT'],
  },
  'data-manager': {
    track: 'governance',
    decisionTitleFr: 'Data Manager',
    decisionTitleEn: 'Data Manager',
    decisionLeadFr:
      'Avant la manipulation pratique, pose le cadre data : ownership, qualité, cycle de vie, services data.',
    decisionLeadEn:
      'Before hands-on practice, set the data frame: ownership, quality, lifecycle, data services.',
    briefHookFr:
      'Tu es Data Manager : tu organises le patrimoine data et tu fais tenir qualité + usage.',
    briefHookEn:
      'You are the Data Manager: you organize the data estate and keep quality + usage aligned.',
    focusMissionsFr: ['Patrimoine data', 'Qualité & SLA', 'Coordination domaines'],
    focusMissionsEn: ['Data estate', 'Quality & SLAs', 'Domain coordination'],
  },
  'data-steward': {
    track: 'governance',
    decisionTitleFr: 'Data Steward',
    decisionTitleEn: 'Data Steward',
    decisionLeadFr:
      'Avant la manipulation pratique, ancre définition, qualité et remédiation au niveau du domaine métier.',
    decisionLeadEn:
      'Before hands-on practice, lock definition, quality and remediation at domain level.',
    briefHookFr:
      'Tu es Data Steward : tu es responsable de la définition et de la qualité sur ton domaine.',
    briefHookEn:
      'You are the Data Steward: you own definition and quality for your domain.',
    focusMissionsFr: ['Glossaire domaine', 'Contrôles DQ', 'Remédiation'],
    focusMissionsEn: ['Domain glossary', 'DQ controls', 'Remediation'],
  },
  'data-governance-manager': {
    track: 'governance',
    decisionTitleFr: 'Data Governance Manager',
    decisionTitleEn: 'Data Governance Manager',
    decisionLeadFr:
      'Avant la manipulation pratique, décide politique, RACI, comité data et outillage catalogue (DataGalaxy).',
    decisionLeadEn:
      'Before hands-on practice, decide policy, RACI, data council and catalog tooling (DataGalaxy).',
    briefHookFr:
      'Tu es Data Governance Manager : tu portes le cadre gouvernance data et tu fais tenir Owner / Steward.',
    briefHookEn:
      'You are the Data Governance Manager: you own the data-governance frame and make Owner / Steward stick.',
    focusMissionsFr: ['Politique & comité', 'RACI Owner/Steward', 'Catalogue DataGalaxy'],
    focusMissionsEn: ['Policy & council', 'Owner/Steward RACI', 'DataGalaxy catalog'],
  },
  'ai-governance-manager': {
    track: 'governance',
    decisionTitleFr: 'AI Governance Manager',
    decisionTitleEn: 'AI Governance Manager',
    decisionLeadFr:
      'Avant la manipulation pratique, cadre risque IA : usage acceptable, traçabilité, données d’entraînement, conformité.',
    decisionLeadEn:
      'Before hands-on practice, frame AI risk: acceptable use, traceability, training data, compliance.',
    briefHookFr:
      'Tu es AI Governance Manager : tu sécurises les usages IA (éthique, risque, conformité).',
    briefHookEn:
      'You are the AI Governance Manager: you secure AI use cases (ethics, risk, compliance).',
    focusMissionsFr: ['Risque & conformité IA', 'Traçabilité modèles', 'Politique d’usage'],
    focusMissionsEn: ['AI risk & compliance', 'Model traceability', 'Usage policy'],
  },
}

export function roleContentProfile(role: PlayerRoleId): RoleContentProfile {
  return PROFILES[role]
}

export function roleDecisionTitle(role: PlayerRoleId, locale: PmGameLocale): string {
  const p = PROFILES[role]
  return locale === 'en' ? p.decisionTitleEn : p.decisionTitleFr
}

export function roleDecisionLead(role: PlayerRoleId, locale: PmGameLocale): string {
  const p = PROFILES[role]
  return locale === 'en' ? p.decisionLeadEn : p.decisionLeadFr
}

export function roleBriefHook(role: PlayerRoleId, locale: PmGameLocale): string {
  const p = PROFILES[role]
  return locale === 'en' ? p.briefHookEn : p.briefHookFr
}

export function roleFocusMissions(role: PlayerRoleId, locale: PmGameLocale): string[] {
  const p = PROFILES[role]
  return locale === 'en' ? p.focusMissionsEn : p.focusMissionsFr
}

export function roleTrackOf(role: PlayerRoleId): RoleTrack {
  return trackForRole(role)
}
