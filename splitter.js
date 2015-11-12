var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream_1 = require('stream');
function byteAdvancer(split_byte) {
    // just a closure around a generic byte read-loop
    return function (buffer) {
        var cursor = 0;
        for (var i = 0, l = buffer.length; i < l; i++) {
            if (buffer[i] === split_byte) {
                this._chunk(buffer.slice(cursor, i));
                cursor = i + 1;
            }
        }
        return buffer.slice(cursor);
    };
}
/**
A splitter stream rechunks a stream at every `split` byte, if `split` is defined.
If `split` is not defined, it will split at the universal newline (\r, \r\n, or \n).

_writableState.decodeStrings = true
_writableState.objectMode = false
_readableState.objectMode = true

Node.js 'stream' API calls _transform and _flush:
  _transform calls _advance:
    _advance calls _chunk (maybe multiple times)
      _chunk calls push()
  _flush calls _chunk, either once or not at all
    _chunk calls push()

*/
var Splitter = (function (_super) {
    __extends(Splitter, _super);
    function Splitter(options) {
        _super.call(this, options);
        this._buffer = new Buffer(0);
        this._encoding = null;
        // we set the readable side to objectMode, in any case, so that the
        // individual buffers we emit will not be fused to each other
        this['_readableState'].objectMode = true;
        if (options && options.split) {
            // if we are given a split string, use the byte code of the first character to split
            this._advance = byteAdvancer(options.split.charCodeAt(0));
        }
    }
    /** calling this will call toString on all emitted chunks, instead of
    returning buffers. */
    Splitter.prototype.setEncoding = function (encoding) {
        this._encoding = encoding;
        return this;
    };
    /** _chunk handles what we do to each split part */
    Splitter.prototype._chunk = function (buffer) {
        // assert Buffer.isBuffer(buffer)
        if (this._encoding !== null) {
            this.push(buffer.toString(this._encoding));
        }
        else {
            this.push(buffer);
        }
    };
    /** _advance handles how we decide where the split points are */
    Splitter.prototype._advance = function (buffer) {
        var cursor = 0;
        for (var i = 0, l = buffer.length; i < l; i++) {
            if (buffer[i] === 13 || buffer[i] === 10) {
                this._chunk(buffer.slice(cursor, i));
                if (buffer[i] === 13 && buffer[i + 1] === 10) {
                    i++;
                }
                cursor = i + 1;
            }
        }
        return buffer.slice(cursor);
    };
    /**
    `encoding` describes the type of `chunk` -- if the decodeStrings option is
    true, this will be useful; otherwise, `chunk` will be just a buffer, or if
    objectMode is true, it'll be an arbirary object, and `encoding` will just be
    'buffer'.
    */
    Splitter.prototype._transform = function (chunk, encoding, callback) {
        // assert encoding == 'buffer'
        var buffer = Buffer.concat([this._buffer, chunk]);
        this._buffer = this._advance(buffer);
        callback();
    };
    Splitter.prototype._flush = function (callback) {
        this._advance(this._buffer);
        if (this._buffer && this._buffer.length) {
            this._chunk(this._buffer);
        }
        callback();
    };
    return Splitter;
})(stream_1.Transform);
exports.Splitter = Splitter;
