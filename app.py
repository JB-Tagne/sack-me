"""
Sack Me! — serious game CLI (gestion de projet / gouvernance data).
Progression et contenu lus/écrits dans PostgreSQL.
"""

from __future__ import annotations

import os
import re
import sys
import unicodedata
import uuid
from dataclasses import dataclass
from typing import Any

import psycopg
from dotenv import load_dotenv
from psycopg.rows import dict_row

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://sackme:sackme@localhost:5432/sackme",
)

# Rôles disponibles selon le type de projet (ids = table roles)
IT_ROLE_IDS = (
    "business-analyst",
    "chef-de-projet",
    "product-owner",
    "scrum-master",
    "technico-fonctionnel",
)
DATA_AI_ROLE_IDS = IT_ROLE_IDS + (
    "data-manager",
    "data-steward",
    "data-governance-manager",
    "ai-governance-manager",
)

PASS_POINTS = {"pm": 8, "tech": 10, "gov": 9}
FAIL_RISK = {"pm": 14, "tech": 12, "gov": 13}
PASS_RELIEF = {"pm": 6, "tech": 5, "gov": 6}
FIRE_THRESHOLD = 100


# ─── Utilitaires affichage / saisie ─────────────────────────────


def clear() -> None:
    os.system("cls" if os.name == "nt" else "clear")


def _configure_stdout() -> None:
    """Évite les UnicodeEncodeError sur consoles Windows (cp1252)."""
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]
        except Exception:
            pass


def pause(msg: str = "Entrée pour continuer…") -> None:
    input(f"\n{msg}")


def banner() -> None:
    print(
        """
================================================
              SACK ME!
   Carriere PM / Gouvernance · Mutualis
================================================
"""
    )


def ask_choice(prompt: str, n: int) -> int:
    while True:
        raw = input(f"{prompt} [1-{n}] : ").strip()
        if raw.isdigit():
            i = int(raw)
            if 1 <= i <= n:
                return i - 1
        print(f"  Choix invalide. Entre un nombre entre 1 et {n}.")


def ask_multiline(hint: str) -> str:
    print(f"\n{hint}")
    print("(Termine par une ligne contenant seulement END)\n")
    lines: list[str] = []
    while True:
        line = input()
        if line.strip() == "END":
            break
        lines.append(line)
    return "\n".join(lines).strip()


def norm(s: str) -> str:
    s = s.strip().lower()
    s = unicodedata.normalize("NFD", s)
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def clamp(n: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, n))


def loc(row: dict[str, Any], field: str, locale: str) -> str:
    key = f"{field}_{locale}" if locale in ("fr", "en") else f"{field}_fr"
    return str(row.get(key) or row.get(f"{field}_fr") or "")


# ─── Évaluation livrable ────────────────────────────────────────


def evaluate_script(expect_type: str, text: str, keywords: list[str] | None) -> bool:
    raw = text or ""
    t = norm(raw)
    if not t:
        return False

    if expect_type == "sql":
        if not any(x in t for x in ("select", "with ", "count", "where")):
            return False
    elif expect_type == "python":
        if not (
            "import" in t
            or "def " in t
            or "read_csv" in t
            or "pandas" in t
            or re.search(r"[=:]", raw)
        ):
            return False

    kws = [k for k in (keywords or []) if len(norm(k).replace(" ", "")) >= 2]
    if kws:
        hits = sum(1 for k in kws if norm(k) in t)
        need = min(2, len(kws))
        if hits < need:
            return False
    return True


# ─── Accès base ─────────────────────────────────────────────────


def connect() -> psycopg.Connection:
    try:
        return psycopg.connect(DATABASE_URL, row_factory=dict_row)
    except psycopg.Error as exc:
        print("Impossible de se connecter à PostgreSQL.")
        print(f"  URL : {DATABASE_URL}")
        print(f"  Erreur : {exc}")
        print("\nDémarre la base : docker compose up -d")
        print("Puis vérifie .env (copie depuis .env.example).")
        sys.exit(1)


def fetch_all(conn: psycopg.Connection, sql: str, params: tuple[Any, ...] = ()) -> list[dict]:
    with conn.cursor() as cur:
        cur.execute(sql, params)
        return list(cur.fetchall())


def fetch_one(conn: psycopg.Connection, sql: str, params: tuple[Any, ...] = ()) -> dict | None:
    rows = fetch_all(conn, sql, params)
    return rows[0] if rows else None


