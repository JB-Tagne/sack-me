"""
Sack Me! — Streamlit interface (live web).
Content: PostgreSQL if DATABASE_URL is reachable, otherwise embedded demo.
"""

from __future__ import annotations

import os
import uuid
from pathlib import Path
from typing import Any

import streamlit as st
import streamlit.components.v1 as components
from dotenv import load_dotenv

from demo_content import (
    CAREER_TITLES,
    ENTITIES,
    LEVELS,
    MEETING_FIRED,
    PROJECT_KINDS,
    QUESTIONS,
    ROLES,
    STEPS,
)
from game_logic import (
    DATA_AI_ROLE_IDS,
    FIRE_THRESHOLD,
    IT_ROLE_IDS,
    PASS_POINTS,
    apply_outcome,
    evaluate_script,
    loc,
)

load_dotenv()

ROOT = Path(__file__).resolve().parent
REACT_VERSION_FILE = ROOT / "streamlit_static" / "VERSION"
REACT_REPO = "JB-Tagne/sack-me"


def pinned_react_ref() -> str:
    """Commit SHA (or main) for the React build under streamlit_static/."""
    if REACT_VERSION_FILE.is_file():
        pinned = REACT_VERSION_FILE.read_text(encoding="utf-8").strip()
        if pinned:
            return pinned
    return "main"


def react_cdn_asset(path: str, ref: str | None = None) -> str:
    """jsDelivr serves .js/.css correctly; never load index.html from jsDelivr (text/plain)."""
    sha = ref or pinned_react_ref()
    return f"https://cdn.jsdelivr.net/gh/{REACT_REPO}@{sha}/streamlit_static/{path.lstrip('/')}"


def react_adventure_html() -> str:
    """Minimal HTML shell — Streamlit serves it as text/html; assets come from the CDN."""
    ref = pinned_react_ref()
    css = react_cdn_asset("assets/style.css", ref)
    js = react_cdn_asset("assets/index.js", ref)
    return f"""<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=Source+Sans+3:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" crossorigin href="{css}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="{js}"></script>
  </body>
</html>"""


# Player-facing UI chrome (bilingual). Code/comments stay English.
UI: dict[str, dict[str, str]] = {
    "fr": {
        "lang": "Langue",
        "new_game": "Nouvelle partie",
        "resume": "Reprendre (code session)",
        "continue": "Continuer",
        "session_missing": "Session introuvable (Postgres requis hors mode démo).",
        "demo_mode": "Mode démo (contenu embarqué — pas de Postgres)",
        "pg_mode": "Données : PostgreSQL",
        "local_session": "Session locale (pas d'hôte Streamlit Cloud)",
        "cloud_hint": "Hôte cloud : {host} — si le lien public échoue, passe l'app en Public (share.streamlit.io → ⋮ → Settings → Sharing)",
        "subsidiary": "Filiale Mutualis",
        "choose_subsidiary": "Choisis ta filiale",
        "confirm_subsidiary": "Valider la filiale",
        "project_type": "Type de projet",
        "project": "Projet",
        "confirm_project": "Valider le projet",
        "role": "Rôle",
        "your_role": "Ton poste",
        "start": "Lancer l'Incrément",
        "answer": "Réponse",
        "submit": "Valider",
        "submit_deliverable": "Envoyer le livrable",
        "deliverable": "Livrable",
        "deliverable_ph": "Colle ton SQL / Python / texte…",
        "ok_pts": "Correct (+{pts} pts).",
        "ko_risk": "Incorrect — le fireRisk monte.",
        "ok_tech": "Livrable accepté.",
        "ko_tech": "Livrable insuffisant.",
        "done": "Incrément MVP terminé — tu as encore ton poste.",
        "grade": "Grade : **{label}** · fireRisk {risk}%",
        "play_again": "Rejouer",
        "quit": "Quitter / menu",
        "nav_back": "← Précédent",
        "nav_next": "Suivant →",
        "gov_track": "Gouvernance",
        "react_play": "Aventure React complète (animations · meetings · outils)",
        "react_back": "← Retour au menu",
        "react_caption": "Aventure React (assets CDN — ne pas ouvrir index.html sur jsDelivr)",
    },
    "en": {
        "lang": "Language",
        "new_game": "New game",
        "resume": "Resume (session code)",
        "continue": "Continue",
        "session_missing": "Session not found (Postgres required to resume outside demo).",
        "demo_mode": "Demo mode (embedded content — no Postgres)",
        "pg_mode": "Data: PostgreSQL",
        "local_session": "Local session (no Streamlit Cloud host detected)",
        "cloud_hint": "Cloud host: {host} — if the public link fails, set the app to Public (share.streamlit.io → ⋮ → Settings → Sharing)",
        "subsidiary": "Mutualis subsidiary",
        "choose_subsidiary": "Choose your subsidiary",
        "confirm_subsidiary": "Confirm subsidiary",
        "project_type": "Project type",
        "project": "Project",
        "confirm_project": "Confirm project",
        "role": "Role",
        "your_role": "Your position",
        "start": "Start the Increment",
        "answer": "Answer",
        "submit": "Submit",
        "submit_deliverable": "Submit deliverable",
        "deliverable": "Deliverable",
        "deliverable_ph": "Paste your SQL / Python / text…",
        "ok_pts": "Correct (+{pts} pts).",
        "ko_risk": "Incorrect — fireRisk rising.",
        "ok_tech": "Deliverable accepted.",
        "ko_tech": "Insufficient deliverable.",
        "done": "MVP Increment complete — you still have your job.",
        "grade": "Grade : **{label}** · fireRisk {risk}%",
        "play_again": "Play again",
        "quit": "Quit / menu",
        "nav_back": "← Back",
        "nav_next": "Next →",
        "gov_track": "Governance",
        "react_play": "Full React adventure (animations · meetings · tools)",
        "react_back": "← Back to menu",
        "react_caption": "React adventure (CDN assets — do not open index.html on jsDelivr)",
    },
}


