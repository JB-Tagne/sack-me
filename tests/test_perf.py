"""Performance / speed smoke tests."""

from __future__ import annotations

import time

import pytest

from demo_content import QUESTIONS, STEPS
from game_logic import evaluate_script, norm


@pytest.mark.benchmark(group="norm")
def test_norm_throughput(benchmark) -> None:
    sample = "  Critère d'Acceptation SELECT COUNT(*)  "

    def run() -> str:
        return norm(sample)

    result = benchmark(run)
    assert "critere" in result


@pytest.mark.benchmark(group="evaluate")
def test_evaluate_sql_throughput(benchmark) -> None:
    text = "SELECT COUNT(*) FROM clients WHERE id IS NOT NULL"
    kws = ["select", "count", "null", "where"]

    def run() -> bool:
        return evaluate_script("sql", text, kws)

    assert benchmark(run) is True


def test_evaluate_batch_under_budget() -> None:
    """1000 SQL validations must stay under 250 ms (standard CI machine)."""
    text = "SELECT COUNT(*) FROM clients WHERE id IS NOT NULL"
    kws = ["select", "count", "null", "where"]
    t0 = time.perf_counter()
    for _ in range(1000):
        evaluate_script("sql", text, kws)
    elapsed_ms = (time.perf_counter() - t0) * 1000
    assert elapsed_ms < 250, f"evaluate_script too slow: {elapsed_ms:.1f} ms"


def test_demo_content_lookup_under_budget() -> None:
    t0 = time.perf_counter()
    for _ in range(5000):
        _ = [s for s in STEPS if s["level_id"] == 0]
        _ = [q for q in QUESTIONS if q["kind"] == "pm"]
    elapsed_ms = (time.perf_counter() - t0) * 1000
    assert elapsed_ms < 500, f"demo lookups too slow: {elapsed_ms:.1f} ms"


def test_import_app_under_budget() -> None:
    """Approximate cold import via controlled reload — generous budget."""
    import importlib
    import sys

    for name in ("game_logic", "demo_content"):
        sys.modules.pop(name, None)
    t0 = time.perf_counter()
    importlib.import_module("demo_content")
    importlib.import_module("game_logic")
    elapsed_ms = (time.perf_counter() - t0) * 1000
    assert elapsed_ms < 3000, f"imports too slow: {elapsed_ms:.1f} ms"
