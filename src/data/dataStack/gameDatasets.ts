/** Datasets du PM Game (Python / Spark / SQL), served from public/data-game/. */

const DATA_GAME = `${import.meta.env?.BASE_URL || '/'}data-game/`

function dataGame(file: string): string {
  return `${DATA_GAME}${file}`
}

export interface GameDataset {
  href: string
  label: string
  hint: string
  source: 'Python' | 'Spark' | 'SQL'
}

export const GAME_DATASETS = {
  retailEmployees: {
    href: dataGame('retail_employees.csv'),
    label: 'retail_employees.csv',
    hint: 'Employés retail (SCD-like) — module Spark.',
    source: 'Spark',
  },
  appartements: {
    href: dataGame('appartements_nord_pdc.csv'),
    label: 'appartements_nord_pdc.csv',
    hint: 'Mutations immobilières Nord / PdC — module SQL.',
    source: 'SQL',
  },
  weightsTurnover: {
    href: dataGame('weights_turnover_retail.csv'),
    label: 'weights_turnover_retail.csv',
    hint: 'Poids de CA retail complet (~87k lignes) — module SQL.',
    source: 'SQL',
  },
  weightsSample: {
    href: dataGame('weights_turnover_sample.csv'),
    label: 'weights_turnover_sample.csv',
    hint: 'Échantillon léger (~480 lignes, 6 magasins) pour Power BI — UTF-8.',
    source: 'SQL',
  },
  capteur: {
    href: dataGame('capteur_a_retail.csv'),
    label: 'capteur_a_retail.csv',
    hint: 'Fréquentation capteur porte A — module SQL.',
    source: 'SQL',
  },
  football: {
    href: dataGame('football_season_1011.csv'),
    label: 'football_season_1011.csv',
    hint: 'Résultats Ligue 1 saison 2010-11 — module SQL.',
    source: 'SQL',
  },
  footballNotes: {
    href: dataGame('notes_season_1011.txt'),
    label: 'notes_season_1011.txt',
    hint: 'Notes associées au dataset football.',
    source: 'SQL',
  },
  drillMachine: {
    href: dataGame('drill_machine.json'),
    label: 'drill_machine.json',
    hint: 'Fiche machine (JSON) — module Python.',
    source: 'Python',
  },
  ventes: {
    href: dataGame('ventes_semaine.csv'),
    label: 'ventes_semaine.csv',
    hint: 'Commandes hebdo Mutualis (statut, magasin, montant).',
    source: 'SQL',
  },
  clients: {
    href: dataGame('clients_ref.csv'),
    label: 'clients_ref.csv',
    hint: 'Référentiel clients Mutualis (clé client_id).',
    source: 'SQL',
  },
  doublons: {
    href: dataGame('clients_doublons.csv'),
    label: 'clients_doublons.csv',
    hint: 'Extract CRM sale : doublons email / orthographes sociétés.',
    source: 'SQL',
  },
} as const satisfies Record<string, GameDataset>
