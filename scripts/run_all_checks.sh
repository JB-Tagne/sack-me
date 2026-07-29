#!/usr/bin/env bash
# Lance toute la batterie de checks (comme la CI), en local.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== Ruff =="
ruff check .

echo "== Unit + coverage (ligne a ligne) =="
pytest -q \
  tests/test_evaluate.py \
  tests/test_career.py \
  tests/test_demo_content.py \
  --cov=game_logic \
  --cov=demo_content \
  --cov-report=term-missing \
  --cov-fail-under=90 \
  -m "not integration and not benchmark"

echo "== Security =="
pytest -q tests/test_security.py
bandit -q -r game_logic.py demo_content.py streamlit_app.py app.py scripts \
  -x scripts/push_streamlit.sh,scripts/push_only.sh -ll
pip-audit -r requirements.txt

echo "== Performance =="
pytest -q tests/test_perf.py --benchmark-skip
pytest -q tests/test_perf.py --benchmark-only --benchmark-min-rounds=3 -q

echo "== Streamlit smoke =="
python -c "import streamlit_app; print('OK')"

if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "== Integration (DATABASE_URL set) =="
  pytest -q tests/test_db.py -m integration
else
  echo "== Integration SKIP (set DATABASE_URL to enable) =="
fi

if command -v npm >/dev/null 2>&1; then
  echo "== Node =="
  npm test
  npm audit --audit-level=high || true
fi

echo "All local checks passed."
