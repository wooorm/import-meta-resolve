import assert from 'node:assert/strict'
import test from 'node:test'
import {resolve} from '../index.js'

test('ponyfill', async function () {
  assert.deepEqual(
    Object.keys(await import('import-meta-resolve')).sort(),
    ['moduleResolve', 'resolve'],
    'should expose the public api'
  )

  try {
    // @ts-expect-error
    resolve('x')
    assert.fail()
  } catch (error) {
    assert.equal(
      String(error),
      'Error: Please pass `parent`: `import-meta-resolve` cannot ponyfill that',
      'should throw w/o `parent`'
    )
  }
})
