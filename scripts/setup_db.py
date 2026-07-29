"""
Initialise la base sackme : rôle, database, schéma, seed.
Usage : python scripts/setup_db.py
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from psycopg import sql

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

# Connexion admin (superuser créé à l'install Windows, ou postgres Docker)
ADMIN_URL = os.getenv(
    "POSTGRES_ADMIN_URL",
    "postgresql://postgres:sackme@localhost:5432/postgres",
)
APP_USER = os.getenv("POSTGRES_USER", "sackme")
APP_PASSWORD = os.getenv("POSTGRES_PASSWORD", "sackme")
APP_DB = os.getenv("POSTGRES_DB", "sackme")


def run_sql_file(conn: psycopg.Connection, path: Path) -> None:
    sql_text = path.read_text(encoding="utf-8")
    with conn.cursor() as cur:
        cur.execute(sql_text)
    conn.commit()
    print(f"  OK  {path.name}")


def main() -> None:
    print(f"Admin : {ADMIN_URL}")
    try:
        admin = psycopg.connect(ADMIN_URL, autocommit=True)
    except psycopg.Error as exc:
        print("Connexion admin impossible.")
        print(f"  {exc}")
        print("\nVérifie que PostgreSQL tourne et POSTGRES_ADMIN_URL dans .env")
        sys.exit(1)

    with admin:
        with admin.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_roles WHERE rolname = %s", (APP_USER,))
            if not cur.fetchone():
                cur.execute(
                    sql.SQL("CREATE ROLE {} LOGIN PASSWORD {}").format(
                        sql.Identifier(APP_USER),
                        sql.Literal(APP_PASSWORD),
                    )
                )
                print(f"  OK  rôle {APP_USER}")
            else:
                print(f"  ·   rôle {APP_USER} existe")

            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (APP_DB,))
            if not cur.fetchone():
                cur.execute(
                    sql.SQL("CREATE DATABASE {} OWNER {}").format(
                        sql.Identifier(APP_DB),
                        sql.Identifier(APP_USER),
                    )
                )
                print(f"  OK  database {APP_DB}")
            else:
                print(f"  ·   database {APP_DB} existe")

            cur.execute(
                sql.SQL("GRANT ALL PRIVILEGES ON DATABASE {} TO {}").format(
                    sql.Identifier(APP_DB),
                    sql.Identifier(APP_USER),
                )
            )

    app_url = f"postgresql://{APP_USER}:{APP_PASSWORD}@localhost:5432/{APP_DB}"
    # Aussi en superuser pour CREATE EXTENSION
    try:
        conn = psycopg.connect(
            ADMIN_URL.replace("/postgres", f"/{APP_DB}"),
            autocommit=False,
        )
    except psycopg.Error:
        conn = psycopg.connect(app_url)

    with conn:
        run_sql_file(conn, ROOT / "sql" / "schema.sql")
        # Droits sur le schéma public pour sackme
        with conn.cursor() as cur:
            cur.execute(
                sql.SQL("GRANT ALL ON SCHEMA public TO {}").format(
                    sql.Identifier(APP_USER)
                )
            )
            cur.execute(
                sql.SQL("GRANT ALL ON ALL TABLES IN SCHEMA public TO {}").format(
                    sql.Identifier(APP_USER)
                )
            )
            cur.execute(
                sql.SQL(
                    "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO {}"
                ).format(sql.Identifier(APP_USER))
            )
            cur.execute(
                sql.SQL(
                    "ALTER DEFAULT PRIVILEGES IN SCHEMA public "
                    "GRANT ALL ON TABLES TO {}"
                ).format(sql.Identifier(APP_USER))
            )
        conn.commit()
        run_sql_file(conn, ROOT / "sql" / "seed.sql")

    print(f"\nPrêt. DATABASE_URL={app_url}")
    print("Lance : python app.py")


if __name__ == "__main__":
    main()
