"""Unit tests for career scoring (line-by-line on apply_outcome / clamp)."""

from __future__ import annotations

from dataclasses import dataclass

from game_logic import FIRE_THRESHOLD, PASS_POINTS, apply_outcome, clamp, loc


@dataclass
class FakePlayer:
    career_score: int = 0
    fire_risk: int = 18
    wins: int = 0
    fails: int = 0


def test_clamp_edges() -> None:
    assert clamp(-1, 0, 100) == 0
    assert clamp(101, 0, 100) == 100
    assert clamp(50, 0, 100) == 50


def test_apply_outcome_pass_increases_score_and_relieves_risk() -> None:
    p = FakePlayer(fire_risk=30)
    apply_outcome(p, True, "pm")
    assert p.career_score == PASS_POINTS["pm"]
    assert p.fire_risk < 30
    assert p.wins == 1
    assert p.fails == 0


def test_apply_outcome_fail_raises_fire_risk() -> None:
    p = FakePlayer(fire_risk=90)
    apply_outcome(p, False, "tech")
    assert p.career_score == 0
    assert p.fire_risk > 90
    assert p.fails == 1


def test_fire_threshold_reachable() -> None:
    p = FakePlayer(fire_risk=95)
    apply_outcome(p, False, "pm")
    assert p.fire_risk >= FIRE_THRESHOLD or p.fire_risk == 100


def test_loc_falls_back_to_fr() -> None:
    row = {"label_fr": "Junior", "label_en": "Junior"}
    assert loc(row, "label", "fr") == "Junior"
    assert loc(row, "label", "en") == "Junior"
    assert loc({"label_fr": "X"}, "label", "en") == "X"
