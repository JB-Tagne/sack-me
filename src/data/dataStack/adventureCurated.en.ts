export interface CuratedStepEn {
  title: string
  say: string
  do: string
  how: string[]
  trap: string
  placeholder?: string
  feedbackPass: string
  feedbackFail: string
  correction: string
}

export const CURATED_STEPS_EN: Record<string, CuratedStepEn> = {
  'l0-open': {
    title: 'Python — inspect the employees schema',
    say: 'Download retail_employees.csv. In pandas, load the file and list the columns.',
    do: 'Paste a Python script that reads the CSV and prints the columns (df.columns / print).',
    how: [
      'import pandas as pd',
      'df = pd.read_csv("retail_employees.csv")',
      'print(list(df.columns)) or print(df.dtypes)',
    ],
    trap:
      'Do not just copy the header by hand: the script must read the file (read_csv). Otherwise you have automated nothing.',
    feedbackPass: 'Schema read by script — solid data eng instinct.',
    feedbackFail: 'I need a read_csv (or equivalent) plus column inspection.',
    correction:
      '```python\nimport pandas as pd\ndf = pd.read_csv("retail_employees.csv")\nprint(list(df.columns))\nprint(df.dtypes)\n```\nTypical columns: employee_id, employee_name, department, region, active_record, …',
  },
  'l0-filter': {
    title: 'Python — filter active_record = 1',
    say: 'Business only wants active records (SCD). Filter in pandas and count the rows.',
    do: 'Paste a script that filters active_record == 1 and prints len / shape.',
    how: [
      'df[df["active_record"] == 1]',
      'print(len(actifs)) — expect around 500',
      'Option: actifs["department"].value_counts()',
    ],
    trap:
      'active_record = 0 means previous record versions, not “employee left”. Do not filter on department alone.',
    feedbackPass: 'SCD filter scripted — ready for a daily job.',
    feedbackFail: 'Show the active_record filter and a count (len / shape).',
    correction:
      '```python\nimport pandas as pd\ndf = pd.read_csv("retail_employees.csv")\nactifs = df[df["active_record"] == 1]\nprint(len(actifs))  # ≈ 500\nprint(actifs["department"].value_counts())\n```',
  },
  'l0-sql': {
    title: 'SQL — first SELECT on employees',
    say: 'Same file, SQL logic: SELECT active rows, GROUP BY department.',
    do: 'Paste a SQL query (SELECT … WHERE active_record = 1 … GROUP BY department).',
    how: [
      'Imagine a retail_employees table loaded from the CSV.',
      'COUNT(*) GROUP BY department WHERE active_record = 1.',
    ],
    trap:
      'Forgetting WHERE active_record = 1 mixes history and current — headcount explodes.',
    feedbackPass: 'Same business logic in SQL — you compare both paradigms.',
    feedbackFail: 'I need SELECT + WHERE active_record + GROUP BY department.',
    correction:
      '```sql\nSELECT department, COUNT(*) AS n\nFROM retail_employees\nWHERE active_record = 1\nGROUP BY department\nORDER BY n DESC;\n```',
  },
  'l1-dupes': {
    title: 'SQL — CRM email duplicates',
    say: 'clients_doublons.csv overstates unique customers. Detect duplicate emails.',
    do: 'Paste a query GROUP BY email + HAVING COUNT(*) > 1 (with LOWER/TRIM).',
    how: [
      'LOWER(TRIM(email))',
      'GROUP BY 1 HAVING COUNT(*) > 1',
      'Ignore empty / unknown emails',
    ],
    trap:
      'Company names are not spelled consistently — do not rely on name alone without LOWER/TRIM on email.',
    feedbackPass: 'CRM quality handled like a real project.',
    feedbackFail: 'I need GROUP BY email + HAVING COUNT(*) > 1 (+ LOWER/TRIM ideally).',
    correction:
      "```sql\nSELECT LOWER(TRIM(email)) AS email_n, COUNT(*) AS c\nFROM clients_doublons\nWHERE NULLIF(LOWER(TRIM(email)), '') IS NOT NULL\n  AND LOWER(TRIM(email)) <> 'unknown'\nGROUP BY 1\nHAVING COUNT(*) > 1;\n```",
  },
  'l1-join': {
    title: 'SQL — delivered revenue joined to the reference',
    say: 'With ventes_semaine + clients_ref, compute excl.-tax revenue for delivered orders by customer segment.',
    do: "Paste a JOIN + SUM query with filter statut = 'livree'.",
    how: [
      'JOIN clients_ref ON client_id',
      "WHERE statut = 'livree'",
      'GROUP BY segment (or store)',
    ],
    trap:
      "Orders with statut = 'annulee' must not enter revenue. Also check join type (INNER vs LEFT).",
    feedbackPass: 'Business join + aggregate — core of data work.',
    feedbackFail: 'I need a JOIN, a SUM(montant_ht), and the livree filter.',
    correction:
      "```sql\nSELECT c.segment, SUM(v.montant_ht) AS ca_ht\nFROM ventes_semaine v\nJOIN clients_ref c ON v.client_id = c.client_id\nWHERE v.statut = 'livree'\nGROUP BY c.segment\nORDER BY ca_ht DESC;\n```",
  },
  'l1-py-clean': {
    title: 'Python — pandas deduplication',
    say: 'Reproduce the CRM cleanup in Python: normalize email and drop_duplicates.',
    do: 'Paste a pandas script (str.lower/strip + drop_duplicates).',
    how: [
      'df["email_n"] = df["email"].str.lower().str.strip()',
      'df.drop_duplicates(subset=["email_n"])',
      'Compare len before / after',
    ],
    trap:
      'drop_duplicates without normalization lets “A@x.com” and “a@x.com” through as two customers.',
    feedbackPass: 'Same business rule in Python — you can industrialize both.',
    feedbackFail: 'Show email normalization + drop_duplicates (or groupby).',
    correction:
      '```python\nimport pandas as pd\ndf = pd.read_csv("clients_doublons.csv")\ndf["email_n"] = df["email"].astype(str).str.lower().str.strip()\nclean = df.drop_duplicates(subset=["email_n"])\nprint(len(df), "→", len(clean))\n```',
  },
  'l2-sql': {
    title: 'SQL GROUP BY — apartments',
    say: 'Property transactions: COUNT and AVG(valeur_fonciere) by Commune.',
    do: 'Paste your SQL query (GROUP BY Commune).',
    how: [
      'COUNT(*) and AVG(valeur_fonciere) GROUP BY Commune',
      'ORDER BY nb DESC — LIMIT to test',
    ],
    trap:
      'Some columns have spaces (“Date mutation”): quote them. Carrez surface area may use a French comma decimal.',
    feedbackPass: 'SQL aggregation grounded in a real business dataset.',
    feedbackFail: 'I need SELECT + GROUP BY (Commune) and a COUNT/AVG aggregate.',
    correction:
      '```sql\nSELECT Commune,\n       COUNT(*) AS nb_mutations,\n       AVG(valeur_fonciere) AS vf_moyenne\nFROM appartements_nord_pdc\nGROUP BY Commune\nORDER BY nb_mutations DESC;\n```',
  },
  'l2-capteur': {
    title: 'SQL — sensor days under threshold',
    say: 'capteur_a_retail: days where visiteurs_count < threshold_twenty_pct.',
    do: 'Paste a SQL query filtering on threshold_twenty_pct.',
    how: [
      'WHERE visiteurs_count < threshold_twenty_pct',
      'SELECT date, visiteurs_count, threshold_twenty_pct',
    ],
    trap:
      'Do not invent “20%” by hand: use the threshold_twenty_pct column row by row.',
    feedbackPass: 'Ops signal read in SQL — ready for alerting.',
    feedbackFail: 'Filter visiteurs vs threshold_twenty_pct (or dates 2023-08-14 / 17).',
    correction:
      '```sql\nSELECT date, visiteurs_count, threshold_twenty_pct\nFROM capteur_a_retail\nWHERE visiteurs_count < threshold_twenty_pct;\n```\nTypical days: 2023-08-14 and 2023-08-17.',
  },
  'l2-foot': {
    title: 'SQL — CASE WHEN / HomeTeam',
    say: 'football_season_1011: matches and home wins (FTR = H) by HomeTeam.',
    do: "Paste a query with GROUP BY HomeTeam and CASE WHEN FTR = 'H'.",
    how: [
      "SUM(CASE WHEN FTR = 'H' THEN 1 ELSE 0 END)",
      "WHERE Div = 'F1' optional",
    ],
    trap: 'Dates are DD/MM/YY — do not parse them as MM/DD/YYYY.',
    feedbackPass: 'CASE + aggregate — KPI mart pattern.',
    feedbackFail: 'GROUP BY HomeTeam + CASE on FTR = H.',
    correction:
      "```sql\nSELECT HomeTeam,\n       COUNT(*) AS nb_matchs,\n       SUM(CASE WHEN FTR = 'H' THEN 1 ELSE 0 END) AS victoires_domicile\nFROM football_season_1011\nWHERE Div = 'F1'\nGROUP BY HomeTeam\nORDER BY victoires_domicile DESC;\n```",
  },
  'l2-window': {
    title: 'SQL — window over retail turnover',
    say: 'On weights_turnover_sample: rankings / running total by store (window).',
    do: 'Paste a query with OVER (PARTITION BY … ORDER BY …) — RANK or SUM.',
    how: [
      'PARTITION BY store_name',
      'SUM(turnover_weight) OVER (...) or RANK()',
    ],
    trap:
      'Without PARTITION BY store_name, you rank all stores together — the business ranking no longer makes sense.',
    feedbackPass: 'Window functions — senior SQL data level.',
    feedbackFail: 'I need an OVER (… PARTITION BY …) clause.',
    correction:
      '```sql\nSELECT store_name, quarterhour, turnover_weight,\n       SUM(turnover_weight) OVER (\n         PARTITION BY store_name ORDER BY quarterhour\n       ) AS running_weight,\n       RANK() OVER (\n         PARTITION BY store_name ORDER BY turnover_weight DESC\n       ) AS rnk\nFROM weights_turnover_sample;\n```',
  },
  'l3-json': {
    title: 'Python — parse drill_machine.json',
    say: 'Extract machine_id, status, and location.region via json.load.',
    do: 'Paste a complete Python script (open + json.load + print the 3 fields).',
    how: [
      'import json',
      'data["machine_id"], data["status"], data["location"]["region"]',
    ],
    trap: 'region is nested under location — data["region"] raises a KeyError.',
    feedbackPass: 'JSON parsing OK — basic Python skill in a project.',
    feedbackFail: 'Script with json.load + access to machine_id / status / location.region.',
    correction:
      '```python\nimport json\nwith open("drill_machine.json", encoding="utf-8") as f:\n    data = json.load(f)\nprint(data["machine_id"], data["status"], data["location"]["region"])\n```\n→ DM-2 · Under Maintenance · San Juan Basin',
  },
  'l3-py': {
    title: 'Python — active employees ETL',
    say: 'Pipeline: read_csv → filter active_record == 1 → to_csv.',
    do: 'Paste the full pandas script (read, filter, write).',
    how: [
      'actifs = df[df["active_record"] == 1]',
      'actifs.to_csv("employees_actifs.csv", index=False)',
    ],
    trap:
      'Some OFFICE rows have an empty region — a groupby region without fillna creates a misleading bucket.',
    feedbackPass: 'Industrializable pandas ETL.',
    feedbackFail: 'Show read_csv + active_record filter + to_csv.',
    correction:
      '```python\nimport pandas as pd\ndf = pd.read_csv("retail_employees.csv")\nactifs = df[df["active_record"] == 1]\nactifs.to_csv("employees_actifs.csv", index=False)\n```',
  },
  'l3-py-merge': {
    title: 'Python — merge sales × customers',
    say: 'In pandas, join ventes_semaine and clients_ref, filter livree, aggregate revenue.',
    do: 'Paste a merge + groupby + sum script.',
    how: [
      'pd.merge(..., on="client_id")',
      "query statut == 'livree'",
      'groupby("segment" or "magasin")["montant_ht"].sum()',
    ],
    trap:
      'A merge without validating keys (dtypes / whitespace) silently produces NaNs on revenue.',
    feedbackPass: 'Pandas join — mirror of SQL JOIN.',
    feedbackFail: 'I need merge + livree filter + sum aggregation.',
    correction:
      '```python\nimport pandas as pd\nv = pd.read_csv("ventes_semaine.csv")\nc = pd.read_csv("clients_ref.csv")\nm = v.merge(c, on="client_id", how="inner")\nca = (\n    m[m["statut"] == "livree"]\n    .groupby("segment")["montant_ht"]\n    .sum()\n    .sort_values(ascending=False)\n)\nprint(ca)\n```',
  },
  'l3-dbt': {
    title: 'dbt SQL — staging → mart',
    say: 'Define stg_ + mart_ for active employees + a unique/not_null test.',
    do: 'Paste the dbt SQL (stg_… / mart_…) and the tests.',
    how: [
      'stg_spark__retail_employees',
      'mart_employees_actifs WHERE active_record = 1',
      'unique + not_null tests on employee_id (mart)',
    ],
    trap:
      'unique(employee_id) on raw staging fails (SCD versions). Put the test on the filtered mart.',
    feedbackPass: 'dbt layers in place — versioned transformation.',
    feedbackFail: 'Cite stg_ + mart_ and a unique / not_null test.',
    correction:
      "```sql\n-- stg_spark__retail_employees.sql\nSELECT * FROM {{ source('spark', 'retail_employees') }};\n\n-- mart_employees_actifs.sql\nSELECT * FROM {{ ref('stg_spark__retail_employees') }}\nWHERE active_record = 1;\n```\nYAML tests: not_null + unique on mart employee_id.",
  },
  'l4-kpi-sql': {
    title: 'SQL — revenue intensity KPI query',
    say: 'Define the “revenue intensity” KPI as a query: SUM(turnover_weight) by store / day.',
    do: 'Paste the reference SQL query (GROUP BY store_name, optional date).',
    how: [
      'SUM(turnover_weight) GROUP BY store_name',
      'Document the grain in a SQL comment',
    ],
    trap:
      'Without stating the grain (store / day / slot), two teams will compare wrong totals.',
    feedbackPass: 'KPI = versionable query — foundation of governance.',
    feedbackFail: 'I need SUM(turnover_weight) + GROUP BY store.',
    correction:
      '```sql\n-- Grain: store (sample) — document owner Retail\nSELECT store_name,\n       SUM(turnover_weight) AS intensite_ca\nFROM weights_turnover_sample\nGROUP BY store_name\nORDER BY intensite_ca DESC;\n```',
  },
  'l4-grain': {
    title: 'Python — align sensor × revenue grains',
    say: 'capteur = 1 row/day (global); weights = store×slot. Aggregate weights by store before any join — no shared date key.',
    do: 'Paste a Python script that aggregates weights by store_name and documents why you must not blindly merge with capteur.',
    how: [
      'weights.groupby("store_name")["turnover_weight"].sum()',
      'capteur has no store → no 1:1 merge',
      'intensity ratio by store (without dividing by missing store visitors)',
    ],
    trap:
      'Joining without aggregating multiplies rows (slots × day) and corrupts totals.',
    feedbackPass: 'You reason about grain before the dashboard — essential.',
    feedbackFail: 'Show an aggregation by store and explain the missing shared key with capteur.',
    correction:
      '```python\nimport pandas as pd\ncap = pd.read_csv("capteur_a_retail.csv")\nw = pd.read_csv("weights_turnover_sample.csv")\nby_store = w.groupby("store_name", as_index=False)["turnover_weight"].sum()\n# capteur = global daily traffic (no store_name) — no direct merge\nprint(by_store.head())\nprint(cap[["date", "visiteurs_count"]].head())\n```',
  },
  'l4-pbi': {
    title: 'BI measure (after SQL truth)',
    say: 'Only now: propose the DAX/equivalent measure aligned with your KPI query, with optional screenshot.',
    do: 'Paste the measure (SUM…) and attach a screenshot if you have Power BI / Looker / Sheets.',
    how: [
      'Measure = SUM(turnover_weight) — same grain as the query',
      'Visual capture by store_name (optional file)',
    ],
    trap:
      'A pretty Power BI card that does not match the reference SQL query has no value in a steering committee.',
    feedbackPass: 'BI wired to a SQL definition — right order.',
    feedbackFail: 'At least write the SUM(turnover_weight) measure (screenshot is a bonus).',
    correction:
      'Revenue intensity = SUM(weights[turnover_weight]) — must match the l4-kpi-sql query.',
  },
  'l5-af': {
    title: 'Python — Airflow DAG skeleton',
    say: 'The sensor CSV lands every morning. Sketch the DAG: sensor → transform → notify.',
    do: 'Paste a Python DAG skeleton (with DAG / chained tasks).',
    how: [
      'schedule_interval / morning timetable',
      'FileSensor path …/dt={{ ds }}/capteur_a_retail.csv',
      'retries = 2',
    ],
    trap:
      'The FileSensor path must match the landing file (dt={{ ds }}) — a typo = stuck DAG.',
    feedbackPass: 'Ops industrialized in code.',
    feedbackFail: 'Show DAG + sensor → processing (+ schedule / retries).',
    correction:
      '```python\nfrom airflow import DAG\nfrom airflow.sensors.filesystem import FileSensor\nfrom airflow.operators.bash import BashOperator\nwith DAG("mutualis_capteur", schedule="0 6 * * *", catchup=False) as dag:\n    sensor = FileSensor(task_id="wait_landing", filepath="/landing/capteur/dt={{ ds }}/capteur_a_retail.csv", retries=2)\n    transform = BashOperator(task_id="transform", bash_command="python transform_capteur.py {{ ds }}")\n    sensor >> transform\n```',
  },
  'l5-transform': {
    title: 'SQL/Python — transform task',
    say: 'The task called by the DAG: filter days under threshold (SQL) OR equivalent pandas.',
    do: 'Paste the SQL or Python script the task runs.',
    how: [
      'SQL: WHERE visiteurs_count < threshold_twenty_pct',
      'or pandas: df.query(...) then to_csv / to_gbq',
    ],
    trap:
      'A task without a date argument (ds) always reloads “today” and breaks backfills.',
    feedbackPass: 'Versionable transform — the heart of the DAG.',
    feedbackFail: 'Paste the threshold filter in SQL or the pandas pipeline.',
    correction:
      "```sql\nSELECT *\nFROM capteur_a_retail\nWHERE visiteurs_count < threshold_twenty_pct\n  AND date = DATE '{{ ds }}';\n```\nor pandas equivalent with sys.argv / ds.",
  },
  'l5-cap': {
    title: 'Python — pipeline runbook in a docstring',
    say: 'Executable summary: a Python module whose docstring describes the 6 Mutualis pipeline steps (with datasets).',
    do: 'Paste a .py file with a docstring + optionally a main() that lists the steps.',
    how: [
      'Docstring: discovery → SQL quality → Python ETL → dbt → KPI SQL → Airflow',
      'Cite retail_employees, capteur, weights, ventes…',
    ],
    trap: 'A tool list without associated scripts is not an ops runbook.',
    feedbackPass: 'End-to-end vision anchored in code.',
    feedbackFail: 'Docstring / script citing at least SQL, Python, dbt, or Airflow.',
    correction:
      '```python\n"""Mutualis pipeline\n1. pandas discovery retail_employees\n2. SQL quality CRM duplicates\n3. Python ETL ventes×clients\n4. dbt stg→mart\n5. KPI SQL revenue intensity\n6. Airflow sensor capteur\n"""\ndef main():\n    steps = ["sql", "python", "dbt", "airflow"]\n    print(" → ".join(steps))\n\nif __name__ == "__main__":\n    main()\n```',
  },
}

