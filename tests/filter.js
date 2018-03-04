import assert from 'assert'
import {describe, it} from 'mocha'

import {readToEnd} from '../'
import {Filter} from '../filter'

describe('Filter', () => {
  it('should filter out people younger than 21', done => {
    var filter = new Filter(person => person.age >= 21)
    filter.write({name: 'R. J. Pratt', age: 51})
    filter.write({name: 'Lincoln Mills', age: 12})
    filter.write({name: 'Archer Pinkerton', age: 21})
    filter.write({name: 'Marty Keller', age: 40})
    filter.end()

    readToEnd(filter, (err, chunks) => {
      if (err) throw err

      assert.equal(chunks.length, 3, 'There should be three people who are at least 21')
      var lincolns = chunks.filter(person => person.name.match(/Lincoln/))
      assert.equal(lincolns.length, 0, 'There should be no people named "Lincoln" in the output')
      done()
    })
  })
})
