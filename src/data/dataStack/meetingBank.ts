/**
 * Banque de réunions simulées — COPROJ, COPIL, Agile/Scrum, COMEX fire.
 * Chaque réunion propose 5 QCM interactifs. Les réunions COMEX fire
 * ont un impact sur le fireRisk (fireRiskDelta négatif = réduction du risque).
 */
import type { PmGameLocale } from '../../i18n/pmGameLocale'
import type { MeetingStep } from './pmGovTypes'
import {
  COMEX_MEETINGS_EN,
  COPIL_BANK_EN,
  COPROJ_BANK_EN,
  SCRUM_BANK_EN,
} from './meetingBank.en'

// ─── COPROJ — Comités de Projet avec l'équipe ────────────────────────────────

const COPROJ_1: MeetingStep = {
  kind: 'coproj',
  title: 'COPROJ #1 — Point d\'avancement Sprint 1',
  opening:
    'L\'équipe se réunit en salle Kilimandjaro. Rania (dev back), Hugo (data engineer) et Léa (QA) sont présents. Tu animes le COPROJ. Le Sprint est à mi-parcours.',
  questions: [
    {
      npcLine:
        'Rania : « On a un blocage sur l\'API de remontée des stocks — le endpoint renvoie du XML alors qu\'on attendait du JSON. Hugo et moi on bloque depuis hier. »',
      question: 'Comment tu gères ce blocage d\'équipe en COPROJ ?',
      options: [
        'Tu notes le blocage dans ton RAID log, tu identifies un owner pour la résolution et tu fixes un point de suivi à 24 h.',
        'Tu renvoies Rania et Hugo résoudre ça entre eux — ce n\'est pas le sujet du COPROJ.',
        'Tu escalades immédiatement au COMEX pour décision urgente.',
      ],
      correctIndex: 0,
      correction:
        'Un COPROJ efficace = actions concrètes avec owner et deadline. Le RAID log (Risques, Actions, Issues, Décisions) est l\'outil clé. Escalader au COMEX sans tentative de résolution interne est prématuré.',
    },
    {
      npcLine:
        'Hugo : « On a 3 User Stories fermées sur 8 prévues. Le vélocité réelle est 40 % en dessous de l\'estimation. »',
      question: 'Quelle est ta réaction face à cet écart de vélocité ?',
      options: [
        'Tu analyses les causes (sous-estimation, blocages, scope creep) et tu proposes d\'ajuster le Sprint backlog avec le PO.',
        'Tu demandes à l\'équipe de faire des heures supplémentaires pour rattraper.',
        'Tu signales un retard général sans chercher la cause ni proposer d\'ajustement.',
      ],
      correctIndex: 0,
      correction:
        'L\'écart de vélocité est normal — l\'important est l\'inspection honnête (Scrum Pilier Inspection) et l\'adaptation rapide. Les heures sup ne résolvent pas un problème de scope ou d\'estimation.',
    },
    {
      npcLine:
        'Léa : « Le pipeline de tests automatisés est cassé depuis la merge d\'avant-hier. Les 3 dernières User Stories ne sont pas testées. »',
      question: 'Comment traites-tu ce risque qualité ?',
      options: [
        'Tu bloque la livraison des US non testées et tu ouvres un ticket critique sur le pipeline — c\'est une Dette Technique prioritaire.',
        'Tu livres quand même les US — les tests peuvent attendre la prochaine sprint review.',
        'Tu demandes à Léa de tester manuellement toutes les US en urgence.',
      ],
      correctIndex: 0,
      correction:
        'La Définition of Done inclut les tests automatisés. Une US non testée n\'est pas "Done". Livrer du code non testé accumule de la dette et compromet la qualité produit.',
    },
    {
      npcLine:
        'Le client (représenté par le PO) vient d\'ajouter 2 nouvelles US en milieu de Sprint via un message Teams. Il veut les voir dans la prochaine Sprint Review.',
      question: 'Comment tu gères cet ajout de scope en cours de Sprint ?',
      options: [
        'Tu expliques que le Sprint backlog est figé — les nouvelles US entrent dans le Product Backlog et seront arbitrées en Sprint Planning.',
        'Tu acceptes les 2 US pour satisfaire le client, quitte à sacrifier d\'autres items.',
        'Tu ignores la demande et tu n\'en parles pas en COPROJ.',
      ],
      correctIndex: 0,
      correction:
        'En Scrum, le Sprint backlog est protégé. Le Scrum Master (ou PM) protège l\'équipe du scope creep en renvoyant les nouvelles demandes au Product Backlog pour priorisation lors du prochain Sprint Planning.',
    },
    {
      npcLine:
        'Le COPROJ se termine. Il reste 10 minutes. Tout le monde attend que tu conclues.',
      question: 'Comment tu clôtures un COPROJ de façon professionnelle ?',
      options: [
        'Tu récapitules les décisions prises, les actions identifiées (qui fait quoi, pour quand) et tu envoies le compte-rendu dans l\'heure.',
        'Tu dis « C\'est bon, on se voit à la prochaine réunion » et tu fermes la salle.',
        'Tu demandes à chacun d\'envoyer leur propre compte-rendu de ce qu\'ils ont à faire.',
      ],
      correctIndex: 0,
      correction:
        'Un COPROJ sans compte-rendu = une réunion sans mémoire. Les 3 livrables : décisions documentées, actions tracées avec owner + deadline, diffusion immédiate.',
    },
  ],
  closing:
    'COPROJ conclu. Les actions sont tracées. L\'équipe repart avec de la clarté sur les prochaines 24 h.',
}

const COPROJ_2: MeetingStep = {
  kind: 'coproj',
  title: 'COPROJ #2 — Démo intermédiaire & risques',
  opening:
    'Mi-projet. L\'équipe présente une démo intermédiaire des fonctionnalités livrées. Des risques techniques nouveaux sont remontés.',
  questions: [
    {
      npcLine:
        'Hugo : « La migration de la base legacy vers BigQuery prend 3 fois plus de temps que prévu à cause du volume de données non structurées. »',
      question: 'Comment tu traites ce risque de délai en COPROJ ?',
      options: [
        'Tu mets à jour le registre des risques, tu révises l\'estimation avec l\'équipe et tu proposes un plan de contingence au COPIL.',
        'Tu minimises l\'impact pour ne pas alarmer l\'équipe.',
        'Tu attends que le retard soit confirmé avant d\'agir.',
      ],
      correctIndex: 0,
      correction:
        'La gestion proactive des risques est clé en PM. Identifier tôt, quantifier l\'impact, proposer une mitigation — et communiquer vers le COPIL avant que le risque devienne un incident.',
    },
    {
      npcLine:
        'Rania : « On a découvert une faille de sécurité potentielle dans le module d\'authentification. Ce n\'est pas dans notre périmètre mais ça nous bloque. »',
      question: 'Comment gères-tu ce blocage hors périmètre ?',
      options: [
        'Tu identifies l\'équipe responsable, tu crées une dépendance documentée dans le plan projet et tu escalades si pas de réponse sous 48 h.',
        'Tu demandes à Rania de corriger elle-même la faille pour débloquer.',
        'Tu continues sans attendre — la sécurité est un sujet pour plus tard.',
      ],
      correctIndex: 0,
      correction:
        'Les dépendances inter-équipes doivent être documentées et trackées. Le PM est le gardien du chemin critique — escalader vite sur les dépendances bloquantes.',
    },
    {
      npcLine:
        'La démo intermédiaire montre que 2 fonctionnalités clés ne correspondent pas aux attentes du métier.',
      question: 'Quelle est la bonne réaction face à ce désalignement métier ?',
      options: [
        'Tu organises un atelier de recadrage avec le PO et les utilisateurs clés pour clarifier le besoin réel avant de continuer.',
        'Tu corriges rapidement selon ta propre interprétation pour avancer.',
        'Tu livres quand même — le métier ajustera ses attentes.',
      ],
      correctIndex: 0,
      correction:
        'La démo intermédiaire sert précisément à détecter les désalignements tôt (Build-Measure-Learn). Un atelier de recadrage immédiat évite des semaines de rework coûteux.',
    },
    {
      npcLine:
        'Léa soulève que la documentation technique est absente sur 60 % des modules livrés.',
      question: 'Comment tu traites ce déficit de documentation ?',
      options: [
        'Tu intègres la documentation dans la Définition of Done à partir du prochain Sprint — une US sans doc n\'est pas "Done".',
        'Tu demandes à Léa de rédiger la doc elle-même après les livraisons.',
        'Tu juges que la doc peut attendre la fin du projet.',
      ],
      correctIndex: 0,
      correction:
        'La documentation est un livrable au même titre que le code. L\'intégrer dans la DoD dès maintenant évite une dette documentaire incontrôlable en fin de projet.',
    },
    {
      npcLine:
        'L\'équipe est fatigante. Deux personnes ont mentionné un sentiment de surcharge.',
      question: 'Comment tu gères la surcharge d\'équipe en tant que PM ?',
      options: [
        'Tu identifies les causes (trop de parallelisme, manque de priorité), tu ajustes le WIP limit et tu prévois un sprint de stabilisation si nécessaire.',
        'Tu rappelles à l\'équipe que les deadlines ne bougent pas — la fatigue est normale.',
        'Tu ignores le signal — chacun gère son rythme.',
      ],
      correctIndex: 0,
      correction:
        'La soutenabilité du rythme (sustainable pace) est une valeur Agile fondamentale. Une équipe épuisée produit de la dette et fait des erreurs. Le PM ajuste la charge proactivement.',
    },
  ],
  closing:
    'Les risques sont documentés et les actions assignées. Le COPIL sera informé des ajustements de plan.',
}

