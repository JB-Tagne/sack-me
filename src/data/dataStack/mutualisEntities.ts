/**
 * Mutualis Group — holding + filiales métier.
 * Le joueur est rattaché à une entreprise ; chaque exercice peut impliquer
 * une ou plusieurs filiales / équipes du groupe.
 */

import type { PmGameLocale } from '../../i18n/pmGameLocale'
import type { ProjectPhase } from './tools'

// BEGIN AUTO:ENTITY_ID
export type MutualisEntityId =
  | 'assurance'
  | 'bank'
  | 'retail'
  | 'transport'
  | 'energy'
  | 'media'
  | 'agro'
  | 'health'
// END AUTO:ENTITY_ID

export interface MutualisEntity {
  id: MutualisEntityId
  /** Nom affiché, ex. Mutualis Assurance */
  name: string
  domain: Record<PmGameLocale, string>
  blurb: Record<PmGameLocale, string>
}

export const MUTUALIS_GROUP_NAME = 'Mutualis Group'

// BEGIN AUTO:ENTITIES
export const MUTUALIS_ENTITIES: readonly MutualisEntity[] = [
  {
    id: 'assurance',
    name: 'Mutualis Assurance',
    domain: { fr: 'Assurance / sinistres', en: 'Insurance / claims' },
    blurb: {
      fr: 'Contrats, sinistres, fraude, parcours digital assuré.',
      en: 'Policies, claims, fraud, digital policyholder journeys.',
    },
  },
  {
    id: 'bank',
    name: 'Mutualis Bank',
    domain: { fr: 'Banque / finance', en: 'Banking / finance' },
    blurb: {
      fr: 'Compte, crédit, KYC, conformité et parcours client digital.',
      en: 'Accounts, credit, KYC, compliance and digital banking.',
    },
  },
  {
    id: 'retail',
    name: 'Mutualis Retail',
    domain: { fr: 'Retail / distribution', en: 'Retail / distribution' },
    blurb: {
      fr: 'Magasins, e-commerce, caisse, assortiment et fidélité.',
      en: 'Stores, e-commerce, checkout, assortment and loyalty.',
    },
  },
  {
    id: 'transport',
    name: 'Mutualis Transport',
    domain: { fr: 'Transport / logistique', en: 'Transport / logistics' },
    blurb: {
      fr: 'Flotte, tournées, tracking, entrepôts et délais de livraison.',
      en: 'Fleet, routes, tracking, warehouses and delivery SLAs.',
    },
  },
  {
    id: 'energy',
    name: 'Mutualis Energy',
    domain: { fr: 'Énergie / utilities', en: 'Energy / utilities' },
    blurb: {
      fr: 'Compteurs, consommation, facturation et réseau.',
      en: 'Meters, consumption, billing and grid ops.',
    },
  },
  {
    id: 'media',
    name: 'Mutualis Media',
    domain: { fr: 'Média / audience', en: 'Media / audience' },
    blurb: {
      fr: 'Contenus, audience, pub programmatique et mesures d\'impact.',
      en: 'Content, audience, programmatic ads and impact measurement.',
    },
  },
  {
    id: 'agro',
    name: 'Mutualis Agro',
    domain: { fr: 'Agro / filière', en: 'Agri / supply chain' },
    blurb: {
      fr: 'Filière agricole, traçabilité, stocks et coopératives.',
      en: 'Agri supply chain, traceability, stock and co-ops.',
    },
  },
  {
    id: 'health',
    name: 'Mutualis Health',
    domain: { fr: 'Santé / parcours patient', en: 'Health / patient journeys' },
    blurb: {
      fr: 'Dossiers patients, parcours de soins, facturation et conformité santé.',
      en: 'Patient records, care pathways, billing and health compliance.',
    },
  },
] as const
// END AUTO:ENTITIES

export function isMutualisEntityId(v: unknown): v is MutualisEntityId {
  return typeof v === 'string' && MUTUALIS_ENTITIES.some((e) => e.id === v)
}

export function mutualisEntity(id: MutualisEntityId): MutualisEntity {
  return MUTUALIS_ENTITIES.find((e) => e.id === id) ?? MUTUALIS_ENTITIES[2]!
}

export function mutualisEntityLabel(id: MutualisEntityId, _locale: PmGameLocale): string {
  return mutualisEntity(id).name
}

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Problématiques métier typiques par filiale × phase (variation d’exercice). */
const DOMAIN_BEATS: Record<
  MutualisEntityId,
  Partial<Record<ProjectPhase, Record<PmGameLocale, string>>>
