/*jslint node: true */
var stream = require('stream');
var util = require('util');

var Batcher = module.exports = function(size) {
  stream.Transform.call(this, {objectMode: true});
  this._size = size;
  this._buffer = [];
};
util.inherits(Batcher, stream.Transform);
Batcher.prototype.checkFlush = function(end, callback) {
  // checkFlush is called by both _transform and _flush,
  // with different `end` values.
  if (this._buffer.length >= this._size || (this._buffer.length > 0 && end)) {
    // splice(index, number_to_remove, number_to_insert) returns the removed items
    var batch = this._buffer.splice(0, this._size);
    this.push(batch);
  }
  callback();
};
Batcher.prototype._transform = function(chunk, encoding, callback) {
  this._buffer.push(chunk);
  this.checkFlush(false, callback);
};
Batcher.prototype._flush = function(callback) {
  this.checkFlush(true, callback);
};
