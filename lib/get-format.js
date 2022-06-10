// Manually “tree shaken” from:
// <https://github.com/nodejs/node/blob/40fa2e9/lib/internal/modules/esm/get_format.js>
// Last checked on: May 22, 2022.

import path from 'node:path'
import {URL, fileURLToPath} from 'node:url'
import {getPackageType} from './resolve.js'
import {codes} from './errors.js'

const {ERR_UNKNOWN_FILE_EXTENSION} = codes

const hasOwnProperty = {}.hasOwnProperty

/** @type {Record<string, string>} */
const extensionFormatMap = {
  // @ts-expect-error: hush.
  __proto__: null,
  '.cjs': 'commonjs',
  '.js': 'module',
  '.json': 'json',
  '.mjs': 'module',
  // Taken from https://github.com/nodejs/node/blob/595ce9dac63cdd32d893c3319328a752719644d2/lib/internal/modules/esm/formats.js#L28-L30
  '.wasm': 'wasm'
}

/**
 * @param {string|null} mime
 * @returns {string | null}
 */
function mimeToFormat(mime) {
  if (
    mime &&
    /\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i.test(mime)
  )
    return 'module'
  if (mime === 'application/json') return 'json'
  return null
}

/**
 * @typedef {(parsed: URL, context: {parentURL: string}, ignoreErrors: boolean) => string|null} ProtocolHandler
 */

/**
 * @type {Record<string, ProtocolHandler>}
 */
const protocolHandlers = Object.assign(Object.create(null), {
  'data:': getDataProtocolModuleFormat,
  'file:': getFileProtocolModuleFormat,
  'http:': getHttpProtocolModuleFormat,
  'https:': getHttpProtocolModuleFormat,
  'node:'() {
    return 'builtin'
  }
})

/**
 * @param {URL} parsed
 */
function getDataProtocolModuleFormat(parsed) {
  const {1: mime} = /^([^/]+\/[^;,]+)[^,]*?(;base64)?,/.exec(
    parsed.pathname
  ) || [null, null, null]
  return mimeToFormat(mime)
}

/**
 * @param {URL} url
 * @param {{parentURL: string}} _context
 * @param {boolean} ignoreErrors
 * @returns {string|null}
 */
function getFileProtocolModuleFormat(url, _context, ignoreErrors) {
  const filepath = fileURLToPath(url)
  const ext = path.extname(filepath)
  if (ext === '.js') {
    return getPackageType(url) === 'module' ? 'module' : 'commonjs'
  }

  const format = extensionFormatMap[ext]
  if (format) return format

  // Taken from https://github.com/nodejs/node/blob/master/lib/internal/modules/esm/get_format.js#L66-L67
  if (ignoreErrors) return null

  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath)
}

function getHttpProtocolModuleFormat() {
  // To do: HTTPS imports.
}

/**
 * @param {URL} url
 * @param {{parentURL: string}} context
 * @returns {string|null}
 */
export function defaultGetFormatWithoutErrors(url, context) {
  if (!hasOwnProperty.call(protocolHandlers, url.protocol)) {
    return null
  }

  return protocolHandlers[url.protocol](url, context, true)
}

/**
 * @param {string} url
 * @param {{parentURL: string}} context
 * @returns {string|null}
 */
export function defaultGetFormat(url, context) {
  const parsed = new URL(url)

  return hasOwnProperty.call(protocolHandlers, parsed.protocol)
    ? protocolHandlers[parsed.protocol](parsed, context, false)
    : null
}