const COPROJ_3: MeetingStep = {
  kind: 'coproj',
  title: 'COPROJ #3 — Clôture de projet',
  opening:
    'Dernier COPROJ avant la livraison finale. L\'équipe fait le bilan. Le projet touche à sa fin.',
  questions: [
    {
      npcLine:
        'Hugo : « On a livré 87 % du scope prévu. Les 13 % restants sont des fonctionnalités de reporting avancé non critiques. »',
      question: 'Comment tu présentes ce résultat au COPIL ?',
      options: [
        'Tu présentes la livraison honnêtement : scope livré vs prévu, critères de succès atteints, et plan pour les 13 % restants (backlog ou abandon).',
        'Tu annonces 100 % de livraison — les 13 % n\'étaient pas vraiment dans le scope initial.',
        'Tu caches les 13 % manquants pour éviter les questions difficiles.',
      ],
      correctIndex: 0,
      correction:
        'La transparence est une valeur non négociable en PM. Présenter honnêtement le périmètre livré construit la confiance long terme — même si le résultat est imparfait.',
    },
    {
      npcLine:
        'Rania : « On devrait documenter les leçons apprises — on a fait beaucoup d\'erreurs sur l\'estimation. »',
      question: 'Comment tu organises les leçons apprises en clôture ?',
      options: [
        'Tu facilites une rétrospective de projet structurée (went well / to improve / actions) et tu archives les leçons dans la base de connaissance.',
        'Tu notes mentalement les erreurs pour le prochain projet.',
        'Tu évites le sujet — revenir sur les erreurs démotive l\'équipe.',
      ],
      correctIndex: 0,
      correction:
        'Les leçons apprises documentées sont le seul moyen d\'améliorer les estimations futures. Une rétrospective de clôture structurée est une pratique PM et Scrum fondamentale.',
    },
    {
      npcLine:
        'Le client demande des modifications de dernière minute juste avant la recette finale.',
      question: 'Comment tu gères ces demandes de dernière minute ?',
      options: [
        'Tu appliques le processus de gestion des changements : analyse d\'impact, décision formelle du sponsor, report en post-livraison si nécessaire.',
        'Tu acceptes pour satisfaire le client — quelques modifications ça ne coûte rien.',
        'Tu refuses catégoriquement sans analyse d\'impact.',
      ],
      correctIndex: 0,
      correction:
        'Toute modification en phase de recette doit passer par le Change Management. Une acceptation sans analyse d\'impact peut introduire des régressions et retarder la livraison.',
    },
    {
      npcLine:
        'Léa : « Les tests de recette ont révélé 3 bugs critiques non détectés plus tôt. »',
      question: 'Comment tu arbitres la livraison avec des bugs critiques ouverts ?',
      options: [
        'Tu bloques la livraison jusqu\'à correction des bugs critiques — livrer du logiciel défaillant crée plus de problèmes qu\'un court délai.',
        'Tu livres quand même en documentant les bugs pour correction future.',
        'Tu minimises l\'impact des bugs devant le client pour ne pas retarder.',
      ],
      correctIndex: 0,
      correction:
        'Un bug "critique" par définition impacte la valeur métier ou la sécurité. Livrer en connaissance de cause sans correction est une faute professionnelle PM et contractuelle.',
    },
    {
      npcLine:
        'Le projet est terminé. L\'équipe se disperse. Tu dois officialiser la clôture.',
      question: 'Quelles sont les étapes formelles de clôture d\'un projet ?',
      options: [
        'Recette formelle signée par le client, archivage des livrables, libération des ressources, rapport de clôture avec indicateurs finaux et leçons apprises.',
        'Envoyer un email de remerciement à l\'équipe et fermer les tickets Jira.',
        'Attendre que le client signale des problèmes avant de clôturer officiellement.',
      ],
      correctIndex: 0,
      correction:
        'La clôture formelle protège juridiquement et marque la fin contractuelle. Elle inclut la recette signée, l\'archivage documentaire et la capitalisation des enseignements.',
    },
  ],
  closing:
    'Projet officiellement clôturé. La rétrospective est planifiée. L\'équipe est libre.',
}

// ─── COPIL — Comités de Pilotage avec le COMEX ───────────────────────────────

const COPIL_1: MeetingStep = {
  kind: 'copil',
  title: 'COPIL #1 — Point mensuel avec le COMEX',
  opening:
    'Tu présentes l\'avancement du projet au COMEX Mutualis Group. La DSI, le CFO et le CPO sont présents. Ils attendent clarté, chiffres et décisions.',
  questions: [
    {
      npcLine:
        'Le CFO : « Vous êtes à 60 % du budget consommé pour 45 % du scope livré. Comment vous l\'expliquez ? »',
      question: 'Comment tu réponds à cette question sur le budget en COPIL ?',
      options: [
        'Tu présentes l\'analyse des écarts (complexité technique imprévue, dette legacy), la CPI (Cost Performance Index) et le plan correctif avec jalons révisés.',
        'Tu accuses l\'équipe de mauvaise gestion pour protéger ta crédibilité.',
        'Tu minimises l\'écart en disant que c\'est "dans les normes du marché".',
      ],
      correctIndex: 0,
      correction:
        'En COPIL, les sponsors attendent des données factuelles et un plan d\'action — pas des excuses. La CPI et le SPI (Schedule Performance Index) sont les indicateurs standards du management de projet (PMBOK).',
    },
    {
      npcLine:
        'Le CPO : « Le planning prévoyait une mise en prod en septembre. On est en octobre. Quand livrez-vous vraiment ? »',
      question: 'Comment tu communiques une nouvelle date de livraison révisée ?',
      options: [
        'Tu présentes la date révisée fondée sur la vélocité réelle mesurée, avec les hypothèses et les marges de risque clairement explicitées.',
        'Tu donnes une date optimiste pour calmer les inquiétudes.',
        'Tu dis que la date sera communiquée la semaine prochaine pour gagner du temps.',
      ],
      correctIndex: 0,
      correction:
        'Une date révisée crédible repose sur des données réelles (vélocité, burn-down). Donner une date sans base solide détruit la confiance au prochain COPIL.',
    },
    {
      npcLine:
        'La DSI : « On envisage de couper le budget de 20 % sur ce projet pour financer une initiative stratégique urgente. »',
      question: 'Comment tu réagis à cette décision de réduction budgétaire ?',
      options: [
        'Tu présentes immédiatement l\'analyse d\'impact sur le scope et les délais — et tu demandes une décision formelle sur ce qu\'on sacrifie.',
        'Tu acceptes sans broncher pour ne pas créer de tension avec la direction.',
        'Tu refuses catégoriquement et tu quittes la réunion.',
      ],
      correctIndex: 0,
      correction:
        'Une réduction budgétaire impose un arbitrage scope/délai/qualité. Le PM est là pour présenter les impacts objectivement et obtenir une décision formelle — pas pour absorber silencieusement la contrainte.',
    },
    {
      npcLine:
        'Le COMEX veut un dashboard de suivi en temps réel accessible depuis leur mobile.',
      question: 'Comment tu traites cette nouvelle demande du COMEX ?',
      options: [
        'Tu notes la demande comme un nouveau besoin, tu analyses l\'impact sur le backlog existant et tu proposes un arbitrage au prochain COPIL.',
        'Tu promets de livrer le dashboard pour le prochain COPIL sans analyser l\'impact.',
        'Tu expliques que ce n\'est pas dans le scope et tu refuses d\'en discuter.',
      ],
      correctIndex: 0,
      correction:
        'Toute nouvelle demande COMEX doit passer par la gouvernance du changement. Promettre sans analyser crée des attentes non maîtrisées et compromet le planning.',
    },
    {
      npcLine:
        'Fin du COPIL. Le COMEX attend un résumé décisionnel avant de partir.',
      question: 'Quel format adoptes-tu pour conclure le COPIL ?',
      options: [
        'Un résumé exécutif de 2 minutes : statut RAG, 3 décisions prises, 3 actions avec owners, prochain COPIL daté.',
        'Tu demandes à chaque membre de l\'équipe de présenter son bilan.',
        'Tu distribues un rapport de 20 pages et tu pars sans résumé oral.',
      ],
      correctIndex: 0,
      correction:
        'Le COMEX raisonne en synthèse, pas en détail. Un résumé RAG (Rouge-Ambre-Vert) + décisions + actions est le standard du reporting exécutif.',
    },
  ],
  closing:
    'COPIL conclu. Les décisions sont enregistrées. Le COMEX repart avec de la visibilité.',
}

