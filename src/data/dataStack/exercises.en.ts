import type { PracticeExercise } from './exercises'

export type PracticeExerciseEn = Pick<
  PracticeExercise,
  'title' | 'context' | 'description' | 'tasks' | 'steps' | 'trap' | 'questions' | 'modelSolution'
>

export const PRACTICE_EXERCISES_EN: Record<string, PracticeExerciseEn> = {
  'conf-charter-1': {
    title: 'Data product charter',
    context:
      'A mutual bank is launching a “Client 360” for advisors. The sponsor wants everything; the data team has 3 people.',
    description:
      'You structure a Confluence framing page to align business and data before any build work.',
    tasks: [
      'Write the business problem in 2–3 sentences',
      'List at most 3 success KPIs',
      'Define explicit out-of-scope items',
      'Identify product owner and data steward',
    ],
    trap:
      'Beyond 3 KPIs, the MVP dilutes: the sponsor “wants everything” and nothing is Done.',
    steps: [
      {
        title: 'Page & template',
        detail:
          'Create a page “Client 360 — Charter”. Sections: Problem, Users, KPI, Out of scope, Risks, Decisions.',
      },
      {
        title: 'Problem',
        detail:
          'Frame it as: Who is hurting? From what? Measurable impact. E.g. “Advisors open 4 systems for one client → appointment prep time ×2”.',
      },
      {
        title: 'KPIs (max 3)',
        detail:
          'Pick actionable indicators (e.g. % complete profiles, avg appointment prep time, tool NPS). Avoid vanity metrics.',
      },
      {
        title: 'Out of scope',
        detail:
          'List what is NOT in the MVP (e.g. real-time credit scoring, mobile app). That protects the deadline.',
      },
    ],
    questions: [
      {
        id: 'n1q1',
        prompt: 'Maximum recommended success KPIs in an MVP charter?',
        kind: 'mcq',
        options: ['1', '3', '10', 'As many as the sponsor wants'],
        accept: ['3'],
        explanation:
          '3 KPIs max forces prioritization. Beyond that, the MVP dilutes and you no longer know what “Done” means.',
      },
      {
        id: 'n1q2',
        prompt: 'Out-of-scope mainly serves to…',
        kind: 'mcq',
        options: [
          'Tick a quality checkbox',
          'Protect the deadline and clarify expectations',
          'List every future idea',
          'Replace the Jira backlog',
        ],
        accept: ['Protéger le délai et clarifier les attentes'],
        explanation:
          'Out-of-scope aligns the sponsor on what is not delivered in the MVP, to avoid scope creep.',
      },
      {
        id: 'n1q3',
        prompt: 'Keyword of a good problem statement (one word):',
        kind: 'short',
        accept: ['impact', 'mesurable', 'utilisateur', 'users', 'douleur', 'pain'],
        explanation:
          'A good problem cites the user and a measurable impact (time, cost, risk, quality).',
      },
    ],
    modelSolution:
      'Typical charter: Problem (advisors across multiple systems, appointment time ×2) · Users (advisors, compliance) · KPIs (prep time, % complete profiles, adoption) · Out of scope (real-time scoring, mobile) · Named product owner + data steward · Risks (CRM quality, GDPR access).',
  },

  'jira-backlog-charter-2': {
    title: 'Jira backlog — data product linked to the charter',
    context:
      'After the Client 360 charter, the data PO wants a living backlog shared with data engineers and analysts.',
    description:
      'You structure the Jira backlog (epics / stories) to track data product items.',
    tasks: [
      'Define essential fields (status, priority, KPI, owner)',
      'Propose 3 views (board / sprint / roadmap)',
      'Link each item to a charter KPI',
    ],
    trap:
      'A backlog item with no link to a charter KPI is often decorative work — outside the MVP.',
    steps: [
      {
        title: 'Structure',
        detail:
          'Epic = charter outcome. INVEST stories. Labels: KPI, phase (ingest/transform/expose), tool.',
      },
      {
        title: 'Views',
        detail:
          'Status board (flow), sprint filter, timeline/roadmap for leadership reporting.',
      },
      {
        title: 'Rule',
        detail: 'No story without a link to a charter KPI — otherwise out of MVP.',
      },
    ],
    questions: [
      {
        id: 'n2q1',
        prompt: 'Most critical property to avoid “decorative” work:',
        kind: 'mcq',
        options: ['Color', 'Linked KPI', 'Emoji', 'Cover image'],
        accept: ['KPI lié'],
        explanation:
          'If an item contributes to no charter KPI, it does not belong in the MVP.',
      },
      {
        id: 'n2q2',
        prompt: 'Name one useful view for the data daily (one word: board / table / timeline):',
        kind: 'short',
        accept: ['board', 'kanban', 'table'],
        explanation:
          'A board (or sprint table) shows the day’s flow; the timeline is better for leadership reporting.',
      },
    ],
    modelSolution:
      'Jira: Epics linked to charter KPIs · Stories with AC · Tool/phase labels · Status board + sprint filter + roadmap. Rule: no item without a charter KPI.',
  },

  'conf-adr-1': {
    title: 'ADR — BigQuery vs Cloud SQL (finance mart)',
    context:
      'The finance mart must serve 40 analysts (heavy read) and 2 operational apps (light transactional write).',
    description:
      'You write an Architecture Decision Record (ADR) to decide analytical storage.',
    tasks: [
      'Write Context, Options, Decision, Consequences',
      'Compare BigQuery and Cloud SQL for analytical load',
      'Document trade-offs (cost, latency, ops)',
    ],
    trap:
      'Choosing Cloud SQL “for everything” will saturate under 40 analysts on wide scans — separate OLTP and analytics.',
    steps: [
      {
        title: 'ADR template',
        detail:
          'Title, Status (Proposed/Accepted), Context, Options (with criteria), Decision, Consequences (+/−), Jira links.',
      },
      {
        title: 'Criteria',
        detail:
          'Scan volume, concurrent readers, €/TB cost, ACID transaction needs, team skills.',
      },
      {
        title: 'Typical decision',
        detail:
          'Wide analytics → BigQuery; OLTP / low transactional latency → Cloud SQL. Often both (OLTP → export → BQ).',
      },
    ],
    questions: [
      {
        id: 'c1q1',
        prompt: 'For 40 analysts scanning multi-year history, the best fit is:',
        kind: 'mcq',
        options: ['Cloud SQL alone', 'BigQuery (warehouse)', 'CSV on a laptop', 'Redis'],
        accept: ['BigQuery (entrepôt)'],
        explanation:
          'BigQuery is built for large-scan analytics; Cloud SQL saturates quickly under concurrent reporting.',
      },
      {
        id: 'c1q2',
        prompt: 'The 4 minimal ADR sections (comma-separated):',
        kind: 'short',
        accept: [
          'contexte, options, décision, conséquences',
          'contexte, options, decision, consequences',
        ],
        explanation:
          'Standard ADR: Context → Options → Decision → Consequences (positive and negative).',
      },
    ],
    modelSolution:
      'Typical decision: Cloud SQL = OLTP source; BigQuery = analytical mart. Consequences: + analytical performance, + scan cost to control (partition/cluster); − near-real-time latency if batch-only.',
  },

  'conf-runbook-2': {
    title: 'Incident runbook — late finance pipeline',
    context:
      'The finance DAG had 3 “late” incidents this month. Ops want an actionable Confluence runbook at 3 a.m.',
    description:
      'You write a diagnosis and remediation runbook for a late batch pipeline.',
    tasks: [
      'Define symptoms, checks, actions, escalation',
      'Include Airflow / BQ / alerting links',
      'Define an incident-end criterion',
    ],
    trap:
      'Without an ordered checklist (Airflow → GCS → BQ), on-call refactors dbt at 3 a.m. instead of rerunning the right task.',
    steps: [
      {
        title: 'Structure',
        detail:
          'Symptoms → Checks (ordered) → Immediate actions → Rollback → Escalation → Post-mortem.',
      },
      {
        title: 'Checks',
        detail:
          '1) Airflow DAG state 2) GCS file sensor 3) BQ slots/errors 4) Volume vs D-1 5) False-positive alert.',
      },
      {
        title: 'Incident done',
        detail:
          'Day D data available before business SLA + alert cleared + Jira ticket opened for root cause.',
      },
    ],
    questions: [
      {
        id: 'c2q1',
        prompt: 'First useful check when a batch is “late”:',
        kind: 'mcq',
        options: [
          'Rewrite the entire dbt model',
          'DAG state / failed task',
          'Change the business KPI',
          'Drop partitioning',
        ],
        accept: ['État du DAG / tâche en échec'],
        explanation:
          'Start by locating where it blocks (orchestrator), not by refactoring the model.',
      },
      {
        id: 'c2q2',
        prompt: 'A runbook must always include (one word):',
        kind: 'short',
        accept: ['escalade', 'rollback', 'symptômes', 'symptomes', 'checks'],
        explanation:
          'Without escalation / end criteria / ordered checks, the runbook is not operable at night.',
      },
    ],
    modelSolution:
      'Runbook: Symptoms (missed SLA) → Airflow/GCS/BQ checks → Targeted rerun or skip sensor if file OK → Escalate data eng on-call → RCA ticket. Done = data OK + alert clear.',
  },

  'jira-epic-1': {
    title: 'Split the “Customer mart” epic',
    context:
      'Jira epic: “Deliver the customer mart for the retention dashboard”. The team mixes analysis, dbt, and Power BI in one story.',
    description:
      'You split into INVEST stories with testable acceptance criteria and a shared data DoD.',
    tasks: [
      'Propose 5 testable stories',
      'Add acceptance criteria per story',
      'Define a shared data Definition of Done',
    ],
    trap:
      'A single story “deliver the whole mart” violates Small/Testable: hard to demo or reject cleanly.',
    steps: [
      {
        title: 'Vertical slice',
        detail:
          'E.g.: CRM staging → DQ tests → dim_customer model → retention mart → Power BI dataset → business UAT.',
      },
      {
        title: 'INVEST',
        detail:
          'Independent, Negotiable, Valuable, Estimable, Small, Testable. One story = one possible demo.',
      },
      {
        title: 'Data DoD',
        detail:
          'Code review, dbt tests pass, docs/lineage updated, UAT data validated, basic monitoring.',
      },
    ],
    questions: [
      {
        id: 'j1q1',
        prompt: 'A story “Build the entire customer mart” mainly violates which INVEST criterion?',
        kind: 'mcq',
        options: ['Valuable', 'Small / Testable', 'Negotiable', 'Independent'],
        accept: ['Small / Testable'],
        explanation:
          'Too large = not Small, hard to Test in one iteration.',
      },
      {
        id: 'j1q2',
        prompt: 'Acronym for user-story quality criteria:',
        kind: 'short',
        accept: ['invest'],
        explanation: 'INVEST = Independent, Negotiable, Valuable, Estimable, Small, Testable.',
      },
    ],
    modelSolution:
      '5 stories: 1) CRM staging + not_null/unique tests 2) dim_customer 3) fct_retention_daily 4) BI exposure 5) KPI UAT. DoD: green tests, docs, review, UAT sign-off.',
  },

  'jira-dod-2': {
    title: 'Data Definition of Done & dependencies',
    context:
      'Two teams (ingestion and BI) block each other. Tickets do not express dependencies.',
    description:
      'You strengthen the DoD and the Jira dependency graph to unblock the flow.',
    tasks: [
      'Write a data DoD in 5 bullets',
      'Model “blocks / is blocked by” links',
      'Propose a “Data contract” field on interface stories',
    ],
    trap:
      'Without “blocks / is blocked by” links, BI starts before the mart and everyone silently “waits for the other”.',
    steps: [
      {
        title: 'DoD',
        detail:
          'Automated tests, quality (thresholds), documentation, access rights, observability (volume/null alerts).',
      },
      {
        title: 'Dependencies',
        detail:
          'BI story “is blocked by” dbt mart; ingestion epic “blocks” exposure. Visible on the board.',
      },
      {
        title: 'Data contract',
        detail:
          'Column schema, freshness SLA, owner — attached to the inter-team interface ticket.',
      },
    ],
    questions: [
      {
        id: 'j2q1',
        prompt: 'Without a Jira dependency link, the main risk is:',
        kind: 'mcq',
        options: [
          'Too much documentation',
          'Parallel work on an unready interface',
          'Too many tests',
          'Too many KPIs',
        ],
        accept: ['Travail parallèle sur une interface non prête'],
        explanation:
          'Explicit dependencies keep BI from building on an unstable mart.',
      },
      {
        id: 'j2q2',
        prompt: 'Typical data-contract element (one word: schema / sla / owner):',
        kind: 'short',
        accept: ['schéma', 'schema', 'sla', 'owner', 'fraîcheur', 'fraicheur'],
        explanation: 'A data contract sets at least schema, freshness (SLA), and ownership.',
      },
    ],
    modelSolution:
      'DoD: tests, DQ thresholds, docs, IAM, alert. Visible Jira dependencies. Contracts on interface tickets (schema + SLA + owner).',
  },

  'sql-dupes-1': {
    title: 'Detect customer duplicates',
    context:
      'The CRM has duplicates (same email, companies spelled differently). The customer mart overcounts unique customers.',
    description:
      'You write a SQL duplicate-detection query and a duplication rate.',
    tasks: [
      'Count duplicate email groups',
      'Compute a duplication rate',
      'Handle NULL email cases',
    ],
    trap:
      'Company names are not spelled identically (“Acme Retail” vs “ACME Retail”, extra spaces) — normalize with LOWER/TRIM before concluding a name-only duplicate.',
    steps: [
      {
        title: 'Group CTE',
        detail:
          'WITH d AS (SELECT lower(trim(email)) AS e, COUNT(*) c FROM clients GROUP BY 1 HAVING COUNT(*) > 1)',
      },
      {
        title: 'Rate',
        detail:
          'Rate ≈ (SUM(c) of duplicates) / total COUNT(*) — or % of rows belonging to a group > 1.',
      },
      {
        title: 'NULL',
        detail:
          'Exclude email IS NULL from matching, or handle them separately (other rule: SIRET + name).',
      },
    ],
    questions: [
      {
        id: 's1q1',
        prompt: 'SQL clause to keep only groups with more than one row:',
        kind: 'mcq',
        options: ['WHERE COUNT(*) > 1', 'HAVING COUNT(*) > 1', 'LIMIT 2', 'ORDER BY COUNT(*)'],
        accept: ['HAVING COUNT(*) > 1'],
        explanation:
          'HAVING filters after aggregation; WHERE cannot use COUNT(*) that way.',
      },
      {
        id: 's1q2',
        prompt: 'Keyword for a reusable named subquery:',
        kind: 'short',
        accept: ['with', 'cte'],
        explanation: 'WITH … AS (…) defines a CTE (Common Table Expression).',
      },
      {
        id: 's1q3',
        prompt: 'Before matching on email, you often apply:',
        kind: 'mcq',
        options: ['LOWER + TRIM', 'MAX only', 'DROP TABLE', 'Systematic FULL OUTER JOIN'],
        accept: ['LOWER + TRIM'],
        explanation: 'Normalizing (case, spaces) avoids false “uniques”.',
      },
    ],
    modelSolution:
      `WITH norm AS (
  SELECT id, NULLIF(LOWER(TRIM(email)), '') AS email_n
  FROM clients
),
dup AS (
  SELECT email_n, COUNT(*) AS c
  FROM norm WHERE email_n IS NOT NULL
  GROUP BY 1 HAVING COUNT(*) > 1
)
SELECT
  (SELECT SUM(c) FROM dup) * 1.0 / (SELECT COUNT(*) FROM norm) AS duplicate_row_rate;`,
  },

  'sql-window-2': {
    title: 'Window function — latest status per contract',
    context:
      'Table `contract_events(contract_id, event_ts, status)`. You must expose the current status of each contract.',
    description:
      'You use a window function to deduplicate on the latest event.',
    tasks: [
      'Write a query with ROW_NUMBER() PARTITION BY contract_id',
      'Filter rn = 1',
      'Explain why ORDER BY event_ts DESC',
    ],
    trap:
      'Without ORDER BY event_ts DESC in the window, ROW_NUMBER() gives an arbitrary row — not necessarily the latest status.',
    steps: [
      {
        title: 'Partition',
        detail: 'ROW_NUMBER() OVER (PARTITION BY contract_id ORDER BY event_ts DESC) AS rn',
      },
      {
        title: 'Filter',
        detail: 'Wrap in a CTE/subquery then WHERE rn = 1.',
      },
      {
        title: 'Timestamp ties',
        detail: 'Add a tie-break key (event_id) if two events share the same ts.',
      },
    ],
    questions: [
      {
        id: 's2q1',
        prompt: 'For the “latest” event, ORDER BY event_ts must be:',
        kind: 'mcq',
        options: ['ASC', 'DESC', 'Unnecessary', 'RANDOM'],
        accept: ['DESC'],
        explanation: 'DESC puts the most recent row at rn = 1.',
      },
      {
        id: 's2q2',
        prompt: 'Name of the function that numbers rows within a partition:',
        kind: 'short',
        accept: ['row_number', 'row_number()', 'row number'],
        explanation: 'ROW_NUMBER() assigns 1..n in each PARTITION.',
      },
    ],
    modelSolution:
      `WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY contract_id ORDER BY event_ts DESC, event_id DESC
  ) AS rn
  FROM contract_events
)
SELECT * FROM ranked WHERE rn = 1;`,
  },

  'py-etl-1': {
    title: 'Script CSV → clean → Parquet',
    context:
      'Daily “landing” CSV files to clean before BigQuery load. No heavy orchestrator yet.',
    description:
      'You design an idempotent Python script: read, schema validation, Parquet write, error logs.',
    tasks: [
      'Validate expected columns',
      'Log invalid rows without crashing the whole run',
      'Write deterministic output (same input → same output)',
    ],
    trap:
      'Blind append on the same day’s file/partition creates duplicates on replay — overwrite the partition, do not append.',
    steps: [
      {
        title: 'Schema',
        detail:
          'Define EXPECTED_COLS; if missing → fail fast. Types: parse dates, coerce numerics.',
      },
      {
        title: 'Reject rows',
        detail:
          'Split valid vs reject (_rejects.csv file + counter). Do not silence errors.',
      },
      {
        title: 'Idempotence',
        detail:
          'Write under a dated/partitioned path; overwrite the day’s partition, not a blind append.',
      },
    ],
    questions: [
      {
        id: 'p1q1',
        prompt: 'Healthy behavior if a required column is missing:',
        kind: 'mcq',
        options: [
          'Ignore and continue',
          'Fail fast with a clear message',
          'Create a null column with no log',
          'Delete the source file',
        ],
        accept: ['Fail fast avec message clair'],
        explanation:
          'A broken schema is a data incident. Better fail early than load garbage.',
      },
      {
        id: 'p1q2',
        prompt: 'Word for “same input ⇒ same output / replayable”:',
        kind: 'short',
        accept: ['idempotent', 'idempotence', 'déterministe', 'deterministe'],
        explanation:
          'Idempotence / determinism: replaying the day’s job neither duplicates nor randomly alters data.',
      },
    ],
    modelSolution:
      'read_csv → validate columns → type coerce → split rejects → to_parquet(partition date) overwrite → log metrics (rows_in, rows_out, rejects).',
  },

  'py-test-2': {
    title: 'Unit tests for data (pandas)',
    context:
      'A `normalize_iban` function is used in 3 pipelines. A silent bug corrupted IBANs.',
    description:
      'You add targeted unit tests for edge cases (spaces, case, length).',
    tasks: [
      'List 4 test cases (happy path + edge)',
      'Choose asserts on expected output',
      'Decide fail vs reject for unrecoverable input',
    ],
    trap:
      'Normalizing an invalid IBAN “so it passes” corrupts 3 pipelines — better reject/raise than invent.',
    steps: [
      {
        title: 'Cases',
        detail:
          'OK; internal spaces; lowercase; too short; None/NaN; forbidden characters.',
      },
      {
        title: 'Policy',
        detail:
          'Normalizable → clean; unrecoverable → raise or reject flag per contract (do not “invent”).',
      },
      {
        title: 'CI',
        detail: 'pytest in the pipeline; block merge if data tests are red.',
      },
    ],
    questions: [
      {
        id: 'p2q1',
        prompt: 'A data unit test should mainly verify:',
        kind: 'mcq',
        options: [
          'Dashboard color',
          'Edge cases and error policy',
          'Team salary',
          'Bucket name only',
        ],
        accept: ['Des cas limites et la politique d’erreur'],
        explanation:
          'Data bugs live in edge cases and how invalid inputs are handled.',
      },
      {
        id: 'p2q2',
        prompt: 'Most common Python test framework here:',
        kind: 'short',
        accept: ['pytest'],
        explanation: 'pytest is the de facto standard for Python unit tests.',
      },
    ],
    modelSolution:
      'Tests: valid IBAN; with spaces → compacted; lower → upper; unexpected length → reject/raise; None → reject. Red CI branch = no merge.',
  },

  'gcs-layout-1': {
    title: 'landing / raw / curated layout',
    context:
      'New GCP project: daily partner files. Nobody standardized prefixes or retention.',
    description:
      'You propose a bucket/prefix layout and a lifecycle policy.',
    tasks: [
      'Define landing, raw, curated prefixes',
      'Propose retention per zone',
      'Apply least-privilege IAM',
    ],
    trap:
      'Mixing landing and curated under the same prefix without dt= makes Airflow sensors and retention impossible to industrialize.',
    steps: [
      {
        title: 'Zones',
        detail:
          'landing/ (drop as-is) → raw/ (immutable archive) → curated/ (model-ready files).',
      },
      {
        title: 'Dated prefix',
        detail: '…/dt=YYYY-MM-DD/… to partition and replay a day.',
      },
      {
        title: 'Lifecycle',
        detail:
          'Short landing (e.g. 7–14 d); long raw; curated per mart needs. Nearline/Coldline if needed.',
      },
    ],
    questions: [
      {
        id: 'g1q1',
        prompt: 'Zone where the partner file is dropped with no transformation:',
        kind: 'mcq',
        options: ['curated', 'landing', 'mart', 'serving'],
        accept: ['landing'],
        explanation: 'Landing = raw drop zone; raw archives; curated = ready to consume.',
      },
      {
        id: 'g1q2',
        prompt: 'Prefix pattern to replay a day (keyword):',
        kind: 'short',
        accept: ['dt=', 'partition', 'date', 'dt', 'yyyy-mm-dd'],
        explanation: 'A dated prefix (e.g. dt=2026-07-22/) enables targeted replay and lifecycle.',
      },
    ],
    modelSolution:
      'gs://proj-landing/partner/dt=… · gs://proj-raw/… long retention · gs://proj-curated/… IAM: landing writers ≠ BI curated readers.',
  },

  'csql-incr-1': {
    title: 'Incremental extraction (watermark)',
    context:
      'An OLTP `orders` table (updated_at) must be extracted nightly to GCS then BigQuery, without a daily full scan.',
    description:
      'You design a watermark-based incremental extract with a replay window.',
    tasks: [
      'Define the updated_at watermark',
      'Plan a lookback window (late arriving)',
      'Estimate load impact on the instance',
    ],
    trap:
      'Without a lookback window, late updates (updated_at after the watermark) never reach BigQuery.',
    steps: [
      {
        title: 'Watermark',
        detail:
          'Store last_success_ts; SELECT * WHERE updated_at >= last_success_ts - lookback.',
      },
      {
        title: 'Lookback',
        detail:
          'E.g. 2–3 days to catch late updates; merge downstream on primary key.',
      },
      {
        title: 'Load',
        detail:
          'Index on updated_at; extract off-peak; avoid massive SELECT * without a filter.',
      },
    ],
    questions: [
      {
        id: 'cs1q1',
        prompt: 'Typical column for incremental extract:',
        kind: 'mcq',
        options: ['updated_at', 'ui_color', 'pdf_filename', 'random_uuid only'],
        accept: ['updated_at'],
        explanation:
          'updated_at (or equivalent) lets you read only the delta since last success.',
      },
      {
        id: 'cs1q2',
        prompt: 'Name of the time bound stored between two runs:',
        kind: 'short',
        accept: ['watermark', 'curseur', 'cursor', 'high water mark', 'highwatermark'],
        explanation: 'The watermark (high-water mark) remembers how far extraction has progressed.',
      },
    ],
    modelSolution:
      'Watermark last_ts + 48–72h lookback → extract → dt= files → BQ merge on order_id. Index(updated_at). Monitor rows_extracted vs baseline.',
  },

  'bq-part-1': {
    title: 'Partition and cluster events',
    context:
      'Table `events` (event_date, user_id, event_name) is too expensive: queries scan the full history.',
    description:
      'You choose partitioning and clustering to cut bytes scanned.',
    tasks: [
      'Choose the partition (DAY on event_date)',
      'Choose clustering (user_id / event_name)',
      'Estimate the effect on a query filtered to 7 days',
    ],
    trap:
      'A CAST/FORMAT on the partition column in the WHERE blocks pruning → you rescan the full history.',
    steps: [
      {
        title: 'Partition',
        detail: 'PARTITION BY DATE(event_date) or a DATE column — date filter = partition prune.',
      },
      {
        title: 'Cluster',
        detail:
          'CLUSTER BY user_id, event_name to speed frequent filters/joins within a partition.',
      },
      {
        title: 'Cost',
        detail:
          'Querying 7 days over 2 years ≪ full table if the date filter is pushed correctly (no wrap that blocks prune).',
      },
    ],
    questions: [
      {
        id: 'b1q1',
        prompt: 'For time-based events, typical partition:',
        kind: 'mcq',
        options: ['DAY on event date', 'By dashboard name', 'By color', 'None'],
        accept: ['DAY sur la date d’événement'],
        explanation: 'DAY partition + date filter = prune = fewer billed bytes.',
      },
      {
        id: 'b1q2',
        prompt: 'Word for “only open useful partitions”:',
        kind: 'short',
        accept: ['prune', 'pruning', 'partition prune', 'partition pruning'],
        explanation: 'Partition pruning avoids scanning partitions outside the filter.',
      },
    ],
    modelSolution:
      'CREATE TABLE … PARTITION BY event_date CLUSTER BY user_id, event_name. Always filter event_date. Check bytes processed in Job History.',
  },

  'bq-cost-2': {
    title: 'Control query cost',
    context:
      'A Looker dashboard runs SELECT * over 3 years on every open. BQ bill is rising.',
    description:
      'You propose 3 concrete levers to cut cost without losing the business need.',
    tasks: [
      'Replace SELECT *',
      'Materialize an aggregate / summary table',
      'Restrict the default time window',
    ],
    trap:
      'SELECT * over 3 years on every Looker dashboard open explodes the bill — date filter + aggregate first.',
    steps: [
      {
        title: 'Columns',
        detail: 'Project only useful columns; avoid SELECT *.',
      },
      {
        title: 'Pre-aggregation',
        detail: 'daily_stats table refreshed by dbt; the dashboard reads the aggregate.',
      },
      {
        title: 'UI default',
        detail: 'Default date filter = last 30 days; 3 years as opt-in.',
      },
    ],
    questions: [
      {
        id: 'b2q1',
        prompt: 'Top anti-cost lever on a dashboard:',
        kind: 'mcq',
        options: [
          'SELECT * over full history',
          'Date filter + useful columns / aggregate',
          'Disable partitioning',
          'Duplicate the table 10 times',
        ],
        accept: ['Filtre date + colonnes utiles / agrégat'],
        explanation:
          'Fewer bytes scanned = lower on-demand cost (and lower latency).',
      },
      {
        id: 'b2q2',
        prompt: 'What BigQuery mainly bills in on-demand (idea):',
        kind: 'short',
        accept: ['bytes', 'données scannées', 'data scanned', 'scan', 'octets', 'tb'],
        explanation: 'On-demand model ≈ volume of data scanned (bytes processed).',
      },
    ],
    modelSolution:
      'Stop SELECT * · partition prune · dbt aggregate table · default 30d filter · monitor slots/bytes in INFORMATION_SCHEMA / Job history.',
  },

  'dbt-layers-1': {
    title: 'Staging → intermediate → mart (active_users)',
    context:
      'Need an `active_users` mart for retention. Today: unversioned ad hoc SQL.',
    description:
      'You set dbt layers, naming, tests, and minimal documentation.',
    tasks: [
      'Name staging / intermediate / mart',
      'Add unique / not_null tests on the key',
      'Document the mart model',
    ],
    trap:
      'Putting business logic directly in staging breaks the 1:1 source rule and makes tests/reuse impossible.',
    steps: [
      {
        title: 'Layers',
        detail:
          'stg_app__users (clean 1:1 source) → int_users_activity → mart_active_users (BI consume).',
      },
      {
        title: 'Tests',
        detail: 'unique + not_null on user_id in the mart; relationships if FK.',
      },
      {
        title: 'Docs',
        detail: 'description + columns in schema.yml; dbt docs generate.',
      },
    ],
    questions: [
      {
        id: 'd1q1',
        prompt: '1:1 with source, light cleaning layer:',
        kind: 'mcq',
        options: ['mart', 'staging', 'Power BI exposure', 'GCS landing'],
        accept: ['staging'],
        explanation: 'Staging = clean source mirror; mart = consumer business model.',
      },
      {
        id: 'd1q2',
        prompt: 'Two basic dbt tests on a primary key (separated by /):',
        kind: 'short',
        accept: ['unique/not_null', 'not_null/unique', 'unique / not_null'],
        explanation: 'unique and not_null are the trust foundation on a PK.',
      },
    ],
    modelSolution:
      'stg_ → int_ → fct_/dim_ or mart_ · unique/not_null tests · documented schema.yml · CI dbt build on PR.',
  },

  'dbt-tests-2': {
    title: 'Quality tests and thresholds',
    context:
      'The finance mart passed a green `dbt run` but the revenue KPI is wrong (invoice duplicates).',
    description:
      'You strengthen tests beyond simple not_null to catch business regressions.',
    tasks: [
      'Add a composite uniqueness test (invoice_id + line_id)',
      'Propose a volume test (row count vs D-1)',
      'Decide warn vs error on the threshold',
    ],
    trap:
      'A green `dbt run` guarantees nothing on the KPI: without a business uniqueness test, invoice duplicates slip through.',
    steps: [
      {
        title: 'Business uniqueness',
        detail: 'unique combination of columns — not only a technical column.',
      },
      {
        title: 'Volume',
        detail: 'dbt_utils / custom test: |rows_today - rows_yesterday| / rows_yesterday < 20%.',
      },
      {
        title: 'Severity',
        detail: 'Error blocks merge/prod; warn alerts without stopping if known noise.',
      },
    ],
    questions: [
      {
        id: 'd2q1',
        prompt: 'Does a successful `dbt run` guarantee KPI correctness?',
        kind: 'mcq',
        options: [
          'Yes always',
          'No — you need business tests/assertions',
          'Yes if SQL compiles',
          'Yes if there is no warning',
        ],
        accept: ['Non — il faut des tests/assertions métier'],
        explanation:
          'Run = models built. KPI correctness needs uniqueness tests, thresholds, reconciliations.',
      },
      {
        id: 'd2q2',
        prompt: 'Severity that must block prod on invoice duplicates:',
        kind: 'short',
        accept: ['error', 'erreur', 'fail'],
        explanation: 'Finance duplicates = error, not a cosmetic warn.',
      },
    ],
    modelSolution:
      'unique(invoice_id, line_id) error · revenue reconciliation vs source · volume warn/error per contract · mandatory CI dbt test.',
  },

  'spark-skew-1': {
    title: 'Join skew — repartition strategy',
    context:
      'A customers×transactions join times out: key “client_id = 0 / unknown” holds 40% of rows (data skew).',
    description:
      'You choose an anti-skew strategy (salting or broadcast) and justify the choice.',
    tasks: [
      'Diagnose skew (skew hint / Spark UI)',
      'Propose salting OR broadcast by table sizes',
      'Set a coherent partition count',
    ],
    trap:
      'The key “client_id = 0 / unknown” can concentrate 40% of rows — a naive join times out while the rest of the cluster looks idle.',
    steps: [
      {
        title: 'Diag',
        detail: 'Spark UI: very long tasks on few partitions; count top keys.',
      },
      {
        title: 'Broadcast',
        detail: 'If one table is small → broadcast join (avoids massive shuffle).',
      },
      {
        title: 'Salting',
        detail:
          'Otherwise: add a salt on hot keys to split the partition, then final aggregation.',
      },
    ],
    questions: [
      {
        id: 'sp1q1',
        prompt: 'If the dimension table is small, preferred strategy:',
        kind: 'mcq',
        options: [
          'Broadcast join',
          'Cartesian cross join',
          'Collect everything to the driver',
          'Disable parallelism',
        ],
        accept: ['Broadcast join'],
        explanation:
          'Broadcast avoids shuffling the large table when the small one fits in memory.',
      },
      {
        id: 'sp1q2',
        prompt: 'Technique to split an overly hot key:',
        kind: 'short',
        accept: ['salting', 'salt', 'salage', 'repartition'],
        explanation: 'Salting spreads hot keys across several partitions.',
      },
    ],
    modelSolution:
      'UI diag → if dim small: broadcast → else salt hot keys → reasonable repartition(n) → re-test runtime + shuffle bytes.',
  },

  'dbs-job-1': {
    title: 'Multi-task job: ingest → transform → DQ gate',
    context:
      'Moving from a manual notebook to an industrial Databricks Job for the transactions lake.',
    description:
      'You design a multi-task job with dependencies, cluster policy, and failure path.',
    tasks: [
      'Chain ingest → transform → DQ',
      'Block downstream if DQ fails',
      'Define cluster policy / retry',
    ],
    trap:
      'Publishing to gold when the DQ gate failed poisons all downstream dashboards — the job must stop and alert.',
    steps: [
      {
        title: 'Tasks',
        detail: 'Task A bronze ingest → B silver transform depends_on A → C DQ gate depends_on B.',
      },
      {
        title: 'DQ gate',
        detail: 'If checks fail → fail job (no gold publish) + alert.',
      },
      {
        title: 'Ops',
        detail: 'Cluster policy (cost), retries on A/B, timeout, run_if for branches.',
      },
    ],
    questions: [
      {
        id: 'db1q1',
        prompt: 'If the DQ gate fails, expected behavior is:',
        kind: 'mcq',
        options: [
          'Publish to gold anyway',
          'Stop / do not publish and alert',
          'Ignore silently',
          'Delete bronze',
        ],
        accept: ['Stopper / ne pas publier et alerter'],
        explanation: 'The DQ gate protects consumers: no rotten gold.',
      },
      {
        id: 'db1q2',
        prompt: 'Word for the “raw ingested data” lakehouse layer:',
        kind: 'short',
        accept: ['bronze', 'raw'],
        explanation: 'Medallion: Bronze (raw) → Silver → Gold.',
      },
    ],
    modelSolution:
      'Job: Bronze ingest → Silver transform → DQ task (fail = stop) → Gold. Cluster policy, retries, Slack/email alert on fail.',
  },

  'af-dag-1': {
    title: 'Daily DAG: sensor → dbt → alert',
    context:
      'Partner file expected every morning at 6 a.m. on GCS; then dbt run; alert if 8 a.m. SLA is missed.',
    description:
      'You design the DAG skeleton: schedule, sensor, dbt, retries, SLA.',
    tasks: [
      'Choose a schedule_interval',
      'Add a FileSensor (or equivalent)',
      'Configure retries + on_failure alert',
    ],
    trap:
      'Running dbt without a FileSensor on the 6 a.m. file = empty or D-1 run, then a false SLA alert at 8 a.m.',
    steps: [
      {
        title: 'Schedule',
        detail: 'E.g. 0 6 * * * (cron) or timetable; explicit timezone.',
      },
      {
        title: 'Sensor',
        detail: 'GCS sensor with timeout/poke; on failure → no downstream dbt.',
      },
      {
        title: 'Resilience',
        detail: 'retries=2, retry_delay, email/Slack on_failure, sla_miss_callback if needed.',
      },
    ],
    questions: [
      {
        id: 'a1q1',
        prompt: 'Role of the FileSensor before dbt:',
        kind: 'mcq',
        options: [
          'Replace dbt',
          'Wait for source file availability',
          'Create the dashboard',
          'Manage DataGalaxy',
        ],
        accept: ['Attendre la disponibilité du fichier source'],
        explanation: 'The sensor avoids running dbt when the file is missing.',
      },
      {
        id: 'a1q2',
        prompt: 'Airflow parameter to replay a failed task (name):',
        kind: 'short',
        accept: ['retries', 'retry'],
        explanation: 'retries (+ retry_delay) handles transient errors.',
      },
    ],
    modelSolution:
      'DAG 06:00 → GCS sensor (timeout) → dbt build → notify success. on_failure alert. Business SLA 08:00. Retries on I/O tasks.',
  },

  'col-kpi-1': {
    title: 'DataGalaxy asset card for “churn” KPI',
    context:
      'Two departments compute churn differently. EXCOM wants a certified definition.',
    description:
      'You create / complete the DataGalaxy asset for the churn KPI: definition, owner, technical link.',
    tasks: [
      'Write an unambiguous business definition',
      'Name owner and steward',
      'Link the asset to the technical model (table/column)',
    ],
    trap:
      'Two “certified” churns without the same window (30d vs 90d) and without a table link = EXCOM comparing apples to oranges.',
    steps: [
      {
        title: 'Definition',
        detail:
          'Formula, population, time window, exclusions. E.g. “% of D-90 active customers with no renewal in 30d”.',
      },
      {
        title: 'Ownership',
        detail: 'Business owner + technical steward (data).',
      },
      {
        title: 'Technical link',
        detail: 'Point to mart + column / certified report; “Certified” status after validation.',
      },
    ],
    questions: [
      {
        id: 'co1q1',
        prompt: 'Without a technical link, the DataGalaxy risk is:',
        kind: 'mcq',
        options: [
          'Orphan / non-implementable definition',
          'Too much SQL performance',
          'Too many BQ partitions',
          'None',
        ],
        accept: ['Définition orpheline / non implémentable'],
        explanation:
          'The glossary must point to the implementation, or everyone recalculates “their way”.',
      },
      {
        id: 'co1q2',
        prompt: 'Business role accountable for KPI meaning (word):',
        kind: 'short',
        accept: ['owner', 'business owner', 'propriétaire'],
        explanation: 'The business owner validates the definition; the steward manages the data lifecycle.',
      },
    ],
    modelSolution:
      'Churn KPI asset: dated definition + population + formula · Business owner · Data steward · Link mart_churn.churn_rate · Certified status after committee.',
  },

  'pbi-star-1': {
    title: 'Sales star schema + Margin % measure',
    context:
      'Business wants a sales report. Today a flat 40-column Excel export is imported as-is into Power BI.',
    description:
      'You set a star model (fact + dimensions) and a DAX margin measure.',
    tasks: [
      'Identify fact table and dimensions',
      'Set relationships (* → 1)',
      'Write the Margin % measure',
    ],
    trap:
      'Importing the flat 40-column Excel as-is creates many-to-many relationships and doubled totals — build a real star schema.',
    steps: [
      {
        title: 'Facts',
        detail: 'FactVentes: date_key, produit_key, client_key, montant_ht, coût.',
      },
      {
        title: 'Dimensions',
        detail: 'DimDate, DimProduit, DimClient — many-to-one relationships to the fact.',
      },
      {
        title: 'Measure',
        detail: 'Margin % = DIVIDE( SUM(montant_ht - coût), SUM(montant_ht) ).',
      },
    ],
    questions: [
      {
        id: 'pb1q1',
        prompt: 'In a star schema, the central measures table is:',
        kind: 'mcq',
        options: ['Dimension', 'Fact', 'DataGalaxy glossary', 'GCS bucket'],
        accept: ['Fait (fact)'],
        explanation: 'The fact table holds metrics; dimensions add context.',
      },
      {
        id: 'pb1q2',
        prompt: 'Safe DAX function for division (avoids div/0):',
        kind: 'short',
        accept: ['divide', 'divide()'],
        explanation: 'DIVIDE(num, den) handles a zero denominator cleanly.',
      },
    ],
    modelSolution:
      'FactVentes + DimDate/Produit/Client · *→1 relationships · Margin% = DIVIDE(SUM(HT-cost), SUM(HT)) · no flat Excel table.',
  },

  'looker-report-1': {
    title: 'Weekly ops report on BigQuery',
    context:
      'Ops want a simple Monday report: pipeline volume, SLA delay, top errors — without installing Power BI.',
    description:
      'You connect Looker Studio to BigQuery with a date filter and viewer sharing.',
    tasks: [
      'Connect an aggregated BQ table/view',
      'Add a period filter (week)',
      'Share in viewer mode',
    ],
    trap:
      'Pointing Looker at the raw unaggregated table rescans BigQuery on every open — prefer a pre-summarized daily view.',
    steps: [
      {
        title: 'Source',
        detail:
          'Prefer an already aggregated view/table (cost); BigQuery connector in Looker Studio.',
      },
      {
        title: 'Filter',
        detail: 'Date range control; default = rolling week.',
      },
      {
        title: 'Sharing',
        detail: 'Viewer for ops; edit limited to data owners.',
      },
    ],
    questions: [
      {
        id: 'l1q1',
        prompt: 'To limit BQ cost from Looker Studio:',
        kind: 'mcq',
        options: [
          'Point to an aggregated table/view + date filter',
          'SELECT * over 5 years on every refresh',
          'Disable filters',
          'Duplicate sources',
        ],
        accept: ['Pointer une table/vue agrégée + filtre date'],
        explanation:
          'Looker Studio triggers BQ jobs: aggregates + filters = less scan.',
      },
      {
        id: 'l1q2',
        prompt: 'Sharing mode for ops read-only:',
        kind: 'short',
        accept: ['viewer', 'lecteur', 'reader', 'view'],
        explanation: 'Viewer / reader share = consult without editing the report.',
      },
    ],
    modelSolution:
      'Source = weekly aggregated BQ view · default 7d date filter · volume/SLA/errors charts · Viewer share for ops · data owner as Editor.',
  },

  'sql-cte-3': {
    title: 'CTE — delivered revenue then top stores',
    context:
      'Mutualis wants a top 3 stores on delivered revenue (ventes_semaine) without an unreadable subquery.',
    description: 'You write a CTE that aggregates revenue, then filter the top.',
    tasks: [
      'WITH ca AS (SUM montant_ht WHERE livree GROUP BY magasin)',
      'SELECT top 3 ORDER BY ca DESC',
      'Comment the grain',
    ],
    trap: 'ORDER BY without LIMIT (or QUALIFY) returns everything — the “top” is not guaranteed for consumers.',
    steps: [
      {
        title: 'CTE',
        detail:
          "WITH ca AS (SELECT magasin, SUM(montant_ht) AS ca_ht FROM ventes WHERE statut = 'livree' GROUP BY 1)",
      },
      { title: 'Top', detail: 'SELECT * FROM ca ORDER BY ca_ht DESC LIMIT 3' },
    ],
    questions: [
      {
        id: 's3q1',
        prompt: 'SQL keyword to factor a named subquery:',
        kind: 'short',
        accept: ['with', 'cte'],
        explanation: 'WITH … AS (…) = Common Table Expression.',
      },
      {
        id: 's3q2',
        prompt: 'Filtering statut livree is done with:',
        kind: 'mcq',
        options: ['WHERE', 'HAVING only', 'ORDER BY', 'UNION'],
        accept: ['WHERE'],
        explanation: 'WHERE filters rows before aggregation; HAVING after.',
      },
    ],
    modelSolution:
      "```sql\nWITH ca AS (\n  SELECT magasin, SUM(montant_ht) AS ca_ht\n  FROM ventes_semaine\n  WHERE statut = 'livree'\n  GROUP BY magasin\n)\nSELECT * FROM ca ORDER BY ca_ht DESC LIMIT 3;\n```",
  },

  'sql-null-4': {
    title: 'NULL-safe — COALESCE / NULLIF emails',
    context: 'Mutualis CRM mixes NULL, empty strings, and “unknown”.',
    description: 'You normalize emails in SQL before deduplication.',
    tasks: [
      "NULLIF(TRIM(email), '')",
      'COALESCE / filter unknown',
      'GROUP BY normalized email',
    ],
    trap: "TRIM alone does not turn NULL into anything — and '' <> NULL in SQL.",
    steps: [
      { title: 'Normalize', detail: "LOWER(TRIM(email)) then NULLIF(..., '')" },
      {
        title: 'Exclude',
        detail: "WHERE email_n IS NOT NULL AND email_n <> 'unknown'",
      },
    ],
    questions: [
      {
        id: 's4q1',
        prompt: "NULLIF(x, '') returns NULL if x is:",
        kind: 'mcq',
        options: ['empty string', 'always NULL', '0', 'unknown'],
        accept: ['chaîne vide'],
        explanation: 'NULLIF(a,b) → NULL when a = b.',
      },
    ],
    modelSolution:
      "```sql\nSELECT LOWER(TRIM(email)) AS email_n, COUNT(*)\nFROM clients_doublons\nWHERE NULLIF(LOWER(TRIM(email)), '') IS NOT NULL\n  AND LOWER(TRIM(email)) <> 'unknown'\nGROUP BY 1\nHAVING COUNT(*) > 1;\n```",
  },

  'py-groupby-3': {
    title: 'pandas groupby — revenue by store',
    context: 'Same KPI as SQL sales, in pandas for an exploration notebook.',
    description: 'You filter statut livree then groupby magasin sum montant_ht.',
    tasks: [
      'read_csv ventes_semaine',
      'filter statut == livree',
      'groupby magasin montant_ht sum',
    ],
    trap: 'groupby without a filter includes cancellations and overstates revenue.',
    steps: [
      { title: 'Load', detail: 'pd.read_csv("ventes_semaine.csv")' },
      {
        title: 'Agg',
        detail: 'df[df.statut=="livree"].groupby("magasin")["montant_ht"].sum()',
      },
    ],
    questions: [
      {
        id: 'p3q1',
        prompt: 'pandas method to aggregate after groupby:',
        kind: 'short',
        accept: ['sum', '.sum', 'agg'],
        explanation: 'SeriesGroupBy.sum() or .agg("sum").',
      },
    ],
    modelSolution:
      '```python\nimport pandas as pd\ndf = pd.read_csv("ventes_semaine.csv")\nprint(df[df["statut"] == "livree"].groupby("magasin")["montant_ht"].sum().sort_values(ascending=False))\n```',
  },

  'py-json-normalize-4': {
    title: 'json + pandas — flatten a machine record',
    context: 'drill_machine.json arrives raw; the mart expects flat columns.',
    description:
      'You load the JSON and produce a 1-row DataFrame (machine_id, status, region).',
    tasks: [
      'json.load',
      'Build a flat dict (location.region)',
      'pd.DataFrame([row])',
    ],
    trap:
      'pd.read_json on a single object (not an array) can surprise — json.load + DataFrame is safer here.',
    steps: [
      { title: 'Parse', detail: 'data = json.load(f)' },
      {
        title: 'Flat',
        detail:
          'row = {"machine_id": data["machine_id"], "region": data["location"]["region"]}',
      },
    ],
    questions: [
      {
        id: 'p4q1',
        prompt: 'Access to the nested region:',
        kind: 'short',
        accept: ['location', '["location"]', "['location']"],
        explanation: 'data["location"]["region"].',
      },
    ],
    modelSolution:
      '```python\nimport json, pandas as pd\nwith open("drill_machine.json", encoding="utf-8") as f:\n    data = json.load(f)\nrow = {\n  "machine_id": data["machine_id"],\n  "status": data["status"],\n  "region": data["location"]["region"],\n}\nprint(pd.DataFrame([row]))\n```',
  },

  'sql-anti-join-5': {
    title: 'Anti-join — customers with no order',
    context: 'CRM has customers never present in ventes_semaine.',
    description:
      'You list client_id from the reference that are absent from sales (LEFT JOIN … IS NULL).',
    tasks: [
      'LEFT JOIN ventes ON client_id',
      'WHERE v.client_id IS NULL',
      'Count orphans',
    ],
    trap:
      'NOT IN with NULLs on the sales side can hide everything — prefer LEFT JOIN / NOT EXISTS.',
    steps: [
      {
        title: 'Join',
        detail:
          'FROM clients_ref c LEFT JOIN ventes_semaine v ON c.client_id = v.client_id',
      },
      { title: 'Filter', detail: 'WHERE v.client_id IS NULL' },
    ],
    questions: [
      {
        id: 's5q1',
        prompt: 'Common anti-join pattern:',
        kind: 'mcq',
        options: ['LEFT JOIN + IS NULL', 'INNER JOIN only', 'CROSS JOIN', 'UNION ALL'],
        accept: ['LEFT JOIN + IS NULL'],
        explanation: 'LEFT JOIN then IS NULL on the right key = absents.',
      },
    ],
    modelSolution:
      '```sql\nSELECT c.client_id, c.segment\nFROM clients_ref c\nLEFT JOIN ventes_semaine v ON c.client_id = v.client_id\nWHERE v.client_id IS NULL;\n```',
  },

  'py-assert-5': {
    title: 'Data assertions — pandas guardrails',
    context:
      'Before to_csv / mart load, you want the job to fail if quality breaks.',
    description:
      'You add assert / raise on schema, email nulls, and minimum headcount.',
    tasks: [
      'assert set(expected columns) <= set(df.columns)',
      'assert df["email"].isna().mean() < 0.05',
      'raise ValueError if len(actifs) < 100',
    ],
    trap:
      'An assert disabled with python -O disappears — in prod prefer an explicit raise ValueError.',
    steps: [
      {
        title: 'Schema',
        detail: 'required = {"email","client_id"}; assert required <= set(df.columns)',
      },
      {
        title: 'Volume',
        detail: 'if len(actifs) < 100: raise ValueError("effectif trop bas")',
      },
    ],
    questions: [
      {
        id: 'p5q1',
        prompt: 'For reliable quality control in prod, prefer:',
        kind: 'mcq',
        options: ['raise ValueError', 'print only', 'pass', 'input()'],
        accept: ['raise ValueError'],
        explanation: 'raise fails the job; print is silent to the orchestrator.',
      },
    ],
    modelSolution:
      '```python\nimport pandas as pd\ndf = pd.read_csv("clients_doublons.csv")\nrequired = {"email"}\nif not required <= set(df.columns):\n    raise ValueError("colonnes manquantes")\nif df["email"].isna().mean() > 0.2:\n    raise ValueError("trop de NULL email")\n```',
  },

  'sql-basics-filter-0': {
    title: 'SELECT / WHERE — active SALES employees',
    context:
      'Mutualis HR wants the active headcount of the SALES department from retail_employees (SCD).',
    description:
      'You write a foundation query: projection, combined filters, DISTINCT, COUNT.',
    tasks: [
      'SELECT useful columns (not SELECT *)',
      'WHERE active_record = 1 AND department = …',
      'COUNT + DISTINCT on a business key if needed',
    ],
    trap:
      'Forgetting active_record = 1 mixes history and active — headcounts explode.',
    steps: [
      {
        title: 'Filter',
        detail: "WHERE active_record = 1 AND UPPER(TRIM(department)) = 'SALES'",
      },
      {
        title: 'Count',
        detail:
          'COUNT(*) for headcount; COUNT(DISTINCT employee_id) if grain is uncertain.',
      },
    ],
    questions: [
      {
        id: 'sb0q1',
        prompt: 'To filter rows before aggregation, use:',
        kind: 'mcq',
        options: ['WHERE', 'HAVING', 'QUALIFY', 'LIMIT'],
        accept: ['WHERE'],
        explanation: 'WHERE filters rows; HAVING filters groups.',
      },
      {
        id: 'sb0q2',
        prompt: 'Keyword to remove projection duplicates:',
        kind: 'short',
        accept: ['distinct'],
        explanation: 'SELECT DISTINCT … deduplicates the projected result.',
      },
    ],
    modelSolution:
      "```sql\nSELECT employee_id, employee_name, department\nFROM retail_employees\nWHERE active_record = 1\n  AND UPPER(TRIM(department)) = 'SALES';\n-- Headcount:\nSELECT COUNT(*) AS effectif_sales\nFROM retail_employees\nWHERE active_record = 1 AND UPPER(TRIM(department)) = 'SALES';\n```",
  },

  'sql-case-having-1': {
    title: 'CASE WHEN + HAVING — average baskets',
    context:
      'EXCOM wants to classify stores: high / medium / low average HT basket on delivered sales.',
    description:
      'You aggregate, filter groups, and label with CASE WHEN.',
    tasks: [
      'AVG(montant_ht) GROUP BY magasin',
      'HAVING AVG(...) >= business threshold',
      'CASE WHEN to bucket the basket',
    ],
    trap:
      'Putting the AVG filter in WHERE fails — the aggregate lives after GROUP BY → HAVING (or a subquery).',
    steps: [
      {
        title: 'Agg',
        detail:
          "SELECT magasin, AVG(montant_ht) AS panier FROM ventes WHERE statut='livree' GROUP BY 1",
      },
      {
        title: 'Label',
        detail:
          "CASE WHEN panier >= 80 THEN 'élevé' WHEN panier >= 40 THEN 'moyen' ELSE 'bas' END",
      },
    ],
    questions: [
      {
        id: 'sc1q1',
        prompt: 'Filter on AVG(montant) after GROUP BY:',
        kind: 'mcq',
        options: ['HAVING', 'WHERE AVG', 'ORDER BY alone', 'DISTINCT'],
        accept: ['HAVING'],
        explanation: 'HAVING applies to aggregates / groups.',
      },
      {
        id: 'sc1q2',
        prompt: 'SQL expression for conditional branches in the SELECT:',
        kind: 'short',
        accept: ['case', 'case when'],
        explanation: 'CASE WHEN … THEN … ELSE … END.',
      },
    ],
    modelSolution:
      "```sql\nSELECT\n  magasin,\n  AVG(montant_ht) AS panier,\n  CASE\n    WHEN AVG(montant_ht) >= 80 THEN 'eleve'\n    WHEN AVG(montant_ht) >= 40 THEN 'moyen'\n    ELSE 'bas'\n  END AS bucket\nFROM ventes_semaine\nWHERE statut = 'livree'\nGROUP BY magasin\nHAVING AVG(montant_ht) >= 20;\n```",
  },

  'sql-joins-family-2': {
    title: 'INNER / LEFT / FULL — sales × reference',
    context:
      'You reconcile ventes_semaine with a store reference (some codes missing on one side).',
    description:
      'You pick the right join for the business question (intersection, orphans, full coverage).',
    tasks: [
      'INNER JOIN for revenue of known stores',
      'LEFT JOIN to list sales without a referenced store',
      'Explain when a FULL OUTER JOIN helps DQ',
    ],
    trap:
      'CROSS JOIN without a filter = explosive cartesian product — never “just to see”.',
    steps: [
      {
        title: 'INNER',
        detail:
          'v INNER JOIN dim_magasin m ON v.magasin = m.code → matched rows only.',
      },
      {
        title: 'LEFT',
        detail: 'v LEFT JOIN m … WHERE m.code IS NULL → orphan sales.',
      },
      {
        title: 'FULL',
        detail: 'FULL OUTER JOIN to see unmatched rows on both sides (reference DQ).',
      },
    ],
    questions: [
      {
        id: 'sj2q1',
        prompt: 'Join that keeps only keys present on both sides:',
        kind: 'mcq',
        options: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'UNION'],
        accept: ['INNER JOIN'],
        explanation: 'INNER = key intersection.',
      },
      {
        id: 'sj2q2',
        prompt: 'Dangerous join without a predicate (cartesian product):',
        kind: 'short',
        accept: ['cross', 'cross join'],
        explanation: 'CROSS JOIN multiplies all rows.',
      },
    ],
    modelSolution:
      "```sql\n-- Revenue for known stores\nSELECT m.code, SUM(v.montant_ht) AS ca\nFROM ventes_semaine v\nINNER JOIN dim_magasin m ON v.magasin = m.code\nWHERE v.statut = 'livree'\nGROUP BY 1;\n\n-- Orphan sales\nSELECT v.*\nFROM ventes_semaine v\nLEFT JOIN dim_magasin m ON v.magasin = m.code\nWHERE m.code IS NULL;\n```",
  },

  'sql-window-lag-rank-3': {
    title: 'LAG + RANK — sensor traffic evolution',
    context:
      'capteur_a_retail: you compare visiteurs_count to the previous day and rank the busiest days.',
    description:
      'You combine LAG and RANK/DENSE_RANK over a time window.',
    tasks: [
      'LAG(visiteurs_count) OVER (ORDER BY date)',
      'Delta vs D-1',
      'RANK or DENSE_RANK of days by traffic',
    ],
    trap:
      'RANK leaves gaps after ties; DENSE_RANK does not — choose based on EXCOM reporting.',
    steps: [
      {
        title: 'LAG',
        detail: 'LAG(visiteurs_count) OVER (ORDER BY date) AS prev_j',
      },
      {
        title: 'Rank',
        detail: 'DENSE_RANK() OVER (ORDER BY visiteurs_count DESC) AS rk',
      },
    ],
    questions: [
      {
        id: 'sw3q1',
        prompt: 'Window function that reads the previous row’s value:',
        kind: 'short',
        accept: ['lag', 'lag()'],
        explanation: 'LAG(expr) OVER (ORDER BY …).',
      },
      {
        id: 'sw3q2',
        prompt: 'After two tied 1sts, RANK places the next at:',
        kind: 'mcq',
        options: ['3', '2', '1', '0'],
        accept: ['3'],
        explanation: 'RANK skips: 1,1,3…; DENSE_RANK would do 1,1,2.',
      },
    ],
    modelSolution:
      '```sql\nSELECT\n  date,\n  visiteurs_count,\n  LAG(visiteurs_count) OVER (ORDER BY date) AS prev_visiteurs,\n  visiteurs_count - LAG(visiteurs_count) OVER (ORDER BY date) AS delta,\n  DENSE_RANK() OVER (ORDER BY visiteurs_count DESC) AS rk\nFROM capteur_a_retail;\n```',
  },

  'sql-rollup-4': {
    title: 'ROLLUP — store / week subtotals',
    context:
      'Finance wants a delivered-revenue extract with store subtotals and a grand total.',
    description:
      'You use ROLLUP (or GROUPING SETS) to avoid multiple UNION totals.',
    tasks: [
      'SUM(montant_ht) GROUP BY ROLLUP (magasin, semaine)',
      'Interpret NULL rows = subtotal / total',
      'Document the grain for the BI reader',
    ],
    trap:
      'Without explaining ROLLUP NULLs, business thinks stores are “empty” — document GROUPING() / labels.',
    steps: [
      {
        title: 'ROLLUP',
        detail: 'GROUP BY ROLLUP (magasin, semaine) → detail + subtotals + total.',
      },
      {
        title: 'Reading',
        detail:
          'semaine NULL + magasin not NULL = store total; both NULL = grand total.',
      },
    ],
    questions: [
      {
        id: 'sr4q1',
        prompt: 'ROLLUP mainly produces:',
        kind: 'mcq',
        options: [
          'Hierarchical subtotals',
          'Joins',
          'Indexes',
          'Triggers',
        ],
        accept: ['Des sous-totaux hiérarchiques'],
        explanation: 'ROLLUP / CUBE / GROUPING SETS = multi-level aggregates.',
      },
    ],
    modelSolution:
      "```sql\nSELECT\n  magasin,\n  semaine,\n  SUM(montant_ht) AS ca_ht\nFROM ventes_semaine\nWHERE statut = 'livree'\nGROUP BY ROLLUP (magasin, semaine)\nORDER BY magasin NULLS LAST, semaine NULLS LAST;\n```",
  },

  'py-fundamentals-0': {
    title: 'Types & f-strings — Mutualis run log',
    context:
      'You log an extract run: store, row count, duration in seconds.',
    description:
      'You handle int/float/str, variables, and a clear ops message with an f-string.',
    tasks: [
      'Mentally type nb_lignes (int) vs duree_s (float)',
      'Build a readable ops f"…" message',
      'Normalize a store label (strip / upper)',
    ],
    trap:
      'Concatenating with + and mixed types crashes (int+str) — use f-strings or explicit str().',
    steps: [
      {
        title: 'Vars',
        detail: 'magasin = " lille ".strip().upper(); n = 1204; duree = 3.5',
      },
      {
        title: 'Log',
        detail: 'print(f"[{magasin}] rows={n} duration_s={duree:.1f}")',
      },
    ],
    questions: [
      {
        id: 'pf0q1',
        prompt: 'Modern Python string-formatting syntax:',
        kind: 'short',
        accept: ['f-string', 'fstring', 'f-strings', 'f"'],
        explanation: 'f-strings (f"…{var}…") are the readable standard.',
      },
      {
        id: 'pf0q2',
        prompt: 'Type of 3.5 in Python:',
        kind: 'mcq',
        options: ['float', 'int', 'str', 'bool'],
        accept: ['float'],
        explanation: 'A literal with a decimal point is a float.',
      },
    ],
    modelSolution:
      '```python\nmagasin = " lille ".strip().upper()\nnb_lignes = 1204\nduree_s = 3.5\nprint(f"[{magasin}] rows={nb_lignes} duration_s={duree_s:.1f}")\n```',
  },

  'py-collections-1': {
    title: 'Lists & dicts — Mutualis KPI mapping',
    context:
      'The PO gives you a list of stores and a dict of revenue targets.',
    description:
      'You structure data as list/dict (and set to deduplicate).',
    tasks: [
      'Ordered list of stores in the batch',
      'Dict store → objectif_ca',
      'Set to detect a duplicate store in the list',
    ],
    trap:
      'A dict with a duplicate key silently overwrites — detect duplicates via set(len) vs len(list).',
    steps: [
      {
        title: 'Structures',
        detail: 'magasins = ["LILLE", "LYON"]; objectifs = {"LILLE": 100_000}',
      },
      {
        title: 'DQ',
        detail: 'if len(magasins) != len(set(magasins)): raise ValueError("doublon")',
      },
    ],
    questions: [
      {
        id: 'pc1q1',
        prompt: 'Ideal key → value structure for a store/target mapping:',
        kind: 'mcq',
        options: ['dict', 'tuple alone', 'guaranteed ordered set', 'int'],
        accept: ['dict'],
        explanation: 'dict = key/value association.',
      },
      {
        id: 'pc1q2',
        prompt: 'Collection without duplicates (order not historically guaranteed):',
        kind: 'short',
        accept: ['set', 'ensemble'],
        explanation: 'set deduplicates hashable elements.',
      },
    ],
    modelSolution:
      '```python\nmagasins = ["LILLE", "LYON", "LILLE"]\nif len(magasins) != len(set(magasins)):\n    raise ValueError("magasin en double")\nobjectifs = {"LILLE": 100_000, "LYON": 80_000}\nprint(objectifs.get("LILLE"))\n```',
  },

  'py-functions-hints-2': {
    title: 'Functions + type hints — normalize_email',
    context:
      'Three Mutualis notebooks copy the same email normalization. You industrialize it.',
    description:
      'You create a typed, reusable function with a NULL / empty policy.',
    tasks: [
      'def normalize_email(raw: str | None) -> str | None',
      'strip / lower; "" → None',
      'Document the contract in one line',
    ],
    trap:
      'Returning "" and None inconsistently breaks joins — one meaning of missing (None).',
    steps: [
      {
        title: 'Signature',
        detail: 'Use type hints to clarify input/output (str | None).',
      },
      {
        title: 'Body',
        detail: 'if raw is None: return None; s = raw.strip().lower(); return s or None',
      },
    ],
    questions: [
      {
        id: 'ph2q1',
        prompt: 'Python type annotations are often called:',
        kind: 'short',
        accept: ['type hints', 'type hint', 'hints', 'annotations'],
        explanation: 'Type hints = type annotations (PEP 484).',
      },
      {
        id: 'ph2q2',
        prompt: 'Keyword to define a function:',
        kind: 'mcq',
        options: ['def', 'func', 'lambda only', 'class'],
        accept: ['def'],
        explanation: 'def name(...): creates a function.',
      },
    ],
    modelSolution:
      '```python\ndef normalize_email(raw: str | None) -> str | None:\n    """Return a normalized email or None if missing/empty."""\n    if raw is None:\n        return None\n    s = raw.strip().lower()\n    return s or None\n```',
  },

  'py-control-except-2': {
    title: 'if / for / try — parse HT amount',
    context:
      'A sales CSV has sometimes-invalid amounts ("N/A", None, "12,5").',
    description:
      'You loop, branch, and catch conversion errors without killing the whole run.',
    tasks: [
      'for row in rows',
      'try/except ValueError on float()',
      'isinstance to skip non-str / already-OK non-num',
    ],
    trap:
      'except Exception too broad hides bugs — target except ValueError (or TypeError).',
    steps: [
      {
        title: 'Loop',
        detail: 'for raw in montants: …',
      },
      {
        title: 'Parse',
        detail:
          'try: float(str(raw).replace(",", ".")) except ValueError: rejects.append(raw)',
      },
    ],
    questions: [
      {
        id: 'pe2q1',
        prompt: 'Block to catch a conversion error:',
        kind: 'mcq',
        options: ['try / except', 'if / else alone', 'with / as', 'class / self'],
        accept: ['try / except'],
        explanation: 'try/except handles runtime exceptions.',
      },
      {
        id: 'pe2q2',
        prompt: 'Function to check an object’s type:',
        kind: 'short',
        accept: ['isinstance', 'isinstance()'],
        explanation: 'isinstance(x, typ) → bool.',
      },
    ],
    modelSolution:
      '```python\nparsed, rejects = [], []\nfor raw in montants:\n    if raw is None:\n        rejects.append(raw)\n        continue\n    try:\n        parsed.append(float(str(raw).replace(",", ".")))\n    except ValueError:\n        rejects.append(raw)\n```',
  },

  'py-comprehension-3': {
    title: 'List comprehension — active IDs',
    context:
      'From a list of employee dicts, you want active employee_id values (active_record == 1).',
    description:
      'You replace a verbose loop with a readable comprehension.',
    tasks: [
      'Comprehension with if',
      'Produce a list[int]',
      'Compare readability vs a for loop',
    ],
    trap:
      'A 4-level comprehension is unreadable — fall back to a loop / named function.',
    steps: [
      {
        title: 'Form',
        detail: '[e["employee_id"] for e in rows if e.get("active_record") == 1]',
      },
    ],
    questions: [
      {
        id: 'pp3q1',
        prompt: 'Compact constructor [expr for x in it if cond]:',
        kind: 'short',
        accept: ['comprehension', 'list comprehension', 'listcomp'],
        explanation: 'List comprehension = compact loop + filter form.',
      },
    ],
    modelSolution:
      '```python\nactifs = [e["employee_id"] for e in rows if e.get("active_record") == 1]\n```',
  },

  'py-oop-light-3': {
    title: 'Light class — CsvCleaner',
    context:
      'You want to encapsulate expected schema + clean + reject counter for several Mutualis files.',
    description:
      'You set a small class (state + methods) without over-engineering.',
    tasks: [
      '__init__ with expected_cols',
      'clean(df) method → df_ok',
      'rejects_count attribute',
    ],
    trap:
      'A 5-level ABC hierarchy for a daily CSV is overkill — simple class first.',
    steps: [
      {
        title: 'Class',
        detail: 'class CsvCleaner: def __init__(self, expected: set[str]): …',
      },
      {
        title: 'Method',
        detail: 'def clean(self, df): check columns, count nulls, return df',
      },
    ],
    questions: [
      {
        id: 'po3q1',
        prompt: 'Keyword to define a class:',
        kind: 'short',
        accept: ['class'],
        explanation: 'class Name: …',
      },
      {
        id: 'po3q2',
        prompt: 'Conventional first argument of instance methods:',
        kind: 'mcq',
        options: ['self', 'this', 'cls only', 'cls required everywhere'],
        accept: ['self'],
        explanation: 'self references the instance (cls for classmethods).',
      },
    ],
    modelSolution:
      '```python\nclass CsvCleaner:\n    def __init__(self, expected: set[str]):\n        self.expected = expected\n        self.rejects_count = 0\n\n    def clean(self, df):\n        missing = self.expected - set(df.columns)\n        if missing:\n            raise ValueError(f"missing {missing}")\n        ok = df.dropna(subset=list(self.expected))\n        self.rejects_count = len(df) - len(ok)\n        return ok\n```',
  },
}

export function exerciseEnOverlay(id: string): PracticeExerciseEn | undefined {
  return PRACTICE_EXERCISES_EN[id]
}
