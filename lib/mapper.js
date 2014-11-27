/*jslint node: true */
var stream = require('stream');
var util = require('util');

var __null = { toJSON: function() { return null; }, valueOf: function() { return null; } };

var Mapper = module.exports = function(func) {
  stream.Transform.call(this, {objectMode: true});
  this.func = func;
};
util.inherits(Mapper, stream.Transform);
Mapper.prototype._transform = function(chunk, encoding, callback) {
  var result = this.func(chunk);
  if (result === null) {
    // We have to wrap pure JS nulls, because `push(null)` means EOF to streams.
    // It's kind of a hack, but it works nicely when we JSON.stringify downstream.
    this.push(__null);
  }
  else if (result !== undefined) {
    this.push(result);
  }
  // otherwise skip it; undefined denotes no output
  callback();
};
