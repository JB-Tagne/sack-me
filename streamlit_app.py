"""
Sack Me! — Streamlit entry.

Loads the React adventure from jsDelivr with absolute asset URLs inside a small
srcdoc shell (relative ./assets paths break; huge inlined JS was truncated).
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


def cdn_base(ref: str) -> str:
    return f"https://cdn.jsdelivr.net/gh/{REPO}@{ref}/{STATIC_DIR}"


def shell_html(ref: str) -> str:
    base = cdn_base(ref)
    # Absolute CDN URLs — required so the module loads inside Streamlit's iframe.
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sack Me!</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="{base}/assets/style.css" />
</head>
<body style="margin:0;min-height:100vh;background:#0f1419;color:#e8eef4">
  <div id="root"></div>
  <script type="module" src="{base}/assets/index.js"></script>
</body>
</html>
"""


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
        padding: 0.35rem 0.5rem !important;
        max-width: 100% !important;
      }
    </style>
    """,
    unsafe_allow_html=True,
)

ref = bundle_ref()
base = cdn_base(ref)
play_url = f"{base}/index.html"

if not (STATIC / "assets" / "index.js").is_file():
    st.error(
        "Missing streamlit_static/assets. Run `npm run build:streamlit` and commit."
    )
else:
    st.markdown(
        f'<p style="margin:0 0 0.4rem;font:600 0.85rem/1.3 system-ui,sans-serif">'
        f'<a href="{play_url}" target="_blank" rel="noopener">Open Sack Me! full screen</a>'
        f' <span style="opacity:.6">· {ref[:7]}</span></p>',
        unsafe_allow_html=True,
    )
    components.html(shell_html(ref), height=1400, scrolling=True)
