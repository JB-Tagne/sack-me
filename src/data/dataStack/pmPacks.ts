/** Packs gestion de projet — QCM (gestion de projet / Scrum / agile à l’échelle) + twists scénario auto. */

import type { ProjectPhase, ToolId } from './tools'
import type { StepProjectMgmt } from './pmGovTypes'
import { resolveProjectMgmtEn } from './pmPacks.en'
import { HUMAN_BANK_FR, HUMAN_TWISTS_FR } from './pmHumanBank'

export type { StepProjectMgmt } from './pmGovTypes'

function pm(
  partial: Omit<StepProjectMgmt, 'frameworkRef'> & { frameworkRef?: string },
): StepProjectMgmt {
  return {
    frameworkRef: 'Gestion de projet / Agile',
    ...partial,
  }
}

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length]!
}

/** Twists génériques — injectés auto si le pack n’en a pas. */
const TWISTS_BY_PHASE: Record<ProjectPhase, readonly string[]> = {
  cadrage: [
    'Twist : le sponsor élargit le MVP en réunion (« et aussi du temps réel »).',
    'Twist : le COMEX avance de 10 jours sans budget supplémentaire.',
    'Twist : deux sponsors donnent des objectifs contradictoires sur le même KPI.',
    'Twist : la DSI impose un outil hors backlog alors que le Goal n’est pas cadré.',
  ],
  ingestion: [
    'Twist : la source landing arrive avec 1 jour de retard et un schéma partiellement changé.',
    'Twist : le fournisseur coupe l’API le jour du Sprint Review.',
    'Twist : un fichier CSV « urgence » arrive hors contrat de schéma.',
    'Twist : Ops refuse de livrer le dump tant que le SLA d’accès n’est pas signé.',
  ],
  transformation: [
    'Twist : une dépendance cross-équipe bloque le modèle mart jusqu’à nouvel arbitrage.',
    'Twist : Finance change la définition « livree » mid-Sprint.',
    'Twist : dbt tests rouges sur le golden record la veille du COMEX.',
    'Twist : capacité équipe coupée de 30 % (maladie / autre PI).',
  ],
  gouvernance: [
    'Twist : audit interne demande Owner + classification avant toute publication.',
    'Twist : la DPO bloque le Dataset tant que finalité/rétention ne sont pas écrites.',
    'Twist : un Shadow IT Excel circule avec un chiffre « officiel » divergent.',
    'Twist : DataGalaxy / catalogue incomplet — personne ne veut être Accountable.',
  ],
  exposition: [
    'Twist : deux directions comparent des chiffres divergents en COMEX.',
    'Twist : le sponsor veut « une belle carte demain » sans requête de référence.',
    'Twist : Looker et Power BI affichent le même nom de KPI avec deux grains.',
    'Twist : un directeur exige de masquer un outlier pour « rassurer » le board.',
  ],
  ops: [
    'Twist : incident prod — sensor rouge, mart incomplet à l’heure SLA.',
    'Twist : FileSensor timeout trois matins de suite avant le COMEX.',
    'Twist : rollback demandé : personne n’a le runbook à jour.',
    'Twist : on-call data absente, escalade métier directe sur le Slack #comex.',
  ],
}

const TWISTS_ANY: readonly string[] = [
  'Twist : une contrainte métier change en cours de Sprint.',
  'Twist : le Product Goal reste, mais le chemin technique doit pivoter.',
  'Twist : un stakeholder VIP entre en réunion et change la priorité à chaud.',
  'Twist : dette technique invisible menace le prochain Increment.',
  ...HUMAN_TWISTS_FR,
]

type PmCore = Omit<StepProjectMgmt, 'scenarioTwist'>

