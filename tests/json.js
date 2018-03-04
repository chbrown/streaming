import assert from 'assert'
import {describe, it} from 'mocha'

import {readToEnd} from '../'
import {ArrayStringifier, Stringifier, Parser} from '../json'

describe('json.ArrayStringifier', () => {
  it('should stringify a stream of objects into newline-separated JSON', done => {
    var arrayStringifier = new ArrayStringifier()
    arrayStringifier.write({a: 102})
    arrayStringifier.write({b: 202})
    arrayStringifier.write({c: 302})
    arrayStringifier.end()

    readToEnd(arrayStringifier, (err, chunks) => {
      if (err) throw err

      var result = chunks.join('').replace(/\s+/, '')
      assert.equal(result, '[{"a":102},{"b":202},{"c":302}]', 'The array stringifier output should match the literal string.')
      done()
    })
  })
})

describe('json.Stringifier', () => {
  it('should stringify a stream of objects into newline-separated JSON', done => {
    var stringifier = new Stringifier()
    stringifier.write({a: 102, b: 202, c: 302})
    stringifier.end()

    readToEnd(stringifier, (err, chunks) => {
      if (err) throw err

      var result = chunks.join('')

      assert.equal(result, '{"a":102,"b":202,"c":302}\n', 'The stringifier output should match the literal string.')
      done()
    })
  })
})

describe('json.Parser', () => {
  it('should parse multiple newline-separated JSON entities into a stream of objects', done => {
    var parser = new Parser()
    parser.write('{"a": 100}\n{"a": 101, "b": 201}\n')
    parser.write('{"a": 102, "b": 202, "c": 302}\n')
    parser.write('{"a": 103, "b": 203, "c": 303')
    parser.write(', "d": 403}')
    parser.end()

    readToEnd(parser, (err, chunks) => {
      if (err) throw err

      assert.equal(chunks.length, 4, 'There should be four results')
      assert.deepEqual(chunks[2], {a: 102, b: 202, c: 302}, 'The third object should match the expected literal.')
      done()
    })
  })
})
