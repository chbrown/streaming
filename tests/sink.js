import assert from 'assert'
import {describe, it} from 'mocha'

import {readToEnd} from '../'
import {Sink} from '../sink'

describe('Sink', () => {
  it('should read no chunks but still end', done => {
    var sink = new Sink({objectMode: true})
    sink.write({letter: 'A'})
    sink.write({letter: 'B'})
    sink.write({letter: 'C'})
    sink.write({letter: 'D'})
    sink.write({letter: 'E'})
    sink.end()

    readToEnd(sink, (err, chunks) => {
      if (err) throw err

      assert.equal(chunks.length, 0, 'The sink should emit no data.')
      done()
    })
  })
})