def ui(locale: str, key: str, **kwargs: Any) -> str:
    pack = UI.get(locale) or UI["fr"]
    text = pack.get(key) or UI["en"].get(key) or key
    return text.format(**kwargs) if kwargs else text


def live_url() -> str | None:
    """Public app URL for display — never invent a subdomain that 404s / is private."""
    for key in ("STREAMLIT_LIVE_URL",):
        val = os.getenv(key, "").strip()
        if val:
            return val.rstrip("/")
    try:
        val = str(st.secrets.get("STREAMLIT_LIVE_URL", "") or "").strip()  # type: ignore[union-attr]
        if val:
            return val.rstrip("/")
    except Exception:
        pass
    try:
        host = (st.context.headers.get("Host") or st.context.headers.get("host") or "").split(",")[0].strip()
        if host and ("streamlit.app" in host or "streamlitapp.com" in host):
            return f"https://{host}"
    except Exception:
        pass
    return None


def try_pg() -> Any | None:
    url = os.getenv("DATABASE_URL", "")
    if not url:
        try:
            url = st.secrets.get("DATABASE_URL", "")  # type: ignore[union-attr]
        except Exception:
            url = ""
    if not url:
        return None
    try:
        import psycopg
        from psycopg.rows import dict_row

        conn = psycopg.connect(url, row_factory=dict_row)
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) AS c FROM entities")
            row = cur.fetchone()
            if not row or int(row["c"]) == 0:
                conn.close()
                return None
        return conn
    except Exception:
        return None


@st.cache_resource
def get_backend() -> str:
    """'postgres' or 'demo' — cached for the process session."""
    conn = try_pg()
    if conn is not None:
        conn.close()
        return "postgres"
    return "demo"


def pg_fetch_all(sql: str, params: tuple[Any, ...] = ()) -> list[dict]:
    conn = try_pg()
    if conn is None:
        return []
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return list(cur.fetchall())
    finally:
        conn.close()


def pg_fetch_one(sql: str, params: tuple[Any, ...] = ()) -> dict | None:
    rows = pg_fetch_all(sql, params)
    return rows[0] if rows else None


def pg_execute(sql: str, params: tuple[Any, ...] = ()) -> None:
    conn = try_pg()
    if conn is None:
        return
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
        conn.commit()
    finally:
        conn.close()


def list_entities() -> list[dict]:
    if get_backend() == "postgres":
        return pg_fetch_all("SELECT * FROM entities ORDER BY name")
    return sorted(ENTITIES, key=lambda e: e["name"])


