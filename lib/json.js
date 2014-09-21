/*jslint node: true */
var os = require('os');
var util = require('util');
var stream = require('stream');

var Splitter = require('./splitter');

var Stringifier = exports.Stringifier = function(replacer, space) {
  /** streaming.json.Stringifer expects objects and outputs strings / buffers

      _writableState.objectMode = true
      _readableState.objectMode = false

  * `replacer` Function If a function, transforms values and properties
    encountered while stringifying; if an array, specifies the set of
    properties included in objects in the final string. Details on
    [MDN](https://developer.mozilla.org/En/Using_native_JSON#The_replacer_parameter).
  * `space` Number | String Causes the resulting string to be pretty-printed
    (by some number of spaces or literal space).
  */
  stream.Transform.call(this);
  this._writableState.objectMode = true;

  this.replacer = replacer;
  this.space = space;
};
util.inherits(Stringifier, stream.Transform);
Stringifier.prototype._transform = function(chunk, encoding, callback) {
  this.push(JSON.stringify(chunk, this.replacer, this.space) + os.EOL); // , 'utf8'
  callback();
};

var Parser = exports.Parser = function() {
  /** streaming.json.Parser expects Buffer input with universal newlines
  dividing JSON objects.
  */
  Splitter.call(this);
  this.setEncoding('utf8');
};
util.inherits(Parser, Splitter);
Parser.prototype._chunk = function(buffer) {
  var chunk = buffer.toString(this._encoding);
  try {
    var obj = JSON.parse(chunk);
    this.push(obj);
  } catch (err) {
    this.emit('error', err);
  }
};
