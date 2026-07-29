/**
 * Histoires Mutualis — une arc narratif distinct par (type de projet × rôle).
 * IT = SI / infra / archi / CRM / ERP…
 * Data-IA = analytics / BI / ML / automatisation / deep learning…
 */

import type { PmGameLocale } from '../../i18n/pmGameLocale'
import type { PlayerRoleId, ProjectKind } from './projectPaths'
import { roleFitsProject } from './projectPaths'
import type { ProjectPhase } from './tools'

export interface RoleStoryBeat {
  context: string
  problem: string
}

export interface RoleStory {
  /** Nom de code du programme Mutualis. */
  codename: string
  /** Périmètre technique (IT ou Data/IA). */
  scope: string
  /** Titre du brief. */
  projectName: string
  /** Accroche courte (welcome / HUD). */
  tagline: string
  /** Enjeux COMEX. */
  stakes: string
  /** Contexte de base. */
  context: string
  /** Problème métier Mutualis de base. */
  problem: string
  /** Objectifs transverses du rôle sur ce programme. */
  objectives: string[]
  /** Variations par phase du parcours. */
  phaseBeats: Partial<Record<ProjectPhase, RoleStoryBeat>>
}

type StoryPair = { fr: RoleStory; en: RoleStory }

function storyKey(kind: ProjectKind, role: PlayerRoleId): string {
  return `${kind}::${role}`
}

/** ——— IT : périmètres SI / CRM / ERP / infra / archi ——— */

const IT_BA: StoryPair = {
  fr: {
    codename: 'Opération Client Unique',
    scope: 'CRM · SI commercial · intégrations caisse',
    projectName: 'Mutualis — modernisation CRM Client Unique',
    tagline:
      'Le CRM Mutualis est fragmenté : magasin, e-commerce et SAV ne partagent plus la même fiche client.',
    stakes: 'Le COMEX veut un Client 360 avant le Black Friday retail.',
    context:
      'Mutualis Retail lance la refonte de son CRM (Salesforce + legacy magasin). Tu es BA : tu dois faire parler le métier (ventes, SAV, marketing) et le SI sans promettre l’impossible.',
    problem:
      'Trois fiches client divergent (caisse, web, SAV). Les campagnes ciblent des clients « morts » et le SAV ne voit pas les commandes web.',
    objectives: [
      'Cartographier parcours client & impacts SI',
      'Rédiger AC testables pour la fiche unique',
      'Préparer la recette métier multi-canal',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Ateliers de cadrage : sponsors Ventes et SAV ne veulent pas le même « client unique ».',
        problem: 'Sans vision commune ni hors-scope, le CRM risque de devenir un fourre-tout.',
      },
      ingestion: {
        context: 'Les flux caisse → CRM arrivent en fichiers plats hétérogènes.',
        problem: 'Schémas magasin non documentés : la sync nocturne casse la fiche client.',
      },
      transformation: {
        context: 'Règles de survivorship (quelle source gagne ?) à spécifier.',
        problem: 'Deux numéros de téléphone « principaux » : le métier se dispute la vérité.',
      },
      gouvernance: {
        context: 'RGPD & finalités marketing bloquent certains champs.',
        problem: 'Le DPO exige finalité/rétention avant toute fusion de fiches.',
      },
      exposition: {
        context: 'Écrans SAV et app vendeur doivent afficher la même vérité.',
        problem: 'UAT : le SAV voit encore l’ancienne fiche pendant que le web est à jour.',
      },
      ops: {
        context: 'Basculer le run CRM sans coupure caisse.',
        problem: 'Un rollback mal préparé ferait perdre les tickets SAV du week-end.',
      },
    },
  },
  en: {
    codename: 'Operation Single Customer',
    scope: 'CRM · commercial systems · POS integrations',
    projectName: 'Mutualis — Single Customer CRM modernization',
    tagline:
      'Mutualis CRM is fragmented: store, e-commerce and support no longer share one customer record.',
    stakes: 'The board wants Customer 360 before retail Black Friday.',
    context:
      'Mutualis Retail is reworking its CRM (Salesforce + store legacy). You are the BA: make sales, support and marketing speak with IT without over-promising.',
    problem:
      'Three divergent customer records (POS, web, support). Campaigns hit “dead” customers; support cannot see web orders.',
    objectives: [
      'Map customer journeys & system impacts',
      'Write testable AC for the unified record',
      'Prepare multi-channel business UAT',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Framing workshops: Sales and Support sponsors disagree on “single customer”.',
        problem: 'Without shared vision and out-of-scope, the CRM becomes a dumping ground.',
      },
      ingestion: {
        context: 'POS → CRM feeds arrive as heterogeneous flat files.',
        problem: 'Undocumented store schemas: nightly sync breaks the customer record.',
      },
      transformation: {
        context: 'Survivorship rules (which source wins?) must be specified.',
        problem: 'Two “primary” phone numbers: business fights over the truth.',
      },
      gouvernance: {
        context: 'GDPR & marketing purposes block some fields.',
        problem: 'The DPO requires purpose/retention before any record merge.',
      },
      exposition: {
        context: 'Support screens and seller app must show the same truth.',
        problem: 'UAT: support still sees the old record while the web is up to date.',
      },
      ops: {
        context: 'Cut over CRM run without POS downtime.',
        problem: 'A weak rollback would lose weekend support tickets.',
      },
    },
  },
}