def list_kinds() -> list[dict]:
    if get_backend() == "postgres":
        return pg_fetch_all("SELECT * FROM project_kinds ORDER BY id")
    return PROJECT_KINDS


def list_roles(project_kind: str) -> list[dict]:
    allowed = IT_ROLE_IDS if project_kind == "it" else DATA_AI_ROLE_IDS
    if get_backend() == "postgres":
        return pg_fetch_all(
            "SELECT * FROM roles WHERE id = ANY(%s) ORDER BY label_fr",
            (list(allowed),),
        )
    return sorted(
        [r for r in ROLES if r["id"] in allowed],
        key=lambda r: r["label_fr"],
    )


def get_entity(eid: str) -> dict | None:
    if get_backend() == "postgres":
        return pg_fetch_one("SELECT * FROM entities WHERE id = %s", (eid,))
    return next((e for e in ENTITIES if e["id"] == eid), None)


def get_role(rid: str) -> dict | None:
    if get_backend() == "postgres":
        return pg_fetch_one("SELECT * FROM roles WHERE id = %s", (rid,))
    return next((r for r in ROLES if r["id"] == rid), None)


def title_for_score(score: int) -> dict:
    if get_backend() == "postgres":
        row = pg_fetch_one(
            "SELECT * FROM career_titles WHERE min_score <= %s ORDER BY min_score DESC LIMIT 1",
            (score,),
        )
        if row:
            return row
    titles = sorted(CAREER_TITLES, key=lambda t: t["min_score"])
    current = titles[0]
    for t in titles:
        if score >= int(t["min_score"]):
            current = t
    return current


def get_level(level_id: int) -> dict | None:
    if get_backend() == "postgres":
        return pg_fetch_one("SELECT * FROM adventure_levels WHERE id = %s", (level_id,))
    return next((lv for lv in LEVELS if lv["id"] == level_id), None)


def steps_for_level(level_id: int) -> list[dict]:
    if get_backend() == "postgres":
        return pg_fetch_all(
            "SELECT * FROM adventure_steps WHERE level_id = %s ORDER BY sort_order",
            (level_id,),
        )
    return sorted(
        [s for s in STEPS if s["level_id"] == level_id],
        key=lambda s: s["sort_order"],
    )


def get_question(step_id: str, kind: str) -> dict | None:
    if get_backend() == "postgres":
        return pg_fetch_one(
            "SELECT * FROM step_questions WHERE step_id = %s AND kind = %s",
            (step_id, kind),
        )
    return next(
        (q for q in QUESTIONS if q["step_id"] == step_id and q["kind"] == kind),
        None,
    )


def max_level_id() -> int:
    if get_backend() == "postgres":
        row = pg_fetch_one("SELECT MAX(id) AS m FROM adventure_levels")
        return int(row["m"]) if row and row["m"] is not None else 0
    return max(lv["id"] for lv in LEVELS)


def persist_player() -> None:
    p = st.session_state.player
    if get_backend() != "postgres":
        return
    pg_execute(
        """
        INSERT INTO players (
          id, session_key, locale, entity_id, project_kind, role_id,
          career_score, fire_risk, wins, fails, level_id, step_index, phase, step_half
        ) VALUES (
          %s::uuid, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
        ON CONFLICT (session_key) DO UPDATE SET
          locale = EXCLUDED.locale,
          entity_id = EXCLUDED.entity_id,
          project_kind = EXCLUDED.project_kind,
          role_id = EXCLUDED.role_id,
          career_score = EXCLUDED.career_score,
          fire_risk = EXCLUDED.fire_risk,
          wins = EXCLUDED.wins,
          fails = EXCLUDED.fails,
          level_id = EXCLUDED.level_id,
          step_index = EXCLUDED.step_index,
          phase = EXCLUDED.phase,
          step_half = EXCLUDED.step_half,
          updated_at = NOW()
        """,
        (
            p["id"],
            p["session_key"],
            p["locale"],
            p.get("entity_id"),
            p.get("project_kind"),
            p.get("role_id"),
            p["career_score"],
            p["fire_risk"],
            p["wins"],
            p["fails"],
            p["level_id"],
            p["step_index"],
            p["phase"],
            p["step_half"],
        ),
    )


