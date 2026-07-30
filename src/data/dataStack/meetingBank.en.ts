/**
 * Simulated meeting bank (EN) — COPROJ, COPIL, Agile/Scrum, COMEX fire.
 * Each meeting offers 5 interactive MCQs. COMEX fire meetings
 * impact fireRisk (negative fireRiskDelta = risk reduction).
 */
import type { MeetingStep } from './pmGovTypes'

// ─── COPROJ — Project committees with the team ───────────────────────────────

const COPROJ_1: MeetingStep = {
  kind: 'coproj',
  title: 'COPROJ #1 — Sprint 1 progress check-in',
  opening:
    'The team gathers in the Kilimanjaro room. Rania (back-end dev), Hugo (data engineer) and Léa (QA) are present. You facilitate the COPROJ. The Sprint is at mid-point.',
  questions: [
    {
      npcLine:
        'Rania: “We’re blocked on the stock-feed API — the endpoint returns XML when we expected JSON. Hugo and I have been stuck since yesterday.”',
      question: 'How do you handle this team blocker in COPROJ?',
      options: [
        'You log the blocker in your RAID log, assign an owner for resolution, and set a 24-hour follow-up.',
        'You send Rania and Hugo off to sort it out themselves — it’s not a COPROJ topic.',
        'You escalate immediately to COMEX for an urgent decision.',
      ],
      correctIndex: 0,
      correction:
        'An effective COPROJ produces concrete actions with an owner and a deadline. The RAID log (Risks, Actions, Issues, Decisions) is the key tool. Escalating to COMEX without attempting internal resolution is premature.',
    },
    {
      npcLine:
        'Hugo: “We’ve closed 3 User Stories out of 8 planned. Actual velocity is 40% below the estimate.”',
      question: 'How do you react to this velocity gap?',
      options: [
        'You analyse the causes (underestimation, blockers, scope creep) and propose adjusting the Sprint backlog with the PO.',
        'You ask the team to work overtime to catch up.',
        'You flag a general delay without investigating the cause or proposing an adjustment.',
      ],
      correctIndex: 0,
      correction:
        'Velocity gaps are normal — what matters is honest inspection (Scrum pillar: Inspection) and fast adaptation. Overtime does not fix a scope or estimation problem.',
    },
    {
      npcLine:
        'Léa: “The automated test pipeline has been broken since the day-before-yesterday’s merge. The last 3 User Stories are untested.”',
      question: 'How do you handle this quality risk?',
      options: [
        'You block delivery of untested stories and open a critical ticket on the pipeline — this is priority technical debt.',
        'You ship the stories anyway — tests can wait until the next Sprint Review.',
        'You ask Léa to manually test every story as an emergency.',
      ],
      correctIndex: 0,
      correction:
        'Definition of Done includes automated tests. An untested story is not “Done”. Shipping untested code accumulates debt and compromises product quality.',
    },
    {
      npcLine:
        'The client (represented by the PO) just added 2 new stories mid-Sprint via a Teams message. They want them in the next Sprint Review.',
      question: 'How do you handle this mid-Sprint scope addition?',
      options: [
        'You explain that the Sprint backlog is locked — new stories go into the Product Backlog and will be prioritised in Sprint Planning.',
        'You accept both stories to please the client, even if other items get dropped.',
        'You ignore the request and say nothing in COPROJ.',
      ],
      correctIndex: 0,
      correction:
        'In Scrum, the Sprint backlog is protected. The Scrum Master (or PM) shields the team from scope creep by directing new requests to the Product Backlog for prioritisation at the next Sprint Planning.',
    },
    {
      npcLine:
        'The COPROJ is ending. Ten minutes left. Everyone expects you to wrap up.',
      question: 'How do you close a COPROJ professionally?',
      options: [
        'You recap decisions taken, actions identified (who does what, by when), and send the minutes within the hour.',
        'You say “All good, see you next meeting” and close the room.',
        'You ask each person to send their own write-up of what they need to do.',
      ],
      correctIndex: 0,
      correction:
        'A COPROJ without minutes is a meeting with no memory. The three deliverables: documented decisions, tracked actions with owner + deadline, immediate distribution.',
    },
  ],
  closing:
    'COPROJ closed. Actions are tracked. The team leaves with clarity on the next 24 hours.',
}

const COPROJ_2: MeetingStep = {
  kind: 'coproj',
  title: 'COPROJ #2 — Interim demo & risks',
  opening:
    'Mid-project. The team presents an interim demo of delivered features. New technical risks are raised.',
  questions: [
    {
      npcLine:
        'Hugo: “Migrating the legacy database to BigQuery is taking three times longer than planned because of the volume of unstructured data.”',
      question: 'How do you handle this schedule risk in COPROJ?',
      options: [
        'You update the risk register, revise the estimate with the team, and propose a contingency plan to COPIL.',
        'You downplay the impact so the team doesn’t panic.',
        'You wait until the delay is confirmed before acting.',
      ],
      correctIndex: 0,
      correction:
        'Proactive risk management is core PM practice. Identify early, quantify impact, propose mitigation — and communicate to COPIL before the risk becomes an incident.',
    },
    {
      npcLine:
        'Rania: “We found a potential security flaw in the authentication module. It’s outside our scope but it’s blocking us.”',
      question: 'How do you handle this out-of-scope blocker?',
      options: [
        'You identify the responsible team, document the dependency in the project plan, and escalate if there’s no response within 48 hours.',
        'You ask Rania to fix the flaw herself to unblock progress.',
        'You press on without waiting — security is a later concern.',
      ],
      correctIndex: 0,
      correction:
        'Cross-team dependencies must be documented and tracked. The PM owns the critical path — escalate quickly on blocking dependencies.',
    },
    {
      npcLine:
        'The interim demo shows that 2 key features do not match business expectations.',
      question: 'What is the right reaction to this business misalignment?',
      options: [
        'You run a reframing workshop with the PO and key users to clarify the real need before continuing.',
        'You quickly fix based on your own interpretation so work can move on.',
        'You ship anyway — the business will adjust its expectations.',
      ],
      correctIndex: 0,
      correction:
        'The interim demo exists precisely to catch misalignment early (Build-Measure-Learn). An immediate reframing workshop avoids weeks of costly rework.',
    },
    {
      npcLine:
        'Léa raises that technical documentation is missing on 60% of delivered modules.',
      question: 'How do you address this documentation gap?',
      options: [
        'You add documentation to the Definition of Done from the next Sprint — a story without docs is not “Done”.',
        'You ask Léa to write the docs herself after each delivery.',
        'You decide docs can wait until the end of the project.',
      ],
      correctIndex: 0,
      correction:
        'Documentation is a deliverable on par with code. Folding it into the DoD now prevents uncontrollable documentation debt at project close.',
    },
    {
      npcLine:
        'The team is tired. Two people have mentioned feeling overloaded.',
      question: 'How do you manage team overload as a PM?',
      options: [
        'You identify the causes (too much parallelism, unclear priorities), adjust the WIP limit, and plan a stabilisation sprint if needed.',
        'You remind the team that deadlines don’t move — fatigue is normal.',
        'You ignore the signal — everyone manages their own pace.',
      ],
      correctIndex: 0,
      correction:
        'Sustainable pace is a core Agile value. An exhausted team produces debt and mistakes. The PM adjusts load proactively.',
    },
  ],
  closing:
    'Risks are documented and actions assigned. COPIL will be informed of the plan adjustments.',
}

