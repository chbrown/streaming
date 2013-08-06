'use strict'; /*jslint es5: true, node: true, indent: 2 */
var util = require('util');

var Splitter = require('./splitter');
// Splitter inherits from stream.Transform

var Stringifier = exports.Stringifier = function(replacer, space) {
  Splitter.call(this, {objectMode: false});
  this.replacer = replacer;
  this.space = space;
};
util.inherits(Stringifier, Splitter);
Stringifier.prototype._chunk = function(chunk, encoding) {
  if (encoding == 'buffer' || encoding === undefined) encoding = 'utf8';
  var line = Buffer.isBuffer(chunk) ? chunk.toString(encoding) : chunk;
  // TODO: check first if line is already an object?
  var obj = JSON.parse(line);
  this.push(JSON.stringify(obj, this.replacer, this.space) + '\n');
};

var Parser = exports.Parser = function() {
  Splitter.call(this, {objectMode: true});
};
util.inherits(Parser, Splitter);
Parser.prototype._chunk = function(chunk, encoding, callback) {
  encoding = encoding == 'buffer' ? 'utf8' : encoding;
  var line = Buffer.isBuffer(chunk) ? chunk.toString() : chunk;
  try {
    var obj = JSON.parse(line);
    this.push(obj);
  } catch (err) {
    this.emit('error', err);
  }
};