const COPIL_2: MeetingStep = {
  kind: 'copil',
  title: 'COPIL #2 — Revue de risques stratégiques',
  opening:
    'Ce COPIL exceptionnel est convoqué suite à des signaux d\'alerte sur la sécurité des données et une pression concurrentielle accrue.',
  questions: [
    {
      npcLine:
        'La DSI : « Notre audit de sécurité a relevé des failles dans la gestion des accès sur le projet. Le RSSI demande une pause du projet. »',
      question: 'Comment tu gères cette demande de pause sécurité ?',
      options: [
        'Tu appuies la décision d\'audit complet, tu identifies les composants à risque et tu proposes un plan de remédiation avec timeline.',
        'Tu t\'opposes à la pause — ça va retarder le planning.',
        'Tu minimises les failles pour éviter d\'alarmer le COMEX.',
      ],
      correctIndex: 0,
      correction:
        'La sécurité n\'est jamais négociable. Appuyer une pause ciblée et proposer un plan de remédiation rapide démontre de la maturité PM et protège l\'entreprise.',
    },
    {
      npcLine:
        'Le CPO : « Un concurrent vient de lancer une feature similaire à la nôtre. Doit-on accélérer ou pivoter ? »',
      question: 'Comment tu arbitres cette décision stratégique en COPIL ?',
      options: [
        'Tu présentes une analyse rapide (time-to-market vs qualité, différenciation possible) et tu demandes une décision formelle du COMEX sur la direction.',
        'Tu décides seul d\'accélérer pour montrer de la réactivité.',
        'Tu proposes d\'abandonner le projet et de copier la solution concurrente.',
      ],
      correctIndex: 0,
      correction:
        'Les décisions stratégiques appartiennent au COMEX. Le PM apporte l\'analyse factuelle et les options, pas la décision finale. C\'est la gouvernance de projet.',
    },
    {
      npcLine:
        'Le CFO : « On a une opportunité de financement externe si on démontre une MVP en 6 semaines. »',
      question: 'Comment tu évalues la faisabilité d\'une MVP en 6 semaines ?',
      options: [
        'Tu identifies le scope minimal viable avec l\'équipe, tu estimes honnêtement sur la vélocité réelle et tu présentes les conditions de succès et les risques.',
        'Tu dis oui immédiatement pour ne pas rater l\'opportunité.',
        'Tu dis que c\'est impossible sans même analyser.',
      ],
      correctIndex: 0,
      correction:
        'Un engagement MVP doit être fondé sur une estimation honnête. Un "oui" sans analyse crée un engagement que tu ne peux pas tenir — ce qui détruit la confiance plus que de dire non.',
    },
    {
      npcLine:
        'Un membre du COMEX propose de changer l\'architecture technique en cours de projet.',
      question: 'Comment tu traites cette proposition d\'architecture en COPIL ?',
      options: [
        'Tu documentes la proposition, tu demandes une analyse d\'impact technique à l\'équipe et tu planifies une décision formelle dans les 5 jours ouvrés.',
        'Tu acceptes immédiatement pour satisfaire le COMEX.',
        'Tu rejettes la proposition sans analyse — changer d\'architecture c\'est trop risqué.',
      ],
      correctIndex: 0,
      correction:
        'Un changement d\'architecture en cours de projet a un impact majeur. Il requiert une analyse d\'impact structurée avant toute décision — ni acceptation aveugle ni refus réflexe.',
    },
    {
      npcLine:
        'Le COMEX demande à augmenter l\'équipe de 3 personnes pour accélérer.',
      question: 'Quelle est ta réponse sur l\'ajout de ressources en cours de projet ?',
      options: [
        'Tu rappelles la Loi de Brooks (ajouter des personnes en retard aggrave le retard à court terme) et tu proposes une intégration progressive avec un plan d\'onboarding.',
        'Tu acceptes les 3 personnes avec enthousiasme — plus de ressources = plus de productivité.',
        'Tu refuses — l\'équipe actuelle n\'a pas envie de nouveaux arrivants.',
      ],
      correctIndex: 0,
      correction:
        'La Loi de Brooks est réelle : les nouveaux arrivants coûtent du temps d\'intégration à l\'équipe existante. Un plan d\'onboarding progressif est indispensable.',
    },
  ],
  closing:
    'Les risques stratégiques sont arbitrés. Le projet repart sur des bases sécurisées.',
}