const IT_PM: StoryPair = {
  fr: {
    codename: 'Programme Phare ERP',
    scope: 'ERP finance · SI achats · infra cloud',
    projectName: 'Mutualis — migration ERP Finance (SAP → cloud)',
    tagline:
      'L’ERP finance Mutualis doit migrer sans stopper la clôture mensuelle ni les magasins.',
    stakes: 'Clôture J+3 non négociable ; tout glissement = crise COMEX.',
    context:
      'Mutualis bascule son ERP finance vers le cloud. Tu es chef de projet : planning, risques, prestataires, COPIL et dépendance infra réseau magasins.',
    problem:
      'Le legacy SAP on-prem et le nouvel ERP divergent sur le plan comptable ; les magasins craignent une coupure caisse le jour J.',
    objectives: [
      'Piloter jalons migration & cutover',
      'ROAM risques clôture / magasin',
      'Arbitrer budget prestataire vs qualité',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Charte programme : finance, DSI et retail ne priorisent pas les mêmes modules.',
        problem: 'Scope ERP « tout » sur 6 mois : triangle magique déjà cassé.',
      },
      ingestion: {
        context: 'Extraction des écritures et référentiels fournisseurs.',
        problem: 'Volumes historiques sous-estimés : la fenêtre de cutover explose.',
      },
      transformation: {
        context: 'Mapping plan comptable Mutualis → nouveau modèle.',
        problem: 'Centres de coût magasin mal mappés : bilans locaux faux.',
      },
      gouvernance: {
        context: 'Contrôles SOX / audit interne sur la piste d’audit.',
        problem: 'Sans Owner comptable nommé, l’audit bloque le go-live.',
      },
      exposition: {
        context: 'Reporting clôture et interfaces trésorerie.',
        problem: 'Le board finance compare encore l’ancien extrait Excel au nouvel ERP.',
      },
      ops: {
        context: 'Hypercare cutover + run infra.',
        problem: 'Incident DNS magasin : les terminaux ne joignent plus l’ERP.',
      },
    },
  },
  en: {
    codename: 'ERP Beacon Program',
    scope: 'Finance ERP · procurement systems · cloud infra',
    projectName: 'Mutualis — Finance ERP migration (SAP → cloud)',
    tagline:
      'Mutualis finance ERP must migrate without stopping month-end close or stores.',
    stakes: 'Day+3 close is non-negotiable; any slip is an exec crisis.',
    context:
      'Mutualis is moving finance ERP to the cloud. You are the PM: schedule, risks, vendors, steering, and store network dependencies.',
    problem:
      'Legacy on-prem SAP and the new ERP diverge on the chart of accounts; stores fear POS downtime on go-live.',
    objectives: [
      'Drive migration & cutover milestones',
      'ROAM close / store risks',
      'Trade off vendor budget vs quality',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Program charter: finance, IT and retail disagree on module priority.',
        problem: '“Boil the ocean” ERP scope in 6 months — iron triangle already broken.',
      },
      ingestion: {
        context: 'Extracting journals and supplier masters.',
        problem: 'Historical volumes underestimated: cutover window blows up.',
      },
      transformation: {
        context: 'Mapping Mutualis chart of accounts → new model.',
        problem: 'Store cost centers poorly mapped: local P&Ls wrong.',
      },
      gouvernance: {
        context: 'SOX / internal audit on the audit trail.',
        problem: 'No named finance Owner: audit blocks go-live.',
      },
      exposition: {
        context: 'Close reporting and treasury interfaces.',
        problem: 'Finance board still compares old Excel extracts to the new ERP.',
      },
      ops: {
        context: 'Cutover hypercare + infra run.',
        problem: 'Store DNS incident: terminals cannot reach the ERP.',
      },
    },
  },
}

const IT_PO: StoryPair = {
  fr: {
    codename: 'Produit Passage Caisse+',
    scope: 'SI caisse · omnicanal · API catalogue',
    projectName: 'Mutualis — produit Caisse+ (omnicanal magasin)',
    tagline:
      'Le produit Caisse+ doit unifier click & collect, fidélité et paiement sans allonger les files.',
    stakes: 'NPS magasin et temps de file : KPI board retail.',
    context:
      'Tu es PO du produit Caisse+ : backlog magasin, priorisation valeur, alignement DSI et direction retail Mutualis.',
    problem:
      'Click & collect et fidélité sont deux silos : le vendeur bascule entre 3 écrans pendant que la file s’allonge.',
    objectives: [
      'Prioriser MVP Caisse+ vs nice-to-have',
      'Tenir le Sprint Goal magasin pilote',
      'Arbitrer scope vs date Black Friday',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Vision produit : retail veut tout, DSI veut stabiliser le SI caisse.',
        problem: 'Backlog de 200 US sans Product Goal clair.',
      },
      ingestion: {
        context: 'Événements ticket caisse à absorber.',
        problem: 'Latence API catalogue : le scan article timeout en pointe.',
      },
      transformation: {
        context: 'Règles promo / fidélité unifiées.',
        problem: 'Deux moteurs promo (web vs magasin) : le ticket diverge.',
      },
      gouvernance: {
        context: 'Paiement & données carte — contraintes PCI.',
        problem: 'Une US « stocker le PAN pour aller plus vite » est hors-compliance.',
      },
      exposition: {
        context: 'UI vendeur et indicateurs file d’attente.',
        problem: 'Demo COMEX : la démo utilise un catalogue de test hors prod.',
      },
      ops: {
        context: 'Pilot 12 magasins puis rollout.',
        problem: 'Feature flag mal coupé : 3 magasins restent sur l’ancienne caisse.',
      },
    },
  },
  en: {
    codename: 'Product Checkout+',
    scope: 'POS systems · omnichannel · catalog API',
    projectName: 'Mutualis — Checkout+ product (store omnichannel)',
    tagline:
      'Checkout+ must unify click & collect, loyalty and payment without longer queues.',
    stakes: 'Store NPS and queue time are the retail board KPIs.',
    context:
      'You are PO for Checkout+: store backlog, value prioritization, alignment with IT and Mutualis retail leadership.',
    problem:
      'Click & collect and loyalty are silos: sellers juggle 3 screens while the queue grows.',
    objectives: [
      'Prioritize Checkout+ MVP vs nice-to-haves',
      'Protect the pilot-store Sprint Goal',
      'Trade off scope vs Black Friday date',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Product vision: retail wants everything; IT wants to stabilize POS.',
        problem: '200-user-story backlog with no clear Product Goal.',
      },
      ingestion: {
        context: 'POS ticket events to absorb.',
        problem: 'Catalog API latency: item scan times out at peak.',
      },
      transformation: {
        context: 'Unified promo / loyalty rules.',
        problem: 'Two promo engines (web vs store): the receipt diverges.',
      },
      gouvernance: {
        context: 'Payments & card data — PCI constraints.',
        problem: 'A “store the PAN to go faster” story is non-compliant.',
      },
      exposition: {
        context: 'Seller UI and queue indicators.',
        problem: 'Board demo uses a non-prod catalog.',
      },
      ops: {
        context: '12-store pilot then rollout.',
        problem: 'Bad feature flag: 3 stores stuck on legacy checkout.',
      },
    },
  },
}

