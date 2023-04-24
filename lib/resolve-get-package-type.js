// Manually “tree shaken” from:
// <https://github.com/nodejs/node/blob/3e74590/lib/internal/modules/esm/resolve.js>
// Last checked on: Apr 24, 2023.
//
// This file solves a circular dependency.
// In Node.js, `getPackageType` is in `resolve.js`.
// `resolve.js` imports `get-format.js`, which needs `getPackageType`.
// We split that up so that bundlers don’t fail.

/**
 * @typedef {import('./package-config.js').PackageType} PackageType
 */

import {getPackageScopeConfig} from './package-config.js'

/**
 * @param {URL} url
 * @returns {PackageType}
 */
export function getPackageType(url) {
  const packageConfig = getPackageScopeConfig(url)
  return packageConfig.type
}