> = {
  assurance: {
    cadrage: {
      fr: 'Le parcours déclaration de sinistre mobile doit coexister avec le legacy contrats.',
      en: 'The mobile claims journey must coexist with legacy policy systems.',
    },
    ingestion: {
      fr: 'Les flux sinistres / pièces justificatives arrivent hétérogènes (PDF, photos, EDI).',
      en: 'Claims / evidence feeds arrive heterogeneous (PDF, photos, EDI).',
    },
    transformation: {
      fr: 'Règles de fraude et de scoring sinistre divergent entre régions.',
      en: 'Fraud and claims-scoring rules diverge across regions.',
    },
    gouvernance: {
      fr: 'Données santé / sensibles : finalité et rétention à cadrer avant fusion de dossiers.',
      en: 'Sensitive health data: purpose and retention before merging case files.',
    },
    exposition: {
      fr: 'Le COMEX Assurance compare deux KPI « coût moyen sinistre » incompatibles.',
      en: 'The insurance board compares two incompatible “average claim cost” KPIs.',
    },
    ops: {
      fr: 'Pic climatique : le run sinistres doit tenir sans casser la clôture actuarielle.',
      en: 'Weather peak: claims run must hold without breaking actuarial close.',
    },
  },
  bank: {
    cadrage: {
      fr: 'Le parcours ouverture de compte digital doit respecter KYC / LCB-FT.',
      en: 'Digital account opening must satisfy KYC / AML requirements.',
    },
    ingestion: {
      fr: 'Flux core banking et scoring crédit : schémas non alignés.',
      en: 'Core-banking and credit-scoring feeds: misaligned schemas.',
    },
    transformation: {
      fr: 'Agrégats risque crédit vs vision commerciale du « client rentable ».',
      en: 'Credit-risk aggregates vs commercial “profitable customer” view.',
    },
    gouvernance: {
      fr: 'Audit interne exige une piste d’audit complète sur les décisions de scoring.',
      en: 'Internal audit requires a full audit trail on scoring decisions.',
    },
    exposition: {
      fr: 'Dashboard risque board vs reporting réglementaire : deux vérités.',
      en: 'Board risk dashboard vs regulatory reporting: two truths.',
    },
    ops: {
      fr: 'Batch nocturne core banking en retard : impact virements J+1.',
      en: 'Overnight core-banking batch late: next-day transfers at risk.',
    },
  },
  retail: {
    cadrage: {
      fr: 'Client 360 magasin / web / SAV : trois visions du même client.',
      en: 'Customer 360 store / web / support: three views of the same customer.',
    },
    ingestion: {
      fr: 'Tickets caisse et flux e-commerce saturent la landing le week-end promo.',
      en: 'POS tickets and e-commerce feeds saturate landing on promo weekend.',
    },
    transformation: {
      fr: 'Panier moyen et trafic magasin : définitions régionales conflictuelles.',
      en: 'Average basket and store traffic: conflicting regional definitions.',
    },
    gouvernance: {
      fr: 'Fidélité & consentement marketing : le DPO bloque une fusion de fiches.',
      en: 'Loyalty & marketing consent: DPO blocks a record merge.',
    },
    exposition: {
      fr: 'Deux dashboards retail affichent le même KPI avec deux grains.',
      en: 'Two retail dashboards show the same KPI at two grains.',
    },
    ops: {
      fr: 'Cutover caisse : pas de coupure file d’attente magasin.',
      en: 'POS cutover: no store queue downtime.',
    },
  },
  transport: {
    cadrage: {
      fr: 'Optimisation des tournées vs contraintes chauffeurs et fenêtres client.',
      en: 'Route optimization vs driver constraints and customer time windows.',
    },
    ingestion: {
      fr: 'Télémetrie flotte + scans entrepôt : horodatages désynchronisés.',
      en: 'Fleet telematics + warehouse scans: desynced timestamps.',
    },
    transformation: {
      fr: 'ETA et taux de livraison à l’heure : règles métier floues.',
      en: 'ETA and on-time delivery rate: fuzzy business rules.',
    },
    gouvernance: {
      fr: 'Géolocalisation chauffeurs : minimisation et finalité à documenter.',
      en: 'Driver geolocation: minimization and purpose to document.',
    },
    exposition: {
      fr: 'Ops logistique vs COMEX : KPI « ponctualité » non comparable.',
      en: 'Logistics ops vs board: “punctuality” KPI not comparable.',
    },
    ops: {
      fr: 'Incident GPS flotte : replanification manuelle le jour J.',
      en: 'Fleet GPS incident: manual replan on delivery day.',
    },
  },
  energy: {
    cadrage: {
      fr: 'Compteurs communicants : programme de déploiement multi-régions.',
      en: 'Smart meters: multi-region rollout program.',
    },
    ingestion: {
      fr: 'Courbes de charge haute fréquence : volumes sous-estimés.',
      en: 'High-frequency load curves: volumes underestimated.',
    },
    transformation: {
      fr: 'Agrégation consommation foyer vs site professionnel.',
      en: 'Aggregating household vs business-site consumption.',
    },
    gouvernance: {
      fr: 'Données de consommation : sensibilité et accès par rôle.',
      en: 'Consumption data: sensitivity and role-based access.',
    },
    exposition: {
      fr: 'Facturation vs pilotage réseau : deux marts « consommation ».',
      en: 'Billing vs grid ops: two “consumption” marts.',
    },
    ops: {
      fr: 'Pic de froid : SLA de publication des courbes sous tension.',
      en: 'Cold peak: load-curve publish SLA under stress.',
    },
  },
  media: {
    cadrage: {
      fr: 'Mesure d’audience cross-device vs panier pub des annonceurs.',
      en: 'Cross-device audience measurement vs advertiser budgets.',
    },
    ingestion: {
      fr: 'Logs streaming + pixels pub : identité utilisateur fragmentée.',
      en: 'Streaming logs + ad pixels: fragmented user identity.',
    },
    transformation: {
      fr: 'Attribution last-click vs data-driven : guerre de modèles.',
      en: 'Last-click vs data-driven attribution: model war.',
    },
    gouvernance: {
      fr: 'Consentement cookies / audience : politiques divergentes FR/EU.',
      en: 'Cookie / audience consent: divergent FR/EU policies.',
    },
    exposition: {
      fr: 'Rapport annonceur vs dashboard interne : écart de reach.',
      en: 'Advertiser report vs internal dashboard: reach gap.',
    },
    ops: {
      fr: 'Campagne live : pipeline audience en retard de 45 min.',
      en: 'Live campaign: audience pipeline 45 minutes late.',
    },
  },
  agro: {
    cadrage: {
      fr: 'Traçabilité lot agricole de la coopérative au rayon.',
      en: 'Farm-lot traceability from co-op to shelf.',
    },
    ingestion: {
      fr: 'Capteurs silo + ERP filière : formats fournisseurs hétérogènes.',
      en: 'Silo sensors + agri ERP: heterogeneous supplier formats.',
    },
    transformation: {
      fr: 'Unité (tonne vs palette) non harmonisée sur le stock.',
      en: 'Units (ton vs pallet) not harmonized on stock.',
    },
    gouvernance: {
      fr: 'Données producteurs : partage inter-filiales sous contrat.',
      en: 'Producer data: cross-subsidiary sharing under contract.',
    },
    exposition: {
      fr: 'Label qualité vs rupture rayon : deux indicateurs conflictuels.',
      en: 'Quality label vs shelf stockout: two conflicting indicators.',
    },
    ops: {
      fr: 'Récolte : pic d’ingestion qui sature le lac data.',
      en: 'Harvest: ingestion peak saturates the data lake.',
    },
  },
  health: {
    cadrage: {
      fr: 'Parcours patient digital (RDV, dossier, sortie) face au SI hospitalier legacy.',
      en: 'Digital patient journey (appointments, record, discharge) vs legacy hospital systems.',
    },
    ingestion: {
      fr: 'Comptes rendus, imagerie et flux labo : formats HL7/FHIR incomplets.',
      en: 'Reports, imaging and lab feeds: incomplete HL7/FHIR formats.',
    },
    transformation: {
      fr: 'Identité patient multi-établissements : rapprochement sans collision NIR.',
      en: 'Cross-facility patient identity: matching without ID collisions.',
    },
    gouvernance: {
      fr: 'Données de santé : consentement, minimisation et accès strict par rôle soignant.',
      en: 'Health data: consent, minimization and strict role-based clinical access.',
    },
    exposition: {
      fr: 'COMEX Health compare « durée de séjour » et « coût épisode » sur deux grains.',
      en: 'Health board compares “length of stay” and “episode cost” at two grains.',
    },
    ops: {
      fr: 'Pic épidémique : le run parcours patient doit tenir sans figer la facturation.',
      en: 'Epidemic peak: patient-pathway run must hold without freezing billing.',
    },
  },
}

