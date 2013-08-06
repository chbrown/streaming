'use strict'; /*jslint es5: true, node: true, indent: 2 */
var stream = require('stream');
var util = require('util');

var Line = module.exports = function() {
  stream.Transform.call(this, {decodeStrings: true});
  this._writableState.objectMode = false;
  this._readableState.objectMode = true;
};
util.inherits(Line, stream.Transform);
Line.prototype._chunk = function(buffer, encoding) {
  if (encoding == 'buffer' || encoding === undefined) encoding = 'utf8';
  var chunk = buffer.toString(encoding);
  this.push(chunk);
};
Line.prototype._transform = function(chunk, encoding, callback) {
  // assert encoding == 'buffer'
  var buffer = (this._buffer && this._buffer.length) ? Buffer.concat([this._buffer, chunk]) : chunk;
  var start = 0;
  var end = buffer.length;
  for (var i = 0; i < end; i++) {
    if (buffer[i] === 13 || buffer[i] === 10) {
      this._chunk(buffer.slice(start, i), encoding);
      if (buffer[i] === 13 && buffer[i + 1] === 10) { // '\r\n'
        i++;
      }
      start = i + 1;
    }
  }
  this._buffer = buffer.slice(start);
  callback();
};
Line.prototype._flush = function(callback) {
  if (this._buffer && this._buffer.length) {
    this._chunk(this._buffer);
  }
  callback();
};