export interface CuratedLevelEn {
  title: string
  intro: string
  brief: {
    projectName: string
    context: string
    problem: string
    objectives: string[]
    consigne: string
  }
}

export const CURATED_LEVELS_EN: Record<number, CuratedLevelEn> = {
  0: {
    title: 'Foundations — SQL & Python on files',
    intro: 'Day one: you work the sources in scripts, not with the mouse.',
    brief: {
      projectName: 'Mutualis Retail — discovery scripts',
      context:
        'You join the Mutualis data team. Game goal: master SQL / Python / Spark (Databricks) and the GCP stack, plus delivery & governance.',
      problem:
        'Without reproducible scripts or orchestration, every analyst clicks in their own personal file — zero industrialization.',
      objectives: [
        'Read a CSV in pandas and inspect the schema.',
        'Filter active employees in Python (SCD).',
        'Write a first exploratory SELECT SQL.',
      ],
      consigne:
        'Download the file, write the notebook script, then also answer the data governance question. One task at a time.',
    },
  },
  1: {
    title: 'Quality & joins — SQL / Python',
    intro: 'Before the mart: CRM quality and reliable joins.',
    brief: {
      projectName: 'Mutualis Retail — cleanup & joins',
      context:
        'Dirty CRM and weekly sales must be hardened in scripts. We lock the logic before dbt / BI.',
      problem:
        'Duplicate emails and poorly cleaned joins distort revenue and customer headcount.',
      objectives: [
        'Detect email duplicates in SQL.',
        'Join sales ↔ customers in SQL.',
        'Clean / dedupe in Python (pandas).',
      ],
      consigne:
        'Download the indicated CSVs. Paste the SQL/Python and answer the governance question (owner, MDM, grain…).',
    },
  },
  2: {
    title: 'Advanced SQL — aggregates & windows',
    intro: 'Exploration queries on the project business datasets.',
    brief: {
      projectName: 'Mutualis — SQL on project datasets',
      context:
        'Apartments, retail sensor, football: you consolidate SQL patterns (GROUP BY, filters, CASE).',
      problem:
        'Without standard queries, every analyst recalculates their own way — KPIs are not auditable.',
      objectives: [
        'Real-estate aggregation by municipality.',
        'Days under threshold on the sensor.',
        'CASE / sports aggregates (same move as a retail mart).',
      ],
      consigne: 'Download the CSV, write the full SQL query, paste it in the notebook.',
    },
  },
  3: {
    title: 'Python ETL & dbt SQL',
    intro: 'Transform: JSON, pandas, dbt models.',
    brief: {
      projectName: 'Mutualis — Python & dbt',
      context:
        'Machine JSON, employee SCD, staging→mart models: you industrialize transformation in code.',
      problem:
        'Without JSON parsing, SCD filter, or dbt layers, the mart mixes history and active.',
      objectives: [
        'Parse the machine JSON in Python.',
        'pandas pipeline CSV → clean → export.',
        'Write stg_ / mart_ in dbt SQL + tests.',
      ],
      consigne: 'Complete scripts only — no text summaries.',
    },
  },
  4: {
    title: 'KPI in code — SQL metrics & Python grain',
    intro: 'Governance and BI start with executable definitions.',
    brief: {
      projectName: 'Mutualis — certified metrics in scripts',
      context:
        'Before Power BI / DataGalaxy, you code the KPI definition and grain alignment.',
      problem:
        'Without a reference query, two dashboards compare incomparable “revenue intensities”.',
      objectives: [
        'Write the reference KPI query (SQL).',
        'Cross footfall × intensity in SQL or Python.',
        'Sketch a measure (SQL/DAX comment) — optional screenshot.',
      ],
      consigne:
        'Code first. A BI screenshot is only useful after the source-of-truth query.',
    },
  },
  5: {
    title: 'Ops in code — DAG & jobs',
    intro: 'The pipeline runs: Airflow + Python/SQL jobs.',
    brief: {
      projectName: 'Mutualis — scripted orchestration',
      context:
        'Every morning: landing sensor → SQL/Python transform → publish. You code the ops.',
      problem:
        'Without a sensor or retries, a late CSV makes you miss the COMEX.',
      objectives: [
        'Write an Airflow DAG skeleton in Python.',
        'Sketch the transform task (SQL or pandas).',
        'Document the runbook in code comments.',
      ],
      consigne: 'Deliverables = scripts. Non-code tools stay secondary.',
    },
  },
}

export function curatedStepEn(id: string): CuratedStepEn | undefined {
  return CURATED_STEPS_EN[id]
}

export function curatedLevelEn(id: number): CuratedLevelEn | undefined {
  return CURATED_LEVELS_EN[id]
}
