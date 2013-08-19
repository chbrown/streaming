'use strict'; /*jslint es5: true, node: true, indent: 2 */
var stream = require('stream');
var util = require('util');

var Mapper = module.exports = function(mapper) {
  stream.Transform.call(this, {objectMode: true});
  this.mapper = mapper;
};
util.inherits(Mapper, stream.Transform);
Mapper.prototype._transform = function(chunk, encoding, callback) {
  var result = this.mapper(chunk);
  this.push(result);
  callback();
};
Mapper.prototype._flush = function(callback) {
  callback();
};
