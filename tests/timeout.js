import assert from 'assert'
import {describe, it} from 'mocha'

import {Timeout} from '../timeout'

describe('Timeout', () => {
  it('should collect chunks emitted before timeout', done => {
    var timeout = new Timeout(0.1, {objectMode: true})
    timeout.write({letter: 'A'})
    timeout.write({letter: 'B'})
    setTimeout(() => {
      timeout.write({letter: 'C'})
      setTimeout(() => {
        timeout.write({letter: 'D'})
        setTimeout(() => {
          timeout.write({letter: 'E'})
          setTimeout(() => {
            timeout.write({letter: 'F'})
            timeout.end()
          }, 200)
        }, 50)
      }, 50)
    }, 50)

    var chunks = []

    timeout
    .on('data', chunk => chunks.push(chunk))
    .on('error', err => {
      assert(err.message.match(/Timed out/), 'The timeout should emit an error')
      assert.equal(chunks.length, 5, 'The timeout should have collected only five chunks.')
      assert.equal(chunks.filter(chunk => chunk.letter === 'F').length, 0, 'The timeout should not have collected the F chunk.')
      done()
    })
    .on('end', () => {
      throw new Error('The timeout should not be allowed to end naturally')
    })
  })
})
