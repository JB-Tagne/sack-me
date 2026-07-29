/**
 * After `vite build`, inline JS/CSS into one HTML for Streamlit components.html.
 *   node scripts/inlineDistForStreamlit.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const outDir = resolve(root, 'streamlit_static')
const indexPath = resolve(dist, 'index.html')

if (!existsSync(indexPath)) {
  console.error('dist/index.html missing — run npm run build first')
  process.exit(1)
}

let html = readFileSync(indexPath, 'utf8')

// Inline <script type="module" crossorigin src="/assets/...">
html = html.replace(
  /<script\b([^>]*?)\bsrc=["']([^"']+)["']([^>]*)><\/script>/gi,
  (_m, pre, src, post) => {
    const file = resolve(dist, src.replace(/^\//, ''))
    if (!existsSync(file)) {
      console.warn('skip missing script', src)
      return _m
    }
    const code = readFileSync(file, 'utf8')
    const type = /type=["']module["']/.test(pre + post) ? ' type="module"' : ''
    return `<script${type}>\n${code}\n</script>`
  },
)

// Inline <link rel="stylesheet" href="/assets/...">
html = html.replace(
  /<link\b([^>]*?)\brel=["']stylesheet["']([^>]*?)href=["']([^"']+)["']([^>]*)\/?>/gi,
  (_m, a, b, href, c) => {
    const file = resolve(dist, href.replace(/^\//, ''))
    if (!existsSync(file)) {
      console.warn('skip missing css', href)
      return _m
    }
    const css = readFileSync(file, 'utf8')
    return `<style>\n${css}\n</style>`
  },
)

// Also handle href-before-rel order
html = html.replace(
  /<link\b([^>]*?)href=["']([^"']+)["']([^>]*?)\brel=["']stylesheet["']([^>]*)\/?>/gi,
  (_m, a, href, b, c) => {
    if (_m.includes('<style>')) return _m
    const file = resolve(dist, href.replace(/^\//, ''))
    if (!existsSync(file)) return _m
    const css = readFileSync(file, 'utf8')
    return `<style>\n${css}\n</style>`
  },
)

mkdirSync(outDir, { recursive: true })
const out = resolve(outDir, 'sackme.html')
writeFileSync(out, html, 'utf8')
console.log('Wrote', out, `(${(html.length / 1024).toFixed(0)} KB)`)