/** Banques PM par phase — rotation auto (endless + fallback). */
const BANK: Record<ProjectPhase, readonly PmCore[]> = {
  cadrage: [
    pm({
      link: 'Cadrage : vision, hors-scope, stakeholders.',
      question: 'Face à un élargissement de scope spontané, que fais-tu ?',
      options: [
        'Tout accepter pour « faire plaisir »',
        'Ramener au Product Goal / hors-scope, renegocier le backlog',
        'Ignorer le sponsor',
      ],
      correctIndex: 1,
      frameworkRef: 'Scrum — Product Goal · Gestion de projet — Scope · agile à l’échelle — Lean Budget Guardrails',
      correction:
        'Protéger le Goal et le hors-scope. Le changement passe par le backlog, pas par la promesse émotionnelle.',
    }),
    pm({
      link: 'Initiation : réduire l’incertitude avant de figer le plan.',
      question: 'Quel premier geste PM est le plus value-driven ?',
      options: [
        'Verrouiller un Gantt de 40 tâches avant toute discovery',
        'Lancer une discovery courte (risques, sources, AC) pour éclairer le backlog',
        'Attendre l’architecture cloud à 100 %',
      ],
      correctIndex: 1,
      frameworkRef: 'Gestion de projet — Focus on value · Scrum — empiricism',
      correction:
        'L’empirisme et la valeur passent par l’inspection utile. Un plan figé avant les faits est du théâtre.',
    }),
    pm({
      link: 'Stakeholders : objectifs contradictoires.',
      question: 'Deux sponsors tirent le KPI dans des sens opposés. Facilitation ?',
      options: [
        'Livrer deux KPI secrets sous le même nom',
        'Faciliter l’arbitrage Accountable, documenter une définition unique',
        'Choisir le plus haut gradé sans transparence',
      ],
      correctIndex: 1,
      frameworkRef: 'Gestion de projet — Stakeholder · Scrum — Product Goal clarity · agile à l’échelle — alignment',
      correction:
        'Un nom, une définition. Le PM facilite l’arbitrage Owner — pas le chaos politique.',
    }),
    pm({
      link: 'Décision technico-fonctionnelle : choisir le bon levier (SQL vs script vs outil).',
      question:
        'Le métier veut un contrôle d’unicité demain. Quelle décision PM/tech est la plus saine ?',
      options: [
        'Promettre un dashboard Looker sans aucune règle en amont',
        'Prioriser une règle testable (SQL/dbt/Python) + Owner, puis exposer le KPI',
        'Tout faire à la main dans Excel « juste pour cette fois »',
      ],
      correctIndex: 1,
      frameworkRef: 'Gestion de projet — Quality · Scrum — built-in quality · agile à l’échelle — Built-in Quality',
      correction:
        'La décision produit part d’une règle industrialisable. Le viz vient après la vérité gouvernée.',
    }),
  ],
  ingestion: [
    pm({
      link: 'Ingestion : dépendances externes et risques d’intégration.',
      question: 'Source en retard + schéma instable. Priorité PM ?',
      options: [
        'Faire semblant que tout est vert',
        'Visibiliser le risque, adapter le Sprint Goal / plan, sécuriser un contrat de schéma',
        'Doubler les équipes sans clarifier',
      ],
      correctIndex: 1,
      frameworkRef: 'Gestion de projet — Risk · agile à l’échelle — Dependency · Scrum — adapt Sprint Goal',
      correction:
        'Transparence du risque + adaptation du Goal. Le contrat de schéma réduit le chaos d’intégration.',
    }),
    pm({
      link: 'Landing : Definition of Ready des sources.',
      question: 'Un CSV « urgence » arrive hors contrat. Que fais-tu ?',
      options: [
        'L’ingérer en prod sans questions',
        'Le traiter en risque : quarantaine, Owner, AC schéma avant promotion',
        'Le laisser sur le Desktop d’un stagiaire',
      ],
      correctIndex: 1,
      frameworkRef: 'Scrum — DoR · Gestion de projet — Quality gates · agile à l’échelle — Guardrails',
      correction:
        'Pas de bypass des gates. Quarantaine + Owner + AC = ingestion contrôlée.',
    }),
    pm({
      link: 'Dépendance vendor / API.',
      question: 'L’API source coupe le jour de la Review. Réflexe ?',
      options: [
        'Annuler la Review sans communication',
        'Montrer l’Increment possible, exposer le risque ROAM, planifier le workaround',
        'Promettre que « ça marchera demain » sans plan',
      ],
      correctIndex: 1,
      frameworkRef: 'agile à l’échelle — ROAM · Scrum — Sprint Review honesty · Gestion de projet — Communication',
      correction:
        'Transparence en Review + risque Owned + plan. La confiance se construit sur les faits.',
    }),
  ],
  transformation: [
    pm({
      link: 'Transformation : delivery incrémentale et built-in quality.',
      question: 'Blocage cross-équipe sur le mart. Meilleure action ?',
      options: [
        'Attendre passivement la fin du PI',
        'Escalader / sync (PO Sync, RTE), proposer un Increment découpé',
        'Forker une solution locale non gouvernée',
      ],
      correctIndex: 1,
      frameworkRef: 'agile à l’échelle — PO Sync / RTE · Scrum — impediment · Gestion de projet — Integration',
      correction:
        'Les dépendances se gèrent par synchronisation et découpage — pas par shadow IT.',
    }),
    pm({
      link: 'Qualité modèle : DoD data.',
      question: 'Tests unique du golden record rouges la veille du COMEX. Posture ?',
      options: [
        'Forcer le vert et livrer quand même',
        'Bloquer Done, communiquer l’impact, prioriser le fix vs Goal',
        'Masquer le test « temporairement »',
      ],
      correctIndex: 1,
      frameworkRef: 'agile à l’échelle — Built-in Quality · Scrum — DoD · Gestion de projet — Quality',
      correction:
        'Built-in quality : rouge = pas Done. On adapte le plan, on ne ment pas au COMEX.',
    }),
    pm({
      link: 'Changement de définition métier mid-Sprint.',
      question: 'Finance change « livree ». Que fais-tu ?',
      options: [
        'Continuer l’ancien JOIN en silence',
        'Clarifier avec Owner, mettre à jour AC / risque, replanifier l’Increment',
        'Dupliquer deux KPI homonymes',
      ],
      correctIndex: 1,
      frameworkRef: 'Scrum — PO clarification · Gestion de projet — Change control · gouvernance data alignment',
      correction:
        'Changement de définition = impact scope/qualité. Clarifier, documenter, adapter.',
    }),
    pm({
      link: 'Arbitrage technique : SQL vs Python vs outillage.',
      question:
        'Tu dois fiabiliser un agrégat retail. Quelle décision technico-fonctionnelle ?',
      options: [
        'Tout coller dans Power BI sans couche mart',
        'Choisir SQL/dbt (ou Python) pour la règle + tests, BI uniquement pour l’exposition',
        'Réécrire 3 fois la même logique dans 3 outils « pour être sûr »',
      ],
      correctIndex: 1,
      frameworkRef: 'Gestion de projet — Make or buy / architecture · agile à l’échelle — Architectural Runway',
      correction:
        'Une règle, une couche de confiance. La BI consomme ; elle ne remplace pas le modèle testé.',
    }),
  ],
  gouvernance: [
    pm({
      link: 'Gouvernance : compliance et stewardship dans le plan.',
      question: 'L’audit exige Owner avant publication. Que fais-tu ?',
      options: [
        'Publier quand même pour tenir la date',
        'Bloquer Done tant que Owner/classification manquent ; ajuster le plan',
        'Mettre un faux nom d’Owner',
      ],
      correctIndex: 1,
      frameworkRef: 'Gestion de projet — Compliance · agile à l’échelle — Guardrails · gouvernance data + delivery',
      correction: 'Compliance dans le DoD. Date sans Owner = risque inacceptable.',
    }),
    pm({
      link: 'RGPD / DPO dans le flux agile.',
      question: 'La DPO exige finalité/rétention avant l’Increment. Intégration ?',
      options: [
        'Reporter à « après le go-live »',
        'Ajouter des AC compliance et bloquer Done tant que non satisfaits',
        'Publier les PII en self-service',
      ],
      correctIndex: 1,
      frameworkRef: 'Gestion de projet — Compliance · Scrum — DoD · agile à l’échelle — Guardrails',
      correction:
        'La compliance entre dans le DoD / AC. Livrer sans finalité = risque légal.',
    }),
    pm({
      link: 'Shadow IT vs single source of truth.',
      question: 'Un Excel « officiel » circule à côté du mart. Action PM ?',
      options: [
        'Laisser faire pour éviter le conflit',
        'Escalader : un seul Accountable, retirer le shadow du chemin de décision',
        'Fusionner les deux chiffres en moyenne',
      ],
      correctIndex: 1,
      frameworkRef: 'gouvernance data — Stewardship · agile à l’échelle — alignment · Gestion de projet — Issue mgmt',
      correction:
        'Deux vérités = échec de gouvernance. Un Owner, une source, transparence.',
    }),
  ],
  exposition: [
    pm({
      link: 'Exposition : acceptance et single source of truth.',
      question: 'Deux chiffres divergents en COMEX. Réflexe PM ?',
      options: [
        'Choisir le plus flatteur',
        'Suspendre la décision, réconcilier vs définition de référence, Owner tranche',
        'Interdire les questions',
      ],
      correctIndex: 1,
      frameworkRef: 'Scrum — Review honesty · Gestion de projet — Data-driven decisions',
      correction:
        'Pas de décision sur des faits non réconciliés. Transparence > storytelling.',
    }),
    pm({
      link: 'Séquençage valeur : vérité avant viz.',
      question: 'Carte BI demandée demain sans SQL de référence. Priorité ?',
      options: [
        'La carte d’abord, la définition « plus tard »',
        'La requête / définition KPI d’abord, puis la viz alignée',
        'Les deux sans Owner',
      ],
      correctIndex: 1,
      frameworkRef: 'Gestion de projet — Focus on value · agile à l’échelle — sequencing · Scrum — Goal',
      correction:
        'Sans définition exécutable, la viz n’a pas de valeur fiable.',
    }),
    pm({
      link: 'Acceptance BI en Sprint Review.',
      question: 'Quand acceptes-tu le dashboard ?',
      options: [
        'Dès que c’est joli',
        'Quand il réconcilie avec la définition de référence sous Owner',
        'Quand personne ne parle',
      ],
      correctIndex: 1,
      frameworkRef: 'Scrum — acceptance · Gestion de projet — Validate scope',
      correction: 'Acceptance = AC/DoD (réconciliation), pas esthétique ni silence.',
    }),
  ],
  ops: [
    pm({
      link: 'Ops : flow, SLA, résilience.',
      question: 'Incident sensor / SLA raté. Priorité ?',
      options: [
        'Cacher l’incident',
        'War-room légère : restore, communication, corrective action dans le backlog',
        'Réécrire tout le SI le jour même',
      ],
      correctIndex: 1,
      frameworkRef: 'agile à l’échelle — Flow / I&A · Gestion de projet — Incident · Scrum — adaptation',
      correction:
        'Stabiliser, communiquer, apprendre. Le correctif entre dans le backlog priorisé.',
    }),
    pm({
      link: 'Fiabilité pipeline = valeur continue.',
      question: 'Sensor rouge 3 matins de suite. Réponse PM / RTE ?',
      options: [
        'Blâmer l’équipe en public',
        'Impediment système : SLA, retries, runbook, capacity pour fiabiliser',
        'Désactiver le DAG pour « éviter le bruit »',
      ],
      correctIndex: 1,
      frameworkRef: 'agile à l’échelle — Flow · Scrum — remove impediments · Gestion de projet — Ops',
      correction:
        'On traite la cause et on alloue de la capacity — on ne coupe pas le signal.',
    }),
    pm({
      link: 'Résilience : rejeu et auditabilité.',
      question: 'Pourquoi exiger un paramètre de date (ds) sur la task ?',
      options: [
        'Pour décorer Airflow',
        'Pour rejeu, audit et recovery — résilience du système de delivery',
        'Pour éviter d’écrire des AC',
      ],
      correctIndex: 1,
      frameworkRef: 'Gestion de projet — Adaptability & resilience · agile à l’échelle — Built-in Quality',
      correction: 'Un système non rejouable n’est pas résilient.',
    }),
  ],
}

