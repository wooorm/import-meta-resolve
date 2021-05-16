import path from 'path'
import fs from 'fs'

const base = fs.readFileSync(path.join('test', 'core.js'))

const lines = String(base)
  .replace(/\bresolve(?=\()/g, 'import.meta.resolve')
  .split('\n')

lines.splice(
  1, // L1 is `import semver`
  0,
  "if (semver.lt(process.versions.node, '12.0.0')) {",
  "  console.log('Exiting on old node')",
  '  process.exit()',
  '}'
)

fs.writeFileSync(path.join('test', 'baseline.js'), lines.join('\n'))
