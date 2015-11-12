var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream_1 = require('stream');
/**
Batcher transforms a stream of <T> into a stream of Array<T>, where each array
has at most `size` elements (the last chunk may have fewer, but more than 0).
*/
var Batcher = (function (_super) {
    __extends(Batcher, _super);
    function Batcher(batchSize) {
        _super.call(this, { objectMode: true });
        this.batchSize = batchSize;
        this.batchBuffer = [];
    }
    /**
    checkFlush is called by both _transform and _flush, with different `end` values.
    */
    Batcher.prototype.checkFlush = function (end, callback) {
        if (this.batchBuffer.length >= this.batchSize || (this.batchBuffer.length > 0 && end)) {
            // splice(index, number_to_remove, number_to_insert) returns the removed items
            var batch = this.batchBuffer.splice(0, this.batchSize);
            this.push(batch);
        }
        callback();
    };
    Batcher.prototype._transform = function (chunk, encoding, callback) {
        this.batchBuffer.push(chunk);
        this.checkFlush(false, callback);
    };
    Batcher.prototype._flush = function (callback) {
        this.checkFlush(true, callback);
    };
    return Batcher;
})(stream_1.Transform);
exports.Batcher = Batcher;
