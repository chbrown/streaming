var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream_1 = require('stream');
var os_1 = require('os');
/** A SyntaxError thrown by JSON.parse() might look like the following:

    name: 'SyntaxError'
    message: 'Unexpected token w'
    arguments: 'w'
    stack: <a stack trace>
    type: 'unexpected_token'
*/
var ParseError = (function (_super) {
    __extends(ParseError, _super);
    function ParseError(syntaxError, input) {
        _super.call(this, syntaxError.message + " when parsing \"" + input + "\"");
        this.syntaxError = syntaxError;
        this.name = 'ParseError';
        // Error.captureStackTrace(this, this.constructor); // or (this, arguments.callee);
    }
    return ParseError;
})(Error);
/** streaming.json.ArrayStringifier stringifies all written objects into a
single proper JSON array, surrounded by [ and ] delimiters, and separated by commas.

* `replacer` Function If a function, transforms values and properties
  encountered while stringifying; if an array, specifies the set of
  properties included in objects in the final string. Details on
  [MDN](https://developer.mozilla.org/En/Using_native_JSON#The_replacer_parameter).
* `space` Number | String Causes the resulting string to be pretty-printed
  (by some number of spaces or literal space).
*/
var ArrayStringifier = (function (_super) {
    __extends(ArrayStringifier, _super);
    function ArrayStringifier(replacer, space) {
        _super.call(this);
        this.replacer = replacer;
        this.space = space;
        this._seen_first_item = false;
        this['_writableState'].objectMode = true;
        this.push('[');
    }
    ArrayStringifier.prototype._transform = function (chunk, encoding, callback) {
        if (this._seen_first_item) {
            this.push(',' + JSON.stringify(chunk, this.replacer, this.space));
        }
        else {
            this.push(JSON.stringify(chunk, this.replacer, this.space));
            this._seen_first_item = true;
        }
        callback();
    };
    ArrayStringifier.prototype._flush = function (callback) {
        this.push(']');
        callback();
    };
    return ArrayStringifier;
})(stream_1.Transform);
exports.ArrayStringifier = ArrayStringifier;
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
var Stringifier = (function (_super) {
    __extends(Stringifier, _super);
    function Stringifier(replacer, space) {
        _super.call(this);
        this.replacer = replacer;
        this.space = space;
        this['_writableState'].objectMode = true;
    }
    Stringifier.prototype._transform = function (chunk, encoding, callback) {
        this.push(JSON.stringify(chunk, this.replacer, this.space) + os_1.EOL); // , 'utf8'
        callback();
    };
    return Stringifier;
})(stream_1.Transform);
exports.Stringifier = Stringifier;
/** streaming.json.Parser expects Buffer input with universal newlines
dividing JSON objects.
*/
var Parser = (function (_super) {
    __extends(Parser, _super);
    function Parser(replacer, space) {
        _super.call(this);
        this.replacer = replacer;
        this.space = space;
        this._buffer = new Buffer(0);
        this['_writableState'].objectMode = false; // buffer input
        this['_readableState'].objectMode = true; // object output
    }
    Parser.prototype._line = function (buffer) {
        // console.info('_line: %s', buffer);
        var obj;
        try {
            obj = JSON.parse(buffer);
        }
        catch (syntax_error) {
            var error = new ParseError(syntax_error, buffer.toString('utf8'));
            this.emit('error', error);
        }
        if (obj !== undefined) {
            // only push the parsed object along if it was parsed without error
            this.push(obj);
        }
    };
    Parser.prototype._process_buffer = function (eof) {
        /** _process_buffer finds the split points */
        var offset = 0;
        var cursor = offset;
        var length = this._buffer.length;
        while (cursor < length) {
            var prev = this._buffer[cursor - 1];
            var curr = this._buffer[cursor];
            var next = this._buffer[cursor + 1];
            var eol = (curr === 10) ||
                (prev === 13 && curr === 10) ||
                (curr === 13 && next !== 10 && next !== undefined) ||
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
    Parser.prototype._transform = function (chunk, encoding, callback) {
        this._buffer = Buffer.concat([this._buffer, chunk]);
        this._process_buffer(false);
        callback();
    };
    Parser.prototype._flush = function (callback) {
        this._process_buffer(true);
        callback();
    };
    return Parser;
})(stream_1.Transform);
exports.Parser = Parser;
