/**
 * Finalize Streamlit static site after `vite build --mode streamlit`.
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
writeFileSync(resolve(outDir, 'VERSION'), `${sha}\n`, 'utf8')
console.log('Streamlit static ready VERSION=', sha)