def new_player(locale: str) -> dict[str, Any]:
    p = {
        "id": str(uuid.uuid4()),
        "session_key": uuid.uuid4().hex[:12],
        "locale": locale,
        "entity_id": None,
        "project_kind": None,
        "role_id": None,
        "career_score": 0,
        "fire_risk": 18,
        "wins": 0,
        "fails": 0,
        "level_id": 0,
        "step_index": 0,
        "phase": "career-pick",
        "step_half": "pm",
        "pick_step": "entity",
        "feedback": None,
    }
    return p


def load_player_pg(session_key: str) -> dict[str, Any] | None:
    row = pg_fetch_one("SELECT * FROM players WHERE session_key = %s", (session_key.strip(),))
    if not row:
        return None
    return {
        "id": str(row["id"]),
        "session_key": row["session_key"],
        "locale": row["locale"],
        "entity_id": row.get("entity_id"),
        "project_kind": row.get("project_kind"),
        "role_id": row.get("role_id"),
        "career_score": int(row["career_score"]),
        "fire_risk": int(row["fire_risk"]),
        "wins": int(row["wins"]),
        "fails": int(row["fails"]),
        "level_id": int(row["level_id"]),
        "step_index": int(row["step_index"]),
        "phase": row["phase"],
        "step_half": row["step_half"],
        "pick_step": "entity",
        "feedback": None,
    }


def player_as_obj():
    """Adapt dict → duck-typed object for apply_outcome."""

    class P:
        pass

    p = st.session_state.player
    o = P()
    for k, v in p.items():
        setattr(o, k, v)
    return o


def sync_from_obj(o: Any) -> None:
    p = st.session_state.player
    for k in (
        "career_score",
        "fire_risk",
        "wins",
        "fails",
        "level_id",
        "step_index",
        "phase",
        "step_half",
        "entity_id",
        "project_kind",
        "role_id",
    ):
        if hasattr(o, k):
            p[k] = getattr(o, k)


# ─── UI ─────────────────────────────────────────────────────────


def inject_css() -> None:
    st.markdown(
        """
        <style>
          .stApp {
            background:
              radial-gradient(1200px 500px at 10% -10%, #1a3a4a 0%, transparent 55%),
              radial-gradient(900px 400px at 100% 0%, #3a2a1a 0%, transparent 50%),
              #0e1418;
            color: #e8efe9;
          }
          h1, h2, h3 { font-family: "Segoe UI", system-ui, sans-serif; letter-spacing: 0.02em; }
          .sm-brand {
            font-size: 2.4rem; font-weight: 800; margin: 0;
            color: #f3f7f4;
          }
          .sm-sub { color: #9db0a6; margin-top: 0.25rem; }
          .sm-hud {
            display: flex; gap: 1rem; flex-wrap: wrap;
            padding: 0.75rem 1rem; border: 1px solid #2a3d36;
            background: rgba(20, 32, 28, 0.85); margin: 1rem 0 1.25rem;
          }
          .sm-hud span { color: #c5d5cb; font-size: 0.92rem; }
          .sm-hud strong { color: #7dcea0; }
        </style>
        """,
        unsafe_allow_html=True,
    )


def render_hud(locale: str) -> None:
    p = st.session_state.player
    title = title_for_score(p["career_score"])
    grade = loc(title, "label", locale)
    role = get_role(p["role_id"]) if p.get("role_id") else None
    role_lbl = loc(role, "label", locale) if role else "Mutualis"
    st.markdown(
        f"""
        <div class="sm-hud">
          <span><strong>{role_lbl}</strong> · {grade}</span>
          <span>score <strong>{p["career_score"]}</strong></span>
          <span>fireRisk <strong>{p["fire_risk"]}%</strong></span>
          <span>+{p["wins"]} / -{p["fails"]}</span>
          <span>session <strong>{p["session_key"]}</strong></span>
        </div>
        """,
        unsafe_allow_html=True,
    )


def page_react_adventure(locale: str) -> None:
    st.markdown('<p class="sm-brand">SACK ME!</p>', unsafe_allow_html=True)
    st.caption(ui(locale, "react_caption"))
    if st.button(ui(locale, "react_back")):
        st.session_state.show_react = False
        st.rerun()
    components.html(react_adventure_html(), height=900, scrolling=True)
    st.caption(f"build @{pinned_react_ref()[:7]}")


