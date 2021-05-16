import test from 'tape'
import {resolve} from '../index.js'

test('ponyfill', async function (t) {
  try {
    // @ts-expect-error
    await resolve('x')
    t.fail()
  } catch (error) {
    t.equal(
      String(error),
      'Error: Please pass `parent`: `import-meta-resolve` cannot ponyfill that',
      'should throw w/o `parent`'
    )
  }

  t.end()
})
