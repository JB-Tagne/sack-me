"""Integration: schema + seed load cleanly against a live Postgres."""

from __future__ import annotations

import os
from pathlib import Path

import psycopg
import pytest

ROOT = Path(__file__).resolve().parents[1]


def _database_url() -> str | None:
    return os.getenv("DATABASE_URL") or os.getenv("CI_DATABASE_URL")


@pytest.fixture(scope="module")
def conn():
    url = _database_url()
    if not url:
        pytest.skip("DATABASE_URL not set")
    try:
        c = psycopg.connect(url)
    except psycopg.Error as exc:
        pytest.skip(f"Postgres unreachable: {exc}")
    yield c
    c.close()


@pytest.mark.integration
def test_entities_seeded(conn: psycopg.Connection) -> None:
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM entities")
        (n,) = cur.fetchone()
    assert n >= 7


@pytest.mark.integration
def test_steps_have_questions(conn: psycopg.Connection) -> None:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT s.id
            FROM adventure_steps s
            WHERE NOT EXISTS (
              SELECT 1 FROM step_questions q
              WHERE q.step_id = s.id AND q.kind = 'pm'
            )
            """
        )
        missing = cur.fetchall()
    assert missing == []


@pytest.mark.integration
def test_schema_files_exist() -> None:
    assert (ROOT / "sql" / "schema.sql").is_file()
    assert (ROOT / "sql" / "seed.sql").is_file()
