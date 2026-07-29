/** English PM packs — QCM (project management / Scrum / scaled agile) + auto scenario twists. */

import type { StepProjectMgmt } from './pmGovTypes'
import type { ProjectPhase, ToolId } from './tools'
import { HUMAN_BANK_EN, HUMAN_TWISTS_EN } from './pmHumanBank.en'

function pm(
  partial: Omit<StepProjectMgmt, 'frameworkRef'> & { frameworkRef?: string },
): StepProjectMgmt {
  return {
    frameworkRef: 'Project management / Agile',
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

/** Generic twists — injected automatically when the pack has none. */
const TWISTS_BY_PHASE_EN: Record<ProjectPhase, readonly string[]> = {
  cadrage: [
    'Twist: the sponsor expands the MVP in the meeting (“and real-time too”).',
    'Twist: the exec committee pulls the date forward by 10 days with no extra budget.',
    'Twist: two sponsors set contradictory objectives on the same KPI.',
    'Twist: IT forces a tool outside the backlog while the Goal is still undefined.',
  ],
  ingestion: [
    'Twist: the landing source arrives 1 day late with a partially changed schema.',
    'Twist: the vendor cuts the API on Sprint Review day.',
    'Twist: an “urgent” CSV arrives outside the schema contract.',
    'Twist: Ops refuses to deliver the dump until the access SLA is signed.',
  ],
  transformation: [
    'Twist: a cross-team dependency blocks the mart model until a new arbitration.',
    'Twist: Finance changes the “delivered” definition mid-Sprint.',
    'Twist: dbt tests go red on the golden record the night before the board.',
    'Twist: team capacity drops 30% (illness / another PI).',
  ],
  gouvernance: [
    'Twist: internal audit demands Owner + classification before any publication.',
    'Twist: the DPO blocks the Dataset until purpose/retention are written down.',
    'Twist: a Shadow IT spreadsheet circulates with a divergent “official” figure.',
    'Twist: DataGalaxy / catalog incomplete — nobody wants to be Accountable.',
  ],
  exposition: [
    'Twist: two departments compare divergent figures in the board meeting.',
    'Twist: the sponsor wants “a nice map tomorrow” with no reference query.',
    'Twist: Looker and Power BI show the same KPI name with two grains.',
    'Twist: a director demands hiding an outlier to “reassure” the board.',
  ],
  ops: [
    'Twist: prod incident — red sensor, incomplete mart at SLA time.',
    'Twist: FileSensor timeout three mornings in a row before the board.',
    'Twist: rollback requested: nobody has an up-to-date runbook.',
    'Twist: data on-call missing; business escalates straight to Slack #board.',
  ],
}

const TWISTS_ANY_EN: readonly string[] = [
  'Twist: a business constraint changes mid-Sprint.',
  'Twist: the Product Goal stays, but the technical path must pivot.',
  'Twist: a VIP stakeholder joins the meeting and hot-swaps the priority.',
  'Twist: invisible technical debt threatens the next Increment.',
  ...HUMAN_TWISTS_EN,
]

type PmCore = Omit<StepProjectMgmt, 'scenarioTwist'>

/** PM banks by phase — auto rotation (endless + fallback). */
export const BANK_EN: Record<ProjectPhase, readonly PmCore[]> = {
  cadrage: [
    pm({
      link: 'Framing: vision, out-of-scope, stakeholders.',
      question: 'Faced with a spontaneous scope expansion, what do you do?',
      options: [
        'Accept everything to “please” people',
        'Bring it back to the Product Goal / out-of-scope; renegotiate the backlog',
        'Ignore the sponsor',
      ],
      correctIndex: 1,
      frameworkRef: 'Scrum — Product Goal · Project management — Scope · scaled agile — Lean Budget Guardrails',
      correction:
        'Protect the Goal and out-of-scope. Change goes through the backlog, not emotional promises.',
    }),
    pm({
      link: 'Initiation: reduce uncertainty before freezing the plan.',
      question: 'Which first PM move is the most value-driven?',
      options: [
        'Lock a 40-task Gantt before any discovery',
        'Run a short discovery (risks, sources, AC) to illuminate the backlog',
        'Wait for 100% cloud architecture sign-off',
      ],
      correctIndex: 1,
      frameworkRef: 'Project management — Focus on value · Scrum — empiricism',
      correction:
        'Empiricism and value come from useful inspection. A frozen plan before facts is theater.',
    }),
    pm({
      link: 'Stakeholders: contradictory objectives.',
      question: 'Two sponsors pull the KPI in opposite directions. Facilitation?',
      options: [
        'Ship two secret KPIs under the same name',
        'Facilitate Accountable arbitration; document a single definition',
        'Pick the highest rank with no transparency',
      ],
      correctIndex: 1,
      frameworkRef: 'Project management — Stakeholder · Scrum — Product Goal clarity · scaled agile — alignment',
      correction:
        'One name, one definition. The PM facilitates Owner arbitration — not political chaos.',
    }),
    pm({
      link: 'Techno-functional decision: choose the right lever (SQL vs script vs tool).',
      question:
        'Business wants a uniqueness check tomorrow. Which PM/tech decision is healthiest?',
      options: [
        'Promise a Looker dashboard with no upstream rule',
        'Prioritize a testable rule (SQL/dbt/Python) + Owner, then expose the KPI',
        'Do it all by hand in Excel “just this once”',
      ],
      correctIndex: 1,
      frameworkRef: 'Project management — Quality · Scrum — built-in quality · scaled agile — Built-in Quality',
      correction:
        'The product decision starts from an industrializable rule. Viz comes after governed truth.',
    }),
  ],
  ingestion: [
    pm({
      link: 'Ingestion: external dependencies and integration risks.',
      question: 'Source late + unstable schema. PM priority?',
      options: [
        'Pretend everything is green',
        'Make the risk visible, adapt the Sprint Goal / plan, secure a schema contract',
        'Double the teams without clarifying',
      ],
      correctIndex: 1,
      frameworkRef: 'Project management — Risk · scaled agile — Dependency · Scrum — adapt Sprint Goal',
      correction:
        'Risk transparency + Goal adaptation. A schema contract reduces integration chaos.',
    }),
    pm({
      link: 'Landing: Definition of Ready for sources.',
      question: 'An “urgent” CSV arrives outside contract. What do you do?',
      options: [
        'Ingest it to prod with no questions',
        'Treat it as risk: quarantine, Owner, schema AC before promotion',
        'Leave it on an intern’s Desktop',
      ],
      correctIndex: 1,
      frameworkRef: 'Scrum — DoR · Project management — Quality gates · scaled agile — Guardrails',
      correction:
        'No gate bypass. Quarantine + Owner + AC = controlled ingestion.',
    }),
    pm({
      link: 'Vendor / API dependency.',
      question: 'The source API cuts out on Review day. Reflex?',
      options: [
        'Cancel the Review with no communication',
        'Show the possible Increment, expose the ROAM risk, plan the workaround',
        'Promise “it will work tomorrow” with no plan',
      ],
      correctIndex: 1,
      frameworkRef: 'scaled agile — ROAM · Scrum — Sprint Review honesty · Project management — Communication',
      correction:
        'Transparency in Review + Owned risk + plan. Trust is built on facts.',
    }),
  ],
  transformation: [
    pm({
      link: 'Transformation: incremental delivery and built-in quality.',
      question: 'Cross-team blockage on the mart. Best action?',
      options: [
        'Passively wait until the end of the PI',
        'Escalate / sync (PO Sync, RTE), propose a sliced Increment',
        'Fork a local ungoverned solution',
      ],
      correctIndex: 1,
      frameworkRef: 'scaled agile — PO Sync / RTE · Scrum — impediment · Project management — Integration',
      correction:
        'Dependencies are managed through sync and slicing — not shadow IT.',
    }),
    pm({
      link: 'Model quality: data DoD.',
      question: 'Golden-record uniqueness tests red the night before the board. Stance?',
      options: [
        'Force green and ship anyway',
        'Block Done, communicate impact, prioritize the fix vs Goal',
        'Hide the test “temporarily”',
      ],
      correctIndex: 1,
      frameworkRef: 'scaled agile — Built-in Quality · Scrum — DoD · Project management — Quality',
      correction:
        'Built-in quality: red = not Done. Adapt the plan; do not lie to the board.',
    }),
    pm({
      link: 'Business definition change mid-Sprint.',
      question: 'Finance changes “delivered”. What do you do?',
      options: [
        'Keep the old JOIN in silence',
        'Clarify with Owner, update AC / risk, replan the Increment',
        'Duplicate two same-named KPIs',
      ],
      correctIndex: 1,
      frameworkRef: 'Scrum — PO clarification · Project management — Change control · data governance alignment',
      correction:
        'Definition change = scope/quality impact. Clarify, document, adapt.',
    }),
    pm({
      link: 'Technical arbitration: SQL vs Python vs tooling.',
      question:
        'You must harden a retail aggregate. Which techno-functional decision?',
      options: [
        'Glue everything in Power BI with no mart layer',
        'Choose SQL/dbt (or Python) for the rule + tests; BI only for exposition',
        'Rewrite the same logic 3 times in 3 tools “to be sure”',
      ],
      correctIndex: 1,
      frameworkRef: 'Project management — Make or buy / architecture · scaled agile — Architectural Runway',
      correction:
        'One rule, one trust layer. BI consumes; it does not replace the tested model.',
    }),
  ],
  gouvernance: [
    pm({
      link: 'Governance: compliance and stewardship in the plan.',
      question: 'Audit requires Owner before publication. What do you do?',
      options: [
        'Publish anyway to hit the date',
        'Block Done while Owner/classification are missing; adjust the plan',
        'Put a fake Owner name',
      ],
      correctIndex: 1,
      frameworkRef: 'Project management — Compliance · scaled agile — Guardrails · data governance + delivery',
      correction: 'Compliance in the DoD. Date without Owner = unacceptable risk.',
    }),
    pm({
      link: 'GDPR / DPO in the agile flow.',
      question: 'The DPO requires purpose/retention before the Increment. Integration?',
      options: [
        'Defer to “after go-live”',
        'Add compliance AC and block Done until satisfied',
        'Publish PII in self-service',
      ],
      correctIndex: 1,
      frameworkRef: 'Project management — Compliance · Scrum — DoD · scaled agile — Guardrails',
      correction:
        'Compliance enters the DoD / AC. Shipping without purpose = legal risk.',
    }),
    pm({
      link: 'Shadow IT vs single source of truth.',
      question: 'An “official” spreadsheet circulates beside the mart. PM action?',
      options: [
        'Let it go to avoid conflict',
        'Escalate: one Accountable; remove shadow from the decision path',
        'Merge the two figures into an average',
      ],
      correctIndex: 1,
      frameworkRef: 'data governance — Stewardship · scaled agile — alignment · Project management — Issue mgmt',
      correction:
        'Two truths = governance failure. One Owner, one source, transparency.',
    }),
  ],
  exposition: [
    pm({
      link: 'Exposition: acceptance and single source of truth.',
      question: 'Two divergent figures in the board meeting. PM reflex?',
      options: [
        'Pick the flattering one',
        'Suspend the decision, reconcile vs reference definition; Owner decides',
        'Forbid questions',
      ],
      correctIndex: 1,
      frameworkRef: 'Scrum — Review honesty · Project management — Data-driven decisions',
      correction:
        'No decision on unreconciled facts. Transparency > storytelling.',
    }),
    pm({
      link: 'Value sequencing: truth before viz.',
      question: 'BI map requested tomorrow with no reference SQL. Priority?',
      options: [
        'The map first, the definition “later”',
        'The query / KPI definition first, then aligned viz',
        'Both with no Owner',
      ],
      correctIndex: 1,
      frameworkRef: 'Project management — Focus on value · scaled agile — sequencing · Scrum — Goal',
      correction:
        'Without an executable definition, viz has no reliable value.',
    }),
    pm({
      link: 'BI acceptance in Sprint Review.',
      question: 'When do you accept the dashboard?',
      options: [
        'As soon as it looks nice',
        'When it reconciles with the reference definition under Owner',
        'When nobody speaks',
      ],
      correctIndex: 1,
      frameworkRef: 'Scrum — acceptance · Project management — Validate scope',
      correction: 'Acceptance = AC/DoD (reconciliation), not aesthetics or silence.',
    }),
  ],
  ops: [
    pm({
      link: 'Ops: flow, SLA, resilience.',
      question: 'Sensor incident / missed SLA. Priority?',
      options: [
        'Hide the incident',
        'Light war-room: restore, communicate, corrective action in the backlog',
        'Rewrite the whole IS the same day',
      ],
      correctIndex: 1,
      frameworkRef: 'scaled agile — Flow / I&A · Project management — Incident · Scrum — adaptation',
      correction:
        'Stabilize, communicate, learn. The fix enters the prioritized backlog.',
    }),
    pm({
      link: 'Pipeline reliability = continuous value.',
      question: 'Red sensor 3 mornings in a row. PM / RTE response?',
      options: [
        'Blame the team in public',
        'System impediment: SLA, retries, runbook, capacity to harden',
        'Disable the DAG to “avoid noise”',
      ],
      correctIndex: 1,
      frameworkRef: 'scaled agile — Flow · Scrum — remove impediments · Project management — Ops',
      correction:
        'Treat the cause and allocate capacity — do not cut the signal.',
    }),
    pm({
      link: 'Resilience: replay and auditability.',
      question: 'Why require a date parameter (ds) on the task?',
      options: [
        'To decorate Airflow',
        'For replay, audit and recovery — delivery-system resilience',
        'To avoid writing AC',
      ],
      correctIndex: 1,
      frameworkRef: 'Project management — Adaptability & resilience · scaled agile — Built-in Quality',
      correction: 'A non-replayable system is not resilient.',
    }),
  ],
}

/** Curated PM QCM by step id. */
export const CURATED_PM_EN: Record<string, StepProjectMgmt> = {
  'l0-open': pm({
    scenarioTwist:
      'Mutualis kick-off: the sponsor pulls the board date forward by 2 weeks. The data team has not opened the CSVs yet.',
    link: 'Discovery / initiation phase: without understanding sources, any plan is theater.',
    question:
      'As PM, which first move best aligns “focus on value” + empiricism?',
    options: [
      'Lock a 40-task Gantt before opening a file',
      'Run a short source discovery (schema) to illuminate backlog and risk',
      'Wait until cloud architecture is 100% signed off',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Focus on value · Scrum — empiricism / Sprint Goal',
    correction:
      'Value starts by reducing useful uncertainty. Source discovery (transparent inspection) illuminates the Product Backlog and the plan. A frozen Gantt before data = project management/Agile anti-pattern.',
  }),
  'l0-filter': pm({
    link: 'After the schema, the “active” business filter becomes a Definition of Done / acceptance criterion in the making.',
    question: 'How do you phrase this filter so it is testable in review (Scrum / project management quality)?',
    options: [
      '“Make it work” with no metric',
      'Measurable criterion: headcount = COUNT active_record=1 (±0 vs reference extract)',
      'Defer the rule to the next Sprint without writing it',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Definition of Done / AC · Project management — Quality',
    correction:
      'Done and quality require verifiable criteria. A quantified AC lets you accept/reject the Increment; “it works” is not inspectable.',
  }),
  'l0-sql': pm({
    scenarioTwist:
      'The HR PO asks for the same KPI in SQL “for IT” while the team had planned pandas only.',
    link: 'Mid-stream need change: adapt the backlog without losing the Product Goal.',
    question: 'Which PM response is healthiest?',
    options: [
      'Say no on principle (tool already chosen)',
      'Clarify the Product Goal, estimate impact, prioritize a SQL story in the backlog',
      'Promise both by Friday with no capacity check',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Product Owner / Backlog · scaled agile — WSJF / capacity · Project management — Change',
    correction:
      'Change is normal. Welcome it via the backlog (transparency), assess cost/risk (project management change / scaled agile capacity), protect the Goal. Promise without capacity = debt and Sprint failure.',
  }),
  'l1-dupes': pm({
    link: 'CRM quality = project risk (scope, reputation, board). The PM must ROAM / escalate.',
    question: 'Email duplicates threaten the unique-customers KPI. Best PM stance?',
    options: [
      'Ignore: “we’ll clean in prod”',
      'Raise as risk (Owned), define mitigation (MDM rule) and Sprint Goal impact',
      'Ask each analyst to dedupe in their personal spreadsheet',
    ],
    correctIndex: 1,
    frameworkRef: 'scaled agile — ROAM · Project management — Risk responses · Scrum — impediment',
    correction:
      'A systemic quality defect is a risk/impediment. ROAM (Owned) + explicit mitigation protects value. Shadow Excel multiplies truths.',
  }),
  'l1-join': pm({
    scenarioTwist:
      'Finance announces that “delivered” will change meaning next week (new WMS status).',
    link: 'Business dependency / KPI definition: integration and interface management.',
    question: 'What do you do immediately as PM?',
    options: [
      'Keep the current JOIN and “we’ll see”',
      'Block/clarify the definition with Finance Owner; update AC and regression risk',
      'Duplicate two secret KPIs to please everyone',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Stakeholder / Integration · Scrum — clarification PO · data governance alignment',
    correction:
      'Definition change = scope/quality impact. Clarify with the Accountable, update AC, communicate. Two same-named KPIs = chaos (BI + DG anti-pattern).',
  }),
  'l1-py-clean': pm({
    link: 'Industrializing a rule = technical enabler + change governance.',
    question: 'How do you prioritize this cleanup in an ART / Scrum team?',
    options: [
      'Leave it as “invisible debt” outside the backlog',
      'Enabler / technical story tied to a benefit (CRM reliability) with allocated capacity',
      'Do it only on weekends outside process',
    ],
    correctIndex: 1,
    frameworkRef: 'scaled agile — Enablers · Scrum — Backlog transparency · Project management — Tailoring',
    correction:
      'Enablers have value (reduce quality risk). They must be visible, estimated, and planned — no shadow work.',
  }),
  'l2-sql': pm({
    link: 'Analytical ingestion: deliver a useful Increment (aggregate) rather than a monolith.',
    question: 'Which delivery slice is most agile / Project management value-driven?',
    options: [
      'Wait for the full data lake before any SELECT',
      'Deliver an inspectable commune aggregate first, then iterate',
      'Open 12 parallel workstreams with no Sprint Goal',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Increment · Project management — Incremental delivery · scaled agile — MVP',
    correction:
      'An inspectable Increment (even small) creates feedback. Waiting for the monolith delays learning; too much WIP destroys focus.',
  }),
  'l2-capteur': pm({
    scenarioTwist:
      'Store Ops escalates: 2 days under threshold undetected — the board wants an “alert SLA” by tomorrow.',
    link: 'Discovery → ops control: urgency vs capacity.',
    question: 'How do you arbitrate the board urgency?',
    options: [
      'Stop everything and code 48h non-stop with no DoD',
      'Negotiate an alert MVP (SQL filter + channel) + AC/SLA; protect the rest of the Goal',
      'Promise a full real-time IS for tomorrow morning',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Sprint Goal protection · scaled agile — MVP · Project management — Negotiate',
    correction:
      'The PM negotiates a minimal viable Increment with clear AC, without sacrificing quality or promising the impossible. The Sprint Goal is protected, not erased.',
  }),
  'l2-foot': pm({
    link: '“Sport” exercise = same mart KPI pattern: formalize the business rule.',
    question: 'Why does the PM insist on a written FTR=H rule?',
    options: [
      'To look nice in Confluence',
      'For testable AC and a shared Definition of Ready/Done',
      'Because the Agile coach demanded it for no reason',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — DoR/DoD · Project management — Requirements quality',
    correction:
      'Without a written rule, the team cannot deliver a coherent “Done” Increment. DoR/DoD and testable requirements reduce rework.',
  }),
  'l2-window': pm({
    scenarioTwist:
      'Two departments want the same KPI name but different grains (slot vs day).',
    link: 'Stakeholder conflict / Product Goal uniqueness.',
    question: 'Best PM facilitation?',
    options: [
      'Pick at random and hide the grain',
      'Split into two named indicators; have Owner decide; document',
      'Ship one ambiguous KPI to “calm” the committee',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — one Product Goal clarity · Project management — Stakeholder engagement · scaled agile — alignment',
    correction:
      'One name, one definition. The PM facilitates Owner arbitration and avoids catch-all indicators that destroy trust.',
  }),
  'l3-json': pm({
    link: 'New IoT source = integration: contracts, risks, emerging architecture.',
    question: 'Before parsing JSON in prod, what do you secure as PM?',
    options: [
      'Nothing: “parse and see”',
      'Schema Owner, breaking-change risks, place in the PI/Sprint backlog',
      'Only the vendor logo in the slide deck',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Integration / Risk · scaled agile — Architectural Runway · Scrum — backlog item',
    correction:
      'Every new interface is an integration risk. Owner + runway + backlog item = controlled delivery.',
  }),
  'l3-py': pm({
    scenarioTwist:
      'GDPR: the DPO asks for purpose and retention of the active-employees file before the next Increment.',
    link: 'Compliance = project constraint, not optional.',
    question: 'How do you integrate the DPO request without breaking flow?',
    options: [
      'Ignore until the audit',
      'Add compliance AC (purpose/retention) and block Done until satisfied',
      'Publish PII in self-service for “transparency”',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Compliance · Scrum — DoD · scaled agile — Guardrails',
    correction:
      'Compliance enters the DoD / AC. Shipping without purpose/retention = legal risk and stewardship failure.',
  }),
  'l3-py-merge': pm({
    link: 'Finance×CRM data product: cross-team dependencies.',
    question: 'Finance and CRM diverge on “delivered”. Role of PM / RTE / PO?',
    options: [
      'Let each team ship its own truth',
      'Facilitate Accountable arbitration; update the shared backlog',
      'Code both JOINs in silence',
    ],
    correctIndex: 1,
    frameworkRef: 'scaled agile — PO Sync / alignment · Scrum — PO · Project management — Conflict management',
    correction:
      'Cross-domain alignment is the delivery system’s job (PO/RTE/PM). Two truths = integration failure.',
  }),
  'l3-dbt': pm({
    link: 'Industrialized transformation: quality in the Definition of Done.',
    question: 'Where do golden-record uniqueness tests belong in the data DoD?',
    options: [
      'Nowhere — “dbt is enough as process”',
      'On the mart (applied rule), required for Increment Done',
      'Only on governance slides',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — DoD · scaled agile — Built-in Quality · Project management — Quality',
    correction:
      'Built-in quality: tests are part of Done. On the mart, they protect the golden record.',
  }),
  'l4-kpi-sql': pm({
    scenarioTwist:
      'The sponsor wants “a nice Power BI map tomorrow” while the reference KPI query does not exist.',
    link: 'Exposition vs truth: value-driven delivery order.',
    question: 'What do you prioritize?',
    options: [
      'The map first, the SQL definition “later”',
      'The query / KPI definition first, then aligned viz',
      'Both in parallel with no Owner',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Focus on value · scaled agile — sequencing · Scrum — Goal',
    correction:
      'Without an executable definition, viz has no reliable value. Sequencing truth → exposition avoids board theater.',
  }),
  'l4-grain': pm({
    link: 'Grain quality incident = issue / realized risk management.',
    question: 'Dashboard that multiplies facts (wrong grain). PM action?',
    options: [
      'Downplay it to the sponsor',
      'Quality incident: withdraw/fix, post-mortem, update grain AC',
      'Add a cosmetic filter and close the ticket',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Issue mgmt · scaled agile — Inspect & Adapt · Scrum — adaptation',
    correction:
      'A grain defect is a quality issue. Transparency, fix, learning (I&A) — no cosmetics.',
  }),
  'l4-pbi': pm({
    link: 'BI certification = analytical Increment acceptance.',
    question: 'When do you accept the Power BI map in review?',
    options: [
      'As soon as the visual looks nice',
      'When it reconciles with the reference SQL query under Owner',
      'When nobody raised a hand in the meeting',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Sprint Review / acceptance · Project management — Validate scope',
    correction:
      'Acceptance is based on AC/DoD (reconciliation), not aesthetics or silence.',
  }),
  'l5-af': pm({
    scenarioTwist:
      'FileSensor timeout three mornings in a row: the board did not get the mart at 7am.',
    link: 'Ops / Run: reliability = continuous value (flow).',
    question: 'Most appropriate PM / RTE response?',
    options: [
      'Blame the data team in public',
      'Treat as system impediment: SLA, retries, runbook escalation, capacity to harden',
      'Disable the DAG to “avoid noise”',
    ],
    correctIndex: 1,
    frameworkRef: 'scaled agile — Flow / Impediment · Scrum — SM removes impediments · Project management — Ops handover',
    correction:
      'Pipeline reliability is a flow objective. Treat the cause (SLA, sensor, escalation), allocate capacity — do not cut the signal.',
  }),
  'l5-transform': pm({
    link: 'Date replay = auditability and resilience (adaptability).',
    question: 'Why does the PM require the {{ ds }} parameter on the task?',
    options: [
      'To decorate Airflow',
      'To enable replay, audit and recovery — delivery-system resilience',
      'To avoid writing AC',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Adaptability & resilience · scaled agile — Built-in Quality',
    correction:
      'A non-replayable system is not resilient. ds makes ops auditable and recoverable — a system quality requirement.',
  }),
  'l5-cap': pm({
    link: 'Lot closure / I&A: RACI and learnings.',
    question: 'For the active-employees mart, which RACI do you present in System Demo / Review?',
    options: [
      'Nobody accountable',
      'Responsible = data engineer; Accountable = HR Data Owner',
      'Accountable = the Airflow tool',
    ],
    correctIndex: 1,
    frameworkRef: 'scaled agile — System Demo / I&A · Project management — Stewardship · Scrum — accountability',
    correction:
      'Roles stay human. Accountable Owner + Responsible delivery = aligned governance and delivery.',
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

function toolHintTwistEn(stepId: string, _intensity: number): string | undefined {
  const id = stepId.toLowerCase()
  if (id.includes('airflow') || id.includes('af')) {
    return 'Twist: the critical DAG is red on board morning.'
  }
  if (id.includes('powerbi') || id.includes('pbi') || id.includes('looker')) {
    return 'Twist: the viz is ready but nobody validated the reference query.'
  }
  if (id.includes('dbt')) {
    return 'Twist: dbt uniqueness tests fail on the golden-record mart.'
  }
  return undefined
}

function ensureTwistEn(
  pack: StepProjectMgmt,
  stepId: string,
  phase: ProjectPhase | undefined,
  intensity: number,
): StepProjectMgmt {
  const seed = hashSeed(`${stepId}|${phase ?? 'x'}|${intensity}`)
  const pool = phase
    ? [...TWISTS_BY_PHASE_EN[phase], ...HUMAN_TWISTS_EN]
    : TWISTS_ANY_EN
  let twist = pack.scenarioTwist ?? pick(pool, seed)
  if (!pack.scenarioTwist && toolHintTwistEn(stepId, intensity)) {
    twist = toolHintTwistEn(stepId, intensity) ?? twist
  }
  if (intensity >= 8) {
    twist = `${twist} M${intensity} pressure: decision expected within 24h, capacity frozen.`
  } else if (intensity >= 6 && !pack.scenarioTwist) {
    twist = `${twist} The PI/Sprint Goal is under tension.`
  }
  return { ...pack, scenarioTwist: twist }
}

export function defaultPmForPhaseEn(
  phase?: ProjectPhase,
  tool?: ToolId,
  stepId = 'anon',
  intensity = 0,
): StepProjectMgmt {
  const seed = hashSeed(`${stepId}|${phase ?? 'any'}|${tool ?? ''}|${intensity}`)
  const ph: ProjectPhase = phase ?? 'cadrage'
  const phaseBank = BANK_EN[ph] ?? BANK_EN.cadrage
  const useHuman = seed % 5 < 2
  const bank = useHuman ? HUMAN_BANK_EN : phaseBank
  const core = pick(bank, seed)
  const rotated = rotateOptions(core, seed >>> 3)
  return ensureTwistEn(rotated, stepId, ph, intensity)
}

/**
 * Resolves the English PM pack for a task.
 * - Curated: dedicated pack + auto twist if missing
 * - Endless / fallback: phase bank + option rotation + intensity twist
 */
export function resolveProjectMgmtEn(
  stepId: string,
  phase?: ProjectPhase,
  tool?: ToolId,
  override?: StepProjectMgmt,
  intensity = 0,
): StepProjectMgmt {
  const base =
    CURATED_PM_EN[stepId] ?? override ?? defaultPmForPhaseEn(phase, tool, stepId, intensity)
  return ensureTwistEn(base, stepId, phase, intensity)
}

export { TWISTS_BY_PHASE_EN, TWISTS_ANY_EN }
