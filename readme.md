# import-meta-resolve

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]

Resolve things like Node.js.
Ponyfill for [`import.meta.resolve`][resolve].
Supports import maps, export maps, loading CJS and ESM projects, all of that!

## Install

This package is ESM only: Node 12+ is needed to use it and it must be `import`ed
instead of `require`d.

[npm][]:

```sh
npm install import-meta-resolve
```

## Use

```js
import {resolve} from 'import-meta-resolve'
```

## API

This package exports the following identifiers: `resolve`.
There is no default export.

## `resolve(specifier, base)`

Exactly match [the `ESM_RESOLVE` algorithm][algo].
Except that `base` is required (you should probably pass `import.meta.url`).

###### Parameters

*   `specifier` (`string`)
    — `/example.js`, `./example.js`, `../example.js`, `some-package`
*   `base` (`string`, example: `import.meta.url`)
    Full URL that this is resolved from

###### Returns

Returns a promise that resolves to a full `file:` URL to the found thing.

###### Errors

*   `ERR_INVALID_MODULE_SPECIFIER`
    — when `specifier` is invalid
*   `ERR_INVALID_PACKAGE_CONFIG`
    — when a `package.json` is invalid
*   `ERR_INVALID_PACKAGE_TARGET`
    — when a `package.json` `exports` or `imports` is invalid
*   `ERR_MODULE_NOT_FOUND`
    — when `specifier` cannot be found in `base`
*   `ERR_PACKAGE_IMPORT_NOT_DEFINED`
    — when a local import is not defined in an import map
*   `ERR_PACKAGE_PATH_NOT_EXPORTED`
    — when an export is not defined in an export map
*   `ERR_UNSUPPORTED_DIR_IMPORT`
    — when attempting to import a directory

###### Differences to Node

*   `parent` defaulting to `import.meta.url` cannot be ponyfilled: you have to
    explicitly pass it
*   No support for CLI flags: `--experimental-specifier-resolution`,
    `--experimental-json-modules`, `--experimental-wasm-modules`,
    `--experimental-policy`, `--input-type`, `--preserve-symlinks`,
    `--preserve-symlinks-main`, nor `--conditions` work
*   No attempt is made to add a suggestion on what to use on errors
*   Prototypal methods are not guarded: Node protects for example `String#slice`
    or so from being tampered with, whereas we don’t

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/wooorm/import-meta-resolve/workflows/main/badge.svg

[build]: https://github.com/wooorm/import-meta-resolve/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/import-meta-resolve.svg

[coverage]: https://codecov.io/github/wooorm/import-meta-resolve

[downloads-badge]: https://img.shields.io/npm/dm/import-meta-resolve.svg

[downloads]: https://www.npmjs.com/package/import-meta-resolve

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[algo]: https://nodejs.org/dist/latest-v14.x/docs/api/esm.html#esm_resolver_algorithm

[resolve]: https://nodejs.org/api/esm.html#esm_import_meta_resolve_specifier_parent