const COPROJ_3: MeetingStep = {
  kind: 'coproj',
  title: 'COPROJ #3 — Project close-out',
  opening:
    'Last COPROJ before final delivery. The team reviews the outcome. The project is winding down.',
  questions: [
    {
      npcLine:
        'Hugo: “We delivered 87% of the planned scope. The remaining 13% is non-critical advanced reporting.”',
      question: 'How do you present this outcome to COPIL?',
      options: [
        'You present delivery honestly: scope delivered vs planned, success criteria met, and a plan for the remaining 13% (backlog or drop).',
        'You announce 100% delivery — the 13% wasn’t really in the original scope.',
        'You hide the missing 13% to avoid hard questions.',
      ],
      correctIndex: 0,
      correction:
        'Transparency is non-negotiable in PM. Honest presentation of delivered scope builds long-term trust — even when the result is imperfect.',
    },
    {
      npcLine:
        'Rania: “We should document lessons learned — we made a lot of estimation mistakes.”',
      question: 'How do you organise lessons learned at close-out?',
      options: [
        'You facilitate a structured project retrospective (went well / to improve / actions) and archive the lessons in the knowledge base.',
        'You mentally note the mistakes for the next project.',
        'You avoid the topic — revisiting mistakes demotivates the team.',
      ],
      correctIndex: 0,
      correction:
        'Documented lessons learned are the only way to improve future estimates. A structured close-out retrospective is fundamental PM and Scrum practice.',
    },
    {
      npcLine:
        'The client requests last-minute changes just before final acceptance.',
      question: 'How do you handle these last-minute requests?',
      options: [
        'You apply the change-control process: impact analysis, formal sponsor decision, defer to post-delivery if needed.',
        'You accept to please the client — a few changes cost nothing.',
        'You refuse categorically without impact analysis.',
      ],
      correctIndex: 0,
      correction:
        'Any change in acceptance phase must go through Change Management. Accepting without impact analysis can introduce regressions and delay delivery.',
    },
    {
      npcLine:
        'Léa: “Acceptance testing uncovered 3 critical bugs that weren’t caught earlier.”',
      question: 'How do you decide on delivery with open critical bugs?',
      options: [
        'You block delivery until critical bugs are fixed — shipping defective software creates more problems than a short delay.',
        'You ship anyway and document the bugs for later fix.',
        'You downplay the bugs to the client so the date doesn’t slip.',
      ],
      correctIndex: 0,
      correction:
        'A “critical” bug by definition impacts business value or security. Knowingly shipping without a fix is a professional PM — and contractual — failure.',
    },
    {
      npcLine:
        'The project is done. The team is dispersing. You must formalise close-out.',
      question: 'What are the formal steps of project close-out?',
      options: [
        'Formal client-signed acceptance, archive of deliverables, release of resources, close-out report with final KPIs and lessons learned.',
        'Send a thank-you email to the team and close the Jira tickets.',
        'Wait for the client to raise issues before closing officially.',
      ],
      correctIndex: 0,
      correction:
        'Formal close-out provides legal protection and marks contractual end. It includes signed acceptance, document archiving, and capitalisation of lessons.',
    },
  ],
  closing:
    'Project formally closed. The retrospective is scheduled. The team is released.',
}

// ─── COPIL — Steering committees with COMEX ──────────────────────────────────