def page_home() -> None:
    st.markdown('<p class="sm-brand">SACK ME!</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="sm-sub">Career PM / Governance · Mutualis Group</p>',
        unsafe_allow_html=True,
    )
    url = live_url()
    # Prefer FR on first visit (game is FR-first).
    if "home_locale" not in st.session_state:
        st.session_state.home_locale = "fr"
    locale = st.radio(
        ui(st.session_state.home_locale, "lang"),
        ["fr", "en"],
        horizontal=True,
        format_func=lambda x: "FR" if x == "fr" else "EN",
        key="home_locale",
    )
    if url:
        host = url.replace("https://", "").replace("http://", "")
        st.caption(ui(locale, "cloud_hint", host=host))
    else:
        st.caption(ui(locale, "local_session"))
    backend = get_backend()
    st.info(ui(locale, "pg_mode") if backend == "postgres" else ui(locale, "demo_mode"))

    if st.button(ui(locale, "react_play"), use_container_width=True):
        st.session_state.show_react = True
        st.rerun()
    st.caption(ui(locale, "react_caption"))

    c1, c2 = st.columns(2)
    with c1:
        if st.button(ui(locale, "new_game"), type="primary", use_container_width=True):
            st.session_state.player = new_player(locale)
            persist_player()
            st.rerun()
    with c2:
        key = st.text_input(ui(locale, "resume"), placeholder="abc123def456")
        if st.button(ui(locale, "continue"), use_container_width=True) and key.strip():
            loaded = load_player_pg(key) if get_backend() == "postgres" else None
            if loaded:
                st.session_state.player = loaded
                st.rerun()
            else:
                st.error(ui(locale, "session_missing"))


def career_go_back(p: dict[str, Any]) -> None:
    step = p.get("pick_step", "entity")
    if step == "kind":
        p["pick_step"] = "entity"
    elif step == "role":
        p["pick_step"] = "kind"
    persist_player()
    st.rerun()


def playing_go_back(p: dict[str, Any]) -> None:
    """Reverse one half-step (mirrors React goBack on play)."""
    p["feedback"] = None
    half = p.get("step_half", "pm")
    if half == "tech":
        p["step_half"] = "pm"
    elif half == "gov":
        p["step_half"] = "tech"
    else:  # pm
        if p["step_index"] > 0:
            p["step_index"] -= 1
            p["step_half"] = "gov"
        elif p["level_id"] > 0:
            p["level_id"] -= 1
            steps = steps_for_level(p["level_id"])
            p["step_index"] = max(0, len(steps) - 1)
            p["step_half"] = "gov"
        else:
            p["phase"] = "career-pick"
            p["pick_step"] = "role"
    persist_player()
    st.rerun()


def playing_go_next(p: dict[str, Any]) -> None:
    """Skip ahead without scoring (mirrors React goForward / nav.next)."""
    p["feedback"] = None
    half = p.get("step_half", "pm")
    if half == "pm":
        p["step_half"] = "tech"
    elif half == "tech":
        p["step_half"] = "gov"
    else:
        p["step_index"] += 1
        p["step_half"] = "pm"
        steps = steps_for_level(p["level_id"])
        if p["step_index"] >= len(steps):
            if p["level_id"] >= max_level_id():
                p["phase"] = "done"
            else:
                p["level_id"] += 1
                p["step_index"] = 0
    persist_player()
    st.rerun()


def nav_footer(locale: str, *, can_back: bool, can_next: bool, on_back, on_next) -> None:
    b1, b2 = st.columns(2)
    with b1:
        if st.button(ui(locale, "nav_back"), disabled=not can_back, use_container_width=True, key="nav_back"):
            on_back()
    with b2:
        if st.button(ui(locale, "nav_next"), disabled=not can_next, use_container_width=True, key="nav_next"):
            on_next()