def execute(conn: psycopg.Connection, sql: str, params: tuple[Any, ...] = ()) -> None:
    with conn.cursor() as cur:
        cur.execute(sql, params)
    conn.commit()


# ─── Modèle joueur ──────────────────────────────────────────────


@dataclass
class Player:
    id: str
    session_key: str
    locale: str
    entity_id: str | None
    project_kind: str | None
    role_id: str | None
    career_score: int
    fire_risk: int
    wins: int
    fails: int
    level_id: int
    step_index: int
    phase: str
    step_half: str


def row_to_player(r: dict) -> Player:
    return Player(
        id=str(r["id"]),
        session_key=r["session_key"],
        locale=r["locale"],
        entity_id=r.get("entity_id"),
        project_kind=r.get("project_kind"),
        role_id=r.get("role_id"),
        career_score=int(r["career_score"]),
        fire_risk=int(r["fire_risk"]),
        wins=int(r["wins"]),
        fails=int(r["fails"]),
        level_id=int(r["level_id"]),
        step_index=int(r["step_index"]),
        phase=r["phase"],
        step_half=r["step_half"],
    )


def save_player(conn: psycopg.Connection, p: Player) -> None:
    execute(
        conn,
        """
        UPDATE players SET
          locale = %s, entity_id = %s, project_kind = %s, role_id = %s,
          career_score = %s, fire_risk = %s, wins = %s, fails = %s,
          level_id = %s, step_index = %s, phase = %s, step_half = %s,
          updated_at = NOW()
        WHERE id = %s::uuid
        """,
        (
            p.locale,
            p.entity_id,
            p.project_kind,
            p.role_id,
            p.career_score,
            p.fire_risk,
            p.wins,
            p.fails,
            p.level_id,
            p.step_index,
            p.phase,
            p.step_half,
            p.id,
        ),
    )


def title_for_score(conn: psycopg.Connection, score: int, locale: str) -> dict:
    rows = fetch_all(
        conn,
        "SELECT * FROM career_titles WHERE min_score <= %s ORDER BY min_score DESC LIMIT 1",
        (score,),
    )
    if rows:
        return rows[0]
    return fetch_one(conn, "SELECT * FROM career_titles ORDER BY min_score ASC LIMIT 1") or {
        "label_fr": "Junior",
        "label_en": "Junior",
    }


def apply_outcome(p: Player, passed: bool, mode: str) -> None:
    if passed:
        p.career_score += PASS_POINTS[mode]
        p.fire_risk = clamp(p.fire_risk - PASS_RELIEF[mode], 0, 100)
        p.wins += 1
    else:
        p.fire_risk = clamp(p.fire_risk + FAIL_RISK[mode], 0, 100)
        p.fails += 1


def hud(conn: psycopg.Connection, p: Player) -> None:
    title = title_for_score(conn, p.career_score, p.locale)
    grade = loc(title, "label", p.locale)
    role = ""
    if p.role_id:
        r = fetch_one(conn, "SELECT * FROM roles WHERE id = %s", (p.role_id,))
        if r:
            role = loc(r, "label", p.locale)
    poste = f"{role} · {grade}" if role else f"Mutualis · {grade}"
    print(f"-- {poste}  |  score {p.career_score}  |  fireRisk {p.fire_risk}%  |  +{p.wins} -{p.fails}")


# ─── Phases de jeu ──────────────────────────────────────────────


