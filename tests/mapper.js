import assert from 'assert';
import {describe, it} from 'mocha';

import {readToEnd} from '../';
import {Mapper} from '../mapper';

describe('Mapper', () => {
  it('should compute payments due to all workers', done => {
    var mapper = new Mapper(worker => worker.rate * worker.hours);
    mapper.write({rate: 50.0, hours: 10.0});
    mapper.write({rate: 22.5, hours: 5});
    mapper.write({rate: 75, hours: 100});
    mapper.end();

    readToEnd(mapper, (err, chunks) => {
      if (err) throw err;

      assert.deepEqual(chunks, [500, 112.5, 7500], 'The computed payments should equal expectations.');
      done();
    });
  });
});
