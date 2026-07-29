#!/usr/bin/env python3
"""Reject commit messages that are not English (ASCII subject, no French hints)."""

from __future__ import annotations

import re
import sys
from pathlib import Path

FRENCH_HINT = re.compile(
    r"\b("
    r"ajoute|ajouté|ajouter|corrige|corrigé|corriger|"
    r"supprime|supprimé|mettre|mise|jour|fichier|dépôt|depot|"
    r"création|creation|initialise|initialisé|améliore|améliore|"
    r"pour|avec|sans|dans|cette|ce|les|des|une|du|au|aux|"
    r"jeu|filiale|contenu|déploiement|deploiement"
    r")\b",
    re.IGNORECASE,
)
NON_ASCII_LETTER = re.compile(r"[^\x00-\x7F]")


def main() -> int:
    if len(sys.argv) < 2:
        return 0
    path = Path(sys.argv[1])
    raw = path.read_bytes()
    for enc in ("utf-8", "utf-8-sig", "utf-16", "utf-16-le", "latin-1"):
        try:
            text = raw.decode(enc)
            break
        except UnicodeDecodeError:
            continue
    else:
        text = raw.decode("utf-8", errors="replace")
    lines = [ln for ln in text.splitlines() if not ln.strip().startswith("#")]
    if not lines:
        print("Commit message is empty.", file=sys.stderr)
        return 1
    subject = lines[0].strip().lstrip("\ufeff")
    if not subject:
        print("Commit subject is empty.", file=sys.stderr)
        return 1
    if NON_ASCII_LETTER.search(subject):
        print(
            "Commit subject must be English ASCII (no accents).\n"
            f"  Got: {subject!r}",
            file=sys.stderr,
        )
        return 1
    if FRENCH_HINT.search(subject):
        print(
            "Commit subject looks French — use English only "
            "(e.g. Add… / Fix… / Update…).\n"
            f"  Got: {subject!r}",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
