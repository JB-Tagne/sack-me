/** Banque PM transversale — aspects humains & projet (FR). */

import type { StepProjectMgmt } from './pmGovTypes'

type PmCore = Omit<StepProjectMgmt, 'scenarioTwist'>

function pm(
  partial: Omit<StepProjectMgmt, 'frameworkRef'> & { frameworkRef?: string },
): PmCore {
  return {
    frameworkRef: 'Gestion de projet / Soft skills · Agile',
    ...partial,
  }
}

/**
 * Conflit, personnes, décision, communication, négociation, conduite du changement, leadership…
 * Mélangée aux banques phase dans defaultPmForPhase.
 */
export const HUMAN_BANK_FR: readonly PmCore[] = [
  pm({
    link: 'Gestion de conflit — désaccord technique en public.',
    question:
      'Deux seniors s’affrontent en Daily sur une approche. Meilleure posture PM / SM ?',
    options: [
      'Laisser durer pour « que ça se règle »',
      'Parker le débat, recentrer le Goal, faciliter un créneau dédié hors Daily',
      'Imposer ta solution préférée devant tout le monde',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — facilitation · Gestion de projet — Conflict management',
    correction:
      'Le Daily n’est pas un tribunal. On protège le flux, on traite le conflit en espace adapté, sans humiliation.',
  }),
  pm({
    link: 'Gestion de conflit — métier vs IT.',
    question: 'Le métier accuse la DSI de « freiner » ; la DSI accuse le métier d’« improviser ». Que fais-tu ?',
    options: [
      'Prendre parti pour le plus haut gradé',
      'Faciliter un atelier faits / impacts / options, faire trancher l’Accountable',
      'Éviter le sujet jusqu’au prochain PI',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Stakeholder & conflict · agile à l’échelle — alignment',
    correction:
      'On remplace les accusations par des faits et un arbitrage Owner. Le PM facilite, il ne joue pas les clans.',
  }),
  pm({
    link: 'Gestion des personnes — capacité et surcharge.',
    question: 'Un développeur clé enchaîne les nuits pour tenir la date. Réflexe ?',
    options: [
      'Le féliciter et en demander encore plus',
      'Protéger la capacity : replanifier, dire non au scope, traiter le risque humain',
      'Ignorer tant que le burndown est vert',
    ],
    correctIndex: 1,
    frameworkRef: 'agile à l’échelle — sustainable pace · Scrum — team health · Gestion de projet — Resource',
    correction:
      'Le rythme soutenable est une contrainte projet. Brûler les gens détruit la delivery à moyen terme.',
  }),
  pm({
    link: 'Gestion des personnes — feedback & performance.',
    question: 'Une personne rate plusieurs AC d’affilée. Approche constructive ?',
    options: [
      'La blâmer en Sprint Review',
      'Feedback privé factuel + pairage / clarification AC + plan d’amélioration',
      'La retirer du board sans discussion',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Team performance · Scrum — coaching',
    correction:
      'Feedback privé, faits, soutien. La Review n’est pas un tribunal individuel.',
  }),
  pm({
    link: 'Prise de décision — sous incertitude.',
    question: 'Il manque 30 % d’info pour choisir l’outil. Que décides-tu ?',
    options: [
      'Attendre d’avoir 100 % des infos',
      'Décider avec critères explicites, timebox, et critère de pivot documenté',
      'Laisser chacun choisir son outil en silence',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Decision making · Agile — reversible decisions',
    correction:
      'Décider avec un cadre (critères, horizon, pivot) bat l’attente paralysante et le chaos.',
  }),
  pm({
    link: 'Prise de décision — RACI humain.',
    question: 'Qui doit trancher quand PO et architecte divergent sur le scope technique ?',
    options: [
      'Le plus bruyant sur Slack',
      'L’Accountable du Goal (souvent PO / sponsor) après options chiffrées',
      'Personne — on livre les deux options',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — RACI · Scrum — Product Owner · agile à l’échelle — content authority',
    correction:
      'Le PO / Accountable tranche sur la valeur ; l’archi éclaire les options. Pas de double vérité.',
  }),
  pm({
    link: 'Communication — mauvaise nouvelle.',
    question: 'Tu sais que le jalon COMEX va glisser de 5 jours. Quand communiques-tu ?',
    options: [
      'Le jour J, pour « ne pas stresser »',
      'Dès que le risque est crédible : faits, impact, options, décision demandée',
      'Seulement si quelqu’un pose la question',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Communication · agile à l’échelle — transparency',
    correction:
      'La confiance se construit sur l’alerte précoce. Retarder = amplifier la crise.',
  }),
  pm({
    link: 'Communication — audiences multiples.',
    question: 'Comment adapter le message COMEX vs équipe ?',
    options: [
      'Même jargon technique pour tous',
      'COMEX : décisions/risques/valeur ; équipe : impediments/plan/DoD',
      'Ne rien dire au COMEX pour protéger l’équipe',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Stakeholder communication · Scrum — information radiators',
    correction:
      'Même vérité, niveaux de détail adaptés. Pas de double langage trompeur.',
  }),
  pm({
    link: 'Négociation — scope vs date.',
    question: 'Le sponsor veut date fixe + scope fixe. Réponse saine ?',
    options: [
      'Accepter les deux et « se débrouiller »',
      'Négocier : date fixe ⇒ scope priorisé / MVP ; sinon date flottante',
      'Promettre secrètement un overtime généralisé',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Negotiation · Agile — iron triangle',
    correction:
      'On ne peut pas fixer date, scope et capacity sans trade-off. Le PM rend le triangle explicite.',
  }),
  pm({
    link: 'Influence sans autorité hiérarchique.',
    question: 'Tu n’as pas de pouvoir formel sur une équipe partenaire bloquante. Levier ?',
    options: [
      'Menacer par mail en copie générale',
      'Intérêt commun, données d’impact, escalade RACI si besoin',
      'Contourner en Shadow IT',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Influence · agile à l’échelle — dependency management',
    correction:
      'Influence = valeur partagée + faits + escalade propre. Pas de chantage ni de shadow.',
  }),
  pm({
    link: 'Leadership — sécurité psychologique.',
    question: 'Une junior signale une erreur en prod. Réaction qui renforce l’équipe ?',
    options: [
      'La ridiculiser pour « que ça serve d’exemple »',
      'Remercier le signalement, blameless post-mortem, correctif systémique',
      'Cacher l’incident pour protéger l’image',
    ],
    correctIndex: 1,
    frameworkRef: 'agile à l’échelle — Lean-Agile leadership · Gestion de projet — Team culture',
    correction:
      'La sécurité psychologique fait remonter les risques tôt. La culture du blâme les enterre.',
  }),
  pm({
    link: 'Conduite du changement — adoption.',
    question: 'Le métier n’utilise pas le nouveau dashboard. Priorité ?',
    options: [
      'Forcer l’usage par mail de direction',
      'Comprendre les freins, co-construire enablement, mesurer l’adoption',
      'Abandonner sans diagnostic',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Change management · Prosci / ADKAR (esprit)',
    correction:
      'L’adoption se gagne : freins, formation, champions, mesure — pas la contrainte seule.',
  }),
  pm({
    link: 'Réunion — facilitation.',
    question: 'Un atelier dérape en monologue du sponsor. Que fais-tu ?',
    options: [
      'Laisser finir « par respect »',
      'Recadrer l’objectif, timebox, redistribuer la parole',
      'Couper brutalement et quitter la salle',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum Master — facilitation · Gestion de projet — Meeting management',
    correction:
      'Faciliter = protéger l’objectif et l’équité de parole, avec fermeté respectueuse.',
  }),
  pm({
    link: 'Équipe — conflit de personnalité.',
    question: 'Deux profils refusent de travailler ensemble. Option viable ?',
    options: [
      'Les forcer sur le même ticket sans cadre',
      'Clarifier RACI, interface, règles de collab ; médiation si besoin',
      'Les isoler définitivement sans objectif commun',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Team management · Agile — collaboration',
    correction:
      'On cadre le « comment travailler ensemble » (rôles, interfaces). L’évitement pur coûte cher.',
  }),
  pm({
    link: 'Motivation — reconnaissance.',
    question: 'L’équipe vient de sauver un COMEX. Meilleur geste ?',
    options: [
      'Rien dire : « c’est normal »',
      'Reconnaître publiquement le résultat + apprentissage + recovery time',
      'Ajouter immédiatement un lot « encore plus dur »',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Recognition · sustainable pace',
    correction:
      'La reconnaissance + récupération entretiennent l’engagement. L’ingratitude puis le rush brûlent l’équipe.',
  }),
  pm({
    link: 'Décision — escalade.',
    question: 'Quand escalades-tu un blocage au sponsor ?',
    options: [
      'Dès le premier désaccord d’équipe',
      'Quand l’impact Goal/date/risque dépasse le mandat local et après tentative de résolution',
      'Jamais : ça fait « mauvais PM »',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Escalation · agile à l’échelle — problem-solving',
    correction:
      'Escalader trop tôt = bruit. Trop tard = crise. On escalade avec faits et options.',
  }),
  pm({
    link: 'Communication de crise.',
    question: 'Fuite partielle de données suspectée. Premier message interne ?',
    options: [
      'Silence radio jusqu’à investigation complète',
      'Alerte factuelle : ce qu’on sait / ne sait pas, actions, prochain point',
      'Minimiser publiquement « ce n’est rien »',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Crisis communication · Compliance',
    correction:
      'Transparence contrôlée : faits, actions, cadence. Ni panique ni déni.',
  }),
  pm({
    link: 'Négociation — vendor / prestataire.',
    question: 'Le prestataire dérive sur le forfait. Posture ?',
    options: [
      'Accepter sans avenant pour « garder la paix »',
      'Revenir au contrat / DoD, options (avenant, scope cut, exit), décider',
      'Menacer de contentieux dès le premier retard',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Procurement / negotiation',
    correction:
      'On gère par le cadre contractuel et des options claires — pas la naïveté ni l’escalade immédiate.',
  }),
  pm({
    link: 'Personnes — onboarding nouvel arrivant.',
    question: 'Un junior arrive en milieu de Sprint critique. Bon réflexe ?',
    options: [
      'Le laisser seul sur un chantier sensible',
      'Buddy, context Goal/DoD, tickets à sa portée, feedback court',
      'Lui faire lire 200 pages Confluence sans pairage',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Team development · Scrum — mentoring',
    correction:
      'Onboarding = buddy + contexte + charge progressive. Sinon risque qualité et démotivation.',
  }),
  pm({
    link: 'Décision — biais & données.',
    question: 'Un directeur pousse une option « parce que ça a marché ailleurs ». Toi ?',
    options: [
      'Suivre l’autorité sans analyse',
      'Exiger critères locaux (coût, risque, fit) et une preuve / spike court',
      'Refuser par principe toute idée externe',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Evidence-based decisions · Agile — spike',
    correction:
      'L’autorité n’annule pas le besoin de critères et de preuve locale.',
  }),
  pm({
    link: 'Conflit — priorités politiques.',
    question: 'Un VIP impose un ticket hors Sprint Goal. Que fais-tu ?',
    options: [
      'L’insérer en silence pour éviter le clash',
      'Rendre le trade-off visible (Goal / capacity) et faire arbitrer l’Accountable',
      'Dire non sans explication',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Sprint Goal protection · Gestion de projet — Issue & politics',
    correction:
      'On ne subit pas la politique en silence : on expose le coût et on fait décider.',
  }),
  pm({
    link: 'Communication — async & remote.',
    question: 'Équipe hybride : décisions perdues dans les meetings. Correction ?',
    options: [
      'Plus de réunions encore',
      'Décisions écrites (ADR / Confluence), owners, canaux async clairs',
      'Tout décider en privé entre 2 personnes',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Communication plan · remote collaboration',
    correction:
      'Décision = écrite, trouvée, owner. L’oral seul ne scale pas en hybride.',
  }),
]

/** Twists humains / organisationnels. */
export const HUMAN_TWISTS_FR: readonly string[] = [
  'Twist : conflit ouvert entre deux leads en réunion stakeholders.',
  'Twist : un collaborateur clé annonce un burn-out probable.',
  'Twist : un VIP contourne le PO et assigne du travail en direct.',
  'Twist : une rumeur Slack déstabilise l’équipe avant le COMEX.',
  'Twist : le prestataire change de lead mid-projet sans transition.',
  'Twist : deux métiers refusent de s’asseoir dans le même atelier.',
  'Twist : feedback toxique public après une Review.',
  'Twist : décision prise en comité… mais personne n’a le même souvenir.',
]
