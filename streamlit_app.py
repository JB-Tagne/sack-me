"""
Sack Me! — Streamlit entry.

Streamlit iframes are unreliable for this SPA. Redirect to the CDN-hosted
React build (absolute asset URLs) so the game always runs in a normal tab.
"""

from __future__ import annotations

from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

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


def play_url(ref: str) -> str:
    return f"https://cdn.jsdelivr.net/gh/{REPO}@{ref}/{STATIC_DIR}/index.html"


st.set_page_config(page_title="Sack Me!", page_icon="S", layout="centered")

ref = bundle_ref()
url = play_url(ref)

st.markdown(
    """
    <style>
      .sm-wrap { max-width: 28rem; margin: 15vh auto 0; text-align: center; font-family: system-ui, sans-serif; }
      .sm-wrap h1 { font-size: 2.4rem; letter-spacing: 0.04em; margin-bottom: 0.35rem; }
      .sm-wrap p { opacity: 0.75; margin-bottom: 1.25rem; }
    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown(
    f"""
    <div class="sm-wrap">
      <h1>SACK ME!</h1>
      <p>Career PM / Governance · Mutualis Group</p>
    </div>
    """,
    unsafe_allow_html=True,
)

st.link_button("Play Sack Me!", url, type="primary", use_container_width=True)
st.caption(f"Bundle {ref[:7]} · opens the full React game")

# Auto-redirect the top window (leave Streamlit chrome)
components.html(
    f"""
    <script>
      try {{ window.top.location.replace({url!r}); }}
      catch (e) {{ window.location.replace({url!r}); }}
    </script>
    <p style="font:14px system-ui;padding:8px">Redirecting… <a href="{url}" target="_top">Click here</a></p>
    """,
    height=48,
)
