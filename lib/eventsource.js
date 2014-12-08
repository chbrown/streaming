/*jslint node: true */
var stream = require('stream');
var util = require('util');

var EventSource = module.exports = function(options) {
  /** EventSource is a subclass of stream.Transform for converting a stream of
  objects into `text/event-stream` style output.

  You should call `res.setHeader('Content-Type', 'text/event-stream');` on your
  HTTP response `res` before piping this EventSource stream into the response.

  And for this use-case, you'll want to listen for onerror on the client-side,
  and close() the EventSource object on the first error, otherwise it will try
  to reconnect immediately when the response stream closes. As far as I know,
  there is no special event you can send to trigger a complete stop.

  Documentation: http://www.w3.org/TR/eventsource/
  MDN is usually great, but their article on EventSource sucks:
    https://developer.mozilla.org/en-US/docs/Web/API/EventSource
  */
  stream.Transform.call(this, options);
};
util.inherits(EventSource, stream.Transform);
EventSource.prototype._transform = function(chunk, encoding, callback) {
  // encoding may be something weird like "buffer" if chunk is just a string
  callback(null, 'data: ' + chunk.toString() + '\n\n');
};