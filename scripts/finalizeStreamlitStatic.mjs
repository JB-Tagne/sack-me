/**
 * Finalize Streamlit static site.
 *
 * - Rewrites /data-game/ paths in the JS bundle to GitHub raw.
 * - Writes sackme.html shell with __CDN_REF__ (Streamlit substitutes at runtime).
 * - Writes VERSION (git SHA) for jsDelivr pinning.
 *
 * Never host index.html on jsDelivr (served as text/plain).
 * Streamlit injects sackme.html as text/html; JS/CSS come from the CDN.
 */
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'streamlit_static')
const indexPath = resolve(outDir, 'index.html')
const jsPath = resolve(outDir, 'assets/index.js')
const sackmePath = resolve(outDir, 'sackme.html')
const DATA_CDN = 'https://raw.githubusercontent.com/JB-Tagne/sack-me/main/public/data-game/'
const REACT_REPO = 'JB-Tagne/sack-me'

if (!existsSync(indexPath)) {
  console.error('streamlit_static/index.html missing')
  process.exit(1)
}

rmSync(resolve(outDir, 'data-game'), { recursive: true, force: true })

if (existsSync(jsPath)) {
  let js = readFileSync(jsPath, 'utf8')
  js = js.replaceAll('/data-game/', DATA_CDN)
  writeFileSync(jsPath, js, 'utf8')
}

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

const sackme = `<!doctype html>
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
    <link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/gh/${REACT_REPO}@__CDN_REF__/streamlit_static/assets/style.css" />
    <style>html,body,#root{margin:0;min-height:100%;}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="https://cdn.jsdelivr.net/gh/${REACT_REPO}@__CDN_REF__/streamlit_static/assets/index.js"></script>
  </body>
</html>
`

writeFileSync(sackmePath, sackme, 'utf8')
writeFileSync(resolve(outDir, 'VERSION'), `${sha}\n`, 'utf8')
console.log(`Streamlit static ready (sackme.html + assets, VERSION=${sha.slice(0, 7)})`)