const IT_SM: StoryPair = {
  fr: {
    codename: 'ART Intégrations SI',
    scope: 'Intégrations SI · middleware · équipes multi-fournisseurs',
    projectName: 'Mutualis — train agile Intégrations SI',
    tagline:
      'Trois squads (CRM, ERP, caisse) livrent dans le désordre : les dépendances tuent le flux.',
    stakes: 'Vélocité globale du programme SI et moral des équipes.',
    context:
      'Tu es Scrum Master du train d’intégrations Mutualis : facilitation, impediments, cadence, relations prestataires onshore/offshore.',
    problem:
      'Chaque squad livre « son » API ; personne n’own l’interface bout-en-bout. Les PI Planning explosent.',
    objectives: [
      'Fluidifier dépendances inter-équipes',
      'Protéger capacité & rythme soutenable',
      'Faciliter Inspect & Adapt programme',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Kickoff ART : RTE et PO ne s’alignent pas sur les objectifs de PI.',
        problem: 'Trop d’engagements politiques, trop peu de capacité réelle.',
      },
      ingestion: {
        context: 'Contrats d’interface et environnements d’intégration.',
        problem: 'Env d’intégration partagé saturé : files d’attente de tests.',
      },
      transformation: {
        context: 'Chaîne CI des bus d’événements.',
        problem: 'Un breaking change CRM non annoncé casse le flux ERP.',
      },
      gouvernance: {
        context: 'RACI freelances vs équipes internes.',
        problem: 'Impediment « personne ne décide » depuis 3 sprints.',
      },
      exposition: {
        context: 'System demo bout-en-bout.',
        problem: 'Chaque squad démo son silo : le COMEX ne voit pas la valeur bout-en-bout.',
      },
      ops: {
        context: 'Astreinte intégrations week-end promo.',
        problem: 'Burn-out d’un lead middleware : capacity coupée net.',
      },
    },
  },
  en: {
    codename: 'ART System Integrations',
    scope: 'System integrations · middleware · multi-vendor teams',
    projectName: 'Mutualis — agile train for system integrations',
    tagline:
      'Three squads (CRM, ERP, POS) ship out of sync: dependencies kill flow.',
    stakes: 'Overall systems program velocity and team health.',
    context:
      'You are Scrum Master for the Mutualis integrations train: facilitation, impediments, cadence, onshore/offshore vendors.',
    problem:
      'Each squad ships “its” API; nobody owns the end-to-end interface. PI Planning blows up.',
    objectives: [
      'Unblock cross-team dependencies',
      'Protect capacity & sustainable pace',
      'Facilitate program Inspect & Adapt',
    ],
    phaseBeats: {
      cadrage: {
        context: 'ART kickoff: RTE and POs misaligned on PI objectives.',
        problem: 'Too many political commitments, too little real capacity.',
      },
      ingestion: {
        context: 'Interface contracts and integration environments.',
        problem: 'Shared integration env saturated: test queues.',
      },
      transformation: {
        context: 'CI for the event bus.',
        problem: 'Unannounced CRM breaking change breaks ERP flow.',
      },
      gouvernance: {
        context: 'RACI freelancers vs internal teams.',
        problem: '“Nobody decides” impediment for 3 sprints.',
      },
      exposition: {
        context: 'End-to-end system demo.',
        problem: 'Each squad demos its silo: the board never sees E2E value.',
      },
      ops: {
        context: 'Integration on-call during promo weekend.',
        problem: 'Middleware lead burnout: capacity drops overnight.',
      },
    },
  },
}

const IT_TF: StoryPair = {
  fr: {
    codename: 'Pont Archi CRM↔ERP',
    scope: 'Architecture SI · API · patterns d’intégration',
    projectName: 'Mutualis — architecture d’intégration CRM ↔ ERP',
    tagline:
      'Sans contrat d’interface solide, chaque évolution CRM casse la compta magasin.',
    stakes: 'Stabilité SI et coût des incidents d’intégration.',
    context:
      'Tu es technico-fonctionnel : tu conçois le pont API/événements entre CRM et ERP Mutualis, specs détaillées et faisabilité technique.',
    problem:
      'Point-à-point historique : 40 jobs batch fragiles. Une évolution adresse client régresse la facturation.',
    objectives: [
      'Spécifier contrats API / événements',
      'Valider faisabilité & non-régression',
      'Documenter patterns d’intégration',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Cadrage archi : event-driven vs ETL batch.',
        problem: 'Le métier veut « temps réel » ; l’infra ne tient que du near-real-time.',
      },
      ingestion: {
        context: 'Topics événements client et commandes.',
        problem: 'Ordre des événements non garanti : factures en double.',
      },
      transformation: {
        context: 'Mapping canonique Client / Commande.',
        problem: 'Champs CRM libres non typés cassent le schéma ERP.',
      },
      gouvernance: {
        context: 'Versioning & dépréciation d’API.',
        problem: 'Personne n’ose casser la v1 : dette d’interfaces.',
      },
      exposition: {
        context: 'Console de suivi des intégrations pour le run.',
        problem: 'Ops ne voit pas quel message est bloqué où.',
      },
      ops: {
        context: 'Runbooks et retries idempotents.',
        problem: 'Retry non idempotent : double écriture comptable.',
      },
    },
  },
  en: {
    codename: 'CRM↔ERP Arch Bridge',
    scope: 'System architecture · APIs · integration patterns',
    projectName: 'Mutualis — CRM ↔ ERP integration architecture',
    tagline:
      'Without solid interface contracts, every CRM change breaks store accounting.',
    stakes: 'System stability and integration incident cost.',
    context:
      'You are techno-functional: design the API/event bridge between Mutualis CRM and ERP, detailed specs and feasibility.',
    problem:
      'Legacy point-to-point: 40 fragile batch jobs. A customer-address change regresses invoicing.',
    objectives: [
      'Specify API / event contracts',
      'Validate feasibility & non-regression',
      'Document integration patterns',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Architecture framing: event-driven vs batch ETL.',
        problem: 'Business wants “real time”; infra can only sustain near-real-time.',
      },
      ingestion: {
        context: 'Customer and order event topics.',
        problem: 'Unordered events: duplicate invoices.',
      },
      transformation: {
        context: 'Canonical Customer / Order mapping.',
        problem: 'Untyped free-text CRM fields break ERP schema.',
      },
      gouvernance: {
        context: 'API versioning & deprecation.',
        problem: 'Nobody dares break v1: interface debt.',
      },
      exposition: {
        context: 'Integration monitoring console for ops.',
        problem: 'Ops cannot see which message is stuck where.',
      },
      ops: {
        context: 'Runbooks and idempotent retries.',
        problem: 'Non-idempotent retry: double accounting posts.',
      },
    },
  },
}

