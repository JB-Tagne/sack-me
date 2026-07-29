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
2. Checks locaux : `ruff check .` et `pytest`
3. Ne committe **jamais** `.env`, `.streamlit/secrets.toml`, secrets

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
2. Local checks: `ruff check .` and `pytest`
3. Never commit `.env`, `.streamlit/secrets.toml`, or secrets

### Game content

- Live UI: [`streamlit_app.py`](streamlit_app.py)
- CLI: [`app.py`](app.py)
- Schema / seed: [`sql/`](sql/)
- Demo fallback: [`demo_content.py`](demo_content.py)

### Bug reports

Issue with: OS, Python, repro steps, logs (no secrets).