const COPIL_1: MeetingStep = {
  kind: 'copil',
  title: 'COPIL #1 — Monthly check-in with COMEX',
  opening:
    'You present project progress to Mutualis Group COMEX. The CIO, CFO and CPO are present. They expect clarity, numbers and decisions.',
  questions: [
    {
      npcLine:
        'CFO: “You’re at 60% of budget spent for 45% of scope delivered. How do you explain that?”',
      question: 'How do you answer this budget question in COPIL?',
      options: [
        'You present the variance analysis (unforeseen technical complexity, legacy debt), the CPI (Cost Performance Index), and a corrective plan with revised milestones.',
        'You blame the team for poor management to protect your credibility.',
        'You downplay the gap by saying it’s “within market norms”.',
      ],
      correctIndex: 0,
      correction:
        'In COPIL, sponsors expect factual data and an action plan — not excuses. CPI and SPI (Schedule Performance Index) are standard project-management indicators (PMBOK).',
    },
    {
      npcLine:
        'CPO: “The plan called for go-live in September. It’s October. When do you actually deliver?”',
      question: 'How do you communicate a revised delivery date?',
      options: [
        'You present the revised date based on measured actual velocity, with assumptions and risk buffers clearly stated.',
        'You give an optimistic date to calm concerns.',
        'You say the date will be shared next week to buy time.',
      ],
      correctIndex: 0,
      correction:
        'A credible revised date rests on real data (velocity, burn-down). Giving a date with no solid basis destroys trust at the next COPIL.',
    },
    {
      npcLine:
        'CIO: “We’re considering cutting this project’s budget by 20% to fund an urgent strategic initiative.”',
      question: 'How do you react to this budget-cut decision?',
      options: [
        'You immediately present the impact analysis on scope and timeline — and ask for a formal decision on what gets sacrificed.',
        'You accept without pushback to avoid tension with leadership.',
        'You refuse categorically and leave the meeting.',
      ],
      correctIndex: 0,
      correction:
        'A budget cut forces a scope/schedule/quality trade-off. The PM presents impacts objectively and obtains a formal decision — not silently absorbs the constraint.',
    },
    {
      npcLine:
        'COMEX wants a real-time tracking dashboard accessible from their phones.',
      question: 'How do you handle this new COMEX request?',
      options: [
        'You log the request as a new need, analyse the impact on the existing backlog, and propose a trade-off at the next COPIL.',
        'You promise the dashboard for the next COPIL without analysing impact.',
        'You explain it’s out of scope and refuse to discuss it.',
      ],
      correctIndex: 0,
      correction:
        'Any new COMEX request must go through change governance. Promising without analysis creates uncontrolled expectations and jeopardises the plan.',
    },
    {
      npcLine:
        'End of COPIL. COMEX expects a decision summary before leaving.',
      question: 'What format do you use to close the COPIL?',
      options: [
        'A 2-minute executive summary: RAG status, 3 decisions taken, 3 actions with owners, next COPIL dated.',
        'You ask each team member to present their own summary.',
        'You hand out a 20-page report and leave without an oral wrap-up.',
      ],
      correctIndex: 0,
      correction:
        'COMEX thinks in synthesis, not detail. A RAG (Red-Amber-Green) summary + decisions + actions is the executive reporting standard.',
    },
  ],
  closing:
    'COPIL closed. Decisions are recorded. COMEX leaves with visibility.',
}

const COPIL_2: MeetingStep = {
  kind: 'copil',
  title: 'COPIL #2 — Strategic risk review',
  opening:
    'This exceptional COPIL is called after data-security warning signs and rising competitive pressure.',
  questions: [
    {
      npcLine:
        'CIO: “Our security audit found access-management flaws on the project. The CISO is asking for a project pause.”',
      question: 'How do you handle this security-pause request?',
      options: [
        'You support a full audit decision, identify at-risk components, and propose a remediation plan with a timeline.',
        'You oppose the pause — it will delay the schedule.',
        'You downplay the flaws so COMEX doesn’t panic.',
      ],
      correctIndex: 0,
      correction:
        'Security is never negotiable. Supporting a targeted pause and proposing a fast remediation plan shows PM maturity and protects the company.',
    },
    {
      npcLine:
        'CPO: “A competitor just launched a feature similar to ours. Should we accelerate or pivot?”',
      question: 'How do you facilitate this strategic decision in COPIL?',
      options: [
        'You present a quick analysis (time-to-market vs quality, possible differentiation) and ask COMEX for a formal direction decision.',
        'You decide alone to accelerate to show responsiveness.',
        'You propose abandoning the project and copying the competitor’s solution.',
      ],
      correctIndex: 0,
      correction:
        'Strategic decisions belong to COMEX. The PM brings factual analysis and options, not the final call. That is project governance.',
    },
    {
      npcLine:
        'CFO: “We have an external funding opportunity if we can demonstrate an MVP in 6 weeks.”',
      question: 'How do you assess the feasibility of a 6-week MVP?',
      options: [
        'You identify the minimal viable scope with the team, estimate honestly on actual velocity, and present success conditions and risks.',
        'You say yes immediately so you don’t miss the opportunity.',
        'You say it’s impossible without even analysing.',
      ],
      correctIndex: 0,
      correction:
        'An MVP commitment must rest on an honest estimate. A “yes” without analysis creates a promise you can’t keep — which destroys trust more than saying no.',
    },
    {
      npcLine:
        'A COMEX member proposes changing the technical architecture mid-project.',
      question: 'How do you handle this architecture proposal in COPIL?',
      options: [
        'You document the proposal, ask the team for a technical impact analysis, and schedule a formal decision within 5 business days.',
        'You accept immediately to satisfy COMEX.',
        'You reject the proposal without analysis — changing architecture is too risky.',
      ],
      correctIndex: 0,
      correction:
        'An architecture change mid-project has major impact. It requires structured impact analysis before any decision — neither blind acceptance nor reflexive refusal.',
    },
    {
      npcLine:
        'COMEX asks to add 3 people to the team to accelerate.',
      question: 'What is your response on adding resources mid-project?',
      options: [
        'You recall Brooks’s Law (adding people to a late project makes it later in the short term) and propose progressive integration with an onboarding plan.',
        'You accept the 3 people enthusiastically — more resources means more productivity.',
        'You refuse — the current team doesn’t want newcomers.',
      ],
      correctIndex: 0,
      correction:
        'Brooks’s Law is real: newcomers cost integration time from the existing team. A progressive onboarding plan is essential.',
    },
  ],
  closing:
    'Strategic risks are decided. The project restarts on a more secure footing.',
}

