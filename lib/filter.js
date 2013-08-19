'use strict'; /*jslint es5: true, node: true, indent: 2 */
var stream = require('stream');
var util = require('util');

var ObjectFilter = module.exports = function(fields) {
  // objects in, objects out
  stream.Transform.call(this, {objectMode: true});
  this._fields = fields;
  this._fields_length = fields.length;
};
util.inherits(ObjectFilter, stream.Transform);
ObjectFilter.prototype._transform = function(chunk, encoding, callback) {
  var filtered = {};
  for (var i = 0; i < this._fields_length; i++) {
    filtered[this._fields[i]] = chunk[this._fields[i]];
  }
  this.push(filtered, encoding);
  callback();
};
