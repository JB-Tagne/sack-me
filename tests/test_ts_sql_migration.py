"""Assert TS→SQL migration produced expected tables/rows."""

from __future__ import annotations

import os
from pathlib import Path

import psycopg
import pytest

ROOT = Path(__file__).resolve().parents[1]


def test_seed_from_ts_file_exists_and_nontrivial() -> None:
    path = ROOT / "sql" / "seed_from_ts.sql"
    assert path.is_file()
    assert path.stat().st_size > 100_000


def test_schema_defines_content_packs_and_tools() -> None:
    schema = (ROOT / "sql" / "schema.sql").read_text(encoding="utf-8")
    for name in (
        "content_packs",
        "tools",
        "game_datasets",
        "role_tool_stacks",
        "project_phases",
        "role_project_kinds",
    ):
        assert f"CREATE TABLE IF NOT EXISTS {name}" in schema


@pytest.mark.integration
def test_sql_has_migrated_ts_content(conn: psycopg.Connection) -> None:
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM tools")
        assert cur.fetchone()[0] >= 10
        cur.execute("SELECT COUNT(*) FROM content_packs")
        assert cur.fetchone()[0] >= 100
        cur.execute("SELECT COUNT(*) FROM meetings")
        assert cur.fetchone()[0] >= 5
        cur.execute("SELECT COUNT(*) FROM adventure_steps")
        assert cur.fetchone()[0] >= 5