def page_career_pick() -> None:
    p = st.session_state.player
    locale = p["locale"]
    render_hud(locale)
    step = p.get("pick_step", "entity")

    if step == "entity":
        st.subheader(ui(locale, "subsidiary"))
        entities = list_entities()
        labels = [f"{e['name']} — {loc(e, 'domain', locale)}" for e in entities]
        choice = st.radio(
            ui(locale, "choose_subsidiary"),
            range(len(entities)),
            format_func=lambda i: labels[i],
        )
        st.caption(loc(entities[choice], "blurb", locale))

        def _confirm_entity() -> None:
            p["entity_id"] = entities[choice]["id"]
            p["pick_step"] = "kind"
            persist_player()
            st.rerun()

        if st.button(ui(locale, "confirm_subsidiary"), type="primary"):
            _confirm_entity()
        nav_footer(locale, can_back=False, can_next=True, on_back=lambda: None, on_next=_confirm_entity)
        return

    if step == "kind":
        st.subheader(ui(locale, "project_type"))
        kinds = list_kinds()
        labels = [f"{loc(k, 'label', locale)} — {loc(k, 'hint', locale)}" for k in kinds]
        choice = st.radio(ui(locale, "project"), range(len(kinds)), format_func=lambda i: labels[i])

        def _confirm_kind() -> None:
            p["project_kind"] = kinds[choice]["id"]
            p["pick_step"] = "role"
            persist_player()
            st.rerun()

        if st.button(ui(locale, "confirm_project"), type="primary"):
            _confirm_kind()
        nav_footer(
            locale,
            can_back=True,
            can_next=True,
            on_back=lambda: career_go_back(p),
            on_next=_confirm_kind,
        )
        return

    st.subheader(ui(locale, "role"))
    roles = list_roles(p["project_kind"] or "data-ai")
    labels = [
        f"{loc(r, 'label', locale)} [{('PM' if r['track'] == 'pm' else ui(locale, 'gov_track'))}]"
        for r in roles
    ]
    choice = st.radio(ui(locale, "your_role"), range(len(roles)), format_func=lambda i: labels[i])

    def _start() -> None:
        p["role_id"] = roles[choice]["id"]
        p["phase"] = "playing"
        p["level_id"] = 0
        p["step_index"] = 0
        p["step_half"] = "pm"
        p["feedback"] = None
        persist_player()
        st.rerun()

    if st.button(ui(locale, "start"), type="primary"):
        _start()
    nav_footer(
        locale,
        can_back=True,
        can_next=True,
        on_back=lambda: career_go_back(p),
        on_next=_start,
    )


