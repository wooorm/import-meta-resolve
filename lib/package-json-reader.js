// Manually “tree shaken” from:
// <https://github.com/nodejs/node/blob/40fa2e9/lib/internal/modules/package_json_reader.js>
// Last checked on: May 22, 2022.
// Removed the native dependency.
// Also: no need to cache, we do that in resolve already.

/**
 * @typedef {import('./errors.js').ErrnoException} ErrnoException
 */

import fs from 'node:fs'
import path from 'node:path'

const reader = {read}
export default reader

/**
 * @param {string} jsonPath
 * @returns {{string: string|undefined}}
 */
function read(jsonPath) {
  return find(path.dirname(jsonPath))
}

/**
 * @param {string} dir
 * @returns {{string: string|undefined,path: string|undefined}}
 */
function find(dir) {
  try {
    const pjsonPath = path.toNamespacedPath(path.join(dir, 'package.json'));
    const string = fs.readFileSync(
      pjsonPath,
      'utf8'
    )
    return {string,path:pjsonPath}
  } catch (error) {
    const exception = /** @type {ErrnoException} */ (error)

    if (exception.code === 'ENOENT') {
      const parent = path.dirname(dir)
      if (dir !== parent) return find(parent)
      return {string: undefined,path:undefined}
      // Throw all other errors.
      /* c8 ignore next 4 */
    }

    throw exception
  }
}
