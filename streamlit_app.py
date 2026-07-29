"""
Sack Me! — Streamlit entry (live React demo).

Hosts the full React adventure (landing, career pick, briefing, play, meetings,
fire alerts, confetti, tool sidebar) so Cloud matches the Vite UI.

Build: npm run build:streamlit
  → streamlit_static/sackme.html (HTML shell)
  → streamlit_static/assets/* (JS/CSS on jsDelivr)

The HTML shell is injected by Streamlit as text/html.
JS/CSS load from jsDelivr (never open index.html on jsDelivr — it is text/plain).
"""

from __future__ import annotations

from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

ROOT = Path(__file__).resolve().parent
BUNDLE = ROOT / "streamlit_static" / "sackme.html"
VERSION_FILE = ROOT / "streamlit_static" / "VERSION"
REACT_REPO = "JB-Tagne/sack-me"
DATA_GAME_CDN = "https://raw.githubusercontent.com/JB-Tagne/sack-me/main/public/data-game/"


def pinned_ref() -> str:
    if VERSION_FILE.is_file():
        pinned = VERSION_FILE.read_text(encoding="utf-8").strip()
        if pinned:
            return pinned
    return "main"


def build_shell_html(ref: str) -> str:
    """Minimal HTML shell with absolute CDN asset URLs."""
    base = f"https://cdn.jsdelivr.net/gh/{REACT_REPO}@{ref}/streamlit_static"
    return f"""<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Sack Me! - serious game de simulation de carriere en gestion de projet et gouvernance data."
    />
    <title>Sack Me! - PM &amp; Gov Game</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=Source+Sans+3:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" crossorigin href="{base}/assets/style.css" />
    <style>html,body,#root{{margin:0;min-height:100%;}}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="{base}/assets/index.js"></script>
  </body>
</html>
"""


def prepare_html(raw: str) -> str:
    """Apply CDN ref + data-game rewrites for iframe runtime."""
    html = raw.replace("__CDN_REF__", pinned_ref())
    html = html.replace("/data-game/", DATA_GAME_CDN)
    return html


def main() -> None:
    st.set_page_config(
        page_title="Sack Me!",
        page_icon="S",
        layout="wide",
        initial_sidebar_state="collapsed",
    )

    st.markdown(
        """
        <style>
          [data-testid="stHeader"],
          [data-testid="stToolbar"],
          [data-testid="stDecoration"],
          #MainMenu,
          footer { visibility: hidden; height: 0; }
          .block-container {
            padding: 0 !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
          [data-testid="stAppViewContainer"] > .main { padding: 0 !important; }
          iframe { border: none !important; }
        </style>
        """,
        unsafe_allow_html=True,
    )

    ref = pinned_ref()
    if BUNDLE.is_file():
        html = prepare_html(BUNDLE.read_text(encoding="utf-8"))
    else:
        html = build_shell_html(ref)

    iframe = getattr(st, "iframe", None)
    if callable(iframe):
        try:
            iframe(html, height=1400, scrolling=True)
        except TypeError:
            iframe(html, height=1400)
    else:
        components.html(html, height=1400, scrolling=True)


if __name__ == "__main__":
    main()
