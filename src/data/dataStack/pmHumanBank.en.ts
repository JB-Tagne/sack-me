/** Transversal PM bank — people & project soft skills (EN). */

import type { StepProjectMgmt } from './pmGovTypes'

type PmCore = Omit<StepProjectMgmt, 'scenarioTwist'>

function pm(
  partial: Omit<StepProjectMgmt, 'frameworkRef'> & { frameworkRef?: string },
): PmCore {
  return {
    frameworkRef: 'Project management / Soft skills · Agile',
    ...partial,
  }
}

export const HUMAN_BANK_EN: readonly PmCore[] = [
  pm({
    link: 'Conflict management — public technical disagreement.',
    question:
      'Two seniors clash in Daily about an approach. Best PM / SM posture?',
    options: [
      'Let it run so “they sort it out”',
      'Park the debate, re-center the Goal, facilitate a dedicated slot outside Daily',
      'Impose your preferred solution in front of everyone',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — facilitation · Project management — Conflict management',
    correction:
      'Daily is not a tribunal. Protect flow; handle conflict in a fit-for-purpose space, without humiliation.',
  }),
  pm({
    link: 'Conflict management — business vs IT.',
    question:
      'Business accuses IT of “blocking”; IT accuses business of “improvising”. What do you do?',
    options: [
      'Side with the most senior title',
      'Facilitate a facts / impacts / options workshop; have the Accountable decide',
      'Avoid the topic until the next PI',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Stakeholder & conflict · scaled agile — alignment',
    correction:
      'Replace accusations with facts and an Owner decision. The PM facilitates; they do not pick clans.',
  }),
  pm({
    link: 'People management — capacity and overload.',
    question: 'A key developer works nights to hit the date. Your reflex?',
    options: [
      'Praise them and ask for more',
      'Protect capacity: replan, say no to scope, treat the human risk',
      'Ignore it while the burndown stays green',
    ],
    correctIndex: 1,
    frameworkRef: 'scaled agile — sustainable pace · Scrum — team health · Project management — Resource',
    correction:
      'Sustainable pace is a project constraint. Burning people destroys medium-term delivery.',
  }),
  pm({
    link: 'People management — feedback & performance.',
    question: 'Someone misses several ACs in a row. Constructive approach?',
    options: [
      'Blame them in Sprint Review',
      'Private factual feedback + pairing / AC clarity + improvement plan',
      'Remove them from the board with no discussion',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Team performance · Scrum — coaching',
    correction:
      'Private feedback, facts, support. Review is not an individual tribunal.',
  }),
  pm({
    link: 'Decision-making — under uncertainty.',
    question: 'You lack 30% of the info to pick a tool. What do you decide?',
    options: [
      'Wait until you have 100% of the information',
      'Decide with explicit criteria, a timebox, and a documented pivot rule',
      'Let everyone silently pick their own tool',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Decision making · Agile — reversible decisions',
    correction:
      'Deciding with a frame (criteria, horizon, pivot) beats paralysis and chaos.',
  }),
  pm({
    link: 'Decision-making — human RACI.',
    question:
      'Who should decide when PO and architect diverge on technical scope?',
    options: [
      'Whoever is loudest on Slack',
      'The Accountable for the Goal (often PO / sponsor) after costed options',
      'Nobody — ship both options',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — RACI · Scrum — Product Owner · scaled agile — content authority',
    correction:
      'PO / Accountable decides value; architecture clarifies options. No double truth.',
  }),
  pm({
    link: 'Communication — bad news.',
    question: 'You know the board milestone will slip 5 days. When do you communicate?',
    options: [
      'On the day itself, to “avoid stress”',
      'As soon as the risk is credible: facts, impact, options, decision needed',
      'Only if someone asks',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Communication · scaled agile — transparency',
    correction: 'Trust is built on early alerts. Delay amplifies the crisis.',
  }),
  pm({
    link: 'Communication — multiple audiences.',
    question: 'How do you adapt the board message vs the team message?',
    options: [
      'Same technical jargon for everyone',
      'Board: decisions/risks/value; team: impediments/plan/DoD',
      'Tell the board nothing to “protect” the team',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Stakeholder communication · Scrum — information radiators',
    correction: 'Same truth, adapted depth. No deceptive doublespeak.',
  }),
  pm({
    link: 'Negotiation — scope vs date.',
    question: 'The sponsor wants fixed date + fixed scope. Healthy answer?',
    options: [
      'Accept both and “figure it out”',
      'Negotiate: fixed date ⇒ prioritized / MVP scope; otherwise floating date',
      'Secretly promise widespread overtime',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Negotiation · Agile — iron triangle',
    correction:
      'You cannot fix date, scope and capacity with no trade-off. Make the triangle explicit.',
  }),
  pm({
    link: 'Influence without hierarchy.',
    question:
      'You have no formal authority over a blocking partner team. Best lever?',
    options: [
      'Threaten by email with a wide CC',
      'Shared interest, impact data, RACI escalation if needed',
      'Bypass with Shadow IT',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Influence · scaled agile — dependency management',
    correction:
      'Influence = shared value + facts + clean escalation. No blackmail, no shadow.',
  }),
  pm({
    link: 'Leadership — psychological safety.',
    question: 'A junior reports a prod mistake. Reaction that strengthens the team?',
    options: [
      'Mock them so it “sets an example”',
      'Thank the signal, blameless post-mortem, systemic fix',
      'Hide the incident to protect image',
    ],
    correctIndex: 1,
    frameworkRef: 'scaled agile — Lean-Agile leadership · Project management — Team culture',
    correction:
      'Psychological safety surfaces risks early. Blame culture buries them.',
  }),
  pm({
    link: 'Change management — adoption.',
    question: 'Business is not using the new dashboard. Priority?',
    options: [
      'Force usage via an exec email',
      'Understand blockers, co-build enablement, measure adoption',
      'Drop it with no diagnosis',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Change management · Prosci / ADKAR (spirit)',
    correction:
      'Adoption is earned: blockers, training, champions, measurement — not force alone.',
  }),
  pm({
    link: 'Meetings — facilitation.',
    question: 'A workshop turns into the sponsor’s monologue. What do you do?',
    options: [
      'Let it finish “out of respect”',
      'Re-center the objective, timebox, redistribute airtime',
      'Cut them off harshly and leave the room',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum Master — facilitation · Project management — Meeting management',
    correction:
      'Facilitate = protect the objective and fair airtime, with respectful firmness.',
  }),
  pm({
    link: 'Team — personality conflict.',
    question: 'Two people refuse to work together. Viable option?',
    options: [
      'Force them on the same ticket with no frame',
      'Clarify RACI, interface, collab rules; mediate if needed',
      'Isolate them forever with no shared objective',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Team management · Agile — collaboration',
    correction:
      'Frame how to work together (roles, interfaces). Pure avoidance is expensive.',
  }),
  pm({
    link: 'Motivation — recognition.',
    question: 'The team just saved a board meeting. Best move?',
    options: [
      'Say nothing: “that’s normal”',
      'Publicly recognize the outcome + learning + recovery time',
      'Immediately add an even harder batch',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Recognition · sustainable pace',
    correction:
      'Recognition + recovery sustain engagement. Ingratitude then rush burns the team.',
  }),
  pm({
    link: 'Decision — escalation.',
    question: 'When do you escalate a blocker to the sponsor?',
    options: [
      'At the first team disagreement',
      'When Goal/date/risk impact exceeds local mandate, after a resolution attempt',
      'Never: it looks like a “bad PM”',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Escalation · scaled agile — problem-solving',
    correction:
      'Escalate too early = noise. Too late = crisis. Escalate with facts and options.',
  }),
  pm({
    link: 'Crisis communication.',
    question: 'Suspected partial data leak. First internal message?',
    options: [
      'Radio silence until full investigation',
      'Factual alert: what we know / don’t know, actions, next checkpoint',
      'Publicly downplay “it’s nothing”',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Crisis communication · Compliance',
    correction: 'Controlled transparency: facts, actions, cadence. Neither panic nor denial.',
  }),
  pm({
    link: 'Negotiation — vendor.',
    question: 'The vendor drifts on the fixed-price scope. Posture?',
    options: [
      'Accept without amendment to “keep the peace”',
      'Return to contract / DoD, options (amendment, scope cut, exit), decide',
      'Threaten litigation at the first delay',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Procurement / negotiation',
    correction:
      'Manage via contractual frame and clear options — not naivety or instant escalation.',
  }),
  pm({
    link: 'People — onboarding a newcomer.',
    question: 'A junior joins in the middle of a critical Sprint. Good reflex?',
    options: [
      'Leave them alone on a sensitive workstream',
      'Buddy, Goal/DoD context, right-sized tickets, short feedback',
      'Make them read 200 Confluence pages with no pairing',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Team development · Scrum — mentoring',
    correction:
      'Onboarding = buddy + context + progressive load. Else quality risk and demotivation.',
  }),
  pm({
    link: 'Decision — bias & data.',
    question:
      'A director pushes an option “because it worked elsewhere”. You?',
    options: [
      'Follow authority with no analysis',
      'Require local criteria (cost, risk, fit) and a short proof / spike',
      'Reject any external idea on principle',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Evidence-based decisions · Agile — spike',
    correction: 'Authority does not cancel the need for local criteria and proof.',
  }),
  pm({
    link: 'Conflict — political priorities.',
    question: 'A VIP forces a ticket outside the Sprint Goal. What do you do?',
    options: [
      'Insert it silently to avoid clash',
      'Make the trade-off visible (Goal / capacity) and have the Accountable decide',
      'Say no with no explanation',
    ],
    correctIndex: 1,
    frameworkRef: 'Scrum — Sprint Goal protection · Project management — Issue & politics',
    correction:
      'Do not absorb politics silently: expose the cost and force a decision.',
  }),
  pm({
    link: 'Communication — async & remote.',
    question: 'Hybrid team: decisions get lost in meetings. Fix?',
    options: [
      'Even more meetings',
      'Written decisions (ADR / Confluence), owners, clear async channels',
      'Decide everything privately between two people',
    ],
    correctIndex: 1,
    frameworkRef: 'Project management — Communication plan · remote collaboration',
    correction:
      'A decision is written, findable, owned. Oral-only does not scale in a hybrid setup.',
  }),
]

export const HUMAN_TWISTS_EN: readonly string[] = [
  'Twist: open conflict between two leads in a stakeholder meeting.',
  'Twist: a key teammate signals likely burnout.',
  'Twist: a VIP bypasses the PO and assigns work directly.',
  'Twist: a Slack rumor destabilizes the team before the board.',
  'Twist: the vendor changes lead mid-project with no handoff.',
  'Twist: two business units refuse to sit in the same workshop.',
  'Twist: toxic public feedback after a Review.',
  'Twist: a committee “decided”… but nobody shares the same memory.',
]