def page_playing() -> None:
    p = st.session_state.player
    locale = p["locale"]
    render_hud(locale)

    steps = steps_for_level(p["level_id"])
    if not steps or p["step_index"] >= len(steps):
        if p["level_id"] >= max_level_id():
            p["phase"] = "done"
        else:
            p["level_id"] += 1
            p["step_index"] = 0
            p["step_half"] = "pm"
        persist_player()
        st.rerun()
        return

    level = get_level(p["level_id"])
    step = steps[p["step_index"]]
    if level:
        st.subheader(f"Level {p['level_id']} — {loc(level, 'title', locale)}")
        if p["step_index"] == 0 and p["step_half"] == "pm":
            st.write(loc(level, "intro", locale))

    st.markdown(f"### {loc(step, 'title', locale)}")
    st.write(loc(step, "say", locale))

    if p.get("feedback"):
        fb = p["feedback"]
        if fb["ok"]:
            st.success(fb["msg"])
        else:
            st.error(fb["msg"])
            if fb.get("correction"):
                st.caption(fb["correction"])
        if st.button(ui(locale, "continue")):
            p["feedback"] = None
            persist_player()
            st.rerun()
        nav_footer(
            locale,
            can_back=True,
            can_next=True,
            on_back=lambda: playing_go_back(p),
            on_next=lambda: playing_go_next(p),
        )
        return

    half = p["step_half"]
    if half in ("pm", "gov"):
        q = get_question(step["id"], half)
        if not q:
            p["step_half"] = "tech" if half == "pm" else "pm"
            if half == "gov":
                p["step_index"] += 1
            persist_player()
            st.rerun()
            return
        st.markdown(f"**[{half.upper()}]** {loc(q, 'question', locale)}")
        opts = [loc(q, "option_a", locale), loc(q, "option_b", locale), loc(q, "option_c", locale)]
        ans = st.radio(
            ui(locale, "answer"),
            range(3),
            format_func=lambda i: opts[i],
            key=f"q-{step['id']}-{half}",
        )
        if st.button(ui(locale, "submit"), type="primary"):
            o = player_as_obj()
            passed = ans == int(q["correct_index"])
            apply_outcome(o, passed, half)
            sync_from_obj(o)
            pts = PASS_POINTS[half]
            p["feedback"] = {
                "ok": passed,
                "msg": ui(locale, "ok_pts", pts=pts) if passed else ui(locale, "ko_risk"),
                "correction": None if passed else loc(q, "correction", locale),
            }
            if half == "pm":
                p["step_half"] = "tech"
            else:
                p["step_index"] += 1
                p["step_half"] = "pm"
            if p["fire_risk"] >= FIRE_THRESHOLD:
                p["phase"] = "fired"
            persist_player()
            st.rerun()
        nav_footer(
            locale,
            can_back=True,
            can_next=True,
            on_back=lambda: playing_go_back(p),
            on_next=lambda: playing_go_next(p),
        )
        return

    # tech
    st.markdown(f"**[TECH · {step['expect_type'].upper()}]**")
    st.write(loc(step, "do", locale))
    text = st.text_area(
        ui(locale, "deliverable"),
        height=160,
        placeholder=ui(locale, "deliverable_ph"),
    )
    if st.button(ui(locale, "submit_deliverable"), type="primary"):
        o = player_as_obj()
        kws = list(step.get("keywords") or [])
        passed = evaluate_script(step["expect_type"], text, kws)
        apply_outcome(o, passed, "tech")
        sync_from_obj(o)
        p["feedback"] = {
            "ok": passed,
            "msg": ui(locale, "ok_tech") if passed else ui(locale, "ko_tech"),
            "correction": None if passed else loc(step, "correction", locale),
        }
        p["step_half"] = "gov"
        if p["fire_risk"] >= FIRE_THRESHOLD:
            p["phase"] = "fired"
        persist_player()
        st.rerun()
    nav_footer(
        locale,
        can_back=True,
        can_next=True,
        on_back=lambda: playing_go_back(p),
        on_next=lambda: playing_go_next(p),
    )


def page_fired() -> None:
    p = st.session_state.player
    locale = p["locale"]
    render_hud(locale)
    m = MEETING_FIRED
    if get_backend() == "postgres":
        row = pg_fetch_one("SELECT * FROM meetings WHERE id = 'comex-fired'")
        if row:
            m = row
    st.error(loc(m, "title", locale))
    st.write(loc(m, "opening", locale))
    st.write(loc(m, "closing", locale))
    if st.button(ui(locale, "new_game")):
        st.session_state.player = new_player(locale)
        persist_player()
        st.rerun()


def page_done() -> None:
    p = st.session_state.player
    locale = p["locale"]
    render_hud(locale)
    title = title_for_score(p["career_score"])
    st.success(ui(locale, "done"))
    st.write(ui(locale, "grade", label=loc(title, "label", locale), risk=p["fire_risk"]))
    if st.button(ui(locale, "play_again")):
        st.session_state.player = new_player(locale)
        persist_player()
        st.rerun()


def main() -> None:
    show_react = bool(st.session_state.get("show_react"))
    st.set_page_config(
        page_title="Sack Me!",
        page_icon="S",
        layout="wide" if show_react else "centered",
        initial_sidebar_state="collapsed",
    )
    inject_css()

    if show_react:
        locale = st.session_state.get("home_locale", "fr")
        if "player" in st.session_state:
            locale = st.session_state.player.get("locale", locale)
        page_react_adventure(locale)
        return

    if "player" not in st.session_state:
        page_home()
        return

    phase = st.session_state.player.get("phase")
    if phase == "career-pick":
        page_career_pick()
    elif phase == "playing":
        page_playing()
    elif phase == "fired":
        page_fired()
    elif phase in ("done", "ended"):
        page_done()
    else:
        page_home()

    with st.sidebar:
        st.markdown("**Sack Me!**")
        url = live_url()
        st.caption(url or "local")
        locale = st.session_state.player.get("locale", "fr")
        if st.button(ui(locale, "quit")):
            del st.session_state.player
            st.rerun()
        if st.button(ui(locale, "react_play")):
            st.session_state.show_react = True
            st.rerun()


if __name__ == "__main__":
    main()