def phase_career_pick(conn: psycopg.Connection, p: Player) -> None:
    clear()
    banner()
    print("Choisis ta filiale Mutualis Group.\n")
    entities = fetch_all(conn, "SELECT * FROM entities ORDER BY name")
    for i, e in enumerate(entities, 1):
        print(f"  {i}. {e['name']} — {loc(e, 'domain', p.locale)}")
        print(f"     {loc(e, 'blurb', p.locale)}")
    p.entity_id = entities[ask_choice("Filiale", len(entities))]["id"]

    clear()
    banner()
    print("Type de projet.\n")
    kinds = fetch_all(conn, "SELECT * FROM project_kinds ORDER BY id")
    for i, k in enumerate(kinds, 1):
        print(f"  {i}. {loc(k, 'label', p.locale)}")
        print(f"     {loc(k, 'hint', p.locale)}")
    p.project_kind = kinds[ask_choice("Projet", len(kinds))]["id"]

    clear()
    banner()
    print("Choisis ton rôle.\n")
    allowed = IT_ROLE_IDS if p.project_kind == "it" else DATA_AI_ROLE_IDS
    roles = fetch_all(
        conn,
        "SELECT * FROM roles WHERE id = ANY(%s) ORDER BY label_fr",
        (list(allowed),),
    )
    for i, r in enumerate(roles, 1):
        track = "PM" if r["track"] == "pm" else "Gouvernance"
        print(f"  {i}. {loc(r, 'label', p.locale)}  [{track}]")
    p.role_id = roles[ask_choice("Rôle", len(roles))]["id"]

    p.phase = "playing"
    p.level_id = 0
    p.step_index = 0
    p.step_half = "pm"
    save_player(conn, p)

    ent = fetch_one(conn, "SELECT * FROM entities WHERE id = %s", (p.entity_id,))
    role = fetch_one(conn, "SELECT * FROM roles WHERE id = %s", (p.role_id,))
    clear()
    banner()
    print(f"Tu rejoins {ent['name'] if ent else p.entity_id}.")
    print(f"Rôle : {loc(role, 'label', p.locale) if role else p.role_id}")
    print("Toute mauvaise décision te rapproche de la sortie.\n")
    pause()


def get_steps_for_level(conn: psycopg.Connection, level_id: int) -> list[dict]:
    return fetch_all(
        conn,
        "SELECT * FROM adventure_steps WHERE level_id = %s ORDER BY sort_order",
        (level_id,),
    )


def get_question(conn: psycopg.Connection, step_id: str, kind: str) -> dict | None:
    return fetch_one(
        conn,
        "SELECT * FROM step_questions WHERE step_id = %s AND kind = %s",
        (step_id, kind),
    )


def play_qcm(conn: psycopg.Connection, p: Player, q: dict, mode: str) -> bool:
    print(f"\n[{mode.upper()}] {loc(q, 'question', p.locale)}\n")
    opts = [
        loc(q, "option_a", p.locale),
        loc(q, "option_b", p.locale),
        loc(q, "option_c", p.locale),
    ]
    for i, o in enumerate(opts, 1):
        print(f"  {i}. {o}")
    choice = ask_choice("Réponse", 3)
    passed = choice == int(q["correct_index"])
    apply_outcome(p, passed, mode)
    print()
    if passed:
        print("OK — Correct.")
    else:
        print("KO — Incorrect.")
        print(f"  -> {loc(q, 'correction', p.locale)}")
    if q.get("framework_ref"):
        print(f"  Ref : {q['framework_ref']}")
    return passed


def play_tech(conn: psycopg.Connection, p: Player, step: dict) -> bool:
    expect = step["expect_type"]
    print(f"\n[TECH · {expect.upper()}]")
    print(loc(step, "do", p.locale))
    text = ask_multiline("Colle ton livrable :")
    keywords = list(step.get("keywords") or [])
    passed = evaluate_script(expect, text, keywords)
    apply_outcome(p, passed, "tech")
    print()
    if passed:
        print("OK — Livrable valide.")
    else:
        print("KO — Livrable insuffisant.")
        print(f"  -> {loc(step, 'correction', p.locale)}")
    return passed


def mark_step_done(conn: psycopg.Connection, p: Player, step_id: str) -> None:
    execute(
        conn,
        """
        INSERT INTO player_completed_steps (player_id, step_id)
        VALUES (%s::uuid, %s)
        ON CONFLICT DO NOTHING
        """,
        (p.id, step_id),
    )


def phase_playing(conn: psycopg.Connection, p: Player) -> None:
    levels = fetch_all(conn, "SELECT * FROM adventure_levels ORDER BY id")
    if not levels:
        print("Aucun niveau en base. Vérifie sql/seed.sql.")
        p.phase = "done"
        save_player(conn, p)
        return

    max_level = max(int(lv["id"]) for lv in levels)
    steps = get_steps_for_level(conn, p.level_id)

    if not steps or p.step_index >= len(steps):
        if p.level_id >= max_level:
            p.phase = "done"
            save_player(conn, p)
            return
        p.level_id += 1
        p.step_index = 0
        p.step_half = "pm"
        save_player(conn, p)
        return

    level = fetch_one(conn, "SELECT * FROM adventure_levels WHERE id = %s", (p.level_id,))
    step = steps[p.step_index]

    clear()
    banner()
    hud(conn, p)
    if level:
        print(f"\nNiveau {p.level_id} — {loc(level, 'title', p.locale)}")
        if p.step_index == 0 and p.step_half == "pm":
            print(loc(level, "intro", p.locale))
    print(f"\nÉtape : {loc(step, 'title', p.locale)}")
    print(loc(step, "say", p.locale))

    # Demi-étapes : pm → tech → gov
    if p.step_half == "pm":
        q = get_question(conn, step["id"], "pm")
        if q:
            play_qcm(conn, p, q, "pm")
        p.step_half = "tech"
    elif p.step_half == "tech":
        play_tech(conn, p, step)
        p.step_half = "gov"
    else:
        q = get_question(conn, step["id"], "gov")
        if q:
            play_qcm(conn, p, q, "gov")
        mark_step_done(conn, p, step["id"])
        p.step_index += 1
        p.step_half = "pm"

    if p.fire_risk >= FIRE_THRESHOLD:
        p.phase = "fired"
    save_player(conn, p)
    pause()


