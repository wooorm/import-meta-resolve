import path from 'node:path'
import fs from 'node:fs'

const base = fs.readFileSync(path.join('test', 'core.js'))

const lines = String(base)
  .replace(/\bresolve(?=\(|,)/g, 'import.meta.resolve')
  .split('\n')

fs.writeFileSync(path.join('test', 'baseline.js'), lines.join('\n'))
