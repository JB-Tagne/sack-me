/** English beginner onboarding guides for PM Game stack tools. */

import type { ToolOnboarding } from './toolOnboarding'
import type { ToolId } from './tools'

export const GUIDES_EN: Record<ToolId, ToolOnboarding> = {
  jira: {
    toolId: 'jira',
    platformLabel: 'Atlassian Jira (Cloud Free)',
    freePath: true,
    signupUrl: 'https://www.atlassian.com/software/jira/free',
    signupLabel: 'Create a Jira Free site',
    accountSteps: [
      'Open Atlassian Jira Free and click “Try it free” / “Get it free”.',
      'Create an Atlassian account (email) or sign in with Google.',
      'Choose a site name (e.g. mutualis-yourname) and the Free plan.',
      'Create a Kanban or Scrum project named Mutualis Retail.',
    ],
    firstUseSteps: [
      'Open the board (Board / Backlog).',
      'Create an Epic “Mutualis data batch” then 2–3 Stories.',
      'Fill Summary, Description, Acceptance Criteria on one Story.',
      'Move a card To Do → In Progress → Done to see the flow.',
    ],
    taskSteps: [
      'Create the ticket required by the brief (Epic/Story) with testable AC.',
      'Paste the ticket URL or a text export (key + title + AC) into the game deliverable.',
      'Note the Confluence link if you also document (otherwise leave blank).',
    ],
    withoutAccount:
      'No account yet: still write the Story in text form (Title / AC / DoD) in the game pad — create the Jira ticket once Free is ready.',
  },
  confluence: {
    toolId: 'confluence',
    platformLabel: 'Atlassian Confluence (Cloud Free)',
    freePath: true,
    signupUrl: 'https://www.atlassian.com/software/confluence/free',
    signupLabel: 'Create Confluence Free',
    accountSteps: [
      'If you already have Jira Free, add Confluence from your Atlassian site (Apps).',
      'Otherwise sign up for Confluence Free with the same Atlassian email.',
      'Create a “Mutualis Data” space (Team or Documentation).',
    ],
    firstUseSteps: [
      'Create a page “ADR — KPI definition” from a blank template.',
      'Add H1/H2 headings, an Owner / Steward table, a link to a Jira ticket.',
      'Publish the page and copy the URL.',
    ],
    taskSteps: [
      'Write the requested page (ADR, runbook or short glossary).',
      'Paste the Confluence URL + an excerpt (definition + Owner) into the deliverable.',
    ],
    withoutAccount:
      'No account yet: write the page in Markdown in the pad (headings, Owner, definition). You will move it to Confluence once the space exists.',
  },
  sql: {
    toolId: 'sql',
    platformLabel: 'Databricks Free Edition (SQL) or local SQL editor',
    freePath: true,
    signupUrl: 'https://login.databricks.com/signup?provider=DB_FREE_TIER',
    signupLabel: 'Create Databricks Free Edition',
    accountSteps: [
      'Go to Databricks Free Edition sign-up (Community Edition is retired).',
      'Sign up with email or SSO (Google/Microsoft) — no credit card for Free Edition.',
      'Wait for the workspace, then sign in.',
    ],
    firstUseSteps: [
      'In the workspace: New → Notebook (SQL) or SQL Editor.',
      'Upload the game CSV (Catalog / Volume / Upload) or load data into a temp table.',
      'Run `SELECT * FROM … LIMIT 10` to confirm you see rows.',
    ],
    taskSteps: [
      'Write and run the requested query in Databricks (or SQLite/DBeaver locally).',
      'When the result is correct, paste the SQL into the game pad.',
      'Comment the grain and a COUNT check if the brief asks for it.',
    ],
    withoutAccount:
      'No Databricks yet: install VS Code + SQL extension, or use https://sqliteonline.com — download the game CSV, write the query, paste it here.',
  },
  python: {
    toolId: 'python',
    platformLabel: 'Databricks Free Edition (Python) or local Python',
    freePath: true,
    signupUrl: 'https://login.databricks.com/signup?provider=DB_FREE_TIER',
    signupLabel: 'Create Databricks Free Edition',
    accountSteps: [
      'Create a Databricks Free Edition account (reuse the SQL one if already done).',
      'Open New → Notebook, language Python.',
    ],
    firstUseSteps: [
      'In a cell: `print("hello")` then Run to verify execution.',
      'Upload the game CSV or use spark.read.csv / pandas as required.',
      'Learn Run All / Clear state.',
    ],
    taskSteps: [
      'Code the requested script (read → transform → check).',
      'Run it until you get the expected result.',
      'Paste the full Python code into the game pad.',
    ],
    withoutAccount:
      'No Databricks: install Python 3 + pandas (`pip install pandas`) or Google Colab. Then paste the script here.',
  },
  spark: {
    toolId: 'spark',
    platformLabel: 'Databricks Free Edition (PySpark)',
    freePath: true,
    signupUrl: 'https://login.databricks.com/signup?provider=DB_FREE_TIER',
    signupLabel: 'Create Databricks Free Edition',
    accountSteps: [
      'Sign up for Databricks Free Edition if not already done.',
      'Create a Python notebook — the runtime provides Spark.',
    ],
    firstUseSteps: [
      'Check Spark: `spark.version` in a cell.',
      'Load a small CSV into a DataFrame: `spark.read.option("header", True).csv(...)`.',
      'Use `.show()` and `.printSchema()` to inspect.',
    ],
    taskSteps: [
      'Implement the Spark transforms (filter, groupBy, join…).',
      'Verify with `.show()` / count.',
      'Paste the PySpark code into the game pad.',
    ],
    withoutAccount:
      'No cloud account: write PySpark in the pad (the game validates the text). Free Edition is the easiest path to run it later.',
  },
  databricks: {
    toolId: 'databricks',
    platformLabel: 'Databricks Free Edition',
    freePath: true,
    signupUrl: 'https://login.databricks.com/signup?provider=DB_FREE_TIER',
    signupLabel: 'Create Databricks Free Edition',
    accountSteps: [
      'Sign up for Databricks Free Edition.',
      'Confirm your email and open the provided workspace.',
      'Browse Workspace, Catalog, Jobs (as available on Free Edition).',
    ],
    firstUseSteps: [
      'Create a Mutualis folder in Workspace.',
      'Create one SQL and one Python notebook on the same sample dataset.',
      'If Jobs is available: schedule a simple notebook run.',
    ],
    taskSteps: [
      'Perform the requested action (notebook, job, Delta / catalog as briefed).',
      'Document in 3 lines what you clicked + paste code / config into the pad.',
    ],
    withoutAccount:
      'The game accepts a text deliverable describing the flow (optional screenshots). Create Free Edition as soon as you can for real practice.',
  },
  gcs: {
    toolId: 'gcs',
    platformLabel: 'Google Cloud Storage (GCP trial)',
    freePath: true,
    signupUrl: 'https://console.cloud.google.com/freetrial',
    signupLabel: 'Open Google Cloud (trial / Free Tier)',
    accountSteps: [
      'Create a Google account if needed, then open Google Cloud Console.',
      'Start the free trial (card often required; watch billing).',
      'Create a project “mutualis-data-yourname”.',
      'Enable the Cloud Storage API.',
    ],
    firstUseSteps: [
      'Storage → Buckets → Create (EU region, unique name).',
      'Create prefix `landing/dt=YYYY-MM-DD/`.',
      'Upload a small test CSV and check permissions (not public).',
    ],
    taskSteps: [
      'Reproduce the path / upload from the brief.',
      'In the deliverable: gs://… path + classification + who has access.',
    ],
    withoutAccount:
      'No GCP yet: simulate the path (`gs://mutualis-landing/dt=2026-07-24/file.csv`) and describe IAM/retention in the pad.',
  },
  cloudsql: {
    toolId: 'cloudsql',
    platformLabel: 'Google Cloud SQL (or local Postgres)',
    freePath: true,
    signupUrl: 'https://console.cloud.google.com/sql',
    signupLabel: 'Cloud SQL console',
    accountSteps: [
      'With an active GCP project, open SQL → Create instance (Postgres, small machine).',
      'Watch costs: stop/delete the instance after the exercise if unused.',
      'Long-term free alternative: install PostgreSQL locally (no card).',
    ],
    firstUseSteps: [
      'Note host, user, database after creation (or localhost).',
      'Connect with Cloud Shell / DBeaver / psql.',
      'Create a table and run `SELECT 1`.',
    ],
    taskSteps: [
      'Run the requested SQL, export the script.',
      'Paste the SQL + one line on how you connected (Cloud SQL or local).',
    ],
    withoutAccount:
      'Prefer local Postgres or SQLite to practice without billing. The deliverable is still the SQL script pasted here.',
  },
  bigquery: {
    toolId: 'bigquery',
    platformLabel: 'BigQuery (sandbox / GCP trial)',
    freePath: true,
    signupUrl: 'https://console.cloud.google.com/bigquery',
    signupLabel: 'Open BigQuery',
    accountSteps: [
      'In your GCP project, open BigQuery (sandbox may offer free quotas).',
      'Create a `mutualis` dataset (EU location).',
    ],
    firstUseSteps: [
      'Create a table from CSV (Upload) or query a public dataset to test.',
      'Run `SELECT current_date()` to validate.',
      'Check Job history / bytes processed estimate.',
    ],
    taskSteps: [
      'Write the requested BigQuery query (STANDARD SQL).',
      'Paste it into the pad; mention dataset.table used.',
    ],
    withoutAccount:
      'No GCP yet: still write BigQuery STANDARD SQL in the pad. You will run it once the dataset exists.',
  },
  looker: {
    toolId: 'looker',
    platformLabel: 'Looker Studio (free, Google account)',
    freePath: true,
    signupUrl: 'https://lookerstudio.google.com/',
    signupLabel: 'Open Looker Studio',
    accountSteps: [
      'Sign in with a Google account on lookerstudio.google.com.',
      'Accept the terms — no payment for basic reports.',
    ],
    firstUseSteps: [
      'Create → Blank report.',
      'Add a source (Google Sheets CSV upload, or BigQuery if connected).',
      'Add a simple scorecard and bar chart.',
    ],
    taskSteps: [
      'Build the requested viz; align the calculation with your KPI definition.',
      'Share as Restricted (not public web) and paste the link + description into the pad.',
    ],
    withoutAccount:
      'No Google account: describe the viz (measures, dimensions, filters) and attach a local mock/screenshot if you have one.',
  },
  dbt: {
    toolId: 'dbt',
    platformLabel: 'dbt Cloud (Developer / trial) or local dbt Core',
    freePath: true,
    signupUrl: 'https://www.getdbt.com/signup',
    signupLabel: 'Create a dbt account',
    accountSteps: [
      'Sign up at getdbt.com (Developer / trial as offered).',
      'Fully local alternative: `pip install dbt-core dbt-bigquery` (or dbt-duckdb).',
      'Create a “mutualis” project and connect a destination (BigQuery or DuckDB).',
    ],
    firstUseSteps: [
      'Init the project (`dbt init` locally, or Cloud wizard).',
      'Create `models/staging/stg_example.sql` with a simple SELECT.',
      'Run `dbt run` then `dbt test` with a not_null test.',
    ],
    taskSteps: [
      'Write the requested model + tests.',
      'Paste the model SQL and test YAML into the pad.',
    ],
    withoutAccount:
      'No dbt Cloud: install dbt Core + DuckDB locally, or write model SQL + test YAML in the pad (the game validates the text).',
  },
  airflow: {
    toolId: 'airflow',
    platformLabel: 'Astro CLI / local Airflow (Docker) or Astronomer trial',
    freePath: true,
    signupUrl: 'https://www.astronomer.io/docs/astro/cli/install-cli',
    signupLabel: 'Astro CLI docs (local Airflow)',
    accountSteps: [
      'Option A (beginner): install Docker Desktop, then Astro CLI, `astro dev init` + `astro dev start`.',
      'Option B: Astronomer trial if available.',
      'Option C: GCP Composer (heavier, costly) — avoid for first try.',
    ],
    firstUseSteps: [
      'Open local Airflow UI (often http://localhost:8080).',
      'Find DAGs, Graph, Logs.',
      'Enable the sample DAG and watch a Success/Failed run.',
    ],
    taskSteps: [
      'Write the requested Python DAG (schedule, task, sensor or retry).',
      'Paste the full DAG file into the game pad.',
      'Describe in 2 lines what you see in the UI after a run (or “not run — code only”).',
    ],
    withoutAccount:
      'No Docker yet: still write the DAG in the pad. You will run it once local Airflow is up.',
  },
  datagalaxy: {
    toolId: 'datagalaxy',
    platformLabel: 'DataGalaxy (trial) or catalog simulation',
    freePath: false,
    signupUrl: 'https://www.datagalaxy.com/',
    signupLabel: 'DataGalaxy website',
    accountSteps: [
      'Create an account / request a DataGalaxy demo (catalog & glossary).',
      'Without immediate access: simulate the catalog in Confluence or a governed spreadsheet (same field structure).',
    ],
    firstUseSteps: [
      'If you have an environment: create an object / term “Active employee”.',
      'Fill definition, domain, Owner, link to a technical asset.',
      'Otherwise: create a Confluence page “Mutualis Catalog” with the same fields.',
    ],
    taskSteps: [
      'Produce the entry (term, definition, Owner, technical link).',
      'Paste the content (or DataGalaxy/Confluence URL) into the pad.',
    ],
    withoutAccount:
      'Normal solo path: simulate DataGalaxy in Confluence Free or a Google Sheet glossary with columns Term | Definition | Owner | Table.',
  },
  powerbi: {
    toolId: 'powerbi',
    platformLabel: 'Power BI Desktop (free) + Microsoft account',
    freePath: true,
    signupUrl: 'https://www.microsoft.com/en-us/download/details.aspx?id=58494',
    signupLabel: 'Download Power BI Desktop',
    accountSteps: [
      'Create / use a Microsoft account.',
      'Install Power BI Desktop (Windows) — free to author reports.',
      'Optional: Power BI Service (app.powerbi.com) to publish (limited Free license).',
    ],
    firstUseSteps: [
      'Open Power BI Desktop → Get data → Text/CSV with the game file.',
      'Model view: relationships, column types.',
      'Create a Report page with 1 KPI card and 1 chart.',
    ],
    taskSteps: [
      'Build the requested viz; align the measure with the SQL/mart definition.',
      'Export PDF/PNG or describe the model + attach a screenshot in the game file deliverable.',
    ],
    withoutAccount:
      'No Windows/Desktop: mock the viz (measure, filters, grain) in the pad + screenshot if you temporarily use Looker Studio.',
  },
}