/** ——— Data / IA : analytics, BI, ML, automatisation, DL ——— */

const DA_BA: StoryPair = {
  fr: {
    codename: 'Radar Performance Magasin',
    scope: 'Analytics retail · besoins KPI · recette data',
    projectName: 'Mutualis — analytics Performance Magasin',
    tagline:
      'Les directeurs régionaux n’ont plus confiance dans les KPI trafic / panier moyen.',
    stakes: 'Pilotage réseau et bonus magasins basés sur des chiffres contestés.',
    context:
      'Tu es BA data : tu cadres les besoins analytics Mutualis (trafic, conversion, panier) pour le COMEX retail.',
    problem:
      'Chaque région calcule « panier moyen » différemment ; les bonus magasin déclenchent des conflits RH.',
    objectives: [
      'Définir KPI & AC analytics',
      'Aligner métier sur le grain (ticket vs jour)',
      'Recetter les tableaux de bord région',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Ateliers KPI avec régions Nord / Sud.',
        problem: 'Deux définitions de « trafic » (entrées magasin vs tickets).',
      },
      ingestion: {
        context: 'Sources caisse + comptage de flux.',
        problem: 'Capteurs de trafic absents sur 20 % du réseau.',
      },
      transformation: {
        context: 'Règles de calcul panier moyen.',
        problem: 'Tickets annulés encore inclus dans le KPI.',
      },
      gouvernance: {
        context: 'Owner KPI et glossaire.',
        problem: 'Personne n’est Accountable du chiffre bonus.',
      },
      exposition: {
        context: 'Dashboards régionaux.',
        problem: 'Un directeur compare encore son Excel pirate au dashboard officiel.',
      },
      ops: {
        context: 'Fraîcheur quotidienne avant le brief région.',
        problem: 'Pipeline en retard : brief lancé sur J-2.',
      },
    },
  },
  en: {
    codename: 'Store Performance Radar',
    scope: 'Retail analytics · KPI requirements · data UAT',
    projectName: 'Mutualis — Store Performance analytics',
    tagline:
      'Regional directors no longer trust traffic / average basket KPIs.',
    stakes: 'Network steering and store bonuses based on disputed numbers.',
    context:
      'You are the data BA: frame Mutualis analytics needs (traffic, conversion, basket) for the retail board.',
    problem:
      'Each region computes “average basket” differently; store bonuses trigger HR conflicts.',
    objectives: [
      'Define analytics KPIs & AC',
      'Align business on grain (ticket vs day)',
      'UAT regional dashboards',
    ],
    phaseBeats: {
      cadrage: {
        context: 'KPI workshops with North / South regions.',
        problem: 'Two definitions of “traffic” (store entries vs tickets).',
      },
      ingestion: {
        context: 'POS + footfall sources.',
        problem: 'Footfall sensors missing on 20% of the network.',
      },
      transformation: {
        context: 'Average-basket calculation rules.',
        problem: 'Cancelled tickets still included in the KPI.',
      },
      gouvernance: {
        context: 'KPI Owner and glossary.',
        problem: 'Nobody is Accountable for the bonus number.',
      },
      exposition: {
        context: 'Regional dashboards.',
        problem: 'A director still compares a shadow Excel to the official dashboard.',
      },
      ops: {
        context: 'Daily freshness before the regional briefing.',
        problem: 'Late pipeline: briefing runs on D-2 data.',
      },
    },
  },
}

const DA_PM: StoryPair = {
  fr: {
    codename: 'Plateforme Lac Data',
    scope: 'Data platform · lakehouse · industrialisation pipelines',
    projectName: 'Mutualis — programme Data Platform lakehouse',
    tagline:
      'Mutualis industrialise enfin sa plateforme data : plus de notebooks héros, un lac gouverné.',
    stakes: 'Time-to-insight COMEX et coût cloud sous contrôle.',
    context:
      'Tu es chef de projet Data Platform : lots ingestion, transformation, serving, prestataires cloud et jalons COMEX.',
    problem:
      '40 pipelines shadow tournent sur des VMs oubliées ; personne ne sait quel chiffre alimente le board.',
    objectives: [
      'Piloter roadmap plateforme par vagues',
      'Maîtriser risques coût cloud / SLA',
      'Synchroniser métiers consommateurs',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Business case plateforme vs status quo Excel.',
        problem: 'Sponsors veulent « tout migrer » en un PI.',
      },
      ingestion: {
        context: 'Landing zones GCS / lots caisse.',
        problem: 'Histoires de volumes Black Friday sous-dimensionnées.',
      },
      transformation: {
        context: 'Standardisation dbt / Spark.',
        problem: 'Deux équipes livrent le même mart sous deux noms.',
      },
      gouvernance: {
        context: 'Zoning, classification, Owners.',
        problem: 'Données RH atterrissent dans une zone ouverte.',
      },
      exposition: {
        context: 'Serving BI + API data products.',
        problem: 'Self-service sans contrat : 15 copies du mart finance.',
      },
      ops: {
        context: 'FinOps + observability pipelines.',
        problem: 'Spike de coût BigQuery sans owner.',
      },
    },
  },
  en: {
    codename: 'Data Lake Platform',
    scope: 'Data platform · lakehouse · pipeline industrialization',
    projectName: 'Mutualis — Data Platform lakehouse program',
    tagline:
      'Mutualis finally industrializes its data platform: no more hero notebooks — a governed lake.',
    stakes: 'Exec time-to-insight and controlled cloud cost.',
    context:
      'You are PM for the Data Platform: ingestion, transform, serving waves, cloud vendors and board milestones.',
    problem:
      '40 shadow pipelines run on forgotten VMs; nobody knows which number feeds the board.',
    objectives: [
      'Drive platform roadmap by waves',
      'Control cloud cost / SLA risks',
      'Sync consuming business domains',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Platform business case vs Excel status quo.',
        problem: 'Sponsors want to “migrate everything” in one PI.',
      },
      ingestion: {
        context: 'GCS landing zones / POS batches.',
        problem: 'Black Friday volumes undersized.',
      },
      transformation: {
        context: 'dbt / Spark standardization.',
        problem: 'Two teams ship the same mart under two names.',
      },
      gouvernance: {
        context: 'Zoning, classification, Owners.',
        problem: 'HR data lands in an open zone.',
      },
      exposition: {
        context: 'BI serving + data-product APIs.',
        problem: 'Self-service without contracts: 15 copies of finance mart.',
      },
      ops: {
        context: 'FinOps + pipeline observability.',
        problem: 'Unowned BigQuery cost spike.',
      },
    },
  },
}

