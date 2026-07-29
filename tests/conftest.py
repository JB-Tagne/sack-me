"""Shared pytest fixtures."""

from __future__ import annotations

import os

import psycopg
import pytest


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