/** QCM PM par id d’étape curated. */
export const CURATED_PM: Record<string, StepProjectMgmt> = {
  'l0-open': pm({
    scenarioTwist:
      'Kick-off Mutualis : le sponsor avance la date COMEX de 2 semaines. L’équipe data n’a pas encore ouvert les CSV.',
    link: 'Phase discovery / initiation : sans comprendre les sources, tout planning est du théâtre.',
    question:
      'En tant que PM, quel premier geste est le plus aligné « focus on value » + empirisme ?',
    options: [
      'Verrouiller un Gantt de 40 tâches avant d’ouvrir un fichier',
      'Lancer une discovery courte des sources (schéma) pour éclairer le backlog et le risque',
      'Attendre que l’architecture cloud soit signée à 100 %',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Focus on value · Scrum — empiricism / Sprint Goal',
    correction:
      'La valeur commence par réduire l’incertitude utile. Une discovery source (transparent inspection) éclaire le Product Backlog et le plan. Un Gantt figé avant les données = anti-pattern gestion de projet / agile.',
  }),
  'l0-filter': pm({
    link: 'Après le schéma, le filtre métier « actifs » est une Definition of Done / critère d’acceptation en devenir.',
    question: 'Comment formuler ce filtre pour qu’il soit testable en revue (Scrum / qualité projet) ?',
    options: [
      '« Que ça marche » sans métrique',
      'Critère mesurable : effectif = COUNT active_record=1 (±0 vs extract de référence)',
      'Reporter la règle au Sprint suivant sans l’écrire',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Definition of Done / AC · Gestion de projet — Quality',
    correction:
      'Done et qualité exigent des critères vérifiables. Un AC chiffré permet d’accepter/refuser l’Increment ; « ça marche » n’est pas inspectable.',
  }),
  'l0-sql': pm({
    scenarioTwist:
      'Le PO RH demande le même KPI en SQL « pour la DSI » alors que l’équipe avait prévu uniquement pandas.',
    link: 'Changement de besoin mid-stream : adapter le backlog sans perdre le Product Goal.',
    question: 'Quelle réponse PM est la plus saine ?',
    options: [
      'Dire non par principe (outil déjà choisi)',
      'Clarifier le Product Goal, estimer l’impact, prioriser une story SQL dans le backlog',
      'Promettre les deux pour vendredi sans capacity check',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Product Owner / Backlog · agile à l’échelle — WSJF / capacity · Gestion de projet — Change',
    correction:
      'Le changement est normal. On l’accueille via le backlog (transparence), on évalue coût/risque (changement projet / capacité multi-équipes), on protège le Goal. Promesse sans capacité = dette et échec de Sprint.',
  }),
  'l1-dupes': pm({
    link: 'Qualité CRM = risque projet (scope, réputation, COMEX). Le PM doit ROAM / escalader.',
    question: 'Les doublons email menacent le KPI clients uniques. Meilleure posture PM ?',
    options: [
      'Ignorer : « on nettoiera en prod »',
      'Élever en risque (Owned), définir mitigation (règle MDM) et impact sur le Sprint Goal',
      'Demander à chaque analyste de dédupliquer dans son Excel perso',
    ],
    correctIndex: 1,
    frameworkRef: 'agile à l’échelle — ROAM · Gestion de projet — Risk responses · Scrum — impediment',
    correction:
      'Un défaut qualité systémique est un risque/impediment. ROAM (Owned) + mitigation explicite protège la valeur. Le shadow Excel multiplie les vérités.',
  }),
  'l1-join': pm({
    scenarioTwist:
      'Finance annonce que « livree » changera de sens la semaine prochaine (nouveau statut WMS).',
    link: 'Dépendance métier / définition KPI : intégration et gestion des interfaces.',
    question: 'Que fais-tu immédiatement en tant que PM ?',
    options: [
      'Continuer le JOIN actuel et « on verra »',
      'Bloquer/clarifier la définition avec Owner Finance, mettre à jour AC et risque de régression',
      'Dupliquer deux KPI secrets pour contenter tout le monde',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Stakeholder / Integration · Scrum — clarification PO · gouvernance data alignment',
    correction:
      'Changement de définition = impact scope/qualité. Clarifier avec l’Accountable, mettre à jour AC et communiquer. Deux KPI homonymes = chaos (anti-pattern BI + DG).',
  }),
  'l1-py-clean': pm({
    link: 'Industrialiser une règle = enabler technique + gouvernance du changement.',
    question: 'Comment prioriser ce nettoyage dans un ART / équipe Scrum ?',
    options: [
      'Le laisser en « dette invisible » hors backlog',
      'Enabler / story technique liée à un bénéfice (fiabilité CRM) et capacity allouée',
      'Le faire uniquement le week-end hors process',
    ],
    correctIndex: 1,
    frameworkRef: 'agile à l’échelle — Enablers · Scrum — Backlog transparency · Gestion de projet — Tailoring',
    correction:
      'Les enablers ont de la valeur (réduire le risque qualité). Ils doivent être visibles, estimés et planifiés — pas de shadow work.',
  }),
  'l2-sql': pm({
    link: 'Ingestion analytique : livrer un Increment utile (agrégat) plutôt qu’un monolithe.',
    question: 'Quelle découpe de livraison est la plus agile / Gestion de projet value-driven ?',
    options: [
      'Attendre le data lake complet avant tout SELECT',
      'Livrer d’abord un agrégat commune inspectable, puis itérer',
      'Ouvrir 12 chantiers parallèles sans Sprint Goal',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Increment · Gestion de projet — Incremental delivery · agile à l’échelle — MVP',
    correction:
      'Un Increment inspectable (même petit) crée du feedback. Attendre le monolithe retarde l’apprentissage ; trop de WIP détruit le focus.',
  }),
  'l2-capteur': pm({
    scenarioTwist:
      'Ops magasin escalade : 2 jours sous seuil non détectés — le COMEX veut un « alert SLA » dès demain.',
    link: 'Passage discovery → ops control : urgence vs capacité.',
    question: 'Comment arbitrer l’urgence COMEX ?',
    options: [
      'Tout stopper et coder 48h non-stop sans DoD',
      'Négocier un MVP alerte (filtre SQL + canal) + AC/SLA, protéger le reste du Goal',
      'Promettre un SI temps réel complet pour demain matin',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Sprint Goal protection · agile à l’échelle — MVP · Gestion de projet — Negotiate',
    correction:
      'Le PM négocie un Increment minimal viable avec AC clairs, sans sacrifier la qualité ni promettre l’impossible. Le Sprint Goal se protège, il ne s’efface pas.',
  }),
  'l2-foot': pm({
    link: 'Exercice « sport » = même pattern mart KPI : formaliser la règle métier.',
    question: 'Pourquoi le PM insiste-t-il sur une règle FTR=H écrite ?',
    options: [
      'Pour faire joli dans Confluence',
      'Pour des AC testables et une Definition of Ready/Done partagée',
      'Parce que le coach Agile l’a exigé sans raison',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — DoR/DoD · Gestion de projet — Requirements quality',
    correction:
      'Sans règle écrite, l’équipe ne peut pas livrer un Increment « Done » cohérent. DoR/DoD et exigences testables réduisent le rework.',
  }),
  'l2-window': pm({
    scenarioTwist:
      'Deux directions veulent le même nom de KPI mais des grains différents (créneau vs jour).',
    link: 'Conflit stakeholders / Product Goal uniqueness.',
    question: 'Meilleure facilitation PM ?',
    options: [
      'Choisir au hasard et cacher le grain',
      'Séparer en deux indicateurs nommés, faire trancher l’Owner, documenter',
      'Livrer un seul KPI ambigu pour « calmer » le comité',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — one Product Goal clarity · Gestion de projet — Stakeholder engagement · agile à l’échelle — alignment',
    correction:
      'Un nom, une définition. Le PM facilite l’arbitrage Owner et évite les indicateurs fourre-tout qui détruisent la confiance.',
  }),
  'l3-json': pm({
    link: 'Nouvelle source IoT = intégration : contrats, risques, architecture émergente.',
    question: 'Avant de parser le JSON en prod, que sécurises-tu en PM ?',
    options: [
      'Rien : « on parse et on verra »',
      'Owner du schéma, risques breaking change, place dans le PI/Sprint backlog',
      'Uniquement le logo du vendor dans la slide deck',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Integration / Risk · agile à l’échelle — Architectural Runway · Scrum — backlog item',
    correction:
      'Toute nouvelle interface est un risque d’intégration. Owner + runway + item de backlog = delivery contrôlée.',
  }),
  'l3-py': pm({
    scenarioTwist:
      'RGPD : la DPO demande la finalité et la rétention du fichier employés actifs avant le prochain Increment.',
    link: 'Compliance = contrainte projet, pas option.',
    question: 'Comment intègres-tu la demande DPO sans casser le flux ?',
    options: [
      'Ignorer jusqu’à l’audit',
      'Ajouter des AC compliance (finalité/rétention) et bloquer Done tant que non satisfaits',
      'Publier les PII en self-service pour « transparence »',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Compliance · Scrum — DoD · agile à l’échelle — Guardrails',
    correction:
      'La compliance entre dans le DoD / AC. Livrer sans finalité/rétention = risque légal et échec de stewardship.',
  }),
  'l3-py-merge': pm({
    link: 'Produit data Finance×CRM : dépendances cross-équipe.',
    question: 'Finance et CRM divergent sur « livree ». Rôle du PM / RTE / PO ?',
    options: [
      'Laisser chaque équipe livrer sa vérité',
      'Faciliter un arbitrage Accountable, mettre à jour le backlog commun',
      'Coder les deux JOIN en silence',
    ],
    correctIndex: 1,
    frameworkRef: 'agile à l’échelle — PO Sync / alignment · Scrum — PO · Gestion de projet — Conflict management',
    correction:
      'L’alignement cross-domaine est le job du système de delivery (PO/RTE/PM). Deux vérités = échec d’intégration.',
  }),
  'l3-dbt': pm({
    link: 'Transformation industrialisée : qualité dans la Definition of Done.',
    question: 'Où place-t-on les tests unique du golden record dans le DoD data ?',
    options: [
      'Nulle part — « dbt suffit comme process »',
      'Sur le mart (règle appliquée), exigés pour Done de l’Increment',
      'Uniquement sur des slides de gouvernance',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — DoD · agile à l’échelle — Built-in Quality · Gestion de projet — Quality',
    correction:
      'Built-in quality : les tests font partie de Done. Sur le mart, ils protègent le golden record.',
  }),
  'l4-kpi-sql': pm({
    scenarioTwist:
      'Le sponsor veut « une belle carte Power BI demain » alors que la requête KPI de référence n’existe pas.',
    link: 'Exposition vs vérité : ordre de livraison value-driven.',
    question: 'Que priorises-tu ?',
    options: [
      'La carte d’abord, la définition SQL « plus tard »',
      'La requête / définition KPI d’abord, puis la viz alignée',
      'Les deux en parallèle sans Owner',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Focus on value · agile à l’échelle — sequencing · Scrum — Goal',
    correction:
      'Sans définition exécutable, la viz n’a pas de valeur fiable. Séquencer vérité → exposition évite le théâtre COMEX.',
  }),
  'l4-grain': pm({
    link: 'Incident qualité grain = gestion d’issue / risque réalisé.',
    question: 'Dashboard qui multiplie les faits (mauvais grain). Action PM ?',
    options: [
      'Minimiser auprès du sponsor',
      'Incident qualité : retirer/corriger, post-mortem, AC grain mis à jour',
      'Ajouter un filtre cosmétique et fermer le ticket',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Issue mgmt · agile à l’échelle — Inspect & Adapt · Scrum — adaptation',
    correction:
      'Un défaut de grain est un issue qualité. Transparence, correction, apprentissage (I&A) — pas de cosmétiques.',
  }),
  'l4-pbi': pm({
    link: 'Certification BI = acceptance de l’Increment analytique.',
    question: 'Quand acceptes-tu la carte Power BI en revue ?',
    options: [
      'Dès que le visuel est joli',
      'Quand elle réconcilie avec la requête SQL de référence sous Owner',
      'Quand personne n’a levé la main en réunion',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Sprint Review / acceptance · Gestion de projet — Validate scope',
    correction:
      'L’acceptance se base sur des AC/DoD (réconciliation), pas sur l’esthétique ni le silence.',
  }),
  'l5-af': pm({
    scenarioTwist:
      'Le FileSensor timeout trois matins de suite : le COMEX n’a pas eu le mart à 7h.',
    link: 'Ops / Run : fiabilité = valeur continue (flow).',
    question: 'Réponse PM / RTE la plus adaptée ?',
    options: [
      'Blâmer l’équipe data en public',
      'Traiter comme impediment système : SLA, retries, escalade runbook, capacity pour fiabiliser',
      'Désactiver le DAG pour « éviter le bruit »',
    ],
    correctIndex: 1,
    frameworkRef: 'agile à l’échelle — Flow / Impediment · Scrum — SM removes impediments · Gestion de projet — Ops handover',
    correction:
      'La fiabilité du pipeline est un objectif de flow. On traite la cause (SLA, sensor, escalade), on alloue de la capacity — on ne coupe pas le signal.',
  }),
  'l5-transform': pm({
    link: 'Rejeu par date = auditabilité et résilience (adaptability).',
    question: 'Pourquoi le PM exige-t-il le paramètre {{ ds }} sur la task ?',
    options: [
      'Pour décorer Airflow',
      'Pour permettre rejeu, audit et recovery — résilience du système de delivery',
      'Pour éviter d’écrire des AC',
    ],
    correctIndex: 1,
    frameworkRef: 'Gestion de projet — Adaptability & resilience · agile à l’échelle — Built-in Quality',
    correction:
      'Un système non rejouable n’est pas résilient. ds rend l’ops auditable et récupérable — exigence de qualité système.',
  }),
  'l5-cap': pm({
    link: 'Clôture de lot / I&A : RACI et apprentissages.',
    question: 'Pour le mart employés actifs, quel RACI présentes-tu en System Demo / Review ?',
    options: [
      'Personne accountable',
      'Responsible = data engineer ; Accountable = Data Owner RH',
      'Accountable = l’outil Airflow',
    ],
    correctIndex: 1,
    frameworkRef: 'agile à l’échelle — System Demo / I&A · Gestion de projet — Stewardship · Scrum — accountability',
    correction:
      'Les rôles restent humains. Accountable Owner + Responsible delivery = gouvernance et delivery alignées.',
  }),
}

function rotateOptions(pack: StepProjectMgmt, seed: number): StepProjectMgmt {
  const correct = pack.options[pack.correctIndex]
  const wrongs = pack.options.filter((_, i) => i !== pack.correctIndex)
  const slot = (seed % 3) as 0 | 1 | 2
  const rebuilt: [string, string, string] = ['', '', '']
  let wi = 0
  for (let i = 0; i < 3; i++) {
    if (i === slot) rebuilt[i] = correct
    else {
      rebuilt[i] = wrongs[wi]!
      wi += 1
    }
  }
  return { ...pack, options: rebuilt, correctIndex: slot }
}

function ensureTwist(
  pack: StepProjectMgmt,
  stepId: string,
  phase: ProjectPhase | undefined,
  intensity: number,
): StepProjectMgmt {
  const seed = hashSeed(`${stepId}|${phase ?? 'x'}|${intensity}`)
  const pool = phase
    ? [...TWISTS_BY_PHASE[phase], ...HUMAN_TWISTS_FR]
    : TWISTS_ANY
  let twist = pack.scenarioTwist ?? pick(pool, seed)
  if (!pack.scenarioTwist && toolHintTwist(stepId, intensity)) {
    twist = toolHintTwist(stepId, intensity) ?? twist
  }
  if (intensity >= 8) {
    twist = `${twist} Pression M${intensity} : décision attendue sous 24h, capacity figée.`
  } else if (intensity >= 6 && !pack.scenarioTwist) {
    twist = `${twist} Le PI/Sprint Goal est sous tension.`
  }
  return { ...pack, scenarioTwist: twist }
}

function toolHintTwist(stepId: string, _intensity: number): string | undefined {
  const id = stepId.toLowerCase()
  if (id.includes('airflow') || id.includes('af')) {
    return 'Twist : le DAG critique est rouge le matin du COMEX.'
  }
  if (id.includes('powerbi') || id.includes('pbi') || id.includes('looker')) {
    return 'Twist : la viz est prête mais personne n’a validé la requête de référence.'
  }
  if (id.includes('dbt')) {
    return 'Twist : les tests dbt unique échouent sur le mart golden record.'
  }
  return undefined
}

export function defaultPmForPhase(
  phase?: ProjectPhase,
  tool?: ToolId,
  stepId = 'anon',
  intensity = 0,
): StepProjectMgmt {
  const seed = hashSeed(`${stepId}|${phase ?? 'any'}|${tool ?? ''}|${intensity}`)
  const ph: ProjectPhase = phase ?? 'cadrage'
  const phaseBank = BANK[ph] ?? BANK.cadrage
  // ~40 % aspects humains / transverses ; sinon banque de phase
  const useHuman = seed % 5 < 2
  const bank = useHuman ? HUMAN_BANK_FR : phaseBank
  const core = pick(bank, seed)
  const rotated = rotateOptions(core, seed >>> 3)
  return ensureTwist(rotated, stepId, ph, intensity)
}

/**
 * Résout le pack PM d’une tâche.
 * - Curated : pack dédié + twist auto si manquant
 * - Endless / fallback : banque phase + rotation options + twist selon intensité
 */
export function resolveProjectMgmt(
  stepId: string,
  phase?: ProjectPhase,
  tool?: ToolId,
  override?: StepProjectMgmt,
  intensity = 0,
  locale: 'fr' | 'en' = 'fr',
): StepProjectMgmt {
  if (locale === 'en') {
    return resolveProjectMgmtEn(stepId, phase, tool, override, intensity)
  }
  const base = CURATED_PM[stepId] ?? override ?? defaultPmForPhase(phase, tool, stepId, intensity)
  return ensureTwist(base, stepId, phase, intensity)
}