export interface ExerciseCasting {
  home: MutualisEntity
  /** Filiale porteuse du lot / de l’exercice. */
  lead: MutualisEntity
  /** Autres filiales / équipes impliquées. */
  partners: MutualisEntity[]
  crossTeam: boolean
  setting: string
  domainProblem: string
}

function pickPartners(
  homeId: MutualisEntityId,
  leadId: MutualisEntityId,
  seed: number,
  count: number,
): MutualisEntity[] {
  const pool = MUTUALIS_ENTITIES.filter((e) => e.id !== homeId && e.id !== leadId)
  if (pool.length === 0 || count <= 0) return []
  const out: MutualisEntity[] = []
  let s = seed
  const used = new Set<string>()
  while (out.length < Math.min(count, pool.length)) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    const cand = pool[s % pool.length]!
    if (used.has(cand.id)) continue
    used.add(cand.id)
    out.push(cand)
  }
  return out
}

/**
 * Casting d’un exercice : entreprise d’affectation + filiales impliquées.
 * Varie selon niveau / phase / étape.
 */
export function resolveExerciseCasting(
  homeId: MutualisEntityId,
  opts: {
    levelId: number
    phase?: ProjectPhase
    stepId?: string
    locale?: PmGameLocale
  },
): ExerciseCasting {
  const locale = opts.locale ?? 'fr'
  const home = mutualisEntity(homeId)
  const seed = hashSeed(
    `${homeId}|${opts.levelId}|${opts.phase ?? 'x'}|${opts.stepId ?? 'lot'}`,
  )

  // ~60 % lead = home ; sinon une autre filiale porte le sujet (le joueur intervient en transverse)
  const leadAway = seed % 5 >= 3
  const others = MUTUALIS_ENTITIES.filter((e) => e.id !== homeId)
  const lead = leadAway && others.length > 0 ? others[seed % others.length]! : home

  const partnerCount = seed % 4 === 0 ? 2 : seed % 3 === 0 ? 1 : 0
  const partners = pickPartners(homeId, lead.id, seed >>> 3, partnerCount)
  const crossTeam = partners.length > 0 || lead.id !== homeId

  const beat =
    (opts.phase && DOMAIN_BEATS[lead.id]?.[opts.phase]?.[locale]) ||
    DOMAIN_BEATS[lead.id]?.cadrage?.[locale] ||
    lead.blurb[locale]

  const partnerNames = partners.map((p) => p.name).join(locale === 'en' ? ', ' : ', ')
  const setting =
    locale === 'en'
      ? crossTeam
        ? `You are assigned to ${home.name} (${MUTUALIS_GROUP_NAME}). This batch is led by ${lead.name}` +
          (partners.length
            ? ` with ${partnerNames} teams in the room.`
            : lead.id !== homeId
              ? ` — you join as a cross-subsidiary contributor.`
              : '.')
        : `Home company: ${home.name} · Domain: ${lead.domain.en}.`
      : crossTeam
        ? `Tu es rattaché(e) à ${home.name} (${MUTUALIS_GROUP_NAME}). Ce lot est porté par ${lead.name}` +
          (partners.length
            ? ` avec les équipes ${partnerNames} autour de la table.`
            : lead.id !== homeId
              ? ` — tu interviens en transverse groupe.`
              : '.')
        : `Entreprise d’affectation : ${home.name} · Domaine : ${lead.domain.fr}.`

  return {
    home,
    lead,
    partners,
    crossTeam,
    setting,
    domainProblem: beat,
  }
}

/** Remplace les mentions Retail génériques par la filiale lead. */
export function rebrandMutualisCopy(text: string, lead: MutualisEntity): string {
  return text.replace(/Mutualis Retail/gi, lead.name)
}

export function castingChip(cast: ExerciseCasting, locale: PmGameLocale): string {
  const parts = [cast.lead.name, ...cast.partners.map((p) => p.name)]
  if (locale === 'en') {
    return cast.crossTeam
      ? `Group cast: ${parts.join(' · ')} (home: ${cast.home.name})`
      : `Entity: ${cast.lead.name}`
  }
  return cast.crossTeam
    ? `Casting groupe : ${parts.join(' · ')} (affectation : ${cast.home.name})`
    : `Filiale : ${cast.lead.name}`
}