const COPIL_3: MeetingStep = {
  kind: 'copil',
  title: 'COPIL #3 — Year-end review & trajectory',
  opening:
    'Year-end COPIL. COMEX assesses data-project portfolio performance and sets direction for the year ahead.',
  questions: [
    {
      npcLine:
        'CEO: “What is the real ROI of our data projects this year?”',
      question: 'How do you present data-project ROI to COMEX?',
      options: [
        'You present measurable indicators: reduced processing time, cost avoided, additional revenue, user satisfaction — with assumptions clearly stated.',
        'You present only technical successes without mentioning costs.',
        'You say data-project ROI cannot be measured in the short term.',
      ],
      correctIndex: 0,
      correction:
        'COMEX thinks in business value. Presenting ROI with concrete metrics (time, cost, revenue) and transparent assumptions is the language of executive reporting.',
    },
    {
      npcLine:
        'CIO: “We want to go 100% Agile next year. What does that imply?”',
      question: 'How do you present Agile transformation to COMEX?',
      options: [
        'You explain the prerequisites (training, governance change, new rituals), expected benefits, and risks of a poorly run transformation.',
        'You say Agile is simple — just run Sprints.',
        'You oppose the transformation — the current project mode works fine.',
      ],
      correctIndex: 0,
      correction:
        'Agile transformation is a deep organisational change. COMEX must understand the real implications (governance, culture, skills) to make an informed decision.',
    },
    {
      npcLine:
        'CPO: “We have 12 projects running in parallel. How do we prioritise?”',
      question: 'What method do you propose to prioritise the portfolio?',
      options: [
        'A value/effort matrix with weighted criteria (business impact, risk, dependencies), validated by COMEX and updated quarterly.',
        'Each director keeps their projects — we change nothing.',
        'We randomly stop 50% of projects to reduce overload.',
      ],
      correctIndex: 0,
      correction:
        'Portfolio prioritisation is a strategic governance exercise. A transparent value/effort matrix with explicit criteria is the foundation of programme management.',
    },
    {
      npcLine:
        'A director challenges the Scrum methodology — they prefer returning to waterfall.',
      question: 'How do you defend the methodological choice in COPIL?',
      options: [
        'You present concrete data on Scrum gains on this project, and propose adapting the methodology rather than replacing it.',
        'You yield immediately so you don’t upset the director.',
        'You attack the director by saying waterfall is obsolete.',
      ],
      correctIndex: 0,
      correction:
        'Methodological decisions must be data-based, not preference-based. Proposing adaptations is more constructive than rigid defence or capitulation.',
    },
    {
      npcLine:
        'COMEX asks for your next-year plan in 60 seconds.',
      question: 'How do you structure a 60-second annual plan pitch?',
      options: [
        'Key business objectives → 3 priority initiatives → required resources → first milestone in 90 days.',
        'You race through all 15 slides of your PowerPoint.',
        'You ask for a postponement — 60 seconds isn’t enough for an annual plan.',
      ],
      correctIndex: 0,
      correction:
        'The elevator pitch for an annual plan: objectives → initiatives → resources → first milestone. Sixty seconds is enough if the structure is clear. COMEX values concision.',
    },
  ],
  closing:
    'The annual trajectory is validated. Major directions are set for the year ahead.',
}

// ─── SCRUM — Agile events ────────────────────────────────────────────────────

const SPRINT_PLANNING: MeetingStep = {
  kind: 'sprint-planning',
  title: 'Sprint Planning — Sprint 4',
  opening:
    'The team meets to plan Sprint 4. Product Backlog refined, velocity known (38 points average over the last 3 sprints). You facilitate.',
  questions: [
    {
      npcLine:
        'The team asks: “How many points do we take this Sprint? The end-of-month deadline is approaching.”',
      question: 'How do you determine Sprint capacity?',
      options: [
        'You base it on historical velocity (38 pts) adjusted for known leave and absences — not on management wishes.',
        'You take 60 points to show ambition to COMEX.',
        'You let management decide the capacity.',
      ],
      correctIndex: 0,
      correction:
        'Sprint capacity is set by real historical velocity, not external pressure. Over-committing destroys trust and quality.',
    },
    {
      npcLine:
        'The PO wants to put 2 vague User Stories (no acceptance criteria) into the Sprint.',
      question: 'How do you handle stories without acceptance criteria in Sprint Planning?',
      options: [
        'You block those stories until acceptance criteria are clear and agreed by the team — otherwise the team doesn’t know what it’s delivering.',
        'You accept them so planning doesn’t slow down.',
        'You ask the team to guess the criteria during the Sprint.',
      ],
      correctIndex: 0,
      correction:
        'A User Story without acceptance criteria cannot enter a Sprint. Definition of Ready requires clear, independent, estimable criteria (INVEST).',
    },
    {
      npcLine:
        'A developer flags a critical technical dependency on the infrastructure team, who won’t be available until mid-Sprint.',
      question: 'How do you handle this dependency in Sprint Planning?',
      options: [
        'You adjust the Sprint Goal to exclude stories blocked by this dependency — or start with independent stories and plan dependency resolution.',
        'You ignore the dependency and hope infra will be available in time.',
        'You postpone the entire Sprint until infra is available.',
      ],
      correctIndex: 0,
      correction:
        'Dependencies must be identified and managed in Sprint Planning. A clear, realistic Sprint Goal excludes stories blocked by unresolved dependencies.',
    },
    {
      npcLine:
        'The team has debated a complex story’s estimate for 45 minutes. Planning Poker is stuck.',
      question: 'How do you unblock a stuck Planning Poker estimate?',
      options: [
        'You use a “spike”: a 2-day time-boxed technical investigation to reduce uncertainty, then re-estimate.',
        'You impose the highest estimate to be safe.',
        'You pull the story from the Sprint to stop wasting time.',
      ],
      correctIndex: 0,
      correction:
        'A spike is a time-boxed exploration story to reduce technical uncertainty. It is the appropriate Scrum response when the team cannot estimate for lack of information.',
    },
    {
      npcLine:
        'At the end of Sprint Planning, the Sprint Goal is still not formulated.',
      question: 'Why is the Sprint Goal essential and how do you formulate it?',
      options: [
        'The Sprint Goal gives the team a coherent objective: one sentence expressing the value to deliver this Sprint, validated jointly by the PO and the team.',
        'The Sprint Goal is optional — the story list is enough.',
        'You copy the previous Sprint’s Goal to save time.',
      ],
      correctIndex: 0,
      correction:
        'The Sprint Goal is the “why” of the Sprint. It lets the team make autonomous decisions when the unexpected happens. Without it, the team executes without understanding the value created.',
    },
  ],
  closing:
    'Sprint Planning done. The Sprint Goal is validated. The team starts with a clear vision.',
}

