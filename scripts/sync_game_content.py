#!/usr/bin/env python3
"""
Sync game content from data/catalog/.

  python scripts/sync_game_content.py --write   # update SQL, demo, TS, README
  python scripts/sync_game_content.py --check   # fail on drift (CI / pre-commit)

Run after any subsidiary, role, or catalog content add/change.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("PyYAML required: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "catalog" / "entities.yaml"


def load_entities() -> list[dict]:
    data = yaml.safe_load(CATALOG.read_text(encoding="utf-8"))
    entities = data.get("entities") or []
    if not entities:
        raise SystemExit(f"Empty catalog: {CATALOG}")
    for e in entities:
        for k in ("id", "name", "domain_fr", "domain_en", "blurb_fr", "blurb_en"):
            if not e.get(k):
                raise SystemExit(f"Missing field '{k}' for entity {e}")
    return entities


def sql_escape(s: str) -> str:
    return s.replace("'", "''")


def replace_block(text: str, begin: str, end: str, inner: str) -> str:
    pattern = re.compile(
        re.escape(begin) + r".*?" + re.escape(end),
        re.DOTALL,
    )
    block = f"{begin}\n{inner.rstrip()}\n{end}"
    if not pattern.search(text):
        raise SystemExit(f"Markers not found: {begin} … {end}")
    return pattern.sub(block, text, count=1)


def render_demo_entities(entities: list[dict]) -> str:
    lines = ["ENTITIES = ["]
    for e in entities:
        lines.append("    {")
        for k in ("id", "name", "domain_fr", "domain_en", "blurb_fr", "blurb_en"):
            val = e[k].replace("\\", "\\\\").replace('"', '\\"')
            lines.append(f'        "{k}": "{val}",')
        lines.append("    },")
    lines.append("]")
    return "\n".join(lines)


def render_sql_entities(entities: list[dict]) -> str:
    rows = []
    for e in entities:
        rows.append(
            "  ('{id}', '{name}', '{domain_fr}', '{domain_en}',\n"
            "   '{blurb_fr}',\n"
            "   '{blurb_en}')".format(
                id=sql_escape(e["id"]),
                name=sql_escape(e["name"]),
                domain_fr=sql_escape(e["domain_fr"]),
                domain_en=sql_escape(e["domain_en"]),
                blurb_fr=sql_escape(e["blurb_fr"]),
                blurb_en=sql_escape(e["blurb_en"]),
            )
        )
    body = ",\n".join(rows)
    return (
        "INSERT INTO entities (id, name, domain_fr, domain_en, blurb_fr, blurb_en) VALUES\n"
        f"{body}\n"
        "ON CONFLICT (id) DO NOTHING;"
    )


def render_ts_type(entities: list[dict]) -> str:
    lines = ["export type MutualisEntityId ="]
    for e in entities:
        lines.append(f"  | '{e['id']}'")
    return "\n".join(lines)


def render_ts_entities(entities: list[dict]) -> str:
    chunks = ["export const MUTUALIS_ENTITIES: readonly MutualisEntity[] = ["]
    for e in entities:
        chunks.append("  {")
        chunks.append(f"    id: '{e['id']}',")
        chunks.append(f"    name: '{e['name']}',")
        chunks.append(
            f"    domain: {{ fr: '{_ts(e['domain_fr'])}', en: '{_ts(e['domain_en'])}' }},"
        )
        chunks.append("    blurb: {")
        chunks.append(f"      fr: '{_ts(e['blurb_fr'])}',")
        chunks.append(f"      en: '{_ts(e['blurb_en'])}',")
        chunks.append("    },")
        chunks.append("  },")
    chunks.append("] as const")
    return "\n".join(chunks)


def _ts(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def ensure_domain_beats(ts: str, entities: list[dict]) -> str:
    """Add a DOMAIN_BEATS stub when a subsidiary is missing."""
    for e in entities:
        eid = e["id"]
        if re.search(rf"\b{re.escape(eid)}\s*:", ts):
            continue
        name = _ts(e["name"])
        bf = _ts(e["blurb_fr"])
        be = _ts(e["blurb_en"])
        stub = (
            f"  {eid}: {{\n"
            f"    cadrage: {{\n"
            f"      fr: '{bf}',\n"
            f"      en: '{be}',\n"
            f"    }},\n"
            f"    gouvernance: {{\n"
            f"      fr: 'Gouvernance data — {name} : finalité, rétention, accès par rôle.',\n"
            f"      en: 'Data governance — {name}: purpose, retention, role-based access.',\n"
            f"    }},\n"
            f"  }},\n"
        )
        ts = ts.replace(
            "\n}\n\nexport interface ExerciseCasting",
            "\n" + stub + "}\n\nexport interface ExerciseCasting",
            1,
        )
    return ts


def update_readme(readme: str, n: int) -> str:
    readme = re.sub(
        r"\d+ filiales Mutualis",
        f"{n} filiales Mutualis",
        readme,
    )
    readme = re.sub(
        r"\d+ Mutualis subsidiaries",
        f"{n} Mutualis subsidiaries",
        readme,
    )
    return readme


def write_all(entities: list[dict]) -> list[Path]:
    touched: list[Path] = []

    demo = ROOT / "demo_content.py"
    demo_txt = demo.read_text(encoding="utf-8")
    demo.write_text(
        replace_block(
            demo_txt,
            "# BEGIN AUTO:ENTITIES",
            "# END AUTO:ENTITIES",
            render_demo_entities(entities),
        ),
        encoding="utf-8",
    )
    touched.append(demo)

    seed = ROOT / "sql" / "seed.sql"
    seed_txt = seed.read_text(encoding="utf-8")
    seed.write_text(
        replace_block(
            seed_txt,
            "-- BEGIN AUTO:ENTITIES",
            "-- END AUTO:ENTITIES",
            render_sql_entities(entities),
        ),
        encoding="utf-8",
    )
    touched.append(seed)

    ts_path = ROOT / "src" / "data" / "dataStack" / "mutualisEntities.ts"
    ts = ts_path.read_text(encoding="utf-8")
    ts = replace_block(
        ts,
        "// BEGIN AUTO:ENTITY_ID",
        "// END AUTO:ENTITY_ID",
        render_ts_type(entities),
    )
    ts = replace_block(
        ts,
        "// BEGIN AUTO:ENTITIES",
        "// END AUTO:ENTITIES",
        render_ts_entities(entities),
    )
    ts = ensure_domain_beats(ts, entities)
    ts_path.write_text(ts, encoding="utf-8")
    touched.append(ts_path)

    readme = ROOT / "README.md"
    readme.write_text(
        update_readme(readme.read_text(encoding="utf-8"), len(entities)),
        encoding="utf-8",
    )
    touched.append(readme)

    # Idempotent migration for already-initialized Postgres
    mig = ROOT / "sql" / "migrations" / "999_sync_entities.sql"
    rows = []
    for e in entities:
        rows.append(
            "INSERT INTO entities (id, name, domain_fr, domain_en, blurb_fr, blurb_en) VALUES\n"
            "  ('{id}', '{name}', '{df}', '{de}', '{bf}', '{be}')\n"
            "ON CONFLICT (id) DO UPDATE SET\n"
            "  name = EXCLUDED.name,\n"
            "  domain_fr = EXCLUDED.domain_fr,\n"
            "  domain_en = EXCLUDED.domain_en,\n"
            "  blurb_fr = EXCLUDED.blurb_fr,\n"
            "  blurb_en = EXCLUDED.blurb_en;".format(
                id=sql_escape(e["id"]),
                name=sql_escape(e["name"]),
                df=sql_escape(e["domain_fr"]),
                de=sql_escape(e["domain_en"]),
                bf=sql_escape(e["blurb_fr"]),
                be=sql_escape(e["blurb_en"]),
            )
        )
    mig.write_text(
        "-- Auto-generated by scripts/sync_game_content.py — do not edit by hand\n"
        + "\n".join(rows)
        + "\n",
        encoding="utf-8",
    )
    touched.append(mig)

    return touched


def extract_ids_from_demo(text: str) -> set[str]:
    block = re.search(
        r"# BEGIN AUTO:ENTITIES(.*?)# END AUTO:ENTITIES",
        text,
        re.DOTALL,
    )
    if not block:
        return set()
    return set(re.findall(r"""['"]id['"]:\s*['"]([a-z0-9-]+)['"]""", block.group(1)))


def extract_ids_from_sql(text: str) -> set[str]:
    block = re.search(
        r"-- BEGIN AUTO:ENTITIES(.*?)-- END AUTO:ENTITIES",
        text,
        re.DOTALL,
    )
    if not block:
        return set()
    return set(re.findall(r"\('([a-z0-9-]+)'", block.group(1)))


def extract_ids_from_ts(text: str) -> set[str]:
    block = re.search(
        r"// BEGIN AUTO:ENTITY_ID(.*?)// END AUTO:ENTITY_ID",
        text,
        re.DOTALL,
    )
    if not block:
        return set()
    return set(re.findall(r"'([a-z0-9-]+)'", block.group(1)))


def check_all(entities: list[dict]) -> None:
    expected = {e["id"] for e in entities}
    demo = extract_ids_from_demo((ROOT / "demo_content.py").read_text(encoding="utf-8"))
    # demo file may have other "id" keys — restrict to entity names from catalog intersection size
    sql = extract_ids_from_sql((ROOT / "sql" / "seed.sql").read_text(encoding="utf-8"))
    ts = extract_ids_from_ts(
        (ROOT / "src" / "data" / "dataStack" / "mutualisEntities.ts").read_text(
            encoding="utf-8"
        )
    )
    errors: list[str] = []
    if sql != expected:
        errors.append(f"sql/seed.sql entities {sorted(sql)} != catalog {sorted(expected)}")
    if ts != expected:
        errors.append(
            f"mutualisEntities.ts ids {sorted(ts)} != catalog {sorted(expected)}"
        )
    # demo: must contain all catalog ids
    missing_demo = expected - demo
    if missing_demo:
        errors.append(f"demo_content.py missing entities: {sorted(missing_demo)}")

    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    n = len(entities)
    if f"{n} filiales Mutualis" not in readme and f"{n} Mutualis subsidiaries" not in readme:
        # require at least one
        if not re.search(rf"{n} filiales Mutualis|{n} Mutualis subsidiaries", readme):
            errors.append(f"README does not mention {n} subsidiaries")

    # test expectation
    test_demo = (ROOT / "tests" / "test_demo_content.py").read_text(encoding="utf-8")
    if f">= {n}" not in test_demo and f"HaveLength({n})" not in (
        ROOT / "src" / "data" / "dataStack" / "roleContent.test.ts"
    ).read_text(encoding="utf-8"):
        # soft: roleContent must have length n
        rc = (ROOT / "src" / "data" / "dataStack" / "roleContent.test.ts").read_text(
            encoding="utf-8"
        )
        if f"toHaveLength({n})" not in rc:
            errors.append(f"roleContent.test.ts must expect toHaveLength({n})")

    if errors:
        print("SYNC CHECK FAILED:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        print(
            "\nFix with: python scripts/sync_game_content.py --write",
            file=sys.stderr,
        )
        raise SystemExit(1)
    print(f"OK — {n} entities synced across catalog / SQL / TS / demo / README")


def patch_tests(entities: list[dict]) -> None:
    n = len(entities)
    rc = ROOT / "src" / "data" / "dataStack" / "roleContent.test.ts"
    txt = rc.read_text(encoding="utf-8")
    txt2 = re.sub(r"toHaveLength\(\d+\)", f"toHaveLength({n})", txt)
    if txt2 != txt:
        rc.write_text(txt2, encoding="utf-8")

    td = ROOT / "tests" / "test_demo_content.py"
    t = td.read_text(encoding="utf-8")
    t2 = re.sub(r"assert len\(ids\) >= \d+", f"assert len(ids) >= {n}", t)
    t2 = re.sub(r"assert n >= \d+", f"assert n >= {n}", t2)
    if t2 != t:
        td.write_text(t2, encoding="utf-8")

    db = ROOT / "tests" / "test_db.py"
    d = db.read_text(encoding="utf-8")
    d2 = re.sub(r"assert n >= \d+", f"assert n >= {n}", d)
    if d2 != d:
        db.write_text(d2, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync Sack Me! game content")
    g = parser.add_mutually_exclusive_group(required=True)
    g.add_argument("--write", action="store_true", help="Regenerate artifacts")
    g.add_argument("--check", action="store_true", help="Verify consistency")
    args = parser.parse_args()

    entities = load_entities()
    if args.write:
        touched = write_all(entities)
        patch_tests(entities)
        print("Updated:")
        for p in touched:
            print(f"  - {p.relative_to(ROOT)}")
        print(f"  - tests (entity counts → {len(entities)})")
        check_all(entities)
    else:
        check_all(entities)


if __name__ == "__main__":
    main()
