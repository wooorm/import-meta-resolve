import path from 'path'
import fs from 'fs'

const base = fs.readFileSync(path.join('test', 'core.js'))

fs.writeFileSync(
  path.join('test', 'baseline.js'),
  String(base)
    .replace(/\bresolve(?=\()/g, 'import.meta.resolve')
    .split('\n')
    .splice(
      1, // L1 is `import semver`
      0,
      "if (semver.lt(process.versions.node, '14.0.0')) process.exit()"
    )
    .join('\n')
)
