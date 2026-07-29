/**
 * Finalize Streamlit static site: absolute CDN asset URLs in index.html.
 */
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'streamlit_static')
const indexPath = resolve(outDir, 'index.html')
const jsPath = resolve(outDir, 'assets/index.js')
const REPO = 'JB-Tagne/sack-me'
const DATA_CDN = `https://raw.githubusercontent.com/${REPO}/main/public/data-game/`

if (!existsSync(indexPath)) {
  console.error('streamlit_static/index.html missing')
  process.exit(1)
}

rmSync(resolve(outDir, 'data-game'), { recursive: true, force: true })

function gitSha() {
  for (const cmd of ['git rev-parse HEAD', 'wsl git rev-parse HEAD']) {
    try {
      const sha = execSync(cmd, { cwd: root, encoding: 'utf8', shell: true }).trim()
      if (/^[0-9a-f]{7,40}$/i.test(sha)) return sha
    } catch {
      /* next */
    }
  }
  return 'main'
}

const sha = gitSha()
// Use @main for HTML asset tags so links keep working; query bust with sha.
const assetBase = `https://cdn.jsdelivr.net/gh/${REPO}@main/streamlit_static/assets`
const bust = `?v=${sha.slice(0, 7)}`

if (existsSync(jsPath)) {
  let js = readFileSync(jsPath, 'utf8')
  js = js.replaceAll('/data-game/', DATA_CDN)
  writeFileSync(jsPath, js, 'utf8')
}

let html = readFileSync(indexPath, 'utf8')
html = html
  .replace(/src="\.\/assets\/([^"]+)"/g, `src="${assetBase}/$1${bust}"`)
  .replace(/href="\.\/assets\/([^"]+)"/g, `href="${assetBase}/$1${bust}"`)
  .replace(
    /href="\.\/icons\/([^"]+)"/g,
    `href="https://cdn.jsdelivr.net/gh/${REPO}@main/streamlit_static/icons/$1"`,
  )
writeFileSync(indexPath, html, 'utf8')
writeFileSync(resolve(outDir, 'VERSION'), `${sha}\n`, 'utf8')
console.log('Streamlit static ready', { sha, sample: html.match(/src="https:[^"]+"/)?.[0] })
