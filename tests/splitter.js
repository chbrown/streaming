import assert from 'assert';
import {describe, it} from 'mocha';

import {readToEnd} from '../';
import {Splitter} from '../splitter';

describe('Splitter', () => {
  it('should split chunks covering multiple lines into a chunks of one line each', done => {
    var splitter = new Splitter();
    splitter.setEncoding('utf8');

    splitter.write('Andy\nBarb');
    splitter.write('ara\nCarson');
    splitter.write('\n');
    splitter.write('Destiny\nEdvard\nFinnigan\nGerry\nHod');
    splitter.write('g');
    splitter.write('son');
    splitter.write('\n');
    splitter.write('Ivory\nJenn');
    splitter.write('a');
    splitter.end();

    readToEnd(splitter, (err, chunks) => {
      if (err) throw err;

      assert.equal(chunks.length, 10, 'There should be 10 lines');
      assert.equal(chunks[7], 'Hodgson', 'The sixth line should be "Hodgson"');
      assert.equal(chunks[9], 'Jenna', 'The tenth line should be "Jenna"');
      done();
    });
  });
});