const COPIL_3: MeetingStep = {
  kind: 'copil',
  title: 'COPIL #3 — Bilan annuel & trajectoire',
  opening:
    'COPIL de fin d\'année. Le COMEX évalue la performance du portfolio projets data et fixe les orientations pour l\'année suivante.',
  questions: [
    {
      npcLine:
        'Le CEO : « Quel est le ROI réel de nos projets data cette année ? »',
      question: 'Comment tu présentes le ROI des projets data au COMEX ?',
      options: [
        'Tu présentes les indicateurs mesurables : temps de traitement réduit, coûts évités, revenus additionnels, satisfaction utilisateurs — avec les hypothèses clairement exprimées.',
        'Tu présentes uniquement les succès techniques sans mentionner les coûts.',
        'Tu dis que le ROI des projets data ne se mesure pas à court terme.',
      ],
      correctIndex: 0,
      correction:
        'Le COMEX raisonne en valeur business. Présenter le ROI avec des métriques concrètes (temps, coût, revenus) et des hypothèses transparentes est le langage du reporting exécutif.',
    },
    {
      npcLine:
        'La DSI : « On veut passer 100 % en Agile l\'année prochaine. Qu\'est-ce que ça implique ? »',
      question: 'Comment tu présentes la transformation Agile au COMEX ?',
      options: [
        'Tu expliques les prérequis (formation, changement de gouvernance, nouveaux rituels), les bénéfices attendus et les risques de transformation mal conduite.',
        'Tu dis que l\'Agile c\'est simple — il suffit de faire des Sprints.',
        'Tu t\'opposes à la transformation — le mode projet actuel fonctionne bien.',
      ],
      correctIndex: 0,
      correction:
        'Une transformation Agile est un changement organisationnel profond. Le COMEX doit comprendre les implications réelles (gouvernance, culture, compétences) pour prendre une décision éclairée.',
    },
    {
      npcLine:
        'Le CPO : « On a 12 projets en cours simultanément. Comment on priorise ? »',
      question: 'Quelle méthode proposes-tu pour prioriser le portfolio ?',
      options: [
        'Une matrice valeur/effort avec critères pondérés (impact business, risque, dépendances), validée par le COMEX et mise à jour trimestriellement.',
        'Chaque directeur garde ses projets — on ne touche à rien.',
        'On arrête 50 % des projets au hasard pour réduire la surcharge.',
      ],
      correctIndex: 0,
      correction:
        'La priorisation de portfolio est un exercice de gouvernance stratégique. Une matrice valeur/effort transparente avec critères explicites est la base de la gestion de programme.',
    },
    {
      npcLine:
        'Un directeur remet en question la méthodologie Scrum — il préfère un retour au mode cascade.',
      question: 'Comment tu défends le choix méthodologique en COPIL ?',
      options: [
        'Tu présentes des données concrètes sur les gains apportés par Scrum sur ce projet, et tu proposes d\'adapter la méthodologie plutôt que d\'en changer.',
        'Tu cèdes immédiatement pour ne pas contrarier le directeur.',
        'Tu attaques le directeur en disant que la cascade est dépassée.',
      ],
      correctIndex: 0,
      correction:
        'Les décisions méthodologiques doivent être fondées sur des données, pas des préférences. Proposer des adaptations est plus constructif qu\'une défense rigide ou qu\'une capitulation.',
    },
    {
      npcLine:
        'Le COMEX demande ton plan pour l\'année prochaine en 60 secondes.',
      question: 'Comment tu structures un pitch de plan annuel en 60 secondes ?',
      options: [
        'Objectifs business clés → 3 initiatives prioritaires → ressources nécessaires → premier jalon dans 90 jours.',
        'Tu lis les 15 slides de ton PowerPoint en accéléré.',
        'Tu demandes un report — 60 secondes ce n\'est pas assez pour un plan annuel.',
      ],
      correctIndex: 0,
      correction:
        'Le Elevator Pitch d\'un plan annuel : objectifs → initiatives → ressources → premier jalon. 60 secondes suffit si la structure est claire. Le COMEX apprécie la concision.',
    },
  ],
  closing:
    'La trajectoire annuelle est validée. Les grandes orientations sont fixées pour l\'année à venir.',
}

// ─── SCRUM — Événements Agile ─────────────────────────────────────────────────

const SPRINT_PLANNING: MeetingStep = {
  kind: 'sprint-planning',
  title: 'Sprint Planning — Sprint 4',
  opening:
    'L\'équipe se réunit pour planifier le Sprint 4. Product Backlog refiné, vélocité connue (38 points en moyenne sur les 3 derniers sprints). Tu facilites.',
  questions: [
    {
      npcLine:
        'L\'équipe demande : « On prend combien de points ce Sprint ? La deadline de fin de mois approche. »',
      question: 'Comment tu détermines la capacité du Sprint ?',
      options: [
        'Tu te bases sur la vélocité historique (38 pts) ajustée des congés et absences connues — pas sur les souhaits du management.',
        'Tu prends 60 points pour montrer de l\'ambition au COMEX.',
        'Tu laisses le management décider de la capacité.',
      ],
      correctIndex: 0,
      correction:
        'La capacité Sprint est déterminée par la vélocité historique réelle, pas par la pression extérieure. Sur-engager détruit la confiance et la qualité.',
    },
    {
      npcLine:
        'Le PO veut mettre 2 User Stories vagues (sans critères d\'acceptation) dans le Sprint.',
      question: 'Comment tu gères des US sans critères d\'acceptation en Sprint Planning ?',
      options: [
        'Tu bloques ces US jusqu\'à ce que les critères d\'acceptation soient clairs et acceptés par l\'équipe — sinon l\'équipe ne sait pas ce qu\'elle livre.',
        'Tu acceptes pour ne pas ralentir le planning.',
        'Tu demandes à l\'équipe de deviner les critères pendant le Sprint.',
      ],
      correctIndex: 0,
      correction:
        'Une User Story sans critères d\'acceptation ne peut pas entrer en Sprint. La Définition of Ready exige des critères clairs, indépendants et estimables (INVEST).',
    },
    {
      npcLine:
        'Un développeur identifie une dépendance technique critique avec l\'équipe infrastructure qui ne sera pas disponible avant mi-Sprint.',
      question: 'Comment tu gères cette dépendance en Sprint Planning ?',
      options: [
        'Tu ajustes le Sprint Goal pour exclure les US bloquées par cette dépendance — ou tu commences par les US indépendantes et tu planifies la résolution de la dépendance.',
        'Tu ignores la dépendance et tu espères que l\'infra sera disponible à temps.',
        'Tu reportes tout le Sprint pour attendre la disponibilité de l\'infra.',
      ],
      correctIndex: 0,
      correction:
        'Les dépendances doivent être identifiées et gérées en Sprint Planning. Un Sprint Goal clair et réaliste exclut les US bloquées par des dépendances non résolues.',
    },
    {
      npcLine:
        'L\'équipe débat pendant 45 minutes sur l\'estimation d\'une US complexe. Le Planning Poker est bloqué.',
      question: 'Comment tu débloques une estimation bloquée en Planning Poker ?',
      options: [
        'Tu utilises la technique du « spike » : 2 jours de recherche technique time-boxée pour lever l\'incertitude, puis ré-estimation.',
        'Tu imposes l\'estimation la plus haute pour être sûr.',
        'Tu retires l\'US du Sprint pour ne pas perdre plus de temps.',
      ],
      correctIndex: 0,
      correction:
        'Un spike est une User Story d\'exploration time-boxée pour réduire l\'incertitude technique. C\'est la réponse Scrum appropriée quand l\'équipe ne peut pas estimer faute d\'information.',
    },
    {
      npcLine:
        'À la fin du Sprint Planning, le Sprint Goal n\'est pas encore formulé.',
      question: 'Pourquoi le Sprint Goal est-il indispensable et comment le formules-tu ?',
      options: [
        'Le Sprint Goal donne un objectif cohérent à l\'équipe : une phrase qui exprime la valeur à livrer ce Sprint, validée par le PO et l\'équipe ensemble.',
        'Le Sprint Goal est optionnel — la liste des US suffit.',
        'Tu copies le Sprint Goal du Sprint précédent pour gagner du temps.',
      ],
      correctIndex: 0,
      correction:
        'Le Sprint Goal est le "pourquoi" du Sprint. Il permet à l\'équipe de prendre des décisions autonomes en cas d\'imprévu. Sans lui, l\'équipe exécute sans comprendre la valeur créée.',
    },
  ],
  closing:
    'Sprint Planning terminé. Le Sprint Goal est validé. L\'équipe démarre avec une vision claire.',
}

