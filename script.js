import path from 'node:path'
import fs from 'node:fs/promises'

const base = await fs.readFile(path.join('test', 'core.js'))

const lines = String(base)
  .replace(/\bresolve(?=\()/g, 'await import.meta.resolve')
  .replace(/\bresolve(?=,)/g, 'import.meta.resolve')
  .replace(
    /const execute = .*$/g,
    'const execute = async (/** @type {() => Promise<void>} */ f) => f()'
  )
  .replace(/execute\(/g, 'await execute(async ')
  .split('\n')

await fs.writeFile(path.join('test', 'baseline.js'), lines.join('\n'))
