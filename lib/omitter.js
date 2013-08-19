'use strict'; /*jslint es5: true, node: true, indent: 2 */
var stream = require('stream');
var util = require('util');

var ObjectOmitter = module.exports = function(fields) {
  // objects in, objects out
  stream.Transform.call(this, {objectMode: true});
  this.fields = {};
  for (var i = 0, l = fields.length; i < l; i++) {
    this.fields[fields[i]] = 1;
  }
};
util.inherits(ObjectOmitter, stream.Transform);
ObjectOmitter.prototype._transform = function(chunk, encoding, callback) {
  for (var field in this.fields) {
    delete chunk[field];
  }
  this.push(chunk, encoding);
  callback();
};
