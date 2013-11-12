'use strict'; /*jslint es5: true, node: true, indent: 2 */
var stream = require('stream');
var util = require('util');

var Filter = module.exports = function(predicate) {
  stream.Transform.call(this, {objectMode: true});
  this.predicate = predicate;
};
util.inherits(Filter, stream.Transform);
Filter.prototype._transform = function(chunk, encoding, callback) {
  var success = this.predicate(chunk);
  if (success) {
    this.push(chunk, encoding);
  }
  callback();
};
