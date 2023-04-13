import path from 'node:path'
import fs from 'node:fs/promises'

const base = await fs.readFile(path.join('test', 'core.js'))

const lines = String(base)
  .replace(/\bresolve(?=\()/g, 'await import.meta.resolve')
  .replace(/\bresolve(?=,)/g, 'import.meta.resolve')
  .replace(
    /const run = .*$/g,
    'const run = async (/** @type {() => Promise<void>} */ f) => f()'
  )
  .replace(/run\(/g, 'await run(async ')
  .split('\n')

await fs.writeFile(path.join('test', 'baseline.js'), lines.join('\n'))
