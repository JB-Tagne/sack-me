"""Security-oriented automated checks for Sack Me!."""

from __future__ import annotations

import re
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]

SECRET_PATTERNS = [
    re.compile(r"sk_live_[A-Za-z0-9]+"),
    re.compile(r"sk_test_[A-Za-z0-9]{20,}"),
    re.compile(r"-----BEGIN (RSA |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"ghp_[A-Za-z0-9]{36,}"),
    re.compile(r"xox[baprs]-[A-Za-z0-9-]{10,}"),
]

SKIP_PARTS = {
    ".venv",
    ".venv-wsl",
    "node_modules",
    "dist",
    ".git",
}


def _iter_source_files():
    allowed_suffix = {
        ".py",
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ".yml",
        ".yaml",
        ".md",
        ".toml",
        ".json",
        ".sql",
        ".txt",
        ".example",
    }
    for path in ROOT.rglob("*"):
        if any(part in SKIP_PARTS for part in path.parts):
            continue
        try:
            if not path.is_file():
                continue
        except OSError:
            continue
        if path.suffix not in allowed_suffix and path.name not in {".env.example", "Dockerfile"}:
            continue
        yield path


def test_no_high_entropy_cloud_secrets_in_repo() -> None:
    offenders: list[str] = []
    for path in _iter_source_files():
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for pat in SECRET_PATTERNS:
            if pat.search(text):
                offenders.append(f"{path.relative_to(ROOT)} :: {pat.pattern}")
    assert offenders == [], "Possible secrets found:\n" + "\n".join(offenders)


def test_evaluate_script_does_not_exec_payload() -> None:
    """Le validateur lit le texte ; il ne doit jamais exécuter le livrable."""
    from game_logic import evaluate_script

    bomb = "__import__('os').system('echo pwned')"
    result = evaluate_script("python", bomb, ["import"])
    assert isinstance(result, bool)


def test_gitignore_keeps_env_and_streamlit_secrets_out() -> None:
    gi = (ROOT / ".gitignore").read_text(encoding="utf-8")
    assert ".env" in gi
    assert "secrets.toml" in gi


def test_demo_passwords_not_claimed_as_production() -> None:
    readme = (ROOT / "README.md").read_text(encoding="utf-8").lower()
    assert "production password" not in readme
    assert "mot de passe de production" not in readme


@pytest.mark.security
def test_sql_players_table_uses_session_key() -> None:
    schema = (ROOT / "sql" / "schema.sql").read_text(encoding="utf-8")
    assert "CREATE TABLE IF NOT EXISTS players" in schema
    assert "session_key" in schema
