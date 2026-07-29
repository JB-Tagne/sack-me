"""Unit tests on embedded demo tables (line-level content integrity)."""

from __future__ import annotations

from demo_content import (
    CAREER_TITLES,
    DATA_AI_ROLE_IDS,
    ENTITIES,
    IT_ROLE_IDS,
    LEVELS,
    MEETING_FIRED,
    PROJECT_KINDS,
    QUESTIONS,
    ROLES,
    STEPS,
)


def test_entities_count_and_ids_unique() -> None:
    ids = [e["id"] for e in ENTITIES]
    assert len(ids) >= 7
    assert len(ids) == len(set(ids))
    for e in ENTITIES:
        assert e["name"].startswith("Mutualis")
        assert e["domain_fr"] and e["domain_en"]
        assert e["blurb_fr"] and e["blurb_en"]


def test_project_kinds() -> None:
    ids = {k["id"] for k in PROJECT_KINDS}
    assert ids == {"it", "data-ai"}


def test_roles_tracks() -> None:
    assert set(IT_ROLE_IDS).issubset({r["id"] for r in ROLES})
    assert set(DATA_AI_ROLE_IDS).issubset({r["id"] for r in ROLES})
    for r in ROLES:
        assert r["track"] in {"pm", "governance"}
        assert r["label_fr"] and r["label_en"]


def test_career_titles_ordered() -> None:
    scores = [t["min_score"] for t in CAREER_TITLES]
    assert scores == sorted(scores)
    assert scores[0] == 0


def test_every_step_has_pm_and_gov_question() -> None:
    for step in STEPS:
        kinds = {q["kind"] for q in QUESTIONS if q["step_id"] == step["id"]}
        assert kinds == {"pm", "gov"}, step["id"]
        assert step["expect_type"] in {"text", "sql", "python", "screenshot"}
        assert step["keywords"]


def test_questions_correct_index_in_range() -> None:
    for q in QUESTIONS:
        assert q["correct_index"] in (0, 1, 2)
        for side in ("fr", "en"):
            assert q[f"question_{side}"]
            assert q[f"option_a_{side}"]
            assert q[f"option_b_{side}"]
            assert q[f"option_c_{side}"]


def test_levels_cover_steps() -> None:
    level_ids = {lv["id"] for lv in LEVELS}
    for step in STEPS:
        assert step["level_id"] in level_ids


def test_meeting_fired_bilingual() -> None:
    assert MEETING_FIRED["id"] == "comex-fired"
    assert MEETING_FIRED["title_fr"] and MEETING_FIRED["title_en"]
