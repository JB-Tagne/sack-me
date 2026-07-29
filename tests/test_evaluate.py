"""Unit tests for Sack Me! evaluation helpers."""

from __future__ import annotations

from app import clamp, evaluate_script, norm


def test_norm_strips_accents_and_case() -> None:
    assert norm("  Critère  ") == "critere"
    assert norm("SELECT") == "select"


def test_clamp() -> None:
    assert clamp(150, 0, 100) == 100
    assert clamp(-5, 0, 100) == 0
    assert clamp(42, 0, 100) == 42


def test_evaluate_sql_ok() -> None:
    text = "SELECT COUNT(*) FROM clients WHERE id IS NOT NULL"
    assert evaluate_script("sql", text, ["select", "count", "null", "where"]) is True


def test_evaluate_sql_rejects_empty() -> None:
    assert evaluate_script("sql", "", ["select"]) is False


def test_evaluate_python_ok() -> None:
    text = "import pandas as pd\ndf = pd.read_csv('x.csv')\nprint(df.duplicated())"
    assert (
        evaluate_script("python", text, ["import", "pandas", "duplicat", "read_csv"]) is True
    )


def test_evaluate_text_needs_keywords() -> None:
    assert evaluate_script("text", "arbitrage scope et risque", ["scope", "risque"]) is True
    assert evaluate_script("text", "hello", ["scope", "risque", "delai"]) is False
