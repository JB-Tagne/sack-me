/** Guides débutant : aucun compte préalable sur les plateformes de la stack. */

import type { ToolId } from './tools'
import { GUIDES_EN } from './toolOnboarding.en'

export interface ToolOnboarding {
  toolId: ToolId
  /** Plateforme concrète où s’exercer (peut différer du libellé pédagogique). */
  platformLabel: string
  /** Gratuit / freemium possible sans entreprise. */
  freePath: boolean
  signupUrl?: string
  signupLabel?: string
  /** Création de compte — étapes numérotées. */
  accountSteps: string[]
  /** Première prise en main après login. */
  firstUseSteps: string[]
  /** Comment produire le livrable de la tâche Mutualis. */
  taskSteps: string[]
  /** Si pas de compte possible tout de suite. */
  withoutAccount: string
}

export const GUIDES: Record<ToolId, ToolOnboarding> = {
  jira: {
    toolId: 'jira',
    platformLabel: 'Atlassian Jira (Cloud Free)',
    freePath: true,
    signupUrl: 'https://www.atlassian.com/software/jira/free',
    signupLabel: 'Créer un site Jira Free',
    accountSteps: [
      'Ouvre la page Jira Free Atlassian et clique sur « Try it free » / « Get it free ».',
      'Crée un compte Atlassian (e-mail) ou connecte-toi avec Google.',
      'Choisis un nom de site (ex. mutualis-tonprenom) et le plan Free.',
      'Crée un projet de type « Kanban » ou « Scrum » nommé Mutualis Retail.',
    ],
    firstUseSteps: [
      'Dans le projet, ouvre le board (Board / Backlog).',
      'Crée une Epic « Lot data Mutualis » puis 2–3 Stories.',
      'Renseigne Summary, Description, Acceptance Criteria sur une Story.',
      'Déplace une carte de To Do → In Progress → Done pour voir le flux.',
    ],
    taskSteps: [
      'Crée le ticket demandé par la consigne (Epic/Story) avec AC testables.',
      'Copie l’URL du ticket ou un export texte (clé + titre + AC) dans le livrable du jeu.',
      'Note le lien Confluence si tu documentes aussi (sinon laisse vide).',
    ],
    withoutAccount:
      'Sans compte : rédige quand même la Story au format texte (Titre / AC / DoD) dans le pad du jeu — tu créeras le ticket Jira dès que le site Free est prêt.',
  },
  confluence: {
    toolId: 'confluence',
    platformLabel: 'Atlassian Confluence (Cloud Free)',
    freePath: true,
    signupUrl: 'https://www.atlassian.com/software/confluence/free',
    signupLabel: 'Créer Confluence Free',
    accountSteps: [
      'Si tu as déjà Jira Free, ajoute Confluence depuis ton site Atlassian (Apps).',
      'Sinon inscris-toi sur Confluence Free avec le même e-mail Atlassian.',
      'Crée un espace « Mutualis Data » (type Team ou Documentation).',
    ],
    firstUseSteps: [
      'Crée une page « ADR — définition KPI » à partir d’un template vide.',
      'Ajoute titres H1/H2, une table Owner / Steward, un lien vers un ticket Jira.',
      'Publie la page (Publish) et copie l’URL.',
    ],
    taskSteps: [
      'Rédige la page demandée (ADR, runbook ou glossaire court).',
      'Colle l’URL Confluence + un extrait (définition + Owner) dans le livrable.',
    ],
    withoutAccount:
      'Sans compte : rédige la page en Markdown dans le pad (titres, Owner, définition). Tu la reporteras dans Confluence dès l’espace créé.',
  },
  sql: {
    toolId: 'sql',
    platformLabel: 'Databricks Free Edition (SQL) ou éditeur SQL local',
    freePath: true,
    signupUrl: 'https://login.databricks.com/signup?provider=DB_FREE_TIER',
    signupLabel: 'Créer Databricks Free Edition',
    accountSteps: [
      'Va sur l’inscription Databricks Free Edition (plus de Community Edition).',
      'Inscris-toi avec e-mail ou SSO (Google/Microsoft) — pas besoin de carte bancaire pour Free Edition.',
      'Attends la création du workspace, puis connecte-toi.',
    ],
    firstUseSteps: [
      'Dans le workspace : New → Notebook (language SQL) ou SQL Editor.',
      'Upload le CSV du jeu (Catalog / Volume / Upload) ou colle les données en table temporaire.',
      'Exécute un `SELECT * FROM … LIMIT 10` pour vérifier que tu vois les lignes.',
    ],
    taskSteps: [
      'Écris et exécute la requête demandée dans Databricks (ou SQLite/DBeaver en local).',
      'Quand le résultat est correct, copie le SQL dans le pad du jeu (livrable).',
      'Ajoute en commentaire le grain et un contrôle COUNT si la consigne le demande.',
    ],
    withoutAccount:
      'Sans Databricks : installe VS Code + extension SQL, ou utilise https://sqliteonline.com — télécharge le CSV du jeu, écris la requête, colle-la ici.',
  },
  python: {
    toolId: 'python',
    platformLabel: 'Databricks Free Edition (Python) ou Python local',
    freePath: true,
    signupUrl: 'https://login.databricks.com/signup?provider=DB_FREE_TIER',
    signupLabel: 'Créer Databricks Free Edition',
    accountSteps: [
      'Crée un compte Databricks Free Edition (même compte que pour SQL si déjà fait).',
      'Ouvre New → Notebook, language Python.',
    ],
    firstUseSteps: [
      'Dans une cellule : `print("hello")` puis Run pour vérifier l’exécution.',
      'Upload le fichier CSV du jeu ou utilise `spark.read.csv` / pandas selon la consigne.',
      'Familiarise-toi avec Run All / Clear state.',
    ],
    taskSteps: [
      'Code le script demandé (lecture → transform → contrôle).',
      'Exécute-le jusqu’à obtenir le résultat attendu.',
      'Colle le code Python complet dans le pad du jeu.',
    ],
    withoutAccount:
      'Sans Databricks : installe Python 3 + pandas (`pip install pandas`) ou Google Colab (compte Google). Colle ensuite le script ici.',
  },
  spark: {
    toolId: 'spark',
    platformLabel: 'Databricks Free Edition (PySpark)',
    freePath: true,
    signupUrl: 'https://login.databricks.com/signup?provider=DB_FREE_TIER',
    signupLabel: 'Créer Databricks Free Edition',
    accountSteps: [
      'Inscris-toi à Databricks Free Edition si ce n’est pas déjà fait.',
      'Crée un notebook Python — le runtime fournit Spark.',
    ],
    firstUseSteps: [
      'Vérifie Spark : `spark.version` dans une cellule.',
      'Charge un petit CSV en DataFrame : `spark.read.option("header", True).csv(...)`.',
      'Utilise `.show()` et `.printSchema()` pour inspecter.',
    ],
    taskSteps: [
      'Implémente les transformations Spark demandées (filter, groupBy, join…).',
      'Vérifie le résultat avec `.show()` / count.',
      'Colle le code PySpark dans le pad du jeu.',
    ],
    withoutAccount:
      'Sans compte cloud : tu peux écrire le code PySpark dans le pad (le jeu valide le livrable texte). Pour l’exécuter plus tard, Free Edition reste le chemin le plus simple.',
  },
  databricks: {
    toolId: 'databricks',
    platformLabel: 'Databricks Free Edition',
    freePath: true,
    signupUrl: 'https://login.databricks.com/signup?provider=DB_FREE_TIER',
    signupLabel: 'Créer Databricks Free Edition',
    accountSteps: [
      'Inscris-toi sur Databricks Free Edition (signup Free Tier).',
      'Valide ton e-mail et ouvre le workspace fourni.',
      'Parcours le menu : Workspace, Catalog, Jobs (selon disponibilités Free Edition).',
    ],
    firstUseSteps: [
      'Crée un dossier Mutualis dans Workspace.',
      'Crée un notebook SQL et un notebook Python liés au même dataset d’essai.',
      'Si Jobs est disponible : schedule un run simple du notebook.',
    ],
    taskSteps: [
      'Réalise la manip demandée (notebook, job, Delta / catalog selon consigne).',
      'Documente en 3 lignes ce que tu as cliqué + colle le code / config dans le pad.',
    ],
    withoutAccount:
      'Le jeu accepte un livrable texte décrivant l’enchaînement (screenshots optionnels). Crée le compte Free Edition dès que possible pour pratiquer vraiment.',
  },
  gcs: {
    toolId: 'gcs',
    platformLabel: 'Google Cloud Storage (essai GCP)',
    freePath: true,
    signupUrl: 'https://console.cloud.google.com/freetrial',
    signupLabel: 'Ouvrir Google Cloud (essai / Free Tier)',
    accountSteps: [
      'Crée un compte Google si besoin, puis ouvre Google Cloud Console.',
      'Active l’essai gratuit (carte souvent demandée ; crédits offerts — surveille la facturation).',
      'Crée un projet « mutualis-data-tonprenom ».',
      'Active l’API Cloud Storage.',
    ],
    firstUseSteps: [
      'Menu Storage → Buckets → Create (région EU, nom unique).',
      'Crée un préfixe `landing/dt=YYYY-MM-DD/`.',
      'Upload un petit CSV de test et vérifie les permissions (pas public).',
    ],
    taskSteps: [
      'Reproduis le path / upload demandé par la consigne.',
      'Dans le livrable : chemin gs://… + classification + qui a accès.',
    ],
    withoutAccount:
      'Sans GCP : simule le path (`gs://mutualis-landing/dt=2026-07-24/file.csv`) et décris IAM/rétention dans le pad. Tu le matérialiseras dès le projet GCP créé.',
  },
  cloudsql: {
    toolId: 'cloudsql',
    platformLabel: 'Google Cloud SQL (ou Postgres local)',
    freePath: true,
    signupUrl: 'https://console.cloud.google.com/sql',
    signupLabel: 'Console Cloud SQL',
    accountSteps: [
      'Avec un projet GCP actif, ouvre SQL → Create instance (Postgres, petite machine).',
      'Attention coûts : arrête/supprime l’instance après l’exercice si tu n’en as plus besoin.',
      'Alternative gratuite long terme : installe PostgreSQL en local (pas de carte bancaire).',
    ],
    firstUseSteps: [
      'Note host, user, database après création (ou localhost en local).',
      'Connecte-toi avec Cloud Shell / DBeaver / psql.',
      'Crée une table et un `SELECT 1`.',
    ],
    taskSteps: [
      'Exécute le SQL demandé, exporte le script.',
      'Colle le SQL + 1 ligne sur comment tu t’es connecté (Cloud SQL ou local).',
    ],
    withoutAccount:
      'Préfère Postgres local ou SQLite pour pratiquer sans facturation. Le livrable reste le script SQL collé ici.',
  },
  bigquery: {
    toolId: 'bigquery',
    platformLabel: 'BigQuery (sandbox / essai GCP)',
    freePath: true,
    signupUrl: 'https://console.cloud.google.com/bigquery',
    signupLabel: 'Ouvrir BigQuery',
    accountSteps: [
      'Dans ton projet GCP, ouvre BigQuery (sandbox possible avec quotas gratuits).',
      'Crée un dataset `mutualis` (location EU).',
    ],
    firstUseSteps: [
      'Crée une table depuis CSV (Upload) ou requête sur un public dataset pour tester.',
      'Lance `SELECT current_date()` pour valider.',
      'Regarde l’onglet Job history / estimation de bytes processed.',
    ],
    taskSteps: [
      'Écris la requête BigQuery demandée (STANDARD SQL).',
      'Colle-la dans le pad ; mentionne dataset.table utilisés.',
    ],
    withoutAccount:
      'Sans GCP : écris quand même le SQL BigQuery (syntaxe STANDARD) dans le pad. Tu l’exécuteras dès le dataset créé.',
  },
  looker: {
    toolId: 'looker',
    platformLabel: 'Looker Studio (gratuit, compte Google)',
    freePath: true,
    signupUrl: 'https://lookerstudio.google.com/',
    signupLabel: 'Ouvrir Looker Studio',
    accountSteps: [
      'Connecte-toi avec un compte Google sur lookerstudio.google.com.',
      'Accepte les conditions — aucun paiement pour les rapports de base.',
    ],
    firstUseSteps: [
      'Create → Blank report.',
      'Ajoute une source (Google Sheets upload CSV, ou BigQuery si déjà branché).',
      'Pose un scorecard et un bar chart simples.',
    ],
    taskSteps: [
      'Construis la viz demandée, aligne le calcul sur ta définition KPI.',
      'Partage en « Restricted » (pas public web) et colle le lien + description dans le pad.',
    ],
    withoutAccount:
      'Sans Google : décris la viz (mesures, dimensions, filtres) et joins une maquette/screenshot locale si tu en as une.',
  },
  dbt: {
    toolId: 'dbt',
    platformLabel: 'dbt Cloud (Developer / trial) ou dbt Core local',
    freePath: true,
    signupUrl: 'https://www.getdbt.com/signup',
    signupLabel: 'Créer un compte dbt',
    accountSteps: [
      'Inscris-toi sur getdbt.com (Developer / trial selon l’offre du moment).',
      'Alternative 100 % local : `pip install dbt-core dbt-bigquery` (ou dbt-duckdb) — pas de compte SaaS.',
      'Crée un projet « mutualis » et branche une destination (BigQuery ou DuckDB).',
    ],
    firstUseSteps: [
      'Initialise le projet (`dbt init` en local, ou wizard Cloud).',
      'Crée `models/staging/stg_example.sql` avec un SELECT simple.',
      'Lance `dbt run` puis `dbt test` sur un test not_null.',
    ],
    taskSteps: [
      'Écris le modèle + tests demandés.',
      'Colle le SQL du modèle et la config YAML des tests dans le pad.',
    ],
    withoutAccount:
      'Sans dbt Cloud : installe dbt Core + DuckDB en local, ou rédige le modèle SQL + tests YAML dans le pad (le jeu valide le texte).',
  },
  airflow: {
    toolId: 'airflow',
    platformLabel: 'Astro CLI / Airflow local (Docker) ou Astronomer trial',
    freePath: true,
    signupUrl: 'https://www.astronomer.io/docs/astro/cli/install-cli',
    signupLabel: 'Doc Astro CLI (Airflow local)',
    accountSteps: [
      'Option A (recommandée débutant) : installe Docker Desktop, puis Astro CLI, `astro dev init` + `astro dev start`.',
      'Option B : compte Astronomer trial si proposé.',
      'Option C : Composer GCP (plus lourd, coûts) — évite en premier essai.',
    ],
    firstUseSteps: [
      'Ouvre l’UI Airflow locale (souvent http://localhost:8080).',
      'Repère DAGs, Graph, Logs.',
      'Active le DAG exemple et regarde un run Success/Failed.',
    ],
    taskSteps: [
      'Écris le DAG Python demandé (schedule, task, sensor ou retry).',
      'Colle le fichier DAG complet dans le pad du jeu.',
      'Décris en 2 lignes ce que tu vois dans l’UI après un run (ou « non exécuté — code seul »).',
    ],
    withoutAccount:
      'Sans Docker : rédige quand même le DAG dans le pad. Tu l’exécuteras dès qu’Airflow local tourne.',
  },
  datagalaxy: {
    toolId: 'datagalaxy',
    platformLabel: 'DataGalaxy (essai) ou simulation catalogue',
    freePath: false,
    signupUrl: 'https://www.datagalaxy.com/',
    signupLabel: 'Site DataGalaxy',
    accountSteps: [
      'Crée un compte / demande une démo DataGalaxy (catalogue & glossaire data).',
      'Sans accès immédiat : on simule le catalogue dans Confluence ou un tableur gouverné (même structure de fiche).',
    ],
    firstUseSteps: [
      'Si tu as un environnement : crée un objet / terme « Employé actif ».',
      'Renseigne définition, domaine, Owner, lien vers un asset technique.',
      'Sinon : crée une page Confluence « Catalogue Mutualis » avec les mêmes champs.',
    ],
    taskSteps: [
      'Produis la fiche (terme, définition, Owner, lien technique).',
      'Colle le contenu (ou URL DataGalaxy/Confluence) dans le pad.',
    ],
    withoutAccount:
      'Cas normal en solo : simule DataGalaxy dans Confluence Free ou un Google Sheet « glossaire » avec colonnes Terme | Définition | Owner | Table. Le jeu valide ce livrable.',
  },
  powerbi: {
    toolId: 'powerbi',
    platformLabel: 'Power BI Desktop (gratuit) + compte Microsoft',
    freePath: true,
    signupUrl: 'https://www.microsoft.com/en-us/download/details.aspx?id=58494',
    signupLabel: 'Télécharger Power BI Desktop',
    accountSteps: [
      'Crée / utilise un compte Microsoft.',
      'Installe Power BI Desktop (Windows) — gratuit pour créer des rapports.',
      'Optionnel : Power BI Service (app.powerbi.com) pour publier (licence Free limitée).',
    ],
    firstUseSteps: [
      'Ouvre Power BI Desktop → Get data → Text/CSV avec le fichier du jeu.',
      'Passe en Model view : relations, types de colonnes.',
      'Crée une page Report avec 1 carte KPI et 1 graphique.',
    ],
    taskSteps: [
      'Construis la viz demandée ; aligne la mesure sur la définition SQL/mart.',
      'Exporte un PDF/PNG ou décris le modèle + joins une capture dans le livrable fichier du jeu.',
    ],
    withoutAccount:
      'Sans Windows/Desktop : maquette la viz (mesure, filtres, grain) dans le pad + capture si tu utilises Looker Studio en remplacement temporaire.',
  },
}

export function onboardingForTool(
  tool: ToolId | undefined,
  locale: 'fr' | 'en' = 'fr',
): ToolOnboarding | undefined {
  if (!tool) return undefined
  if (locale === 'en') {
    return GUIDES_EN[tool] ?? GUIDES[tool]
  }
  return GUIDES[tool]
}

export function onboardingForTools(
  tools: ToolId[],
  locale: 'fr' | 'en' = 'fr',
): ToolOnboarding[] {
  const seen = new Set<ToolId>()
  const out: ToolOnboarding[] = []
  for (const id of tools) {
    if (seen.has(id)) continue
    seen.add(id)
    const g = onboardingForTool(id, locale)
    if (g) out.push(g)
  }
  return out
}
