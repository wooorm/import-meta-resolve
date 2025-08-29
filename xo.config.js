/**
 * @import {FlatXoConfig} from 'xo'
 */

/** @type {FlatXoConfig} */
const xoConfig = [
  {
    ignores: ['test/node_modules/'],
    name: 'default',
    prettier: true,
    rules: {
      complexity: 'off',
      'import-x/no-extraneous-dependencies': 'off',
      'max-depth': 'off',
      'max-params': 'off',
      'no-constant-condition': 'off',
      'no-new': 'off',
      'prefer-arrow-callback': 'off',
      'prefer-destructuring': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prefer-string-replace-all': 'off'
    },
    space: true
  }
]

export default xoConfig
