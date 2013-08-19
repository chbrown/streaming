'use strict'; /*jslint es5: true, node: true, indent: 2 */
var stream = require('stream');
var util = require('util');

var helpers = require('./helpers');

var byte_advancer = function(split_byte) {
  return function(buffer) {
    var cursor = 0;
    for (var i = 0, l = buffer.length; i < l; i++) {
      if (buffer[i] === split_byte) {
        this._chunk(buffer.slice(cursor, i));
        cursor = i + 1;
      }
    }
    return buffer.slice(cursor);
  };
};

var Splitter = module.exports = function(split, opts) {
  /** Class: streaming.Splitter([split], [opts])

  A splitter stream rechunks a stream at every `split` byte, if `split` is defined.
  If `split` is not defined, it will split at the universal newline (\r, \r\n, or \n).

  _writableState.decodeStrings = true
  _writableState.objectMode = false
  _readableState.objectMode = true

  Node.js 'stream' API calls _transform and _flush:
    _transform calls _advance:
      _advance calls _chunk:
        _chunk calls back to stream API .push()
    _flush calls _chunk:
      _chunk calls back to stream API .push()


  */
  if (opts === undefined && helpers.typeName(split) !== 'string') {
    // using the `new streaming.Splitter(opts)` overload
    opts = split;
    split = undefined;
  }
  else if (split) {
    // if we are given a split string, use the byte code of the first character to split
    this._advance = byte_advancer(split.charCodeAt(0));
  }

  stream.Transform.call(this, opts);
  this._readableState.objectMode = true;
};
util.inherits(Splitter, stream.Transform);


Splitter.prototype._chunk = function(buffer) {
  /** _chunk handles what we do to each split part */
  // assert Buffer.isBuffer(chunk)
  var chunk = buffer.toString(this._encoding);
  this.push(chunk);
};

Splitter.prototype._advance = function(buffer) {
  /** _advance handles how we decide where the split points are */
  var cursor = 0;
  for (var i = 0, l = buffer.length; i < l; i++) {
    if (buffer[i] === 13 || buffer[i] === 10) {
      this._chunk(buffer.slice(cursor, i));
      if (buffer[i] === 13 && buffer[i + 1] === 10) { // '\r\n'
        i++;
      }
      cursor = i + 1;
    }
  }
  return buffer.slice(cursor);
};

Splitter.prototype._transform = function(chunk, encoding, callback) {
  // assert encoding == 'buffer'
  var buffer = (this._buffer && this._buffer.length) ? Buffer.concat([this._buffer, chunk]) : chunk;
  this._encoding = (encoding == 'buffer' || encoding === undefined) ? 'utf8' : encoding;
  this._buffer = this._advance(buffer);
  callback();
};

Splitter.prototype._flush = function(callback) {
  this._advance(this._buffer);
  if (this._buffer && this._buffer.length) {
    this._chunk(this._buffer);
  }
  callback();
};