const DA_PO: StoryPair = {
  fr: {
    codename: 'Produit Insight Retail',
    scope: 'Produit BI · self-service · data products',
    projectName: 'Mutualis — produit Insight Retail (self-service BI)',
    tagline:
      'Insight Retail doit devenir le produit data de référence — pas un énième rapport Power BI orphelin.',
    stakes: 'Adoption self-service et réduction des rapports shadow.',
    context:
      'Tu es PO data product : vision Insight Retail, backlog marts/certifiés, priorisation valeur pour marketing et retail.',
    problem:
      '120 rapports Power BI non certifiés circulent ; le COMEX ne sait plus lequel est officiel.',
    objectives: [
      'Prioriser data products à certifier',
      'Définir DoD « rapport certifié »',
      'Mesurer adoption vs shadow BI',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Vision produit Insight vs catalogue sauvage.',
        problem: 'Marketing veut 30 dashboards ; capacité = 4.',
      },
      ingestion: {
        context: 'Sources pour le data product « campagne ».',
        problem: 'CRM marketing non branché au lac.',
      },
      transformation: {
        context: 'Mart campagnes certifié.',
        problem: 'Grain campagne vs ticket mal défini.',
      },
      gouvernance: {
        context: 'Label « certifié Mutualis » + Owner.',
        problem: 'Sans Owner, aucun rapport ne peut être certifié.',
      },
      exposition: {
        context: 'Galerie Power BI / Looker gouvernée.',
        problem: 'Les users republient des copies non labellisées.',
      },
      ops: {
        context: 'Cycle de vie des rapports (archive / deprecate).',
        problem: 'Rapports morts consomment encore des licences.',
      },
    },
  },
  en: {
    codename: 'Insight Retail Product',
    scope: 'BI product · self-service · data products',
    projectName: 'Mutualis — Insight Retail product (self-service BI)',
    tagline:
      'Insight Retail must become the reference data product — not another orphan Power BI report.',
    stakes: 'Self-service adoption and fewer shadow reports.',
    context:
      'You are PO for the data product: Insight Retail vision, certified-mart backlog, value prioritization for marketing and retail.',
    problem:
      '120 uncertified Power BI reports circulate; the board no longer knows which is official.',
    objectives: [
      'Prioritize data products to certify',
      'Define “certified report” DoD',
      'Measure adoption vs shadow BI',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Insight product vision vs wild catalog.',
        problem: 'Marketing wants 30 dashboards; capacity is 4.',
      },
      ingestion: {
        context: 'Sources for the “campaign” data product.',
        problem: 'Marketing CRM not connected to the lake.',
      },
      transformation: {
        context: 'Certified campaigns mart.',
        problem: 'Campaign vs ticket grain undefined.',
      },
      gouvernance: {
        context: '“Mutualis certified” label + Owner.',
        problem: 'Without Owner, nothing can be certified.',
      },
      exposition: {
        context: 'Governed Power BI / Looker gallery.',
        problem: 'Users republish unlabeled copies.',
      },
      ops: {
        context: 'Report lifecycle (archive / deprecate).',
        problem: 'Dead reports still burn licenses.',
      },
    },
  },
}

const DA_SM: StoryPair = {
  fr: {
    codename: 'Squad Data Delivery',
    scope: 'Delivery data agile · MLOps léger · flux analytique',
    projectName: 'Mutualis — squad Data Delivery & ML feature store',
    tagline:
      'La squad data livre des modèles et des marts, mais les freins (données, accès, revue) cassent la cadence.',
    stakes: 'Prévisibilité des Increments data/ML.',
    context:
      'Tu es Scrum Master de la squad Data Delivery Mutualis : analytics, feature store, expérimentation ML promo.',
    problem:
      'Les data scientists attendent des extractions « à la mano » ; le Sprint Goal ML glisse chaque fois.',
    objectives: [
      'Retirer impediments data / accès',
      'Instaurer DoR datasets & modèles',
      'Protéger rythme soutenable ML + data eng',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Objectifs de PI : marts vs expériences ML.',
        problem: 'Double engagement : COMEX veut les deux « pour hier ».',
      },
      ingestion: {
        context: 'Accès sandbox aux tickets caisse.',
        problem: 'Ticket DSI sécurité bloqué depuis 4 sprints.',
      },
      transformation: {
        context: 'Feature store promo.',
        problem: 'Features non versionnées : modèles non reproductibles.',
      },
      gouvernance: {
        context: 'Revue éthique des scores promo.',
        problem: 'Personne n’anime le comité risque IA.',
      },
      exposition: {
        context: 'Demo Increment : lift promo.',
        problem: 'Demo sur un échantillon biaisé : le métier hurle.',
      },
      ops: {
        context: 'Monitoring drift & retrain.',
        problem: 'Modèle en prod sans alerte de drift.',
      },
    },
  },
  en: {
    codename: 'Data Delivery Squad',
    scope: 'Agile data delivery · light MLOps · analytics flow',
    projectName: 'Mutualis — Data Delivery squad & ML feature store',
    tagline:
      'The data squad ships models and marts, but blockers (data, access, review) break cadence.',
    stakes: 'Predictability of data/ML Increments.',
    context:
      'You are Scrum Master for Mutualis Data Delivery: analytics, feature store, promo ML experiments.',
    problem:
      'Data scientists wait on manual extracts; the ML Sprint Goal slips every time.',
    objectives: [
      'Remove data / access impediments',
      'Install dataset & model DoR',
      'Protect sustainable pace for ML + data eng',
    ],
    phaseBeats: {
      cadrage: {
        context: 'PI goals: marts vs ML experiments.',
        problem: 'Double commitment: board wants both “yesterday”.',
      },
      ingestion: {
        context: 'Sandbox access to POS tickets.',
        problem: 'Security ticket blocked for 4 sprints.',
      },
      transformation: {
        context: 'Promo feature store.',
        problem: 'Unversioned features: unreproducible models.',
      },
      gouvernance: {
        context: 'Ethics review of promo scores.',
        problem: 'Nobody runs the AI risk committee.',
      },
      exposition: {
        context: 'Increment demo: promo lift.',
        problem: 'Demo on a biased sample: business explodes.',
      },
      ops: {
        context: 'Drift monitoring & retrain.',
        problem: 'Prod model with no drift alert.',
      },
    },
  },
}

