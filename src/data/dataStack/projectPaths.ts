import type { PmGameLocale } from '../../i18n/pmGameLocale'

/** Famille de projet choisie en début de partie. */
export type ProjectKind = 'it' | 'data-ai'

/** Orientation du parcours selon le rôle. */
export type RoleTrack = 'pm' | 'governance'

export type PlayerRoleId =
  | 'business-analyst'
  | 'chef-de-projet'
  | 'product-owner'
  | 'scrum-master'
  | 'technico-fonctionnel'
  | 'data-manager'
  | 'data-steward'
  | 'data-governance-manager'
  | 'ai-governance-manager'

export interface ProjectKindOption {
  id: ProjectKind
  label: Record<PmGameLocale, string>
  hint: Record<PmGameLocale, string>
}

export interface PlayerRoleOption {
  id: PlayerRoleId
  label: Record<PmGameLocale, string>
  track: RoleTrack
}

export const PROJECT_KINDS: readonly ProjectKindOption[] = [
  {
    id: 'it',
    label: { fr: 'Projet IT', en: 'IT project' },
    hint: {
      fr: 'SI, CRM, ERP, infra, architecture, intégrations — problématiques Mutualis.',
      en: 'Systems, CRM, ERP, infra, architecture, integrations — Mutualis business cases.',
    },
  },
  {
    id: 'data-ai',
    label: { fr: 'Projet Data/IA', en: 'Data/AI project' },
    hint: {
      fr: 'Analytics, BI, ML, automatisation, deep learning, gouvernance data — Mutualis.',
      en: 'Analytics, BI, ML, automation, deep learning, data governance — Mutualis.',
    },
  },
]

const IT_ROLES: readonly PlayerRoleOption[] = [
  {
    id: 'business-analyst',
    label: { fr: 'Business Analyst', en: 'Business Analyst' },
    track: 'pm',
  },
  {
    id: 'chef-de-projet',
    label: { fr: 'Chef de projet', en: 'Project Manager' },
    track: 'pm',
  },
  {
    id: 'product-owner',
    label: { fr: 'Product Owner', en: 'Product Owner' },
    track: 'pm',
  },
  {
    id: 'scrum-master',
    label: { fr: 'Scrum Master', en: 'Scrum Master' },
    track: 'pm',
  },
  {
    id: 'technico-fonctionnel',
    label: { fr: 'Technico-fonctionnel', en: 'Techno-functional' },
    track: 'pm',
  },
]

const DATA_AI_ROLES: readonly PlayerRoleOption[] = [
  {
    id: 'business-analyst',
    label: { fr: 'Business Analyst', en: 'Business Analyst' },
    track: 'pm',
  },
  {
    id: 'chef-de-projet',
    label: { fr: 'Chef de projet', en: 'Project Manager' },
    track: 'pm',
  },
  {
    id: 'product-owner',
    label: { fr: 'Product Owner', en: 'Product Owner' },
    track: 'pm',
  },
  {
    id: 'scrum-master',
    label: { fr: 'Scrum Master', en: 'Scrum Master' },
    track: 'pm',
  },
  {
    id: 'technico-fonctionnel',
    label: { fr: 'Technico-fonctionnel', en: 'Techno-functional' },
    track: 'pm',
  },
  {
    id: 'data-manager',
    label: { fr: 'Data Manager', en: 'Data Manager' },
    track: 'governance',
  },
  {
    id: 'data-steward',
    label: { fr: 'Data Steward', en: 'Data Steward' },
    track: 'governance',
  },
  {
    id: 'data-governance-manager',
    label: { fr: 'Data Governance Manager', en: 'Data Governance Manager' },
    track: 'governance',
  },
  {
    id: 'ai-governance-manager',
    label: { fr: 'AI Governance Manager', en: 'AI Governance Manager' },
    track: 'governance',
  },
]

export function rolesForProject(kind: ProjectKind): readonly PlayerRoleOption[] {
  return kind === 'it' ? IT_ROLES : DATA_AI_ROLES
}

export function isProjectKind(v: unknown): v is ProjectKind {
  return v === 'it' || v === 'data-ai'
}

const ALL_ROLE_IDS: readonly PlayerRoleId[] = [
  'business-analyst',
  'chef-de-projet',
  'product-owner',
  'scrum-master',
  'technico-fonctionnel',
  'data-manager',
  'data-steward',
  'data-governance-manager',
  'ai-governance-manager',
]

export function isPlayerRoleId(v: unknown): v is PlayerRoleId {
  return typeof v === 'string' && (ALL_ROLE_IDS as readonly string[]).includes(v)
}

/** Vérifie que le rôle est bien proposé pour ce type de projet. */
export function roleFitsProject(kind: ProjectKind, role: PlayerRoleId): boolean {
  return rolesForProject(kind).some((r) => r.id === role)
}

export function trackForRole(role: PlayerRoleId): RoleTrack {
  for (const list of [IT_ROLES, DATA_AI_ROLES]) {
    const found = list.find((r) => r.id === role)
    if (found) return found.track
  }
  return 'pm'
}

export function trackLabel(track: RoleTrack, locale: PmGameLocale): string {
  if (locale === 'en') {
    return track === 'governance' ? 'Governance' : 'Project management'
  }
  return track === 'governance' ? 'Gouvernance' : 'Gestion de projet'
}

/** Première demi-étape d’une tâche selon la piste. */
export function openingHalfForTrack(track: RoleTrack): 'pm' | 'gov' {
  return track === 'governance' ? 'gov' : 'pm'
}

export function projectKindLabel(kind: ProjectKind, locale: PmGameLocale): string {
  return PROJECT_KINDS.find((p) => p.id === kind)?.label[locale] ?? kind
}

export function playerRoleLabel(
  kind: ProjectKind,
  role: PlayerRoleId,
  locale: PmGameLocale,
): string {
  return rolesForProject(kind).find((r) => r.id === role)?.label[locale] ?? role
}
