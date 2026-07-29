"""Pure game logic — covered line-by-line by unit tests."""

from __future__ import annotations

import re
import unicodedata
from typing import Any

PASS_POINTS = {"pm": 8, "tech": 10, "gov": 9}
FAIL_RISK = {"pm": 14, "tech": 12, "gov": 13}
PASS_RELIEF = {"pm": 6, "tech": 5, "gov": 6}
FIRE_THRESHOLD = 100

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


def norm(s: str) -> str:
    s = s.strip().lower()
    s = unicodedata.normalize("NFD", s)
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def clamp(n: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, n))


def loc(row: dict[str, Any], field: str, locale: str) -> str:
    key = f"{field}_{locale}" if locale in ("fr", "en") else f"{field}_fr"
    return str(row.get(key) or row.get(f"{field}_fr") or "")


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


def apply_outcome(player: Any, passed: bool, mode: str) -> None:
    if passed:
        player.career_score += PASS_POINTS[mode]
        player.fire_risk = clamp(player.fire_risk - PASS_RELIEF[mode], 0, 100)
        player.wins += 1
    else:
        player.fire_risk = clamp(player.fire_risk + FAIL_RISK[mode], 0, 100)
        player.fails += 1
