import assert from 'assert'
import {describe, it} from 'mocha' // unnecessary but placates the ES6 linter

import {readToEnd} from '../'
import {Batcher} from '../batcher'

describe('Batcher', () => {
  it('should batch a stream of chunks into arrays of N chunks each', done => {
    var batcher = new Batcher(5)
    for (var i = 1; i < 21; i++) {
      batcher.write(i)
    }
    batcher.end()

    readToEnd(batcher, (err, chunks) => {
      if (err) throw err

      assert.equal(chunks.length, 4, 'There should be 4 batches')
      assert.equal(chunks[2][1], 12, 'The second item of the third chunk ([11, 12, 13, 14, 15]) should be 12')
      done()
    })
  })
})