const DAILY_SCRUM: MeetingStep = {
  kind: 'daily',
  title: 'Daily Scrum — Sprint 4, Day 5',
  opening:
    '15-minute Daily Scrum. The team syncs. Hugo seems blocked since yesterday.',
  questions: [
    {
      npcLine:
        'Hugo: “Yesterday I worked on the migration, today I continue. Nothing blocking.” — but his face says otherwise.',
      question: 'How do you handle a non-verbal blocker signal in Daily?',
      options: [
        'You note the signal, let the Daily finish in 15 minutes, and invite Hugo to a quick 1:1 right after.',
        'You grill Hugo at length during the Daily in front of the whole team.',
        'You ignore it — if Hugo says nothing, everything is fine.',
      ],
      correctIndex: 0,
      correction:
        'Daily is not a problem-solving session — it is a sync. Blockers are handled in 1:1 or a small group after Daily (“After-party”).',
    },
    {
      npcLine:
        'Rania: “Daily takes 30 minutes every morning — people talk about everything and nothing.”',
      question: 'How do you reset a Daily that overruns its time-box?',
      options: [
        'You recall the 3 Scrum questions (yesterday / today / blocker), time-box each person to 2 minutes, and park off-topic discussions after Daily.',
        'You cancel Daily — it’s useless.',
        'You let it run — freedom of expression matters.',
      ],
      correctIndex: 0,
      correction:
        'The 15-minute Daily is a strict time-box. The 3 questions focus sync toward the Sprint Goal — not detailed status. The Scrum Master owns the format.',
    },
    {
      npcLine:
        'Léa: “I’ve been blocked since last night on a build bug. I’ve tried 3 different solutions.”',
      question: 'How do you handle this technical blocker in Daily?',
      options: [
        'You identify who can help Léa (expert dev or architect), organise a 30-minute mob-debugging session after Daily, and put the blocker on the Scrum Board.',
        'You ask Léa to keep searching alone until noon.',
        'You escalate the bug immediately to COMEX.',
      ],
      correctIndex: 0,
      correction:
        'Blockers must be resolved quickly. The Scrum Master (or PM) facilitates resolution by finding the right resource and time-boxing the fix.',
    },
    {
      npcLine:
        'Management attends Daily and starts asking detailed progress questions.',
      question: 'How do you handle intrusive management presence in Daily?',
      options: [
        'You politely explain that Daily is a development-team event — management may observe silently but not intervene.',
        'You yield and let management dominate Daily.',
        'You ask management to leave the meeting.',
      ],
      correctIndex: 0,
      correction:
        'Daily Scrum is for developers. Management may be a “chicken” (observer) but not a “pig” (decision-making participant). This is a fundamental Scrum rule.',
    },
    {
      npcLine:
        'End of Daily. The Sprint Burndown shows a 30% slip over the first 3 days.',
      question: 'How do you interpret and react to this Burndown slip?',
      options: [
        'You run a quick team huddle to identify the cause (bad estimate, unforeseen complexity, blocker) and adjust the Sprint plan if needed.',
        'You panic and send an alarm email to COMEX.',
        'You ignore it — 3 days is too early to worry.',
      ],
      correctIndex: 0,
      correction:
        'A 30% slip by Day 3 is a warning signal to inspect without drama. Fast adaptation (Scrum pillar: Adaptation) prevents the situation from worsening until Sprint Review.',
    },
  ],
  closing:
    'Daily done in 14 minutes. The team is synced. Blockers have an owner.',
}

const SPRINT_REVIEW: MeetingStep = {
  kind: 'sprint-review',
  title: 'Sprint Review — Sprint 4',
  opening:
    'Sprint Review brings together the team and key stakeholders. We demo what was delivered this Sprint. The PO accepts or rejects each increment.',
  questions: [
    {
      npcLine:
        'PO: “This User Story is technically ready but it doesn’t match what I had in mind.”',
      question: 'How do you handle a story rejection in Sprint Review?',
      options: [
        'You accept the rejection, capture the PO’s clarifications, return the story to the Product Backlog with updated acceptance criteria, and schedule re-refinement.',
        'You defend the story at all costs — the team worked hard.',
        'You ship it anyway without PO validation.',
      ],
      correctIndex: 0,
      correction:
        'The PO has the final say on story acceptance. A rejection in Sprint Review is valuable information — not a failure. That feedback loop is what makes Agile effective.',
    },
    {
      npcLine:
        'A stakeholder proposes many new features during the demo.',
      question: 'How do you capture these new ideas without disrupting Sprint Review?',
      options: [
        'You note every idea in a dedicated idea backlog, thank people for the feedback, and schedule backlog refinement to analyse them with the PO.',
        'You accept every idea live and promise delivery next Sprint.',
        'You ignore the ideas so you don’t disrupt Sprint Review.',
      ],
      correctIndex: 0,
      correction:
        'Sprint Review generates valuable feedback. All ideas deserve capture — but prioritisation belongs to the PO in refinement, not during the meeting.',
    },
    {
      npcLine:
        'The team delivered 32 points out of 38 planned. The PO asks for an explanation.',
      question: 'How do you present an incomplete Sprint in Sprint Review?',
      options: [
        'You honestly present what is “Done” per the DoD, explain why the 6 points weren’t delivered, and propose how to handle them next Sprint.',
        'You present work-in-progress as “delivered” to hit 38 points.',
        'You blame a team member to justify the shortfall.',
      ],
      correctIndex: 0,
      correction:
        'Transparency in Sprint Review is fundamental. Presenting work-in-progress as “Done” is Agile fraud that undermines trust and distorts metrics.',
    },
    {
      npcLine:
        'The Product Backlog hasn’t been updated in 2 Sprints. The PO is overwhelmed.',
      question: 'How do you help keep a healthy Product Backlog?',
      options: [
        'You schedule regular Backlog Refinement sessions (at least 10% of Sprint capacity) and help the PO structure those sessions.',
        'You take over the Product Backlog in place of the PO.',
        'You wait for the PO to do it on their own without getting involved.',
      ],
      correctIndex: 0,
      correction:
        'Backlog Refinement is a continuous Scrum activity. The Scrum Master helps the PO keep it current — without taking over product ownership.',
    },
    {
      npcLine:
        'At the end of Sprint Review, stakeholders seem satisfied but disengaged.',
      question: 'How do you strengthen stakeholder engagement in the Agile process?',
      options: [
        'You invite them to try the increment themselves, create moments of direct product interaction, and explain how their feedback shapes the next Sprint.',
        'You email them a Sprint Review report instead.',
        'You reduce Sprint Review frequency so you don’t mobilise them too often.',
      ],
      correctIndex: 0,
      correction:
        'Stakeholder engagement is a critical Agile success factor. Letting them touch the product and see the direct impact of their feedback deepens involvement.',
    },
  ],
  closing:
    'Sprint Review finished. The increment is presented. The backlog is updated.',
}

