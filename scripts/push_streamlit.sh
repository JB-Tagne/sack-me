#!/usr/bin/env bash
set -euo pipefail
cd "/mnt/c/Users/johnb/Desktop/Sack Me!"

# Undo previous commit if still ahead / soft-reset state
if git log -1 --format='%s' | grep -q 'Add Python/Streamlit'; then
  git reset --soft HEAD~1 || true
fi

git restore --staged .github/workflows/ci.yml 2>/dev/null || true

git add \
  .gitignore README.md package.json \
  .editorconfig .env.example .gitattributes \
  .github/dependabot.yml .streamlit/ \
  CONTRIBUTING.md LICENSE SECURITY.md \
  app.py demo_content.py docker-compose.yml \
  pyproject.toml requirements-dev.txt requirements.txt \
  scripts/ sql/ streamlit_app.py tests/

git status -sb

git commit -m "$(cat <<'EOF'
Add Python/Streamlit game, PostgreSQL schema, and repo config.

Enable Streamlit Community Cloud deploy via streamlit_app.py on main.
EOF
)"

gh auth setup-git
git remote set-url origin https://github.com/JB-Tagne/sack-me.git
git push -u origin HEAD
echo PUSH_OK
git ls-remote --heads origin main
# keep SSH remote as preferred locally
git remote set-url origin git@github.com:JB-Tagne/sack-me.git
git status -sb
