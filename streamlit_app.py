"""
Sack Me! — Streamlit interface (live web).
Content: PostgreSQL if DATABASE_URL is reachable, otherwise embedded demo.
"""

from __future__ import annotations

import os
import uuid
from typing import Any

import streamlit as st
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


def page_home() -> None:
    st.markdown('<p class="sm-brand">SACK ME!</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="sm-sub">Career PM / Governance · Mutualis Group</p>',
        unsafe_allow_html=True,
    )
    url = live_url()
    if url:
        host = url.replace("https://", "").replace("http://", "")
        st.caption(
            f"Cloud host: {host} — if opening the public link fails, "
            "set the app to Public in share.streamlit.io → ⋮ → Settings → Sharing"
        )
    else:
        st.caption("Local session (no Streamlit Cloud host detected)")
    backend = get_backend()
    st.info(
        "Data: PostgreSQL" if backend == "postgres" else "Demo mode (embedded content — no Postgres)"
    )

    locale = st.radio("Language", ["fr", "en"], horizontal=True, format_func=lambda x: "FR" if x == "fr" else "EN")
    c1, c2 = st.columns(2)
    with c1:
        if st.button("New game", type="primary", use_container_width=True):
            st.session_state.player = new_player(locale)
            persist_player()
            st.rerun()
    with c2:
        key = st.text_input("Resume (session code)", placeholder="abc123def456")
        if st.button("Continue", use_container_width=True) and key.strip():
            loaded = load_player_pg(key) if get_backend() == "postgres" else None
            if loaded:
                st.session_state.player = loaded
                st.rerun()
            else:
                st.error("Session not found (Postgres required to resume outside demo).")


def page_career_pick() -> None:
    p = st.session_state.player
    locale = p["locale"]
    render_hud(locale)
    step = p.get("pick_step", "entity")

    if step == "entity":
        st.subheader("Mutualis subsidiary")
        entities = list_entities()
        labels = [f"{e['name']} — {loc(e, 'domain', locale)}" for e in entities]
        choice = st.radio("Choose your subsidiary", range(len(entities)), format_func=lambda i: labels[i])
        st.caption(loc(entities[choice], "blurb", locale))
        if st.button("Confirm subsidiary", type="primary"):
            p["entity_id"] = entities[choice]["id"]
            p["pick_step"] = "kind"
            persist_player()
            st.rerun()
        return

    if step == "kind":
        st.subheader("Project type")
        kinds = list_kinds()
        labels = [f"{loc(k, 'label', locale)} — {loc(k, 'hint', locale)}" for k in kinds]
        choice = st.radio("Project", range(len(kinds)), format_func=lambda i: labels[i])
        if st.button("Confirm project", type="primary"):
            p["project_kind"] = kinds[choice]["id"]
            p["pick_step"] = "role"
            persist_player()
            st.rerun()
        return

    st.subheader("Role")
    roles = list_roles(p["project_kind"] or "data-ai")
    labels = [
        f"{loc(r, 'label', locale)} [{('PM' if r['track'] == 'pm' else 'Governance')}]"
        for r in roles
    ]
    choice = st.radio("Your position", range(len(roles)), format_func=lambda i: labels[i])
    if st.button("Start the Increment", type="primary"):
        p["role_id"] = roles[choice]["id"]
        p["phase"] = "playing"
        p["level_id"] = 0
        p["step_index"] = 0
        p["step_half"] = "pm"
        p["feedback"] = None
        persist_player()
        st.rerun()


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
        if st.button("Continue"):
            p["feedback"] = None
            persist_player()
            st.rerun()
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
        ans = st.radio("Answer", range(3), format_func=lambda i: opts[i], key=f"q-{step['id']}-{half}")
        if st.button("Submit", type="primary"):
            o = player_as_obj()
            passed = ans == int(q["correct_index"])
            apply_outcome(o, passed, half)
            sync_from_obj(o)
            pts = PASS_POINTS[half]
            p["feedback"] = {
                "ok": passed,
                "msg": f"Correct (+{pts} pts)." if passed else "Incorrect — fireRisk rising.",
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
        return

    # tech
    st.markdown(f"**[TECH · {step['expect_type'].upper()}]**")
    st.write(loc(step, "do", locale))
    text = st.text_area("Deliverable", height=160, placeholder="Paste your SQL / Python / text…")
    if st.button("Submit deliverable", type="primary"):
        o = player_as_obj()
        kws = list(step.get("keywords") or [])
        passed = evaluate_script(step["expect_type"], text, kws)
        apply_outcome(o, passed, "tech")
        sync_from_obj(o)
        p["feedback"] = {
            "ok": passed,
            "msg": "Deliverable accepted." if passed else "Insufficient deliverable.",
            "correction": None if passed else loc(step, "correction", locale),
        }
        p["step_half"] = "gov"
        if p["fire_risk"] >= FIRE_THRESHOLD:
            p["phase"] = "fired"
        persist_player()
        st.rerun()


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
    if st.button("New game"):
        st.session_state.player = new_player(locale)
        persist_player()
        st.rerun()


def page_done() -> None:
    p = st.session_state.player
    locale = p["locale"]
    render_hud(locale)
    title = title_for_score(p["career_score"])
    st.success("MVP Increment complete — you still have your job.")
    st.write(f"Grade : **{loc(title, 'label', locale)}** · fireRisk {p['fire_risk']}%")
    if st.button("Play again"):
        st.session_state.player = new_player(locale)
        persist_player()
        st.rerun()


def main() -> None:
    st.set_page_config(
        page_title="Sack Me!",
        page_icon="S",
        layout="centered",
        initial_sidebar_state="collapsed",
    )
    inject_css()

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
        if st.button("Quit / menu"):
            del st.session_state.player
            st.rerun()


if __name__ == "__main__":
    main()
