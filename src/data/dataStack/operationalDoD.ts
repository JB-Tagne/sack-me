/** Definition of Done data — checklist technico-fonctionnelle par outil / phase. */

import type { PmGameLocale } from '../../i18n/pmGameLocale'
import type { ProjectPhase, ToolId } from './tools'

/**
 * DoD affichée pendant le livrable technique : rappelle que le code
 * n’est « fini » que s’il sert une décision métier gouvernée.
 */
export function dataDoDForStep(
  tool?: ToolId,
  phase?: ProjectPhase,
  locale: PmGameLocale = 'fr',
): string[] {
  const en = locale === 'en'
  const items: string[] = en
    ? [
        'Explicit batch success measure (KPI or acceptance criterion)',
        'Decision: go / no-go / pivot documented after the deliverable',
      ]
    : [
        'Mesure de succès du lot (KPI ou critère d’acceptation) explicite',
        'Décision : go / no-go / pivot documenté après le livrable',
      ]

  switch (tool) {
    case 'sql':
    case 'bigquery':
    case 'cloudsql':
    case 'dbt':
      items.push(
        ...(en
          ? [
              'Replayable SQL: grain, NULL filters and joins justified',
              'Minimal quality check (COUNT, uniqueness or assert) on the result',
            ]
          : [
              'SQL rejouable : grain, filtres NULL et jointures justifiés',
              'Contrôle qualité minimal (COUNT, unicité ou assert) sur le résultat',
            ]),
      )
      break
    case 'python':
    case 'spark':
    case 'databricks':
      items.push(
        ...(en
          ? [
              'Readable Python script (imports, functions, no local magic)',
              'Idempotence / dated paths or explicit parameters',
            ]
          : [
              'Script Python lisible (imports, fonctions, pas de magie locale)',
              'Idempotence / chemins datés ou paramètres explicites',
            ]),
      )
      break
    case 'airflow':
      items.push(
        ...(en
          ? [
              'DAG: schedule, sensors and retries aligned with business SLA',
              'Runbook: who escalates if red on COMEX morning',
            ]
          : [
              'DAG : schedule, sensors et retry cohérents avec le SLA métier',
              'Runbook : qui escalade si rouge le matin du COMEX',
            ]),
      )
      break
    case 'gcs':
      items.push(
        ...(en
          ? [
              'Landing: dated path, classification, retention if PII',
              'Source schema contract (DoR) before promotion',
            ]
          : [
              'Landing : path daté, classification, rétention si PII',
              'Contrat de schéma source (DoR) avant promotion',
            ]),
      )
      break
    case 'datagalaxy':
      items.push(
        ...(en
          ? [
              'Catalog entry: term, definition, Owner, technical link',
              'Owner / Steward RACI set for the domain',
            ]
          : [
              'Fiche catalogue : terme, définition, Owner, lien technique',
              'RACI Owner / Steward posé pour le domaine',
            ]),
      )
      break
    case 'powerbi':
    case 'looker':
      items.push(
        ...(en
          ? [
              'Viz aligned to mart / reference SQL (not a shadow Excel)',
              'Business Owner certifies the exposed number',
            ]
          : [
              'Viz alignée sur mart / SQL de référence (pas un Excel fantôme)',
              'Owner métier qui certifie le chiffre exposé',
            ]),
      )
      break
    case 'jira':
    case 'confluence':
      items.push(
        ...(en
          ? [
              'Ticket / page: testable AC + link to data artefact',
              'Out-of-scope and risks visible for the Sprint Goal',
            ]
          : [
              'Ticket / page : AC testables + lien vers artefact data',
              'Hors-scope et risques visibles pour le Sprint Goal',
            ]),
      )
      break
    default:
      items.push(
        en
          ? 'Traceable artefact (repo, ticket or dated screenshot)'
          : 'Artefact traçable (repo, ticket ou capture datée)',
      )
  }

  if (phase === 'gouvernance' || phase === 'exposition') {
    items.push(
      en
        ? 'GDPR / access: purpose, retention or classification if personal data'
        : 'RGPD / accès : finalité, rétention ou classification si données perso',
    )
  } else if (phase === 'ingestion' || phase === 'ops') {
    items.push(
      en
        ? 'Batch traceability (date, source, ops owner)'
        : 'Traçabilité du lot (date, source, responsable ops)',
    )
  } else {
    items.push(
      en
        ? 'Provisional Owner / Steward named for this deliverable'
        : 'Owner / Steward provisoires nommés pour ce livrable',
    )
  }

  return items
}