const DA_TF: StoryPair = {
  fr: {
    codename: 'Contrats Pipeline Or',
    scope: 'Ingénierie data · contrats de schémas · automatisation',
    projectName: 'Mutualis — contrats & automatisation pipelines Or',
    tagline:
      'Les pipelines « Or » Mutualis doivent être rejouables, testés et contractuels — plus de scripts jetables.',
    stakes: 'Fiabilité des données COMEX et coût du run.',
    context:
      'Tu es technico-fonctionnel data : tu spécifies contrats de schémas, tests dbt/SQL et automatisation Airflow entre landing et marts.',
    problem:
      'Un changement de colonnes caisse a cassé 6 jobs ; détection le matin du COMEX seulement.',
    objectives: [
      'Spécifier contrats landing → mart',
      'Automatiser tests & sensors',
      'Documenter runbooks data',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Cadrage contrats vs « on verra en prod ».',
        problem: 'Métier refuse de figer le schéma « pour rester agile ».',
      },
      ingestion: {
        context: 'FileSensors & partitions datées.',
        problem: 'Fichiers arrivés hors SLA sans alerte.',
      },
      transformation: {
        context: 'Tests dbt unicité / not_null.',
        problem: 'Tests désactivés « temporairement » depuis 3 mois.',
      },
      gouvernance: {
        context: 'Data contracts dans le catalogue.',
        problem: 'Contrat non lié à un Owner métier.',
      },
      exposition: {
        context: 'SLA de publication mart → BI.',
        problem: 'BI rafraîchit avant la fin du transform.',
      },
      ops: {
        context: 'Retries idempotents & quarantine.',
        problem: 'Rejeu manuel crée des doublons mart.',
      },
    },
  },
  en: {
    codename: 'Gold Pipeline Contracts',
    scope: 'Data engineering · schema contracts · automation',
    projectName: 'Mutualis — gold pipeline contracts & automation',
    tagline:
      'Mutualis “gold” pipelines must be replayable, tested and contractual — no more throwaway scripts.',
    stakes: 'Board data reliability and run cost.',
    context:
      'You are techno-functional data: specify schema contracts, dbt/SQL tests and Airflow automation from landing to marts.',
    problem:
      'A POS column change broke 6 jobs; detected only on board-meeting morning.',
    objectives: [
      'Specify landing → mart contracts',
      'Automate tests & sensors',
      'Document data runbooks',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Contracts framing vs “we’ll see in prod”.',
        problem: 'Business refuses to freeze schema “to stay agile”.',
      },
      ingestion: {
        context: 'FileSensors & dated partitions.',
        problem: 'Files miss SLA with no alert.',
      },
      transformation: {
        context: 'dbt uniqueness / not_null tests.',
        problem: 'Tests “temporarily” disabled for 3 months.',
      },
      gouvernance: {
        context: 'Data contracts in the catalog.',
        problem: 'Contract not linked to a business Owner.',
      },
      exposition: {
        context: 'Mart → BI publish SLA.',
        problem: 'BI refreshes before transform finishes.',
      },
      ops: {
        context: 'Idempotent retries & quarantine.',
        problem: 'Manual replay creates mart duplicates.',
      },
    },
  },
}

const DA_DM: StoryPair = {
  fr: {
    codename: 'Patrimoine Domaines Data',
    scope: 'Data management · domaines · cycle de vie',
    projectName: 'Mutualis — management du patrimoine data retail',
    tagline:
      'Le patrimoine data Mutualis n’a ni carte ni priorités : tout le monde « possède » tout, donc personne.',
    stakes: 'Clarté des domaines et services data pour le métier.',
    context:
      'Tu es Data Manager : tu structures les domaines (client, produit, ticket, stock), services data et priorités qualité.',
    problem:
      'Le domaine Produit a 4 « sources de vérité » ; les ruptures de stock sont fausses en rayon.',
    objectives: [
      'Cartographier domaines & producteurs',
      'Prioriser chantiers qualité',
      'Aligner SLA services data',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Carte des domaines Mutualis Retail.',
        problem: 'Marketing et Supply revendiquent le même référentiel produit.',
      },
      ingestion: {
        context: 'Inventaire sources produit / stock.',
        problem: 'Une base magasin hors inventaire alimente encore le COMEX.',
      },
      transformation: {
        context: 'Règles de consolidation stock.',
        problem: 'Unités (pièce vs pack) non harmonisées.',
      },
      gouvernance: {
        context: 'Désignation Owners par domaine.',
        problem: 'Candidats Owners refusent la charge sans mandat.',
      },
      exposition: {
        context: 'Catalogue des data products par domaine.',
        problem: 'Consumers ne trouvent pas le bon produit data.',
      },
      ops: {
        context: 'Suivi SLA fraîcheur stock.',
        problem: 'SLA brisé 3 matins de suite avant ouverture magasin.',
      },
    },
  },
  en: {
    codename: 'Data Domain Estate',
    scope: 'Data management · domains · lifecycle',
    projectName: 'Mutualis — retail data estate management',
    tagline:
      'Mutualis data estate has neither map nor priorities: everyone “owns” everything — so nobody does.',
    stakes: 'Clear domains and data services for the business.',
    context:
      'You are Data Manager: structure domains (customer, product, ticket, stock), data services and quality priorities.',
    problem:
      'Product domain has 4 “sources of truth”; shelf stockouts are wrong.',
    objectives: [
      'Map domains & producers',
      'Prioritize quality workstreams',
      'Align data-service SLAs',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Mutualis Retail domain map.',
        problem: 'Marketing and Supply claim the same product master.',
      },
      ingestion: {
        context: 'Inventory of product / stock sources.',
        problem: 'An off-inventory store DB still feeds the board.',
      },
      transformation: {
        context: 'Stock consolidation rules.',
        problem: 'Units (each vs pack) not harmonized.',
      },
      gouvernance: {
        context: 'Name Owners per domain.',
        problem: 'Owner candidates refuse without a mandate.',
      },
      exposition: {
        context: 'Catalog of data products by domain.',
        problem: 'Consumers cannot find the right data product.',
      },
      ops: {
        context: 'Stock freshness SLA tracking.',
        problem: 'SLA broken 3 mornings in a row before store open.',
      },
    },
  },
}

