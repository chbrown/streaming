var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream_1 = require('stream');
var __null = {
    toJSON: function () { return null; },
    valueOf: function () { return null; },
};
/**
Mapper transforms a stream of <T> into a stream of <R>, using a synchronous
transform function.

Use Transformer() instead if you need an asynchronous callback function.
*/
var Mapper = (function (_super) {
    __extends(Mapper, _super);
    function Mapper(transformFn) {
        _super.call(this, { objectMode: true });
        this.transformFn = transformFn;
        this.transformFn = transformFn.bind(this);
    }
    Mapper.prototype._transform = function (chunk, encoding, callback) {
        var result = this.transformFn(chunk);
        if (result === null) {
            // We have to wrap pure JS nulls, because `push(null)` means EOF to streams.
            // It's kind of a hack, but it works nicely when we JSON.stringify downstream.
            this.push(__null);
        }
        else if (result !== undefined) {
            this.push(result);
        }
        // otherwise skip it; undefined denotes no output
        callback();
    };
    return Mapper;
})(stream_1.Transform);
exports.Mapper = Mapper;