const DAILY_SCRUM: MeetingStep = {
  kind: 'daily',
  title: 'Daily Scrum — Sprint 4, Jour 5',
  opening:
    'Daily Scrum de 15 minutes. L\'équipe se synchronise. Hugo semble bloqué depuis hier.',
  questions: [
    {
      npcLine:
        'Hugo : « Hier j\'ai travaillé sur la migration, aujourd\'hui je continue. Rien de bloquant. » — mais son visage dit le contraire.',
      question: 'Comment tu gères un signal de blocage non verbal en Daily ?',
      options: [
        'Tu notes le signal, tu laisses le Daily se terminer en 15 min et tu invites Hugo à un point rapide en bilatéral juste après.',
        'Tu interroges Hugo longuement pendant le Daily devant toute l\'équipe.',
        'Tu ignores — si Hugo ne dit rien c\'est que tout va bien.',
      ],
      correctIndex: 0,
      correction:
        'Le Daily n\'est pas un lieu de résolution de problèmes — c\'est un lieu de synchronisation. Les blocages se traitent en bilatéral ou en sous-groupe après le Daily (« After-party »).',
    },
    {
      npcLine:
        'Rania : « Le Daily prend 30 minutes chaque matin — les gens parlent de tout et de rien. »',
      question: 'Comment tu recadres un Daily qui dépasse son time-box ?',
      options: [
        'Tu rappelles les 3 questions Scrum (hier / aujourd\'hui / blocage), tu time-boxes chaque personne à 2 min et tu renvois les discussions hors sujet après le Daily.',
        'Tu annules le Daily — il ne sert à rien.',
        'Tu laisses faire — la liberté d\'expression est importante.',
      ],
      correctIndex: 0,
      correction:
        'Le Daily de 15 min est un time-box strict. Les 3 questions focalisent sur la synchronisation vers le Sprint Goal — pas sur les statuts détaillés. Le Scrum Master est garant du format.',
    },
    {
      npcLine:
        'Léa : « Je suis bloquée depuis hier soir sur un bug de build. J\'ai essayé 3 solutions différentes. »',
      question: 'Comment tu traites ce blocage technique en Daily ?',
      options: [
        'Tu identifies qui peut aider Léa (dev expert ou archi), tu organises un mob-debugging de 30 min après le Daily et tu mets le blocage dans le Scrum Board.',
        'Tu demandes à Léa de continuer à chercher seule jusqu\'à midi.',
        'Tu escalades immédiatement le bug au COMEX.',
      ],
      correctIndex: 0,
      correction:
        'Les blocages doivent être résolus rapidement. Le Scrum Master (ou PM) facilite la résolution en identifiant la bonne ressource et en time-boxant la résolution.',
    },
    {
      npcLine:
        'Le management assiste au Daily et commence à poser des questions détaillées sur l\'avancement.',
      question: 'Comment tu gères la présence intrusive du management en Daily ?',
      options: [
        'Tu expliques poliment que le Daily est un événement pour l\'équipe de développement — le management peut observer silencieusement mais pas intervenir.',
        'Tu cèdes et tu laisses le management dominer le Daily.',
        'Tu demandes au management de quitter la réunion.',
      ],
      correctIndex: 0,
      correction:
        'Le Daily Scrum est réservé aux développeurs. Le management peut être « poulet » (observateur) mais pas « cochon » (participant décisionnel). C\'est une règle Scrum fondamentale.',
    },
    {
      npcLine:
        'Fin du Daily. Le Sprint Burndown montre un retard de 30 % sur les 3 premiers jours.',
      question: 'Comment tu interprètes et réagis à ce retard sur le Burndown ?',
      options: [
        'Tu organises un point d\'équipe rapide pour identifier la cause (mauvaise estimation, complexité imprévue, blocage) et tu ajustes le plan de Sprint si nécessaire.',
        'Tu paniques et tu envoies un email d\'alarme au COMEX.',
        'Tu ignores — 3 jours c\'est trop tôt pour s\'inquiéter.',
      ],
      correctIndex: 0,
      correction:
        'Un retard de 30 % en J3 est un signal d\'alerte à inspecter sans dramatiser. L\'adaptation rapide (Scrum Pilier Adaptation) évite que la situation empire jusqu\'à la Sprint Review.',
    },
  ],
  closing:
    'Daily terminé en 14 minutes. L\'équipe est synchronisée. Les blocages ont un owner.',
}

const SPRINT_REVIEW: MeetingStep = {
  kind: 'sprint-review',
  title: 'Sprint Review — Sprint 4',
  opening:
    'La Sprint Review réunit l\'équipe et les parties prenantes clés. On démontre ce qui a été livré ce Sprint. Le PO valide ou rejette chaque incrément.',
  questions: [
    {
      npcLine:
        'Le PO : « Cette User Story est techniquement prête mais elle ne correspond pas à ce que j\'avais en tête. »',
      question: 'Comment tu gères un rejet d\'US en Sprint Review ?',
      options: [
        'Tu acceptes le rejet, tu notes les clarifications du PO, tu renvois l\'US dans le Product Backlog avec les nouvelles critères d\'acceptation et tu planifies le reraffinement.',
        'Tu défends l\'US coûte que coûte — l\'équipe a travaillé dur.',
        'Tu livres quand même sans validation du PO.',
      ],
      correctIndex: 0,
      correction:
        'Le PO a le dernier mot sur l\'acceptation des US. Un rejet en Sprint Review est une information précieuse — pas un échec. C\'est le feedback loop qui rend l\'Agile efficace.',
    },
    {
      npcLine:
        'Une partie prenante propose de nombreuses nouvelles fonctionnalités pendant la démo.',
      question: 'Comment tu captures ces nouvelles idées sans perturber le Sprint Review ?',
      options: [
        'Tu notes toutes les idées dans un backlog d\'idées dédié, tu remercies pour les retours et tu planifies un backlog refinement pour les analyser avec le PO.',
        'Tu acceptes toutes les idées en direct et tu promets de les livrer au prochain Sprint.',
        'Tu ignores les idées pour ne pas perturber le Sprint Review.',
      ],
      correctIndex: 0,
      correction:
        'La Sprint Review génère du feedback précieux. Toutes les idées méritent d\'être capturées — mais leur priorisation appartient au PO lors du refinement, pas pendant la réunion.',
    },
    {
      npcLine:
        'L\'équipe a livré 32 points sur 38 prévus. Le PO demande une explication.',
      question: 'Comment tu présentes un Sprint incomplet lors de la Sprint Review ?',
      options: [
        'Tu présentes honnêtement ce qui est "Done" selon la DoD, tu expliques pourquoi les 6 points n\'ont pas été livrés et tu proposes comment les traiter au prochain Sprint.',
        'Tu présente le travail en cours comme "livré" pour atteindre les 38 points.',
        'Tu blâmes un membre de l\'équipe pour justifier le retard.',
      ],
      correctIndex: 0,
      correction:
        'La transparence en Sprint Review est fondamentale. Présenter du work-in-progress comme "Done" est une fraude agile qui mine la confiance et fausse les métriques.',
    },
    {
      npcLine:
        'Le product backlog n\'a pas été mis à jour depuis 2 Sprints. Le PO est débordé.',
      question: 'Comment tu aides à maintenir un Product Backlog sain ?',
      options: [
        'Tu planifies des sessions de Backlog Refinement régulières (min. 10 % de la capacité Sprint) et tu aide le PO à structurer ses sessions.',
        'Tu prends en charge le Product Backlog à la place du PO.',
        'Tu attends que le PO le fasse de son côté sans t\'impliquer.',
      ],
      correctIndex: 0,
      correction:
        'Le Backlog Refinement est un événement continu en Scrum. Le Scrum Master aide le PO à le tenir à jour — sans lui substituer l\'ownership du produit.',
    },
    {
      npcLine:
        'À la fin de la Sprint Review, les parties prenantes semblent satisfaites mais peu engagées.',
      question: 'Comment tu renforces l\'engagement des parties prenantes dans le processus Agile ?',
      options: [
        'Tu les invites à tester eux-mêmes l\'incrément, tu crées des moments d\'interaction directe avec le produit et tu leur expliques comment leur feedback influence le prochain Sprint.',
        'Tu leur envoies un rapport de Sprint Review par email à la place.',
        'Tu réduis la fréquence des Sprint Reviews pour ne pas les mobiliser trop souvent.',
      ],
      correctIndex: 0,
      correction:
        'L\'engagement des stakeholders est un facteur de succès Agile critique. Les faire toucher le produit et voir l\'impact direct de leur feedback renforce leur implication.',
    },
  ],
  closing:
    'Sprint Review terminée. L\'incrément est présenté. Le backlog est mis à jour.',
}

