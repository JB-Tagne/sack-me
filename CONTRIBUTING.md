# Contributing · Contribuer

[Français](#français) · [English](#english)

---

## Français

Merci de contribuer à **Sack Me!**

### Prérequis

- Python 3.11+
- PostgreSQL 16 (Docker recommandé : `docker compose up -d`) — optionnel pour Streamlit démo

### Installation

```bash
python -m venv .venv
source .venv/bin/activate   # Windows : .\.venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
cp .env.example .env
streamlit run streamlit_app.py
# → http://localhost:8501
```

### Avant une PR

1. Branche dédiée depuis `main`
2. Contenu jeu : éditer `data/catalog/entities.yaml` puis `python scripts/sync_game_content.py --write`
3. Installer les hooks :
   ```bash
   pre-commit install
   pre-commit install --hook-type pre-push
   pre-commit install --hook-type commit-msg
   ```
4. Checks locaux : `bash scripts/run_all_checks.sh`
5. **Messages de commit GitHub en anglais uniquement** (impératif : `Add…` / `Fix…` / `Update…`)
6. Ne committe **jamais** `.env`, `.streamlit/secrets.toml`, secrets

### Contenu de jeu

- UI live : [`streamlit_app.py`](streamlit_app.py)
- CLI : [`app.py`](app.py)
- Schéma / seed : [`sql/`](sql/)
- Fallback démo : [`demo_content.py`](demo_content.py)

### Signalement de bugs

Issue avec : OS, Python, étapes, logs (sans secrets).

---

## English

Thanks for contributing to **Sack Me!**

### Prerequisites

- Python 3.11+
- PostgreSQL 16 (Docker recommended) — optional for Streamlit demo mode

### Setup

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .\.venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
cp .env.example .env
streamlit run streamlit_app.py
# → http://localhost:8501
```

### Before a PR

1. Feature branch from `main`
2. Game content: edit `data/catalog/entities.yaml` then `python scripts/sync_game_content.py --write`
3. Install hooks:
   ```bash
   pre-commit install
   pre-commit install --hook-type pre-push
   pre-commit install --hook-type commit-msg
   ```
4. Local checks: `bash scripts/run_all_checks.sh`
5. **GitHub commit messages must be English only** (imperative: `Add…` / `Fix…` / `Update…`)
6. Never commit `.env`, `.streamlit/secrets.toml`, or secrets

### Game content

- Live UI: [`streamlit_app.py`](streamlit_app.py)
- CLI: [`app.py`](app.py)
- Schema / seed: [`sql/`](sql/)
- Demo fallback: [`demo_content.py`](demo_content.py)

### Bug reports

Issue with: OS, Python, repro steps, logs (no secrets).
