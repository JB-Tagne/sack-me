# Sack Me!

Serious game de simulation de carrière en **gestion de projet** et **gouvernance data**.

Tu choisis un rôle, une filiale Mutualis Group et un type de projet.  
Tu mènes à bien les tâches qui te sont confiées et tu évolues.  
Toute mauvaise décision te rapproche de la sortie.

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173).

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualiser le build |
| `npm test` | Tests unitaires |

## Contenu du jeu

- **9 rôles** (piste PM ou Gouvernance) sur projets IT / Data-IA
- **7 filiales** Mutualis Group (Assurance, Bank, Retail, Transport, Energy, Media, Agro)
- **QCM** gestion de projet & gouvernance + **livrables techniques** (SQL, Python, Spark…)
- **Réunions simulées** : COPROJ, COPIL, événements Scrum, COMEX disciplinaires
- **Risque de licenciement** (fireRisk) avec seuils narratifs interactifs
- **Bilingue** FR / EN
- Persistance locale (navigateur) — aucun serveur distant

## Stack

- React 19 + TypeScript
- Vite 8
- Vitest

## Structure

```
src/
  pages/          DataStackPage (cœur du jeu)
  components/     UI Sack Me! (landing, meetings, deliverables…)
  data/dataStack/ Contenu scénarios, packs PM/gov, banques de réunions
  i18n/           Textes FR/EN
  lib/            Moteur, carrière, stockage local
public/data-game/ Datasets d'exercices
```

## Licence

À définir. Contributions bienvenues.
