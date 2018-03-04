import * as assert from 'assert'
import 'mocha'

import {readToEnd} from '..'
import {EventSource} from '../eventsource'

describe('EventSource', () => {
  it('should wrap each input chunk with "data:" and separate each chunk with two newlines', done => {
    var eventSource = new EventSource()
    eventSource.write('initializing app')
    eventSource.write('performing work')
    eventSource.write('cleaning up')
    eventSource.end()

    readToEnd(eventSource, (err, chunks) => {
      if (err) throw err

      var body = chunks.join('')
      assert.equal(body, [
        'data: initializing app\n\n',
        'data: performing work\n\n',
        'data: cleaning up\n\n',
      ].join(''), 'The complete output should match the expected value')
      done()
    })
  })
})
