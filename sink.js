var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream_1 = require('stream');
/**
Similar to piping to /dev/null at the command line.

This stream can be piped into, but it will never output anything. However, it
will end when the source stream ends.
*/
var Sink = (function (_super) {
    __extends(Sink, _super);
    function Sink(options) {
        _super.call(this, options);
    }
    Sink.prototype._transform = function (chunk, encoding, callback) {
        callback();
    };
    return Sink;
})(stream_1.Transform);
exports.Sink = Sink;
