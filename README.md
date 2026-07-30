# Sack Me!

[Français](#français) · [English](#english)

Serious game · simulation de carrière **gestion de projet** & **gouvernance data**  
Career simulation serious game · **project management** & **data governance**

### Live

**[Jouer en ligne — GitHub Pages](https://jb-tagne.github.io/sack-me/)**

---

## Français

Tu choisis un rôle, une filiale Mutualis Group et un type de projet.  
Tu mènes à bien les tâches qui te sont confiées et tu évolues.  
Toute mauvaise décision te rapproche de la sortie.

### Stack

| Couche | Techno |
|--------|--------|
| Jeu web | React 19 + Vite + TypeScript |
| Contenu | Modules `src/data/dataStack/` |
| Tests | Vitest |

### Prérequis

- Node.js 20+

### Démarrage rapide

Pour jouer : **[https://jb-tagne.github.io/sack-me/](https://jb-tagne.github.io/sack-me/)**

Développement local :

```powershell
npm install
npm run dev
```

Dev server : **http://localhost:5174** (le port 5173 reste libre pour My Pro Hub).

Build production :

```powershell
npm run build
npm run preview
```

### Contenu MVP

- 8 filiales Mutualis + 2 types de projet (IT / Data-IA)
- 9 rôles (piste PM ou Gouvernance)
- 2 niveaux, 4 étapes (QCM PM → livrable tech → QCM gouvernance)
- `fireRisk` : trop d’erreurs → COMEX / licenciement

### Contenu de jeu (tables SQL)

Toutes les tables sont définies dans [`sql/schema.sql`](sql/schema.sql) et alimentées par :

| Fichier | Rôle |
|---------|------|
| [`sql/schema.sql`](sql/schema.sql) | DDL — 18 tables PostgreSQL |
| [`sql/seed.sql`](sql/seed.sql) | Seed MVP (référentiels de base) |
| [`sql/seed_from_ts.sql`](sql/seed_from_ts.sql) | Contenu complet exporté depuis le TS |
| [`sql/migrations/`](sql/migrations/) | Migrations incrémentales |

Régénérer le seed depuis le TypeScript :

```bash
npm run export:sql
```

Tables principales : `entities`, `roles`, `tools`, `adventure_levels`, `adventure_steps`, `step_questions`, `meetings`, `meeting_questions`, `content_packs`, `game_datasets`, `players`, etc.

Le jeu React lit encore les modules `src/data/dataStack/*.ts` à l'exécution ; garde TS et SQL synchronisés via `export:sql`.

### Tests & qualité

```bash
npm test
npm run build
```

CI : [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

### Contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md).

### Licence

[MIT](LICENSE)

### Déployer (GitHub Pages)

Chaque push sur `main` déploie via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

URL publique : **https://jb-tagne.github.io/sack-me/**

Première fois : repo **Settings → Pages → Build and deployment → Source : GitHub Actions**.

Test local du build Pages :

```powershell
$env:VITE_BASE="/sack-me/"; npm run build; npm run preview
```

Ouvre l’URL affichée par Vite dans le terminal.

---

## English

Pick a role, a Mutualis Group subsidiary, and a project type.  
Complete the tasks you are given and grow your career.  
Every bad decision brings you closer to getting sacked.

### Stack

| Layer | Tech |
|-------|------|
| Web game | React 19 + Vite + TypeScript |
| Content | `src/data/dataStack/` modules |
| Tests | Vitest |

### Prerequisites

- Node.js 20+

### Quick start

Play online: **[https://jb-tagne.github.io/sack-me/](https://jb-tagne.github.io/sack-me/)**

Local development:

```powershell
npm install
npm run dev
```

Dev server: **http://localhost:5174** (port 5173 stays free for My Pro Hub).

Production build:

```powershell
npm run build
npm run preview
```

### MVP content

- 8 Mutualis subsidiaries + 2 project kinds (IT / Data-AI)
- 9 roles (PM or Governance track)
- 2 levels, 4 steps (PM quiz → tech deliverable → governance quiz)
- `fireRisk`: too many mistakes → exec committee / fired

### Game content (SQL tables)

All tables are defined in [`sql/schema.sql`](sql/schema.sql) and populated by:

| File | Role |
|------|------|
| [`sql/schema.sql`](sql/schema.sql) | DDL — 18 PostgreSQL tables |
| [`sql/seed.sql`](sql/seed.sql) | MVP seed (base reference data) |
| [`sql/seed_from_ts.sql`](sql/seed_from_ts.sql) | Full content exported from TS |
| [`sql/migrations/`](sql/migrations/) | Incremental migrations |

Regenerate seed from TypeScript:

```bash
npm run export:sql
```

Main tables: `entities`, `roles`, `tools`, `adventure_levels`, `adventure_steps`, `step_questions`, `meetings`, `meeting_questions`, `content_packs`, `game_datasets`, `players`, etc.

The React game still imports `src/data/dataStack/*.ts` at runtime; keep TS and SQL in sync via `export:sql`.

### Tests & quality

```bash
npm test
npm run build
```

CI: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

### License

[MIT](LICENSE)

### Deploy (GitHub Pages)

Every push to `main` deploys via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

Public URL: **https://jb-tagne.github.io/sack-me/**

First time: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Local Pages build test:

```powershell
$env:VITE_BASE="/sack-me/"; npm run build; npm run preview
```

Open the URL Vite prints in the terminal.
