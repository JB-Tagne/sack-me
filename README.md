# Sack Me!

[Français](#français) · [English](#english)

Serious game · simulation de carrière **gestion de projet** & **gouvernance data**  
Career simulation serious game · **project management** & **data governance**

### Live

**[Jouer en ligne — Streamlit](https://sack-me.streamlit.app)**

Local : `streamlit run streamlit_app.py` → [http://localhost:8501](http://localhost:8501)

---

## Français

Tu choisis un rôle, une filiale Mutualis Group et un type de projet.  
Tu mènes à bien les tâches qui te sont confiées et tu évolues.  
Toute mauvaise décision te rapproche de la sortie.

### Stack

| Couche | Techno |
|--------|--------|
| Jeu web (live) | Streamlit — [`streamlit_app.py`](streamlit_app.py) |
| Jeu terminal | Python CLI — [`app.py`](app.py) |
| Données | PostgreSQL 16 — [`sql/`](sql/) (fallback démo embarquée sur Streamlit Cloud) |
| Infra locale | Docker Compose ou PostgreSQL Windows |

### Prérequis

- Python 3.11+
- PostgreSQL 16 (optionnel en local si tu joues en mode démo Streamlit)

### Démarrage rapide

#### 1. Interface Streamlit (recommandé)

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
streamlit run streamlit_app.py
```

Ouvre **http://localhost:8501** (pas un autre port Vite / hub).

Sans Postgres, le mode **démo** charge le contenu MVP embarqué.  
Avec Postgres : copie [`.streamlit/secrets.toml.example`](.streamlit/secrets.toml.example) vers `.streamlit/secrets.toml` ou définis `DATABASE_URL` dans `.env`.

#### 2. Base PostgreSQL (persistance / CLI)

```bash
docker compose up -d
# ou Windows local :
python scripts/setup_db.py
```

#### 3. CLI

```powershell
copy .env.example .env
python app.py
```

### Déployer le lien live (Streamlit Community Cloud)

1. Pousse le dépôt sur GitHub
2. Va sur [share.streamlit.io](https://share.streamlit.io) → **New app**
3. Repo + branche `main` + fichier principal : `streamlit_app.py`
4. (Optionnel) Secrets : `DATABASE_URL` vers une Postgres cloud
5. URL publique typique : `https://sack-me.streamlit.app`  
   Mets à jour `STREAMLIT_LIVE_URL` / secret si le sous-domaine diffère

### Contenu MVP

- 7 filiales Mutualis + 2 types de projet (IT / Data-IA)
- 9 rôles (piste PM ou Gouvernance)
- 2 niveaux, 4 étapes (QCM PM → livrable tech → QCM gouvernance)
- `fireRisk` : trop d’erreurs → COMEX / licenciement

### Schéma SQL

| Tables | Rôle |
|--------|------|
| `entities`, `project_kinds`, `roles`, `career_titles` | Référentiels |
| `adventure_levels`, `adventure_steps`, `step_questions` | Contenu de jeu |
| `meetings`, `meeting_questions` | Réunions (COMEX…) |
| `players`, `player_completed_steps` | Progression |

### Tests & qualité

```bash
pytest
ruff check .
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
| Web game (live) | Streamlit — [`streamlit_app.py`](streamlit_app.py) |
| Terminal game | Python CLI — [`app.py`](app.py) |
| Data | PostgreSQL 16 — [`sql/`](sql/) (embedded demo fallback on Streamlit Cloud) |
| Local infra | Docker Compose or Windows PostgreSQL |

### Prerequisites

- Python 3.11+
- PostgreSQL 16 (optional locally if you play Streamlit demo mode)

### Quick start

#### 1. Streamlit UI (recommended)

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
streamlit run streamlit_app.py
```

Open **http://localhost:8501** (not a Vite / hub port).

Without Postgres, **demo mode** loads embedded MVP content.  
With Postgres: copy [`.streamlit/secrets.toml.example`](.streamlit/secrets.toml.example) to `.streamlit/secrets.toml` or set `DATABASE_URL` in `.env`.

#### 2. PostgreSQL (persistence / CLI)

```bash
docker compose up -d
# or local Windows:
python scripts/setup_db.py
```

#### 3. CLI

```powershell
copy .env.example .env
python app.py
```

### Deploy the live link (Streamlit Community Cloud)

1. Push the repo to GitHub
2. Open [share.streamlit.io](https://share.streamlit.io) → **New app**
3. Repo + `main` branch + main file: `streamlit_app.py`
4. (Optional) Secrets: `DATABASE_URL` to a cloud Postgres
5. Public URL typically: `https://sack-me.streamlit.app`  
   Update `STREAMLIT_LIVE_URL` / secret if the subdomain differs

### MVP content

- 7 Mutualis subsidiaries + 2 project kinds (IT / Data-AI)
- 9 roles (PM or Governance track)
- 2 levels, 4 steps (PM quiz → tech deliverable → governance quiz)
- `fireRisk`: too many mistakes → exec committee / fired

### SQL schema

| Tables | Purpose |
|--------|---------|
| `entities`, `project_kinds`, `roles`, `career_titles` | Reference data |
| `adventure_levels`, `adventure_steps`, `step_questions` | Game content |
| `meetings`, `meeting_questions` | Meetings (exec…) |
| `players`, `player_completed_steps` | Progress |

### Tests & quality

```bash
pytest
ruff check .
```

CI: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

### License

[MIT](LICENSE)
