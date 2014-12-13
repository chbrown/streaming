/*jslint node: true */
var util = require('util');
var stream = require('stream');

var Sink = module.exports = function(options) {
  /** Like /dev/null, piping to this stream outputs nothing, but it does end when the source stream ends.
  */
  stream.Transform.call(this, options);
};
util.inherits(Sink, stream.Transform);
Sink.prototype._transform = function(chunk, encoding, callback) {
  callback();
};
