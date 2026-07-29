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

Le live Streamlit embarque **le même jeu React** (animations, meetings, HUD, etc.)
via `streamlit_static/sackme.html` (build single-file).

1. `npm run build:streamlit` (régénère le HTML embarqué)
2. Commit + push `streamlit_static/sackme.html`
3. [share.streamlit.io](https://share.streamlit.io) → app `streamlit_app.py` / branche `main`
4. Passe l’app en **Public** (Settings → Sharing) pour le lien public
5. URL typique : `https://sack-me.streamlit.app`

Le CLI Python (`python app.py`) et Postgres restent disponibles pour le parcours terminal / DB.

### Contenu de jeu (SQL = source de vérité)

Les tables de contenu (ex-`src/data/dataStack/*.ts`) vivent dans PostgreSQL :

```bash
npm run export:sql                 # régénère sql/seed_from_ts.sql depuis le TS
python scripts/apply_ts_sql.py     # charge schema étendu + seed dans Postgres
```

Voir [`src/data/dataStack/README.md`](src/data/dataStack/README.md) et [`sql/schema.sql`](sql/schema.sql).

Filiales (catalogue YAML) :

```bash
python scripts/sync_game_content.py --write
python scripts/sync_game_content.py --check
```

### Contenu MVP

- 8 filiales Mutualis + 2 types de projet (IT / Data-IA)
- 9 rôles (piste PM ou Gouvernance)
- 2 niveaux, 4 étapes (QCM PM → livrable tech → QCM gouvernance)
- `fireRisk` : trop d’erreurs → COMEX / licenciement
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

À **chaque push / PR**, GitHub Actions exécute :

| Job | Contenu |
|-----|---------|
| Lint | Ruff |
| Unit | Pytest + **couverture ligne à ligne** (`--cov-fail-under=90` sur `game_logic` / `demo_content`) |
| Integration | Schema + seed PostgreSQL + `tests/test_db.py` |
| Security | Bandit, pip-audit, npm audit, `tests/test_security.py` |
| Performance | Budgets temps + pytest-benchmark |
| Streamlit | Import smoke |
| Node | `npm test` + `npm run build` |

**Hooks locaux** (bloquent commit / push) :

```bash
pip install -r requirements-dev.txt
pre-commit install
pre-commit install --hook-type pre-push
```

Batterie complète en local :

```bash
bash scripts/run_all_checks.sh
# Windows PowerShell (via WSL ou Git Bash) :
# wsl bash scripts/run_all_checks.sh
```

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

Streamlit hosts the **same React adventure** (animations, meetings, HUD, etc.)
via `streamlit_static/sackme.html` (single-file build).

1. `npm run build:streamlit` (regenerate the embedded HTML)
2. Commit + push `streamlit_static/sackme.html`
3. [share.streamlit.io](https://share.streamlit.io) → app `streamlit_app.py` / `main`
4. Set the app to **Public** (Settings → Sharing) for the public URL
5. Typical URL: `https://sack-me.streamlit.app`

The Python CLI (`python app.py`) and Postgres remain for the terminal / DB path.

### Game content (auto-sync)

Source of truth for subsidiaries: [`data/catalog/entities.yaml`](data/catalog/entities.yaml)

```bash
python scripts/sync_game_content.py --write   # regenerate SQL + demo + TS + README
python scripts/sync_game_content.py --check   # CI / pre-commit
```

The pre-commit hook runs `--write` then `--check` on every commit.

### MVP content

- 8 Mutualis subsidiaries + 2 project kinds (IT / Data-AI)
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

On **every push / PR**, GitHub Actions runs:

| Job | What |
|-----|------|
| Lint | Ruff |
| Unit | Pytest + **line coverage** (`--cov-fail-under=90` on `game_logic` / `demo_content`) |
| Integration | PostgreSQL schema + seed + `tests/test_db.py` |
| Security | Bandit, pip-audit, npm audit, `tests/test_security.py` |
| Performance | Time budgets + pytest-benchmark |
| Streamlit | Import smoke |
| Node | `npm test` + `npm run build` |

**Local hooks** (block commit / push):

```bash
pip install -r requirements-dev.txt
pre-commit install
pre-commit install --hook-type pre-push
```

Full local suite:

```bash
bash scripts/run_all_checks.sh
```

CI: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

### License

[MIT](LICENSE)