const DA_DS: StoryPair = {
  fr: {
    codename: 'Or Produit Magasin',
    scope: 'Stewardship · qualité MDM produit · remédiation',
    projectName: 'Mutualis — stewardship référentiel Produit',
    tagline:
      'Le référentiel produit Mutualis est sale : EAN doublons, libellés fantaisistes, rayons incohérents.',
    stakes: 'Fiabilité assortiment, promo et rupture rayon.',
    context:
      'Tu es Data Steward du domaine Produit : définitions, contrôles DQ, remédiation avec les métiers assortiment.',
    problem:
      '15 % des EAN sont en doublon ; les promos s’appliquent au mauvais article en caisse.',
    objectives: [
      'Tenir glossaire & règles produit',
      'Piloter contrôles DQ EAN / rayon',
      'Animer la remédiation assortiment',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Définition « article actif » Mutualis.',
        problem: 'Assortiment et e-commerce ne partagent pas la même notion d’actif.',
      },
      ingestion: {
        context: 'Flux fournisseurs → MDM.',
        problem: 'Fichiers fournisseur sans EAN normalisé.',
      },
      transformation: {
        context: 'Survivorship doublons EAN.',
        problem: 'Règle de survie contestée par deux directions.',
      },
      gouvernance: {
        context: 'Politique de création d’article.',
        problem: 'Des articles « temporaires » jamais fermés.',
      },
      exposition: {
        context: 'Publication référentiel vers caisse / web.',
        problem: 'Caisse pilote encore un export Excel hebdo.',
      },
      ops: {
        context: 'File de remédiation quotidienne.',
        problem: 'Backlog DQ > 2 000 tickets sans priorisation.',
      },
    },
  },
  en: {
    codename: 'Gold Store Product',
    scope: 'Stewardship · product MDM quality · remediation',
    projectName: 'Mutualis — Product master stewardship',
    tagline:
      'Mutualis product master is dirty: duplicate EANs, fantasy labels, inconsistent aisles.',
    stakes: 'Assortment, promo and shelf-stock reliability.',
    context:
      'You are Data Steward for Product: definitions, DQ controls, remediation with assortment teams.',
    problem:
      '15% of EANs are duplicates; promos hit the wrong item at checkout.',
    objectives: [
      'Own product glossary & rules',
      'Run EAN / aisle DQ controls',
      'Drive assortment remediation',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Definition of Mutualis “active article”.',
        problem: 'Assortment and e-commerce disagree on “active”.',
      },
      ingestion: {
        context: 'Supplier feeds → MDM.',
        problem: 'Supplier files without normalized EAN.',
      },
      transformation: {
        context: 'EAN duplicate survivorship.',
        problem: 'Survival rule contested by two departments.',
      },
      gouvernance: {
        context: 'Article-creation policy.',
        problem: '“Temporary” articles never closed.',
      },
      exposition: {
        context: 'Publish master to POS / web.',
        problem: 'Pilot POS still uses a weekly Excel export.',
      },
      ops: {
        context: 'Daily remediation queue.',
        problem: 'DQ backlog > 2,000 tickets with no prioritization.',
      },
    },
  },
}

const DA_DGM: StoryPair = {
  fr: {
    codename: 'Conseil Data Mutualis',
    scope: 'Gouvernance data · politiques · catalogue · RACI',
    projectName: 'Mutualis — operating model gouvernance data',
    tagline:
      'Mutualis se dote enfin d’un comité data, de politiques et d’un catalogue vivant (DataGalaxy).',
    stakes: 'Confiance dans la donnée et décisions COMEX traçables.',
    context:
      'Tu es Data Governance Manager : tu poses politiques, RACI Owner/Steward, comité data et outillage catalogue.',
    problem:
      'Les décisions data se prennent dans des mails ; aucun Owner n’est nommé sur les KPI board.',
    objectives: [
      'Installer comité & politiques',
      'Nommer Owners / Stewards',
      'Faire vivre le catalogue DataGalaxy',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Charte de gouvernance data Mutualis.',
        problem: 'Direction régionale refuse tout « process » supplémentaire.',
      },
      ingestion: {
        context: 'Politique de zones & classification.',
        problem: 'Données clients en zone ouverte « pour aller vite ».',
      },
      transformation: {
        context: 'Standards de qualité transverses.',
        problem: 'Chaque domaine invente ses propres règles DQ.',
      },
      gouvernance: {
        context: 'Premier comité data décisionnel.',
        problem: 'Ordre du jour politique, zéro décision Owner.',
      },
      exposition: {
        context: 'Publication glossaire & KPI board.',
        problem: 'Catalogue cosmétique : termes sans lien technique.',
      },
      ops: {
        context: 'Suivi conformité & exceptions.',
        problem: 'Exceptions « temporaires » jamais revues.',
      },
    },
  },
  en: {
    codename: 'Mutualis Data Council',
    scope: 'Data governance · policies · catalog · RACI',
    projectName: 'Mutualis — data governance operating model',
    tagline:
      'Mutualis finally gets a data council, policies and a living catalog (DataGalaxy).',
    stakes: 'Trust in data and traceable board decisions.',
    context:
      'You are Data Governance Manager: set policies, Owner/Steward RACI, data council and catalog tooling.',
    problem:
      'Data decisions happen in email threads; no Owner is named on board KPIs.',
    objectives: [
      'Stand up council & policies',
      'Appoint Owners / Stewards',
      'Make DataGalaxy catalog real',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Mutualis data-governance charter.',
        problem: 'Regional leadership rejects any extra “process”.',
      },
      ingestion: {
        context: 'Zone & classification policy.',
        problem: 'Customer data in an open zone “to go fast”.',
      },
      transformation: {
        context: 'Cross-domain quality standards.',
        problem: 'Each domain invents its own DQ rules.',
      },
      gouvernance: {
        context: 'First decision-making data council.',
        problem: 'Political agenda, zero Owner decisions.',
      },
      exposition: {
        context: 'Publish glossary & board KPIs.',
        problem: 'Cosmetic catalog: terms with no technical link.',
      },
      ops: {
        context: 'Compliance & exception tracking.',
        problem: '“Temporary” exceptions never reviewed.',
      },
    },
  },
}

