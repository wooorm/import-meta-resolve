import path from 'path'
import fs from 'fs'

const base = fs.readFileSync(path.join('test', 'core.js'))

fs.writeFileSync(
  path.join('test', 'baseline.js'),
  "import semver from 'semver'\n" +
    "if (semver.lt(process.versions.node, '14.0.0')) process.exit()\n" +
    String(base).replace(/\bresolve(?=\()/g, 'import.meta.resolve')
)
