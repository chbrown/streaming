/*jslint node: true */

exports.Batcher = require('./lib/batcher');
exports.Filter = require('./lib/filter');
exports.Glob = require('./lib/glob');
exports.json = require('./lib/json'); // for json.Parser and json.Stringifier
exports.Mapper = require('./lib/mapper');
exports.property = require('./lib/property'); // for property.Filter and property.Omitter
exports.Queue = require('./lib/queue');
exports.Splitter = require('./lib/splitter');
exports.Timeout = require('./lib/timeout');
exports.Walk = require('./lib/walk');

exports.readToEnd = function(stream, callback) {
  /** Read a stream to the end, buffering all chunks into an array.

  * `callback` Function Callback function with signature: function(err, [chunk_01, chunk_02, ...])

  For example, to read all STDIN:

      streaming.readToEnd(process.stdin, function(err, chunks) {
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