const SPRINT_RETRO: MeetingStep = {
  kind: 'sprint-retro',
  title: 'Sprint Retrospective — Sprint 4',
  opening:
    'The Retrospective is for the Scrum team only. A safe space to speak frankly about what worked and what must change.',
  questions: [
    {
      npcLine:
        'Hugo: “I want us to talk about estimates — we’ve been wrong all year.”',
      question: 'How do you facilitate an estimation discussion in retro?',
      options: [
        'You analyse historical data (estimate vs actual gap), identify patterns (poor splitting, hidden complexity), and propose an experiment for the next Sprint.',
        'You defend past estimates — the team did its best.',
        'You propose stopping estimates to avoid the problem.',
      ],
      correctIndex: 0,
      correction:
        'Improving estimates comes from data analysis, not from dropping estimates. Retro is the ideal place to spot gap patterns and experiment.',
    },
    {
      npcLine:
        'The retrospective atmosphere is tense — two people have an open conflict.',
      question: 'How do you handle interpersonal conflict in Retrospective?',
      options: [
        'You refocus discussion on systems and processes (not people), recall the Prime Directive, and offer a mediation 1:1 outside the retro if needed.',
        'You take sides with one of the two people.',
        'You cancel the retrospective to avoid the conflict.',
      ],
      correctIndex: 0,
      correction:
        'The Retrospective Prime Directive: “Everyone did the best job they could given what they knew.” Focus on system improvements, not personal blame.',
    },
    {
      npcLine:
        'Léa: “We identify the same problems every Sprint but nothing ever changes.”',
      question: 'How do you make retrospectives truly actionable?',
      options: [
        'You limit actions to a maximum of 2–3 items per Sprint, assign an owner to each, put them in the Sprint Backlog, and check at the next retro.',
        'You keep listing every problem and hope something changes.',
        'You stop retrospectives — they’re useless.',
      ],
      correctIndex: 0,
      correction:
        'An effective Retrospective produces 2–3 actions max with owner and deadline. Too many actions = no action. Putting them in the Sprint Backlog guarantees execution.',
    },
    {
      npcLine:
        'Rania: “The dev environment has been unstable for 2 Sprints — it’s slowing us down massively.”',
      question: 'How do you handle a recurring environment problem in Retrospective?',
      options: [
        'You escalate this infrastructure blocker as a formal impediment to management (outside the team’s control), with quantified velocity impact and a request for resolution within 1 week.',
        'You ask the team to adapt to the unstable environment.',
        'You note the problem in the retro but don’t escalate.',
      ],
      correctIndex: 0,
      correction:
        'Impediments outside the team’s control must be escalated by the Scrum Master. An unstable environment is a systemic impediment that directly hits velocity.',
    },
    {
      npcLine:
        'At the end of the Retrospective, the team feels more cohesive than at the start.',
      question: 'How do you capitalise on this positive dynamic at the end of retro?',
      options: [
        'You explicitly celebrate what went well this Sprint, frame actions as positive experiments, and close on a hopeful, team-oriented note.',
        'You move straight into other meetings without marking the close.',
        'You say nothing — emotions have no place in Scrum.',
      ],
      correctIndex: 0,
      correction:
        'Ending Retrospective on a positive note with concrete celebrations strengthens team cohesion. The Scrum Master is also a host — not only a process facilitator.',
    },
  ],
  closing:
    'Retrospective done. 3 concrete actions. The team leaves with energy.',
}

// ─── COMEX fire — Interactive disciplinary meetings ──────────────────────────

const COMEX_DANGER: MeetingStep = {
  kind: 'comex-danger',
  title: 'COMEX signal — Informal summons',
  opening:
    'HR has called you for an informal interview. Beside them: the CTO and your manager. The atmosphere is cold. Your risk rate just hit 50%. Every answer counts.',
  questions: [
    {
      npcLine:
        'HR: “Several deliverables weren’t validated in recent sprints. COMEX is worried about the consistency of your results. What happened?”',
      question: 'How do you answer this question in a disciplinary interview?',
      options: [
        'You acknowledge the difficulties, explain technical or contextual causes without deflecting blame, and present a concrete improvement plan.',
        'You minimise the problems: “It wasn’t that serious, everyone makes mistakes.”',
        'You blame the team or the tools to justify the failures.',
      ],
      correctIndex: 0,
      correction:
        'Owning difficulties and proposing a corrective plan shows professional maturity. Minimising or shifting responsibility makes the situation worse.',
      fireRiskDelta: -8,
    },
    {
      npcLine:
        'CTO: “Your technical mastery is being questioned by some team members. How do you assess yourself?”',
      question: 'How do you handle a challenge to your skills?',
      options: [
        'You give an honest assessment of your strengths and growth areas, and propose a concrete upskilling plan (training, mentoring, pair programming).',
        'You contest your colleagues’ views and defend your level at all costs.',
        'You claim you have no gaps so you don’t look weak.',
      ],
      correctIndex: 0,
      correction:
        'Constructive self-critique and a personal development plan demonstrate emotional intelligence. Denying gaps in a performance interview is counterproductive.',
      fireRiskDelta: -7,
    },
    {
      npcLine:
        'Manager: “What can you commit to doing differently starting now?”',
      question: 'How do you formulate a credible professional commitment?',
      options: [
        'You propose 2–3 SMART commitments (Specific, Measurable, Achievable, Realistic, Time-bound) with clear success indicators.',
        'You make vague general promises: “I’ll improve, I promise.”',
        'You ask them to set your objectives for you.',
      ],
      correctIndex: 0,
      correction:
        'A credible commitment is SMART and verifiable. Fuzzy promises don’t reassure management — they signal the absence of a real plan.',
      fireRiskDelta: -9,
    },
    {
      npcLine:
        'HR: “To what extent do you feel you contributed to the team’s difficulties?”',
      question: 'How do you assess your share of responsibility in collective difficulties?',
      options: [
        'You objectively acknowledge your part (insufficient communication, overly optimistic estimates) without self-flagellation or blaming everything external.',
        'You say you have no responsibility — it’s entirely others’ fault.',
        'You say it’s 100% your fault to appear humble.',
      ],
      correctIndex: 0,
      correction:
        'Shared, calibrated responsibility marks a mature professional. Neither self-flagellation nor denial — a balanced analysis of causes.',
      fireRiskDelta: -6,
    },
    {
      npcLine:
        'CTO: “Give us a concrete reason to keep investing in you.”',
      question: 'How do you defend your value under pressure?',
      options: [
        'You cite recent concrete contributions (successful deliverables, problems solved, value delivered) and project what you can bring over the next 3 months.',
        'You say you work hard and deserve a chance.',
        'You cry or get angry at the question.',
      ],
      correctIndex: 0,
      correction:
        'Value is demonstrated with concrete facts. “I work hard” is not an argument — deliverables, problem resolutions and a forward view are.',
      fireRiskDelta: -10,
    },
  ],
  closing:
    'The interview ends. HR notes your answers. Your responses have influenced COMEX’s perception.',
}

