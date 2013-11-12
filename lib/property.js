'use strict'; /*jslint es5: true, node: true, indent: 2 */
var stream = require('stream');
var util = require('util');

var PropertyFilter = module.exports = function(fields) {
  // objects in, objects out
  stream.Transform.call(this, {objectMode: true});
  this._fields = fields;
  this._fields_length = fields.length;
};
util.inherits(PropertyFilter, stream.Transform);
PropertyFilter.prototype._transform = function(chunk, encoding, callback) {
  var filtered = {};
  for (var i = 0; i < this._fields_length; i++) {
    filtered[this._fields[i]] = chunk[this._fields[i]];
  }
  this.push(filtered, encoding);
  callback();
};


var PropertyOmitter = module.exports = function(fields) {
  // objects in, objects out
  stream.Transform.call(this, {objectMode: true});
  this._fields = {};
  for (var i = 0, l = fields.length; i < l; i++) {
    this._fields[fields[i]] = 1;
  }
};
util.inherits(PropertyOmitter, stream.Transform);
PropertyOmitter.prototype._transform = function(chunk, encoding, callback) {
  for (var field in this._fields) {
    delete chunk[field];
  }
  this.push(chunk, encoding);
  callback();
};
