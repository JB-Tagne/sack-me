/** Types partagés packs PM — évite les imports circulaires fr ↔ en. */

/**
 * Type de réunion simulée.
 * - coproj  : Comité de Projet avec l'équipe (avancement, blocages)
 * - copil   : Comité de Pilotage avec le COMEX (jalons, risques, budget)
 * - sprint-planning  : Scrum — Sprint Planning
 * - daily           : Scrum — Daily Scrum
 * - sprint-review   : Scrum — Sprint Review
 * - sprint-retro    : Scrum — Sprint Retrospective
 * - comex-danger    : COMEX — avertissement 50 %+ (interactif)
 * - comex-warning   : COMEX — dernier avertissement 75 %+
 * - comex-notice    : COMEX — préavis 80 %+
 * - comex-fired     : COMEX — licenciement 100 % (peut être évité)
 */
export type MeetingKind =
  | 'coproj'
  | 'copil'
  | 'sprint-planning'
  | 'daily'
  | 'sprint-review'
  | 'sprint-retro'
  | 'comex-danger'
  | 'comex-warning'
  | 'comex-notice'
  | 'comex-fired'

export interface MeetingQuestion {
  /** Prise de parole narrative du PNJ juste avant la question. */
  npcLine: string
  question: string
  options: [string, string, string]
  correctIndex: 0 | 1 | 2
  correction: string
  /**
   * Impact sur le fireRisk si la réponse est bonne (négatif = bonne nouvelle).
   * Seules les réunions COMEX fire ont un impact fireRisk.
   */
  fireRiskDelta?: number
}

export interface MeetingStep {
  kind: MeetingKind
  /** Titre affiché en haut du panneau réunion. */
  title: string
  /** Ligne narrative d'ouverture (contexte de la réunion). */
  opening: string
  /** 5 questions à répondre une à une. */
  questions: [
    MeetingQuestion,
    MeetingQuestion,
    MeetingQuestion,
    MeetingQuestion,
    MeetingQuestion,
  ]
  /** Message narratif de clôture (après les 5 questions). */
  closing: string
}

export interface StepProjectMgmt {
  /** Lien avec l’étape projet / phase. */
  link: string
  /** Question QCM chef de projet. */
  question: string
  options: [string, string, string]
  correctIndex: 0 | 1 | 2
  correction: string
  /** Réf. framework (gestion de projet, Scrum, agile à l’échelle…). */
  frameworkRef: string
  /**
   * Changement de scénario « vraie vie » annoncé avant la QCM
   * (adaptation / pivot / contrainte soudaine).
   */
  scenarioTwist?: string
}

export interface StepGovernance {
  /** Lien explicite avec la gouvernance data dans ce projet. */
  link: string
  /** Question QCM de gouvernance. */
  question: string
  /** Exactement 3 propositions. */
  options: [string, string, string]
  /** Index de la bonne réponse (0 | 1 | 2). */
  correctIndex: 0 | 1 | 2
  /** Correction détaillée + référence gouvernance data. */
  correction: string
  /** Référence courte Référentiel gouvernance (affichage). */
  damaRef: string
}