const COMEX_WARNING: MeetingStep = {
  kind: 'comex-warning',
  title: 'COMEX — Formal performance review interview',
  opening:
    'Official summons to the CEO’s office. The file is on the table. Your termination risk is at 75%. Every answer can tip the decision.',
  questions: [
    {
      npcLine:
        'CEO: “We’ve called you in following a series of repeated shortcomings. Are you aware of how serious the situation is?”',
      question: 'How do you respond to this direct warning?',
      options: [
        'You confirm full awareness of the seriousness, acknowledge the specific shortcomings, and ask for the chance to present your corrective plan.',
        'You contest the “repeated shortcomings” label point by point.',
        'You ask for your lawyer to be present before answering.',
      ],
      correctIndex: 0,
      correction:
        'In a formal performance review interview, acknowledging the seriousness without immediately defending yourself is the expected professional posture. Immediate contestation worsens perception.',
      fireRiskDelta: -10,
    },
    {
      npcLine:
        'HR: “What concrete steps have you taken to improve your performance since our last interview?”',
      question: 'How do you demonstrate concrete improvement under pressure?',
      options: [
        'You present factual evidence: successful deliverables, recent positive feedback, training completed, improved indicators.',
        'You say you tried but working conditions didn’t help.',
        'You’ve done nothing and ask for more time.',
      ],
      correctIndex: 0,
      correction:
        'Factual evidence is the only credible argument in a performance review interview. Without concrete data, a promise to improve is seen as empty talk.',
      fireRiskDelta: -12,
    },
    {
      npcLine:
        'CEO: “If we decide to keep you in the company, what are your precise commitments for the next 30 days?”',
      question: 'How do you formulate a 30-day action plan in a crisis situation?',
      options: [
        'You propose measurable weekly objectives, interim checkpoints, and a performance review at Day+30 with success indicators defined together.',
        'You promise to “do everything to satisfy you” without detail.',
        'You ask for 60 days instead of 30 for more room.',
      ],
      correctIndex: 0,
      correction:
        'A credible 30-day plan is precise, measurable, and has checkpoints. Ambiguity on commitments in a disciplinary context is disqualifying.',
      fireRiskDelta: -11,
    },
    {
      npcLine:
        'HR: “Your colleagues have reported difficulties collaborating with you. How do you explain that?”',
      question: 'How do you handle negative feedback on collaboration?',
      options: [
        'You listen without interrupting, acknowledge that your communication may have been perceived differently from your intent, and propose concrete actions to improve team dynamics.',
        'You deny the difficulties and say your colleagues are exaggerating.',
        'You ask to confront the colleagues who gave that feedback directly.',
      ],
      correctIndex: 0,
      correction:
        'The gap between intent and impact is real. Acknowledging that your communication may have created difficulties — even unintentionally — is the mature posture expected.',
      fireRiskDelta: -8,
    },
    {
      npcLine:
        'CEO: “We’re going to deliberate. Do you have anything to add before we withdraw?”',
      question: 'What is your last intervention before deliberation?',
      options: [
        'You reaffirm your commitment to the Mutualis project, summarise the actions you’ve committed to, and thank COMEX for the opportunity to speak.',
        'You plead emotionally and justify yourself at length.',
        'You stay completely silent to show dignity.',
      ],
      correctIndex: 0,
      correction:
        'The final intervention is a synthesis opportunity. Reaffirming commitment and concrete actions leaves an impression of an organised, determined professional.',
      fireRiskDelta: -9,
    },
  ],
  closing:
    'COMEX deliberates. Your answers weighed in the balance. The decision will be communicated.',
}

const COMEX_NOTICE: MeetingStep = {
  kind: 'comex-notice',
  title: 'COMEX — Pre-termination interview',
  opening:
    'Pre-termination interview. HR and the CEO face you. An employee advisor is present at your request. Risk: 80%. Everything is on the line now.',
  questions: [
    {
      npcLine:
        'HR: “We have convened this interview in accordance with Article L1232-2 of the French Labour Code. Management is considering ending your contract for insufficient results.”',
      question: 'What is your reaction to the opening of this pre-termination interview?',
      options: [
        'You listen carefully to the alleged facts, take notes, and reserve your response for the contradiction phase — that is the legal procedure.',
        'You interrupt immediately to contest the facts.',
        'You leave the meeting without answering.',
      ],
      correctIndex: 0,
      correction:
        'The pre-termination interview follows a legal protocol: presentation of facts, then the employee’s right of reply. Listening first and taking notes is sound legal and professional practice.',
      fireRiskDelta: -12,
    },
    {
      npcLine:
        'CEO: “The alleged facts are: 3 missed deliverables, 2 late reports, and a failure to communicate a critical blocker. How do you respond?”',
      question: 'How do you contest or nuance the alleged facts professionally?',
      options: [
        'You restate the facts precisely: you contest what is inaccurate with evidence, contextualise what is partial, and acknowledge what is founded.',
        'You contest every alleged fact wholesale.',
        'You accept everything without nuance to avoid conflict.',
      ],
      correctIndex: 0,
      correction:
        'An effective defence in a pre-termination interview is factual and nuanced. Contesting everything without evidence or accepting everything wholesale are two symmetrical mistakes.',
      fireRiskDelta: -13,
    },
    {
      npcLine:
        'HR: “Do you have contextual elements you wish to bring to our attention?”',
      question: 'What contextual elements can you bring to nuance the situation?',
      options: [
        'You present structural constraints (workload, insufficient resources, blocking dependencies) without using them as excuses, but as information.',
        'You directly accuse management of being responsible for your failures.',
        'You say nothing — context doesn’t matter.',
      ],
      correctIndex: 0,
      correction:
        'Context is relevant but must not be used as a free pass. Presenting structural constraints factually helps nuance the case without appearing irresponsible.',
      fireRiskDelta: -10,
    },
    {
      npcLine:
        'CEO: “If we decide not to proceed with termination, what guarantees can you give us?”',
      question: 'How do you formulate credible guarantees in a pre-notice situation?',
      options: [
        'You propose a formal 60-day performance plan with precise objectives, weekly control milestones, and a review clause after 30 days.',
        'You swear it will never happen again.',
        'You ask for a role or manager change as a condition.',
      ],
      correctIndex: 0,
      correction:
        'A formalised performance plan is the only credible guarantee in a pre-notice situation. It must be precise, measurable, and request close follow-up — showing you take the situation seriously.',
      fireRiskDelta: -15,
    },
    {
      npcLine:
        'The interview is ending. HR: “Do you have any further elements to contribute to our deliberation?”',
      question: 'How do you close this pre-termination interview optimally?',
      options: [
        'You summarise your 3 main arguments, confirm your immediate availability to implement the performance plan, and thank them for a fair process.',
        'You cry to emotionally move the decision-makers.',
        'You ask for an immediate decision so you’re not left in uncertainty.',
      ],
      correctIndex: 0,
      correction:
        'A structured, professional close leaves a final impression of seriousness. Emotional management is key — neither demonstrative distress nor distant coldness.',
      fireRiskDelta: -11,
    },
  ],
  closing:
    'The pre-termination interview is over. COMEX has 2 business days to notify its decision. Your answers may have made the difference.',
}

