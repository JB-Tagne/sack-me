"""
Sack Me! — Streamlit entry.

Hosts the full React adventure (landing, career pick, briefing, play, meetings,
fire alerts, confetti, tool sidebar) so Cloud matches the Vite UI exactly.
Build with: npm run build:streamlit  →  streamlit_static/sackme.html
"""

from __future__ import annotations

from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parent
BUNDLE = ROOT / "streamlit_static" / "sackme.html"

# CSV/JSON datasets are not inside the iframe srcdoc — serve from GitHub raw.
DATA_GAME_CDN = "https://raw.githubusercontent.com/JB-Tagne/sack-me/main/public/data-game/"

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
    </style>
    """,
    unsafe_allow_html=True,
)


def prepare_html(raw: str) -> str:
    """Rewrite /data-game/ asset paths so downloads work inside the iframe."""
    return raw.replace("/data-game/", DATA_GAME_CDN)


if not BUNDLE.is_file():
    st.error(
        "Missing streamlit_static/sackme.html. "
        "Run `npm run build:streamlit` then commit the file for Streamlit Cloud."
    )
    st.code("npm run build:streamlit", language="bash")
else:
    html = prepare_html(BUNDLE.read_text(encoding="utf-8"))
    # Prefer st.iframe (Streamlit ≥1.50); fall back to components.v1.html.
    iframe = getattr(st, "iframe", None)
    if callable(iframe):
        iframe(html, height=1400)
    else:
        import streamlit.components.v1 as components

        components.html(html, height=1400, scrolling=True)
