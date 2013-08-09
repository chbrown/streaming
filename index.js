'use strict'; /*jslint es5: true, node: true, indent: 2 */

exports.Glob = require('./lib/glob');
exports.json = require('./lib/json'); // for json.Parser and json.Stringifier
exports.Line = require('./lib/line');
exports.Mapper = require('./lib/mapper');
exports.Queue = require('./lib/queue');
exports.Splitter = require('./lib/splitter');
exports.Timeout = require('./lib/timeout');

exports.readToEnd = function(stream, callback) {
  /** Read a stream to the end, buffering all chunks into an array.

  * `callback` Function Callback function with signature: function(err, [chunk_01, chunk_02, ...])

  For example, to read all STDIN:

      streaming.readToEnd(sys.stdin, function(err, chunks) {
        if (err) throw err;

        var input = chunks.join('');
        console.log('Got input of length: ' + input.length);
      });

  */
  var chunks = [];
  return stream
    .on('error', callback)
    .on('data', function(chunk) {
      chunks.push(chunk);
    })
    .on('end', function() {
      callback(null, chunks);
    });
};