const SPRINT_RETRO: MeetingStep = {
  kind: 'sprint-retro',
  title: 'Sprint Retrospective — Sprint 4',
  opening:
    'La Rétrospective réunit uniquement l\'équipe Scrum. Espace safe pour parler franchement de ce qui a bien marché et de ce qui doit changer.',
  questions: [
    {
      npcLine:
        'Hugo : « Je veux qu\'on parle des estimations — on s\'est toujours trompé cette année. »',
      question: 'Comment tu facilites une discussion sur les estimations en rétro ?',
      options: [
        'Tu analyses les données historiques (écart estimation/réalité), tu identifies les patterns (mauvais splitting, complexité cachée) et tu proposes une expérimentation pour le prochain Sprint.',
        'Tu défends les estimations passées — l\'équipe a fait de son mieux.',
        'Tu proposes d\'arrêter d\'estimer pour éviter le problème.',
      ],
      correctIndex: 0,
      correction:
        'L\'amélioration des estimations passe par l\'analyse de données, pas par la suppression des estimations. La Rétrospective est le lieu idéal pour identifier les patterns d\'écart et expérimenter.',
    },
    {
      npcLine:
        'L\'ambiance de la rétrospective est tendue — deux personnes ont un conflit ouvert.',
      question: 'Comment tu gères un conflit interpersonnel en Rétrospective ?',
      options: [
        'Tu recentres la discussion sur les systèmes et les processus (pas les personnes), tu rappelles la règle de la prime directive et tu proposes un bilatéral de médiation hors rétrospective si nécessaire.',
        'Tu prends parti pour l\'une des deux personnes.',
        'Tu annules la rétrospective pour éviter le conflit.',
      ],
      correctIndex: 0,
      correction:
        'La Prime Directive des Rétrospectives : "Everyone did the best job they could given what they knew." Le focus est sur les améliorations système, pas sur les blâmes personnels.',
    },
    {
      npcLine:
        'Léa : « On identifie les mêmes problèmes chaque Sprint mais rien ne change jamais. »',
      question: 'Comment tu rends les rétrospectives vraiment actionnables ?',
      options: [
        'Tu limites les actions à maximum 2-3 items par Sprint, tu désignes un owner pour chacune, tu les intègres dans le Sprint Backlog et tu vérifie à la prochaine rétro.',
        'Tu continues à lister tous les problèmes et tu espères que ça changera.',
        'Tu arrêtes les rétrospectives — elles ne servent à rien.',
      ],
      correctIndex: 0,
      correction:
        'Une Rétrospective efficace produit 2-3 actions maximum avec owner et deadline. Trop d\'actions = aucune action. L\'intégration dans le Sprint Backlog garantit l\'exécution.',
    },
    {
      npcLine:
        'Rania : « L\'environnement de dev est instable depuis 2 Sprints — ça nous ralentit énormément. »',
      question: 'Comment tu traites un problème d\'environnement récurrent en Rétrospective ?',
      options: [
        'Tu escalades ce blocage infrastructure comme un impediment formel au management (hors portée de l\'équipe), avec impact chiffré sur la vélocité et demande de résolution sous 1 semaine.',
        'Tu demandes à l\'équipe de s\'adapter à l\'environnement instable.',
        'Tu notes le problème dans la rétro mais tu n\'escalades pas.',
      ],
      correctIndex: 0,
      correction:
        'Les impediments hors portée de l\'équipe doivent être escaladés par le Scrum Master. Un environnement instable est un impediment systémique qui impacte directement la vélocité.',
    },
    {
      npcLine:
        'À la fin de la Rétrospective, l\'équipe semble plus soudée qu\'en début de séance.',
      question: 'Comment tu capitalises sur cette dynamique positive en fin de rétro ?',
      options: [
        'Tu célèbres explicitement ce qui a bien marché ce Sprint, tu formules les actions comme des expériences positives et tu termines sur une note d\'espoir et d\'équipe.',
        'Tu enchaînes immédiatement sur d\'autres réunions sans marquer la fin.',
        'Tu ne dis rien — les émotions n\'ont pas leur place en Scrum.',
      ],
      correctIndex: 0,
      correction:
        'Terminer la Rétrospective sur une note positive et des célébrations concrètes renforce la cohésion d\'équipe. Le Scrum Master est aussi un animateur — pas seulement un facilitateur de processus.',
    },
  ],
  closing:
    'Rétrospective terminée. 3 actions concrètes. L\'équipe repart avec de l\'énergie.',
}

// ─── COMEX fire — Réunions disciplinaires interactives ───────────────────────

const COMEX_DANGER: MeetingStep = {
  kind: 'comex-danger',
  title: 'Signal COMEX — Convocation informelle',
  opening:
    'La DRH t\'a convoqué pour un entretien informel. À côté d\'elle, le CTO et ton N+1. L\'atmosphère est froide. Ton taux de risque vient de passer à 50 %. Chacune de tes réponses compte.',
  questions: [
    {
      npcLine:
        'DRH : « Plusieurs livrables n\'ont pas été validés lors des derniers sprints. Le COMEX s\'inquiète de la régularité de tes résultats. Que s\'est-il passé ? »',
      question: 'Comment tu réponds à cette question en entretien disciplinaire ?',
      options: [
        'Tu reconnais les difficultés rencontrées, tu expliques les causes techniques ou contextuelles sans te dédouaner, et tu présentes un plan d\'amélioration concret.',
        'Tu minimises les problèmes : « Ce n\'était pas si grave, tout le monde fait des erreurs. »',
        'Tu accuses l\'équipe ou les outils pour justifier les échecs.',
      ],
      correctIndex: 0,
      correction:
        'Assumer les difficultés et proposer un plan correctif démontre la maturité professionnelle. La minimisation ou le déplacement de responsabilité aggrave la situation.',
      fireRiskDelta: -8,
    },
    {
      npcLine:
        'CTO : « Ta maîtrise technique est remise en question par certains membres de l\'équipe. Comment tu te situes toi-même ? »',
      question: 'Comment tu gères une remise en question de tes compétences ?',
      options: [
        'Tu fais un bilan honnête de tes forces et axes d\'amélioration, et tu proposes un plan de montée en compétences concret (formations, mentorat, pair programming).',
        'Tu contestes les avis de tes collègues et tu défends ton niveau coûte que coûte.',
        'Tu prétends n\'avoir aucune lacune pour ne pas paraître faible.',
      ],
      correctIndex: 0,
      correction:
        'L\'autocritique constructive et un plan de développement personnel démontrent l\'intelligence émotionnelle. Nier ses lacunes en entretien de performance est contre-productif.',
      fireRiskDelta: -7,
    },
    {
      npcLine:
        'N+1 : « Qu\'est-ce que tu peux t\'engager à faire différemment dès maintenant ? »',
      question: 'Comment tu formules un engagement professionnel crédible ?',
      options: [
        'Tu proposes 2-3 engagements SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporels) avec des indicateurs de succès clairs.',
        'Tu fais des promesses générales et vagues : « Je vais m\'améliorer, je vous le promets. »',
        'Tu demandes qu\'on te fixe tes objectifs à ta place.',
      ],
      correctIndex: 0,
      correction:
        'Un engagement crédible est SMART et vérifiable. Les promesses floues ne rassurent pas le management — elles signalent l\'absence de plan réel.',
      fireRiskDelta: -9,
    },
    {
      npcLine:
        'DRH : « Dans quelle mesure tu estimes avoir contribué aux difficultés de l\'équipe ? »',
      question: 'Comment tu évalues ta part de responsabilité dans les difficultés collectives ?',
      options: [
        'Tu reconnais objectivement ta part (communication insuffisante, estimations trop optimistes) sans te flageller ni reporter tout sur l\'extérieur.',
        'Tu dis que tu n\'as aucune responsabilité — c\'est entièrement la faute des autres.',
        'Tu dis que c\'est 100 % de ta faute pour paraître humble.',
      ],
      correctIndex: 0,
      correction:
        'La responsabilité partagée et calibrée est la marque d\'un professionnel mature. Ni auto-flagellation ni déni — une analyse équilibrée des causes.',
      fireRiskDelta: -6,
    },
    {
      npcLine:
        'CTO : « Donne-nous une raison concrète de continuer à investir sur toi. »',
      question: 'Comment tu défends ta valeur dans un contexte sous pression ?',
      options: [
        'Tu cites des contributions concrètes récentes (livrables réussis, problèmes résolus, valeur apportée) et tu projettes sur ce que tu peux apporter dans les 3 prochains mois.',
        'Tu dis que tu travailles dur et que tu mérites une chance.',
        'Tu pleures ou tu te mets en colère face à cette question.',
      ],
      correctIndex: 0,
      correction:
        'La valeur se démontre avec des faits concrets. « Je travaille dur » n\'est pas un argument — les livrables, les résolutions de problèmes et la vision prospective en sont.',
      fireRiskDelta: -10,
    },
  ],
  closing:
    'L\'entretien se termine. La DRH note tes réponses. Tes réponses ont influencé la perception du COMEX.',
}