const COMEX_FIRED: MeetingStep = {
  kind: 'comex-fired',
  title: 'COMEX — Termination meeting',
  opening:
    'Final summons. The letter is on the table. Risk at 100%. But one last chance remains: your answers could convince COMEX to reconsider its decision.',
  questions: [
    {
      npcLine:
        'CEO: “The termination decision has been made. Would you like to speak one last time?”',
      question: 'How do you position yourself facing an announced termination decision?',
      options: [
        'You stay calm, ask about procedure modalities, state your intention to contest if you believe the decision is unfounded, and keep your dignity.',
        'You break down in tears or anger.',
        'You accept immediately without responding.',
      ],
      correctIndex: 0,
      correction:
        'Dignity and composure in a termination situation are qualities that can still influence the final decision or exit terms. Uncontrolled emotional reaction hurts.',
      fireRiskDelta: -15,
    },
    {
      npcLine:
        'HR: “Are you aware that you have exhausted all the opportunities you were given?”',
      question: 'How do you answer this question about missed opportunities?',
      options: [
        'You honestly acknowledge the opportunities you didn’t seize while highlighting where you did progress — a balanced, factual answer.',
        'You say you never had a real chance.',
        'You attack leadership for the conditions imposed.',
      ],
      correctIndex: 0,
      correction:
        'Acknowledging shortcomings while highlighting real progress is the most credible posture. It can still influence exit terms (outplacement, notice) even if the decision is made.',
      fireRiskDelta: -12,
    },
    {
      npcLine:
        'CTO: “If we gave you one last chance, what would concretely change compared to previous times?”',
      question: 'What answer can still convince COMEX to reconsider the decision?',
      options: [
        'You present a radical, verifiable change in working method, with weekly outcome indicators and a probation period under close supervision that you voluntarily accept.',
        'You repeat the same promises from previous interviews.',
        'You say the situation was impossible and nobody could have succeeded.',
      ],
      correctIndex: 0,
      correction:
        'A radical, verifiable change with voluntary supervision is the only argument that can still weigh. Repeating past promises or blaming the outside seals the decision.',
      fireRiskDelta: -18,
    },
    {
      npcLine:
        'HR: “Your behaviour toward colleagues has been flagged as problematic. What do you think of that assessment?”',
      question: 'How do you address the relational dimension in this final interview?',
      options: [
        'You acknowledge the impact your behaviour may have had on colleagues, apologise sincerely, and propose concrete ways to repair relationships.',
        'You deny relational problems — colleagues can’t testify against you.',
        'You ask for the names of those who testified so you can confront them.',
      ],
      correctIndex: 0,
      correction:
        'Sincere apologies with concrete repair proposals demonstrate emotional and social intelligence. Denying or seeking to confront witnesses irreversibly worsens the situation.',
      fireRiskDelta: -14,
    },
    {
      npcLine:
        'COMEX confers quietly. CEO: “We’ll give you a few minutes.” — they return 5 minutes later.',
      question: 'How do you handle this decisive wait?',
      options: [
        'You stay calm and composed, mentally prepare for both scenarios (retention or exit), and remember that your reaction to the final announcement is also part of the evaluation.',
        'You start sending panicked messages to your contacts.',
        'You ask to leave the room during deliberation.',
      ],
      correctIndex: 0,
      correction:
        'How you handle stressful waiting is itself observed. A professional who is calm and prepared for both scenarios shows emotional maturity that can still work in their favour.',
      fireRiskDelta: -16,
    },
  ],
  closing:
    'COMEX returns. The final decision has been influenced by your answers. Your choices counted.',
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export const COPROJ_BANK_EN: readonly MeetingStep[] = [COPROJ_1, COPROJ_2, COPROJ_3]
export const COPIL_BANK_EN: readonly MeetingStep[] = [COPIL_1, COPIL_2, COPIL_3]
export const SCRUM_BANK_EN: readonly MeetingStep[] = [
  SPRINT_PLANNING,
  DAILY_SCRUM,
  SPRINT_REVIEW,
  SPRINT_RETRO,
]
export const COMEX_MEETINGS_EN: Record<
  'comex-danger' | 'comex-warning' | 'comex-notice' | 'comex-fired',
  MeetingStep
> = {
  'comex-danger': COMEX_DANGER,
  'comex-warning': COMEX_WARNING,
  'comex-notice': COMEX_NOTICE,
  'comex-fired': COMEX_FIRED,
}
