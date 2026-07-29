/**
 * After Vite streamlit build, inline JS/CSS into one HTML for Streamlit iframes.
 * Strips type="module" so scripts run inside srcdoc (ES modules are blocked there).
 *
 *   node scripts/inlineDistForStreamlit.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const outDir = resolve(root, 'streamlit_static')
const indexPath = resolve(dist, 'index.html')

if (!existsSync(indexPath)) {
  console.error('dist/index.html missing — run vite build --mode streamlit first')
  process.exit(1)
}

let html = readFileSync(indexPath, 'utf8')

html = html.replace(
  /<script\b([^>]*?)\bsrc=["']([^"']+)["']([^>]*)><\/script>/gi,
  (_m, pre, src, post) => {
    const file = resolve(dist, src.replace(/^\.\//, '').replace(/^\//, ''))
    if (!existsSync(file)) {
      console.warn('skip missing script', src)
      return _m
    }
    const code = readFileSync(file, 'utf8')
    // Classic script — required for Streamlit srcdoc iframes
    return `<script>\n${code}\n</script>`
  },
)

html = html.replace(
  /<link\b([^>]*?)\brel=["']stylesheet["']([^>]*?)href=["']([^"']+)["']([^>]*)\/?>/gi,
  (_m, _a, _b, href) => {
    const file = resolve(dist, href.replace(/^\.\//, '').replace(/^\//, ''))
    if (!existsSync(file)) {
      console.warn('skip missing css', href)
      return _m
    }
    return `<style>\n${readFileSync(file, 'utf8')}\n</style>`
  },
)

html = html.replace(
  /<link\b([^>]*?)href=["']([^"']+)["']([^>]*?)\brel=["']stylesheet["']([^>]*)\/?>/gi,
  (_m, _a, href) => {
    if (_m.includes('<style>')) return _m
    const file = resolve(dist, href.replace(/^\.\//, '').replace(/^\//, ''))
    if (!existsSync(file)) return _m
    return `<style>\n${readFileSync(file, 'utf8')}\n</style>`
  },
)

// Safety: never leave module scripts in the Streamlit bundle
html = html.replace(/\s*type=["']module["']/gi, '')
html = html.replace(/\s*crossorigin(?:=["'][^"']*["'])?/gi, '')

// Visible fallback if React fails to mount (helps debug black screens)
html = html.replace(
  '<div id="root"></div>',
  `<div id="root"></div>
  <noscript><p style="color:#e8eef4;padding:2rem;font-family:sans-serif">JavaScript is required for Sack Me!</p></noscript>
  <script>
    setTimeout(function () {
      var r = document.getElementById('root');
      if (r && !r.children.length) {
        r.innerHTML = '<p style="color:#e8eef4;padding:2rem;font-family:sans-serif">Sack Me! failed to start. Hard-refresh or re-run npm run build:streamlit.</p>';
      }
    }, 4000);
  </script>`,
)

mkdirSync(outDir, { recursive: true })
const out = resolve(outDir, 'sackme.html')
writeFileSync(out, html, 'utf8')
console.log('Wrote', out, `(${(html.length / 1024).toFixed(0)} KB)`)
