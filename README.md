# Sack Me!

[Français](#français) · [English](#english)

Serious game · simulation de carrière **gestion de projet** & **gouvernance data**  
Career simulation serious game · **project management** & **data governance**

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

```powershell
npm install
npm run dev
```

Ouvre **http://localhost:5173**

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

```powershell
npm install
npm run dev
```

Open **http://localhost:5173**

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
