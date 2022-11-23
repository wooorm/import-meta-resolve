import path from 'node:path'
import fs from 'node:fs/promises'

const base = await fs.readFile(path.join('test', 'core.js'))

const lines = String(base)
  .replace(/\bresolve(?=\(|,)/g, 'import.meta.resolve')
  .split('\n')

await fs.writeFile(path.join('test', 'baseline.js'), lines.join('\n'))
