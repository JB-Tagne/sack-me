-- Migration: Mutualis Health
INSERT INTO entities (id, name, domain_fr, domain_en, blurb_fr, blurb_en) VALUES
  ('health', 'Mutualis Health', 'Santé / parcours patient', 'Health / patient journeys',
   'Dossiers patients, parcours de soins, facturation et conformité santé.',
   'Patient records, care pathways, billing and health compliance.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  domain_fr = EXCLUDED.domain_fr,
  domain_en = EXCLUDED.domain_en,
  blurb_fr = EXCLUDED.blurb_fr,
  blurb_en = EXCLUDED.blurb_en;

-- Align L0-S0 governance QCM with Health / Assurance wording
UPDATE step_questions SET
  question_fr = 'Qui valide la définition du KPI « sinistre ouvert » (Mutualis Assurance) ou « séjour ouvert » (Mutualis Health) ?',
  question_en = 'Who validates the definition of the "open claim" KPI (Mutualis Assurance) or "open stay" (Mutualis Health)?',
  correction_fr = 'La définition métier appartient au steward / owner, pas au codeur seul — y compris en santé.',
  correction_en = 'The business definition belongs to the steward/owner, not the coder alone — including in health.'
WHERE step_id = 'L0-S0' AND kind = 'gov';