def phase_fired(conn: psycopg.Connection, p: Player) -> None:
    clear()
    banner()
    meeting = fetch_one(conn, "SELECT * FROM meetings WHERE id = 'comex-fired'")
    if meeting:
        print(loc(meeting, "title", p.locale))
        print()
        print(loc(meeting, "opening", p.locale))
        print()
        print(loc(meeting, "closing", p.locale))
    else:
        print("COMEX — Tu es sacké. fireRisk à 100%.")
    print(f"\nBilan : score {p.career_score} · victoires {p.wins} · échecs {p.fails}")
    pause("Entrée pour quitter…")
    p.phase = "ended"
    save_player(conn, p)


def phase_done(conn: psycopg.Connection, p: Player) -> None:
    clear()
    banner()
    hud(conn, p)
    title = title_for_score(conn, p.career_score, p.locale)
    print("\nIncrement MVP terminé. Tu tiens encore ton poste.")
    print(f"Grade final : {loc(title, 'label', p.locale)}")
    print(f"fireRisk : {p.fire_risk}%")
    pause("Entrée pour quitter…")
    p.phase = "ended"
    save_player(conn, p)


# ─── Session ────────────────────────────────────────────────────


def new_player(conn: psycopg.Connection, locale: str = "fr") -> Player:
    session_key = uuid.uuid4().hex[:12]
    row = fetch_one(
        conn,
        """
        INSERT INTO players (session_key, locale, phase, step_half)
        VALUES (%s, %s, 'career-pick', 'pm')
        RETURNING *
        """,
        (session_key, locale),
    )
    conn.commit()
    assert row is not None
    return row_to_player(row)


def load_player(conn: psycopg.Connection, session_key: str) -> Player | None:
    row = fetch_one(conn, "SELECT * FROM players WHERE session_key = %s", (session_key.strip(),))
    return row_to_player(row) if row else None


def main_menu(conn: psycopg.Connection) -> Player:
    clear()
    banner()
    print("  1. Nouvelle partie")
    print("  2. Continuer (code session)")
    print("  3. Quitter")
    choice = ask_choice("Menu", 3)
    if choice == 0:
        return new_player(conn)
    if choice == 1:
        key = input("Code session : ").strip()
        p = load_player(conn, key)
        if not p:
            print("Session introuvable.")
            pause()
            return main_menu(conn)
        print(f"Session {p.session_key} reprise (phase={p.phase}).")
        pause()
        return p
    sys.exit(0)


def game_loop(conn: psycopg.Connection, p: Player) -> None:
    print(f"\nCode session (à garder) : {p.session_key}\n")
    pause()
    while p.phase not in ("ended",):
        if p.phase == "career-pick":
            phase_career_pick(conn, p)
        elif p.phase == "playing":
            phase_playing(conn, p)
        elif p.phase == "fired":
            phase_fired(conn, p)
        elif p.phase == "done":
            phase_done(conn, p)
        else:
            print(f"Phase inconnue : {p.phase}")
            break


def main() -> None:
    _configure_stdout()
    with connect() as conn:
        # Smoke-check contenu
        n = fetch_one(conn, "SELECT COUNT(*) AS c FROM entities")
        if not n or int(n["c"]) == 0:
            print("Base vide : lance docker compose up -d (init schema + seed).")
            sys.exit(1)
        player = main_menu(conn)
        game_loop(conn, player)
        print("\nÀ bientôt chez Mutualis — ou pas.")


if __name__ == "__main__":
    main()
