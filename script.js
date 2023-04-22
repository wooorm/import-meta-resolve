import path from 'node:path'
import fs from 'node:fs/promises'

const base = await fs.readFile(path.join('test', 'core.js'), 'utf8')

const asyncLines = base
  // Special baseline test for Node < 20, that doesn't support sync `import.meta.resolve`
  .replace(/\bresolve(?=\()/g, 'await import.meta.resolve')
  .replace(/\bresolve(?=,)/g, 'import.meta.resolve')
  .replace(
    /const run = .*$/g,
    'const run = async (/** @type {() => Promise<void>} */ f) => f()'
  )
  .replace(/run\(/g, 'await run(async ')

await fs.writeFile(path.join('test', 'baseline-async.js'), asyncLines)

const syncLines = base
  // Node < 20 does not support sync import.meta.resolve, so skipping these tests if so
  .replace(/\bresolve(?=\()/g, 'import.meta.resolve')
  .replace(/\bresolve(?=,)/g, 'import.meta.resolve')
  .replace(
    '{skip: false}',
    "{skip: semver.lt(process.versions.node, '20.0.0')}"
  )
  .replace(
    /const run = .*$/g,
    'const run = (/** @type {() => void} */ f) => f()'
  )
  .replace(/run\(/g, 'run(async ')

await fs.writeFile(path.join('test', 'baseline.js'), syncLines)
