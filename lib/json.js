/*jslint node: true */
var os = require('os');
var util = require('util');
var stream = require('stream');

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

function ParseError(syntax_error, input) {
  /** A SyntaxError thrown by JSON.parse() might look like the following:

      name: 'SyntaxError'
      message: 'Unexpected token w'
      arguments: 'w'
      stack: <a stack trace>
      type: 'unexpected_token'
  */
  Error.call(this);
  this.name = this.constructor.name; // i.e., 'ParseError'
  this.syntax_error = syntax_error;
  Error.captureStackTrace(this, this.constructor); // or (this, arguments.callee);
  this.message = syntax_error.message + ' when parsing "' + input + '"';
}
util.inherits(ParseError, Error);

var Parser = exports.Parser = function() {
  /** streaming.json.Parser expects Buffer input with universal newlines
  dividing JSON objects.
  */
  stream.Transform.call(this);
  this._writableState.objectMode = false; // buffer input
  this._readableState.objectMode = true; // object output
  this._buffer = new Buffer(0);
};
util.inherits(Parser, stream.Transform);
Parser.prototype._line = function(buffer) {
  // console.info('_line: %s', buffer);
  var obj;
  try {
    obj = JSON.parse(buffer);
  } catch (syntax_error) {
    var error = new ParseError(syntax_error, buffer.toString('utf8'), -1);
    this.emit('error', error);
  }

  if (obj !== undefined) {
    // only push the parsed object along if it was parsed without error
    this.push(obj);
  }
};
Parser.prototype._process_buffer = function(eof) {
  /** _advance finds the split points */
  var offset = 0;
  var cursor = offset;
  var length = this._buffer.length;
  while (cursor < length) {
    var prev = this._buffer[cursor - 1];
    var curr = this._buffer[cursor];
    var next = this._buffer[cursor + 1];
    var eol = (curr === 10) || // '\n'
              (prev === 13 && curr === 10) || // '\r\n'
              (curr === 13 && next !== 10 && next !== undefined) || // '\r[^\n]'
              (eof && (cursor + 1) === length); // flush final line if eof is true

    cursor++;
    if (eol) {
      // include the full EOL marker in the line chunk
      this._line(this._buffer.slice(offset, cursor));
      offset = cursor;
    }
  }

  this._buffer = this._buffer.slice(offset);
};
Parser.prototype._transform = function(chunk, encoding, callback) {
  this._buffer = Buffer.concat([this._buffer, chunk]);
  this._process_buffer(false);
  callback();
};
Parser.prototype._flush = function(callback) {
  this._process_buffer(true);
  callback();
};
