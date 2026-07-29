/** English data governance packs — QCM (3 options) + Governance framework correction. */

import type { StepGovernance } from './pmGovTypes'
import type { ProjectPhase, ToolId } from './tools'
import { HUMAN_BANK_EN } from './pmHumanBank.en'

function gov(
  partial: Omit<StepGovernance, 'damaRef'> & { damaRef?: string },
): StepGovernance {
  return {
    damaRef: 'Governance framework',
    ...partial,
  }
}

/** Curated governance QCM by step id. */
export const CURATED_GOVERNANCE_EN: Record<string, StepGovernance> = {
  'l0-open': gov({
    link: 'Inspecting the schema means establishing the technical catalog: without documented columns, no reliable steward or glossary.',
    question:
      'After retail_employees discovery, which Owner / artifact pair is most aligned with data governance?',
    options: [
      'IT Support = Owner; no artifact (the CSV is enough)',
      'HR Director / HR Ops = Data Owner; update catalog + “active employee” glossary',
      'The data intern = sole Owner; personal unshared spreadsheet',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.3 Data Governance · Ch.12 Metadata',
    correction:
      'In data governance, the Data Owner is business-accountable (here retail HR/ops), not “whoever has the file.” The Steward operationalizes quality/metadata. After discovery, enrich business + technical metadata (catalog/glossary) — Ch.12 Metadata Management.',
  }),
  'l0-filter': gov({
    link: 'The filter active_record = 1 materializes a quality business rule: governance must freeze it as the “active headcount” definition.',
    question: 'Where should the rule “active employee = active_record = 1” live first?',
    options: [
      'Only in the head of the analyst who filters Excel',
      'As a governed quality rule / definition, tested (script or dbt) on the mart',
      'Only in a PowerPoint slide from the last board meeting',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.13 Data Quality · Ch.3 Data Governance',
    correction:
      'data governance (Data Quality): quality rules are defined, measured, and controlled — not improvised. Tie the rule to a governed business definition (DG) and execute it (tests) to avoid divergent KPIs.',
  }),
  'l0-sql': gov({
    link: 'The same business definition must produce the same result in SQL and Python — semantic consistency of definitions.',
    question: 'How should data governance ensure SQL COUNT ≈ pandas value_counts?',
    options: [
      'Trust the feeling if orders of magnitude look similar',
      'Documented reconciliation / quality control (gold set, assert, CI test) on the same definition',
      'Change the SQL definition until the dashboard looks “pretty”',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.13 Data Quality · Ch.12 Metadata',
    correction:
      '“Fitness for purpose” quality implies consistency controls across pipelines. Quantified reconciliation + shared definition metadata (glossary/KPI) is the data governance move; variance becomes a quality incident, not a cosmetic tweak.',
  }),
  'l1-dupes': gov({
    link: 'Email duplicates are a master-data uniqueness defect: matching, survivorship, and stewardship.',
    question: 'Which MDM approach is most correct under data governance for duplicate emails?',
    options: [
      'Randomly delete every other row with no survivorship rule',
      'Normalized key (email) + survivorship rule + documented CRM Owner/Steward',
      'Ignore duplicates as long as revenue “looks fine”',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.10 Reference & Master Data',
    correction:
      'Ch.10 MDM: matching (exact/fuzzy), golden record / trusted version, survivorship rules, dedicated stewardship. Without policy, the hub or script “governs” nothing.',
  }),
  'l1-join': gov({
    link: 'A revenue × customers join commits grain and lineage of the finance KPI.',
    question: 'Which statement best describes grain + lineage for “delivered revenue by segment”?',
    options: [
      'Grain = any Excel row; lineage useless if the JOIN “works”',
      'Grain = segment × period; lineage sales + clients_ref → mart documented in the catalog',
      'Grain = dashboard pixel; lineage = Power BI file name only',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.12 Metadata (lineage) · Ch.11 DW/BI (grain)',
    correction:
      'Grain (Kimball/data governance DW-BI) must be explicit. Lineage (Metadata) traces sources → transformations → data product. Without both, no governed “single version of truth.”',
  }),
  'l1-py-clean': gov({
    link: 'Industrializing cleanup = versioned quality policy, not a one-shot.',
    question: 'Where do you version and who validates an email-normalization rule change?',
    options: [
      'Only locally on the laptop, with no review',
      'In the repo (code + docs) with PR reviewed by Steward/business Owner',
      'Only verbally in the daily Scrum',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.13 Data Quality · Ch.3 Data Governance',
    correction:
      'Quality rules are governed assets: change traceability (who decided what) is part of DG. Code + documentation + Owner/Steward accountability = data governance practice.',
  }),
  'l2-sql': gov({
    link: 'A published aggregate requires classification, Owner, and usage rights.',
    question: 'For the real-estate aggregate by commune, which data governance stance is correct?',
    options: [
      'Public by default; everyone exports with no control',
      'Classification (e.g. internal) + named Owner + self-service access under guardrails',
      'No classification: only the CTO decides case-by-case on Slack',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.3 Data Governance · Ch.7 Data Security',
    correction:
      'DG + Security: classify, assign responsibility, control access by risk. Aggregation reduces PII risk but does not waive usage governance.',
  }),
  'l2-capteur': gov({
    link: 'An ops threshold is an operational quality / freshness control.',
    question: 'What must governance define when visitors < threshold?',
    options: [
      'Nothing: the CSV file “will speak for itself”',
      'Alert + owner + SLA / runbook (timeliness & issue management)',
      'Only an emoji in the #random channel',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.13 Data Quality · Ch.3 Data Governance',
    correction:
      'Quality includes freshness (timeliness) and anomaly handling. A control without owner or escalation is not governed — data governance insists on roles and process, not just the metric.',
  }),
  'l2-foot': gov({
    link: 'CASE/aggregates formalize testable business rules — like any governed definition.',
    question: 'How do you formalize “home win” under data-governance rules?',
    options: [
      'Let each analyst interpret FTR as they like',
      'Explicit definition (FTR = H) + quantified acceptance test',
      'Replace the definition with dashboard storytelling',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.12 Metadata · Ch.13 Data Quality',
    correction:
      'Business metadata definitions must be unambiguous; controls prove rule compliance. Otherwise: semantic defect (same name, different meanings).',
  }),
  'l2-window': gov({
    link: 'Window functions on revenue: the KPI’s temporal grain must be decided.',
    question: 'If business wants ranking by slot AND by day, what does governance do?',
    options: [
      'One ambiguous KPI that mixes both grains',
      'Two distinct definitions/KPIs; Retail Owner decides; Steward publishes',
      'Hide the grain to “simplify” the board',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.11 DW & BI · Ch.3 Data Governance',
    correction:
      'Grain is a foundational BI concept. Two needs = two governed products/definitions, not a catch-all indicator. The Owner arbitrates; the Steward documents.',
  }),
  'l3-json': gov({
    link: 'Integrating machine JSON = schema contract, retention, ownership.',
    question: 'Which mini data contract is most compatible with data governance?',
    options: [
      'No mandatory fields; infinite retention; unknown Owner',
      'Typed mandatory fields + defined retention + named schema Owner',
      'Contract only the IoT vendor logo',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.5 Data Modeling · Ch.8 Data Integration · Ch.3 DG',
    correction:
      'Data contracts / standards (modeling + integration) and DG accountability. A schema breaking change with no Owner = debt and ops risk.',
  }),
  'l3-py': gov({
    link: 'SCD ETL to active HR engages purpose and retention (privacy / DG).',
    question: 'Which statement is most aligned with data governance / privacy for employees_actifs?',
    options: [
      'Keep raw landing forever “just in case” with no purpose',
      'Explicit business purpose + differentiated retention landing vs mart',
      'Publish names on a public dashboard for “transparency”',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.2 Ethics · Ch.7 Security/Privacy · Ch.3 DG',
    correction:
      'Purpose, minimization, and retention are core to data governance privacy/ethics. Landing ≠ mart: distinct lifecycle policies under governance.',
  }),
  'l3-py-merge': gov({
    link: 'CA×clients merge = shared Finance/CRM data product — clear stewardship.',
    question: 'If Finance and CRM diverge on “delivered”, what to do (data governance)?',
    options: [
      'Leave two same-named definitions in production',
      'Accountable Owner arbitration + one published definition (committee / ADR)',
      'Take the definition of whoever spoke last in the meeting',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.3 Data Governance · Ch.10 MDM',
    correction:
      'DG resolves definition conflicts; the Accountable Owner owns the call. Two “truths” = semantic governance failure (and BI trust failure).',
  }),
  'l3-dbt': gov({
    link: 'dbt encodes operational governance: tests = executable quality policy.',
    question: 'Why unique(employee_id) on the mart (not SCD staging)?',
    options: [
      'Because dbt refuses tests on staging on technical principle',
      'SCD staging has multiple versions; the active mart is the golden record to control',
      'Uniqueness tests are decorative and have no governance impact',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.10 MDM · Ch.13 Data Quality',
    correction:
      'The golden / trusted record is controlled where the business rule is applied. On raw SCD, business-key uniqueness legitimately fails — wrong control = false negatives and confusion.',
  }),
  'l4-kpi-sql': gov({
    link: 'The KPI query is the executable definition: it takes precedence over BI storytelling.',
    question: 'What must a “Revenue Intensity” KPI sheet contain under data governance?',
    options: [
      'Only a Power BI screenshot with no Owner',
      'Name, definition (e.g. SUM weight), Owner, classification / technical link',
      'Only the dashboard marketing name',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.12 Metadata · Ch.11 DW/BI · Ch.3 DG',
    correction:
      'Business metadata (definition, Owner) + technical link. Without accountability or classification, the KPI is not governed — viz alone is not enough.',
  }),
  'l4-grain': gov({
    link: 'Joining without aligning grains = major semantic / quality defect.',
    question: 'Sensor × weights join without aggregation: governance reaction?',
    options: [
      'Ignore: “totals will eventually stabilize”',
      'Quality incident (high severity): withdraw/fix the product, document the grain',
      'Double the figures on purpose to “be cautious”',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.13 Data Quality · Ch.11 DW/BI',
    correction:
      'Wrong grain produces facts that are not fitness-for-purpose. Data governance treats this as a quality + dimensional definition issue — escalate and fix, do not stay silent.',
  }),
  'l4-pbi': gov({
    link: 'BI exposition: measure ↔ reference SQL traceability.',
    question: 'How do you prove in committee that the BI measure = the reference query?',
    options: [
      'Claim Power BI “always calculates correctly”',
      'Quantified reconciliation on a sample (SQL vs BI) under Owner',
      'Change the SQL query to match the dashboard',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.11 DW/BI · Ch.13 Data Quality',
    correction:
      'Self-service / BI under guardrails: certified content and controls. Reconciliation proves trust; inverting technical truth to “match” viz breaks governance.',
  }),
  'l5-af': gov({
    link: 'Airflow DAG = ops freshness control (timeliness).',
    question: 'What must governance set around the sensor?',
    options: [
      'No SLA: we look at the DAG when we think of it',
      'Freshness SLA + retries + runbook escalation on timeout',
      'Only a pretty Grafana screenshot with no owner',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.13 Data Quality (timeliness) · Ch.3 DG',
    correction:
      'Timeliness is a quality dimension. Process, roles, and escalation belong to operational DG — a technical sensor with no SLA is not governance.',
  }),
  'l5-transform': gov({
    link: 'Date-parameterized transform = idempotence and auditability.',
    question: 'Why is {{ ds }} a governance prerequisite?',
    options: [
      'To look nice in Airflow logs',
      'Enable replay, audit and dated partitions (evidence / idempotence)',
      'To avoid writing quality tests',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.8 Data Integration & Interoperability · Ch.12 Metadata',
    correction:
      'Governed integration: batch/period traceability, replayability, operational metadata. Without a run key (ds), no reliable audit of “which data for which date.”',
  }),
  'l5-cap': gov({
    link: 'Pipeline runbook = end-to-end RACI / accountability.',
    question: 'For active-employees mart quality, which RACI best fits data governance?',
    options: [
      'Nobody accountable; everyone “co-owner” with no decision',
      'Responsible = data engineer; Accountable = HR Data Owner',
      'Accountable = the dbt tool itself',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.3 Data Governance (roles)',
    correction:
      'Data governance separates accountability (Owner) from operational responsibility (Steward / engineering). A tool cannot be Accountable. Clear RACI = decision and escalation possible.',
  }),
}

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pickGov(arr: readonly StepGovernance[], seed: number): StepGovernance {
  return arr[seed % arr.length]!
}

/** Operational bank — concrete cases (DQ, catalog, GDPR, lineage, KPI). */
export const OPERATIONAL_BANK_EN: readonly StepGovernance[] = [
  gov({
    link: 'Before go-live: a quality rule must be written, testable, and Owner-assigned.',
    question: 'You just delivered a mart. Which DQ move is most operational?',
    options: [
      'Say “the data looks fine” on Slack',
      'Write a rule (e.g. email uniqueness) + automated test + Owner who arbitrates failures',
      'Change the KPI until the board smiles',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.13 Data Quality · Ch.3 DG',
    correction:
      'Operational quality = rule + measure + accountability. Without an Owner on failures, the test is cosmetic.',
  }),
  gov({
    link: 'Catalog / glossary: the technical deliverable exists for the enterprise only if it is findable.',
    question: 'What do you publish at minimum in the catalog after your script?',
    options: [
      'Only the file name on your Desktop',
      'Business term, definition, Owner, table/column or dataset link',
      'Only the DataGalaxy / Purview logo',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.12 Metadata · Ch.3 DG',
    correction:
      'Business + technical metadata + accountability. Otherwise nobody reuses your SQL/Python.',
  }),
  gov({
    link: 'GDPR / privacy: purpose and retention before exposing or training.',
    question: 'The dataset contains a customer email. Governance decision?',
    options: [
      'Push everything to the mart “for later” with no purpose',
      'Document purpose + legal basis + retention; minimize / mask if out of scope',
      'Leave access open to the whole company “to go faster”',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.7 Data Security · GDPR',
    correction:
      'Privacy by design: purpose, minimization, retention. Speed does not excuse exposure.',
  }),
  gov({
    link: 'Board decision: a KPI diverges between SQL and the dashboard.',
    question: 'Which decision do you take before the meeting?',
    options: [
      'Hide the gap to avoid conflict',
      'Block certification, reconcile SQL vs viz, have Owner decide',
      'Duplicate two KPIs under the same label',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.13 DQ · Ch.11 DW/BI · Ch.3 DG',
    correction:
      'Trust = one definition, one source of truth, one Accountable. No political cosmetics.',
  }),
  gov({
    link: 'Lineage: know where the figure comes from before arbitrating a business bug.',
    question: 'A “wrong” figure surfaces. First governed move?',
    options: [
      'Recode the dashboard urgently without tracing the source',
      'Walk the lineage (source → landing → mart → viz) and isolate the failing step',
      'Blame business with no evidence',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.12 Metadata · Ch.8 Integration',
    correction:
      'Lineage turns an opinion debate into a technical diagnosis — then Owner decision.',
  }),
  gov({
    link: 'RACI Owner / Steward: who decides vs who executes remediation.',
    question: 'DQ tests red on the golden record. Who does what?',
    options: [
      'Nobody: ignore until the next board',
      'Steward / engineer remediates; Owner arbitrates whether to ship or block',
      'The dbt tool is Accountable instead of humans',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.3 DG · Ch.10 MDM · Ch.13 DQ',
    correction:
      'Operational Responsible ≠ business Accountable. The tool executes; humans decide.',
  }),
  gov({
    link: 'Access / classification: the script must not open data to everyone.',
    question: 'After publishing an HR mart, which access decision?',
    options: [
      'Everyone / AllUsers “temporarily”',
      'Classify (internal / confidential) + role-based entitlements + periodic review',
      'Share the dump on a personal Drive',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.7 Data Security',
    correction:
      'Security = classification + least privilege + review. Personal dumps are incidents waiting to happen.',
  }),
  gov({
    link: 'Data DoD: the technical deliverable is finished only if a business decision is possible.',
    question: 'Your SQL passes. What is still missing for a data Definition of Done?',
    options: [
      'Nothing: green code always suffices',
      'Validated KPI/AC + Owner + at least one documented quality control',
      'Only an Instagram screenshot',
    ],
    correctIndex: 1,
    damaRef: 'Governance framework · Ch.3 DG · Ch.13 DQ',
    correction:
      'Data DoD = fitness to decide. Green code with no Owner or control = operational debt.',
  }),
]

/** Project soft skills (conflict, people, decisions, comms…) — governance shape. */
const HUMAN_GOV_BANK_EN: readonly StepGovernance[] = HUMAN_BANK_EN.map((h) =>
  gov({
    link: h.link,
    question: h.question,
    options: h.options,
    correctIndex: h.correctIndex,
    correction: h.correction,
    damaRef: `Soft skills · ${h.frameworkRef}`,
  }),
)

export function defaultGovernanceForToolEn(
  tool: ToolId | undefined,
  phase?: ProjectPhase,
  stepId = 'anon',
  intensity = 0,
): StepGovernance {
  const seed = hashSeed(`${stepId}|gov|${tool ?? ''}|${phase ?? ''}|${intensity}`)
  // ~40% soft skills / conflict / people / communication
  if (seed % 5 < 2) {
    return pickGov(HUMAN_GOV_BANK_EN, seed)
  }
  // Alternation: operational bank (market) ↔ tool default (technical stack)
  if (seed % 3 !== 0) {
    return pickGov(OPERATIONAL_BANK_EN, seed)
  }
  const phaseBit = phase ? ` (phase ${phase})` : ''
  switch (tool) {
    case 'sql':
    case 'bigquery':
    case 'cloudsql':
      return gov({
        link: `A SQL query publishes a business truth${phaseBit}: Owner, grain, and controls must be explicit.`,
        question: 'Which trio is essential to govern this indicator/table?',
        options: [
          'Dashboard color, title font, animation',
          'Named Data Owner + documented grain + at least one quality control',
          'Only the SQL dialect (BigQuery vs Postgres)',
        ],
        correctIndex: 1,
        damaRef: 'Governance framework · Ch.3 DG · Ch.13 Data Quality · Ch.12 Metadata',
        correction:
          'Without Owner (accountability), grain (semantics), and control (quality), the query remains a local script — not a truly governed data asset.',
      })
    case 'python':
    case 'spark':
    case 'databricks':
    case 'airflow':
      return gov({
        link: `A script / job industrializes rules${phaseBit}: versioning, idempotence, responsibilities.`,
        question: 'Which practice is most compatible with data governance for this job?',
        options: [
          'Change the rule in prod with no ticket or review',
          'Versioned rule (repo) + idempotent job + Owner/Steward validation',
          'Hardcode everything with no partition date “to go faster”',
        ],
        correctIndex: 1,
        damaRef: 'Governance framework · Ch.3 DG · Ch.8 Integration · Ch.13 DQ',
        correction:
          'Governed change + replayable/auditable execution. Data governance values process and roles as much as code.',
      })
    case 'dbt':
      return gov({
        link: 'dbt materializes contracts between layers: tests = quality policy.',
        question: 'Where should golden-record integrity tests preferably live?',
        options: [
          'Only on governance slides',
          'On the mart (where the business rule is applied), documented + Owner',
          'Nowhere: dbt “is enough” as governance',
        ],
        correctIndex: 1,
        damaRef: 'Governance framework · Ch.13 Data Quality · Ch.10 MDM',
        correction:
          'Controls must target the trusted asset. The dbt tool executes policy; it does not replace Owner or definitions.',
      })
    case 'datagalaxy':
      return gov({
        link: 'DataGalaxy formalizes glossary, ownership, and policies — DG core.',
        question: 'What must a term / KPI sheet contain at minimum?',
        options: [
          'Only an emoji and a Slack link',
          'Term, definition, Owner, technical link (table/column)',
          'Only the catalog tool logo',
        ],
        correctIndex: 1,
        damaRef: 'Governance framework · Ch.3 DG · Ch.12 Metadata',
        correction:
          'Glossary + accountability + technical link: otherwise the catalog is cosmetic (classic trap: cosmetic catalog without accountability).',
      })
    case 'powerbi':
    case 'looker':
      return gov({
        link: 'BI exposition: measure ↔ certified SQL definition.',
        question: 'What does governance require before certifying a BI map?',
        options: [
          'That the visual is aesthetic',
          'Alignment to reference mart/SQL + Owner who certifies the figure',
          'Disable all date filters to “see more data”',
        ],
        correctIndex: 1,
        damaRef: 'Governance framework · Ch.11 DW/BI · Ch.3 DG',
        correction:
          'Self-service under guardrails: certified content, conforming definitions. Aesthetics ≠ trust.',
      })
    case 'gcs':
      return gov({
        link: 'GCS landing: classification, retention, dated paths (audit).',
        question: 'Why dt=YYYY-MM-DD in the landing path?',
        options: [
          'To decorate the URL',
          'Replay, audit and sensors — batch traceability by date',
          'Because GCS rejects files without a date in the marketing name',
        ],
        correctIndex: 1,
        damaRef: 'Governance framework · Ch.8 Integration · Ch.12 Metadata · Ch.7 Security',
        correction:
          'Dated partitions serve replayable integration + ops metadata + batch access controls. Classification/retention remain mandatory.',
      })
    default:
      return gov({
        link: `Every project deliverable${phaseBit} ties Owner, quality, and usage.`,
        question: 'What data-governance minimum do you apply to this deliverable?',
        options: [
          'No role, no documented risk',
          'Named Owner + identified quality risk + mitigation (control/review)',
          'Only the cloud stack choice of the moment',
        ],
        correctIndex: 1,
        damaRef: 'Governance framework · Ch.3 Data Governance',
        correction:
          'DG sets authorities, decisions, and responsibilities. Owner + risk + mitigation is the foundation; the tool comes after.',
      })
  }
}

export function resolveGovernanceEn(
  stepId: string,
  tool?: ToolId,
  phase?: ProjectPhase,
  override?: StepGovernance,
  intensity = 0,
): StepGovernance {
  return (
    override ??
    CURATED_GOVERNANCE_EN[stepId] ??
    defaultGovernanceForToolEn(tool, phase, stepId, intensity)
  )
}
