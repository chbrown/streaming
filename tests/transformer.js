import assert from 'assert';
import {describe, it} from 'mocha';

import {readToEnd} from '../';
import {Transformer} from '../transformer';

describe('Transformer', () => {
  it('should compute payments due to all workers', done => {
    var transformer = new Transformer((chunk, encoding, callback) => {
      setTimeout(() => {
        callback(null, (chunk.rate * chunk.hours));
      }, 10);
    }, {objectMode: true});
    transformer.write({rate: 50.0, hours: 10.0});
    transformer.write({rate: 22.5, hours: 5});
    transformer.write({rate: 75, hours: 100});
    transformer.end();

    readToEnd(transformer, (err, chunks) => {
      if (err) throw err;

      assert.deepEqual(chunks, [500, 112.5, 7500], 'The computed payments should equal expectations.');
      done();
    });
  });
});
