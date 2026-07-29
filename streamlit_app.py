"""
Sack Me! — Streamlit entry.

Embeds the full React adventure via CDN (jsDelivr) so the game runs in a real
https origin (ES modules + localStorage). Inlined srcdoc HTML was truncated /
broken inside Streamlit's iframe.
"""

from __future__ import annotations

from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "streamlit_static"
VERSION_FILE = STATIC / "VERSION"

REPO = "JB-Tagne/sack-me"
STATIC_DIR = "streamlit_static"


def bundle_ref() -> str:
    if VERSION_FILE.is_file():
        ref = VERSION_FILE.read_text(encoding="utf-8").strip()
        if ref:
            return ref
    return "main"


def game_url(ref: str) -> str:
    # jsDelivr serves repo files with correct MIME types for JS modules.
    return f"https://cdn.jsdelivr.net/gh/{REPO}@{ref}/{STATIC_DIR}/index.html"


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
        padding: 0.5rem 0.75rem !important;
        max-width: 100% !important;
      }
    </style>
    """,
    unsafe_allow_html=True,
)

ref = bundle_ref()
url = game_url(ref)

if not (STATIC / "index.html").is_file():
    st.error(
        "Missing streamlit_static/index.html. "
        "Run `npm run build:streamlit` and commit streamlit_static/."
    )
    st.code("npm run build:streamlit", language="bash")
else:
    st.markdown(
        f'<p style="margin:0 0 0.5rem;font:600 0.9rem/1.3 system-ui,sans-serif">'
        f'<a href="{url}" target="_blank" rel="noopener">Open Sack Me! in a new tab</a>'
        f' <span style="opacity:.65">· bundle {ref[:7]}</span></p>',
        unsafe_allow_html=True,
    )
    iframe = getattr(st, "iframe", None)
    if callable(iframe):
        try:
            iframe(url, height=1400, scrolling=True)
        except TypeError:
            iframe(url, height=1400)
    else:
        import streamlit.components.v1 as components

        components.iframe(url, height=1400, scrolling=True)
