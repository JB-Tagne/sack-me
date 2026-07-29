/**
 * Finalize Streamlit static site after `vite build --mode streamlit`.
 * - Drop bulky data-game/ (load CSVs from GitHub raw instead)
 * - Rewrite dataset paths in the JS bundle
 * - Write VERSION for CDN pin (git sha when available)
 */
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'streamlit_static')
const indexPath = resolve(outDir, 'index.html')
const jsPath = resolve(outDir, 'assets/index.js')
const DATA_CDN = 'https://raw.githubusercontent.com/JB-Tagne/sack-me/main/public/data-game/'

if (!existsSync(indexPath)) {
  console.error('streamlit_static/index.html missing — vite streamlit build failed')
  process.exit(1)
}

rmSync(resolve(outDir, 'data-game'), { recursive: true, force: true })

if (existsSync(jsPath)) {
  let js = readFileSync(jsPath, 'utf8')
  js = js.replaceAll('/data-game/', DATA_CDN)
  writeFileSync(jsPath, js, 'utf8')
  console.log('Rewrote data-game URLs in assets/index.js')
}

function gitSha() {
  const cmds = [
    'git rev-parse HEAD',
    'wsl git rev-parse HEAD',
    '"C:\\\\Program Files\\\\Git\\\\cmd\\\\git.exe" rev-parse HEAD',
  ]
  for (const cmd of cmds) {
    try {
      const sha = execSync(cmd, { cwd: root, encoding: 'utf8', shell: true }).trim()
      if (/^[0-9a-f]{7,40}$/i.test(sha)) return sha
    } catch {
      /* try next */
    }
  }
  return 'main'
}

const sha = gitSha()
writeFileSync(resolve(outDir, 'VERSION'), `${sha}\n`, 'utf8')
console.log('Streamlit static ready at', outDir, 'VERSION=', sha)
