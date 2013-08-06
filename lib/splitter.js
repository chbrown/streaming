'use strict'; /*jslint es5: true, node: true, indent: 2 */
var stream = require('stream');
var util = require('util');

var Splitter = module.exports = function(split, opts) {
  /** Splitter rechunks a stream at every `split` byte.

  split defaults to "\n"
  */
  if (opts === undefined) opts = {};
  opts.decodeStrings = true;
  stream.Transform.call(this, opts);

  this.split_byte = (split || '\n').charCodeAt(0);
};
util.inherits(Splitter, stream.Transform);
Splitter.prototype._transform = function(chunk, encoding, callback) {
  // assert encoding == 'buffer'
  var buffer = (this._buffer && this._buffer.length) ? Buffer.concat([this._buffer, chunk]) : chunk;
  var start = 0;
  var end = buffer.length;
  for (var i = 0; i < end; i++) {
    if (buffer[i] === this.split_byte) {
      this._chunk(buffer.slice(start, i), encoding);
      start = i + 1;
    }
  }
  this._buffer = buffer.slice(start);
  callback();
};
Splitter.prototype._flush = function(callback) {
  if (this._buffer && this._buffer.length) {
    this._chunk(this._buffer);
  }
  callback();
};

// subclasses can override _chunk if needed
Splitter.prototype._chunk = function(chunk, encoding) {
  if (encoding == 'buffer' || encoding === undefined) encoding = 'utf8';
  this.push(Buffer.isBuffer(chunk) ? chunk.toString(encoding) : chunk);
};