const COMEX_WARNING: MeetingStep = {
  kind: 'comex-warning',
  title: 'COMEX — Entretien de recadrage formel',
  opening:
    'Convocation officielle au bureau du DG. Le dossier est posé sur la table. Ton risque de licenciement est à 75 %. Chaque réponse peut faire basculer la décision.',
  questions: [
    {
      npcLine:
        'DG : « Nous vous avons convoqué suite à une série de manquements répétés. Avez-vous conscience de la gravité de la situation ? »',
      question: 'Comment tu répondes à cette mise en garde directe ?',
      options: [
        'Tu confirmes ta pleine conscience de la gravité, tu reconnais les manquements précis et tu demandes la possibilité de présenter ton plan correctif.',
        'Tu contestes la qualification de « manquements répétés » point par point.',
        'Tu demandes à ton avocat d\'être présent avant de répondre.',
      ],
      correctIndex: 0,
      correction:
        'En entretien de recadrage formel, reconnaître la gravité de la situation sans se défendre immédiatement est la posture professionnelle attendue. La contestation immédiate aggrave la perception.',
      fireRiskDelta: -10,
    },
    {
      npcLine:
        'DRH : « Quels moyens concrets avez-vous mis en place pour améliorer votre performance depuis notre dernier entretien ? »',
      question: 'Comment tu démontres une amélioration concrète sous pression ?',
      options: [
        'Tu présentes des preuves factuelles : livrables réussis, feedbacks positifs récents, formations suivies, indicateurs améliorés.',
        'Tu dis que tu as essayé mais que les conditions de travail ne t\'ont pas aidé.',
        'Tu n\'as rien fait et tu demandes plus de temps.',
      ],
      correctIndex: 0,
      correction:
        'Les preuves factuelles sont le seul argument crédible en entretien de recadrage. Sans données concrètes, la promesse d\'amélioration est perçue comme un discours de façade.',
      fireRiskDelta: -12,
    },
    {
      npcLine:
        'DG : « Si nous décidons de vous maintenir dans l\'entreprise, quels sont vos engagements précis pour les 30 prochains jours ? »',
      question: 'Comment tu formules un plan d\'action sur 30 jours en situation de crise ?',
      options: [
        'Tu proposes des objectifs hebdomadaires mesurables, des checkpoints intermédiaires et une revue de performance à J+30 avec indicateurs de succès définis ensemble.',
        'Tu promets de « tout faire pour vous satisfaire » sans détailler.',
        'Tu demandes 60 jours au lieu de 30 pour te donner plus de marge.',
      ],
      correctIndex: 0,
      correction:
        'Un plan de 30 jours crédible est précis, mesurable et avec des checkpoints. L\'ambiguïté sur les engagements pris dans un contexte disciplinaire est rédhibitoire.',
      fireRiskDelta: -11,
    },
    {
      npcLine:
        'DRH : « Vos collègues ont fait part de difficultés à collaborer avec vous. Comment vous l\'expliquez ? »',
      question: 'Comment tu traites un feedback négatif sur la collaboration ?',
      options: [
        'Tu écoutes sans interrompre, tu reconnais que ta communication a pu être perçue différemment de ton intention, et tu proposes des actions concrètes pour améliorer la dynamique d\'équipe.',
        'Tu nies les difficultés et tu dis que tes collègues exagèrent.',
        'Tu demandes à confronter directement les collègues qui ont fait ce retour.',
      ],
      correctIndex: 0,
      correction:
        'La différence entre intention et impact est réelle. Reconnaître que ta communication a pu créer des difficultés — même involontairement — est la posture mature attendue.',
      fireRiskDelta: -8,
    },
    {
      npcLine:
        'DG : « Nous allons délibérer. Avez-vous quelque chose à ajouter avant que nous nous retirions ? »',
      question: 'Quelle est ta dernière intervention avant la délibération ?',
      options: [
        'Tu réaffirmes ton engagement envers le projet Mutualis, tu résumes les actions que tu t\'es engagé à prendre et tu remercies le COMEX pour l\'opportunité de t\'exprimer.',
        'Tu plaides de façon émotionnelle en te justifiant longuement.',
        'Tu gardes le silence total pour montrer ta dignité.',
      ],
      correctIndex: 0,
      correction:
        'La dernière intervention est une opportunité de synthèse. Réaffirmer son engagement et ses actions concrètes laisse une impression de professionnel organisé et déterminé.',
      fireRiskDelta: -9,
    },
  ],
  closing:
    'Le COMEX délibère. Tes réponses ont pesé dans la balance. La décision sera communiquée.',
}

const COMEX_NOTICE: MeetingStep = {
  kind: 'comex-notice',
  title: 'COMEX — Entretien préalable au licenciement',
  opening:
    'Entretien préalable au licenciement. Le DRH et le DG sont face à toi. Un conseiller du salarié est présent à ta demande. Risque : 80 %. Tout se joue maintenant.',
  questions: [
    {
      npcLine:
        'DRH : « Nous avons convoqué cet entretien conformément à l\'article L1232-2 du Code du Travail. La direction envisage de mettre fin à votre contrat pour insuffisance de résultats. »',
      question: 'Quelle est ta réaction à l\'ouverture de cet entretien préalable ?',
      options: [
        'Tu écoutes attentivement les faits reprochés, tu prends des notes et tu réserves ta réponse pour la phase de contradiction — c\'est la procédure légale.',
        'Tu interromps immédiatement pour contester les faits.',
        'Tu sors de la réunion sans répondre.',
      ],
      correctIndex: 0,
      correction:
        'L\'entretien préalable suit un protocole légal : présentation des faits, puis droit de réponse du salarié. Écouter d\'abord et prendre des notes est la bonne pratique juridique et professionnelle.',
      fireRiskDelta: -12,
    },
    {
      npcLine:
        'DG : « Les faits reprochés sont : 3 livrables manqués, 2 retards de reporting, une absence de communication sur un blocage critique. Que répondez-vous ? »',
      question: 'Comment tu contestes ou nuances les faits reprochés de façon professionnelle ?',
      options: [
        'Tu reconvoques les faits avec précision : tu contestes ce qui est inexact avec des preuves, tu contextualises ce qui est partiel, et tu reconnais ce qui est fondé.',
        'Tu contestes en bloc tous les faits reprochés.',
        'Tu acceptes en bloc sans nuancer pour éviter le conflit.',
      ],
      correctIndex: 0,
      correction:
        'Une défense efficace en entretien préalable est factuelle et nuancée. Contester l\'ensemble sans preuves ou accepter tout en bloc sont deux erreurs symétriques.',
      fireRiskDelta: -13,
    },
    {
      npcLine:
        'DRH : « Avez-vous des éléments de contexte que vous souhaitez porter à notre connaissance ? »',
      question: 'Quels éléments de contexte peux-tu apporter pour nuancer la situation ?',
      options: [
        'Tu présentes les contraintes structurelles (charge de travail, ressources insuffisantes, dépendances bloquantes) sans les utiliser comme excuse, mais comme éléments d\'information.',
        'Tu accuses directement le management d\'être responsable de tes échecs.',
        'Tu ne dis rien — le contexte ne compte pas.',
      ],
      correctIndex: 0,
      correction:
        'Le contexte est pertinent mais ne doit pas être utilisé comme dédouanement. Présenter les contraintes structurelles de façon factuelle aide à nuancer le dossier sans paraître irresponsable.',
      fireRiskDelta: -10,
    },
    {
      npcLine:
        'DG : « Si nous décidons de ne pas procéder au licenciement, quelles garanties pouvez-vous nous donner ? »',
      question: 'Comment tu formules des garanties crédibles en situation de préavis ?',
      options: [
        'Tu proposes un plan de performance formel sur 60 jours avec des objectifs précis, des jalons de contrôle hebdomadaires et une clause de révision après 30 jours.',
        'Tu jures que ça ne se reproduira plus.',
        'Tu demandes un changement de poste ou de manager comme condition.',
      ],
      correctIndex: 0,
      correction:
        'Un plan de performance formalisé est la seule garantie crédible en situation de préavis. Il doit être précis, mesurable et demander un suivi rapproché — démontrant que tu prends la situation au sérieux.',
      fireRiskDelta: -15,
    },
    {
      npcLine:
        'L\'entretien approche de sa fin. DRH : « Avez-vous des éléments supplémentaires à apporter à notre réflexion ? »',
      question: 'Comment tu clôtures cet entretien préalable de façon optimale ?',
      options: [
        'Tu résumes tes 3 arguments principaux, tu confirmes ta disponibilité immédiate pour mettre en œuvre le plan de performance et tu remercies pour le processus équitable.',
        'Tu pleures pour toucher émotionnellement les décideurs.',
        'Tu demandes la décision immédiate pour ne pas rester dans l\'incertitude.',
      ],
      correctIndex: 0,
      correction:
        'Une clôture structurée et professionnelle laisse une dernière impression de sérieux. La gestion émotionnelle est clé — ni détresse démonstrative ni froideur distante.',
      fireRiskDelta: -11,
    },
  ],
  closing:
    'L\'entretien préalable est terminé. Le COMEX dispose de 2 jours ouvrés pour notifier sa décision. Tes réponses ont pu faire la différence.',
}

