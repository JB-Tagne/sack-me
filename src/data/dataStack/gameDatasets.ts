/** Datasets du PM Game (Python / Spark / SQL), servis via /data-game/. */

export interface GameDataset {
  href: string
  label: string
  hint: string
  source: 'Python' | 'Spark' | 'SQL'
}

export const GAME_DATASETS = {
  retailEmployees: {
    href: '/data-game/retail_employees.csv',
    label: 'retail_employees.csv',
    hint: 'Employés retail (SCD-like) — module Spark.',
    source: 'Spark',
  },
  appartements: {
    href: '/data-game/appartements_nord_pdc.csv',
    label: 'appartements_nord_pdc.csv',
    hint: 'Mutations immobilières Nord / PdC — module SQL.',
    source: 'SQL',
  },
  weightsTurnover: {
    href: '/data-game/weights_turnover_retail.csv',
    label: 'weights_turnover_retail.csv',
    hint: 'Poids de CA retail complet (~87k lignes) — module SQL.',
    source: 'SQL',
  },
  weightsSample: {
    href: '/data-game/weights_turnover_sample.csv',
    label: 'weights_turnover_sample.csv',
    hint: 'Échantillon léger (~480 lignes, 6 magasins) pour Power BI — UTF-8.',
    source: 'SQL',
  },
  capteur: {
    href: '/data-game/capteur_a_retail.csv',
    label: 'capteur_a_retail.csv',
    hint: 'Fréquentation capteur porte A — module SQL.',
    source: 'SQL',
  },
  football: {
    href: '/data-game/football_season_1011.csv',
    label: 'football_season_1011.csv',
    hint: 'Résultats Ligue 1 saison 2010-11 — module SQL.',
    source: 'SQL',
  },
  footballNotes: {
    href: '/data-game/notes_season_1011.txt',
    label: 'notes_season_1011.txt',
    hint: 'Notes associées au dataset football.',
    source: 'SQL',
  },
  drillMachine: {
    href: '/data-game/drill_machine.json',
    label: 'drill_machine.json',
    hint: 'Fiche machine (JSON) — module Python.',
    source: 'Python',
  },
  ventes: {
    href: '/data-game/ventes_semaine.csv',
    label: 'ventes_semaine.csv',
    hint: 'Commandes hebdo Mutualis (statut, magasin, montant).',
    source: 'SQL',
  },
  clients: {
    href: '/data-game/clients_ref.csv',
    label: 'clients_ref.csv',
    hint: 'Référentiel clients Mutualis (clé client_id).',
    source: 'SQL',
  },
  doublons: {
    href: '/data-game/clients_doublons.csv',
    label: 'clients_doublons.csv',
    hint: 'Extract CRM sale : doublons email / orthographes sociétés.',
    source: 'SQL',
  },
} as const satisfies Record<string, GameDataset>
