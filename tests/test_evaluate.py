"""Unit tests for Sack Me! evaluation helpers."""

from __future__ import annotations

from game_logic import clamp, evaluate_script, loc, norm


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


def test_evaluate_python_rejects_emptyish() -> None:
    assert evaluate_script("python", "   ", None) is False
    assert evaluate_script("python", "hello world", ["pandas"]) is False


def test_evaluate_sql_rejects_without_baseline() -> None:
    assert evaluate_script("sql", "delete from x", ["delete"]) is False


def test_evaluate_text_short_keywords_ignored() -> None:
    # keywords shorter than 2 usable chars are ignored → passes if text non-empty
    assert evaluate_script("text", "ok", ["a", " "]) is True


def test_evaluate_keyword_min_not_met() -> None:
    assert evaluate_script("text", "seulement scope", ["scope", "risque", "delai"]) is False


def test_loc_unknown_locale_uses_fr() -> None:
    assert loc({"label_fr": "Junior"}, "label", "de") == "Junior"