const COMEX_FIRED: MeetingStep = {
  kind: 'comex-fired',
  title: 'COMEX — Réunion de licenciement',
  opening:
    'Convocation finale. La lettre est sur la table. Risque à 100 %. Mais il reste une dernière chance : tes réponses pourraient convaincre le COMEX de reconsidérer sa décision.',
  questions: [
    {
      npcLine:
        'DG : « La décision de licenciement a été prise. Souhaitez-vous vous exprimer une dernière fois ? »',
      question: 'Comment tu te positionnes face à une décision de licenciement annoncée ?',
      options: [
        'Tu restes calme, tu demandes les modalités de la procédure, tu annonces ton intention de contester si tu estimes la décision infondée, et tu gardes ta dignité.',
        'Tu éclates en larmes ou en colère.',
        'Tu acceptes immédiatement sans répondre.',
      ],
      correctIndex: 0,
      correction:
        'La dignité et le sang-froid en situation de licenciement sont des qualités qui peuvent encore influencer la décision finale ou les modalités de départ. La réaction émotionnelle incontrôlée nuit.',
      fireRiskDelta: -15,
    },
    {
      npcLine:
        'DRH : « Avez-vous conscience d\'avoir épuisé toutes les opportunités qui vous ont été données ? »',
      question: 'Comment tu réponds à cette question sur les opportunités manquées ?',
      options: [
        'Tu reconnais honnêtement les opportunités que tu n\'as pas saisies tout en signalant les points sur lesquels tu as progressé — une réponse équilibrée et factuelle.',
        'Tu dis que tu n\'as jamais eu de vraie chance.',
        'Tu attaques la direction pour les conditions imposées.',
      ],
      correctIndex: 0,
      correction:
        'Reconnaître ses manquements tout en mettant en valeur ses progrès réels est la posture la plus crédible. Elle peut influencer les modalités de départ (outplacement, préavis) même si la décision est prise.',
      fireRiskDelta: -12,
    },
    {
      npcLine:
        'CTO : « Si on vous donnait une dernière chance, qu\'est-ce qui changerait concrètement par rapport aux fois précédentes ? »',
      question: 'Quelle réponse peut encore convaincre le COMEX de reconsidérer la décision ?',
      options: [
        'Tu présentes un changement de méthode de travail radical et vérifiable, avec des indicateurs de résultat hebdomadaires et une période probatoire sous supervision étroite acceptée volontairement.',
        'Tu répètes les mêmes promesses que lors des entretiens précédents.',
        'Tu dis que la situation était impossible et que personne ne pouvait réussir.',
      ],
      correctIndex: 0,
      correction:
        'Un changement radical et vérifiable avec supervision volontaire est le seul argument qui peut encore peser. Répéter des promesses déjà faites ou imputer la faute à l\'extérieur scelle la décision.',
      fireRiskDelta: -18,
    },
    {
      npcLine:
        'DRH : « Votre comportement envers vos collègues a été mentionné comme problématique. Que pensez-vous de cette évaluation ? »',
      question: 'Comment tu abordes la dimension relationnelle dans cet entretien final ?',
      options: [
        'Tu reconnais l\'impact que ton comportement a pu avoir sur tes collègues, tu t\'en excuses sincèrement et tu proposes des modalités concrètes pour réparer les relations.',
        'Tu nies les problèmes relationnels — tes collègues ne peuvent pas témoigner contre toi.',
        'Tu demandes les noms de ceux qui ont témoigné pour les confronter.',
      ],
      correctIndex: 0,
      correction:
        'Les excuses sincères avec des propositions concrètes de réparation démontrent une intelligence émotionnelle et sociale. Nier ou chercher à confronter les témoins aggrave irrémédiablement la situation.',
      fireRiskDelta: -14,
    },
    {
      npcLine:
        'Le COMEX se consulte à voix basse. DG : « Nous allons vous laisser quelques minutes. » — ils reviennent 5 minutes plus tard.',
      question: 'Comment tu gères cette attente décisive ?',
      options: [
        'Tu restes calme et composé, tu prépares mentalement les deux scenarios (maintien ou départ), et tu te souviens que ta réaction à l\'annonce finale fera aussi partie de l\'évaluation.',
        'Tu commences à envoyer des messages paniqués à tes contacts.',
        'Tu demandes à quitter la salle pendant la délibération.',
      ],
      correctIndex: 0,
      correction:
        'La gestion de l\'attente stressante est elle-même observée. Un professionnel calme et préparé aux deux scenari démontre une maturité émotionnelle qui peut encore jouer en sa faveur.',
      fireRiskDelta: -16,
    },
  ],
  closing:
    'Le COMEX revient. La décision finale a été influencée par tes réponses. Tes choix ont compté.',
}

// ─── Exports ─────────────────────────────────────────────────────────────────

/** Toutes les réunions non-COMEX, en rotation cyclique par type. */
export const COPROJ_BANK: readonly MeetingStep[] = [COPROJ_1, COPROJ_2, COPROJ_3]
export const COPIL_BANK: readonly MeetingStep[] = [COPIL_1, COPIL_2, COPIL_3]
export const SCRUM_BANK: readonly MeetingStep[] = [
  SPRINT_PLANNING,
  DAILY_SCRUM,
  SPRINT_REVIEW,
  SPRINT_RETRO,
]

/** Réunions COMEX fire, indexées par fireAlertLevel. */
export const COMEX_MEETINGS: Record<
  'comex-danger' | 'comex-warning' | 'comex-notice' | 'comex-fired',
  MeetingStep
> = {
  'comex-danger': COMEX_DANGER,
  'comex-warning': COMEX_WARNING,
  'comex-notice': COMEX_NOTICE,
  'comex-fired': COMEX_FIRED,
}

/**
 * Retourne la réunion à injecter pour un step donné (index global 0…).
 * - Toutes les 3 tâches : 1 COPROJ (cyclique)
 * - Toutes les 6 tâches : 1 COPIL (cyclique)
 * - Toutes les 4 tâches : 1 événement Scrum (cyclique)
 * Les COMEX fire sont injectés par le système fireAlert — pas ici.
 */
export function getMeetingForStep(
  globalStepIndex: number,
  locale: PmGameLocale = 'fr',
): MeetingStep | null {
  const copil = locale === 'en' ? COPIL_BANK_EN : COPIL_BANK
  const scrum = locale === 'en' ? SCRUM_BANK_EN : SCRUM_BANK
  const coproj = locale === 'en' ? COPROJ_BANK_EN : COPROJ_BANK
  if (globalStepIndex === 0) return null
  if (globalStepIndex % 6 === 0) {
    return copil[(globalStepIndex / 6 - 1) % copil.length]!
  }
  if (globalStepIndex % 4 === 0) {
    return scrum[(globalStepIndex / 4 - 1) % scrum.length]!
  }
  if (globalStepIndex % 3 === 0) {
    return coproj[(globalStepIndex / 3 - 1) % coproj.length]!
  }
  return null
}

export function resolveComexMeeting(
  kind: keyof typeof COMEX_MEETINGS,
  locale: PmGameLocale = 'fr',
): MeetingStep {
  return locale === 'en' ? COMEX_MEETINGS_EN[kind] : COMEX_MEETINGS[kind]
}
