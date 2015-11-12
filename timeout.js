var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream_1 = require('stream');
/**
Timeout is mostly a PassThrough (identity) stream, but will throw an error if
a period of `timeoutMilliseconds` elapses without seeing any new data.
*/
var Timeout = (function (_super) {
    __extends(Timeout, _super);
    function Timeout(timeoutSeconds, options) {
        var _this = this;
        _super.call(this, options);
        // if (timeoutSeconds === undefined) {
        //   throw new Error('new Timeout(timeoutSeconds): timeoutSeconds is a required parameter.');
        // }
        this.timeoutMilliseconds = timeoutSeconds * 1000;
        setInterval(function () { return _this._check(); }, this.timeoutMilliseconds);
    }
    Timeout.prototype._check = function () {
        // millisecondsSinceLast: milliseconds since we last saw some incoming data
        var millisecondsSinceLast = (new Date()).getTime() - this.lastChunkReceived;
        if (millisecondsSinceLast > this.timeoutMilliseconds) {
            this.emit('error', new Error("Timed out: " + millisecondsSinceLast + "ms"));
        }
    };
    Timeout.prototype._transform = function (chunk, encoding, callback) {
        this.lastChunkReceived = (new Date()).getTime();
        this.push(chunk);
        callback();
    };
    Timeout.prototype._flush = function (callback) {
        // don't clear the interval
        callback();
    };
    return Timeout;
})(stream_1.Transform);
exports.Timeout = Timeout;
