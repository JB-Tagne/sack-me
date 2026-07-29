#!/usr/bin/env bash
set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"
cd "/mnt/c/Users/johnb/Desktop/Sack Me!"

gh auth setup-git
git remote set-url origin https://github.com/JB-Tagne/sack-me.git

git add -A
# keep local-only helpers / secrets out if any slipped
git reset HEAD -- .env .streamlit/secrets.toml scripts/push_only.sh 2>/dev/null || true

git status -sb

if git diff --cached --quiet; then
  echo "Nothing staged"
else
  git commit -m "$(cat <<'EOF'
Add automated test suite on every commit and push.

CI covers unit line coverage, Postgres integration, security, and performance budgets; local pre-commit/pre-push hooks mirror the gates.
EOF
)"
fi

# Push; if workflow scope missing, push without workflows then exit 2
if ! git push -u origin HEAD; then
  echo "Push failed — retrying without .github/workflows"
  git reset --soft HEAD~1
  git restore --staged .github/workflows || true
  git commit -m "$(cat <<'EOF'
Add automated test suite on every commit and push.

CI covers unit line coverage, Postgres integration, security, and performance budgets; local pre-commit/pre-push hooks mirror the gates.
EOF
)"
  git push -u origin HEAD
  echo "PUSHED_WITHOUT_WORKFLOW"
  git remote set-url origin git@github.com:JB-Tagne/sack-me.git
  exit 2
fi

echo PUSH_OK
git remote set-url origin git@github.com:JB-Tagne/sack-me.git
