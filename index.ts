// import {Readable} from 'stream';
// exports.Batcher = require('./batcher');
// exports.EventSource = require('./eventsource');
// exports.Filter = require('./filter');
// exports.json = require('./json'); // for json.Parser and json.Stringifier
// exports.Mapper = require('./mapper');
// exports.property = require('./property'); // for property.Filter and property.Omitter
// exports.Queue = require('./queue');
// exports.Sink = require('./sink');
// exports.Splitter = require('./splitter');
// exports.Timeout = require('./timeout');
// exports.Transformer = require('./transformer');
// exports.Walk = require('./walk');
// exports.VM = require('./vm');

/** Read a stream to the end, storing all chunks in an array.

For example, to read all STDIN:

    streaming.readToEnd(process.stdin, function(err, chunks) {
      if (err) throw err;
      var input = chunks.join('');
      console.log('Got input of length: ' + input.length);
    });

*/
export function readToEnd(stream: NodeJS.ReadableStream,
                          callback: (error: Error, chunks?: any[]) => void) {
  var chunks = [];
  return stream
  .on('error', callback)
  .on('data', chunk => chunks.push(chunk))
  .on('end', () => callback(null, chunks));
}
