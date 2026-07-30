/** Datasets for the PM Game (Python / Spark / SQL), served from public/data-game/. */

import type { PmGameLocale } from '../../i18n/pmGameLocale'

const DATA_GAME = `${import.meta.env?.BASE_URL || '/'}data-game/`

function dataGame(file: string): string {
  return `${DATA_GAME}${file}`
}

export interface GameDataset {
  href: string
  label: string
  /** French hint (default). */
  hint: string
  /** English hint; falls back to `hint` if omitted. */
  hintEn?: string
  source: 'Python' | 'Spark' | 'SQL'
}

export function datasetHint(
  ds: { hint?: string; hintEn?: string } | undefined,
  locale: PmGameLocale = 'fr',
): string {
  if (!ds) return ''
  const fr = ds.hint ?? ''
  return locale === 'en' ? (ds.hintEn ?? fr) : fr
}

export const GAME_DATASETS = {
  retailEmployees: {
    href: dataGame('retail_employees.csv'),
    label: 'retail_employees.csv',
    hint: 'Employés retail (SCD-like) — module Spark.',
    hintEn: 'Retail employees (SCD-like) — Spark module.',
    source: 'Spark',
  },
  appartements: {
    href: dataGame('appartements_nord_pdc.csv'),
    label: 'appartements_nord_pdc.csv',
    hint: 'Mutations immobilières Nord / PdC — module SQL.',
    hintEn: 'Property transactions Nord / PdC — SQL module.',
    source: 'SQL',
  },
  weightsTurnover: {
    href: dataGame('weights_turnover_retail.csv'),
    label: 'weights_turnover_retail.csv',
    hint: 'Poids de CA retail complet (~87k lignes) — module SQL.',
    hintEn: 'Full retail turnover weights (~87k rows) — SQL module.',
    source: 'SQL',
  },
  weightsSample: {
    href: dataGame('weights_turnover_sample.csv'),
    label: 'weights_turnover_sample.csv',
    hint: 'Échantillon léger (~480 lignes, 6 magasins) pour Power BI — UTF-8.',
    hintEn: 'Light sample (~480 rows, 6 stores) for Power BI — UTF-8.',
    source: 'SQL',
  },
  capteur: {
    href: dataGame('capteur_a_retail.csv'),
    label: 'capteur_a_retail.csv',
    hint: 'Fréquentation capteur porte A — module SQL.',
    hintEn: 'Door A footfall sensor — SQL module.',
    source: 'SQL',
  },
  football: {
    href: dataGame('football_season_1011.csv'),
    label: 'football_season_1011.csv',
    hint: 'Résultats Ligue 1 saison 2010-11 — module SQL.',
    hintEn: 'Ligue 1 results season 2010-11 — SQL module.',
    source: 'SQL',
  },
  footballNotes: {
    href: dataGame('notes_season_1011.txt'),
    label: 'notes_season_1011.txt',
    hint: 'Notes associées au dataset football.',
    hintEn: 'Notes for the football dataset.',
    source: 'SQL',
  },
  drillMachine: {
    href: dataGame('drill_machine.json'),
    label: 'drill_machine.json',
    hint: 'Fiche machine (JSON) — module Python.',
    hintEn: 'Machine record (JSON) — Python module.',
    source: 'Python',
  },
  ventes: {
    href: dataGame('ventes_semaine.csv'),
    label: 'ventes_semaine.csv',
    hint: 'Commandes hebdo Mutualis (statut, magasin, montant).',
    hintEn: 'Mutualis weekly orders (status, store, amount).',
    source: 'SQL',
  },
  clients: {
    href: dataGame('clients_ref.csv'),
    label: 'clients_ref.csv',
    hint: 'Référentiel clients Mutualis (clé client_id).',
    hintEn: 'Mutualis customer reference (client_id key).',
    source: 'SQL',
  },
  doublons: {
    href: dataGame('clients_doublons.csv'),
    label: 'clients_doublons.csv',
    hint: 'Extract CRM sale : doublons email / orthographes sociétés.',
    hintEn: 'Dirty CRM extract: email duplicates / company spelling variants.',
    source: 'SQL',
  },
} as const satisfies Record<string, GameDataset>
