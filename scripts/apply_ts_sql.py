"""Apply schema migration + TS→SQL seed to local Postgres."""

from __future__ import annotations

import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")
URL = os.getenv("DATABASE_URL", "postgresql://sackme:sackme@localhost:5432/sackme")


def main() -> None:
    files = [
        ROOT / "sql" / "migrations" / "003_ts_tables_to_sql.sql",
        ROOT / "sql" / "seed_from_ts.sql",
    ]
    with psycopg.connect(URL) as conn:
        for path in files:
            print("Applying", path.name)
            sql = path.read_text(encoding="utf-8")
            conn.execute(sql)
            conn.commit()
        row = conn.execute(
            "SELECT "
            "(SELECT COUNT(*) FROM tools) AS tools, "
            "(SELECT COUNT(*) FROM adventure_steps) AS steps, "
            "(SELECT COUNT(*) FROM content_packs) AS packs, "
            "(SELECT COUNT(*) FROM meetings) AS meetings"
        ).fetchone()
        print("OK", row)


if __name__ == "__main__":
    main()