const DA_AIG: StoryPair = {
  fr: {
    codename: 'Sentinelle IA Promo',
    scope: 'Gouvernance IA · ML / deep learning · conformité usage',
    projectName: 'Mutualis — gouvernance IA moteur promo & assistant rayon',
    tagline:
      'Mutualis déploie un moteur de promo ML et un assistant rayon génératif — sous garde-fous.',
    stakes: 'Risque réputationnel, biais client, conformité AI Act.',
    context:
      'Tu es AI Governance Manager : tu cadres risques, traçabilité des modèles, données d’entraînement et usages acceptables.',
    problem:
      'Un modèle de promo a sur-ciblé des clients vulnérables ; l’assistant rayon invente des stocks.',
    objectives: [
      'Classer risques cas d’usage IA',
      'Exiger traçabilité & datasets',
      'Valider politique d’usage magasin',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Registre des cas d’usage IA Mutualis.',
        problem: 'Marketing a déjà mis un LLM en prod sans revue.',
      },
      ingestion: {
        context: 'Données d’entraînement tickets / clients.',
        problem: 'Dataset avec PII non minimisée.',
      },
      transformation: {
        context: 'Feature store & reproductibilité.',
        problem: 'Impossible de rejouer le modèle champion.',
      },
      gouvernance: {
        context: 'Comité risque IA & human oversight.',
        problem: 'Scores promo poussés en caisse sans override humain.',
      },
      exposition: {
        context: 'Assistant rayon (GenAI) pour vendeurs.',
        problem: 'Hallucinations stock : rupture affichée à tort.',
      },
      ops: {
        context: 'Monitoring drift, biais, incidents.',
        problem: 'Aucun canal d’escalade quand un client se plaint du ciblage.',
      },
    },
  },
  en: {
    codename: 'Promo AI Sentinel',
    scope: 'AI governance · ML / deep learning · usage compliance',
    projectName: 'Mutualis — AI governance for promo engine & aisle assistant',
    tagline:
      'Mutualis ships an ML promo engine and a generative aisle assistant — under guardrails.',
    stakes: 'Reputation risk, customer bias, AI Act compliance.',
    context:
      'You are AI Governance Manager: frame risks, model traceability, training data and acceptable use.',
    problem:
      'A promo model over-targeted vulnerable customers; the aisle assistant invents stock levels.',
    objectives: [
      'Classify AI use-case risks',
      'Require traceability & datasets',
      'Approve store usage policy',
    ],
    phaseBeats: {
      cadrage: {
        context: 'Mutualis AI use-case register.',
        problem: 'Marketing already shipped an LLM without review.',
      },
      ingestion: {
        context: 'Training data from tickets / customers.',
        problem: 'Dataset with non-minimized PII.',
      },
      transformation: {
        context: 'Feature store & reproducibility.',
        problem: 'Cannot replay the champion model.',
      },
      gouvernance: {
        context: 'AI risk committee & human oversight.',
        problem: 'Promo scores pushed to POS with no human override.',
      },
      exposition: {
        context: 'Aisle assistant (GenAI) for sellers.',
        problem: 'Stock hallucinations: false stockouts displayed.',
      },
      ops: {
        context: 'Monitor drift, bias, incidents.',
        problem: 'No escalation channel when a customer complains about targeting.',
      },
    },
  },
}

const STORIES: Record<string, StoryPair> = {
  [storyKey('it', 'business-analyst')]: IT_BA,
  [storyKey('it', 'chef-de-projet')]: IT_PM,
  [storyKey('it', 'product-owner')]: IT_PO,
  [storyKey('it', 'scrum-master')]: IT_SM,
  [storyKey('it', 'technico-fonctionnel')]: IT_TF,
  [storyKey('data-ai', 'business-analyst')]: DA_BA,
  [storyKey('data-ai', 'chef-de-projet')]: DA_PM,
  [storyKey('data-ai', 'product-owner')]: DA_PO,
  [storyKey('data-ai', 'scrum-master')]: DA_SM,
  [storyKey('data-ai', 'technico-fonctionnel')]: DA_TF,
  [storyKey('data-ai', 'data-manager')]: DA_DM,
  [storyKey('data-ai', 'data-steward')]: DA_DS,
  [storyKey('data-ai', 'data-governance-manager')]: DA_DGM,
  [storyKey('data-ai', 'ai-governance-manager')]: DA_AIG,
}

export function roleStory(
  kind: ProjectKind,
  role: PlayerRoleId,
  locale: PmGameLocale = 'fr',
): RoleStory | null {
  if (!roleFitsProject(kind, role)) return null
  const pair = STORIES[storyKey(kind, role)]
  if (!pair) return null
  return locale === 'en' ? pair.en : pair.fr
}

/** Brief narratif pour un niveau (beat de phase si dispo). */
export function roleStoryForPhase(
  kind: ProjectKind,
  role: PlayerRoleId,
  phase: ProjectPhase,
  locale: PmGameLocale = 'fr',
): RoleStory | null {
  const base = roleStory(kind, role, locale)
  if (!base) return null
  const beat = base.phaseBeats[phase]
  if (!beat) return base
  return {
    ...base,
    context: `${base.context}\n\n${beat.context}`,
    problem: beat.problem,
  }
}

export function allStoryKeys(): string[] {
  return Object.keys(STORIES)
}
