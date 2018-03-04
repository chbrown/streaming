import assert from 'assert'
import {describe, it} from 'mocha'

import {readToEnd} from '../'
import {Picker, Omitter} from '../property'

describe('property.Picker', () => {
  it('should remove not-whitelisted fields', done => {
    var picker = new Picker(['id', 'name'])
    picker.write({id: 4, name: 'Excursion', price: 54})
    picker.write({id: 5, fullName: 'Nightfall in Nebboleth'})
    picker.end()

    readToEnd(picker, (err, chunks) => {
      if (err) throw err

      assert.equal(chunks.length, 2, 'There should be two chunks in the result, just like the input.')
      assert.equal(chunks[0].price, undefined, 'The price should not be retained.')
      assert.equal(chunks[1].id, 5, 'The id should be retained.')
      done()
    })
  })
})

describe('property.Omitter', () => {
  it('should remove blacklisted fields', done => {
    var omitter = new Omitter(['price'])
    omitter.write({id: 4, name: 'Excursion', price: 54})
    omitter.write({id: 5, fullName: 'Nightfall in Nebboleth'})
    omitter.end()

    readToEnd(omitter, (err, chunks) => {
      if (err) throw err

      assert.equal(chunks.length, 2, 'There should be two chunks in the result, just like the input.')
      assert.equal(chunks[0].price, undefined, 'The price should be omitted.')
      assert.equal(chunks[0].id, 4, 'The id should be omitted.')
      assert.equal(chunks[1].fullName, 'Nightfall in Nebboleth', 'The fullName should be retained.')
      done()
    })
  })
})
